import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('./config', () => ({ BRIEF_URL: 'https://inbox.test/exec' }));
import { sendBrief, type Brief } from './brief';

const brief: Brief = { name: 'Ada', email: 'ada@example.test', brand: 'example.test', places: ['Website'], vision: 'Fluffy, loud, loyal', assets: '' };
const answer = (body: unknown, status = 200) => vi.fn(async () => new Response(JSON.stringify(body), { status }));

afterEach(() => vi.unstubAllGlobals());

describe('sendBrief', () => {
  it('posts the brief as JSON and resolves when the inbox confirms', async () => {
    const fetch = answer({ ok: true });
    vi.stubGlobal('fetch', fetch);
    await expect(sendBrief(brief)).resolves.toBeUndefined();
    expect(fetch).toHaveBeenCalledWith('https://inbox.test/exec', { method: 'POST', body: JSON.stringify(brief) });
  });

  it('rejects when the inbox refuses the brief', async () => {
    vi.stubGlobal('fetch', answer({ ok: false }));
    await expect(sendBrief(brief)).rejects.toThrow();
  });

  it('rejects on an HTTP error', async () => {
    vi.stubGlobal('fetch', answer({}, 500));
    await expect(sendBrief(brief)).rejects.toThrow();
  });
});
