import React, {PropTypes, Component} from 'react';

class LinkExternal extends Component {
  static propTypes = {
    children: PropTypes.element,
    href: PropTypes.string,
  };

  render() {
    const {
      href,
      children,
    } = this.props;

    return React.cloneElement(children, {
      href: href,
      target: '_blank',
    });
  }
}

export default LinkExternal;
