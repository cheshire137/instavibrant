'use strict';
var Router = require('react-router'),
    LocalStorage = require('./localStorage'),
    React = require('react');
var Index = React.createClass({
  mixins: [Router.Navigation],
  componentWillMount: function() {
    var token = LocalStorage.get('token');
    if (token) {
      this.transitionTo('instagram');
    }
  },
  getInitialState: function() {
    return {authUrl: 'https://instagram.com/oauth/authorize/?client_id=' +
                     window.Config.instagram.clientId + '&redirect_uri=' +
                     encodeURIComponent(window.Config.instagram.redirectUri) +
                     '&response_type=token'};
  },
  render: function() {
    return (
      <div>
        <nav>
          <div className="nav-wrapper cyan lighten-5">
            <a href="/#/" className="brand-logo center cyan-text text-darken-2">
              Instavibrant
            </a>
          </div>
        </nav>
        <div className="container login">
          <div className="row">
            <div className="col s6 offset-s3">
              <p className="center">
                Get colors from your Instagram photos using
                <a href="http://jariz.github.io/vibrant.js/" target="_blank">Vibrant.js</a>.
              </p>
              <p className="center">
                <a className="light-blue accent-3 waves-effect waves-light btn-large" href={this.state.authUrl}>
                  Log in to Instagram
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
});
module.exports = Index;
