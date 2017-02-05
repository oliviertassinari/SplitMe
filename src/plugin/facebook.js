// @flow weak

import config from 'config';

const facebookConnectPlugin = {
  getLoginStatus(success, failure) {
    // Try will catch errors when SDK has not been init
    try {
      window.FB.getLoginStatus((response) => {
        success(response);
      });
    } catch (error) {
      if (!failure) {
        throw new Error(error.message);
      } else {
        failure(error.message);
      }
    }
  },
  // Attach this to a UI element, this requires user interaction.
  login(permissions, success, failure) {
    // JS SDK takes an object here but the native SDKs use array.
    const permissionObj = {};
    if (permissions && permissions.length > 0) {
      permissionObj.scope = permissions.toString();
    }

    window.FB.login((response) => {
      if (response.authResponse) {
        success(response);
      } else {
        failure(response.status);
      }
    }, permissionObj);
  },
  api(graphPath, permissions, success, failure) {
    // JS API does not take additional permissions

    // Try will catch errors when SDK has not been init
    try {
      window.FB.api(graphPath, (response) => {
        if (response.error) {
          failure(response);
        } else {
          success(response);
        }
      });
    } catch (error) {
      if (!failure) {
        throw new Error(error.message);
      } else {
        failure(error.message);
      }
    }
  },
};

let promise;

function facebook() {
  if (!promise) {
    promise = new Promise((resolve) => {
      window.fbAsyncInit = () => {
        window.FB.init({
          appId: config.facebookAppId,
          cookie: true,
          xfbml: true,
          version: 'v2.4',
        });

        resolve(facebookConnectPlugin);
      };

      const script = document.createElement('script');
      script.src = `${document.location.protocol}//connect.facebook.net/en_US/sdk.js`;
      script.defer = true;
      const node = document.getElementById('fb-root');

      if (node) {
        node.appendChild(script);
      }
    });
  }

  return promise;
}

export default facebook;
