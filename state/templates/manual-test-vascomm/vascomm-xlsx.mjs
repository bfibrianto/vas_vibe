#!/usr/bin/env node
// vascomm-xlsx.mjs
// Local (.xlsx) writer for the /manual-test-vascomm workflow. Google Drive mode
// writes the same layout through the Sheets/Drive connectors; this script is
// the offline fallback and also (re)builds the blank template.
//
// Usage:
//   node vascomm-xlsx.mjs build-template <out.xlsx>
//   node vascomm-xlsx.mjs round --template <template.xlsx> --out <report.xlsx> --data <round.json> [--force]
//
// Requires `exceljs`, resolved from the current working directory, e.g.:
//   npm install --no-save --prefix tests/manual-test-vascomm exceljs@4.4.0
//   (cd tests/manual-test-vascomm && node ../../state/templates/manual-test-vascomm/vascomm-xlsx.mjs ...)
//
// round.json schema: see round.example.json next to this script.

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(path.join(process.cwd(), 'package.json'));
let ExcelJS;
try {
  ExcelJS = require('exceljs');
} catch {
  console.error('exceljs not found from ' + process.cwd() + '. Install it: npm install --no-save exceljs@4.4.0');
  process.exit(2);
}

// ---------------------------------------------------------------------------
// Layout constants — keep in sync with agent/workflows/manual-tester-vascomm.md
// ---------------------------------------------------------------------------
export const TC_TEMPLATE = 'TC Template';
export const SUMMARY = 'Summary';
export const DEFECTS = 'Defect List';
export const LEGEND = 'Keterangan status defect list';
const TC_FIRST_ROW = 10;
const TC_LAST_ROW = 2000;
const SUMMARY_ROUND_FIRST_ROW = 15;
const DEFECT_EXAMPLE_ID = 'DEF-0';

// Colors taken from the original Vascomm test case workbook.
const C = {
  navy: 'FF073763', navy2: 'FF1F4E79', blue: 'FF0B5394', blue2: 'FF3D85C6', defHead: 'FF1C4587',
  pale: 'FFD9E2F3', white: 'FFFFFFFF', grey: 'FFD9D9D9', link: 'FF1155CC', textBlue: 'FF2F5496',
  pass: 'FF6AA84F', fail: 'FFE06666', pending: 'FFFFD966',
};
const DEFECT_STATUS_COLORS = {
  New: 'FFFFFFFF', Assigned: 'FFA4C2F4', Open: 'FFFFE599', Fixed: 'FFFFFF00',
  Closed: 'FF93C47D', Reopened: 'FFE06666', Deffered: 'FFC27BA0', Rejected: 'FFB4A7D6',
};
const thin = { style: 'thin', color: { argb: 'FF000000' } };
const BORDER = { top: thin, left: thin, bottom: thin, right: thin };
const fill = (argb) => ({ type: 'pattern', pattern: 'solid', fgColor: { argb } });
const font = (o = {}) => ({ name: 'Calibri', size: 11, ...o });
const headStyle = (argb) => ({
  fill: fill(argb), font: font({ bold: true, color: { argb: C.white } }), border: BORDER,
  alignment: { horizontal: 'center', vertical: 'middle', wrapText: true },
});
const bodyStyle = { font: font(), border: BORDER, alignment: { vertical: 'top', wrapText: true } };
const linkStyle = { font: font({ underline: true, color: { argb: C.link } }), border: BORDER, alignment: { horizontal: 'center', vertical: 'top', wrapText: true } };

function style(cell, s) {
  for (const [k, v] of Object.entries(s)) cell[k] = JSON.parse(JSON.stringify(v));
}

// ---------------------------------------------------------------------------
// Template builder
// ---------------------------------------------------------------------------
const TC_HEADERS = ['TC ID', 'Feature', 'Test Case Description', 'Pre-condition', 'Test Case Procedure', 'Expected Output',
  'Created at', 'Created by', 'Actual Result', 'Test Result', 'Screenshot', 'Executed at', 'Executed by', 'Note'];
const TC_WIDTHS = [2.4, 9.75, 22, 36, 28, 36, 36, 12, 12, 36, 12, 16, 15, 14, 32];
// Columns that hold one value per test case and are merged vertically over its steps.
const TC_MERGE_COLS = ['B', 'C', 'D', 'E', 'H', 'I', 'K', 'L', 'M', 'N', 'O'];

