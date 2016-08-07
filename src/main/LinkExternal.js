// @flow weak

import React, {PropTypes} from 'react';

const LinkExternal = (props) => {
  const {
    href,
    children,
  } = props;

  return React.cloneElement(children, {
    href: href,
    target: '_blank',
  });
};

LinkExternal.propTypes = {
  children: PropTypes.element,
  href: PropTypes.string,
};

export default LinkExternal;
