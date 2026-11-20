/**
 * Where "Get yours" and the "+" links go. The design points them at the landing page, which is not built
 * yet, so they go to silverdesk.com for now. Set VITE_GET_YOURS_URL to change it without touching code.
 */
export const GET_YOURS_URL: string = import.meta.env.VITE_GET_YOURS_URL ?? 'https://silverdesk.com';
