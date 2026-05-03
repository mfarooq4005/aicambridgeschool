# AI Cambridge School — Master Project Context
> This file is the single source of truth for the AI Cambridge School platform.
> Read this COMPLETELY before writing any code.
> Every decision, every rule, every database field is defined here.
> When in doubt — refer back to this file.

---

## 1. WHAT IS AI_CAMBRIDGE_SCHOOL?

AI Cambridge School is Pakistan's first **Complete School ERP + AI-Powered EdTech Platform**.

It is NOT just an education app.
It is NOT just a school management system.
It is BOTH — deeply integrated — in one platform.

### Two Products, One Codebase:

**Product A — School ERP:**
Manages every school operation: admissions, fee collection, exam management, staff payroll, inventory, library, transport, timetable, attendance, complaints.

**Product B — EdTech Platform:**
AI-powered personalized learning: self-paced credits, gamification, AI tutor (Claude), online classes, parent monitoring dashboard, student home access.

### Why Integration Matters:
- Student with 2 months unpaid fee → online access AUTO-SUSPENDED
- Student absent from school → lesson available at home via app
- Exam result entered → report card AUTO-GENERATED → parent notified instantly
- Teacher marks syllabus topic done → AI planner AUTO-ADJUSTS schedule
- These connections are the core value — never break them

---

## 2. PAKISTAN-SPECIFIC REQUIREMENTS

Always keep these in mind. They affect every feature.

```
LANGUAGE:
- Primary UI: Urdu + English mixed (bilingual)
- AI responses: Auto-detect Urdu, English, Roman Urdu
- Simple mode (uneducated parents): Pure simple Urdu, no technical terms
- All error messages: Also in Urdu

PAYMENTS:
- Primary: JazzCash API
- Secondary: EasyPaisa API
- Cash: Manual entry by accountant
- Bank transfer: Phase 2 only (HBL/MCB/UBL API)
- NO credit cards as primary method

CONNECTIVITY:
- Offline-first architecture — ALWAYS
- Content downloads when on WiFi
- Progress saves locally → syncs when online
- Local storage: SQLite in React Native
- Sync queue: All offline actions queued → sent when connected

CURRICULUM:
- Pakistan Board (Punjab/Federal/Sindh)
- SLO (Student Learning Outcomes) based
- Urdu medium + English medium both supported
- Grade structure: Nursery → KG → Grade 1-10
- Academic session: April to March (default) OR January to December

COMMUNICATION:
- WhatsApp: Primary parent channel (WhatsApp Business API)
- SMS: Fallback when WhatsApp fails
- In-app notification: Always
- Email: Secondary (educated parents only)
- Quiet hours: No alerts 10pm–7am (configurable)

DEVICE REALITY:
- Many parents have basic Android phones
- Rural areas: 2G/3G internet only
- Some parents: no smartphone (WhatsApp only on basic phone)
- School tabs: Shared devices — multiple student profiles
```

---

## 3. TECH STACK — EXACT VERSIONS

Use these exact technologies. Do not substitute without asking.

```
FRONTEND:
- Next.js 14 (App Router) — NOT pages router
- React 18
- TypeScript (strict mode — always)
- Tailwind CSS v3
- shadcn/ui (component library)
- Zustand (state management)
- React Query / TanStack Query v5 (server state)
- React Hook Form + Zod (forms + validation)

MOBILE:
- React Native with Expo (SDK 51+)
- Expo Router (file-based routing)
- React Native Paper OR NativeWind (Tailwind for RN)
- WatermelonDB (offline SQLite sync)
- Expo Notifications (push notifications)

BACKEND:
- Node.js v20+
- Express.js v4
- TypeScript
- Prisma ORM v5 (schema-first)
- PostgreSQL v15 (via Supabase)

DATABASE & INFRASTRUCTURE:
- Supabase (PostgreSQL + Auth + Realtime + Storage)
- Row Level Security (RLS) enabled on ALL tables
- Redis (Upstash) — caching + job queues
- BullMQ — background job processing

AI:
- Anthropic Claude API (primary — claude-sonnet-4-5)
- OpenRouter API (cost routing — claude-haiku-4-5 for simple tasks)
- All AI calls go through /api/ai/ route — never direct from client

HOSTING:
- Vercel — Next.js frontend
- Railway.app — Express backend
- Supabase — database + storage
- Cloudflare — CDN + DNS + DDoS protection
- Upstash — Redis

EXTERNAL SERVICES:
- WhatsApp Business API (360dialog or official)
- Twilio — SMS fallback
- JazzCash REST API — payments
- EasyPaisa API — payments
- Mux.io — video upload + streaming
- Resend.com — transactional email

DEVELOPMENT:
- Cursor AI — primary IDE
- GitHub — version control
- ESLint + Prettier — code formatting
- Husky — pre-commit hooks
```

---

## 4. PROJECT STRUCTURE

```
ai-cambridge-school/
├── apps/
│   ├── web/                    # Next.js 14 web app
│   │   ├── app/
│   │   │   ├── (auth)/         # Login, register pages
│   │   │   ├── (admin)/        # Admin dashboard
│   │   │   ├── (principal)/    # Principal portal
│   │   │   ├── (teacher)/      # Teacher portal
│   │   │   ├── (student)/      # Student portal
│   │   │   ├── (parent)/       # Parent portal
│   │   │   └── api/            # API routes
│   │   ├── components/
│   │   │   ├── ui/             # shadcn components
│   │   │   ├── shared/         # Shared across portals
│   │   │   ├── reports/        # Reusable report components (charts, tables, exports)
│   │   │   ├── admin/          # Admin-specific
│   │   │   ├── teacher/        # Teacher-specific
│   │   │   ├── student/        # Student-specific
│   │   │   └── parent/         # Parent-specific
│   │   └── lib/
│   │       ├── auth/           # NextAuth config
│   │       ├── db/             # Prisma client
│   │       ├── ai/             # Claude agents
│   │       ├── payments/       # JazzCash + EasyPaisa
│   │       ├── reports/        # Report generation (PDF, Excel, WhatsApp)
│   │       └── utils/
│   │
│   └── mobile/                 # React Native Expo app
│       ├── app/                # Expo Router pages
│       ├── components/
│       ├── lib/
│       └── services/
│
├── packages/
│   ├── database/               # Prisma schema + migrations
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── types/                  # Shared TypeScript types
│   ├── validators/             # Shared Zod schemas
│   └── config/                 # Shared config
│
└── services/
    ├── ai-agents/              # Claude agent services
    ├── notifications/          # WhatsApp + SMS + Push
    └── jobs/                   # BullMQ background jobs
```

---

## 5. USER ROLES & PERMISSIONS

### All Roles:
```
SUPER_ADMIN    → Platform owner (you) — full access to everything
SCHOOL_ADMIN   → Branch manager — full access to their school only
PRINCIPAL      → Academic head — academic + staff management
VICE_PRINCIPAL → Supports principal — similar but limited
COORDINATOR    → Exam + syllabus management — approves AI papers
CLASS_TEACHER  → Homeroom teacher — own class only
SUBJECT_TEACHER → Subject-specific — their subjects + grades only
ACCOUNTANT     → Financial module only — no academic access
LIBRARIAN      → Library module only
TRANSPORT_MANAGER → Transport module only
STUDENT        → Own content + progress only
PARENT         → Own children only
```

