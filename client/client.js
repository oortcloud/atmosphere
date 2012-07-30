(function() {

  new ForkMe({
    user: 'possibilities',
    repo: 'atmosphere',
    ribbon: {
      position: 'left',
      color: 'red'
    }
  });

  Handlebars.registerHelper('ifAny', function(data, options) {
    if (!data || (_.isArray(data) && !data.length) || (_.isFunction(data.fetch) && !data.count()))
      return options.inverse(this);
    else
      return options.fn(this);
  });

  Handlebars.registerHelper('timeAgo', function(time) {
    return moment(time).fromNow();
  });

  Packages = new Meteor.Collection('packages');

  Session.set('packages.loading', true);
  Meteor.subscribe('packages', function() {
    Session.set('packages.loading', false);
  });

  Template.packages.packages = function() {
    return Packages.find();
  };

  Template.packages.packagesLoading = function() {
    return Session.get('packages.loading');
  };

})();
