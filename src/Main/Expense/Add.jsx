import React from 'react';
import pure from 'recompose/pure';
import Immutable from 'immutable';
import EventListener from 'react-event-listener';
import {connect} from 'react-redux';
import DocumentTitle from 'react-document-title';

import polyglot from 'polyglot';
import BottomButton from 'Main/BottomButton';
import CanvasHead from 'Main/Canvas/Head';
import CanvasBody from 'Main/Canvas/Body';
import modalActions from 'Main/Modal/actions';
import expenseActions from 'Main/Expense/actions';
import ExpenseDetail from 'Main/Expense/Detail';
import ExpenseAddHeader from 'Main/Expense/AddHeader';

class ExpenseAdd extends React.Component {
  static propTypes = {
    account: React.PropTypes.instanceOf(Immutable.Map),
    accounts: React.PropTypes.instanceOf(Immutable.List).isRequired,
    dispatch: React.PropTypes.func.isRequired,
    expense: React.PropTypes.instanceOf(Immutable.Map),
    pageDialog: React.PropTypes.string.isRequired,
    routeParams: React.PropTypes.shape({
      id: React.PropTypes.string,
      expenseId: React.PropTypes.string,
    }).isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.handleBackButton = this.handleBackButton.bind(this);
    this.handleKeyBoardHide = this.handleKeyBoardHide.bind(this);
    this.handleKeyBoardShow = this.handleKeyBoardShow.bind(this);
    this.handleTouchTapClose = this.handleTouchTapClose.bind(this);
    this.handleTouchTapDelete = this.handleTouchTapDelete.bind(this);
    this.handleTouchTapSave = this.handleTouchTapSave.bind(this);

    this.state = {
      showBottom: true,
    };
  }

  componentDidMount() {
    this.props.dispatch(expenseActions.fetchAdd(this.props.routeParams.id, this.props.routeParams.expenseId));
  }

  handleKeyBoardShow() {
    // Only apply when we edit an expense
    if (this.props.expense.get('_id')) {
      this.setState({
        showBottom: false,
      });
    }
  }

  handleKeyBoardHide() {
    // Only apply when we edit an expense
    if (this.props.expense.get('_id')) {
      this.setState({
        showBottom: true,
      });
    }
  }

  handleBackButton() {
    this.props.dispatch(expenseActions.navigateBack());
  }

  handleTouchTapClose(event) {
    event.preventDefault();

    setTimeout(() => {
      this.props.dispatch(expenseActions.close());
    }, 0);
  }

  handleTouchTapSave(event) {
    event.preventDefault();

    setTimeout(() => {
      this.props.dispatch(expenseActions.tapSave());
    }, 0);
  }

  handleTouchTapDelete() {
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
  }

  render() {
    const {
      account,
      accounts,
      expense,
      pageDialog,
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
          <ExpenseAddHeader title={title} onTouchTapClose={this.handleTouchTapClose}
            onTouchTapSave={this.handleTouchTapSave}
          />
        </CanvasHead>
        <CanvasBody style={style}>
          {expense &&
            <ExpenseDetail account={account} accounts={accounts}
              expense={expense} pageDialog={pageDialog}
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
    account: state.get('accountCurrent'),
    accounts: state.get('accounts'),
    expense: state.get('expenseCurrent'),
    pageDialog: state.getIn(['screen', 'dialog']),
  };
}

export default connect(mapStateToProps)(pure(ExpenseAdd));
