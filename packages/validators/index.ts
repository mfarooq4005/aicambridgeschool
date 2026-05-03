import { z } from 'zod';

/** Shared Zod schemas — expand per AI_CAMBRIDGE_SCHOOL_CONTEXT.md */
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type Pagination = z.infer<typeof paginationSchema>;

/** MVP — expand for full admissions module */
export const createSchoolBodySchema = z.object({
  name: z.string().min(2).max(200),
  slug: z
    .string()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9-]+$/, 'slug: only lowercase letters, numbers, hyphens'),
  city: z.string().min(1).max(100).optional(),
  province: z.string().min(1).max(100).optional(),
});

export type CreateSchoolBody = z.infer<typeof createSchoolBodySchema>;

export const createStudentBodySchema = z.object({
  school_id: z.string().cuid(),
  phone: z.string().min(10).max(20),
  full_name: z.string().min(2).max(200),
  admission_no: z.string().min(1).max(50),
  grade_label: z.string().min(1).max(50),
  section_label: z.string().max(20).optional(),
});

export type CreateStudentBody = z.infer<typeof createStudentBodySchema>;
