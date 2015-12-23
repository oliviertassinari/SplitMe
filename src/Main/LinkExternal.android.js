import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

const LinkExternal = React.createClass({
  propTypes: {
    children: React.PropTypes.element,
    href: React.PropTypes.string,
  },
  mixins: [
    PureRenderMixin,
  ],
  onTouchTap() {
    cordova.InAppBrowser.open(this.props.href, '_system');
  },
  render() {
    return React.cloneElement(this.props.children, {
      onTouchTap: this.onTouchTap,
    });
  },
});

export default LinkExternal;
