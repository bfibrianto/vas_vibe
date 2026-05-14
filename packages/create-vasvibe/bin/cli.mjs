#!/usr/bin/env node
// bin/cli.mjs - thin entry point that delegates to src/index.mjs.

import { main } from '../src/index.mjs';

main(process.argv).catch((err) => {
  console.error(err);
  process.exit(1);
});
