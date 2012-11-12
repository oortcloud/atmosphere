Meteor.Router.add({
  '/': 'packages',
  '/package/:name': function() {
    Session.set('currentPackage', name);
    return 'package';
  },
  '/wtf': 'wtf/app',
  '/wtf/app': 'wtf/app',
  '/wtf/package': 'wtf/package',
  '/logs': 'logs',
  // TEMP
  '/dump': 'dump'
})