### Permission Matrix (implement as middleware):
```typescript
const PERMISSIONS = {
  // Fee Management
  'fee:view_all': ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'ACCOUNTANT'],
  'fee:collect': ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'ACCOUNTANT'],
  'fee:discount:create': ['SUPER_ADMIN', 'SCHOOL_ADMIN'],
  'fee:discount:approve': ['SUPER_ADMIN'],
  'fee:view_own': ['PARENT'],

  // Exam Management
  'exam:paper:generate': ['COORDINATOR', 'SCHOOL_ADMIN', 'SUPER_ADMIN'],
  'exam:paper:approve': ['COORDINATOR', 'SCHOOL_ADMIN', 'SUPER_ADMIN'],
  'exam:result:enter': ['SUBJECT_TEACHER', 'CLASS_TEACHER', 'COORDINATOR'],
  'exam:result:view': ['STUDENT', 'PARENT', 'TEACHER', 'COORDINATOR', 'PRINCIPAL', 'SCHOOL_ADMIN', 'SUPER_ADMIN'],

  // Student Management
  'student:view_all': ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'COORDINATOR'],
  'student:view_own_class': ['CLASS_TEACHER', 'SUBJECT_TEACHER'],
  'student:view_own': ['STUDENT'],
  'student:view_children': ['PARENT'],

  // Staff & Payroll
  'staff:view': ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL'],
  'payroll:view': ['SUPER_ADMIN', 'SCHOOL_ADMIN'],
  'payroll:process': ['SUPER_ADMIN', 'SCHOOL_ADMIN'],
  'payroll:view_own': ['STAFF'],

  // Content
  'content:upload': ['SUBJECT_TEACHER', 'CLASS_TEACHER', 'COORDINATOR'],
  'content:approve': ['COORDINATOR', 'SCHOOL_ADMIN', 'SUPER_ADMIN'],
  'content:view': ['STUDENT', 'TEACHER', 'PARENT'],

  // AI Features
  'ai:tutor': ['STUDENT'],
  'ai:paper_generate': ['COORDINATOR', 'SCHOOL_ADMIN', 'SUPER_ADMIN'],
  'ai:analytics': ['TEACHER', 'COORDINATOR', 'PRINCIPAL', 'SCHOOL_ADMIN', 'SUPER_ADMIN'],

  // Student Diary
  'diary:create': ['SUBJECT_TEACHER', 'CLASS_TEACHER'],
  'diary:view_section': ['CLASS_TEACHER', 'SUBJECT_TEACHER', 'COORDINATOR', 'PRINCIPAL', 'SCHOOL_ADMIN', 'SUPER_ADMIN'],
  'diary:view_own': ['STUDENT', 'PARENT'],

  // Report Card
  'reportcard:generate': ['COORDINATOR', 'SCHOOL_ADMIN', 'SUPER_ADMIN'],
  'reportcard:approve': ['PRINCIPAL', 'SCHOOL_ADMIN', 'SUPER_ADMIN'],
  'reportcard:view_all': ['COORDINATOR', 'PRINCIPAL', 'SCHOOL_ADMIN', 'SUPER_ADMIN'],
  'reportcard:view_own': ['STUDENT', 'PARENT'],

  // Certificates
  'certificate:issue': ['SCHOOL_ADMIN', 'SUPER_ADMIN'],
  'certificate:view': ['STUDENT', 'PARENT', 'SCHOOL_ADMIN', 'SUPER_ADMIN'],

  // Class Tests
  'classtest:create': ['SUBJECT_TEACHER', 'CLASS_TEACHER'],
  'classtest:enter_marks': ['SUBJECT_TEACHER', 'CLASS_TEACHER'],
  'classtest:view_section': ['CLASS_TEACHER', 'SUBJECT_TEACHER', 'COORDINATOR', 'PRINCIPAL', 'SCHOOL_ADMIN', 'SUPER_ADMIN'],
  'classtest:view_own': ['STUDENT', 'PARENT'],

  // Assignments / Homework
  'assignment:create': ['SUBJECT_TEACHER', 'CLASS_TEACHER'],
  'assignment:submit': ['STUDENT'],
  'assignment:grade': ['SUBJECT_TEACHER', 'CLASS_TEACHER'],
  'assignment:view_own': ['STUDENT', 'PARENT'],

  // Student Leave
  'leave:apply': ['PARENT'],
  'leave:approve': ['CLASS_TEACHER', 'COORDINATOR', 'PRINCIPAL', 'SCHOOL_ADMIN', 'SUPER_ADMIN'],
  'leave:view_section': ['CLASS_TEACHER', 'COORDINATOR', 'PRINCIPAL', 'SCHOOL_ADMIN', 'SUPER_ADMIN'],

  // PTM
  'ptm:schedule': ['SCHOOL_ADMIN', 'PRINCIPAL', 'SUPER_ADMIN'],
  'ptm:book_slot': ['PARENT'],
  'ptm:view': ['PARENT', 'CLASS_TEACHER', 'SUBJECT_TEACHER', 'COORDINATOR', 'PRINCIPAL', 'SCHOOL_ADMIN', 'SUPER_ADMIN'],

  // Promotion
  'promotion:process': ['PRINCIPAL', 'SCHOOL_ADMIN', 'SUPER_ADMIN'],
  'promotion:view': ['CLASS_TEACHER', 'COORDINATOR', 'PRINCIPAL', 'SCHOOL_ADMIN', 'SUPER_ADMIN'],

  // Reports & Analytics
  'report:attendance:all': ['PRINCIPAL', 'COORDINATOR', 'SCHOOL_ADMIN', 'SUPER_ADMIN'],
  'report:attendance:section': ['CLASS_TEACHER', 'SUBJECT_TEACHER'],
  'report:fee:all': ['ACCOUNTANT', 'SCHOOL_ADMIN', 'SUPER_ADMIN'],
  'report:academic:all': ['COORDINATOR', 'PRINCIPAL', 'SCHOOL_ADMIN', 'SUPER_ADMIN'],
  'report:academic:section': ['CLASS_TEACHER', 'SUBJECT_TEACHER'],
  'report:teacher_performance': ['PRINCIPAL', 'SCHOOL_ADMIN', 'SUPER_ADMIN'],
  'report:parent_engagement': ['CLASS_TEACHER', 'COORDINATOR', 'PRINCIPAL', 'SCHOOL_ADMIN', 'SUPER_ADMIN'],
  'report:multi_branch': ['SUPER_ADMIN'],
  'report:own_children': ['PARENT'],
  'report:export_pdf': ['CLASS_TEACHER', 'COORDINATOR', 'ACCOUNTANT', 'PRINCIPAL', 'SCHOOL_ADMIN', 'SUPER_ADMIN'],
  'report:export_excel': ['COORDINATOR', 'ACCOUNTANT', 'PRINCIPAL', 'SCHOOL_ADMIN', 'SUPER_ADMIN'],

  // Audit Logs
  'audit:view': ['SCHOOL_ADMIN', 'SUPER_ADMIN'],
  'audit:export': ['SUPER_ADMIN'],

  // SMS / Communication Tracking
  'sms:view_balance': ['SCHOOL_ADMIN', 'SUPER_ADMIN'],
  'sms:view_logs': ['SCHOOL_ADMIN', 'SUPER_ADMIN'],

  // Academic Calendar
  'calendar:manage': ['SCHOOL_ADMIN', 'PRINCIPAL', 'SUPER_ADMIN'],
  'calendar:view': ['ALL_ROLES'],
}
```

---

## 6. DATABASE SCHEMA (COMPLETE)

### Multi-Tenancy Rule:
Every table that belongs to a school MUST have `school_id` field.
Supabase RLS policy enforces: users can only see rows where `school_id` matches their school.

