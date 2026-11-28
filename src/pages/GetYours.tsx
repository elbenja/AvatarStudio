import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GetYours } from '../components/templates/GetYours/GetYours';
import { sendBrief } from '../brief';
import '../styles/global.css';

// The commission page (/get-yours.html), where the studio's "Get yours" buttons lead.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GetYours onSend={sendBrief} studioHref={import.meta.env.BASE_URL} />
  </StrictMode>,
);
