'use strict';
var Instagram = require('./instagram'),
    React = require('react'),
    LocalStorage = require('./localStorage'),
    Router = require('react-router');
var UserDetails = React.createClass({
  mixins: [Router.Navigation],
  getInitialState: function() {
    return {user: {}, follows: []};
  },
  fetchUser: function() {
    Instagram.getUser().then(function(userData) {
      if (userData.meta &&
          userData.meta.error_type === 'OAuthAccessTokenException') {
        this.transitionTo('logout');
        return;
      }
      LocalStorage.set('user', userData.data.id);
      this.setState({user: userData.data});
    }.bind(this), function() {
      console.error('failed to fetch Instagram user details', arguments);
    });
  },
  fetchFollowed: function() {
    Instagram.getFollows().then(function(response) {
      if (response.meta &&
          response.meta.error_type === 'OAuthAccessTokenException') {
        this.transitionTo('logout');
        return;
      }
      console.log('loaded', response.data.length, 'followed users');
      console.log(response.data[0]);
      this.setState({follows: response.data});
      $('.dropdown-button').dropdown();
    }.bind(this), function() {
      console.error('failed to fetch Instagram follows', arguments);
    });
  },
  componentDidMount: function() {
    this.fetchUser();
    this.fetchFollowed();
  },
  onFollowClick: function(e) {
    e.preventDefault();
    var link = $(e.target);
    if (!link.is('a')) {
      link = link.closest('a');
    }
    var userID = link.attr('data-id');
    var name = link.text();
    this.props.onUserChange(userID, name);
  },
  render: function() {
    var name = this.state.user.full_name;
    if (!name || name.length < 1) {
      name = this.state.user.username;
    }
    var isAuthUserLoaded = !this.props.currentUserID ||
        this.props.currentUserID === 'self';
    return (
      <div>
        <ul id="follows-dropdown" className="dropdown-content">
          {isAuthUserLoaded ? '' : (
            <li className="follow-list-item self">
              <a href="#" data-id="self" onClick={this.onFollowClick}>
                {name}
              </a>
            </li>
          )}
          {this.state.follows.map(function(follow) {
            var followName = follow.full_name;
            if (!followName || followName.length < 1) {
              followName = follow.username;
            }
            var followClass = 'follow-list-item';
            if (this.props.currentUserID === follow.id) {
              followClass += ' active';
            }
            return (
              <li key={'follow-' + follow.id} className={followClass}>
                <a href="#" data-id={follow.id} onClick={this.onFollowClick}>
                  <img src={follow.profile_picture} className="avatar" alt={follow.username}/>
                  {followName}
                </a>
              </li>
            );
          }.bind(this))}
        </ul>
        <ul className="user-details right">
          <li className="instagram-user">
            <a href="#!" data-activates="follows-dropdown" className="dropdown-button name-and-avatar cyan-text text-darken-2" target="_blank">
              <img src={this.state.user.profile_picture} alt={this.state.user.username} className="avatar"/>
              <span className="name">{name}</span>
              <i className="mdi-navigation-arrow-drop-down right"></i>
            </a>
          </li>
          <li className="logout-list-item">
            <a href="/#/logout" className="logout-link cyan-text text-darken-2">Log Out</a>
          </li>
        </ul>
      </div>
    );
  }
});
module.exports = UserDetails;