const DEFECT_HEADERS = ['Defect ID', 'TC ID', 'Platform', 'Feature', 'Issue Created at', 'Issue Description', 'Capture (Link/Image)',
  'Level Error', 'Assign to \n(Frontend Web/Core/Mobile)', 'Dev PIC', 'Estimated Fixing\n(Hour)', 'Status', 'QA PIC', 'Tested at', 'Comment'];
const DEFECT_WIDTHS = [11, 10, 16.5, 22, 14, 50, 16, 11, 18, 14, 12, 12, 14, 16, 50];

function buildTcSheet(wb, name) {
  const ws = wb.addWorksheet(name, { views: [{ state: 'frozen', xSplit: 4, ySplit: 9 }] });
  ws.columns = TC_WIDTHS.map((width) => ({ width }));
  const title = ws.getCell('D2');
  title.value = 'TEST CASE';
  title.font = font({ bold: true, size: 24 });
  ws.getRow(2).height = 34;

  const label = (addr, text, argb, color = C.white) => {
    const c = ws.getCell(addr);
    c.value = text;
    style(c, { fill: fill(argb), font: font({ bold: true, color: { argb: color } }), border: BORDER, alignment: { vertical: 'middle', wrapText: true } });
  };
  const value = (addr, v, numFmt) => {
    const c = ws.getCell(addr);
    c.value = v;
    style(c, { fill: fill(C.white), font: font(), border: BORDER, alignment: { horizontal: 'right', vertical: 'middle' } });
    if (numFmt) c.numFmt = numFmt;
  };

  label('D4', 'Project Name', C.navy);
  ws.mergeCells('E4:G4');
  ws.getCell('E4').value = ': <Nama Project>';
  style(ws.getCell('E4'), { fill: fill(C.navy), font: font({ color: { argb: C.white } }), border: BORDER, alignment: { vertical: 'middle' } });

  const rng = `K${TC_FIRST_ROW}:K${TC_LAST_ROW}`;
  label('D5', 'Pass', C.pass, 'FF000000');
  value('E5', { formula: `COUNTIF(${rng},"Pass")` });
  label('F5', 'Pending', C.pending, 'FF000000');
  value('G5', { formula: `COUNTIF(${rng},"Pending")` });
  label('D6', 'Fail', C.fail, 'FF000000');
  value('E6', { formula: `COUNTIF(${rng},"Fail")` });
  label('F6', 'Number of test case', C.white, 'FF000000');
  value('G6', { formula: `COUNTIF(B${TC_FIRST_ROW}:B${TC_LAST_ROW},"TC*")` });

  label('D7', 'Test Phase / Round', C.navy2);
  ws.mergeCells('E7:G7');
  ws.getCell('E7').value = ': <UAT> — Round <1>';
  label('D8', 'Period / Environment', C.navy2);
  ws.mergeCells('E8:G8');
  ws.getCell('E8').value = ': <YYYY-MM-DD> s/d <YYYY-MM-DD> | <URL / build>';
  for (const a of ['E7', 'E8']) style(ws.getCell(a), { fill: fill(C.pale), font: font(), border: BORDER, alignment: { vertical: 'middle' } });

  const head = ws.getRow(9);
  TC_HEADERS.forEach((h, i) => {
    const c = head.getCell(i + 2);
    c.value = h;
    style(c, headStyle(C.navy));
  });
  head.height = 30;

  ws.dataValidations.add(rng, { type: 'list', allowBlank: true, formulae: ['"Pass,Fail,Pending"'] });
  // Expression rules, not cellIs: Google Sheets converts a cellIs-equal rule on
  // text into NUMBER_EQ, which never matches "Pass".
  ws.addConditionalFormatting({
    ref: rng,
    rules: [['Pass', C.pass], ['Fail', C.fail], ['Pending', C.pending]].map(([t, argb], i) => ({
      type: 'expression', formulae: [`K${TC_FIRST_ROW}="${t}"`], priority: i + 1,
      style: { fill: { type: 'pattern', pattern: 'solid', bgColor: { argb } } },
    })),
  });
  return ws;
}

