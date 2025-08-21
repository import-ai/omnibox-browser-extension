import '@src/utils/oauth';
import { init } from '@src/page';
import { choose, collect, cancelChoose } from '@src/actions';

const app = init();

app.on('cancel-choose', cancelChoose);

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.action === 'collect') {
    app.fire('status', 'pending');
    collect({ ...request.option, action: request.action }, response => {
      sendResponse(response);
      if (response && response.error) {
        app.fire('status', 'error');
        app.fire('result', response.error);
      } else {
        app.fire('status', 'done');
        if (response.data) {
          app.fire('result', response.data.resource_id);
        }
      }
    });
  } else if (request.action === 'choose') {
    app.fire('choose', true);
    choose(
      { ...request.option, action: request.action },
      response => {
        sendResponse(response);
        if (response && response.error) {
          app.fire('status', 'error');
          app.fire('result', response.error);
        } else {
          app.fire('status', 'done');
          if (response.data) {
            app.fire('result', response.data.resource_id);
          }
        }
      },
      () => {
        app.fire('choose', false);
        app.fire('status', 'pending');
      },
    );
  } else if (request.action === 'cancel-choose') {
    cancelChoose(sendResponse);
  }
  return true;
});
