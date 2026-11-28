import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { OrbitLoader } from '../components/atoms/OrbitLoader/OrbitLoader';
import '../styles/global.css';

// Dev-only page (/loader.html): the orbit loader alone, loading forever. It is not one of the build's inputs, so it never ships.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div style={{ position: 'relative', height: '100%' }}>
      <OrbitLoader on />
    </div>
  </StrictMode>,
);
