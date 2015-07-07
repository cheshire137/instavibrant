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
      return $.ajax({method: 'GET', dataType: 'jsonp', url: url});
    },
    getFeed: function() {
      return this.getJSON('/users/self/feed');
    },
    getRecent: function(url, userId) {
      if (typeof userId === 'undefined') {
        userId = 'self';
      }
      if (!url || typeof url === 'undefined') {
        url = '/users/' + userId + '/media/recent';
      }
      return $.Deferred(function(defer) {
        var onSuccess = function(response, textStatus, request) {
          if (response.meta && response.meta.error_type) {
            defer.reject(response.meta);
            return;
          }
          response.pagination = response.pagination || {};
          response.pagination.current_url = url;
          defer.resolve(response);
        };
        this.getJSON(url).success(onSuccess).error(defer.reject);
      }.bind(this)).promise();
    },
    getRecentImages: function(url, userId) {
      return $.Deferred(function(defer) {
        var onSuccess = function(response, textStatus, request) {
          var images = [];
          for (var i=0; i<response.data.length; i++) {
            var obj = response.data[i];
            if (obj.type === 'image') {
              images.push(obj);
            }
          }
          defer.resolve({data: images, pagination: response.pagination});
        };
        this.getRecent(url, userId).then(onSuccess, defer.reject);
      }.bind(this)).promise();
    },
    getUser: function(userId) {
      if (typeof userId === 'undefined') {
        userId = 'self';
      }
      return this.getJSON('/users/' + userId);
    },
    getFollows: function(userId) {
      if (typeof userId === 'undefined') {
        userId = 'self';
      }
      return this.getJSON('/users/' + userId + '/follows');
    }
  };
})();
module.exports = Instagram;
