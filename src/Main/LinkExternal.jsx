import React from 'react';
import pure from 'recompose/pure';

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

export default pure(LinkExternal);
