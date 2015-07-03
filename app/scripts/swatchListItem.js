'use strict';
var React = require('react');
var SwatchListItem = React.createClass({
  render: function() {
    var className = 'swatch swatch-' + this.props.swatch.name;
    var style = {backgroundColor: this.props.swatch.hex};
    return (
      <li className="swatch-list-item">
        <div className={className} style={style}>
        </div>
      </li>
    );
  }
});
module.exports = SwatchListItem;
