// @flow weak

import React, {PropTypes, Component} from 'react';
import pure from 'recompose/pure';
import {createStyleSheet} from 'stylishly/lib/styleSheet';

const styleSheet = createStyleSheet('Argument', () => ({
  screen: {
    background: '#fff',
    padding: '35px 25px',
    boxSizing: 'border-box',
    display: 'flex',
    flexWrap: 'wrap',
    color: '#333',
  },
  description: {
    flexShrink: 0,
    width: '100%',

    '@media (min-width: 768px)': {
      width: '40%',
      margin: '0 5%',
    },
  },
  demo: {
    overflow: 'auto',
    height: 350,
    background: '#eee',
    boxShadow: '0 0 10px rgba(0,0,0,.15)',
    flexShrink: 0,
    width: '100%',
    marginTop: 30,
    border: '1px solid #DCDCDC',

    '@media (min-width: 768px)': {
      width: '45%',
      maxWidth: 440,
    },
  },
  h2: {
    fontWeight: 300,
    fontSize: 32,
    lineHeight: 1.3,
  },
  p: {
    fontSize: 16,
    lineHeight: 1.5,
  },
}));

class ProductArgument extends Component {
  static propTypes = {
    demo: PropTypes.element,
    description: PropTypes.string,
    title: PropTypes.string,
  };

  static contextTypes = {
    styleManager: PropTypes.object.isRequired,
  };

  render() {
    const classes = this.context.styleManager.render(styleSheet);

    const {
      demo,
      description,
      title,
    } = this.props;

    return (
      <div className={classes.screen}>
        <div className={classes.description}>
          <h2 className={classes.h2}>
            {title}
          </h2>
          <p className={classes.p}>
            {description}
          </p>
        </div>
        <div className={classes.demo}>
          {demo}
        </div>
      </div>
    );
  }
}

export default pure(ProductArgument);
