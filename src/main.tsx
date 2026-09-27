import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App, readConfig } from './App';
import './styles/colors.css';
import './styles/typography.css';
import './styles/spacing.css';
import './styles/borders.css';
import './styles/app.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App config={readConfig()} />
  </StrictMode>,
);
