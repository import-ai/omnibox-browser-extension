// 登录页面
if (location.search === '?from=extension') {
  chrome.storage.sync.get('apiKey', data => {
    if (data.apiKey) {
      return;
    }
    const token = document.body.getAttribute('data-token');
    if (token) {
      document.body.removeAttribute('data-token');
      chrome.runtime.sendMessage({
        action: 'saveToken',
        token,
      });
    }
    const observer = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-token') {
          const token = document.body.getAttribute('data-token');
          if (token) {
            observer.disconnect();
            document.body.removeAttribute('data-token');
            chrome.runtime.sendMessage({
              action: 'saveToken',
              token,
            });
          }
        }
      }
    });
    observer.observe(document.body, {
      subtree: false,
      attributes: true,
      attributeFilter: ['data-token'],
    });
  });
}
