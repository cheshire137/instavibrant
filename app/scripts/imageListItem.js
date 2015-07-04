'use strict';
var React = require('react'),
    Vibrant = require('node-vibrant'),
    SwatchList = require('./swatchList'),
    tinycolor = require('tinycolor2');
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
  getReadableText: function(bg, text, options) {
    options = options || {};
    options.level = options.level || 'AA';
    options.size = options.size || 'small';
    var isBgDark = tinycolor(bg).isDark();
    while (!tinycolor.isReadable(bg, text, options)) {
      text = isBgDark ? tinycolor(text).lighten().toString()
                      : tinycolor(text).darken().toString();
    }
    return text;
  },
  previewSwatches: function(e) {
    e.preventDefault();
    var link = $(e.target);
    link.blur();
    var defaultDark = '#333';
    var defaultLight = '#F0F0F0';
    var numSwatches = this.state.swatches.length;
    var vibrant = numSwatches > 0 ? this.state.swatches[0].hex : null;
    var muted = numSwatches > 1 ? this.state.swatches[1].hex : null;
    var darkVibrant = numSwatches > 2 ? this.state.swatches[2].hex : null;
    var darkMuted = numSwatches > 3 ? this.state.swatches[3].hex : null;
    var lightVibrant = numSwatches > 4 ? this.state.swatches[4].hex : null;

    var bodyBg = muted || lightVibrant || darkMuted || darkVibrant || vibrant;
    var bodyText = darkVibrant;
    if (!bodyText) {
      bodyText = tinycolor(bodyBg).isDark() ? defaultLight : defaultDark;
    }
    bodyText = this.getReadableText(bodyBg, bodyText);

    var linkColor = darkMuted || vibrant || muted || lightVibrant || darkVibrant;
    linkColor = this.getReadableText(bodyBg, linkColor);

    var headerBg = vibrant || darkMuted || lightVibrant || muted;
    var headerText = darkVibrant;
    if (!headerText) {
      headerText = tinycolor(headerBg).isDark() ? defaultLight : defaultDark;
    }
    headerText = this.getReadableText(headerBg, headerText, {size: 'large'});

    var footerBg = lightVibrant || darkMuted || darkVibrant || muted || vibrant;
    var footerLink = muted || vibrant || darkVibrant || darkMuted;
    var isFooterDark = tinycolor(footerBg).isDark();
    if (!footerLink) {
      footerLink = isFooterDark ? defaultLight : defaultDark;
    }
    footerLink = this.getReadableText(footerBg, footerLink);

    var footerText;
    if (isFooterDark) {
      footerText = tinycolor(footerLink).lighten().toString();
    } else {
      footerText = tinycolor(footerLink).darken().toString();
    }
    footerText = this.getReadableText(footerBg, footerText);

    $('body').css({'background-color': bodyBg, color: bodyText});
    $('a').css('color', linkColor);
    $('.nav-wrapper').style('background-color', headerBg, 'important');
    $('.brand-logo').style('color', headerText, 'important');
    $('.name-and-avatar').style('color', headerText, 'important');
    $('.logout-link').style('color', headerText, 'important');
    $('.page-footer').style('background-color', footerBg, 'important');
    $('.page-footer a').each(function() {
      this.style.setProperty('color', footerLink, 'important');
    });
    $('.page-footer li').each(function() {
      this.style.setProperty('color', footerText, 'important');
    });
    $('.footer-copyright').style('color', footerText, 'important');
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
              <li>
                <a href="#" onClick={this.previewSwatches}>
                  <i className="mdi-action-visibility"></i>
                  Preview
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
