import {createRoot} from 'react-dom/client';
import App from './App';
import { AppIni } from './AppIni';
import {StrictMode} from 'react';

createRoot(document.getElementById('root') as HTMLElement).render(
  // <StrictMode>
    // <App />,
    <AppIni />,
  // </StrictMode>,
)
