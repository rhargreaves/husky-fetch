import { Hono } from 'hono';

const app = new Hono<{ Bindings: Env }>();

app.get('/', (c) => c.text('Husky Fetch is running'));

app.post('/api/urls', async (c) => {
  const body = await c.req.json().catch(() => null);

  if (!body || typeof body.url !== 'string' || !body.url) {
    return c.json({ error: 'url is required' }, 400);
  }

  try {
    new URL(body.url);
  } catch {
    return c.json({ error: 'url is invalid' }, 400);
  }

  const alias = Math.random().toString(36).slice(2, 7);
  const origin = new URL(c.req.url).origin;

  await c.env.dev_husky_fetch
    .prepare(`INSERT INTO url (url, short_alias, created_at) VALUES (?, ?, datetime('now'))`)
    .bind(body.url, alias)
    .run();

  return c.json({ alias, short_url: `${origin}/${alias}` }, 201);
});

app.get('/:shortAlias', async (c) => {
  const shortAlias = c.req.param('shortAlias');
  const result = await c.env.dev_husky_fetch
    .prepare('SELECT url FROM url WHERE short_alias = ?')
    .bind(shortAlias)
    .first();
  if (!result) {
    return c.text('URL not found', 404);
  }
  return c.redirect(result.url as string, 302);
});

export default app;
