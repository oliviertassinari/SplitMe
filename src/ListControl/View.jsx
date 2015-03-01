'use strict';

var React = require('react');

var ListControlView = React.createClass({
  propTypes: {
    title: React.PropTypes.string.isRequired,
    onTouchTap: React.PropTypes.func,
    className: React.PropTypes.string,
  },

  onTouchTap: function(event) {
    if (this.props.onTouchTap) {
      this.props.onTouchTap(event);
    }
  },

  render: function () {
    return <div className={"list-control " + this.props.className} onTouchTap={this.onTouchTap}>
      <div className="list-control-avatar"></div>
      <div className="list-control-title">{this.props.title}</div>
      <div className="list-control-control">
        {this.props.children}
      </div>
    </div>;
  }
});

module.exports = ListControlView;
