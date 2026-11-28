/** Where "Get yours" goes: the commission page. Set VITE_GET_YOURS_URL to send it somewhere else without touching code. */
export const GET_YOURS_URL: string = import.meta.env.VITE_GET_YOURS_URL ?? `${import.meta.env.BASE_URL}get-yours.html`;

/**
 * The web app URL of the brief inbox (google/brief-inbox.gs), which files each brief in a Google Sheet and
 * emails it. Empty until VITE_BRIEF_URL is set; the Get yours form then says it could not send.
 */
export const BRIEF_URL: string = import.meta.env.VITE_BRIEF_URL ?? '';
