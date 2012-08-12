Packages = new Meteor.Collection('packages');

Session.set('packages.loading', true);

Meteor.subscribe('packages', function() {
  Session.set('packages.loading', false);
});
