import { createRoot } from 'react-dom/client';
import '@/index.css';
import App from '@/App';
import '@/i18n/index.ts';

createRoot(document.getElementById('root')!).render(<App />);
