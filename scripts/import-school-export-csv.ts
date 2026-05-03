/**
 * Import from school export CSVs (Sr.No, Gr.No, Student Name, Father Name, Class, Section, Cell No).
 *
 * Usage:
 *   npx tsx scripts/import-school-export-csv.ts ^
 *     --school-slug al-qalam --school-name "School Name" ^
 *     --active "C:\path\Students_List.csv" ^
 *     --struck-off "C:\path\Struck Off List.csv"
 *
 * Or set IMPORT_SCHOOL_SLUG, IMPORT_SCHOOL_NAME, IMPORT_ACTIVE_CSV, IMPORT_STRUCK_OFF_CSV in .env.local
 */
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

import { parse } from 'csv-parse/sync';
import { config } from 'dotenv';
import { prisma } from '@ai-cambridge-school/database';

config({ path: resolve(process.cwd(), '.env.local') });
config({ path: resolve(process.cwd(), '.env') });

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(name);
  if (i === -1 || !process.argv[i + 1]) return undefined;
  return process.argv[i + 1];
}

function normHeaderKey(k: string): string {
  return k
    .trim()
    .replace(/^\uFEFF/, '')
    .toLowerCase()
    .replace(/\./g, '_')
    .replace(/\s+/g, '_')
    .replace(/_+/g, '_');
}

function readCsvFile(filePath: string): Record<string, string>[] {
  if (!existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  let raw = readFileSync(filePath, 'utf-8');
  if (raw.charCodeAt(0) === 0xfeff) raw = raw.slice(1);
  const rows = parse(raw, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    relax_quotes: true,
  }) as Record<string, string>[];
  return rows.map((row) => {
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(row)) {
      out[normHeaderKey(k)] = String(v ?? '')
        .replace(/^"|"$/g, '')
        .trim();
    }
    return out;
  });
}

/** Stable "mobile" for DB @@unique([school_id, phone]); siblings can share a real parent number. */
function phoneForParentCell(raw: string, schoolSlug: string, grNo: string): string {
  const s = raw.replace(/^"|"$/g, '').trim();
  if (!s) return `noparen-${schoolSlug}-${grNo}`.slice(0, 32);
  const firstPart = s.split(/[-–—/|,]/)[0].trim();
  let digits = firstPart.replace(/\D/g, '');
  if (digits.startsWith('92') && digits.length >= 12) digits = `0${digits.slice(2)}`;
  if (digits.length >= 10 && digits.startsWith('3') && !digits.startsWith('0'))
    digits = `0${digits}`;
  if (digits.length >= 10) return digits.slice(0, 15);
  return `badcell-${schoolSlug}-${grNo}`.slice(0, 32);
}

function studentSyntheticPhone(schoolSlug: string, grNo: string): string {
  return `stu-${schoolSlug}-${grNo}`.replace(/[^a-z0-9\-]/gi, '').slice(0, 32);
}

type Row = Record<string, string>;

function getGrNo(r: Row): string | null {
  const v = r.gr_no ?? r.grno;
  const t = v?.trim();
  return t ? t : null;
}

async function upsertStudentFromRow(
  schoolId: string,
  schoolSlug: string,
  r: Row,
  isActive: boolean
): Promise<'created' | 'updated' | 'unchanged' | 'skipped'> {
  const grNo = getGrNo(r);
  if (!grNo) return 'skipped';

  const studentName = (r.student_name ?? '').trim() || 'Student';
  const fatherName = (r.father_name ?? '').trim();
  const gradeLabel = (r.class ?? '').trim() || '—';
  const sectionLabel = (r.section ?? '').trim() || null;
  const cell = r.cell_no ?? '';

  const parentPhone = phoneForParentCell(cell, schoolSlug, grNo);
  const parentDisplayName = fatherName || 'Guardian';
  const studPhone = studentSyntheticPhone(schoolSlug, grNo);

  const existing = await prisma.student.findFirst({
    where: { school_id: schoolId, admission_no: grNo },
    include: { user: true },
  });

  if (existing) {
    if (existing.user.is_active !== isActive) {
      await prisma.user.update({
        where: { id: existing.user_id },
        data: { is_active: isActive },
      });
      return 'updated';
    }
    return 'unchanged';
  }

  await prisma.$transaction(async (tx) => {
    let parentId: string | null = null;

    let parentUser = await tx.user.findFirst({
      where: { school_id: schoolId, phone: parentPhone },
    });
    if (!parentUser) {
      parentUser = await tx.user.create({
        data: {
          school_id: schoolId,
          phone: parentPhone,
          full_name: parentDisplayName,
          role: 'PARENT',
          is_active: true,
        },
      });
    }
    let parent = await tx.parent.findUnique({ where: { user_id: parentUser.id } });
    if (!parent) {
      parent = await tx.parent.create({
        data: {
          user_id: parentUser.id,
          school_id: schoolId,
          whatsapp_number:
            parentPhone.startsWith('badcell-') || parentPhone.startsWith('noparen-')
              ? null
              : parentPhone,
        },
      });
    }
    parentId = parent.id;

    const studentUser = await tx.user.create({
      data: {
        school_id: schoolId,
        phone: studPhone,
        full_name: studentName,
        role: 'STUDENT',
        is_active: isActive,
      },
    });

    await tx.student.create({
      data: {
        user_id: studentUser.id,
        school_id: schoolId,
        parent_id: parentId,
        admission_no: grNo,
        grade_label: gradeLabel,
        section_label: sectionLabel,
      },
    });
  });

  return 'created';
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set (.env or .env.local)');
  }

  const schoolSlug = arg('--school-slug') ?? process.env.IMPORT_SCHOOL_SLUG ?? 'cambridge-school';
  const schoolName =
    arg('--school-name') ??
    process.env.IMPORT_SCHOOL_NAME ??
    schoolSlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  const activePath = arg('--active') ?? process.env.IMPORT_ACTIVE_CSV ?? '';
  const struckPath = arg('--struck-off') ?? process.env.IMPORT_STRUCK_OFF_CSV ?? '';

  if (!activePath && !struckPath) {
    throw new Error(
      'Provide --active and/or --struck-off CSV paths (or IMPORT_*_CSV in .env.local)'
    );
  }

  const school = await prisma.school.upsert({
    where: { slug: schoolSlug },
    create: {
      name: schoolName,
      slug: schoolSlug,
      city: process.env.IMPORT_SCHOOL_CITY ?? 'Karachi',
      province: process.env.IMPORT_SCHOOL_PROVINCE ?? 'SINDH',
    },
    update: { name: schoolName },
    select: { id: true },
  });
  const schoolId = school.id;

  let created = 0;
  let updated = 0;
  let unchanged = 0;
  let skipped = 0;

  if (activePath) {
    console.log('Importing active students from', activePath);
    const rows = readCsvFile(resolve(activePath));
    for (const r of rows) {
      const o = await upsertStudentFromRow(schoolId, schoolSlug, r, true);
      if (o === 'created') created++;
      else if (o === 'updated') updated++;
      else if (o === 'unchanged') unchanged++;
      else skipped++;
    }
  }

  if (struckPath) {
    console.log('Applying struck-off list from', struckPath);
    const rows = readCsvFile(resolve(struckPath));
    for (const r of rows) {
      const o = await upsertStudentFromRow(schoolId, schoolSlug, r, false);
      if (o === 'created') created++;
      else if (o === 'updated') updated++;
      else if (o === 'unchanged') unchanged++;
      else skipped++;
    }
  }

  console.log(
    `Done. created=${created} status_updated=${updated} unchanged=${unchanged} skipped_no_gr_no=${skipped}`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