function buildSummarySheet(wb) {
  const ws = wb.addWorksheet(SUMMARY);
  ws.columns = [1.4, 16, 14, 12, 12, 12, 12, 12, 12, 12, 13, 13, 13].map((width) => ({ width }));
  const t = ws.getCell('D2');
  t.value = 'Summary Report';
  t.font = font({ bold: true, size: 24 });
  ws.getRow(2).height = 34;

  ws.getCell('D4').value = 'Project Name';
  style(ws.getCell('D4'), { fill: fill(C.navy), font: font({ bold: true, color: { argb: C.white } }), border: BORDER });
  ws.mergeCells('E4:H4');
  ws.getCell('E4').value = ': <Nama Project>';
  style(ws.getCell('E4'), { fill: fill(C.navy), font: font({ color: { argb: C.white } }), border: BORDER });

  const navyHead = { fill: fill(C.navy2), font: font({ bold: true, size: 12, color: { argb: C.white } }), border: BORDER, alignment: { horizontal: 'center', wrapText: true } };
  ws.mergeCells('D5:E5'); ws.getCell('D5').value = 'ORIGINAL';
  ws.mergeCells('F5:H5'); ws.getCell('F5').value = 'REVISED';
  ['Start', 'End', 'Start', 'End', 'Description'].forEach((h, i) => { ws.getRow(6).getCell(4 + i).value = h; });
  for (const a of ['D5', 'F5', 'D6', 'E6', 'F6', 'G6', 'H6']) style(ws.getCell(a), navyHead);
  ['-', '-', '-', '-', ''].forEach((v, i) => {
    const c = ws.getRow(7).getCell(4 + i);
    c.value = v;
    style(c, { fill: fill(C.pale), font: font({ bold: true, size: 12 }), border: BORDER, alignment: { horizontal: 'center' } });
  });

  // Defect summary (fixed position so round rows can grow below it).
  ws.mergeCells('B9:B10'); ws.getCell('B9').value = 'Total Defect';
  ws.mergeCells('C9:L9'); ws.getCell('C9').value = 'Defect Result';
  const statuses = ['New', 'Assigned', 'Open', 'Fixed', 'Closed', 'Reopened', 'Rejected', 'Deffered'];
  [...statuses, 'Execution Defect Rate', 'Closed Rate'].forEach((h, i) => { ws.getRow(10).getCell(3 + i).value = h; });
  for (let col = 2; col <= 12; col++) { style(ws.getRow(9).getCell(col), headStyle(C.blue2)); style(ws.getRow(10).getCell(col), headStyle(C.blue2)); }
  const dRange = (col) => `'${DEFECTS}'!${col}2:${col}${TC_LAST_ROW}`;
  const r11 = ws.getRow(11);
  r11.getCell(2).value = { formula: `COUNTIF(${dRange('A')},"DEF-*")-COUNTIF(${dRange('A')},"${DEFECT_EXAMPLE_ID}")` };
  statuses.forEach((s, i) => { r11.getCell(3 + i).value = { formula: `COUNTIF(${dRange('L')},"${s}")` }; });
  r11.getCell(11).value = { formula: 'IF(B11=0,0,SUM(E11:J11)/B11)' };
  r11.getCell(12).value = { formula: 'IF(B11=0,0,G11/B11)' };
  for (let col = 2; col <= 12; col++) {
    style(r11.getCell(col), { fill: fill(col === 2 ? C.white : C.pale), font: font({ bold: true, color: { argb: col === 2 ? C.textBlue : 'FF000000' } }), border: BORDER, alignment: { horizontal: 'center' } });
    r11.getCell(col).numFmt = col >= 11 ? '0.00%' : '0';
  }

  // Test result per round — one row per round sheet, formulas resolve by sheet name.
  ws.getCell('B13').value = 'Test Result per Round';
  ws.getCell('B13').font = font({ bold: true, size: 13 });
  const roundHeaders = ['Sheet (Round)', 'Test Phase', 'Round', 'Start', 'End', "Total TC's", "Executed TC's", 'Passed', 'Failed', 'Pending', 'Execution Rate (%)', 'Pass Rate (%)'];
  roundHeaders.forEach((h, i) => style(Object.assign(ws.getRow(14).getCell(2 + i), { value: h }), headStyle(C.blue)));
  ws.getRow(14).height = 30;
  writeSummaryRound(ws, SUMMARY_ROUND_FIRST_ROW, { sheetName: TC_TEMPLATE, phase: '<contoh>', round: 0 });
  return ws;
}