```prisma
// ─────────────────────────────────────────
// IDENTITY & MULTI-TENANCY
// ─────────────────────────────────────────

model School {
  id              String   @id @default(cuid())
  name            String
  slug            String   @unique  // for subdomain: gulshan.ai-cambridge-school.pk
  logo_url        String?
  address         String
  city            String
  province        String
  phone           String
  email           String?
  pemis_number    String?  // Govt registration
  board           String   // PUNJAB | FEDERAL | SINDH | KPK
  medium          String[] // URDU | ENGLISH
  session_type    String   @default("APR_MAR") // APR_MAR | JAN_DEC
  established     Int?
  is_active       Boolean  @default(true)
  subscription    String   @default("PHASE_1") // PHASE_1 | PHASE_2 | PHASE_3
  created_at      DateTime @default(now())
  updated_at      DateTime @updatedAt

  users           User[]
  students        Student[]
  staff           Staff[]
  grades          Grade[]
  fee_structures  FeeStructure[]
  academic_years  AcademicYear[]
}

model User {
  id              String   @id @default(cuid())
  school_id       String
  phone           String
  email           String?
  password_hash   String?
  role            Role
  full_name       String
  profile_pic     String?
  is_verified     Boolean  @default(false)
  is_active       Boolean  @default(true)
  portal_mode     String   @default("FULL") // FULL | SIMPLE (uneducated parents)
  preferred_lang  String   @default("UR") // UR | EN
  last_login      DateTime?
  created_at      DateTime @default(now())
  updated_at      DateTime @updatedAt

  school          School   @relation(fields: [school_id], references: [id])
  student         Student?
  parent          Parent?
  staff           Staff?
  sessions        Session[]

  @@unique([school_id, phone])
  @@index([school_id, role])
}

enum Role {
  SUPER_ADMIN
  SCHOOL_ADMIN
  PRINCIPAL
  VICE_PRINCIPAL
  COORDINATOR
  CLASS_TEACHER
  SUBJECT_TEACHER
  ACCOUNTANT
  LIBRARIAN
  TRANSPORT_MANAGER
  STUDENT
  PARENT
}

model Student {
  id              String   @id @default(cuid())
  user_id         String   @unique
  school_id       String
  grade_id        String
  section_id      String
  roll_number     String?
  admission_no    String   @unique
  parent_id       String?
  medium          String   // URDU | ENGLISH
  dob             DateTime
  gender          String   // MALE | FEMALE
  blood_group     String?
  address         String?
  previous_school String?
  is_online_only  Boolean  @default(false)
  access_suspended Boolean @default(false)  // Fee default suspension
  suspension_reason String?
  enrolled_at     DateTime @default(now())
  created_at      DateTime @default(now())

  user            User     @relation(fields: [user_id], references: [id])
  parent          Parent?  @relation(fields: [parent_id], references: [id])
  grade           Grade    @relation(fields: [grade_id], references: [id])
  section         Section  @relation(fields: [section_id], references: [id])
  credits         Credit[]
  attendance      Attendance[]
  fee_vouchers    FeeVoucher[]
  results         ExamResult[]
  progress        LearningProgress[]
  report_cards    ReportCard[]
  class_test_results ClassTestResult[]
  assignment_submissions AssignmentSubmission[]
  promotions      PromotionRecord[]
  leaves          StudentLeave[]
}

model Parent {
  id              String   @id @default(cuid())
  user_id         String   @unique
  school_id       String
  education_level String   @default("UNKNOWN") // NONE | BASIC | MATRIC | GRADUATE
  portal_mode     String   @default("FULL")    // AUTO-SET based on education_level
  whatsapp_number String?
  alert_channel   String[] @default(["WHATSAPP", "APP"]) // WHATSAPP | SMS | APP | EMAIL
  quiet_hours_start Int    @default(22) // 10pm
  quiet_hours_end   Int    @default(7)  // 7am
  children        Student[]
  user            User     @relation(fields: [user_id], references: [id])
}

// ─────────────────────────────────────────
// ACADEMIC STRUCTURE
// ─────────────────────────────────────────

model AcademicYear {
  id              String   @id @default(cuid())
  school_id       String
  name            String   // "2025-2026"
  start_date      DateTime
  end_date        DateTime
  is_current      Boolean  @default(false)
  terms           Term[]
}

model Term {
  id              String   @id @default(cuid())
  academic_year_id String
  name            String   // "Term 1" | "Mid Term" | "Final"
  start_date      DateTime
  end_date        DateTime
  academic_year   AcademicYear @relation(fields: [academic_year_id], references: [id])
}

model Grade {
  id              String   @id @default(cuid())
  school_id       String
  name            String   // "Nursery" | "KG" | "Grade 1" ... "Grade 10"
  level           Int      // 0=Nursery, 1=KG, 2=Grade1 ... 11=Grade10
  total_credits   Int      // Credits required to complete this grade
  min_months      Int      // Minimum months to complete
  max_months      Int      // Maximum months before intervention
  sections        Section[]
  students        Student[]
  school          School   @relation(fields: [school_id], references: [id])
}

model Section {
  id              String   @id @default(cuid())
  school_id       String
  grade_id        String
  name            String   // "A" | "B" | "C"
  max_students    Int      @default(35)
  class_teacher_id String?
  room_number     String?
  students        Student[]
  grade           Grade    @relation(fields: [grade_id], references: [id])
}

// ─────────────────────────────────────────
// FEE MANAGEMENT
// ─────────────────────────────────────────

model FeeStructure {
  id              String   @id @default(cuid())
  school_id       String
  grade_id        String?  // null = applies to all grades
  fee_head        String   // TUITION | REGISTRATION | ANNUAL | EXAM | LAB | LIBRARY | TRANSPORT
  amount          Decimal
  frequency       String   // MONTHLY | ONCE | TERMLY | YEARLY
  effective_from  DateTime
  effective_to    DateTime?
  is_active       Boolean  @default(true)
}

model Discount {
  id              String   @id @default(cuid())
  school_id       String
  student_id      String
  type            String   // SIBLING | STAFF_CHILD | MERIT | NEED_BASED | HAFIZ | CUSTOM
  percentage      Decimal
  amount_override Decimal? // Fixed amount instead of percentage
  reason          String
  approved_by     String   // user_id
  approved_at     DateTime
  valid_from      DateTime
  valid_to        DateTime?
  is_cancelled    Boolean  @default(false)
  // NOTE: Discounts are NEVER deleted — only cancelled
}

model FeeVoucher {
  id              String   @id @default(cuid())
  school_id       String
  student_id      String
  challan_number  String   @unique  // Sequential, bank-compatible (e.g. "ACS-2026-00001")
  month           Int      // 1-12
  year            Int
  gross_amount    Decimal
  discount_amount Decimal  @default(0)
  net_amount      Decimal
  due_date        DateTime
  status          String   @default("PENDING") // PENDING | PAID | PARTIAL | OVERDUE | WAIVED
  late_fee        Decimal  @default(0)
  library_fine    Decimal  @default(0)  // Auto-added from LibraryIssue overdue fines
  other_charges   Decimal  @default(0)  // Any additional charges
  challan_pdf_url String?  // 3-copy bank challan PDF (bank, school, parent)
  generated_at    DateTime @default(now())
  student         Student  @relation(fields: [student_id], references: [id])
  payments        FeePayment[]

  @@unique([school_id, student_id, month, year])
}

model FeePayment {
  id              String   @id @default(cuid())
  voucher_id      String
  amount          Decimal
  method          String   // JAZZCASH | EASYPAISA | CASH | BANK
  transaction_id  String?
  received_by     String?  // user_id of accountant (for cash)
  verified        Boolean  @default(false)
  paid_at         DateTime @default(now())
  receipt_url     String?  // Auto-generated PDF URL
  voucher         FeeVoucher @relation(fields: [voucher_id], references: [id])
}

// Fee Suspension Logic — implemented in background job:
// Every day at midnight:
// 1. Find all students with vouchers overdue > 60 days
// 2. Set student.access_suspended = true
// 3. Send alert to parent via WhatsApp
// When payment received:
// 1. Set student.access_suspended = false within 1 hour
// 2. Send confirmation to parent

// ─────────────────────────────────────────
// EXAMINATION SYSTEM
// ─────────────────────────────────────────

model SyllabusContent {
  id              String   @id @default(cuid())
  school_id       String
  grade_id        String
  subject         String
  chapter_no      Int
  chapter_title   String
  slo_codes       String[] // SLO identifiers from Pakistan curriculum
  file_url        String?  // Uploaded book chapter PDF
  uploaded_by     String   // user_id
  ai_processed    Boolean  @default(false) // Has Claude indexed this content?
  ai_summary      String?  // Claude's indexed summary for paper generation
  created_at      DateTime @default(now())
}

model ExamSchedule {
  id              String   @id @default(cuid())
  school_id       String
  academic_year_id String
  term_id         String
  grade_id        String
  subject         String
  exam_date       DateTime
  start_time      String   // "09:00"
  duration_mins   Int
  room            String?
  invigilator_id  String?  // user_id
  total_marks     Int
  passing_marks   Int
  status          String   @default("SCHEDULED") // SCHEDULED | PAPER_PENDING | PAPER_APPROVED | COMPLETED
  papers          ExamPaper[]
}

model ExamPaper {
  id              String   @id @default(cuid())
  exam_schedule_id String
  school_id       String
  generated_by_ai Boolean  @default(true)
  paper_content   Json     // Full paper structure in JSON
  answer_key      Json     // Encrypted answer key
  slo_coverage    Json     // Which SLOs are covered — percentage each
  difficulty_dist Json     // { easy: 40, medium: 40, hard: 20 }
  status          String   @default("DRAFT") // DRAFT | UNDER_REVIEW | APPROVED | REJECTED | PRINTED
  submitted_by    String   // coordinator user_id
  reviewed_by     String?  // coordinator/admin who approved
  review_notes    String?
  approved_at     DateTime?
  print_unlocked  Boolean  @default(false)
  print_unlocked_at DateTime?
  created_at      DateTime @default(now())
}

model ExamResult {
  id              String   @id @default(cuid())
  school_id       String
  student_id      String
  exam_schedule_id String
  marks_obtained  Decimal
  total_marks     Decimal
  percentage      Decimal
  grade_letter    String   // A+ | A | B | C | D | F
  position        Int?     // Position in class
  is_pass         Boolean
  is_distinction  Boolean  @default(false)
  is_compartment  Boolean  @default(false)
  entered_by      String   // teacher user_id
  verified_by     String?  // coordinator user_id
  created_at      DateTime @default(now())
  student         Student  @relation(fields: [student_id], references: [id])
}

// ─────────────────────────────────────────
// LEARNING & CREDITS (EdTech)
// ─────────────────────────────────────────

model Credit {
  id              String   @id @default(cuid())
  student_id      String
  school_id       String
  type            CreditType
  subject         String?
  slo_code        String?
  points          Int
  source_id       String?  // ID of quiz/video/class that earned this
  earned_at       DateTime @default(now())
  awarded_by      String?  // If manually given — user_id + reason required
  manual_reason   String?
  student         Student  @relation(fields: [student_id], references: [id])
}

enum CreditType {
  VIDEO_COMPLETE      // Watched 90%+ of lesson video: 2 credits
  GAME_PASS           // Game score 70%+: 5 credits
  QUIZ_PASS           // Quiz score 80%+: 10 credits
  ASSIGNMENT_SUBMIT   // Teacher approved: 15 credits
  LIVE_ATTENDANCE     // Joined live class in first 5 mins: 8 credits
  SLO_COMPLETE        // SLO assessment 75%+: 20 credits
  PHYSICAL_ATTENDANCE // School attendance bonus: 3 credits/day
  GRADE_FINAL         // Grade exam 80%+: 40 credits (unlocks next grade)
  STREAK_BONUS        // 7-day streak: 5 bonus credits
  FAST_COMPLETION     // Grade done in <50% expected time: 10 bonus credits
  MANUAL_AWARD        // Admin/Teacher manual — requires reason
}

model LearningProgress {
  id              String   @id @default(cuid())
  student_id      String
  school_id       String
  grade_id        String
  subject         String
  slo_code        String
  status          String   @default("NOT_STARTED") // NOT_STARTED | IN_PROGRESS | MASTERED
  attempts        Int      @default(0)
  best_score      Decimal?
  last_attempt_at DateTime?
  mastered_at     DateTime?
  student         Student  @relation(fields: [student_id], references: [id])

  @@unique([student_id, grade_id, subject, slo_code])
}

// ─────────────────────────────────────────
// STAFF & PAYROLL
// ─────────────────────────────────────────

model Staff {
  id              String   @id @default(cuid())
  user_id         String   @unique
  school_id       String
  designation     String
  department      String
  employee_code   String   @unique
  employment_type String   // PERMANENT | CONTRACT | PART_TIME
  joining_date    DateTime
  cnic            String
  emergency_contact String?
  qualification   String
  bank_name       String?
  bank_account    String?
  jazzcash_number String?
  is_active       Boolean  @default(true)
  user            User     @relation(fields: [user_id], references: [id])
  salary_structure SalaryStructure?
  attendance      StaffAttendance[]
  payroll         Payroll[]
  leaves          Leave[]
}

model SalaryStructure {
  id              String   @id @default(cuid())
  staff_id        String   @unique
  basic           Decimal
  hra_percent     Decimal  @default(45)  // House Rent = 45% of basic
  conveyance      Decimal  @default(0)
  medical         Decimal  @default(0)
  other           Decimal  @default(0)
  effective_from  DateTime
  created_by      String
  // Net = basic + (basic*hra%) + conveyance + medical - deductions
}

model Payroll {
  id              String   @id @default(cuid())
  school_id       String
  staff_id        String
  month           Int
  year            Int
  working_days    Int
  present_days    Int
  absent_days     Int
  late_count      Int      @default(0)
  gross_salary    Decimal
  absent_deduction Decimal @default(0)
  late_deduction  Decimal  @default(0)
  loan_deduction  Decimal  @default(0)
  tax_deduction   Decimal  @default(0)
  other_deduction Decimal  @default(0)
  net_salary      Decimal
  status          String   @default("DRAFT") // DRAFT | APPROVED | PAID
  payment_method  String?  // CASH | BANK | JAZZCASH
  paid_at         DateTime?
  approved_by     String?
  notes           String?
  // NOTE: Once status=PAID, record is LOCKED — no edits allowed
  staff           Staff    @relation(fields: [staff_id], references: [id])

  @@unique([staff_id, month, year])
}

// ─────────────────────────────────────────
// COMMUNICATION & ALERTS
// ─────────────────────────────────────────

model Alert {
  id              String   @id @default(cuid())
  school_id       String
  student_id      String?
  staff_id        String?
  type            String   // INACTIVE_3D | INACTIVE_7D | INACTIVE_14D | FEE_DUE | FEE_SUSPENDED | ACHIEVEMENT | WEEKLY_REPORT
  trigger_data    Json?    // Data that caused this alert
  message_urdu    String   // Always in Urdu
  message_english String?
  sent_to         String[] // user_ids
  channel         String[] // WHATSAPP | SMS | APP | EMAIL
  sent_at         DateTime @default(now())
  delivered       Boolean  @default(false)
  // Alert messages generated by Claude Alert Agent (claude-haiku via OpenRouter)
}

model Complaint {
  id              String   @id @default(cuid())
  school_id       String
  raised_by       String   // user_id
  raised_by_role  Role
  category        String   // TEACHER_BEHAVIOR | ACADEMIC | FEE | PLATFORM | OTHER
  against_id      String?  // user_id of person complaint is against
  description     String
  status          String   @default("OPEN") // OPEN | ACKNOWLEDGED | IN_PROGRESS | RESOLVED | ESCALATED
  assigned_to     String?  // user_id
  resolution      String?
  resolved_by     String?  // user_id
  resolved_at     DateTime?
  escalated_to    String?  // user_id (admin)
  escalated_at    DateTime?
  created_at      DateTime @default(now())
  // SLA: Acknowledge within 24hrs, Resolve within 72hrs, else auto-escalate
}

// ─────────────────────────────────────────
// INVENTORY & ASSETS
// ─────────────────────────────────────────

model Asset {
  id              String   @id @default(cuid())
  school_id       String
  name            String
  category        String   // ELECTRONICS | FURNITURE | LAB | SPORTS | VEHICLE | STUDENT_DEVICE
  asset_code      String   @unique  // LCD-001, TAB-045
  serial_number   String?
  assigned_to_id  String?  // user_id or room_id
  assigned_type   String?  // USER | ROOM
  condition       String   @default("GOOD") // NEW | GOOD | FAIR | POOR | DAMAGED
  purchase_date   DateTime?
  purchase_price  Decimal?
  vendor          String?
  warranty_expiry DateTime?
  last_audit_date DateTime?
  is_active       Boolean  @default(true)
  notes           String?
  photo_urls      String[]
}

// ─────────────────────────────────────────
// LIBRARY
// ─────────────────────────────────────────

model Book {
  id              String   @id @default(cuid())
  school_id       String
  title           String
  author          String?
  isbn            String?
  publisher       String?
  edition         String?
  year            Int?
  subject         String?
  grade_level     String?
  category        String   // TEXTBOOK | REFERENCE | FICTION | ISLAMIC | GENERAL
  total_copies    Int      @default(1)
  shelf_location  String?
  digital_url     String?  // Phase 2: PDF version
  is_active       Boolean  @default(true)
  issues          LibraryIssue[]
}

model LibraryIssue {
  id              String   @id @default(cuid())
  school_id       String
  book_id         String
  borrower_id     String   // user_id
  borrower_type   String   // STUDENT | STAFF
  issue_date      DateTime @default(now())
  due_date        DateTime
  return_date     DateTime?
  condition_on_issue String @default("GOOD")
  condition_on_return String?
  fine_amount     Decimal  @default(0)
  fine_paid       Boolean  @default(false)
  is_lost         Boolean  @default(false)
  book            Book     @relation(fields: [book_id], references: [id])
}

// ─────────────────────────────────────────
// TRANSPORT
// ─────────────────────────────────────────

model TransportRoute {
  id              String   @id @default(cuid())
  school_id       String
  name            String
  stops           Json     // [{order: 1, name: "Gulshan Chowk", lat: 31.xxx, lng: 74.xxx}]
  driver_id       String?  // staff_id
  vehicle_id      String?  // asset_id
  fee_amount      Decimal
  is_active       Boolean  @default(true)
  student_routes  StudentRoute[]
}

model StudentRoute {
  id              String   @id @default(cuid())
  student_id      String
  route_id        String
  stop_name       String
  direction       String   // MORNING | EVENING | BOTH
  route           TransportRoute @relation(fields: [route_id], references: [id])
}

// ─────────────────────────────────────────
// STUDENT DIARY
// ─────────────────────────────────────────

model DiaryEntry {
  id              String   @id @default(cuid())
  school_id       String
  section_id      String
  subject         String
  date            DateTime // Diary date (one entry per subject per section per day)
  homework_text   String?  // English homework description
  homework_urdu   String?  // Urdu homework description
  remarks         String?  // Class remarks / special notes
  attachments     String[] // URLs to photos of board, worksheets etc.
  posted_by       String   // teacher user_id
  created_at      DateTime @default(now())
  updated_at      DateTime @updatedAt
  section         Section  @relation(fields: [section_id], references: [id])
  acknowledgments DiaryAcknowledgment[]

  @@unique([section_id, subject, date])
}

model DiaryAcknowledgment {
  id              String   @id @default(cuid())
  diary_entry_id  String
  parent_id       String   // parent user_id
  student_id      String
  seen_at         DateTime @default(now())
  diary_entry     DiaryEntry @relation(fields: [diary_entry_id], references: [id])

  @@unique([diary_entry_id, parent_id, student_id])
}

// ─────────────────────────────────────────
// REPORT CARD
// ─────────────────────────────────────────

model ReportCard {
  id              String   @id @default(cuid())
  school_id       String
  student_id      String
  academic_year_id String
  term_id         String
  total_marks     Decimal
  obtained_marks  Decimal
  percentage      Decimal
  position        Int?     // Position in section
  grade_letter    String   // A+ | A | B | C | D | F
  is_pass         Boolean
  is_distinction  Boolean  @default(false)
  remarks_english String?
  remarks_urdu    String?
  subject_results Json     // [{subject, total, obtained, percentage, grade, teacher_remark}]
  attendance_summary Json? // {total_days, present, absent, late, percentage}
  class_test_avg  Decimal? // Average of all class tests this term
  conduct_grade   String?  // A | B | C | D
  generated_at    DateTime @default(now())
  approved_by     String?  // principal user_id
  approved_at     DateTime?
  pdf_url         String?  // Generated report card PDF
  whatsapp_sent   Boolean  @default(false)
  whatsapp_sent_at DateTime?
  student         Student  @relation(fields: [student_id], references: [id])
  term            Term     @relation(fields: [term_id], references: [id])

  @@unique([student_id, term_id])
}

// ─────────────────────────────────────────
// CERTIFICATES
// ─────────────────────────────────────────

model Certificate {
  id              String   @id @default(cuid())
  school_id       String
  student_id      String
  type            String   // TC | CHARACTER | BONAFIDE | FEE_PAID
  serial_number   String   @unique  // Sequential: "ACS-TC-2026-0001"
  content_data    Json     // Dynamic fields depending on type
  // TC: {last_grade, last_result, conduct, reason_for_leaving, dues_cleared}
  // CHARACTER: {duration, conduct_rating, extra_curriculars}
  // BONAFIDE: {current_grade, enrollment_date, purpose}
  // FEE_PAID: {period_from, period_to, total_paid, outstanding}
  issued_by       String   // admin user_id
  issued_at       DateTime @default(now())
  pdf_url         String?
  is_cancelled    Boolean  @default(false)
  cancelled_by    String?
  cancelled_at    DateTime?
  cancel_reason   String?
  // RULE: Certificates are NEVER deleted — only cancelled with reason
}

// ─────────────────────────────────────────
// CLASS TESTS / WEEKLY TESTS
// ─────────────────────────────────────────

model ClassTest {
  id              String   @id @default(cuid())
  school_id       String
  section_id      String
  subject         String
  date            DateTime
  total_marks     Int
  topic           String?  // Specific topic tested
  chapter_no      Int?
  test_type       String   // CLASS_TEST | WEEKLY | SURPRISE | ORAL
  created_by      String   // teacher user_id
  created_at      DateTime @default(now())
  results         ClassTestResult[]
  section         Section  @relation(fields: [section_id], references: [id])
}

model ClassTestResult {
  id              String   @id @default(cuid())
  test_id         String
  student_id      String
  marks_obtained  Decimal
  is_absent       Boolean  @default(false) // Student was absent for test
  remarks         String?
  entered_by      String   // teacher user_id
  entered_at      DateTime @default(now())
  test            ClassTest @relation(fields: [test_id], references: [id])
  student         Student   @relation(fields: [student_id], references: [id])

  @@unique([test_id, student_id])
}

// ─────────────────────────────────────────
// ASSIGNMENTS / HOMEWORK SUBMISSION
// ─────────────────────────────────────────

model Assignment {
  id              String   @id @default(cuid())
  school_id       String
  section_id      String
  subject         String
  title           String
  description     String?
  description_urdu String?
  due_date        DateTime
  total_marks     Int?     // null = ungraded assignment
  attachments     String[] // Worksheet PDFs, reference images
  assigned_by     String   // teacher user_id
  created_at      DateTime @default(now())
  submissions     AssignmentSubmission[]
  section         Section  @relation(fields: [section_id], references: [id])
}

model AssignmentSubmission {
  id              String   @id @default(cuid())
  assignment_id   String
  student_id      String
  content         String?  // Text response
  attachments     String[] // Uploaded photos/files of work
  submitted_at    DateTime @default(now())
  is_late         Boolean  @default(false) // Submitted after due_date
  marks           Decimal? // null = not yet graded
  feedback        String?  // Teacher feedback
  feedback_urdu   String?
  graded_by       String?  // teacher user_id
  graded_at       DateTime?
  assignment      Assignment @relation(fields: [assignment_id], references: [id])
  student         Student    @relation(fields: [student_id], references: [id])

  @@unique([assignment_id, student_id])
}

// ─────────────────────────────────────────
// STUDENT PROMOTION / YEAR-END
// ─────────────────────────────────────────

model PromotionRecord {
  id              String   @id @default(cuid())
  school_id       String
  student_id      String
  academic_year_id String
  from_grade_id   String
  to_grade_id     String?  // null if DETAINED or TC_ISSUED
  to_section_id   String?  // Assigned section in new grade
  decision        String   // PROMOTED | DETAINED | COMPARTMENT | TC_ISSUED
  final_percentage Decimal?
  final_position  Int?
  decided_by      String   // principal/admin user_id
  decided_at      DateTime @default(now())
  remarks         String?
  // RULE: Bulk promotion by Principal — system shows pass/fail, principal approves list
  // RULE: DETAINED students remain in same grade, new section assigned if needed
  // RULE: COMPARTMENT students promoted conditionally — must clear supplementary

  @@unique([student_id, academic_year_id])
}

// ─────────────────────────────────────────
// STUDENT LEAVE
// ─────────────────────────────────────────

model StudentLeave {
  id              String   @id @default(cuid())
  school_id       String
  student_id      String
  from_date       DateTime
  to_date         DateTime
  total_days      Int
  reason          String
  reason_urdu     String?
  applied_by      String   // parent user_id
  applied_at      DateTime @default(now())
  status          String   @default("PENDING") // PENDING | APPROVED | REJECTED
  approved_by     String?  // teacher/admin user_id
  approved_at     DateTime?
  rejection_reason String?
  // RULE: Parent can apply via app OR WhatsApp reply
  // RULE: Leave auto-marks attendance as "ON_LEAVE" (not ABSENT)
  student         Student  @relation(fields: [student_id], references: [id])
}

// ─────────────────────────────────────────
// PTM (PARENT-TEACHER MEETING)
// ─────────────────────────────────────────

model PTMSchedule {
  id              String   @id @default(cuid())
  school_id       String
  title           String   // "Term 1 PTM" | "Special PTM"
  date            DateTime
  start_time      String   // "09:00"
  end_time        String   // "14:00"
  slot_duration   Int      @default(15) // Minutes per parent
  grade_ids       String[] // Which grades are included
  created_by      String   // admin user_id
  created_at      DateTime @default(now())
  is_cancelled    Boolean  @default(false)
  bookings        PTMBooking[]
}

model PTMBooking {
  id              String   @id @default(cuid())
  ptm_schedule_id String
  parent_id       String   // parent user_id
  student_id      String
  teacher_id      String   // teacher user_id
  time_slot       String   // "09:00" | "09:15" | "09:30" ...
  status          String   @default("BOOKED") // BOOKED | COMPLETED | NO_SHOW | CANCELLED
  parent_notes    String?  // What parent wants to discuss
  teacher_notes   String?  // Teacher's feedback after meeting
  created_at      DateTime @default(now())
  ptm_schedule    PTMSchedule @relation(fields: [ptm_schedule_id], references: [id])

  @@unique([ptm_schedule_id, teacher_id, time_slot])
}

// ─────────────────────────────────────────
// SMS & WHATSAPP TRACKING
// ─────────────────────────────────────────

model SMSLog {
  id              String   @id @default(cuid())
  school_id       String
  sent_to         String   // Phone number
  recipient_name  String?
  message         String
  channel         String   // SMS | WHATSAPP
  purpose         String   // FEE_REMINDER | ATTENDANCE_ALERT | DIARY | RESULT | GENERAL | OTP
  status          String   @default("QUEUED") // QUEUED | SENT | DELIVERED | READ | FAILED
  failure_reason  String?
  cost            Decimal  @default(0)
  sent_at         DateTime @default(now())
  delivered_at    DateTime?
  read_at         DateTime?  // WhatsApp read receipt
}

model SMSBalance {
  id              String   @id @default(cuid())
  school_id       String   @unique
  sms_credits     Int      @default(0)
  whatsapp_credits Int     @default(0)
  last_recharged  DateTime?
  low_balance_alert_at Int @default(100) // Alert when credits below this
  auto_recharge   Boolean  @default(false)
  updated_at      DateTime @updatedAt
}

// ─────────────────────────────────────────
// AUDIT LOG (PERMANENT — APPEND ONLY)
// ─────────────────────────────────────────

model AuditLog {
  id              String   @id @default(cuid())
  school_id       String
  user_id         String   // Who performed the action
  user_role       Role     // Role at time of action
  action          String   // CREATE | UPDATE | DELETE | LOGIN | LOGOUT | EXPORT | APPROVE | REJECT | PRINT
  entity_type     String   // User | Student | FeeVoucher | ExamResult | ReportCard | etc.
  entity_id       String   // ID of affected record
  description     String?  // Human-readable: "Updated fee voucher ACS-2026-00001"
  old_values      Json?    // Previous state (for UPDATE/DELETE)
  new_values      Json?    // New state (for CREATE/UPDATE)
  ip_address      String?
  user_agent      String?
  created_at      DateTime @default(now())
  // RULE: This table is APPEND-ONLY — no UPDATE, no DELETE — ever
  // RULE: NEVER log passwords, OTPs, payment credentials, CNIC values
  // RULE: Admin can search/filter but cannot modify or remove entries

  @@index([school_id, entity_type])
  @@index([school_id, user_id])
  @@index([school_id, created_at])
}

// ─────────────────────────────────────────
// ACADEMIC CALENDAR
// ─────────────────────────────────────────

model AcademicCalendar {
  id              String   @id @default(cuid())
  school_id       String
  academic_year_id String
  date            DateTime
  event_type      String   // HOLIDAY | PTM | EXAM_START | EXAM_END | EVENT | MEETING | RESULT_DAY | LAST_DAY | FIRST_DAY
  title           String
  title_urdu      String?
  description     String?
  affects_grades  String[] // Empty = all grades, otherwise specific grade_ids
  is_school_closed Boolean @default(false) // If true, no attendance marking required
  created_by      String   // admin user_id
  created_at      DateTime @default(now())

  @@unique([school_id, date, event_type])
}

// ─────────────────────────────────────────
// REPORT SNAPSHOTS (Pre-computed for Performance)
// ─────────────────────────────────────────

model ReportSnapshot {
  id              String   @id @default(cuid())
  school_id       String
  report_type     String   // ATTENDANCE_DAILY | ATTENDANCE_MONTHLY | FEE_DAILY | FEE_MONTHLY | ACADEMIC_TERMLY | PARENT_ENGAGEMENT
  period          String   // DAILY | WEEKLY | MONTHLY | TERMLY | YEARLY
  date            DateTime // The date/period this snapshot covers
  filters         Json?    // {grade_id?, section_id?} — for drill-down snapshots
  data            Json     // Pre-aggregated report data
  generated_at    DateTime @default(now())
  // BullMQ job generates daily snapshots at 11:59 PM
  // Live data used for today, snapshots for historical queries
  // This ensures 5000+ student reports load in <2 seconds

  @@unique([school_id, report_type, period, date])
  @@index([school_id, report_type, date])
}
```

