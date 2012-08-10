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

  Meteor.setInterval(function() {
    $.each($('.timeAgo'), function() {
      var $el = $(this);
      var updatedAt = $el.data('stamp');
      $el.text(timeAgo(new Date(updatedAt)));
    });
  }, 15 * 1000);

})();
