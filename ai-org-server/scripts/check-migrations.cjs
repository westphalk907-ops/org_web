const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
(async () => {
  const ms = await p.$queryRawUnsafe(
    'SELECT migration_name, finished_at IS NULL as pending, applied_steps_count FROM _prisma_migrations ORDER BY started_at'
  );
  console.table(ms);
  await p.$disconnect();
})().catch((e) => { console.error(e.message); process.exit(1); });