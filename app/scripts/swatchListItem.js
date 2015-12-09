'use strict';
var React = require('react'),
    tinycolor = require('tinycolor2');
var SwatchListItem = React.createClass({
  onClick: function(e) {
    e.preventDefault();
    this.props.onClick(this.props.index);
  },
  render: function() {
    var hex = this.props.swatch.hex;
    var className = 'swatch swatch-' + this.props.swatch.name +
                    (tinycolor(hex).isDark() ? ' dark' : ' light');
    var style = {backgroundColor: hex};
    return (
      <li className="swatch-list-item">
        <a href="#" onClick={this.onClick} className={className} title={hex} style={style}>
          {hex}
        </a>
      </li>
    );
  }
});
module.exports = SwatchListItem;
