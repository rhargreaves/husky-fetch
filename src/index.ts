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

export default {
  async fetch(request, env, ctx): Promise<Response> {
    const { pathname } = new URL(request.url);

    if (pathname === '/') {
      return new Response('Hello World!');
    }

    const shortAlias = pathname.slice(1);
    const query = await env.dev_husky_fetch.prepare('SELECT url FROM url WHERE short_alias = ?');
    const result = await query.bind(shortAlias).first();
    if (!result) {
      return new Response('URL not found', { status: 404 });
    }
    return Response.redirect(result.url, 302);
  },
} satisfies ExportedHandler<Env>;
