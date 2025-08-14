import { createRoot } from 'react-dom/client';
import '@extension/ui/lib/global.css';
import '@src/index.css';
import App from '@src/App';
import './i18n';

function init() {
  const appContainer = document.querySelector('#app-container');
  if (!appContainer) {
    throw new Error('Can not find #app-container');
  }
  const root = createRoot(appContainer);
  root.render(<App />);
}

init();
