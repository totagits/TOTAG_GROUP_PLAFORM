# TOTAG Group of Companies Ltd Website

## Overview
This project is a modern full-stack web application for TOTAG Group of Companies Ltd, designed to showcase their diverse business portfolio across seven specialized subsidiaries. It features a comprehensive enterprise SaaS platform as part of TOTAG IT Services' complete technology solutions portfolio.

## TOTAG IT Services - Complete Service Portfolio
TOTAG IT Services provides comprehensive technology solutions across seven core service areas:

### 1. Custom Software Development
- Web and mobile applications
- Enterprise systems (ERP, CRM, HRMIS) 
- API & microservices integrations
- Legacy system modernization
- **Featured**: 19 modular FIMS & HRMIS SaaS platform ($20/month per module, minimum 4 modules, 10% discount for all modules)

### 2. Cloud & Infrastructure Solutions
- Cloud migration (AWS, Azure, hybrid solutions)
- Virtualization & containerization (Docker, Kubernetes)
- DevOps and CI/CD pipelines
- Disaster recovery & business continuity planning

### 3. Cybersecurity & Compliance
- Penetration testing & vulnerability assessments
- Identity & access management
- SIEM integration & monitoring
- Data privacy and regulatory compliance solutions

### 4. Managed IT Services
- 24/7 network and server monitoring
- IT help desk and remote support
- Vendor and license management
- ITIL-aligned change and incident management

### 5. Data & Analytics
- Data warehousing & ETL pipelines
- Business intelligence dashboards
- Predictive analytics and reporting
- GIS mapping and spatial data analysis

### 6. Digital Transformation & Emerging Technologies
- Process automation (RPA)
- Internet of Things (IoT) solutions
- Blockchain proof-of-concepts
- Digital strategy and consulting

### 7. Training & Capacity Building
- Certified technical workshops (cloud, security, software dev)
- End-user IT literacy programs
- Custom bootcamps for organizations
- Mentorship and internship programs

## Recent Major Updates
- **February 2026**: TOCEPS Catering Operations Management System
  - Full staff operations portal with JWT authentication at /catering/ops/login
  - 6 role-based dashboards: LTA Account Manager, Operations Supervisor, Head Chef, Food Safety Supervisor, Service Team Lead, Logistics Coordinator
  - Database tables: catering_staff, catering_requests, catering_events, catering_tasks, catering_incidents
  - Public service request intake wired from catering contact form to API
  - Account Manager: request queue, quotation management, event creation from confirmed requests
  - Operations Supervisor: event coordination, task assignment to all roles
  - Head Chef: menu planning, kitchen prep tasks, staff roster management
  - Food Safety Supervisor: HACCP checklist, incident reporting/tracking, compliance logs
  - Service Team Lead: event run sheet, task progress tracking
  - Logistics Coordinator: equipment lists, transport plans, setup coordination
  - Role-based API access controls with bcrypt-hashed passwords
- **February 2026**: TOCEPS International Best-Practice Transformation
  - Main catering page rewritten with HACCP/ISO 22000/Codex WHO GHP compliance
  - New dedicated Food Safety & Hygiene SOP page at /catering/food-safety
  - Corporate catering transformed to institutional service with venue/hall rental
  - Event planning updated with UNICEF-compliant Service Desk model
- **January 2025**: FIMS International Best-Practice Modules Added
  - 4 new FIMS modules following World Bank FMIS and IFRS standards:
    - Commitment Control (budget reservation, funds control, overspend prevention)
    - Fixed Assets Management (asset register, depreciation, physical verification)
    - Contract Management (milestones, deliverables, vendor performance)
    - Project & Grant Accounting (donor restrictions, cost allocation, multi-source funding)
  - Platform now includes 19 total modules (15 HRMIS + 12 FIMS)
  - All modules have functional dashboards, action forms, data views, and reports
- **January 2025**: TOTAG IT Services Enterprise SaaS Platform completed
  - Full-featured multi-tenant FIMS & HRMIS platform with modular pricing ($35-$75/month per module)
  - TOTAG-branded frontend with Liberian payment methods (MTN Money, Orange Money, local banks)
  - Complete authentication system with JWT and secure tenant isolation
  - MemStorage fallback enabling full functionality without database dependency
  - Production-ready enterprise interface confirmed by architect review

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter
- **Styling**: Tailwind CSS with shadcn/ui (New York style variant, neutral color scheme)
- **Animations**: Framer Motion
- **State Management**: TanStack Query
- **Build Tool**: Vite
- **Design Principle**: Mobile-first approach with accessibility features built via Radix UI components.

### Backend
- **Runtime**: Node.js with Express
- **Database**: PostgreSQL with Drizzle ORM, hosted on Neon Database (serverless)
- **Session Management**: PostgreSQL-based session storage using `connect-pg-simple`
- **Development**: Hot reload with Vite middleware integration.

### Core System Features
- **UI Components**: Fixed navigation header, hero section, dynamic services grid, interactive contact forms, and comprehensive footer.
- **Backend Services**: Express server with middleware, centralized route handling, abstracted data access layer, and Drizzle ORM for schema management.
- **Business Modules**: Dedicated portals and functionalities for each of the seven TOTAG subsidiaries, with TOTAG IT Services featuring comprehensive technology solutions across seven core service areas including custom software development, cloud infrastructure, cybersecurity, managed IT services, data analytics, digital transformation, and training programs.
- **Admin Systems**: Comprehensive role-based administrative portals for corporate management (TOTAG Group Admin) and subsidiary-specific operations (General Merchandise merchant dashboard with CMS, inventory, and staff management).
- **HRMIS**: Integrated Human Resource Management Information System with employee, attendance, leave, payroll, and performance review management.
- **Deployment**: Designed for cloud platforms (Heroku, Vercel, Railway, Render, Fly.io) with Docker support, PM2 process management, and Nginx for reverse proxy.

## External Dependencies

### Frontend
- **React Ecosystem**: React, React DOM, Wouter
- **UI Components**: Radix UI primitives, shadcn/ui
- **Styling**: Tailwind CSS, `class-variance-authority`
- **Forms**: React Hook Form, Zod
- **Animations**: Framer Motion
- **Data Fetching**: TanStack Query

### Backend
- **Server Framework**: Express
- **Database**: Drizzle ORM, Neon Database driver
- **Session Management**: `express-session`, `connect-pg-simple`
- **Development**: `tsx`, Vite
- **Validation**: Zod
- **Email Service**: Resend API

### Development Tools
- **Build System**: Vite, `esbuild`
- **Database Management**: Drizzle Kit
- **Code Quality**: TypeScript
- **Deployment & Ops**: Docker, PM2, Nginx, `app.json`, `Procfile`, `vercel.json`, `railway.toml`, `render.yaml`, `fly.toml`