function writeSummaryRound(ws, row, { sheetName, phase, round, startDate, endDate }) {
  const r = ws.getRow(row);
  const ind = (col) => `INDIRECT("'"&$B${row}&"'!${col}${TC_FIRST_ROW}:${col}${TC_LAST_ROW}")`;
  const vals = [
    sheetName, phase, round, toDate(startDate) ?? '', toDate(endDate) ?? '',
    { formula: `COUNTIF(${ind('B')},"TC*")` },
    { formula: `I${row}+J${row}+K${row}` },
    { formula: `COUNTIF(${ind('K')},"Pass")` },
    { formula: `COUNTIF(${ind('K')},"Fail")` },
    { formula: `COUNTIF(${ind('K')},"Pending")` },
    { formula: `IF(G${row}=0,0,H${row}/G${row})` },
    { formula: `IF(G${row}=0,0,I${row}/G${row})` },
  ];
  vals.forEach((v, i) => {
    const c = r.getCell(2 + i);
    c.value = v;
    style(c, { fill: fill(i < 3 ? C.white : C.pale), font: font({ bold: i >= 5, color: { argb: i === 0 ? C.textBlue : 'FF000000' } }), border: BORDER, alignment: { horizontal: 'center', vertical: 'middle' } });
    if (i === 3 || i === 4) c.numFmt = 'dd/mm/yyyy';
    if (i >= 5 && i <= 9) c.numFmt = '0';
    if (i >= 10) c.numFmt = '0.00%';
  });
}

function buildDefectSheet(wb) {
  const ws = wb.addWorksheet(DEFECTS, { views: [{ state: 'frozen', ySplit: 1 }] });
  ws.columns = DEFECT_WIDTHS.map((width) => ({ width }));
  DEFECT_HEADERS.forEach((h, i) => style(Object.assign(ws.getRow(1).getCell(i + 1), { value: h }), headStyle(C.defHead)));
  ws.getRow(1).height = 32;
  ws.autoFilter = 'A1:O1';
  addDefectValidations(ws);
  ws.addConditionalFormatting({
    ref: `A2:O${TC_LAST_ROW}`,
    rules: Object.entries(DEFECT_STATUS_COLORS).map(([s, argb], i) => ({
      type: 'expression', formulae: [`$L2="${s}"`], priority: i + 1,
      style: { fill: { type: 'pattern', pattern: 'solid', bgColor: { argb } } },
    })),
  });
  writeDefectRow(ws, 2, {
    id: DEFECT_EXAMPLE_ID, tcId: 'TC2', platform: 'Web', feature: '<contoh — baris ini dihapus otomatis>',
    createdAt: '2026-01-01', description: 'Expected: <...>\nActual: <...>', capture: { label: 'Screenshot', link: 'https://drive.google.com/file/d/<FILE_ID>/view' },
    level: 'Major', status: 'New', qaPic: '<QA / Manual Tester Agent>', comment: 'Found: UAT-R1',
  });
  return ws;
}

function addDefectValidations(ws) {
  // Reset first: exceljs re-splits ranges it read back, producing overlapping
  // validations that Excel flags for repair.
  ws.dataValidations.model = {};
  ws.dataValidations.add(`H2:H${TC_LAST_ROW}`, { type: 'list', allowBlank: true, formulae: ['"Major,Minor"'] });
  ws.dataValidations.add(`L2:L${TC_LAST_ROW}`, { type: 'list', allowBlank: true, formulae: [`"${Object.keys(DEFECT_STATUS_COLORS).join(',')}"`] });
}

function writeDefectRow(ws, row, d) {
  const r = ws.getRow(row);
  const cols = { id: 1, tcId: 2, platform: 3, feature: 4, createdAt: 5, description: 6, capture: 7, level: 8, assignTo: 9, devPic: 10, estimate: 11, status: 12, qaPic: 13, testedAt: 14, comment: 15 };
  for (let col = 1; col <= 15; col++) style(r.getCell(col), bodyStyle);
  for (const [k, col] of Object.entries(cols)) {
    if (d[k] === undefined) continue;
    const c = r.getCell(col);
    if (k === 'capture') {
      setLink(c, d.capture);
    } else if (k === 'createdAt' || k === 'testedAt') {
      c.value = toDate(d[k]) ?? d[k];
      c.numFmt = 'dd/mm/yyyy hh:mm';
    } else {
      c.value = d[k];
    }
  }
}

