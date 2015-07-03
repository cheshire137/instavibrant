'use strict';
var React = require('react'),
    Instagram = require('./instagram'),
    ImageListItem = require('./imageListItem'),
    UserDetails = require('./userDetails');
var InstagramData = React.createClass({
  getInitialState: function() {
    return {images: []};
  },
  componentWillMount: function() {
    Instagram.getRecent().then(function(imageData) {
      console.log('loaded', imageData.data.length, 'images');
      console.log(imageData.data[0]);
      this.setState({images: imageData.data,
                     nextUrl: imageData.pagination.next_url});
    }.bind(this), function() {
      console.error('failed to fetch images from Instagram');
    });
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
            <p className="next-page-wrapper">
              <a href="/#/instagram/next" className="next-page-link">Next Page</a>
            </p>
          </div>
        </div>
      </div>
    );
  }
});
module.exports = InstagramData;
