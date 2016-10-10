// @flow weak

// Fetch polyfill
import 'whatwg-fetch';

export function fetchJson(url, options) {
  const {
    body,
    ...other,
  } = options;

  return fetch(url, {
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
    ...other,
  }).then((response) => response.json());
}

export default {
  fetchJson,
};
