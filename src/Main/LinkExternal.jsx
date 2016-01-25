import React from 'react';
import pure from 'recompose/pure';

const LinkExternal = React.createClass({
  propTypes: {
    children: React.PropTypes.element,
    href: React.PropTypes.string,
  },
  render() {
    const {
      href,
      children,
    } = this.props;

    return React.cloneElement(children, {
      href: href,
      target: '_blank',
    });
  },
});

export default pure(LinkExternal);
