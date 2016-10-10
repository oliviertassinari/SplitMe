// @flow weak

import http from 'http';
import {assert} from 'chai';

describe('product', () => {
  before(() => {
    return global.browser
      .timeouts('script', 5000);
  });

  describe('navigation', () => {
    it('should show the home product when we navigate to the route', () => {
      return new Promise((accept) => {
        global.browser
          .url('http://local.splitme.net:8000/?locale=fr')
          .getText('[data-test="AppBar"] h1')
          .then((text) => {
            assert.strictEqual(text, 'SplitMe');
          })
          .call(accept);
      });
    });

    it('should redirect to accounts details when we request to the home page from the manifest', () => {
      return new Promise((accept) => {
        http.get('http://local.splitme.net:8000/?locale=fr&launcher=true', (res) => {
          let content = '';

          res.on('data', (chunk) => {
            content += chunk;
          });
          res.on('end', () => {
            assert.strictEqual(
              content.indexOf('<title>Mes comptes</title>') !== -1,
              true,
              'The title balise is correctly set');
            accept();
          });
        });
      });
    });

    it('should dislay a not found page when the page do not exist', () => {
      return new Promise((accept) => {
        global.browser
          .url('http://local.splitme.net:8000/not/found?locale=fr')
          .getText('[data-test="TextIcon"]')
          .then((text) => {
            assert.strictEqual(text, 'Page introuvable');
          })
          .call(accept);
      });
    });

    it('should redirect to the en page when the language do not exist', () => {
      return new Promise((accept) => {
        global.browser
          .url('http://local.splitme.net:8000/bbb')
          .waitForExist('[data-test="AppBar"]')
          .getUrl().then((url) => {
            assert.strictEqual(url, 'http://local.splitme.net:8000/en');
          })
          .call(accept);
      });
    });
  });

  describe('server side rendering', () => {
    it('should server render the title when we request to the home page', () => {
      return new Promise((accept) => {
        http.get('http://local.splitme.net:8000/fr', (res) => {
          let content = '';

          res.on('data', (chunk) => {
            content += chunk;
          });
          res.on('end', () => {
            assert.strictEqual(
              content.indexOf('<title>SplitMe - Dépenses entre amis</title>') !== -1,
            true,
            'The title balise is correctly set');
            accept();
          });
        });
      });
    });
  });
});
