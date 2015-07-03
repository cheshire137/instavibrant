'use strict';
var React = require('react'),
    Vibrant = require('node-vibrant');
var ImageListItem = React.createClass({
  onImageLoad: function(e) {
    var img = $(e.target);
    img.crossOrigin = 'Anonymous';
    var vibrant = new Vibrant(img.attr('src'));
    vibrant.getSwatches(function(err, swatches) {
      if (err) {
        console.error('failed to get swatches', err);
        return;
      }
      console.log('swatches', swatches);
      for (var swatch in swatches) {
        if (swatches.hasOwnProperty(swatch) && swatches[swatch]) {
          console.log('swatch', swatch, swatches[swatch].getHex());
        }
      }
    });
  },
  render: function() {
    var thumbnail = this.props.image.images.thumbnail;
    var url = window.Config.serverUrl + '/image?url=' +
              encodeURIComponent(thumbnail.url);
    return (
      <li className="image-list-item">
        <a href={this.props.image.link} target="_blank" className="image-link">
          <img className="thumbnail" src={url} width={thumbnail.width} height={thumbnail.height} onLoad={this.onImageLoad} crossOrigin="anonymous" />
        </a>
      </li>
    );
  }
});
module.exports = ImageListItem;
