# 🚢 VasVibe - Platform Reservasi Kapal Wisata Labuan Bajo

Platform reservasi online untuk jasa layanan pariwisata kapal di Labuan Bajo. Sistem lengkap dengan backoffice management dan customer booking platform.

## 📋 Project Structure

```
vas_vibe/
├── .gitignore              # Git ignore rules
├── README.md               # This file
├── project_overview.md     # Project overview & requirements
├── codes/                  # Source code (ignored by git)
│   ├── app/                # Next.js app directory
│   ├── components/         # React components
│   ├── lib/                # Utility functions & configs
│   ├── prisma/             # Database schema & migrations
│   ├── public/             # Static assets
│   └── ...
├── specifications/         # Technical specifications (ignored by git)
│   ├── SPEC-000-*.md       # Environment setup
│   ├── SPEC-001-*.md       # Database schema
│   ├── SPEC-002-*.md       # Authentication system
│   └── SPEC-003-*.md       # Booking management
└── tests/                  # Test files
```

## 🎯 Key Features

### Backoffice System
- ✅ **Dashboard** - Real-time statistics & quick actions
- ✅ **Booking Management** - Create, view, update, cancel bookings
- ✅ **Payment Recording** - DP & full payment tracking
- ✅ **Customer Management** - Customer database
- ✅ **Ship Management** - Fleet configuration
- ✅ **Pricing Management** - Dynamic pricing rules
- ✅ **Reports & Analytics** - Business intelligence
- ✅ **User Management** - Role-based access control
- ✅ **Audit Logs** - Complete activity tracking

### Customer Platform (Upcoming)
- ⏳ **Online Booking** - Self-service reservation
- ⏳ **Payment Gateway** - Midtrans integration
- ⏳ **Booking History** - Customer dashboard
- ⏳ **E-Tickets** - Digital booking confirmation

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL 16
- **ORM:** Prisma
- **Authentication:** NextAuth.js v5
- **UI:** Tailwind CSS + Shadcn/UI
- **Icons:** Lucide React
- **Validation:** Zod
- **Date Handling:** date-fns
- **Excel Export:** xlsx
- **Deployment:** Docker Compose

## 🚀 Getting Started

### Prerequisites
- Node.js 20 LTS
- Docker & Docker Compose
- PostgreSQL 16 (via Docker)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd vas_vibe
```

2. Navigate to codes directory
```bash
cd codes
```

3. Install dependencies
```bash
npm install
```

4. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

5. Start Docker services
```bash
docker compose up -d
```

6. Run database migrations
```bash
npx prisma migrate dev
```

7. Seed database
```bash
npm run prisma:seed
```

8. Start development server
```bash
npm run dev
```

9. Access the application
- **Backoffice:** http://localhost:3000/backoffice
- **Customer:** http://localhost:3000 (coming soon)

### Default Credentials

**Admin:**
- Email: admin@vasvibe.com
- Password: admin123

**Management:**
- Email: manager@vasvibe.com
- Password: manager123

**Crew:**
- Email: crew@vasvibe.com
- Password: crew123

## 📚 Documentation

- **Project Overview:** See `project_overview.md`
- **Technical Specs:** See `specifications/` folder
- **Phase 1 Complete:** See `codes/PHASE_1_COMPLETE.md`
- **Backoffice Layout:** See `codes/BACKOFFICE_LAYOUT.md`

## 🔐 User Roles

| Role | Description | Access Level |
|------|-------------|--------------|
| **ADMIN** | System administrator | Full access to all features |
| **MANAGEMENT** | Business manager | Booking, payments, reports |
| **CREW** | Ship crew member | View bookings only |
| **OUTSOURCE** | External partner | Limited access |
| **CUSTOMER** | End customer | Self-service booking |

## 📊 Current Status

### ✅ Phase 1 - Backoffice System (COMPLETE)
- [x] Environment setup (Docker 4 services)
- [x] Database schema (13 tables)
- [x] Authentication system (NextAuth.js v5)
- [x] Booking management (CRUD operations)
- [x] Payment recording & tracking
- [x] Excel export functionality
- [x] Backoffice layout with sidebar
- [x] Dashboard page
- [x] User account menu

### ⏳ Phase 2 - Customer Platform (Planned)
- [ ] Public website & branding
- [ ] Online booking flow
- [ ] Payment gateway integration
- [ ] Customer dashboard
- [ ] Email notifications
- [ ] Invoice PDF generation

### ⏳ Phase 3 - Enhancements (Planned)
- [ ] WhatsApp integration
- [ ] SMS notifications
- [ ] Advanced analytics
- [ ] Mobile app
- [ ] Multi-language support

## 🗂️ Database Schema

### Core Tables
- **User** - System users (admin, crew, customers)
- **Booking** - Trip reservations
- **Payment** - Payment records
- **Ship** - Fleet management
- **Pricing** - Dynamic pricing rules
- **BlackoutDate** - Unavailable dates
- **Transaction** - Financial journal entries
- **AuditLog** - Activity tracking

See `codes/prisma/schema.prisma` for complete schema.

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# E2E tests
npm run test:e2e
```

## 📦 Deployment

### Production Build
```bash
npm run build
npm start
```

### Docker Production
```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## 🤝 Contributing

This is a private commercial project. Contact the development team for contribution guidelines.

## 📄 License

UNLICENSED - Proprietary Software

## 👥 Team

- **Product Owner:** VasVibe Team
- **Development:** Full-stack development team
- **Business Analyst:** System requirements & specifications

## 📞 Support

For support, contact: support@vasvibe.com

---

**Version:** 1.0.0  
**Last Updated:** December 30, 2025  
**Status:** Phase 1 Complete ✅
