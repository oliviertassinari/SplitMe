
import React, { PropTypes, Component } from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/pure';
import ImmutablePropTypes from 'react-immutable-proptypes';
import EventListener from 'react-event-listener';
import { connect } from 'react-redux';
import DocumentTitle from 'react-document-title';
import polyglot from 'polyglot';
import actionTypes from 'redux/actionTypes';
import ViewContainer from 'modules/components/ViewContainer';
import ScrollView from 'modules/components/ScrollView';
import TextIconError from 'modules/components/TextIconError';
import LayoutBody from 'modules/components/LayoutBody';
import BottomButton from 'modules/components/BottomButton';
import modalActions from 'main/modal/actions';
import expenseActions from 'main/expense/add/actions';
import ExpenseDetail from 'main/expense/add/Detail';
import screenActions from 'main/screen/actions';
import ExpenseAddHeader from './AddHeader';
import ExpenseAddHandler from './AddHandler';

class ExpenseAdd extends Component {
  static propTypes = {
    account: ImmutablePropTypes.map,
    allowExit: PropTypes.bool.isRequired,
    dialog: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    expense: ImmutablePropTypes.map,
    fetched: PropTypes.bool.isRequired,
    route: PropTypes.object.isRequired,
    routeParams: PropTypes.shape({
      id: PropTypes.string,
      expenseId: PropTypes.string,
    }).isRequired,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  state = {
    showBottom: true,
  };

  componentWillMount() {
    this.context.router.setRouteLeaveHook(this.props.route, () => {
      if (this.props.dialog !== '') {
        setTimeout(() => {
          this.props.dispatch(screenActions.dismissDialog());
        }, 0);

        return false;
      } else if (this.props.allowExit) {
        return true;
      }

      setTimeout(() => {
        this.handleTouchTapClose();
      }, 0);

      return false;
    });
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

  handleTouchTapClose = (event) => {
    if (event) {
      event.preventDefault();
    }

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

  handleClickDelete = () => {
    const {
      dispatch,
    } = this.props;

    dispatch(modalActions.show({
      actionNames: [
        {
          label: polyglot.t('cancel'),
        },
        {
          label: polyglot.t('delete'),
          onTouchTap: () => {
            dispatch({
              type: actionTypes.EXPENSE_ADD_TAP_DELETE,
            });
          },
        },
      ],
      description: polyglot.t('expense_confirm_delete'),
    }));
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

    if (fetched) {
      if (account && expense) {
        showTapSave = true;
        body = <ExpenseDetail account={account} expense={expense} />;

        if (routeParams.expenseId && this.state.showBottom) {
          bottom = <BottomButton onClick={this.handleClickDelete} />;
        }
      } else if (!account && routeParams.id) {
        body = <TextIconError text={polyglot.t('account_not_found')} />;
      } else if (!expense && routeParams.expenseId) {
        body = <TextIconError text={polyglot.t('expense_not_found')} />;
      }
    }

    return (
      <ViewContainer>
        {(process.env.PLATFORM === 'browser' || process.env.PLATFORM === 'server') && (
          <DocumentTitle title={title} />
        )}
        <EventListener
          target="window"
          {...{
            'onNative.KeyBoardShow': this.handleKeyBoardShow,
            'onNative.KeyBoardHide': this.handleKeyBoardHide,
          }}
        />
        <ExpenseAddHeader
          title={title}
          onTouchTapClose={this.handleTouchTapClose}
          onTouchTapSave={this.handleTouchTapSave}
          showTapSave={showTapSave}
        />
        <ScrollView>
          <LayoutBody>
            {body}
          </LayoutBody>
        </ScrollView>
        {bottom}
        <ExpenseAddHandler accountId={routeParams.id} />
      </ViewContainer>
    );
  }
}

export default compose(
  pure,
  connect((state) => {
    const expenseAdd = state.get('expenseAdd');

    return {
      account: expenseAdd.get('accountCurrent'),
      allowExit: expenseAdd.get('allowExit'),
      dialog: state.getIn(['screen', 'dialog']),
      expense: expenseAdd.get('expenseCurrent'),
      fetched: expenseAdd.get('fetched'),
    };
  }),
)(ExpenseAdd);
