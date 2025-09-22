import { createRoot } from 'react-dom/client';
import 'react-tooltip/dist/react-tooltip.css';
import { updateSW } from 'utils/updateSW';

import { App } from './components/App';
import './index.css';

updateSW();

createRoot(document.getElementById('root')!).render(<App />);
