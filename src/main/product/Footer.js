import React, {Component, PropTypes} from 'react';
import pure from 'recompose/pure';
import {createStyleSheet} from 'stylishly/lib/styleSheet';

import polyglot from 'polyglot';
import constant from 'constant';
import ProductCallToAction from 'main/product/CallToAction';
import imageIcon from 'main/product/icon.png';

const styleSheet = createStyleSheet('Footer', () => ({
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
      width: 310,
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
}));

class ProductFooter extends Component {
  static contextTypes = {
    styleManager: PropTypes.object.isRequired,
  };

  render() {
    const classes = this.context.styleManager.render(styleSheet);

    return (
      <div className={classes.root}>
        <div className={classes.cellLeft}>
          <img src={imageIcon} className={classes.img} alt="" />
        </div>
        <div className={classes.cellRight}>
          <ProductCallToAction
            primary={true}
            size="normal"
            analyticsValue={2}
          />
          <ul className={classes.ul}>
            <li className={classes.li}>
              <a href={constant.PRODUCTPAINS_URL} target="_blank" className={classes.link}>
                {polyglot.t('settings_feedback')}
              </a>
            </li>
            <li className={classes.li}>
              <a href="https://www.facebook.com/SplitMeApp/" target="_blank" className={classes.link}>
                {'Facebook'}
              </a>
            </li>
            <li className={classes.li}>
              <a href="mailto:olivier.tassinari@gmail.com" className={classes.link}>
                {polyglot.t('contact')}
              </a>
            </li>
          </ul>
          <div className={classes.copyright}>
            {'Copyright © 2015 SplitMe'}
          </div>
        </div>
      </div>
    );
  }
}

export default pure(ProductFooter);
