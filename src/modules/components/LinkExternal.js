import { cloneElement } from 'react';
import PropTypes from 'prop-types';

const LinkExternal = props => {
  const { children, ...other } = props;

  return cloneElement(children, {
    target: '_blank',
    ...other,
  });
};

LinkExternal.propTypes = {
  children: PropTypes.node.isRequired,
};

export default LinkExternal;
