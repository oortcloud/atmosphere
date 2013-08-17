
// Packages

Packages = new Meteor.Collection('packages');

Session.set('packages.loading', true);

Meteor.subscribe('packageMetadata', function() {
  Session.set('packages.loading', false);
});

Deps.autorun(function() {
  Session.set('package.ready', false);
  Meteor.subscribe('package', Session.get('currentPackage'), function() {
    Session.set('package.ready', true);
  });
})

// Logs

Logs = new Meteor.Collection('logs');

// Meteor.subscribe('logs');
