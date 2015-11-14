import Lie from 'lie';

import config from 'config';
import facebookConnectPlugin from 'facebookConnectPlugin';

let promise;

function facebook() {
  if (!promise) {
    promise = new Lie((resolve) => {
      window.fbAsyncInit = () => {
        facebookConnectPlugin.browserInit(config.facebookAppId, 'v2.4');
        resolve(facebookConnectPlugin);
      };
    });
  }

  return promise;
}

export default facebook;
