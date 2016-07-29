// @flow weak

import {assert} from 'chai';
import http from 'http';

describe('product', () => {
  before((done) => {
    return global.browser
      .timeouts('script', 5000)
      .call(done);
  });

  describe('navigation', () => {
    it('should show the home product when we navigate to the route', (done) => {
      global.browser
        .url('http://local.splitme.net:8000/?locale=fr')
        .getText('[data-test="AppBar"] h1')
        .then((text) => {
          assert.strictEqual(text, 'SplitMe');
        })
        .call(done);
    });

    it('should redirect to accounts details when we request to the home page from the manifest', (done) => {
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
          done();
        });
      });
    });

    it('should dislay a not found page when the page do not exist', (done) => {
      global.browser
        .url('http://local.splitme.net:8000/not/found?locale=fr')
        .getText('[data-test=TextIcon]')
        .then((text) => {
          assert.strictEqual(text, 'Page introuvable');
        })
        .call(done);
    });
  });

  describe('server side rendering', () => {
    it('should server render the title when we request to the home page', (done) => {
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
          done();
        });
      });
    });
  });
});
