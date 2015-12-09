'use strict';
var React = require('react'),
    Vibrant = require('node-vibrant'),
    SwatchList = require('./swatchList'),
    tinycolor = require('tinycolor2');
var ImageListItem = React.createClass({
  getInitialState: function() {
    return {swatches: [], hexIndex: 0};
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
  getHexes: function() {
    return this.state.swatches.map(function(swatch) { return swatch.hex; });
  },
  getCssColors: function(i) {
    var numSwatches = this.state.swatches.length;
    var hexes = this.getHexes();
    var defaultDark = '#333';
    var defaultLight = '#F0F0F0';
    if (typeof i === 'undefined') {
      i = this.state.hexIndex;
    }

    var hex0 = hexes[i];
    var hex1 = hexes[(i + 1) % numSwatches];
    var hex2 = hexes[(i + 2) % numSwatches];
    var hex3 = hexes[(i + 3) % numSwatches];
    var hex4 = hexes[(i + 4) % numSwatches];

    var bodyBg = hex1 || hex4 || hex3 || hex2 || hex0;
    var bodyText = hex2;
    if (!bodyText) {
      bodyText = tinycolor(bodyBg).isDark() ? defaultLight : defaultDark;
    }
    bodyText = this.getReadableText(bodyBg, bodyText);

    var bodyLink = hex3 || hex0 || hex1 || hex4 || hex2;
    bodyLink = this.getReadableText(bodyBg, bodyLink);

    var dropdownBg = hex3 || hex1 || hex0 || hex4 || hex2;
    var dropdownLink = hex4 || hex0 || hex2 || hex3 || hex1;
    dropdownLink = this.getReadableText(dropdownBg, dropdownLink);

    var headerBg = hex0 || hex3 || hex4 || hex1;
    var headerText = hex2;
    if (!headerText) {
      headerText = tinycolor(headerBg).isDark() ? defaultLight : defaultDark;
    }
    headerText = this.getReadableText(headerBg, headerText, {size: 'large'});

    var footerBg = hex4 || hex3 || hex2 || hex1 || hex0;
    var footerLink = hex1 || hex0 || hex2 || hex3;
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

    return {footerLink: footerLink, footerText: footerText,
            footerBg: footerBg, headerText: headerText,
            headerBg: headerBg, dropdownBg: dropdownBg,
            dropdownLink: dropdownLink, bodyLink: bodyLink,
            bodyText: bodyText, bodyBg: bodyBg};
  },
  previewSwatches: function(e) {
    e.preventDefault();
    var link = $(e.target);
    link.blur();
    this.applyCssColors(this.getCssColors());
    // var listItem = link.closest('.image-list-item');
    // var fromTop = listItem.offset().top - $('.nav-wrapper').outerHeight() -
    //               $('.page-footer').outerHeight() - 32;
    // $('html, body').animate({scrollTop: fromTop}, 750);
  },
  shuffleSwatches: function(e) {
    e.preventDefault();
    var link = $(e.target);
    link.blur();
    var numSwatches = this.state.swatches.length;
    var newIndex = (this.state.hexIndex + 1) % numSwatches;
    this.setState({hexIndex: newIndex});
    this.applyCssColors(this.getCssColors(newIndex));
  },
  setBodyBackground: function(index) {
    var newIndex = index - 1;
    this.setState({hexIndex: newIndex});
    this.applyCssColors(this.getCssColors(newIndex));
  },
  applyCssColors: function(colors) {
    $('body').css({'background-color': colors.bodyBg, color: colors.bodyText});
    $('a:not(.swatch)').css('color', colors.bodyLink);
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
      backgroundColor: color,
      color: tinycolor(color).isDark() ? '#F0F0F0' : '#333'
    };
  },
  render: function() {
    var thumbnail = this.props.image.images.thumbnail;
    var url = window.Config.serverUrl + '/image?url=' +
              encodeURIComponent(thumbnail.url);
    var caption = '';
    if (this.props.image.caption) {
      caption = this.props.image.caption.text;
    }
    var createPaletteUrl = 'http://www.colourlovers.com/palettes/add?colors=' +
                           this.state.swatches.map(function(swatch) {
                             return swatch.hex.replace(/^#/, '');
                           }).join(',');
    var shuffleStyle = {display: this.props.isActive ? 'inline-block' : 'none'};
    var previewStyle = {display: this.props.isActive ? 'none' : 'inline-block'};
    return (
      <li className="image-list-item clearfix">
        <a href={this.props.image.link} target="_blank" className="image-link">
          <img className="thumbnail" src={url} width={thumbnail.width} height={thumbnail.height} onLoad={this.onImageLoad} crossOrigin="anonymous" />
        </a>
        <div className="image-details">
          {caption.length > 0 ? (
            <p className="caption">{caption}</p>
          ) : ''}
          <SwatchList onSwatchClick={this.setBodyBackground} image={this.props.image} swatches={this.state.swatches} />
          {this.state.swatches.length > 0 ? (
            <ul className="image-options">
              <li>
                <a href={createPaletteUrl} className="create-palette-link" target="_blank">
                  <i className="mdi-action-open-in-new"></i>
                  Create palette
                </a>
              </li>
              <li style={previewStyle}>
                <a href="#" onClick={this.previewSwatches}>
                  <i className="mdi-action-visibility"></i>
                  Preview
                </a>
              </li>
              <li style={shuffleStyle}>
                <a href="#" onClick={this.shuffleSwatches}>
                  <i className="mdi-av-shuffle"></i>
                  Shuffle
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
