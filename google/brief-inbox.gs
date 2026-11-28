/**
 * Brief inbox · Avatar Studio
 * Receives a brief from the Get yours page, adds it as a row to this spreadsheet and emails it to the owner.
 *
 * Set up, once:
 * 1. Create a Google Sheet. Extensions > Apps Script, paste this file over Code.gs, save.
 * 2. Deploy > New deployment > Web app. Execute as: Me. Who has access: Anyone. Approve the permissions.
 * 3. Copy the web app URL (it ends in /exec) into VITE_BRIEF_URL, locally in .env.local and in the host's settings.
 * After editing this script, publish it with Deploy > Manage deployments > Edit > New version: the URL stays the same.
 */

const HEADERS = ['Received', 'Name', 'Email', 'Brand', 'Lives on', 'Vision', 'Assets'];
const MAX = 300;
const MAX_VISION = 2000;

/** Plain text only: trimmed, capped, and never read by Sheets as a formula. */
function clean(value, max) {
  const text = String(value == null ? '' : value).trim().slice(0, max || MAX);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function reply(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const brief = JSON.parse(e.postData.contents);
    const name = clean(brief.name);
    const email = clean(brief.email);
    const brand = clean(brief.brand);
    const places = clean((brief.places || []).join(', '));
    const vision = clean(brief.vision, MAX_VISION);
    const assets = clean(brief.assets);
    if (!name || !brand || !vision || !/^\S+@\S+\.\S+$/.test(email)) return reply({ ok: false });

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);
    sheet.appendRow([new Date(), name, email, brand, places, vision, assets]);

    // To the owner of this script; replying answers the person who sent the brief.
    MailApp.sendEmail({
      to: Session.getEffectiveUser().getEmail(),
      replyTo: email,
      subject: 'New character brief: ' + brand,
      body: ['Name: ' + name, 'Email: ' + email, 'Brand: ' + brand, 'Lives on: ' + places, 'Vision: ' + vision, 'Assets: ' + (assets || 'None')].join('\n'),
    });
    return reply({ ok: true });
  } catch (err) {
    console.error(err);
    return reply({ ok: false });
  }
}
