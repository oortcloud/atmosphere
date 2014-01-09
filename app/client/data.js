
// Packages

Packages = new Meteor.Collection('packages');
PackageInstalls = new Meteor.Collection("install_count");

Session.set('packages.loading', true);

Meteor.subscribe('packageMetadata', function() {
  Session.set('packages.loading', false);
});

Deps.autorun(function() {
  Session.set('package.ready', false);
  Session.set('package.installcount', false);

  Meteor.subscribe('package', Session.get('currentPackage'), function() {
    Session.set('package.ready', true);
  });
  Meteor.subscribe("installsForPackage", Session.get('currentPackage'), function() {
	Session.set('package.installcount', true);
  });
})

// Logs

Logs = new Meteor.Collection('logs');

// Meteor.subscribe('logs');