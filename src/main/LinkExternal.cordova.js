/* globals cordova */

import React, {PropTypes, Component} from 'react';

class LinkExternal extends Component {
  static propTypes = {
    children: PropTypes.element,
    href: PropTypes.string,
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
