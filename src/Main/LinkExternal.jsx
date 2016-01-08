import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

const LinkExternal = React.createClass({
  propTypes: {
    children: React.PropTypes.element,
    href: React.PropTypes.string,
  },
  mixins: [
    PureRenderMixin,
  ],
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

export default LinkExternal;
