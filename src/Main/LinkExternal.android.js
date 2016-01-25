import React from 'react';
import pure from 'recompose/pure';

const LinkExternal = React.createClass({
  propTypes: {
    children: React.PropTypes.element,
    href: React.PropTypes.string,
  },
  onTouchTap() {
    cordova.InAppBrowser.open(this.props.href, '_system');
  },
  render() {
    return React.cloneElement(this.props.children, {
      onTouchTap: this.onTouchTap,
    });
  },
});

export default pure(LinkExternal);
