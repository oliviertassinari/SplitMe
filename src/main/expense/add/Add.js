import React from 'react';
import pure from 'recompose/pure';
import Immutable from 'immutable';
import EventListener from 'react-event-listener';
import {connect} from 'react-redux';
import DocumentTitle from 'react-document-title';

import polyglot from 'polyglot';
import TextIcon from 'main/TextIcon';
import BottomButton from 'main/BottomButton';
import CanvasHead from 'main/canvas/Head';
import CanvasBody from 'main/canvas/Body';
import modalActions from 'main/modal/actions';
import expenseActions from 'main/expense/add/actions';
import ExpenseDetail from 'main/expense/add/Detail';
import ExpenseAddHeader from 'main/expense/add/AddHeader';

const styles = {
  bottom: {
    paddingBottom: 50,
  },
};

class ExpenseAdd extends React.Component {
  static propTypes = {
    account: React.PropTypes.instanceOf(Immutable.Map),
    dispatch: React.PropTypes.func.isRequired,
    expense: React.PropTypes.instanceOf(Immutable.Map),
    fetched: React.PropTypes.bool.isRequired,
    routeParams: React.PropTypes.shape({
      id: React.PropTypes.string,
      expenseId: React.PropTypes.string,
    }).isRequired,
  };

  state = {
    showBottom: true,
  };

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

  componentWillUnmount() {
    this.props.dispatch(expenseActions.unmount());
  }

  handleKeyBoardShow = () => {
    // Only apply when we edit an expense
    if (this.props.routeParams.expenseId) {
      this.setState({
        showBottom: false,
      });
    }
  };

  handleKeyBoardHide = () => {
    // Only apply when we edit an expense
    if (this.props.routeParams.expenseId) {
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
      fetched,
      routeParams,
      account,
      expense,
    } = this.props;

    let title;

    if (routeParams.expenseId) {
      title = polyglot.t('expense_edit');
    } else {
      title = polyglot.t('expense_new');
    }

    let showTapSave = false;
    let body;
    let bottom;
    let style;

    if (fetched) {
      if (account && expense) {
        showTapSave = true;
        body = <ExpenseDetail account={account} expense={expense} />;

        if (routeParams.expenseId && this.state.showBottom) {
          style = styles.bottom;
          bottom = <BottomButton onTouchTap={this.handleTouchTapDelete} />;
        }
      } else if (!account && routeParams.id) {
        body = <TextIcon text={polyglot.t('account_not_found')} />;
      } else if (!expense && routeParams.expenseId) {
        body = <TextIcon text={polyglot.t('expense_not_found')} />;
      }
    }

    return (
      <div>
        {(process.env.PLATFORM === 'browser' || process.env.PLATFORM === 'server') &&
          <DocumentTitle title={title} />
        }
        <EventListener elementName="document" onBackButton={this.handleBackButton} />
        <EventListener
          elementName="window"
          {...{
            'onNative.KeyBoardShow': this.handleKeyBoardShow,
            'onNative.KeyBoardHide': this.handleKeyBoardHide,
          }}
        />
        <CanvasHead>
          <ExpenseAddHeader
            title={title}
            onTouchTapClose={this.handleTouchTapClose}
            onTouchTapSave={this.handleTouchTapSave}
            showTapSave={showTapSave}
          />
        </CanvasHead>
        <CanvasBody style={style}>
          {body}
        </CanvasBody>
        {bottom}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const expenseAdd = state.get('expenseAdd');

  return {
    fetched: expenseAdd.get('fetched'),
    account: expenseAdd.get('accountCurrent'),
    expense: expenseAdd.get('expenseCurrent'),
  };
}

export default pure(connect(mapStateToProps)(ExpenseAdd));
