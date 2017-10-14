const promise = new Promise(resolve => {
  document.addEventListener(
    'deviceready',
    () => {
      resolve(window.facebookConnectPlugin); // Not defined before the deviceready event
    },
    false,
  );
});

function facebook() {
  return promise;
}

export default facebook;
