import React from 'react';
import CircularProgress from 'material-ui/src/circular-progress';

const ENSURE_AHEAD_DELAY = 1500;
let lazyRouteName;
let timer;

export function getLazyRouteName() {
  return lazyRouteName;
}

export function lasyLoad(name, loaded) {
  clearTimeout(timer);

  switch (name) {
    case 'ProductHome':
      loadProductHome(loaded);

      timer = setTimeout(() => {
        loadAccountList();
      }, ENSURE_AHEAD_DELAY);
      break;
    case 'AccountList':
      loadAccountList(loaded);

      timer = setTimeout(() => {
        loadSettings();
        loadAccountDetail();
        loadAccountAdd();
        loadExpenseAdd();
      }, ENSURE_AHEAD_DELAY);
      break;

    case 'Settings':
      loadSettings(loaded);

      timer = setTimeout(() => {
        loadAccountList();
      }, ENSURE_AHEAD_DELAY);
      break;

    case 'AccountDetail':
      loadAccountDetail(loaded);

      timer = setTimeout(() => {
        loadAccountList();
        loadAccountAdd();
        loadExpenseAdd();
      }, ENSURE_AHEAD_DELAY);
      break;

    case 'AccountAdd':
      loadAccountAdd(loaded);

      timer = setTimeout(() => {
        loadAccountDetail();
      }, ENSURE_AHEAD_DELAY);
      break;

    case 'ExpenseAdd':
      loadExpenseAdd(loaded);

      timer = setTimeout(() => {
        loadAccountList();
        loadAccountDetail();
      }, ENSURE_AHEAD_DELAY);
      break;

    case 'NotFound':
      require.ensure(['Main/NotFound'], (require) => {
        loaded(require('Main/NotFound').default);
      });
  }

  lazyRouteName = name;
}

function loadProductHome(loaded = () => {}) {
  require.ensure(['Main/Product/Home'], (require) => {
    loaded(require('Main/Product/Home').default);
  });
}

function loadAccountList(loaded = () => {}) {
  require.ensure(['Main/Account/List'], (require) => {
    loaded(require('Main/Account/List').default);
  });
}

function loadSettings(loaded = () => {}) {
  require.ensure(['Main/Settings/Settings'], (require) => {
    loaded(require('Main/Settings/Settings').default);
  });
}

function loadAccountDetail(loaded = () => {}) {
  require.ensure(['Main/Account/Detail'], (require) => {
    loaded(require('Main/Account/Detail').default);
  });
}

function loadAccountAdd(loaded = () => {}) {
  require.ensure(['Main/Account/Add/Add'], (require) => {
    loaded(require('Main/Account/Add/Add').default);
  });
}

function loadExpenseAdd(loaded = () => {}) {
  require.ensure(['Main/Expense/Add'], (require) => {
    loaded(require('Main/Expense/Add').default);
  });
}

const styles = {
  loader: {
    display: 'flex',
    fontSize: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    height: '100vh',
    textAlign: 'center',
  },
};

export default function lazy(name) {
  class Async extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        loaded: false,
        Component: null,
      };
    }

    componentWillMount() {
      lasyLoad(name, (Component) => {
        this.setState({
          loaded: true,
          Component: Component,
        });
      });
    }

    render() {
      const {
        loaded,
        Component,
      } = this.state;

      if (loaded) {
        return <Component {...this.props} />;
      } else {
        return (
          <div style={styles.loader}>
            <CircularProgress />
          </div>
        );
      }
    }
  }

  return Async;
}
