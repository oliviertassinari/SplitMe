import React from 'react';

class LinkExternal extends React.Component {
  static propTypes = {
    children: React.PropTypes.element,
    href: React.PropTypes.string,
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
