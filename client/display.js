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
      var currentPageTop = Router.current_page().split('/')[0];
      if (pathTop === currentPageTop)
        isActive = true;
    }
    
    // Is it a perfect match
    var currentPage = Router.current_page();
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

  Handlebars.registerHelper('trunc', function(str) {
    // TODO make better
    if (str.length <= 60)
      return str;
    return str.substr(0, 60) + '...';
  });

  Template.packages.events = {
    'click td.icon-cell': function(e) {
      e.preventDefault();
    } 
  };

  Template.packages.packages = function() {
    return Packages.find({}, {sort: {'updatedAt': -1}});
  };

  // TEMP
  Template.dump.packages = function() {
    return Packages.find({}, {sort: {'updatedAt': -1}});
  };

  // TEMP
  Template.dump.dump = function() {
    console.log(this);
    return JSON.stringify(this, null, 2);
  };

  Template.packages.packagesLoading = function() {
    return Session.get('packages.loading');
  };

  Template.package.nonStandardMeteor = function() {
    
    // NOTE: this strictly speaking isn't true, but why would you specify a 
    // meteor version if it wasn't standard in a package
    return this.meteor;
  };

  Template.content.events = {
    'click .nav a': function(e) {
      e.preventDefault();
      var path = $(e.target).attr('href') || '';
      Router.navigate(path, { trigger: true });
    }
  };
  
  Meteor.setInterval(function() {
    $.each($('.timeAgo'), function() {
      var $el = $(this);
      var updatedAt = $el.data('stamp');
      $el.text(timeAgo(new Date(updatedAt)));
    });
  }, 15 * 1000);

})();