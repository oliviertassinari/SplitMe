import React from 'react';

class LinkExternal extends React.Component {
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

LinkExternal.propTypes = {
  children: React.PropTypes.element,
  href: React.PropTypes.string,
};

export default LinkExternal;
