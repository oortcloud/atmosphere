Session.setDefault('search_keywords', '');
// Packages

Packages = new Meteor.Collection('packages');
PackageInstalls = new Meteor.Collection("install_count");


Deps.autorun(function() {
  Session.set('packages.loading', true);
  Meteor.subscribe('packageMetadata', Session.get('search_keywords'), function() {
    Session.set('packages.loading', false);
  });

  Session.set('package.ready', false);
  Session.set('package.installcount', false);

  Meteor.subscribe('package', Session.get('currentPackage'), function() {
    Session.set('package.ready', true);
  });
  // Meteor.subscribe("installsForPackage", Session.get('currentPackage'), function() {
  //   Session.set('package.installcount', true);
  // });
})

// Logs

Logs = new Meteor.Collection('logs');

// Meteor.subscribe('logs');