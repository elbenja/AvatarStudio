import { BRIEF_URL } from './config';

/** What the Get yours form collects. */
export interface Brief {
  name: string;
  email: string;
  brand: string;
  /** Where the character will live, as shown on the tiles. */
  places: string[];
  /** How they picture the character, in their own words. */
  vision: string;
  /** A link to brand assets or references. Empty when they gave none. */
  assets: string;
}

/**
 * Sends a brief to the inbox script (google/brief-inbox.gs), which files it in a Sheet and emails it.
 * Rejects unless the script confirms, so the form never shows a receipt for a brief that went nowhere.
 */
export async function sendBrief(brief: Brief): Promise<void> {
  if (!BRIEF_URL) throw new Error('VITE_BRIEF_URL is not set');
  // No Content-Type header: a plain-text body keeps this a simple request, which Apps Script answers without a preflight.
  const res = await fetch(BRIEF_URL, { method: 'POST', body: JSON.stringify(brief) });
  if (!res.ok) throw new Error(`Brief inbox answered ${res.status}`);
  const { ok } = (await res.json()) as { ok?: boolean };
  if (!ok) throw new Error('Brief inbox refused the brief');
}
