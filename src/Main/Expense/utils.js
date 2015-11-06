'use strict';

const utils = require('utils');

const expenseUtils = {
  getTransfersDueToAnExpense(expense) {
    let paidForArray = expense.get('paidFor');
    let i;
    let sharesTotal = 0;

    // Remove contact that haven't paid
    switch (expense.get('split')) {
      case 'equaly':
        paidForArray = paidForArray.filter((paidFor) => {
          return paidFor.get('split_equaly') === true;
        });
        break;

      case 'unequaly':
        paidForArray = paidForArray.filter((paidFor) => {
          return utils.isNumber(paidFor.get('split_unequaly')) && paidFor.get('split_unequaly') > 0;
        });
        break;

      case 'shares':
        paidForArray = paidForArray.filter((paidFor) => {
          return utils.isNumber(paidFor.get('split_shares')) && paidFor.get('split_shares') > 0;
        });

        for (i = 0; i < paidForArray.size; i++) {
          sharesTotal += paidForArray.getIn([i, 'split_shares']);
        }
        break;
    }

    const transfers = [];

    // Apply for each paidFor contact
    for (i = 0; i < paidForArray.size; i++) {
      const paidForCurrent = paidForArray.get(i);

      if (paidForCurrent.get('contactId') !== expense.get('paidByContactId')) {
        // get the amount transfered
        let amount = 0;

        switch (expense.get('split')) {
          case 'equaly':
            amount = expense.get('amount') / paidForArray.size;
            break;

          case 'unequaly':
            amount = paidForCurrent.get('split_unequaly');
            break;

          case 'shares':
            amount = expense.get('amount') * (paidForCurrent.get('split_shares') / sharesTotal);
            break;
        }

        if (amount !== 0) {
          transfers.push({
            from: expense.get('paidByContactId'),
            to: paidForCurrent.get('contactId'),
            amount: amount,
            currency: expense.get('currency'),
          });
        }
      }
    }

    return transfers;
  },
};

module.exports = expenseUtils;
