var React = window.React = require('react'),
    Router = require('react-router'),
    Index = require('./index'),
    AuthFailure = require('./authFailure'),
    Auth = require('./auth'),
    mountNode = document.getElementById('app'),
    Logout = require('./logout'),
    InstagramData = require('./instagramData'),
    NotFound = require('./notFound');
var {
  Route,
  DefaultRoute,
  NotFoundRoute,
  RouteHandler,
  Link
} = Router;

var InstavibrantApp = React.createClass({
  render: function() {
    return (
      <div>
        <RouteHandler/>
      </div>
    );
  }
});


// http://localhost:3001/#/access_token=194810857.4c50573.11633f6a266a48e6bb0110f52414ee77
var routes = (
  <Route handler={InstavibrantApp} path="/">
    <DefaultRoute handler={Index} />
    <Route name="authFailure" path="failed-auth" handler={AuthFailure}/>
    <Route name="auth" path="access_token=:token" handler={Auth}/>
    <Route name="instagram" path="instagram" handler={InstagramData}/>
    <Route name="logout" path="logout" handler={Logout}/>
    <NotFoundRoute handler={NotFound}/>
  </Route>
);

Router.run(routes, function(Handler) {
  var onConfigLoaded = function() {
    React.render(<Handler/>, mountNode);
  };
  if (window.Config) {
    onConfigLoaded();
  } else {
    $.get('scripts/config.json', function(Config) {
      window.Config = Config;
      console.log('loaded config', window.Config);
      onConfigLoaded();
    });
  }
});
