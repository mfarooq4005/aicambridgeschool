import cors from 'cors';
import express from 'express';

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

app.get('/v1/health', (_req, res) => {
  res.json({ success: true, data: { service: 'ai-cambridge-school-api', version: '0' } });
});

app.listen(PORT, () => {
  console.log(`api listening on http://localhost:${PORT}`);
});
