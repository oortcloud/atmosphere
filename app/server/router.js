var V2_URL = 'http://atmospherejs.com';

var redirectTo = function(path) {
  return [301, {Location: V2_URL + path}, ''];  
}

// send routes to V2
Meteor.Router.add('/', function(name) {
  return redirectTo('/');
});
Meteor.Router.add('/package/:name', function(name) {
  return redirectTo('/package/' + name);
});
Meteor.Router.add('/wtf/app', function(name) {
  return redirectTo('/docs/installing');
});
Meteor.Router.add('/wtf/package', function(name) {
  return redirectTo('/docs/publishing');
});