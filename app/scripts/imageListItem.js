'use strict';
var React = require('react'),
    Vibrant = require('node-vibrant'),
    SwatchListItem = require('./swatchListItem');
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
      console.log('setting swatches state to', swatches);
      this.setState({swatches: swatches});
    }.bind(this));
  },
  render: function() {
    var thumbnail = this.props.image.images.thumbnail;
    var url = window.Config.serverUrl + '/image?url=' +
              encodeURIComponent(thumbnail.url);
    var caption = this.props.image.caption.text;
    var captionEl = '';
    if (caption && caption.length > 0) {
      captionEl = (
        <p className="caption">{{caption}}</p>
      );
    }
    var swatchListItems = [];
    for (var i=0; i<this.state.swatches.length; i++) {
      var swatch = this.state.swatches[i];
      var key = 'swatch-' + this.props.key + '-' + swatch.name;
      swatchListItems.push(<SwatchListItem key={key} swatch={swatch} />);
    }
    return (
      <li className="image-list-item clearfix">
        <a href={this.props.image.link} target="_blank" className="image-link">
          <img className="thumbnail" src={url} width={thumbnail.width} height={thumbnail.height} onLoad={this.onImageLoad} crossOrigin="anonymous" />
        </a>
        <div className="image-details">
          {{captionEl}}
          <ul className="swatches-list">
            {swatchListItems}
          </ul>
        </div>
      </li>
    );
  }
});
module.exports = ImageListItem;
