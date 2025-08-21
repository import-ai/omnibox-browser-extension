if (location.hostname.includes('omnibox.pro') && location.pathname === '/single/oauth/confirm') {
  const params = new URLSearchParams(location.search.substring(1));
  const code = params.get('code');
  const state = params.get('state');
  if (code && state) {
    chrome.runtime.sendMessage({
      action: 'oauth',
      code,
      state,
    });
  }
}
