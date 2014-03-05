Meteor.Router.add({
  '/': 'packages',
  '/package/:name': function(name) {
    Session.set('currentPackage', name);
    return 'package';
  },
  '/wtf': 'wtfApp',
  '/wtf/app': 'wtf/app',
  '/wtf/package': 'wtf/package',
  '/wtf/maintain': 'wtf/maintain',
  '/logs': 'logs',
  '/search/:query':function(query) {
    Session.set("search_keywords", query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&"));
    return 'packages';
  },
  '/accounts': 'accounts',
  '*':'not_found'
});
