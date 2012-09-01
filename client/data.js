Packages = new Meteor.Collection('packages');
Logs = new Meteor.Collection('logs');

Session.set('packages.loading', true);

Meteor.subscribe('packages', function() {
  Session.set('packages.loading', false);
});

Meteor.subscribe('logs');
