'use strict';
var React = require('react');
var SwatchListItem = React.createClass({
  render: function() {
    var hex = this.props.swatch.hex;
    var className = 'swatch swatch-' + this.props.swatch.name;
    var style = {backgroundColor: hex};
    return (
      <li className="swatch-list-item">
        <div className={className} title={hex} style={style}></div>
      </li>
    );
  }
});
module.exports = SwatchListItem;
