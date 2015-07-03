'use strict';
var React = require('react'),
    SwatchListItem = require('./swatchListItem');
var SwatchList = React.createClass({
  render: function() {
    var image = this.props.image;
    return (
      <ul className="swatches-list">
        {this.props.swatches.map(function(swatch) {
          var key = 'swatch-' + image.id + '-' + swatch.name;
          return <SwatchListItem key={key} swatch={swatch} />;
        })}
      </ul>
    );
  }
});
module.exports = SwatchList;
