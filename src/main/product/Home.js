// @flow weak

import React, {Component, PropTypes} from 'react';
import pure from 'recompose/pure';
import Immutable from 'immutable';
import DocumentTitle from 'react-document-title';
import {createStyleSheet} from 'stylishly/lib/styleSheet';
import polyglot from 'polyglot';
import CanvasAppBar from 'main/canvas/AppBar';
import CanvasBody from 'main/canvas/Body';
import CanvasHead from 'main/canvas/Head';
import ProductCallToAction from 'main/product/CallToAction';
import ProductArgument from 'main/product/Argument';
import ProductFooter from 'main/product/Footer';
import AccountDetailBalance from 'main/account/detail/Balance';
import AccountDetailDebts from 'main/account/detail/Debts';
import imageLanding from 'main/product/landing.jpg';
import imageNicolas from 'main/product/nicolas.jpg';
import imageAlexandre from 'main/product/alexandre.jpg';

const styleSheet = createStyleSheet('ProductHome', () => ({
  landing: {
    padding: 25,
    backgroundImage: `url(${imageLanding})`,
    backgroundColor: '#D3CAC5',
    backgroundPosition: '26% 70%',
    backgroundSize: 'cover',
    height: 450,
    '@media (min-width: 768px)': {
      height: 510,
    },
  },
  landingContent: {
    width: '100%',
    textAlign: 'center',
  },
  landingText: {
    color: '#fff',
    textShadow: '0 0 10px rgba(0,0,0,.85)',
    fontWeight: '300',
    lineHeight: 1.3,
    margin: '0 0 12px',
    fontSize: 33,
    textAlign: 'center',

    '@media (min-width: 768px)': {
      fontSize: 53,
      paddingTop: 70,
    },
  },
  landingInfo: {
    color: '#fff',
    textShadow: '0 0 10px rgba(0,0,0,.85)',
    fontWeight: '400',
    fontSize: 20,
    margin: '0 0 20px',
    '@media (min-width: 768px)': {
      fontSize: 26,
    },
  },
}));

const members = Immutable.fromJS(
  [
    {
      id: '0',
      balances: [
        {
          currency: 'EUR',
          value: 10,
        },
      ],
    },
    {
      id: '1',
      displayName: 'Nicolas',
      photo: imageNicolas,
      balances: [
        {
          currency: 'EUR',
          value: -33,
        },
      ],
    },
    {
      id: '2',
      displayName: 'Alexandre',
      photo: imageAlexandre,
      balances: [
        {
          currency: 'EUR',
          value: 23,
        },
      ],
    },
  ],
);

const membersCurrencies = Immutable.fromJS(
  [
    {
      id: '0',
      balances: [
        {
          currency: 'EUR',
          value: 10,
        },
        {
          currency: 'IDR',
          value: -9028,
        },
      ],
    },
    {
      id: '1',
      displayName: 'Nicolas',
      photo: imageNicolas,
      balances: [
        {
          currency: 'EUR',
          value: -33,
        },
        {
          currency: 'IDR',
          value: 9028,
        },
      ],
    },
    {
      id: '2',
      displayName: 'Alexandre',
      photo: imageAlexandre,
      balances: [
        {
          currency: 'EUR',
          value: 23,
        },
        {
          currency: 'IDR',
          value: 0,
        },
      ],
    },
  ],
);

class ProductHome extends Component {
  static contextTypes = {
    styleManager: PropTypes.object.isRequired,
  };

  render() {
    const classes = this.context.styleManager.render(styleSheet);

    return (
      <div>
        <DocumentTitle title={polyglot.t('product.title')} />
        <CanvasHead>
          <CanvasAppBar
            title="SplitMe"
            showMenuIconButton={false}
            data-test="AppBar"
          />
        </CanvasHead>
        <CanvasBody full={true}>
          <div className={classes.landing}>
            <div className={classes.landingContent}>
              <h2 className={classes.landingText}>
                {polyglot.t('product.description_short')}
              </h2>
              <h3 className={classes.landingInfo}>
                {polyglot.t('product.info')}
              </h3>
              <ProductCallToAction
                primary={false}
                secondary={true}
                analyticsValue={1}
              />
            </div>
          </div>
          <ProductArgument
            title={polyglot.t('product.argument1_title')}
            description={polyglot.t('product.argument1_description')}
            demo={<AccountDetailBalance members={members} />}
          />
          <ProductArgument
            title={polyglot.t('product.argument2_title')}
            description={polyglot.t('product.argument2_description')}
            demo={<AccountDetailDebts members={members} />}
          />
          <ProductArgument
            title={polyglot.t('product.argument3_title')}
            description={polyglot.t('product.argument3_description')}
            demo={<AccountDetailBalance members={membersCurrencies} />}
          />
          <ProductFooter />
        </CanvasBody>
      </div>
    );
  }
}

export default pure(ProductHome);
