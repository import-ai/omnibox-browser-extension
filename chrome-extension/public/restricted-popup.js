// Get restriction type from URL parameter
const urlParams = new URLSearchParams(window.location.search);
const restrictionType = urlParams.get('type') || 'general';

// i18n messages for different languages
const messages = {
  zh: {
    extensionName: '小黑',
    restrictedTitle: '当前页面不支持保存',
    restrictedBrowserInternal: '不支持浏览器内置页面',
    restrictedOmniboxPro: '不支持 OmniBox 产品页面',
    restrictedCurrentPage: '不支持当前网页',
    tooltipOpenNamespace: '打开空间',
    tooltipFeedback: '意见反馈',
    tooltipSettings: '设置',
    loginRequired: '登录后即可使用',
    loginNow: '立即登录',
  },
  en: {
    extensionName: 'OmniBox',
    restrictedTitle: 'Current page cannot be saved',
    restrictedBrowserInternal: 'Browser internal pages are not supported',
    restrictedOmniboxPro: 'OmniBox product pages are not supported',
    restrictedCurrentPage: 'Current webpage is not supported',
    tooltipOpenNamespace: 'Open Namespace',
    tooltipFeedback: 'Feedback',
    tooltipSettings: 'Settings',
    loginRequired: 'Login required to use this feature',
    loginNow: 'Login now',
  },
};

// Current language (default to 'zh', will be loaded from storage)
let currentLanguage = 'zh';

// Get message based on current language
function getMessage(key) {
  return messages[currentLanguage]?.[key] || messages.en[key] || '';
}

// Get normalized base URL from storage
function getBaseUrl(callback) {
  chrome.storage.sync.get('apiBaseUrl', storage => {
    const baseUrl = storage.apiBaseUrl || 'https://www.omnibox.pro';
    const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    callback(normalizedBaseUrl);
  });
}

// Initialize the popup
document.addEventListener('DOMContentLoaded', () => {
  // Load language first, then load content
  loadLanguage(() => {
    // Load theme
    loadTheme();

    // Load extension name and logo
    loadHeader();

    // Load restriction message based on type
    loadRestrictionMessage();

    // Check login status and show login section if needed
    checkLoginStatus();

    // Setup button click handlers
    setupButtonHandlers();

    // Listen for theme changes
    setupThemeListener();

    // Listen for language changes
    setupLanguageListener();
  });
});

// Load language from plugin settings
function loadLanguage(callback) {
  chrome.storage.sync.get('language', data => {
    // Language value is 'zh' or 'en'
    currentLanguage = data.language || 'zh';
    if (callback) {
      callback();
    }
  });
}

// Setup language change listener
function setupLanguageListener() {
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'sync' && changes.language) {
      currentLanguage = changes.language.newValue || 'zh';
      // Reload all text content
      loadHeader();
      loadRestrictionMessage();
    }
  });
}

// Load and apply theme based on plugin settings
function loadTheme() {
  chrome.storage.sync.get('theme', data => {
    const theme = data.theme || 'light';
    applyTheme(theme);
  });
}

// Apply theme to document
function applyTheme(theme) {
  let actualTheme = theme;

  // If theme is 'system', detect system preference
  if (theme === 'system') {
    actualTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  // Remove all theme classes
  document.documentElement.classList.remove('light', 'dark');

  // Add the actual theme class
  document.documentElement.classList.add(actualTheme);
}

// Setup theme change listener
function setupThemeListener() {
  // Listen for storage changes
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'sync' && changes.theme) {
      applyTheme(changes.theme.newValue);
    }
  });

  // Listen for system theme changes when theme is 'system'
  const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
  darkModeQuery.addEventListener('change', () => {
    chrome.storage.sync.get('theme', data => {
      if (data.theme === 'system') {
        applyTheme('system');
      }
    });
  });
}

// Load header with logo and extension name
function loadHeader() {
  const logo = document.getElementById('logo');
  if (logo) {
    logo.src = chrome.runtime.getURL('icon-128.png');
  }

  const extensionName = document.querySelector('[data-i18n="extensionName"]');
  if (extensionName) {
    extensionName.textContent = getMessage('extensionName');
  }

  // Load tooltips for buttons
  const tooltips = document.querySelectorAll('[data-tooltip]');
  tooltips.forEach(tooltip => {
    const type = tooltip.getAttribute('data-tooltip');
    let message = '';

    switch (type) {
      case 'namespace':
        message = getMessage('tooltipOpenNamespace');
        break;
      case 'feedback':
        message = getMessage('tooltipFeedback');
        break;
      case 'settings':
        message = getMessage('tooltipSettings');
        break;
    }

    if (message) {
      tooltip.textContent = message;
    }
  });
}

