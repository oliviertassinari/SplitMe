import {createStyleManager} from 'stylishly/lib/styleManager';
import {createPluginRegistry} from 'stylishly/lib/pluginRegistry';
import vendorPrefixer from 'stylishly-vendor-prefixer';
import pseudoClasses from 'stylishly-pseudo-classes';
import descendants from 'stylishly-descendants';
import chained from 'stylishly-chained';
import units from 'stylishly-units';
import nested from 'stylishly-nested';
import mediaQueries from 'stylishly-media-queries';
import keyframes from 'stylishly-keyframes';

export default () => {
  return createStyleManager({
    pluginRegistry: createPluginRegistry(
      nested(),
      mediaQueries(),
      keyframes(),
      descendants(),
      pseudoClasses(),
      chained(),
      units(),
      vendorPrefixer()
    ),
  });
};
