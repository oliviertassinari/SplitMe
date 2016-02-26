import React from 'react';
import pure from 'recompose/pure';
import radium from 'radium';

const styles = {
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
};

class ProductArgument extends React.Component {
  static propTypes = {
    demo: React.PropTypes.element,
    description: React.PropTypes.string,
    title: React.PropTypes.string,
  };

  render() {
    const {
      demo,
      description,
      title,
    } = this.props;

    return (
      <div style={styles.screen}>
        <div style={styles.description}>
          <h2 style={styles.h2}>
            {title}
          </h2>
          <p style={styles.p}>
            {description}
          </p>
        </div>
        <div style={styles.demo}>
          {demo}
        </div>
      </div>
    );
  }
}

export default pure(radium(ProductArgument));
