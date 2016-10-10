// @flow weak

import { createStyleManager } from 'stylishly/lib/styleManager';
import { createPluginRegistry } from 'stylishly/lib/pluginRegistry';
import vendorPrefixer from 'stylishly-vendor-prefixer';
import pseudoClasses from 'stylishly-pseudo-classes';
import units from 'stylishly-units';
import nested from 'stylishly-nested';
import atRules from 'stylishly-at-rules';

export default () => {
  return createStyleManager({
    pluginRegistry: createPluginRegistry(
      nested(),
      atRules(),
      pseudoClasses(),
      units(),
      vendorPrefixer()
    ),
  });
};
