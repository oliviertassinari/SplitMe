// @flow weak
/* eslint-env mocha */

import React from 'react';
import { shallow } from 'enzyme';
import { assert } from 'chai';
import Button from 'material-ui-build-next/src/Button';
import { MainActionButton } from './MainActionButton';

describe('<MainActionButton />', () => {
  describe('moveUp', () => {
    it('should use the rootMoveUp class', () => {
      const wrapper = shallow(
        <MainActionButton
          classes={{
            rootMoveUp: 'foo',
          }}
          moveUp
          width="sm"
        />,
      );

      assert.strictEqual(wrapper.find(Button).hasClass('foo'), true);
    });
  });
});
