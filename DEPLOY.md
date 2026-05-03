# Deploy + data migration (no scraping)

## Important: we do NOT log in to your old app or scrape it

- Putting **passwords in chat** is unsafe.
- Automated scraping often breaks **terms of service** and **data-protection** rules.
- The reliable path is: **export CSV / Excel from the old software** (or ask the vendor for backup), then use the import script below.

---

## 1) Environment (Supabase Postgres)

At the **repo root**, `.env` or `.env.local`:

```env
DATABASE_URL=postgresql://...   # Supabase transaction or direct URL
DIRECT_URL=postgresql://...      # optional; Prisma migrate if you use it

# API (Railway etc.)
PORT=4000
NODE_ENV=production
APP_ENV=production
NEXT_PUBLIC_APP_URL=https://your-web.vercel.app
NEXT_PUBLIC_API_URL=https://your-api.up.railway.app

# Supabase (web)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

---

## 2) Database schema on Supabase

From repo root:

```bash
npm install
npm run db:generate
npm run db:push
# or: npm run db:migrate --workspace=@ai-cambridge-school/database  # when you use migrations
```

---

## 3) Vercel — Next.js (`apps/web`)

1. Import Git repo in Vercel.
2. **Root Directory**: `apps/web`
3. **Install command**: `cd ../.. && npm ci`
4. **Build command**: `cd ../.. && npm run web:build`
5. Add env vars: all `NEXT_PUBLIC_*`, and any server vars the web app needs.

`apps/web/vercel.json` already sets install/build relative to monorepo.

---

## 4) Railway — Express API (`apps/api`)

1. New service from same repo.
2. **Root directory**: repository root (not `apps/api`).
3. Railway reads `railway.toml` for build/start, or set manually:
   - **Build**: `npm ci && npm run db:generate --workspace=@ai-cambridge-school/database && npm run api:build`
   - **Start**: `npm run api:start --workspace=api`
4. Set **`DATABASE_URL`** (same Supabase string as local).

---

## 5) Move data from the old app — CSV import

Put files in `migration-data/` (folder is gitignored — create locally):

### `migration-data/schools.csv`

```csv
name,slug,city,province
Al Qalam Cambridge,al-qalam,Karachi,SINDH
```

### `migration-data/students.csv`

```csv
school_slug,admission_no,grade_label,section_label,student_phone,student_name,parent_phone,parent_name
al-qalam,ADM-001,Grade 5,A,03001234567,Ahmed Khan,03007654321,Fatima Khan
```

### Optional `migration-data/fee_vouchers.csv`

```csv
school_slug,admission_no,month,year,gross_amount,net_amount,due_date,status
al-qalam,ADM-001,5,2026,15000,15000,2026-05-10,PENDING
```

Run:

```bash
npm run import:legacy
```

Uses `scripts/import-legacy-csv.ts` (UTF-8 CSV, header row required).

### School export format (your `Students_List.csv` + `Struck Off List.csv`)

Headers (exact labels from export):

`Sr.No, Gr.No, Student Name, Father Name, Class, Section, Cell No`

- **Gr.No** → admission number
- **Student / Father** → student & parent names (Father stored as parent / guardian)
- **Class / Section** → grade & section
- **Cell No** → parent phone (first number if several are separated by `-` / `/`)
- Student login phone in DB is synthetic: `stu-{slug}-{Gr.No}` (avoids breaking `@@unique([school_id, phone])` when siblings share one number)
- **Struck off** file: import **after** the active list. Same columns. Marks matching students as inactive (`User.is_active = false`). Rows only in struck-off are created already inactive.

```bash
npm run import:school-export -- --school-slug your-school-slug --school-name "Your School Name" --active "C:\path\Students_List.csv" --struck-off "C:\path\Struck Off List.csv"
```

Optional in `.env.local`: `IMPORT_SCHOOL_SLUG`, `IMPORT_SCHOOL_NAME`, `IMPORT_ACTIVE_CSV`, `IMPORT_STRUCK_OFF_CSV`.

Run **active first**, then **struck-off** (single command above does both in order).

---

## 6) OpenClaw

Defer until WhatsApp + core ERP flows are stable; Gateway URL only on the API host (see context Section 16).
