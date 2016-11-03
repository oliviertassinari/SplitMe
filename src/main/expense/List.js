// @flow weak

import React, { PropTypes, Component } from 'react';
import pure from 'recompose/pure';
import compose from 'recompose/compose';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { createSelector } from 'reselect';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import List from 'react-virtualized/dist/commonjs/List';
import Paper from 'material-ui-build/src/Paper';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import LayoutBody from 'modules/components/LayoutBody';
import ScrollView from 'modules/components/ScrollView';
import API from 'API';
import defer from 'modules/recompose/defer';
import ExpenseListItem from './ListItem';
import ExpenseListEmpty from './ListEmpty';

const LIST_ITEM_HEIGHT = 76;

class ExpenseList extends Component {
  static propTypes = {
    account: ImmutablePropTypes.map.isRequired,
    dispatch: PropTypes.func.isRequired,
    expenses: ImmutablePropTypes.list.isRequired,
    layoutBodyStyle: PropTypes.object.isRequired,
  };

  state = {
    scrollTop: 0,
  };

  handleTouchTapList = (event, expense) => {
    event.preventDefault();

    setTimeout(() => {
      this.props.dispatch(push(`/account/${
        API.accountRemovePrefixId(this.props.account.get('_id'))
        }/expense/${API.expenseRemovePrefixId(expense.get('_id'))}/edit`));
    }, 0);
  };

  rowRenderer = ({ index, style, key }) => {
    const {
      account,
      expenses,
    } = this.props;

    return (
      <div style={style} key={key} data-test="ExpenseListItem">
        <ExpenseListItem
          account={account}
          expense={expenses.get(index)}
          onTouchTap={this.handleTouchTapList}
        />
      </div>
    );
  };

  handleScroll = (event) => {
    this.setState({
      scrollTop: event.target.scrollTop,
    });
  };

  render() {
    const {
      expenses,
      layoutBodyStyle,
    } = this.props;

    if (expenses.size === 0) {
      return <ExpenseListEmpty />;
    }

    // Wait loading for expenses
    if (!API.isExpensesFetched(expenses)) {
      return null;
    }

    const wrapperStyle = {
      paddingBottom: layoutBodyStyle.marginBottom,
    };

    return (
      <ScrollView onScroll={this.handleScroll} fullHeight>
        <LayoutBody fullHeight>
          <AutoSizer>
            {({ height, width }) => (
              <div style={wrapperStyle}>
                <Paper
                  rounded={false}
                  transitionEnabled={false}
                  style={{
                    width,
                    position: 'relative',
                  }}
                  data-test="ExpenseList"
                >
                  <List
                    autoHeight
                    height={height}
                    width={width}
                    scrollTop={this.state.scrollTop}
                    rowCount={expenses.size}
                    rowRenderer={this.rowRenderer}
                    rowHeight={LIST_ITEM_HEIGHT}
                    immutableBining={expenses}
                  />
                </Paper>
              </div>
            )}
          </AutoSizer>
        </LayoutBody>
      </ScrollView>
    );
  }
}

function getExpensesSorted(expenses) {
  // Can't sort
  if (!API.isExpensesFetched(expenses)) {
    return expenses;
  }

  // DESC date order
  return expenses.sort((expenseA, expenseB) => {
    if (expenseA.get('date') < expenseB.get('date')) {
      return 1;
    }

    if (expenseA.get('date') === expenseB.get('date')) {
      return expenseA.get('dateCreated') < expenseB.get('dateCreated') ? 1 : -1;
    }

    return -1;
  });
}

const expenseSortedSelector = createSelector(
  (state, props) => props.account.get('expenses'),
  (expenses) => {
    return {
      expenses: getExpensesSorted(expenses),
    };
  }
);

export default compose(
  pure,
  defer,
  connect(expenseSortedSelector),
)(ExpenseList);