---

## 7. AI AGENTS — IMPLEMENTATION GUIDE

### Architecture:
All AI calls are server-side only. Never call Claude API from client/browser.

```typescript
// /services/ai-agents/base-agent.ts
// All agents extend this base

interface AgentConfig {
  name: string;
  model: 'claude-sonnet-4-5' | 'claude-haiku-4-5-20251001';
  useOpenRouter: boolean; // true = cost optimized via OpenRouter
  systemPrompt: string;
  maxTokens: number;
}

// Model routing via OpenRouter:
// Simple tasks (alerts, hints) → claude-haiku-4-5-20251001 via OpenRouter (~$0.001/call)
// Complex tasks (papers, analysis) → claude-sonnet-4-5 direct Anthropic (~$0.01/call)
```

### Agent 1 — Exam Paper Agent:
```typescript
// Trigger: Coordinator clicks "Generate Paper"
// Input: grade, subject, chapters[], examType, totalMarks, duration, difficulty
// Process: 
//   1. Fetch SyllabusContent for selected chapters
//   2. Send to Claude Sonnet with structured prompt
//   3. Claude returns JSON: {sections, questions, answerKey, sloMap}
//   4. Save as ExamPaper with status=DRAFT
//   5. Notify Coordinator for review
// Output: Complete paper → Coordinator approval queue
```

