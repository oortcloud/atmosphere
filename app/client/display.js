(function() {

  // TODO in more than one project
  Handlebars.registerHelper('ifAny', function(data, options) {
    if (!data || (_.isArray(data) && !data.length) || (_.isFunction(data.fetch) && !data.count()))
      return options.inverse(this);
    else
      return options.fn(this);
  });

  // Time ago helpers

  var timeAgo = function(updatedAt) {
    return moment(updatedAt).fromNow();
  };

  Handlebars.registerHelper('timeAgo', function() {
    return timeAgo(this.updatedAt);
  });

  // Navigation helpers

  var isNavActive = function(page, matchTop) {
    var isActive = false;

    // If desired check that the top level matches
    if (matchTop) {
      var pathTop = page.split('/')[0];
      var currentPageTop = Meteor.Router.page().split('/')[0];
      if (pathTop === currentPageTop || _.contains(pathTop.split('|'), currentPageTop))
        isActive = true;
    }
    
    // Is it a perfect match
    var currentPage = Meteor.Router.page();
    if (currentPage === page)
      isActive = true;
    
    return isActive;
  };

  Handlebars.registerHelper('isActive', function(page) {
    return isNavActive(page, false) ? 'active' : '';
  });

  Handlebars.registerHelper('isActiveTop', function(page) {
    return isNavActive(page, true) ? 'active' : '';
  });

  // Display helpers

  Handlebars.registerHelper('trunc', function(str, length, options) {
    // TODO make better
    if (str.length <= length)
      return str;
    return str.substr(0, length) + '…';
  });
  
  // redraw a template every X seconds
  Handlebars.registerHelper('refreshEvery', function(seconds) {
    if (!Deps.active)
      return
    
    var computation = Deps.currentComputation
    Meteor.setTimeout(function() { 
      computation.invalidate();
    }, parseInt(seconds) * 1000);
  });
  
  Template.packages.packages = function() {
    return Packages.find({}, {sort: {'updatedAt': -1}});
  };

  // TEMP
  Template.dump.packages = function() {
    return Packages.find({}, {sort: {'updatedAt': -1}});
  };

  // TEMP
  Template.dump.dump = function() {
    return JSON.stringify(this, null, 2);
  };

  Template.logs.logs = function() {
    return Logs.find({});
  };

  Template.packages.packagesLoading = function() {
    return Session.get('packages.loading');
  };
  
  Template.package.package = function() {
    return Packages.findOne({name: Session.get('currentPackage')});
  };

  Template.package.dependencies = function() {
    var latest = _.last(this.versions);
    if (latest.packages)
      return _.keys(latest.packages).join(', ');
  };

  Template.package.nonStandardMeteor = function() {
    
    // NOTE: this strictly speaking isn't true, but why would you specify a 
    // meteor version if it wasn't standard in a package
    return this.meteor;
  };

  Template.header.events = {
    'click .page-header a': function(e) {
      if (e.shiftKey || e.ctrlKey || e.metaKey) return true;
      
      e.preventDefault();
      Meteor.Router.to('/');
    }
  };

  Template.content.events = {
    'click a.nav-link': function(e) {
      if (e.shiftKey || e.ctrlKey || e.metaKey) return true;
      
      e.preventDefault();
      var path = $(e.target).attr('href') || '';
      Meteor.Router.to(path);
    }
  };
  
})();
