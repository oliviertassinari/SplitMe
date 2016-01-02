import React from 'react';

const styles = {
  screen: {
    background: '#fff',
    padding: 25,
    boxSizing: 'border-box',
    display: 'flex',
    flexWrap: 'wrap',
    color: '#333',
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

const ProductArgument = React.createClass({
  propTypes: {
    demo: React.PropTypes.element,
    description: React.PropTypes.string,
    title: React.PropTypes.string,
  },
  render() {
    const {
      demo,
      description,
      title,
    } = this.props;

    return (
      <div style={styles.screen}>
        <div className="product-home-description">
          <h2 style={styles.h2}>
            {title}
          </h2>
          <p style={styles.p}>
            {description}
          </p>
        </div>
        <div className="product-home-demo">
          {demo}
        </div>
      </div>
    );
  },
});

export default ProductArgument;
