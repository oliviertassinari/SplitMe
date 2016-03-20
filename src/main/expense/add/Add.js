import React from 'react';
import pure from 'recompose/pure';
import Immutable from 'immutable';
import EventListener from 'react-event-listener';
import {connect} from 'react-redux';
import DocumentTitle from 'react-document-title';

import polyglot from 'polyglot';
import BottomButton from 'main/BottomButton';
import CanvasHead from 'main/canvas/Head';
import CanvasBody from 'main/canvas/Body';
import modalActions from 'main/modal/actions';
import expenseActions from 'main/expense/add/actions';
import ExpenseDetail from 'main/expense/add/Detail';
import ExpenseAddHeader from 'main/expense/add/AddHeader';

class ExpenseAdd extends React.Component {
  static propTypes = {
    account: React.PropTypes.instanceOf(Immutable.Map),
    accounts: React.PropTypes.instanceOf(Immutable.List).isRequired,
    dispatch: React.PropTypes.func.isRequired,
    expense: React.PropTypes.instanceOf(Immutable.Map),
    routeParams: React.PropTypes.shape({
      id: React.PropTypes.string,
      expenseId: React.PropTypes.string,
    }).isRequired,
    screenDialog: React.PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      showBottom: true,
    };
  }

  componentDidMount() {
    const {
      dispatch,
      routeParams: {
        id,
        expenseId,
      },
    } = this.props;

    dispatch(expenseActions.fetchAdd(id, expenseId));
  }

  handleKeyBoardShow = () => {
    // Only apply when we edit an expense
    if (this.props.expense.get('_id')) {
      this.setState({
        showBottom: false,
      });
    }
  };

  handleKeyBoardHide = () => {
    // Only apply when we edit an expense
    if (this.props.expense.get('_id')) {
      this.setState({
        showBottom: true,
      });
    }
  };

  handleBackButton = () => {
    const {
      dispatch,
      routeParams,
    } = this.props;

    dispatch(expenseActions.navigateBack(routeParams.id, routeParams.expenseId));
  };

  handleTouchTapClose = (event) => {
    event.preventDefault();

    const {
      dispatch,
      routeParams,
    } = this.props;

    setTimeout(() => {
      dispatch(expenseActions.navigateBack(routeParams.id, routeParams.expenseId));
    }, 0);
  };

  handleTouchTapSave = (event) => {
    event.preventDefault();

    const {
      dispatch,
      routeParams,
    } = this.props;

    setTimeout(() => {
      dispatch(expenseActions.tapSave(routeParams.id));
    }, 0);
  };

  handleTouchTapDelete = () => {
    this.props.dispatch(modalActions.show(
      [
        {
          textKey: 'cancel',
        },
        {
          textKey: 'delete',
          dispatchAction: () => {
            return expenseActions.tapDelete(this.props.routeParams.id);
          },
        },
      ],
      'expense_confirm_delete'
    ));
  };

  render() {
    const {
      account,
      accounts,
      expense,
      screenDialog,
      routeParams,
    } = this.props;

    let title = '';
    let bottom;
    let style;

    if (routeParams.expenseId) {
      title = polyglot.t('expense_edit');

      if (this.state.showBottom) {
        style = {
          paddingBottom: 50,
        };
        bottom = <BottomButton onTouchTap={this.handleTouchTapDelete} />;
      }
    } else {
      title = polyglot.t('expense_new');
    }

    const eventListenerWindow = {
      elementName: 'window',
      'onNative.KeyBoardShow': this.handleKeyBoardShow,
      'onNative.KeyBoardHide': this.handleKeyBoardHide,
    };

    return (
      <div>
        {(process.env.PLATFORM === 'browser' || process.env.PLATFORM === 'server') &&
          <DocumentTitle title={title} />
        }
        <EventListener elementName="document" onBackButton={this.handleBackButton} />
        <EventListener {...eventListenerWindow} />
        <CanvasHead>
          <ExpenseAddHeader
            title={title} onTouchTapClose={this.handleTouchTapClose}
            onTouchTapSave={this.handleTouchTapSave}
          />
        </CanvasHead>
        <CanvasBody style={style}>
          {expense &&
            <ExpenseDetail
              account={account} accounts={accounts}
              expense={expense} screenDialog={screenDialog}
            />
          }
        </CanvasBody>
        {bottom}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    account: state.getIn(['expenseAdd', 'accountCurrent']),
    accounts: state.get('accounts'),
    expense: state.getIn(['expenseAdd', 'expenseCurrent']),
    screenDialog: state.getIn(['screen', 'dialog']),
  };
}

export default pure(connect(mapStateToProps)(ExpenseAdd));
