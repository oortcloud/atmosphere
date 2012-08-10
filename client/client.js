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

  Handlebars.registerHelper('timeAgo', function() {
    var time = _.isArray(this.updatedAt) ? _.last(this.updatedAt) : this.updatedAt;
    return moment(time).fromNow();
  });

  Handlebars.registerHelper('trunc', function(str) {
    // TODO make better
    if (str.length <= 60)
      return str;
    return str.substr(0, 60) + '...';
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
  }

})();
