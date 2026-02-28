import { env, SELF } from 'cloudflare:test';
import { describe, it, expect, beforeAll } from 'vitest';

describe('GET /:alias', () => {
  beforeAll(async () => {
    await env.dev_husky_fetch
      .prepare(`INSERT INTO url (url_id, url, short_alias, created_at) VALUES (?, ?, ?, ?)`)
      .bind(1, 'https://www.google.com', 'g', '2026-02-19 12:00:00')
      .run();
  });

  it('redirects /g to https://www.google.com', async () => {
    const response = await SELF.fetch('https://example.com/g', { redirect: 'manual' });
    expect(response.status).toBe(302);
    expect(response.headers.get('Location')).toBe('https://www.google.com');
  });

  it('returns 404 for an unknown alias', async () => {
    const response = await SELF.fetch('https://example.com/unknown');
    expect(response.status).toBe(404);
  });
});

describe('POST /api/urls', () => {
  it('registers a URL and returns the alias', async () => {
    const response = await SELF.fetch('https://example.com/api/urls', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: 'https://www.example.com' }),
    });

    expect(response.status).toBe(201);
    const body = await response.json<{ alias: string; short_url: string }>();
    expect(body.alias).toBeTruthy();
    expect(body.short_url).toContain(body.alias);
  });

  it('returns 400 for an invalid URL', async () => {
    const response = await SELF.fetch('https://example.com/api/urls', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: 'not-a-url' }),
    });

    expect(response.status).toBe(400);
  });

  it('returns 400 when url field is missing', async () => {
    const response = await SELF.fetch('https://example.com/api/urls', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });

    expect(response.status).toBe(400);
  });
});
