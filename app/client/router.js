AtmosRouter = ReactiveRouter.extend({
  routes: {
    '': 'packages',
    'package/:name': 'package',
    'wtf': 'wtfApp',
    'wtf/app': 'wtfApp',
    'wtf/package': 'wtfPackage',
    'logs': 'logs',
    // TEMP
    'dump': 'dump'
  },

  packages: function() {
    this.goto('packages');
  },
  
  package: function(name) {
    Session.set('currentPackage', name);
    this.goto('package');
  },
  
  wtfApp: function() {
    this.goto('wtf/app');
  },

  wtfPackage: function() {
    this.goto('wtf/package');
  },

  // TEMP
  dump: function() {
    this.goto('dump');
  },

  logs: function() {
    this.goto('logs');
  }
});

Router = new AtmosRouter();

Meteor.startup(function() {
  Backbone.history.start({
    pushState: true
  });
});
