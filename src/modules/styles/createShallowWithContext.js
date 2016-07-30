// @flow weak

import createStyleManager from 'modules/styles/createStyleManager';
import {shallow as enzymeShallow} from 'enzyme';

const createShallowWithContext = (shallow = enzymeShallow) => {
  return (node) => {
    return shallow(node, {
      context: {
        styleManager: createStyleManager(),
      },
    });
  };
};

export default createShallowWithContext;
