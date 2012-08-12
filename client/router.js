AtmosRouter = ReactiveRouter.extend({
  routes: {
    '': 'packages',
    'wtf': 'wtfApp',
    'wtf/app': 'wtfApp',
    'wtf/package': 'wtfPackage',
    // TEMP
    'dump': 'dump'
  },

  packages: function() {
    this.goto('packages');
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
  }
});

Router = new AtmosRouter();

Meteor.startup(function() {
  Backbone.history.start({
    pushState: true
  });
});
