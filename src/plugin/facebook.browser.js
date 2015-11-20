import Lie from 'lie';

import config from 'config';
import facebookConnectPlugin from 'facebookConnectPlugin';

const promise = new Lie((resolve) => {
  window.fbAsyncInit = () => {
    facebookConnectPlugin.browserInit(config.facebookAppId, 'v2.4');
    resolve(facebookConnectPlugin);
  };
});

function facebook() {
  return promise;
}

export default facebook;