### Agent 2 — AI Tutor Agent:
```typescript
// Trigger: Student clicks "Ask AI" on any lesson
// Rules:
//   - NEVER give direct exam answers
//   - ALWAYS use Socratic method
//   - Auto-detect language (Urdu/English/Roman Urdu)
//   - If inappropriate input → block + log + alert parent
//   - Session-based memory (resets each new session)
// Model: Claude Sonnet direct (quality critical)
```

### Agent 3 — Alert Agent:
```typescript
// Trigger: BullMQ job runs every night at midnight
// Checks:
//   - Students inactive 3 days → Yellow alert to parent
//   - Students inactive 7 days → Orange alert to parent + teacher
//   - Students inactive 14 days → Red alert to parent + teacher + admin
//   - Fee vouchers overdue 60 days → Suspend + alert
//   - Fee due in 5 days → Reminder
//   - Achievement unlocked → Celebration alert
// Language: Detect parent education_level → simple Urdu or full message
// Model: Claude Haiku via OpenRouter (cost optimized)
```

### Agent 4 — Content Review Agent:
```typescript
// Trigger: Teacher uploads any content (video, PDF, quiz)
// Checks: SLO alignment, age-appropriate, factual accuracy
// Islamic content → ALWAYS route to human (never auto-approve)
// Output: APPROVED | FLAGGED (human review) | REJECTED
// Model: Claude Haiku via OpenRouter
```

### Agent 5 — Progress Analyst:
```typescript
// Trigger: Every Sunday midnight via BullMQ
// Per student: analyze week's credits, quiz scores, attendance
// Output for teacher: "These 5 students need intervention this week"
// Output for parent: Weekly visual report (Urdu)
// Prediction: "At current pace, Ali will complete Grade 4 in 6 months"
// Model: Claude Sonnet via OpenRouter
```

### Agent 6 — Syllabus Planner:
```typescript
// Trigger: Academic year setup OR holiday added
// Input: Total working days, holidays, chapters per subject
// Output: Day-by-day teaching plan per subject per grade
// Auto-adjust: If holiday added → reschedule remaining topics
// Teacher view: Today's topic, this week's plan
// Model: Claude Sonnet via OpenRouter
```

---

## 8. BUSINESS RULES — NEVER VIOLATE

