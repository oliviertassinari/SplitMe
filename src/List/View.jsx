'use strict';

var React = require('react');

var View = React.createClass({
  propTypes: {
    onTouchTap: React.PropTypes.func,
    className: React.PropTypes.string,
  },

  onTouchTap: function(event) {
    if (this.props.onTouchTap) {
      this.props.onTouchTap(event);
    }
  },

  render: function() {
    var className = 'list';

    if(this.props.className) {
      className += ' ' + this.props.className;
    }

    return <div className={className} onTouchTap={this.onTouchTap}>
      <div className="list-left">{this.props.left}</div>
      <div className="list-content">
        {this.props.children}
      </div>
      <div className="list-right">{this.props.right}</div>
    </div>;
  }
});

module.exports = View;
