'use strict';

const actions = {
  show(actionsName, description, title) {
    return {
      type: 'MODAL_UPDATE',
      actions: actionsName,
      title: title,
      description: description,
    };
  },
  dismiss() {
    return {
      type: 'MODAL_DISMISS',
    };
  },
};

module.exports = actions;
