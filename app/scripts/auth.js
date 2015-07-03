'use strict';
var Router = require('react-router'),
    LocalStorage = require('./localStorage'),
    React = require('react');
var Auth = React.createClass({
  mixins: [Router.Navigation],
  contextTypes: {
    router: React.PropTypes.func
  },
  render: function() {
    var router = this.context.router;
    var token = router.getCurrentParams().token;
    LocalStorage.set('token', token);
    this.transitionTo('instagram');
    return <p></p>;
  }
});
module.exports = Auth;
