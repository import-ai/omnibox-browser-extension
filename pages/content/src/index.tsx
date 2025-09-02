import { createRoot } from 'react-dom/client';
import generateShadow from './utils/shadow';
import AppContext from './hooks/app-context';
import CoreApp from './hooks/app.class';
import '@extension/ui/lib/global.css';
import '@src/page/index.css';
import App from './App';
import './i18n';

export function init() {
  const { root, shadow } = generateShadow();
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = chrome.runtime.getURL('content/index.css');
  shadow.appendChild(link);
  const container = document.createElement('div');
  shadow.appendChild(container);
  const reactDOMRoot = createRoot(container);
  const app = new CoreApp();
  reactDOMRoot.render(
    <AppContext.Provider value={{ app, root, shadow, container }}>
      <App />
    </AppContext.Provider>,
  );
  return app;
}