// Load restriction message based on type
function loadRestrictionMessage() {
  const mainTitle = document.querySelector('.main-title');
  const subtitle = document.querySelector('.subtitle');

  const titleKey = 'restrictedTitle';

  let subtitleKey = 'restrictedCurrentPage';

  switch (restrictionType) {
    case 'browser-internal':
    case 'webstore':
      subtitleKey = 'restrictedBrowserInternal';
      break;
    case 'omnibox-pro':
      subtitleKey = 'restrictedOmniboxPro';
      break;
  }

  if (mainTitle) {
    mainTitle.textContent = getMessage(titleKey);
  }

  if (subtitle) {
    subtitle.textContent = getMessage(subtitleKey);
  }
}

// Check login status and show login section if not logged in
function checkLoginStatus() {
  getBaseUrl(normalizedBaseUrl => {
    chrome.runtime.sendMessage(
      {
        action: 'fetch',
        url: `${normalizedBaseUrl}/api/v1/user/me`,
      },
      response => {
        const isLoggedIn = !!(response.data && response.data.id);
        const loginSection = document.getElementById('login-section');
        const loginRequired = loginSection?.querySelector('.login-required');
        const loginButton = document.getElementById('btn-login');
        const mainTitle = document.querySelector('.main-title');
        const subtitle = document.querySelector('.subtitle');

        if (!isLoggedIn) {
          // Hide restricted message, show login section
          if (mainTitle) mainTitle.style.display = 'none';
          if (subtitle) subtitle.style.display = 'none';
          if (loginSection) {
            loginSection.style.display = 'block';

            // Update login section text
            if (loginRequired) {
              loginRequired.textContent = getMessage('loginRequired');
            }
            if (loginButton) {
              loginButton.textContent = getMessage('loginNow');
              loginButton.addEventListener('click', () => {
                chrome.tabs.create({
                  url: `${normalizedBaseUrl}/user/login?from=extension_login`,
                });
                window.close();
              });
            }
          }
        }
      },
    );
  });
}

// Setup button click handlers
function setupButtonHandlers() {
  getBaseUrl(normalizedBaseUrl => {
    // Get user language
    const lang = chrome.i18n.getUILanguage().replace('-', '_');

    const btnNamespace = document.getElementById('btn-namespace');
    if (btnNamespace) {
      btnNamespace.addEventListener('click', () => {
        // Check login status via API (same as Header.tsx useUser hook)
        chrome.runtime.sendMessage(
          {
            action: 'fetch',
            url: `${normalizedBaseUrl}/api/v1/user/me`,
          },
          response => {
            const isLoggedIn = !!(response.data && response.data.id);

            if (!isLoggedIn) {
              chrome.tabs.create({
                url: `${normalizedBaseUrl}/user/login?from=extension`,
              });
              window.close();
              return;
            }

            chrome.storage.sync.get('namespaceId', data => {
              const namespaceId = data.namespaceId || '';

              if (namespaceId) {
                // namespaceId exists, navigate directly
                chrome.tabs.create({
                  url: `${normalizedBaseUrl}/${namespaceId}/chat?lang=${lang}`,
                });
                window.close();
              } else {
                // namespaceId is empty, fetch from API (same as Page.tsx)
                chrome.runtime.sendMessage(
                  {
                    action: 'fetch',
                    url: `${normalizedBaseUrl}/api/v1/namespaces`,
                  },
                  nsResponse => {
                    if (nsResponse.data && nsResponse.data.length > 0) {
                      const fetchedNamespaceId = nsResponse.data[0].id;
                      chrome.tabs.create({
                        url: `${normalizedBaseUrl}/${fetchedNamespaceId}/chat?lang=${lang}`,
                      });
                    } else {
                      // No namespace found, go to base URL
                      chrome.tabs.create({
                        url: normalizedBaseUrl,
                      });
                    }
                    window.close();
                  },
                );
              }
            });
          },
        );
      });
    }

    // Feedback button
    const btnFeedback = document.getElementById('btn-feedback');
    if (btnFeedback) {
      btnFeedback.addEventListener('click', () => {
        chrome.tabs.create({
          url: `${normalizedBaseUrl}/feedback?lang=${lang}`,
        });
        window.close();
      });
    }

    // Settings button
    const btnSettings = document.getElementById('btn-settings');
    if (btnSettings) {
      btnSettings.addEventListener('click', () => {
        chrome.runtime.openOptionsPage();
        window.close();
      });
    }
  });
}
