'use strict';
var React = require('react'),
    tinycolor = require('tinycolor2');
var SwatchListItem = React.createClass({
  render: function() {
    var hex = this.props.swatch.hex;
    var className = 'swatch swatch-' + this.props.swatch.name +
                    (tinycolor(hex).isDark() ? ' dark' : ' light');
    var style = {backgroundColor: hex};
    return (
      <li className="swatch-list-item">
        <div className={className} title={hex} style={style}>
          {{hex}}
        </div>
      </li>
    );
  }
});
module.exports = SwatchListItem;
