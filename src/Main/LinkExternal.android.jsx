import React from 'react';

class LinkExternal extends React.Component {
  static propTypes = {
    children: React.PropTypes.element,
    href: React.PropTypes.string,
  };

  onTouchTap = () => {
    cordova.InAppBrowser.open(this.props.href, '_system');
  };

  render() {
    return React.cloneElement(this.props.children, {
      onTouchTap: this.onTouchTap,
    });
  }
}

export default LinkExternal;
