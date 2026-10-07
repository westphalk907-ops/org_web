const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
(async () => {
  const rows = await p.$queryRawUnsafe(
    `SELECT column_name, data_type, is_nullable
     FROM information_schema.columns
     WHERE table_name = 'AiToolSubmission' AND column_name IN ('ipAddress', 'userAgent')
     ORDER BY column_name`
  );
  console.log('--- columns in DB ---');
  console.table(rows);

  const sample = await p.$queryRawUnsafe(
    `SELECT id, name, "ipAddress", LEFT("userAgent", 60) as ua60, status, "createdAt"
     FROM "AiToolSubmission"
     ORDER BY "createdAt" DESC LIMIT 3`
  );
  console.log('--- recent rows ---');
  console.table(sample);

  await p.$disconnect();
})().catch((e) => { console.error('ERR:', e.message); process.exit(1); });