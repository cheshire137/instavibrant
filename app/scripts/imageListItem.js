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
    var attempts = 0;
    var maxAttempts = 10;
    while (!tinycolor.isReadable(bg, text, options) && attempts < maxAttempts) {
      text = isBgDark ? tinycolor(text).lighten().toString()
                      : tinycolor(text).darken().toString();
      attempts++;
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
    var hexes = this.state.swatches.map(function(swatch) { return swatch.hex; });

    var bodyBg = hexes[1] || hexes[4] || hexes[3] || hexes[2] || hexes[0];
    var bodyText = hexes[2];
    if (!bodyText) {
      bodyText = tinycolor(bodyBg).isDark() ? defaultLight : defaultDark;
    }
    bodyText = this.getReadableText(bodyBg, bodyText);

    var bodyLink = hexes[3] || hexes[0] || hexes[1] || hexes[4] || hexes[2];
    bodyLink = this.getReadableText(bodyBg, bodyLink);

    var dropdownBg = hexes[3] || hexes[1] || hexes[0] || hexes[4] || hexes[2];
    var dropdownLink = hexes[4] || hexes[0] || hexes[2] || hexes[3] || hexes[1];
    dropdownLink = this.getReadableText(dropdownBg, dropdownLink);

    var headerBg = hexes[0] || hexes[3] || hexes[4] || hexes[1];
    var headerText = hexes[2];
    if (!headerText) {
      headerText = tinycolor(headerBg).isDark() ? defaultLight : defaultDark;
    }
    headerText = this.getReadableText(headerBg, headerText, {size: 'large'});

    var footerBg = hexes[4] || hexes[3] || hexes[2] || hexes[1] || hexes[0];
    var footerLink = hexes[1] || hexes[0] || hexes[2] || hexes[3];
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

    this.applyCssColors({footerLink: footerLink, footerText: footerText,
                         footerBg: footerBg, headerText: headerText,
                         headerBg: headerBg, dropdownBg: dropdownBg,
                         dropdownLink: dropdownLink, bodyLink: bodyLink,
                         bodyText: bodyText, bodyBg: bodyBg});

    // var listItem = link.closest('.image-list-item');
    // var fromTop = listItem.offset().top - $('.nav-wrapper').outerHeight() -
    //               $('.page-footer').outerHeight() - 32;
    // $('html, body').animate({scrollTop: fromTop}, 750);
  },
  applyCssColors: function(colors) {
    $('body').css({'background-color': colors.bodyBg, color: colors.bodyText});
    $('a').css('color', colors.bodyLink);
    $('.dropdown-content').css('background-color', colors.dropdownBg);
    $('.dropdown-content a').css('color', colors.dropdownLink);
    $('.nav-wrapper').style('background-color', colors.headerBg, 'important');
    $('.brand-logo').style('color', colors.headerText, 'important');
    $('.name-and-avatar').style('color', colors.headerText, 'important');
    $('.logout-link').style('color', colors.headerText, 'important');
    $('.page-footer').style('background-color', colors.footerBg, 'important');
    $('.page-footer a').each(function() {
      this.style.setProperty('color', colors.footerLink, 'important');
    });
    $('.page-footer li').each(function() {
      this.style.setProperty('color', colors.footerText, 'important');
    });
    $('.footer-copyright').style('color', colors.footerText, 'important');

    this.setState({cssColors: colors});
    this.props.onPreview(this.props.image.id);
  },
  getCssColorStyle: function(property) {
    var color = this.state.cssColors[property];
    return {
      'background-color': color,
      color: tinycolor(color).isDark() ? '#F0F0F0' : '#333'
    };
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
          {this.props.isActive ? (
            <div className="clearfix">
              <dl className="css-colors-list first-column">
                <dt>Body background</dt>
                <dd style={this.getCssColorStyle('bodyBg')}>
                  {this.state.cssColors.bodyBg}
                </dd>
                <dt>Body text</dt>
                <dd style={this.getCssColorStyle('bodyText')}>
                  {this.state.cssColors.bodyText}
                </dd>
                <dt>Links</dt>
                <dd style={this.getCssColorStyle('bodyLink')}>
                  {this.state.cssColors.bodyLink}
                </dd>
                <dt>Header background</dt>
                <dd style={this.getCssColorStyle('headerBg')}>
                  {this.state.cssColors.headerBg}
                </dd>
                <dt>Header text</dt>
                <dd style={this.getCssColorStyle('headerText')}>
                  {this.state.cssColors.headerText}
                </dd>
              </dl>
              <dl className="css-colors-list second-column">
                <dt>Footer background</dt>
                <dd style={this.getCssColorStyle('footerBg')}>
                  {this.state.cssColors.footerBg}
                </dd>
                <dt>Footer text</dt>
                <dd style={this.getCssColorStyle('footerText')}>
                  {this.state.cssColors.footerText}
                </dd>
                <dt>Footer links</dt>
                <dd style={this.getCssColorStyle('footerLink')}>
                  {this.state.cssColors.footerLink}
                </dd>
                <dt>Dropdown background</dt>
                <dd style={this.getCssColorStyle('dropdownBg')}>
                  {this.state.cssColors.dropdownBg}
                </dd>
                <dt>Dropdown links</dt>
                <dd style={this.getCssColorStyle('dropdownLink')}>
                  {this.state.cssColors.dropdownLink}
                </dd>
              </dl>
            </div>
          ) : ''}
        </div>
      </li>
    );
  }
});
module.exports = ImageListItem;
