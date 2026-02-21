import { env, createExecutionContext, waitOnExecutionContext, SELF } from 'cloudflare:test';
import { describe, it, expect, beforeAll } from 'vitest';
import worker from '../src/index';

// For now, you'll need to do something like this to get a correctly-typed
// `Request` to pass to `worker.fetch()`.
const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

describe('Hello World worker', () => {
  it('responds with Hello World! (unit style)', async () => {
    const request = new IncomingRequest('http://example.com');
    // Create an empty context to pass to `worker.fetch()`.
    const ctx = createExecutionContext();
    const response = await worker.fetch(request, env, ctx);
    // Wait for all `Promise`s passed to `ctx.waitUntil()` to settle before running test assertions
    await waitOnExecutionContext(ctx);
    expect(await response.text()).toMatchInlineSnapshot(`"Hello World!"`);
  });

  it('responds with Hello World! (integration style)', async () => {
    const response = await SELF.fetch('https://example.com');
    expect(await response.text()).toMatchInlineSnapshot(`"Hello World!"`);
  });
});

describe('URL shortener', () => {
  beforeAll(async () => {
    await env.dev_husky_fetch
      .prepare(`INSERT INTO url (url_id, url, short_alias, created_at) VALUES (?, ?, ?, ?)`)
      .bind(1, 'https://www.google.com', 'g', '2026-02-19 12:00:00')
      .run();
  });

  it('redirects /g to https://www.google.com', async () => {
    const response = await SELF.fetch('https://example.com/g', { redirect: 'manual' });
    expect(response.status).toBe(302);
    expect(response.headers.get('Location')).toBe('https://www.google.com/');
  });
});
