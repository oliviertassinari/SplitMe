import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Immutable from 'immutable';
import AppBar from 'material-ui/lib/app-bar';
import DocumentTitle from 'react-document-title';
import polyglot from 'polyglot';
import radium from 'radium';

import CanvasHead from 'Main/Canvas/Head';
import CanvasBody from 'Main/Canvas/Body';
import ProductCallToAction from 'Main/Product/CallToAction';
import ProductArgument from 'Main/Product/Argument';
import AccountBalance from 'Main/Account/Balance';
import AccountDebts from 'Main/Account/Debts';
import constant from 'constant';

const imageLanding = require('Main/Product/landing.jpg');
const imageProfile1 = require('Main/Product/profile1.jpg');
const imageProfile2 = require('Main/Product/profile2.jpg');

const styles = {
  landing: {
    padding: 25,
    backgroundImage: `url(${imageLanding})`,
    backgroundColor: '#D3CAC5',
    backgroundPosition: '25% 70%',
    backgroundSize: 'cover',
    height: 450,
    '@media (min-width: 768px)': {
      height: 510,
    },
  },
  landingContent: {
    width: '100%',
    textAlign: 'center',

    '@media (min-width: 768px)': {
      textAlign: 'left',
    },
  },
  landingText: {
    color: '#fff',
    textShadow: '0 0 10px rgba(0,0,0,.85)',
    fontWeight: '300',
    lineHeight: 1.3,
    margin: '0 0 10px',
    fontSize: 33,
    textAlign: 'center',

    '@media (min-width: 768px)': {
      fontSize: 53,
      textAlign: 'left',
      paddingTop: 40,
    },
  },
  landingInfo: {
    color: '#fff',
    textShadow: '0 0 10px rgba(0,0,0,.85)',
    fontWeight: '400',
    fontSize: 20,
    margin: '0 0 20px',
    '@media (min-width: 768px)': {
      fontSize: 25,
    },
  },
  footer: {
    padding: 25,
    fontSize: 15,
    textAlign: 'center',
  },
  footerA: {
    color: '#555',
    textDecoration: 'none',
  },
};

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
      photo: imageProfile1,
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
      photo: imageProfile2,
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
      photo: imageProfile1,
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
      photo: imageProfile2,
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

const ProductHome = React.createClass({
  mixins: [
    PureRenderMixin,
  ],
  render() {
    return (
      <div>
        <DocumentTitle title={polyglot.t('product.title')} />
        <CanvasHead>
          <AppBar
            title="SplitMe"
            showMenuIconButton={false}
            data-test="AppBar"
          />
        </CanvasHead>
        <CanvasBody>
          <div style={styles.landing}>
            <div style={styles.landingContent}>
              <h2 style={styles.landingText}>
                {polyglot.t('product.description')}
              </h2>
              <h3 style={styles.landingInfo}>
                {polyglot.t('product.info')}
              </h3>
              <ProductCallToAction />
            </div>
          </div>
          <ProductArgument
            title={polyglot.t('product.argument1.title')}
            description={polyglot.t('product.argument1.description')}
            demo={<AccountBalance members={members} />}
          />
          <ProductArgument
            title={polyglot.t('product.argument2.title')}
            description={polyglot.t('product.argument2.description')}
            demo={<AccountDebts members={members} />}
          />
          <ProductArgument
            title={polyglot.t('product.argument3.title')}
            description={polyglot.t('product.argument3.description')}
            demo={<AccountBalance members={membersCurrencies} />}
          />
          <div style={styles.footer}>
            <a href={constant.PRODUCTPAINS_URL} target="_blank"
              style={styles.footerA}>
              {polyglot.t('settings_feedback')}
            </a>
          </div>
        </CanvasBody>
      </div>
    );
  },
});

export default radium(ProductHome);
