import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { OrbitLoader } from '../components/atoms/OrbitLoader/OrbitLoader';
import '../styles/global.css';

// Lab page (/loader.html): the orbit loader alone, loading forever. It ships unlinked and unindexed, for testing in any browser.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div style={{ position: 'relative', height: '100%' }}>
      <OrbitLoader on />
    </div>
  </StrictMode>,
);
