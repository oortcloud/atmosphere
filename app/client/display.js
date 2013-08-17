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

  Handlebars.registerHelper('humanizeUpdatedAt', function() {
    return new Date(this.updatedAt);
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

  Handlebars.registerHelper('isPage', function(page) {
    return (page==Meteor.Router.page()) ? true : false;
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
    keywords = new RegExp(Session.get("search_keywords"), "i");
    return Packages.find({$or:[{name:keywords},{description:keywords}]}, {sort: {'updatedAt': -1}});
  };
  
  Template.package.ready = function() {
    console.log(Session.get('package.ready'));
    return Session.get('package.ready');
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
  
  Template.package.created = function() {
    var name = Session.get("currentPackage");
    if(Session.equals("readme_"+name, undefined)) {
      Meteor.call("getReadMe",name,function(err,result) {
        Session.set("readme_"+name,result);
      });
    }
  }
  
  Template.package.readme = function() {
    return Session.get("readme_"+Session.get('currentPackage'));
  }

  Template.package.github_data = function() {
    var github_data = /\/\/github\.com\/([\w-_\.]+)\/([\w-_\.]+)\.git/i.exec(Template.package.package().git);
      
      if(github_data) {
        return {
          "repo_owner": github_data[1],
          "repo_name": github_data[2]
        };
      } else return false;
  }
  
  Template.package.github_hitlimit = function() {
    return Session.equals("readme_"+Session.get('currentPackage'), 0);
  }
  
  Template.package.loadingreadme = function() {
    return Session.equals("readme_"+Session.get('currentPackage'),undefined);
  }

  Template.package.dependencies = function() {
    var latest = _.last(this.versions);
    if (latest.packages)
      return _.keys(latest.packages);
  };

  Template.package.nonStandardMeteor = function() {
    
    // NOTE: this strictly speaking isn't true, but why would you specify a 
    // meteor version if it wasn't standard in a package
    return this.meteor;
  };

  Template.header.events = {
    'click .page-header a': function(e) {
      if (e.shiftKey || e.ctrlKey || e.metaKey || e.which == 2) return true;
      
      e.preventDefault();
      Meteor.Router.to('/');
    }
  };

  Template.content.events = {
    'click a.nav-link': function(e) {
      if (e.shiftKey || e.ctrlKey || e.metaKey || e.which == 2) return true;
      
      e.preventDefault();
      var path = $(e.target).attr('href') || '';
      Meteor.Router.to(path);
    },
    'keyup [name=search]':function(e,context) {
      Meteor.Router.to('/');
      Session.set("search_keywords", e.currentTarget.value.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&"));
    }
  };
  
  Template.content.search_keywords = function(){
    return Session.get("search_keywords");
  }
  
})();
