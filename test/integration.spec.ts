import { env, SELF } from 'cloudflare:test';
import { describe, it, expect, beforeAll } from 'vitest';

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
    expect(response.headers.get('Location')).toBe('https://www.google.com');
  });
});
