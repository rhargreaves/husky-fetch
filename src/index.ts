/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { Hono } from "hono";

const app = new Hono<{ Bindings: Env }>()

app.get('/', (c) => c.text('Husky Fetch is running'));

app.get('/:shortAlias', async (c) => {
  const shortAlias = c.req.param('shortAlias');
  const query = await c.env.dev_husky_fetch.prepare('SELECT url FROM url WHERE short_alias = ?');
  const result = await query.bind(shortAlias).first();
  if (!result) {
    return c.text('URL not found', { status: 404 });
  }
  return c.redirect(result.url as string, 302);
});

export default app;