function buildLegendSheet(wb) {
  const ws = wb.addWorksheet(LEGEND);
  ws.columns = [{ width: 3 }, { width: 13 }, { width: 22 }, { width: 70 }, { width: 14 }];
  const rows = [
    ['New', null, 'Temuan baru yang dicatat oleh team QA pada spreadsheet temuan.', 'Team QA'],
    ['Assigned', null, 'Menetapkan temuan ke developer dan belum dianalisa oleh developer.', 'Team QA'],
    ['Open', null, 'Temuan yang mulai dianalisa dan dikerjakan oleh developer.', 'Developer'],
    ['Fixed', null, 'Temuan yang telah di-fixing oleh developer dan siap untuk dites ulang oleh team QA.', 'Developer'],
    ['Closed', null, 'Temuan yang telah dites ulang dan sudah sesuai dengan requirement.', 'Team QA'],
    ['Reopened', null, 'Temuan yang telah dites ulang dan belum sesuai dengan requirement sehingga harus di-fixing kembali oleh developer', 'Team QA'],
    ['Deferred', null, 'Temuan yang dapat di-fixing pada fase berikutnya. Untuk status tersebut harus disertakan alasan. Misal:', 'Team QA'],
    ['Deferred', null, '-  Prioritas temuan “Low”, waktu untuk fixing terbatas, dan temuan tidak mengganggu sistem jika tidak di-fixing.', 'Team QA'],
    ['Rejected', 'Duplicate', 'Temuan sudah pernah dicatat atau konsep temuan sama.', 'Developer'],
    ['Rejected', 'Need more information', 'Jika developer tidak/ kurang mengetahui mengenai temuan yang dicatat oleh team QA, developer dapat mengubah status menjadi “Need more information” dan team QA dapat menjelaskan mengenai maksud dari temuan yang dituliskan tersebut.', 'Developer'],
  ];
  ws.getCell('B2').value = 'Keterangan Status:';
  ws.getCell('B2').font = font({ bold: true, size: 16 });
  ws.mergeCells('B2:E2');
  ws.getCell('B3').value = 'Status';
  ws.getCell('D3').value = 'Keterangan';
  ws.getCell('E3').value = 'PIC';
  ws.mergeCells('B3:C3');
  for (const a of ['B3', 'C3', 'D3', 'E3']) style(ws.getCell(a), { fill: fill(C.grey), font: font({ bold: true }), border: BORDER, alignment: { horizontal: 'center', vertical: 'top' } });
  rows.forEach(([status, sub, desc, pic], i) => {
    const r = ws.getRow(4 + i);
    r.getCell(2).value = status;
    r.getCell(3).value = sub ?? status;
    r.getCell(4).value = desc;
    r.getCell(5).value = pic;
    for (let col = 2; col <= 5; col++) style(r.getCell(col), bodyStyle);
  });
  for (let i = 4; i <= 8; i++) ws.mergeCells(`B${i}:C${i}`);
  ws.mergeCells('B9:C9');
  ws.mergeCells('B10:C11');
  ws.mergeCells('E10:E11');
  ws.mergeCells('B12:B13');
  return ws;
}

function writeTemplateExamples(ws) {
  writeTestCases(ws, [
    {
      id: 'TC1', feature: '<Nama Fitur> - <Sub Fitur>', caseType: 'Normal', description: '<contoh> Menambahkan data baru dengan input valid',
      precondition: '- User sudah login\n- Berada di menu <Nama Menu>', createdAt: '2026-01-01', createdBy: 'Manual Tester Agent',
      steps: [
        { procedure: '1. Klik tombol Tambah', expected: 'Ditampilkan form tambah', actual: 'Ditampilkan form tambah' },
        { procedure: '2. Isi semua field valid lalu klik Simpan', expected: '- Data tersimpan\n- Muncul notifikasi sukses', actual: 'Sesuai expected' },
      ],
      result: 'Pass', screenshot: { label: 'TC1', link: 'https://drive.google.com/file/d/<FILE_ID>/view' },
      executedAt: '2026-01-01 10:00', executedBy: 'Manual Tester Agent', note: '',
    },
    {
      id: 'TC2', feature: '<Nama Fitur> - <Sub Fitur>', caseType: 'Abnormal', description: '<contoh> Simpan dengan field wajib kosong',
      precondition: '- Berada di form tambah', createdAt: '2026-01-01', createdBy: 'Manual Tester Agent',
      steps: [{ procedure: '1. Kosongkan field wajib lalu klik Simpan', expected: 'Muncul pesan validasi "<field> is required"', actual: 'Data tersimpan tanpa validasi' }],
      result: 'Fail', screenshot: { label: 'TC2', link: 'screenshots/UAT-R1/TC2.png' },
      executedAt: '2026-01-01 10:05', executedBy: 'Manual Tester Agent', note: 'DEF-0 (Major)',
    },
  ]);
}

