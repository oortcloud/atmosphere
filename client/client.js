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

  Packages = new Meteor.Collection('packages');

  Session.set('packages.loading', true);

  var preparePopups = function() {
    $('td i.icon-eye-open').popover({
      title: 'Smart Package Info',
      placement: 'bottom',
      content: function() {
        return $(this).data('info');
      }
    });
  };

  Meteor.subscribe('packages', function() {
    Session.set('packages.loading', false);
  });

  Template.packages.events = {
    'click td.icon-cell': function(e) {
      e.preventDefault();
    } 
  };

  Template.packages.packages = function() {
    Meteor.defer(preparePopups);
    return Packages.find();
  };

  Template.packages.packagesLoading = function() {
    return Session.get('packages.loading');
  };

})();
