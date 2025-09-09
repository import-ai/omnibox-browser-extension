import { createRoot } from 'react-dom/client';
import generateShadow from './utils/shadow';
import AppContext from './hooks/app-context';
import '@extension/ui/lib/global.css';
import './index.css';
import App from './App';
import './i18n';

const { root, shadow } = generateShadow();
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = chrome.runtime.getURL('content/index.css');
shadow.appendChild(link);
const container = document.createElement('div');
shadow.appendChild(container);
const reactDOMRoot = createRoot(container);
reactDOMRoot.render(
  <AppContext.Provider value={{ root, shadow, container }}>
    <App />
  </AppContext.Provider>,
);