```
FEE RULES:
- Late fee: 100 PKR per day after due date
- Suspension: exactly 60 days overdue (not 59, not 61)
- Suspension affects ONLY online access — NOT physical school
- Access restored: within 1 hour of payment confirmation
- Discounts: NEVER delete — only cancel with reason
- Payroll: Once status=PAID — record is completely locked

CREDIT RULES:
- Video: Must watch 90%+ to earn credit (no fast-forward cheating)
- Quiz retry: Minimum 24 hours between attempts on same quiz
- Physical attendance: Cannot be earned from home — GPS + teacher required
- Manual credits: ALWAYS require admin approval + reason (logged permanently)
- Credits never expire

EXAM RULES:
- AI paper: ALWAYS goes to Coordinator first — teachers never see unapproved
- Answer key: Encrypted — only decrypted on exam day by Coordinator
- Result lock: Once Principal approves results — no teacher can edit
- Grade 9-10: Board enrollment managed through platform — 2 year minimum

COMPLAINT RULES:
- Acknowledge SLA: 24 hours
- Resolve SLA: 72 hours
- If missed: Auto-escalate to next level
- Complaints: NEVER delete — permanent audit trail

PRIVACY RULES:
- Student data: Never expose to other students
- Parent: Can only see own children
- Teacher: Can only see own class/subject students
- Payroll: Only visible to SUPER_ADMIN, SCHOOL_ADMIN
- All data operations: logged with user_id + timestamp

DIARY RULES:
- Teacher MUST post diary before 3:00 PM daily (system warns if missed)
- Diary auto-sent to parents at 3:00 PM via WhatsApp (summary format)
- Parent acknowledgment tracked — unread diaries flagged after 24 hours
- Diary entries: editable by teacher until midnight, then locked
- Attachments: max 3 photos per entry (board photos, worksheets)

REPORT CARD RULES:
- Auto-generated ONLY when ALL subject results entered for that term
- MUST be approved by Principal before visible to parents
- Once approved: LOCKED — no edits (correction requires admin override + audit log)
- PDF includes: school logo, student photo, all subjects, position, conduct, attendance summary
- WhatsApp share: optional — triggered by admin per section or individual

CERTIFICATE RULES:
- Certificates are NEVER deleted — only cancelled with reason
- TC (Transfer Certificate): can only be issued if all fees cleared
- TC issued: student marked as inactive, cannot re-enroll without admin override
- Serial numbers: sequential, never reused (even if cancelled)
- Every certificate issuance logged in audit trail

CLASS TEST RULES:
- Minimum 1 class test per subject per month (system reminds teacher)
- Marks entry: teacher can edit within 48 hours, then locked
- Absent students: marked separately (not counted as zero)
- Class test average: contributes to report card as "internal assessment"

ASSIGNMENT RULES:
- Late submission: allowed but flagged (teacher decides to accept or not)
- Ungraded assignments: used for homework tracking (no marks, just submitted/not)
- Parent can see assignment status (pending, submitted, graded)
- Overdue assignments: parent notified via WhatsApp

PROMOTION RULES:
- Promotion processed once per academic year ONLY
- Below 40% overall: DETAINED (repeat grade) — automatic
- Below 33% in any single subject: COMPARTMENT — automatic
- 80%+ overall: DISTINCTION — automatic
- Attendance below 75%: Cannot appear in board exam (Grade 9-10)
- Principal reviews and approves entire grade's promotion list
- Once approved: LOCKED — cannot be undone without SUPER_ADMIN
- Detained students: auto-assigned to new section in same grade

STUDENT LEAVE RULES:
- Parent can apply via app OR WhatsApp reply
- Approved leave: automatically marks attendance as ON_LEAVE (not ABSENT)
- Leave without application: counted as ABSENT
- Maximum consecutive leave without medical certificate: 7 days
- Medical leave: requires attachment (photo of doctor's note)

PTM RULES:
- Slots: 15 minutes per parent (configurable)
- One slot per parent per teacher (cannot double-book)
- No-show parents: flagged — teacher records "NO_SHOW"
- Post-meeting notes: teacher MUST enter within 24 hours
- Parent can see teacher's notes in app

AUDIT LOG RULES:
- APPEND-ONLY — no updates, no deletes, ever
- Every CREATE, UPDATE, DELETE on any entity is logged
- Stores: old values + new values (full diff)
- NEVER log: passwords, OTPs, payment credentials, CNIC numbers
- Retention: forever (legal compliance requirement)
- Only SUPER_ADMIN and SCHOOL_ADMIN can view audit logs
- Only SUPER_ADMIN can export audit logs

REPORT RULES:
- Reports use pre-computed snapshots for historical data (performance)
- Today's data: always live (real-time)
- PDF exports: include school watermark + "Confidential" stamp
- Excel exports: admin roles only (prevent data leakage)
- Teacher performance reports: Principal/Admin eyes only — NEVER shared with teachers
- Multi-branch reports: SUPER_ADMIN only
- Parent-facing reports: simplified version only (no raw data)

SMS / WHATSAPP RULES:
- Low balance alert: when credits drop below configured threshold
- Failed messages: auto-retry once after 5 minutes
- WhatsApp preferred, SMS only as fallback when WhatsApp fails
- Quiet hours: no messages between 10 PM - 7 AM (configurable per school)
- OTP messages: exempt from quiet hours
- Monthly SMS cost report: sent to SCHOOL_ADMIN on 1st of every month
```

---

## 9. API STRUCTURE

```
BASE URL: https://api.ai-cambridge-school.pk/v1

AUTH:
POST   /auth/send-otp
POST   /auth/verify-otp
POST   /auth/login (email+password)
POST   /auth/refresh
DELETE /auth/logout

USERS:
GET    /users/me
PUT    /users/me
GET    /users/:id (admin only)

STUDENTS:
GET    /students (with filters)
POST   /students (enrollment)
GET    /students/:id
PUT    /students/:id
GET    /students/:id/progress
GET    /students/:id/credits

FEE:
GET    /fee/structure
POST   /fee/structure (admin)
GET    /fee/vouchers/:studentId
POST   /fee/payment
GET    /fee/defaulters
POST   /fee/discount

EXAMS:
POST   /exams/generate-paper (AI)
GET    /exams/papers/:id
PUT    /exams/papers/:id/approve
POST   /exams/results
GET    /exams/results/:studentId

AI:
POST   /ai/tutor/chat
POST   /ai/generate-paper
POST   /ai/analyze-progress
GET    /ai/weekly-report/:studentId

CREDITS:
GET    /credits/:studentId
POST   /credits (award)
GET    /credits/grade-progress/:studentId

NOTIFICATIONS:
GET    /notifications (paginated)
PUT    /notifications/:id/read
POST   /notifications/send (admin)

DIARY:
GET    /diary/:sectionId/:date (get diary entries for section on date)
POST   /diary (teacher creates diary entry)
PUT    /diary/:id (teacher updates diary entry)
GET    /diary/student/:studentId (parent views child's diary — date range)
POST   /diary/:id/acknowledge (parent marks diary as seen)
GET    /diary/engagement/:sectionId (diary seen % report)

REPORT CARDS:
POST   /report-cards/generate/:termId (bulk generate for grade/section)
GET    /report-cards/:studentId/:termId
PUT    /report-cards/:id/approve (principal approves)
GET    /report-cards/:id/pdf (download PDF)
POST   /report-cards/:id/whatsapp (send to parent via WhatsApp)

CERTIFICATES:
POST   /certificates (issue new certificate)
GET    /certificates/:studentId (list student's certificates)
GET    /certificates/:id/pdf (download PDF)
PUT    /certificates/:id/cancel (cancel with reason — never delete)

CLASS TESTS:
POST   /class-tests (teacher creates test)
GET    /class-tests/:sectionId (list tests for section — date range)
POST   /class-tests/:id/results (enter marks — bulk)
GET    /class-tests/:id/results (view results)
GET    /class-tests/student/:studentId (student's test history + trend)

ASSIGNMENTS:
POST   /assignments (teacher creates assignment)
GET    /assignments/:sectionId (list assignments for section)
POST   /assignments/:id/submit (student submits)
PUT    /assignments/:id/submissions/:submissionId/grade (teacher grades)
GET    /assignments/student/:studentId (student's assignment history)

STUDENT LEAVE:
POST   /leaves/student (parent applies for leave)
GET    /leaves/student/:studentId (leave history)
PUT    /leaves/:id/approve (teacher approves)
PUT    /leaves/:id/reject (teacher rejects with reason)
GET    /leaves/section/:sectionId (pending leaves for section)

PTM:
POST   /ptm/schedule (admin creates PTM schedule)
GET    /ptm/schedule/:schoolId (upcoming PTMs)
GET    /ptm/:scheduleId/slots (available time slots)
POST   /ptm/:scheduleId/book (parent books a slot)
PUT    /ptm/booking/:id/notes (teacher adds post-meeting notes)
PUT    /ptm/booking/:id/cancel (cancel booking)

PROMOTIONS:
GET    /promotions/:gradeId/:academicYearId (get pass/fail list for grade)
POST   /promotions/process (bulk promote — principal approves list)
GET    /promotions/student/:studentId (promotion history)

ACADEMIC CALENDAR:
GET    /calendar/:schoolId/:academicYearId (full calendar)
POST   /calendar (add event/holiday)
PUT    /calendar/:id (update event)
DELETE /calendar/:id (remove event)

REPORTS & ANALYTICS:
GET    /reports/attendance/daily/:date (daily attendance summary)
GET    /reports/attendance/student/:studentId (student attendance detail)
GET    /reports/attendance/section/:sectionId (section attendance — date range)
GET    /reports/attendance/consecutive-absent (students absent 3+ days)
GET    /reports/attendance/late-patterns (late arrival analysis)
GET    /reports/attendance/comparison (section vs section / grade vs grade)
GET    /reports/attendance/staff (staff attendance summary)
GET    /reports/attendance/trend (school-wide trend — 12 months)
GET    /reports/fee/daily (today's collection summary)
GET    /reports/fee/monthly/:month/:year (monthly collection)
GET    /reports/fee/yearly/:year (yearly revenue)
GET    /reports/fee/defaulters (aging report — 30/60/90+ days)
GET    /reports/fee/patterns (early vs late vs chronic defaulter)
GET    /reports/fee/methods (payment method breakdown)
GET    /reports/fee/discounts (discount summary)
GET    /reports/fee/projection (expected vs actual)
GET    /reports/fee/grade-wise (collection % by grade/section)
GET    /reports/academic/subject/:examScheduleId (subject-wise analysis)
GET    /reports/academic/progress/:studentId (term over term trajectory)
GET    /reports/academic/class-tests/:sectionId (test trend analysis)
GET    /reports/academic/teacher/:teacherId (teacher effectiveness)
GET    /reports/academic/toppers/:gradeId/:termId (toppers list)
GET    /reports/academic/failures/:gradeId/:termId (fail/compartment list)
GET    /reports/parent/diary-engagement/:sectionId (diary seen %)
GET    /reports/parent/app-usage (login frequency analysis)
GET    /reports/communication/delivery (SMS/WhatsApp delivery stats)
GET    /reports/communication/sla (complaint SLA report)
GET    /reports/multi-branch (cross-branch comparison — super admin)
POST   /reports/export/pdf (generate PDF for any report)
POST   /reports/export/excel (generate Excel for any report)
POST   /reports/export/whatsapp (send report via WhatsApp)

SMS TRACKING:
GET    /sms/balance/:schoolId (current SMS/WhatsApp credits)
GET    /sms/logs/:schoolId (sent messages — paginated + filters)
GET    /sms/usage-report/:schoolId (usage stats — daily/monthly)
POST   /sms/recharge (add credits)

AUDIT LOGS:
GET    /audit-logs (search + filter — admin only)
GET    /audit-logs/entity/:entityType/:entityId (history of specific record)
POST   /audit-logs/export (export audit trail — super admin only)
```

---

## 10. CODING STANDARDS

When writing code for AI Cambridge School, ALWAYS follow these rules:

