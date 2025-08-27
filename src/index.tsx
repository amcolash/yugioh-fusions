import { createRoot } from 'react-dom/client';
import 'react-tooltip/dist/react-tooltip.css';

import { App } from './components/App';
import './index.css';

createRoot(document.getElementById('root')!).render(<App />);
