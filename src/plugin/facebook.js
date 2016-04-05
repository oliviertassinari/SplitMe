import config from 'config';

const facebookConnectPlugin = {
  getLoginStatus(s, f) {
    // Try will catch errors when SDK has not been init
    try {
      window.FB.getLoginStatus((response) => {
        s(response);
      });
    } catch (error) {
      if (!f) {
        console.error(error.message);
      } else {
        f(error.message);
      }
    }
  },

  // Attach this to a UI element, this requires user interaction.
  login(permissions, s, f) {
    // JS SDK takes an object here but the native SDKs use array.
    const permissionObj = {};
    if (permissions && permissions.length > 0) {
      permissionObj.scope = permissions.toString();
    }

    window.FB.login((response) => {
      if (response.authResponse) {
        s(response);
      } else {
        f(response.status);
      }
    }, permissionObj);
  },

  api(graphPath, permissions, s, f) {
    // JS API does not take additional permissions

    // Try will catch errors when SDK has not been init
    try {
      window.FB.api(graphPath, (response) => {
        if (response.error) {
          f(response);
        } else {
          s(response);
        }
      });
    } catch (error) {
      if (!f) {
        console.error(error.message);
      } else {
        f(error.message);
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

      const e = document.createElement('script');
      e.src = `${document.location.protocol}//connect.facebook.net/en_US/sdk.js`;
      e.async = true;
      document.getElementById('fb-root').appendChild(e);
    });
  }

  return promise;
}

export default facebook;
