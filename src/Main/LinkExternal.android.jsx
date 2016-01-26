import React from 'react';
import pure from 'recompose/pure';

class LinkExternal extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.onTouchTap = this.onTouchTap.bind(this);
  }

  onTouchTap() {
    cordova.InAppBrowser.open(this.props.href, '_system');
  }

  render() {
    return React.cloneElement(this.props.children, {
      onTouchTap: this.onTouchTap,
    });
  }
}

LinkExternal.propTypes = {
  children: React.PropTypes.element,
  href: React.PropTypes.string,
};

export default pure(LinkExternal);
