Meteor.Router.add({
  '/': 'packages',
  '/package/:name': function(name) {
    Session.set('currentPackage', name);
    return 'package';
  },
  '/wtf': 'wtfApp',
  '/wtf/app': 'wtf/app',
  '/wtf/package': 'wtf/package',
  '/logs': 'logs',
  '*':'not_found'
});
