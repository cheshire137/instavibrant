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
  fetchImages: function(url, previousUrl) {
    Instagram.getRecentImages(url).then(function(response) {
      console.log('loaded', response.data.length, 'images');
      console.log('sample image', response.data[0]);
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
    }.bind(this), function() {
      console.error('failed to fetch images from Instagram');
    });
  },
  componentWillMount: function() {
    this.fetchImages();
  },
  loadPreviousPage: function(e) {
    e.preventDefault();
    var urls = this.state.previousUrls;
    if (urls.length > 0) {
      var newUrl = urls[urls.length - 1];
      var newPrevUrl;
      if (urls.length > 1) {
        newPrevUrl = urls[urls.length - 2];
      }
      this.fetchImages(newUrl, newPrevUrl);
    } else {
      this.fetchImages();
    }
  },
  loadNextPage: function(e) {
    e.preventDefault();
    this.fetchImages(this.state.nextUrl, this.state.currentUrl);
  },
  render: function() {
    return (
      <div>
        <nav>
          <div className="nav-wrapper cyan lighten-5">
            <a href="/#/" className="brand-logo center cyan-text text-darken-2">
              Instavibrant
            </a>
            <UserDetails />
          </div>
        </nav>
        <div className="container">
          <div className="images-list-wrapper">
            <ul className="images-list">
              {this.state.images.map(function(image) {
                return <ImageListItem key={'image-' + image.id} image={image} />;
              })}
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