```typescript
// 1. TypeScript strict — always
// tsconfig: "strict": true

// 2. Every API route must have:
//    - Auth check (middleware)
//    - Permission check (checkPermission middleware)
//    - Input validation (Zod schema)
//    - Error handling (try/catch with proper error codes)
//    - Audit log for write operations

// 3. Database queries:
//    - Always include school_id filter
//    - Use Prisma transactions for multi-table writes
//    - Never use raw SQL unless absolutely necessary

// 4. Error responses — always this format:
{
  "success": false,
  "error": {
    "code": "FEE_001",
    "message": "Voucher not found",
    "message_ur": "ووچر نہیں ملا"  // Always include Urdu
  }
}

// 5. Success responses — always this format:
{
  "success": true,
  "data": { ... },
  "meta": { "page": 1, "total": 50 } // for lists
}

// 6. All dates: store as UTC, display in PKT (UTC+5)

// 7. Sensitive data (payroll, CNIC): encrypt at rest
//    Use: crypto.createCipheriv with AES-256-GCM

// 8. File uploads: always scan + validate type before storage
//    Allowed: PDF, JPG, PNG, MP4, WebM
//    Max size: Video 500MB, Document 20MB, Image 5MB

// 9. Background jobs (BullMQ):
//    - Fee suspension check: daily midnight
//    - Alert agent: daily midnight
//    - Progress analyst: Sunday midnight
//    - Fee voucher generation: 1st of every month
//    - Report snapshot generation: daily 11:59 PM
//    - Diary reminder: daily 2:45 PM (warn teachers who haven't posted)
//    - Diary auto-send to parents: daily 3:00 PM (WhatsApp summary)
//    - Unread diary alert: daily 9:00 PM (parents who haven't seen diary)
//    - SMS monthly usage report: 1st of every month to SCHOOL_ADMIN
//    - Attendance consecutive absence check: daily 8:00 PM
//    - Assignment overdue reminder: daily 6:00 PM to parents
//    - Library fine → fee challan sync: daily midnight

// 10. Never log: passwords, OTPs, payment details, CNIC
```

---

## 11. ENVIRONMENT VARIABLES NEEDED

```env
# Database
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...

# Auth
NEXTAUTH_SECRET=
NEXTAUTH_URL=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# AI — Primary
ANTHROPIC_API_KEY=

# AI — Cost Routing
OPENROUTER_API_KEY=

# Payments
JAZZCASH_MERCHANT_ID=
JAZZCASH_PASSWORD=
JAZZCASH_INTEGRITY_SALT=
EASYPAISA_ACCOUNT_NUM=
EASYPAISA_API_KEY=

# WhatsApp
WHATSAPP_API_URL=
WHATSAPP_API_TOKEN=
WHATSAPP_PHONE_ID=

# SMS Fallback
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

# Video
MUX_TOKEN_ID=
MUX_TOKEN_SECRET=

# Email
RESEND_API_KEY=

# Redis
UPSTASH_REDIS_URL=
UPSTASH_REDIS_TOKEN=

# Security
ENCRYPTION_KEY=  # AES-256 — 32 bytes
JWT_SECRET=

# App
NEXT_PUBLIC_APP_URL=
APP_ENV=development # development | staging | production
```

---

## 12. MODULE BUILD ORDER

Build EXACTLY in this sequence. Do not skip ahead.
Reports are built INTO each module — not bolted on afterwards.
Audit logs are active from Module 01 — every write operation is logged.

```
PHASE 1 — FOUNDATION + DAILY OPERATIONS (Weeks 1-4):
[ ] M01 — Auth & Users (OTP login, roles, permissions middleware, audit log system)
[ ] M02 — School Configuration (profile, grades, sections, academic calendar, timetable)
[ ] M03 — Report Infrastructure (ReportSnapshot model, PDF/Excel export utils, chart components)
[ ] M04 — Student Management (enrollment, records, profiles, admissions)
[ ] M05 — Attendance (student + staff marking) + Attendance Reports Dashboard
[ ] M06 — Student Diary (homework, remarks, parent acknowledgment, diary engagement report)
[ ] M07 — Communication (WhatsApp/SMS integration, announcements, SMS balance tracking)

PHASE 2 — FINANCIAL (Weeks 5-6):
[ ] M08 — Fee Structure + Voucher Generation + Challan Printing (3-copy bank format)
[ ] M09 — Fee Collection (JazzCash, EasyPaisa, Cash) + Daily/Monthly Collection Reports
[ ] M10 — Fee Defaulters + Suspension Logic + Defaulter Aging Report + Fee Trend Analysis
[ ] M11 — Discounts + Discount Report + Revenue Projection

PHASE 3 — ACADEMIC (Weeks 7-8):
[ ] M12 — Class Tests / Weekly Tests + Test Trend Analysis
[ ] M13 — Assignments / Homework (submission + grading system)
[ ] M14 — Exam System (schedule, paper gen, results entry) + Subject-wise Analysis
[ ] M15 — Report Card Generation (PDF + WhatsApp share + principal approval)
[ ] M16 — Certificates (TC, Character, Bonafide, Fee Paid)
[ ] M17 — Student Promotion / Year-end Workflow

PHASE 4 — PARENT + ENGAGEMENT (Week 8+):
[ ] M18 — Parent Portal (dashboard, simple mode for uneducated parents, parent reports)
[ ] M19 — Student Leave Application (parent applies, teacher approves)
[ ] M20 — PTM Scheduling (booking, time slots, post-meeting notes)
[ ] M21 — Complaint System + SLA Report
[ ] M22 — Parent Engagement Reports (diary seen %, app usage, communication delivery)

PHASE 5 — ADVANCED ANALYTICS (After Core):
[ ] M23 — Teacher Performance Reports (effectiveness by student results)
[ ] M24 — Multi-branch Comparison Dashboard (super admin)
[ ] M25 — Toppers / Fail Analysis / SLO Mastery Reports
[ ] M26 — Revenue Projection + Financial Analytics

PHASE 6 — OPERATIONS (After ERP Live):
[ ] M27 — HR & Payroll (staff records, salary calculation)
[ ] M28 — Inventory & Assets (tracking, tablet management)
[ ] M29 — Library (catalog, circulation, fine → fee challan integration)
[ ] M30 — Transport (routes, vehicles, GPS future)

PHASE 7 — EDTECH + AI (After ERP Stable):
[ ] M31 — Content & Syllabus (upload, SLO tag, AI index)
[ ] M32 — Student Portal (credits, home access)
[ ] M33 — AI Engine (all 6 Claude agents live)
[ ] M34 — Gamification (badges, leaderboards, streaks, brain-storming games)
[ ] M35 — Online Classes (live session, recording)
[ ] M36 — Teacher Portal (lesson delivery, AI planner)

PHASE 8 — MOBILE + SCALE:
[ ] M37 — Payment Gateway (full JazzCash + EasyPaisa integration)
[ ] M38 — Mobile App (React Native — all modules)
[ ] M39 — Pod Leader System
```

CROSS-CUTTING (built into EVERY module from day 1 — NOT separate):
- Audit Logs: Every create/update/delete logged permanently
- Reports: Each module ships with its reports
- Parent view: Every module has parent-facing view + notification
- WhatsApp alerts: Each significant event triggers parent alert
- PDF/Excel export: Every data table is exportable
- Bilingual: Every user-facing text has Urdu + English
- Multi-tenant: Every query filtered by school_id

---

## HOW TO USE THIS FILE IN CURSOR

When starting any new module, begin your Cursor prompt with:

```
"Read AI_CAMBRIDGE_SCHOOL_CONTEXT.md completely.
Now build [MODULE NAME] following all rules defined there.
Specifically: [your specific instructions for this module]"
```

This file is your contract. Every feature must align with it.
If something is unclear — ask before coding.

---

## 13. MISSING REQUIREMENTS — ADDED FROM REVIEW

### Gamification — Brain Storming Games:
After every 1-2 physical classes, students are shown brain-storming games
related to the topic just taught. Purpose: reinforce concepts immediately
while student is still in school OR just arrived home.
This is NOT optional — it is core to the model.

```
Class ends → Student opens app →
"Brain Storming Time! You just learned [Topic]"
→ Quick 5-minute game → Credits earned
```

### Pod Leader System (Phase 2):
For online students in remote cities where no physical school exists.
A trusted local person (retired teacher / educated parent) becomes Pod Leader.
20-30 online students gather at Pod Leader's location.
AI Cambridge School's online class plays on screen.
Pod Leader supervises — gets free education for own child + small stipend.

### Parent WhatsApp Reply (without opening app):
Parents can reply to alerts directly via WhatsApp.
System reads WhatsApp reply and updates accordingly.
Example: Alert says "Ali inactive 3 days — reply OK to confirm you know"
Parent replies "OK" on WhatsApp → system logs acknowledgment.

### Teacher Substitute System:
When teacher marks absent:
1. System immediately notifies class students/parents
2. Admin gets notification to arrange substitute
3. If substitute assigned → students notified
4. If no substitute → lesson from content library auto-assigned

### Library Fine → Fee Challan Integration:
Library overdue fines are NOT collected separately.
They are automatically added to the student's next monthly fee challan.
Same for lost book replacement cost.

### Device Policy by Grade (HARD RULES):
```
Nursery-KG:    Zero personal device. LCD in class only.
Grade 1-2:     School tab in class only. 20 min/day max.
Grade 3-4:     School tab + supervised home. 45 min/day.
Grade 5-6:     Personal tab starts. Family Link mandatory.
Grade 7+:      Laptop preferred. Advanced monitoring.
```

### Parent Agreement — Digital Signature:
When student assigned personal tab (Grade 5+):
Parent must digitally sign Tab Usage Agreement in app.
Agreement includes: Family Link install, screen time limits,
bedroom restriction, monthly report sharing.
Tab NOT activated until agreement signed.

### Revenue Model — Online Teachers:
```
Monthly subscription fee collected by platform
Split: Teacher 50% | Platform 40% | Operations 10%
Live class (per session): Teacher 70% | Platform 30%
Grade bundle: Teacher 50% | Platform 50%
Pod Leader: Free education for child + PKR stipend (when revenue starts)
```

### Academic Results — Pass/Fail Rules (Pakistan Board):
```
Overall: Below 40% = FAIL (repeat grade)
Any single subject: Below 33% = COMPARTMENT
80%+ overall = DISTINCTION
Attendance below 75% = Cannot appear in board exam
Compartment: Can appear in supplementary exam
```

### Complaint Categories (Expanded):
```
STUDENT can complain about:
  - Teacher behavior / teaching quality
  - Bullying (peer)
  - Platform technical issue
  - Content error

PARENT can complain about:
  - Teacher behavior
  - Fee issue
  - Platform issue
  - Admission issue

TEACHER can complain about:
  - Student behavior
  - Parent behavior / false complaint
  - Payment delay
  - Admin issue

All complaints: PERMANENT record — cannot delete
```