async function buildTemplate(out) {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'VasVibe manual-test-vascomm';
  buildSummarySheet(wb);
  writeTemplateExamples(buildTcSheet(wb, TC_TEMPLATE));
  buildDefectSheet(wb);
  buildLegendSheet(wb);
  wb.calcProperties.fullCalcOnLoad = true;
  await fs.mkdir(path.dirname(path.resolve(out)), { recursive: true });
  await wb.xlsx.writeFile(out);
  console.log(`Template written: ${out}`);
}

// ---------------------------------------------------------------------------
// Round writer
// ---------------------------------------------------------------------------
function toDate(v) {
  if (!v) return undefined;
  if (v instanceof Date) return v;
  const m = String(v).match(/^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2}))?/);
  if (!m) return undefined;
  // Store as UTC so the wall-clock value written by the agent is what Excel shows.
  return new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], +(m[4] ?? 0), +(m[5] ?? 0)));
}

function setLink(cell, link) {
  if (!link) return;
  if (typeof link === 'string') link = { label: link, link };
  cell.value = link.link ? { text: link.label ?? link.link, hyperlink: link.link } : link.label;
  style(cell, linkStyle);
}

function writeTestCases(ws, testCases) {
  let row = TC_FIRST_ROW;
  for (const tc of testCases) {
    const steps = tc.steps?.length ? tc.steps : [{}];
    const first = row;
    const last = row + steps.length - 1;
    for (let r = first; r <= last; r++) {
      for (let col = 2; col <= 15; col++) style(ws.getRow(r).getCell(col), bodyStyle);
    }
    const r0 = ws.getRow(first);
    const prefix = tc.caseType ? `[${tc.caseType}] ` : '';
    r0.getCell('B').value = tc.id;
    r0.getCell('C').value = tc.feature ?? '';
    r0.getCell('D').value = tc.description?.startsWith('[') ? tc.description : prefix + (tc.description ?? '');
    r0.getCell('E').value = tc.precondition ?? '';
    r0.getCell('H').value = toDate(tc.createdAt) ?? tc.createdAt ?? '';
    r0.getCell('H').numFmt = 'dd/mm/yyyy';
    r0.getCell('I').value = tc.createdBy ?? '';
    r0.getCell('K').value = tc.result ?? 'Pending';
    r0.getCell('K').alignment = { horizontal: 'center', vertical: 'top' };
    setLink(r0.getCell('L'), tc.screenshot);
    r0.getCell('M').value = toDate(tc.executedAt) ?? tc.executedAt ?? '';
    r0.getCell('M').numFmt = 'dd/mm/yyyy hh:mm';
    r0.getCell('N').value = tc.executedBy ?? '';
    r0.getCell('O').value = tc.note ?? '';
    steps.forEach((s, i) => {
      const r = ws.getRow(first + i);
      r.getCell('F').value = s.procedure ?? '';
      r.getCell('G').value = s.expected ?? '';
      r.getCell('J').value = s.actual ?? '';
    });
    if (last > first) for (const col of TC_MERGE_COLS) ws.mergeCells(`${col}${first}:${col}${last}`);
    row = last + 1;
  }
}

function reorderSheets(wb, newSheetName) {
  // Summary first, round sheets in creation order, then TC Template, Defect List, legend.
  const fixedTail = [TC_TEMPLATE, DEFECTS, LEGEND];
  const sheets = wb.worksheets.slice().sort((a, b) => a.orderNo - b.orderNo);
  const rounds = sheets.filter((s) => s.name !== SUMMARY && !fixedTail.includes(s.name) && s.name !== newSheetName);
  const order = [SUMMARY, ...rounds.map((s) => s.name), newSheetName, ...fixedTail];
  const rest = sheets.filter((s) => !order.includes(s.name));
  [...order.map((n) => wb.getWorksheet(n)).filter(Boolean), ...rest].forEach((s, i) => { s.orderNo = i; });
}

