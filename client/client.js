(function() {

  new ForkMe({
    user: 'possibilities',
    repo: 'atmosphere',
    ribbon: {
      position: 'left',
      color: 'red'
    }
  });

  // TODO in more than one project
  Handlebars.registerHelper('ifAny', function(data, options) {
    if (!data || (_.isArray(data) && !data.length) || (_.isFunction(data.fetch) && !data.count()))
      return options.inverse(this);
    else
      return options.fn(this);
  });

  var timeAgo = function(updatedAt) {
    return moment(updatedAt).fromNow();
  };

  Handlebars.registerHelper('timeAgo', function() {
    return timeAgo(this.updatedAt);
  });

  Handlebars.registerHelper('trunc', function(str) {
    // TODO make better
    if (str.length <= 60)
      return str;
    return str.substr(0, 60) + '...';
  });
  
  // redraw a template every X seconds
  // Nice trick huh? I should put something like this in deps-extensions - T
  Handlebars.registerHelper('refreshEvery', function(seconds) {
    var ctx = Meteor.deps.Context.current;
    if (!ctx)
      return;
      
    Meteor.setTimeout(function() { ctx.invalidate() }, seconds * 1000);
  });

  Packages = new Meteor.Collection('packages');  

  Session.set('packages.loading', true);

  Meteor.subscribe('packages', function() {
    Session.set('packages.loading', false);
  });

  Template.packages.events = {
    'click td.icon-cell': function(e) {
      e.preventDefault();
    } 
  };

  Template.packages.packages = function() {
    return Packages.find({}, {sort: {'updatedAt': -1}});
  };

  Template.packages.packagesLoading = function() {
    return Session.get('packages.loading');
  };
  
  Template.package.nonStandardMeteor = function() {
    
    // NOTE: this strictly speaking isn't true, but why would you specify a 
    // meteor version if it wasn't standard in a package
    return this.meteor;
  };
})();