---

## 14. REPORTS & ANALYTICS ENGINE

Reports are a FIRST-CLASS feature — not an afterthought.
School owners, principals, and parents look at reports DAILY.
Every report must be fast (<2 seconds), accurate, and professionally formatted.

### 14.1 Attendance Reports

```
DAILY ATTENDANCE SUMMARY:
- Per section: present count, absent count, late count, on-leave count
- Percentage bar per section
- School-wide total for the day
- Drill-down: click section → see individual student status
- Filter: by grade, section, date

CONSECUTIVE ABSENCE TRACKER:
- Students absent 3+ consecutive days → Yellow flag
- Students absent 7+ consecutive days → Orange flag  
- Students absent 14+ consecutive days → Red flag
- List view with filters (grade, section, flag color)
- One-click: send alert to parent from this report
- Auto-alert: system sends WhatsApp automatically at each threshold

MONTHLY ATTENDANCE PERCENTAGE:
- Per student: attendance % for current month
- Below 75% = RED warning (board exam eligibility at risk)
- Below 50% = auto-alert to parent + admin
- Sortable: worst attendance first
- Export: PDF class attendance register (print for record)

LATE ARRIVAL PATTERNS:
- Students late 5+ times this month → flagged
- Time distribution: how late? (5 min, 15 min, 30+ min)
- Day pattern: which days are worst? (Monday pattern?)
- Comparison: this month vs last month

SECTION vs SECTION COMPARISON:
- Bar chart: which section has best attendance this month
- Highlights best and worst section
- Teacher accountability: class teacher's section performance

GRADE vs GRADE COMPARISON:
- Same as above but at grade level
- Identifies systemic issues (e.g. Grade 9 attendance always low)

STAFF ATTENDANCE REPORT:
- Teacher-wise: present, absent, late, on-leave count
- Monthly summary with % 
- Leave balance remaining
- Substitute teacher assignments

ATTENDANCE TREND (12 Months):
- School-wide attendance % line chart over last 12 months
- Seasonal patterns visible (Ramadan drop, winter drop)
- Year-over-year comparison when 2+ years of data exist
```

### 14.2 Fee Reports

```
DAILY COLLECTION SUMMARY:
- Today's total collection amount
- Breakdown by payment method (JazzCash | EasyPaisa | Cash | Bank)
- Who collected: accountant-wise breakdown (for cash)
- Receipts generated today
- Comparison: today vs same day last month

MONTHLY COLLECTION DASHBOARD:
- Expected collection (all active students × fee structure)
- Actual collection amount
- Collection percentage (actual / expected × 100)
- Gap amount (expected - actual)
- Comparison: this month vs last month vs same month last year
- Grade-wise / Section-wise collection percentage table

YEARLY REVENUE SUMMARY:
- Month-by-month collection bar chart
- Cumulative revenue line
- Year-over-year comparison
- Revenue breakdown: tuition vs registration vs exam vs transport vs other

DEFAULTER AGING REPORT:
- Category 1: 1-30 days overdue (Warning)
- Category 2: 31-60 days overdue (Serious)
- Category 3: 61-90 days overdue (Critical — suspension imminent/active)
- Category 4: 90+ days overdue (Legal action territory)
- Per category: student count + total amount
- Drill-down: see individual students with parent contact info
- One-click: send reminder to all defaulters in a category
- Export: PDF defaulter list for board meeting

FEE PAYMENT PATTERN ANALYSIS:
- Per student historical analysis — categorize each student:
  "ALWAYS_EARLY"     — pays within first 5 days of month (90%+ of the time)
  "ON_TIME"          — pays before due date (70%+ of the time)
  "USUALLY_LATE"     — pays after due date but within 30 days
  "CHRONIC_DEFAULTER" — 60+ days overdue multiple times
- Predictive: flag students likely to default next month
- Trend: is the student improving or getting worse?
- This helps proactive fee collection (call USUALLY_LATE parents early)

PAYMENT METHOD BREAKDOWN:
- Pie chart: JazzCash vs EasyPaisa vs Cash vs Bank
- Trend: month over month (are more parents going digital?)
- Insight: which method has fastest confirmation?

DISCOUNT REPORT:
- Total discount amount this month / this year
- By type: Sibling | Staff Child | Merit | Need-based | Hafiz | Custom
- Per student: who gets what discount, approved by whom
- Cancelled discounts list (audit trail)
- Impact: discount as % of total expected revenue

REVENUE PROJECTION:
- Based on: enrolled students × fee structure
- Expected monthly revenue
- vs Actual: gap analysis with reasons (defaults, discounts, waivers)
- Projected yearly revenue at current collection rate
- "What if" scenario: if collection rate improves by 5%, revenue impact

GRADE-WISE / SECTION-WISE COLLECTION:
- Table: each grade/section → expected | collected | % | gap
- Highlight: best and worst performing sections
- Useful for identifying problem areas

ACCOUNTANT PERFORMANCE (Cash Collections):
- Which accountant collected how much today / this month
- Receipt count per accountant
- For audit: accountant vs system-recorded amounts must match
```

### 14.3 Academic / Result Reports

```
SUBJECT-WISE RESULT ANALYSIS:
- Per exam: average marks, highest, lowest, pass %, distinction %
- Distribution chart: how many students in each grade band (A+, A, B, C, D, F)
- Comparison across sections (same subject, same exam — fair comparison)
- SLO coverage: which SLOs were tested, which were weak

STUDENT PROGRESS TRAJECTORY:
- Per student: marks graph across terms (Term 1 → Mid → Term 2 → Final)
- Subject-wise breakdown
- Trend detection: "Improving", "Declining", "Stable", "Erratic"
- Comparison with class average
- AI insight (Phase 7): "Ali's Math is declining — suggest intervention"

CLASS TEST TREND ANALYSIS:
- Per student: weekly test scores plotted over time
- Per section: class average trend over time
- Identify: consistently improving, consistently declining, sudden drops
- Teacher view: which topics students struggled most on

TEACHER EFFECTIVENESS REPORT (SENSITIVE — Principal/Admin only):
- Per teacher: average result of their students vs school average
- Pass % of their sections compared to other sections (same grade)
- Improvement rate: are their students' scores improving over terms?
- Class test frequency: how often does this teacher test?
- Diary posting frequency: how active is this teacher?
- NOTE: This report is for guidance, NOT punishment — handle sensitively

TOPPERS / POSITION HOLDERS:
- Grade-wise: Top 3 overall with photos
- Subject-wise: Top scorer per subject
- Section-wise: positions (1st, 2nd, 3rd)
- Historical: toppers over multiple terms (consistency)

FAIL / COMPARTMENT ANALYSIS:
- List: students who failed or got compartment
- Subject-wise: which subjects have highest fail rate?
- Pattern: same students failing repeatedly? New failures?
- Action required: supplementary exam eligibility
- Intervention list: students who need immediate academic support

SLO MASTERY REPORT:
- Per grade + subject: which SLOs mastered by what % of students
- Weak SLOs: those mastered by <50% of students
- Teaching gap identification: weak SLOs → chapters not taught well
```

### 14.4 Parent & Communication Reports

```
DIARY ENGAGEMENT REPORT:
- % of parents who viewed diary today
- Trend: daily engagement % over last 30 days
- List: parents who NEVER open diary (disengaged)
- List: parents who always open diary (engaged)
- Section comparison: which section's parents are most engaged
- Action: send reminder to disengaged parents

APP LOGIN FREQUENCY:
- Active parents: login 3+ times per week
- Moderate: login 1-2 times per week
- Inactive: no login in last 7 days
- Dormant: no login in last 30 days
- Engagement score per parent (composite of diary + app + PTM + fee timeliness)

SMS / WHATSAPP DELIVERY REPORT:
- Total messages sent today / this month
- Delivery rate %
- Failed messages list (with retry option)
- Cost summary: total SMS cost this month
- Channel breakdown: SMS vs WhatsApp
- Purpose breakdown: fee reminders vs attendance vs diary vs general

COMPLAINT SLA REPORT:
- Average acknowledgment time (target: <24 hours)
- Average resolution time (target: <72 hours)
- % resolved within SLA
- Escalation count (auto-escalated due to SLA miss)
- Category-wise: which complaint types take longest?
- Open complaints: aging list
```

### 14.5 Report Output Formats

Every report supports ALL of these formats:

```
INTERACTIVE DASHBOARD (on-screen):
- Charts: Recharts library (bar, line, pie, area)
- Tables: sortable, filterable, searchable
- Date range picker: custom period selection
- Drill-down: click any number to see detail
- Real-time: today's data is live, historical uses snapshots
- Responsive: works on mobile browser too

PDF EXPORT:
- Professional format with school logo + name
- Report title, date range, applied filters
- Watermark: "Confidential — [School Name]"
- Generated timestamp + user who exported
- One-click download button on every report
- Bulk: print all student report cards in one PDF

EXCEL / CSV EXPORT:
- All columns included (no truncation)
- Proper data types (numbers as numbers, dates as dates)
- Sheet name matches report name
- Available for admin roles only (prevents data misuse)

WHATSAPP SHARE (parent-facing reports only):
- Compact image format (fits WhatsApp preview)
- Key stats only (not raw data)
- Available for: attendance summary, result summary, fee status
- Auto-sent on configurable schedule (weekly on Sunday)
- Manual send: teacher/admin can send specific parent's report
```

### 14.6 Report Performance Architecture

```
PROBLEM: 5000+ students = slow aggregation queries

SOLUTION: ReportSnapshot model (pre-computed data)
- BullMQ job runs at 11:59 PM daily
- Aggregates: attendance, fee collection, test averages
- Stores as JSON in ReportSnapshot table
- Dashboard reads snapshots for historical data (instant load)
- Today's data: live query (small dataset — fast)
- Result: any report loads in <2 seconds

SNAPSHOT TYPES:
- ATTENDANCE_DAILY: per section totals for each day
- ATTENDANCE_MONTHLY: per student monthly % 
- FEE_DAILY: daily collection totals
- FEE_MONTHLY: monthly collection vs expected
- ACADEMIC_TERMLY: per exam aggregate results
- PARENT_ENGAGEMENT: diary seen %, app login counts
- SMS_DAILY: messages sent, delivered, failed counts

RETENTION:
- Daily snapshots: keep for 2 years
- Monthly snapshots: keep forever
- Raw data: keep forever (audit requirement)
```