async function writeRound({ template, out, data, force }) {
  const d = JSON.parse(await fs.readFile(data, 'utf8'));
  if (!d.sheetName || d.sheetName.length > 31 || /[\\/?*[\]:]/.test(d.sheetName)) {
    throw new Error(`Invalid sheetName "${d.sheetName}" (max 31 chars, no \\ / ? * [ ] :)`);
  }
  try {
    await fs.access(out);
  } catch {
    await fs.mkdir(path.dirname(path.resolve(out)), { recursive: true });
    await fs.copyFile(template, out);
  }

  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(out);
  if (wb.getWorksheet(d.sheetName)) {
    if (!force) throw new Error(`Sheet "${d.sheetName}" already exists — rounds are append-only (use --force to rewrite).`);
    wb.removeWorksheet(wb.getWorksheet(d.sheetName).id);
  }

  const project = d.project ? `: ${d.project}` : undefined;
  const summary = wb.getWorksheet(SUMMARY);
  if (project) summary.getCell('E4').value = project;

  const ws = buildTcSheet(wb, d.sheetName);
  if (project) ws.getCell('E4').value = project;
  ws.getCell('E7').value = `: ${d.phase} — Round ${d.round}`;
  ws.getCell('E8').value = `: ${d.startDate ?? '-'} s/d ${d.endDate ?? d.startDate ?? '-'}${d.environment ? ` | ${d.environment}` : ''}`;
  writeTestCases(ws, d.testCases ?? []);
  reorderSheets(wb, d.sheetName);

  // Summary: overwrite the template example row, otherwise use the first empty row.
  let row = SUMMARY_ROUND_FIRST_ROW;
  while (true) {
    const v = summary.getRow(row).getCell(2).value;
    if (v == null || v === '' || v === TC_TEMPLATE || v === d.sheetName) break;
    row++;
  }
  writeSummaryRound(summary, row, d);

  // Defect List: blank out the example row (spliceRows would duplicate the
  // data validations), then upsert by Defect ID.
  const defects = wb.getWorksheet(DEFECTS);
  if (defects.getRow(2).getCell(1).value === DEFECT_EXAMPLE_ID) {
    for (let col = 1; col <= 15; col++) defects.getRow(2).getCell(col).value = null;
  }
  const findRow = (id) => {
    for (let r = 2; r <= defects.rowCount; r++) if (defects.getRow(r).getCell(1).value === id) return r;
    return undefined;
  };
  for (const def of d.defects ?? []) {
    const existing = findRow(def.id);
    if (existing && def.comment) {
      const prev = defects.getRow(existing).getCell(15).value;
      if (prev && !String(prev).includes(def.comment)) def.comment = `${prev}\n${def.comment}`;
    }
    let target = existing;
    if (!target) {
      target = 2;
      while (defects.getRow(target).getCell(1).value) target++;
    }
    writeDefectRow(defects, target, def);
  }
  addDefectValidations(defects);
  for (const s of wb.worksheets) {
    if (s.name !== DEFECTS && s.name !== SUMMARY && s.name !== LEGEND) {
      s.dataValidations.model = {};
      s.dataValidations.add(`K${TC_FIRST_ROW}:K${TC_LAST_ROW}`, { type: 'list', allowBlank: true, formulae: ['"Pass,Fail,Pending"'] });
    }
  }

  wb.calcProperties.fullCalcOnLoad = true;
  await wb.xlsx.writeFile(out);
  console.log(`Round "${d.sheetName}" written to ${out} (${(d.testCases ?? []).length} TC, ${(d.defects ?? []).length} defect updates).`);
}

// ---------------------------------------------------------------------------
const [cmd, ...rest] = process.argv.slice(2);
const opt = (name) => {
  const i = rest.indexOf(`--${name}`);
  return i >= 0 ? rest[i + 1] : undefined;
};
try {
  if (cmd === 'build-template' && rest[0]) {
    await buildTemplate(rest[0]);
  } else if (cmd === 'round' && opt('template') && opt('out') && opt('data')) {
    await writeRound({ template: opt('template'), out: opt('out'), data: opt('data'), force: rest.includes('--force') });
  } else {
    console.error('Usage:\n  node vascomm-xlsx.mjs build-template <out.xlsx>\n  node vascomm-xlsx.mjs round --template <tpl.xlsx> --out <report.xlsx> --data <round.json> [--force]');
    process.exit(1);
  }
} catch (err) {
  console.error(err.message);
  process.exit(1);
}
