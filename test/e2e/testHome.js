/* globals browser */

import {assert} from 'chai';
import http from 'http';

import fixture from '../fixture';

describe('product', () => {
  before((done) => {
    browser
      .url('http://local.splitme.net:8000/?locale=fr')
      .timeoutsAsyncScript(5000)
      .executeAsync(fixture.executeAsyncDestroyAll) // node.js context
      .call(done);
  });

  it('should show the home product when we navigate to the route', (done) => {
    browser
      .getText('[data-test=AppBar] h1', (err, text) => {
        assert.equal(text, 'SplitMe');
      })
      .call(done);
  });

  it('should server render the title when we request to the home page', (done) => {
    http.get('http://local.splitme.net:8000/fr', (res) => {
      let content = '';

      res.on('data', (chunk) => {
        content += chunk;
      });
      res.on('end', () => {
        assert.isTrue(
          content.indexOf('<title>SplitMe - Dépenses entre amis</title>') !== -1,
          'The title balise is correctly set');
        done();
      });
    });
  });

  it('should redirect to accounts details when we request to the home page from the manifest', (done) => {
    http.get('http://local.splitme.net:8000/?locale=fr&launcher=true', (res) => {
      let content = '';

      res.on('data', (chunk) => {
        content += chunk;
      });
      res.on('end', () => {
        assert.isTrue(
          content.indexOf('<title>Mes comptes</title>') !== -1,
          'The title balise is correctly set');
        done();
      });
    });
  });

  it('should dislay a not found page when the page do not exist', (done) => {
    browser
      .url('http://local.splitme.net:8000/not/found?locale=fr')
      .getText('[data-test=TextIcon]', (err, text) => {
        assert.equal(text, 'Page introuvable');
      })
      .call(done);
  });
});
