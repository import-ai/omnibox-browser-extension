// Query the configured apiBaseUrl and set up observer if on that domain
chrome.runtime.sendMessage({ action: 'storage', args: ['apiBaseUrl'] }, response => {
  const apiBaseUrl = response?.data?.apiBaseUrl || 'https://www.omnibox.pro';
  const configuredHost = new URL(apiBaseUrl).hostname;

  if (location.hostname === configuredHost) {
    const observer = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const closeTab = document.body.classList.contains('please_close_me');
          if (closeTab) {
            observer.disconnect();
            chrome.runtime.sendMessage({
              action: 'close-tab',
            });
          }
        }
      }
    });
    observer.observe(document.body, {
      subtree: false,
      attributes: true,
      attributeFilter: ['class'],
    });
  }
});
