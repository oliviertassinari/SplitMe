
import { PropTypes, Component, cloneElement } from 'react';

class LinkExternal extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  onTouchTap = () => {
    window.cordova.InAppBrowser.open(this.props.children.props.href, '_system');
  };

  render() {
    return cloneElement(this.props.children, {
      onTouchTap: this.onTouchTap,
    });
  }
}

export default LinkExternal;
