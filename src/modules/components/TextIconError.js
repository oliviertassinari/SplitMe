import React from 'react';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';
import TextIcon from 'modules/components/TextIcon';
import textIconErrorSvg from './TextIconError.svg';

const TextIconError = props => <TextIcon text={props.text} icon={textIconErrorSvg} />;

TextIconError.propTypes = {
  text: PropTypes.string.isRequired,
};

export default pure(TextIconError);
