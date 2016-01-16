import {assert} from 'chai';

import fixture from '../fixture';

describe('product', () => {
  before((done) => {
    browser
      .url('http://local.splitme.net:8000/?locale=fr')
      .timeoutsAsyncScript(5000)
      .executeAsync(fixture.executeAsyncDestroyAll) // node.js context
      .call(done);
  });

  it('should show product when we navigate to the home page', (done) => {
    browser
      .getText('[data-test=AppBar] h1', (err, text) => {
        assert.equal(text, 'SplitMe');
      })
      .call(done);
  });

});
