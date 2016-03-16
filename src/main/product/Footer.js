import React from 'react';
import pure from 'recompose/pure';
import radium from 'radium';

import polyglot from 'polyglot';
import constant from 'constant';
import ProductCallToAction from 'main/product/CallToAction';

import imageIcon from 'main/product/icon.png';

const styles = {
  root: {
    padding: '38px 0',
    fontSize: 15,
    display: 'flex',
    justifyContent: 'center',
  },
  img: {
    height: 64,
  },
  cellLeft: {
    textAlign: 'right',
    margin: '0 40px',
  },
  cellRight: {
    marginTop: 15,
    flexGrow: 1,
    '@media (min-width: 768px)': {
      flexGrow: 0,
      width: 300,
    },
  },
  ul: {
    listStyle: 'none',
    marginLeft: 0,
    marginTop: 30,
    padding: 0,
  },
  li: {
    marginBottom: 16,
  },
  link: {
    color: '#444',
    textDecoration: 'none',
  },
  copyright: {
    color: '#777',
  },
};

class ProductFooter extends React.Component {
  render() {
    return (
      <div style={styles.root}>
        <div style={styles.cellLeft}>
          <img src={imageIcon} style={styles.img} />
        </div>
        <div style={styles.cellRight}>
          <ProductCallToAction
            primary={true}
            size="normal"
            analyticsValue={2}
          />
          <ul style={styles.ul}>
            <li style={styles.li}>
              <a href={constant.PRODUCTPAINS_URL} target="_blank" style={styles.link}>
                {polyglot.t('settings_feedback')}
              </a>
            </li>
            <li style={styles.li}>
              <a href="https://www.facebook.com/SplitMeApp/" target="_blank" style={styles.link}>
                {'Facebook'}
              </a>
            </li>
            <li style={styles.li}>
              <a href="mailto:olivier.tassinari@gmail.com" style={styles.link}>
                {polyglot.t('contact')}
              </a>
            </li>
          </ul>
          <div style={styles.copyright}>
            {'Copyright © 2015 SplitMe'}
          </div>
        </div>
      </div>
    );
  }
}

export default pure(radium(ProductFooter));
