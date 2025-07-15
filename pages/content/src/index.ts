import '@src/utils/login';
import { init } from '@src/page';
import { choose, collect, cancelChoose } from '@src/actions';

const app = init();

app.on('cancel-choose', cancelChoose);

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.action === 'collect') {
    collect({ ...request.option, action: request.action }, sendResponse);
  } else if (request.action === 'choose') {
    app.fire('choose', true);
    choose({ ...request.option, action: request.action }, sendResponse, () => {
      app.fire('choose', false);
    });
  } else if (request.action === 'cancel-choose') {
    cancelChoose(sendResponse);
  }
  return true;
});
