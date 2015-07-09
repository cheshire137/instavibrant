'use strict';
var React = require('react'),
    SwatchListItem = require('./swatchListItem');
var SwatchList = React.createClass({
  render: function() {
    var image = this.props.image;
    var onClick = this.props.onSwatchClick;
    var swatchIndex = 0;
    return (
      <ul className="swatches-list">
        {this.props.swatches.map(function(swatch) {
          var key = 'swatch-' + image.id + '-' + swatch.name;
          var el = <SwatchListItem onClick={onClick} index={swatchIndex} key={key} swatch={swatch} />;
          swatchIndex++;
          return el;
        })}
      </ul>
    );
  }
});
module.exports = SwatchList;
