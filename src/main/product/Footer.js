// @flow weak

import React, { PropTypes } from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/pure';
import { createStyleSheet } from 'jss-theme-reactor';
import polyglot from 'polyglot';
import constant from 'constant';
import LinkExternal from 'modules/components/LinkExternal';
import withStyles from 'modules/styles/withStyles';
import ProductCallToAction from 'main/product/CallToAction';
import imageIcon from 'main/product/icon.png';

const styleSheet = createStyleSheet('ProductFooter', () => ({
  root: {
    padding: '38px 0',
    fontSize: 15,
    display: 'flex',
    justifyContent: 'center',
  },
  img: {
    height: 64,
    width: 64,
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

const ProductFooter = (props) => {
  const classes = props.classes;

  return (
    <div className={classes.root}>
      <div className={classes.cellLeft}>
        <img src={imageIcon} className={classes.img} alt="" />
      </div>
      <div className={classes.cellRight}>
        <ProductCallToAction primary size="normal" analyticsValue={2} />
        <ul className={classes.ul}>
          <li className={classes.li}>
            <LinkExternal className={classes.link}>
              <a href={constant.PRODUCTPAINS_URL}>
                {polyglot.t('settings_feedback')}
              </a>
            </LinkExternal>
          </li>
          <li className={classes.li}>
            <a
              href="https://www.facebook.com/SplitMeApp/"
              className={classes.link}
              target="_blank"
              rel="noopener noreferrer"
            >
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
};

ProductFooter.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(
  pure,
  withStyles(styleSheet),
)(ProductFooter);
