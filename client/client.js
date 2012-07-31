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

  Handlebars.registerHelper('timeAgo', function() {
    var time = _.isArray(this.updatedAt) ? _.last(this.updatedAt) : this.updatedAt;
    return moment(time).fromNow();
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
    return Packages.find();
  };

  Template.packages.packagesLoading = function() {
    return Session.get('packages.loading');
  };

  Template.packages.dump = function() {
    var dump = _.clone(this);
    delete dump._id;
    delete dump.userId
    return '<div style="width:500px;">' + JSON.stringify(dump, null, 4) + '</div>';
  };

})();
