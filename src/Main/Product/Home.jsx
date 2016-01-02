import React from 'react';
import Immutable from 'immutable';
import AppBar from 'material-ui/lib/app-bar';
import DocumentTitle from 'react-document-title';
import polyglot from 'polyglot';

import CanvasHead from 'Main/Canvas/Head';
import CanvasBody from 'Main/Canvas/Body';
import ProductCallToAction from 'Main/Product/CallToAction';
import ProductArgument from 'Main/Product/Argument';
import AccountBalance from 'Main/Account/Balance';
import AccountDebts from 'Main/Account/Debts';

require('Main/Product/home.less');
const imageLanding = require('Main/Product/landing.jpg');
const imageProfile1 = require('Main/Product/profile1.jpg');
const imageProfile2 = require('Main/Product/profile2.jpg');

const styles = {
  landing: {
    padding: 25,
    background: `url(${imageLanding}) no-repeat #D3CAC5`,
    backgroundPosition: '25% 70%',
    backgroundSize: 'cover',
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
          <div style={styles.landing} className="product-home-landing">
            <div className="product-home-landing-content">
              <h2 className="product-home-landing-text">
                {polyglot.t('product.description')}
              </h2>
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
        </CanvasBody>
      </div>
    );
  },
});

export default ProductHome;
