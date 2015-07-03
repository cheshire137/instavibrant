'use strict';
var LocalStorage = require('./localStorage'),
    React = require('react');
var Instagram = (function() {
  return {
    apiUrl: 'https://api.instagram.com/v1',
    getJSON: function(path) {
      var url;
      if (path.indexOf('http') === 0) {
        url = path;
      } else {
        url = this.apiUrl + path;
      }
      if (url.indexOf('access_token=') < 0) {
        url += (url.indexOf('?') < 0 ? '?' : '&') + 'access_token=' +
               LocalStorage.get('token');
      }
      return $.ajax({
        method: 'GET',
        dataType: 'jsonp',
        jsonp: 'callback',
        jsonpCallback: 'jsonpcallback',
        url: url
      });
    },
    getFeed: function() {
      return this.getJSON('/users/self/feed');
    },
    getRecent: function(userId) {
      if (typeof userId === 'undefined') {
        userId = 'self';
      }
      return this.getJSON('/users/' + userId + '/media/recent');
    },
    getUser: function(userId) {
      if (typeof userId === 'undefined') {
        userId = 'self';
      }
      return this.getJSON('/users/' + userId);
    }
  };
})();
module.exports = Instagram;
