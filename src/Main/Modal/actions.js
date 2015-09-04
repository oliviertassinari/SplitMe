'use strict';

var actions = {
  show: function(actionsName, description, title) {
    return {
      type: 'MODAL_UPDATE',
      actions: actionsName,
      title: title,
      description: description,
    };
  },
  dismiss: function() {
    return {
      type: 'MODAL_DISMISS',
    };
  },
};

module.exports = actions;
