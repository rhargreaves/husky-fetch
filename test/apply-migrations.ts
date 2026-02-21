import { applyD1Migrations, env } from 'cloudflare:test';

await applyD1Migrations(env.dev_husky_fetch, env.TEST_MIGRATIONS);
