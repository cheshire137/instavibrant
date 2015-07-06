'use strict';
var React = require('react'),
    Instagram = require('./instagram'),
    ImageListItem = require('./imageListItem'),
    UserDetails = require('./userDetails'),
    LocalStorage = require('./localStorage');
var InstagramData = React.createClass({
  getInitialState: function() {
    return {images: [], previousUrls: []};
  },
  fetchImages: function(options) {
    options = options || {};
    var url = options.url;
    var previousUrl = options.previousUrl;
    var onSuccess = function(response) {
      console.log('loaded', response.data.length, 'images');
      var previousUrls = this.state.previousUrls;
      if (previousUrls.length > 0) {
        var lastUrl = previousUrls[previousUrls.length - 1];
        if (lastUrl === url) {
          previousUrls = previousUrls.slice(0, previousUrls.length - 1);
        }
      }
      if (previousUrl) {
        if (previousUrls.length < 1) {
          previousUrls = previousUrls.concat([previousUrl]);
        } else {
          var lastUrl = previousUrls[previousUrls.length - 1];
          if (lastUrl !== previousUrl) {
            previousUrls = previousUrls.concat([previousUrl]);
          }
        }
      } else if (previousUrls.length > 0) {
        previousUrls = previousUrls.slice(0, previousUrls.length - 1);
      }
      this.setState({images: response.data,
                     currentUrl: response.pagination.current_url,
                     nextUrl: response.pagination.next_url,
                     previousUrls: previousUrls});
      window.scrollTo(0, 0);
    }.bind(this);
    Instagram.getRecentImages(url, options.userID).then(onSuccess, function() {
      console.error('failed to fetch images from Instagram');
    });
  },
  componentWillMount: function() {
    this.fetchImages();
  },
  clearAppliedSwatches: function() {
    $('body, a, .dropdown-content, .dropdown-content a, ' +
      '.nav-wrapper, .brand-logo, .name-and-avatar, .logout-link, ' +
      '.page-footer, .page-footer a, .page-footer li, ' +
      '.footer-copyright').removeAttr('style');
  },
  loadPreviousPage: function(e) {
    e.preventDefault();
    this.setState({images: []});
    this.clearAppliedSwatches();
    var urls = this.state.previousUrls;
    if (urls.length > 0) {
      var newUrl = urls[urls.length - 1];
      var newPrevUrl;
      if (urls.length > 1) {
        newPrevUrl = urls[urls.length - 2];
      }
      this.fetchImages({url: newUrl, previousUrl: newPrevUrl});
    } else {
      this.fetchImages();
    }
  },
  loadNextPage: function(e) {
    e.preventDefault();
    this.clearAppliedSwatches();
    this.setState({images: []});
    this.fetchImages({url: this.state.nextUrl,
                      previousUrl: this.state.currentUrl});
  },
  onUserChange: function(userID, userName) {
    this.clearAppliedSwatches();
    this.setState({userName: userName, images: [], previousUrls: [],
                   userID: userID, nextUrl: null});
    this.fetchImages({userID: userID});
  },
  onImagePreview: function(imageID) {
    this.setState({activeImageID: imageID});
  },
  render: function() {
    var otherUserLoaded = this.state.userName && this.state.userID &&
        this.state.userID !== 'self';
    return (
      <div>
        <div className="navbar-fixed">
          <nav>
            <div className="nav-wrapper cyan lighten-5">
              <a href="/#/" className="brand-logo center cyan-text text-darken-2">
                {otherUserLoaded ? 'Instavibrant: ' + this.state.userName : 'Instavibrant'}
              </a>
              <UserDetails currentUserID={this.state.userID} onUserChange={this.onUserChange} />
            </div>
          </nav>
        </div>
        <div className="container">
          <div className="images-list-wrapper">
            <ul className="images-list">
              {this.state.images.map(function(image) {
                return <ImageListItem key={'image-' + image.id} isActive={this.state.activeImageID === image.id} onPreview={this.onImagePreview} image={image} />;
              }.bind(this))}
            </ul>
            <p className="pagination-wrapper clearfix">
              {this.state.previousUrls.length > 0 ? (
                <a href="#" onClick={this.loadPreviousPage} className="previous-page-link">Previous Page</a>
              ) : ''}
              {this.state.nextUrl ? (
                <a href="#" onClick={this.loadNextPage} className="next-page-link">Next Page</a>
              ) : ''}
            </p>
          </div>
        </div>
      </div>
    );
  }
});
module.exports = InstagramData;
