import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Studio } from './pages/Studio';
import { loadAvatar } from './avatar/mount';
import { initialStudio } from './state/studio';
import './styles/global.css';

// Fetch the first character while React mounts, instead of after: the stage would otherwise ask for it last.
loadAvatar(initialStudio(false).who);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Studio />
  </StrictMode>,
);
