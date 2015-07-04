'use strict';
var React = require('react'),
    Vibrant = require('node-vibrant'),
    SwatchList = require('./swatchList');
var ImageListItem = React.createClass({
  getInitialState: function() {
    return {swatches: []};
  },
  onImageLoad: function(e) {
    var img = $(e.target);
    img.crossOrigin = 'Anonymous';
    var vibrant = new Vibrant(img.attr('src'));
    vibrant.getSwatches(function(err, swatchObj) {
      if (err) {
        console.error('failed to get swatches', err);
        return;
      }
      var swatches = [];
      for (var name in swatchObj) {
        if (swatchObj.hasOwnProperty(name) && swatchObj[name]) {
          swatches.push({name: name, hex: swatchObj[name].getHex(),
                         rgb: swatchObj[name].rgb});
        }
      }
      this.setState({swatches: swatches});
    }.bind(this));
  },
  render: function() {
    var thumbnail = this.props.image.images.thumbnail;
    var url = window.Config.serverUrl + '/image?url=' +
              encodeURIComponent(thumbnail.url);
    var caption = this.props.image.caption ? this.props.image.caption.text : '';
    var createPaletteUrl = 'http://www.colourlovers.com/palettes/add?colors=' +
                           this.state.swatches.map(function(swatch) {
                             return swatch.hex.replace(/^#/, '');
                           }).join(',');
    return (
      <li className="image-list-item clearfix">
        <a href={this.props.image.link} target="_blank" className="image-link">
          <img className="thumbnail" src={url} width={thumbnail.width} height={thumbnail.height} onLoad={this.onImageLoad} crossOrigin="anonymous" />
        </a>
        <div className="image-details">
          {caption && caption.length > 0 ? <p className="caption">{{caption}}</p> : ''}
          <SwatchList image={this.props.image} swatches={this.state.swatches} />
          {this.state.swatches.length > 0 ? (
            <ul className="image-options">
              <li>
                <a href={createPaletteUrl} className="create-palette-link" target="_blank">
                  <i className="mdi-action-open-in-new"></i>
                  Create palette
                </a>
              </li>
            </ul>
          ) : ''}
        </div>
      </li>
    );
  }
});
module.exports = ImageListItem;
