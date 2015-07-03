'use strict';
var React = require('react');
var ImageListItem = React.createClass({
  render: function() {
    var thumbnail = this.props.image.images.thumbnail;
    return (
      <li className="image-list-item">
        <img className="thumbnail" src={thumbnail.url} width={thumbnail.width} height={thumbnail.height} />
      </li>
    );
  }
});
module.exports = ImageListItem;
