/**
 * Import legacy data from CSV files in ./migration-data/
 * Do NOT commit CSVs with real PII — folder is gitignored.
 *
 * Required: migration-data/schools.csv, migration-data/students.csv
 * Optional: migration-data/fee_vouchers.csv
 */
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

import { parse } from 'csv-parse/sync';
import { config } from 'dotenv';
import { Prisma, prisma } from '@ai-cambridge-school/database';

config({ path: resolve(process.cwd(), '.env.local') });
config({ path: resolve(process.cwd(), '.env') });

const DIR = resolve(process.cwd(), 'migration-data');

function readCsv(name: string): Record<string, string>[] {
  const p = resolve(DIR, name);
  if (!existsSync(p)) {
    throw new Error(`Missing ${p} — see DEPLOY.md`);
  }
  const raw = readFileSync(p, 'utf-8');
  return parse(raw, { columns: true, skip_empty_lines: true, trim: true }) as Record<
    string,
    string
  >[];
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set');
  }

  console.log('Importing schools…');
  const schoolRows = readCsv('schools.csv');
  const schoolBySlug = new Map<string, string>();

  for (const row of schoolRows) {
    const slug = row.slug?.trim();
    if (!slug) continue;
    const school = await prisma.school.upsert({
      where: { slug },
      create: {
        name: row.name?.trim() || slug,
        slug,
        city: row.city?.trim() || 'Karachi',
        province: row.province?.trim() || 'SINDH',
      },
      update: {
        name: row.name?.trim() || slug,
        city: row.city?.trim() || undefined,
        province: row.province?.trim() || undefined,
      },
      select: { id: true, slug: true },
    });
    schoolBySlug.set(school.slug, school.id);
  }

  console.log('Importing students + parents…');
  const studentRows = readCsv('students.csv');

  for (const row of studentRows) {
    const schoolSlug = row.school_slug?.trim();
    const schoolId = schoolSlug ? schoolBySlug.get(schoolSlug) : undefined;
    if (!schoolId) {
      console.warn('Skip row: unknown school_slug', schoolSlug, row.admission_no);
      continue;
    }

    const admissionNo = row.admission_no?.trim();
    if (!admissionNo) continue;

    const existing = await prisma.student.findFirst({
      where: { school_id: schoolId, admission_no: admissionNo },
    });
    if (existing) {
      console.log('Exists:', admissionNo);
      continue;
    }

    const studentPhone = row.student_phone?.replace(/\s/g, '') || '';
    const studentName = row.student_name?.trim() || 'Student';

    await prisma.$transaction(async (tx) => {
      let parentId: string | null = null;
      const pPhone = row.parent_phone?.replace(/\s/g, '');
      const pName = row.parent_name?.trim();

      if (pPhone && pName) {
        let parentUser = await tx.user.findFirst({
          where: { school_id: schoolId, phone: pPhone },
        });
        if (!parentUser) {
          parentUser = await tx.user.create({
            data: {
              school_id: schoolId,
              phone: pPhone,
              full_name: pName,
              role: 'PARENT',
            },
          });
        }
        let parent = await tx.parent.findUnique({
          where: { user_id: parentUser.id },
        });
        if (!parent) {
          parent = await tx.parent.create({
            data: {
              user_id: parentUser.id,
              school_id: schoolId,
              whatsapp_number: pPhone,
            },
          });
        }
        parentId = parent.id;
      }

      const studentUser = await tx.user.create({
        data: {
          school_id: schoolId,
          phone: studentPhone || `student-${admissionNo}`,
          full_name: studentName,
          role: 'STUDENT',
        },
      });

      await tx.student.create({
        data: {
          user_id: studentUser.id,
          school_id: schoolId,
          parent_id: parentId,
          admission_no: admissionNo,
          grade_label: row.grade_label?.trim() || '—',
          section_label: row.section_label?.trim() || null,
        },
      });
    });
  }

  const feePathCsv = resolve(DIR, 'fee_vouchers.csv');
  if (existsSync(feePathCsv)) {
    console.log('Importing fee vouchers…');
    const feeRows = readCsv('fee_vouchers.csv');
    for (const row of feeRows) {
      const schoolSlug = row.school_slug?.trim();
      const schoolId = schoolSlug ? schoolBySlug.get(schoolSlug) : undefined;
      if (!schoolId) continue;
      const admissionNo = row.admission_no?.trim();
      if (!admissionNo) continue;
      const student = await prisma.student.findFirst({
        where: { school_id: schoolId, admission_no: admissionNo },
      });
      if (!student) {
        console.warn('No student for fee row', admissionNo);
        continue;
      }
      const month = Number(row.month);
      const year = Number(row.year);
      const gross = new Prisma.Decimal(row.gross_amount || '0');
      const net = new Prisma.Decimal(row.net_amount || row.gross_amount || '0');
      const due = row.due_date ? new Date(row.due_date) : new Date();
      const status = row.status?.trim() || 'PENDING';

      await prisma.feeVoucher.upsert({
        where: {
          school_id_student_id_month_year: {
            school_id: schoolId,
            student_id: student.id,
            month,
            year,
          },
        },
        create: {
          school_id: schoolId,
          student_id: student.id,
          month,
          year,
          gross_amount: gross,
          net_amount: net,
          due_date: due,
          status,
        },
        update: {
          gross_amount: gross,
          net_amount: net,
          due_date: due,
          status,
        },
      });
    }
  }

  console.log('Done.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
