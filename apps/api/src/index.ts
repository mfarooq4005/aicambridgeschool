import { createSchoolBodySchema, createStudentBodySchema } from '@ai-cambridge-school/validators';
import { prisma } from '@ai-cambridge-school/database';
import cors from 'cors';
import { config } from 'dotenv';
import express, { type NextFunction, type Request, type Response } from 'express';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '../../../.env') });
config({ path: resolve(__dirname, '../../../.env.local') });

const app = express();
const PORT = Number(process.env.PORT) || 4000;

const allowedOrigins = [process.env.NEXT_PUBLIC_APP_URL, process.env.CORS_EXTRA_ORIGIN].filter(
  Boolean
) as string[];

app.use(
  cors({
    origin(origin, cb) {
      const isDev = process.env.APP_ENV !== 'production' && process.env.NODE_ENV !== 'production';
      if (isDev) {
        cb(null, true);
        return;
      }
      if (!origin || allowedOrigins.includes(origin)) {
        cb(null, true);
        return;
      }
      cb(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '2mb' }));

app.get('/health', (_req, res) => {
  res.json({ success: true, data: { service: 'ai-cambridge-school-api' } });
});

app.get('/v1/health', async (_req, res) => {
  let db: 'ok' | 'not_configured' | 'error' = 'not_configured';
  if (process.env.DATABASE_URL) {
    try {
      await prisma.$queryRaw`SELECT 1`;
      db = 'ok';
    } catch {
      db = 'error';
    }
  }
  res.json({
    success: true,
    data: { service: 'ai-cambridge-school-api', version: '1-mvp', database: db },
  });
});

app.get('/v1/schools', async (_req, res, next) => {
  try {
    const schools = await prisma.school.findMany({
      where: { is_active: true },
      orderBy: { name: 'asc' },
      select: { id: true, name: true, slug: true, city: true, province: true },
    });
    res.json({ success: true, data: schools });
  } catch (e) {
    next(e);
  }
});

app.post('/v1/schools', async (req, res, next) => {
  try {
    const parsed = createSchoolBodySchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION',
          message: parsed.error.flatten().fieldErrors,
          message_ur: 'درستگی ناکام',
        },
      });
      return;
    }
    const { name, slug, city, province } = parsed.data;
    const school = await prisma.school.create({
      data: {
        name,
        slug,
        ...(city != null ? { city } : {}),
        ...(province != null ? { province } : {}),
      },
      select: { id: true, name: true, slug: true, city: true, province: true },
    });
    res.status(201).json({ success: true, data: school });
  } catch (e) {
    next(e);
  }
});

app.get('/v1/schools/:schoolId/students', async (req, res, next) => {
  try {
    const { schoolId } = req.params;
    const students = await prisma.student.findMany({
      where: { school_id: schoolId },
      include: {
        user: { select: { full_name: true, phone: true, role: true } },
      },
      orderBy: { admission_no: 'asc' },
    });
    res.json({ success: true, data: students });
  } catch (e) {
    next(e);
  }
});

app.post('/v1/students', async (req, res, next) => {
  try {
    const parsed = createStudentBodySchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION',
          message: parsed.error.flatten().fieldErrors,
          message_ur: 'درستگی ناکام',
        },
      });
      return;
    }
    const b = parsed.data;
    const school = await prisma.school.findFirst({
      where: { id: b.school_id, is_active: true },
    });
    if (!school) {
      res.status(404).json({
        success: false,
        error: { code: 'SCHOOL_404', message: 'School not found', message_ur: 'اسکول نہیں ملا' },
      });
      return;
    }

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          school_id: b.school_id,
          phone: b.phone,
          full_name: b.full_name,
          role: 'STUDENT',
        },
      });
      const student = await tx.student.create({
        data: {
          user_id: user.id,
          school_id: b.school_id,
          admission_no: b.admission_no,
          grade_label: b.grade_label,
          section_label: b.section_label ?? null,
        },
        include: { user: { select: { full_name: true, phone: true } } },
      });
      return student;
    });

    res.status(201).json({ success: true, data: result });
  } catch (e) {
    next(e);
  }
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  // Prisma unique constraint etc.
  const message = err.message || 'Internal error';
  const isProd = process.env.NODE_ENV === 'production';
  res.status(500).json({
    success: false,
    error: {
      code: 'SRV_001',
      message: isProd ? 'Server error' : { detail: message },
      message_ur: 'سرور میں خرابی',
    },
  });
});

app.listen(PORT, () => {
  console.log(`api listening on http://localhost:${PORT}`);
});
