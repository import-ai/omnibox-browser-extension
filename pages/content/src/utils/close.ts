if (location.hostname.includes('omnibox.pro')) {
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
