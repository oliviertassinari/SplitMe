import React from 'react';
import pure from 'recompose/pure';
import Immutable from 'immutable';
import AppBar from 'material-ui/src/app-bar';
import DocumentTitle from 'react-document-title';
import radium from 'radium';

import polyglot from 'polyglot';
import CanvasHead from 'Main/Canvas/Head';
import CanvasBody from 'Main/Canvas/Body';
import ProductCallToAction from 'Main/Product/CallToAction';
import ProductArgument from 'Main/Product/Argument';
import ProductFooter from 'Main/Product/Footer';
import AccountBalance from 'Main/Account/Balance';
import AccountDebts from 'Main/Account/Debts';

// import imageLanding from 'Main/Product/landing.jpg';
// import imageNicolas from 'Main/Product/nicolas.jpg';
// import imageAlexandre from 'Main/Product/alexandre.jpg';
import imageLanding from './landing.jpg';
import imageNicolas from './nicolas.jpg';
import imageAlexandre from './alexandre.jpg';

const styles = {
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

class ProductHome extends React.Component {
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
                {polyglot.t('product.description.short')}
              </h2>
              <h3 style={styles.landingInfo}>
                {polyglot.t('product.info')}
              </h3>
              <ProductCallToAction analyticsValue={1} />
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
          <ProductFooter />
        </CanvasBody>
      </div>
    );
  }
}

export default pure(radium(ProductHome));
