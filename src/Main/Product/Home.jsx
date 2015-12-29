import React from 'react';
import Immutable from 'immutable';
import AppBar from 'material-ui/lib/app-bar';
import DocumentTitle from 'react-document-title';
import polyglot from 'polyglot';

import CanvasHead from 'Main/Canvas/Head';
import CanvasBody from 'Main/Canvas/Body';
import ProductCallToAction from 'Main/Product/CallToAction';
import AccountBalance from 'Main/Account/Balance';
import AccountDebts from 'Main/Account/Debts';

require('Main/Product/home.less');
const imageLanding = require('Main/Product/landing.jpg');
const imageProfile1 = require('Main/Product/profile1.jpg');
const imageProfile2 = require('Main/Product/profile2.jpg');

const styles = {
  screen: {
    background: '#fff',
    padding: 25,
    boxSizing: 'border-box',
    display: 'flex',
    flexWrap: 'wrap',
    color: '#333',
  },
  landing: {
    background: `url(${imageLanding}) no-repeat #D3CAC5`,
    backgroundPosition: '25% 70%',
    backgroundSize: 'cover',
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
          value: 1659,
        },
        {
          currency: 'USD',
          value: 0,
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
          value: -9028,
        },
        {
          currency: 'USD',
          value: 0,
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
          value: 7368,
        },
        {
          currency: 'USD',
          value: 0,
        },
      ],
    },
  ],
);

const ProductHome = React.createClass({
  render() {
    return (
      <div>
        <DocumentTitle title={polyglot.t('product.title')} />
        <CanvasHead>
          <AppBar
            title="SplitMe"
            showMenuIconButton={false}
          />
        </CanvasHead>
        <CanvasBody>
          <div style={Object.assign({}, styles.screen, styles.landing)} className="product-home-landing">
            <div className="product-home-landing-content">
              <h2 className="product-home-landing-text">
                {polyglot.t('product.description')}
              </h2>
              <ProductCallToAction />
            </div>
          </div>
          <div style={styles.screen}>
            <div className="product-home-description">
              <h2 style={styles.h2}>
                {`Gardez un oeil sur l'état de la balance`}
              </h2>
              <p style={styles.p}>
                {`Que ce soit pour partager les factures de ménages entre colocataires,
                  ou suivre le détail des dépenses lors de vos voyages entre amis,
                  SplitMe vous simplifie la vie.`}
              </p>
            </div>
            <div className="product-home-demo">
              <AccountBalance members={members} />
            </div>
          </div>
          <div style={styles.screen}>
            <div className="product-home-description">
              <h2 style={styles.h2}>
                {'Remboursez facilement vos amis'}
              </h2>
              <p style={styles.p}>
                {`Notre algorithme determine le nombre minimum de transations pour rembourser
                  efficacement chaque personnes.`}
              </p>
            </div>
            <div className="product-home-demo">
              <AccountDebts members={members} />
            </div>
          </div>
          <div style={styles.screen}>
            <div className="product-home-description">
              <h2 style={styles.h2}>
                {'Utilisez plusieurs devises'}
              </h2>
              <p style={styles.p}>
                {`Très utile lorque vous voyagez dans plusieurs pays.`}
              </p>
            </div>
            <div className="product-home-demo">
              <AccountBalance members={membersCurrencies} />
            </div>
          </div>
        </CanvasBody>
      </div>
    );
  },
});

export default ProductHome;
