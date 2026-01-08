import './utils/close';
import { createRoot } from 'react-dom/client';
import generateShadow from './utils/shadow';
import AppContext from './hooks/app-context';
import '@extension/ui/lib/global.css';
import './index.css';
import App from './App';
import './i18n';

// Register __ping__ listener immediately for background detection
// This must be registered BEFORE React renders to ensure it's always available
// Fixes race condition in Firefox and other browsers
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.action === '__ping__') {
    sendResponse({ ok: true });
    return true;
  }
  // Let other listeners handle other messages
});

function bootstrap() {
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
}

if (!location.hostname.includes('omnibox.pro')) {
  bootstrap();
  // Notify background that content script is ready
  chrome.runtime.sendMessage({ action: '__content_ready__' });
}
