Packages = new Meteor.Collection('packages');
Logs = new Meteor.Collection('logs');

Meteor.startup(function() {
  Session.set('packages.loading', true);

  Meteor.subscribe('packages', function() {
    Session.set('packages.loading', false);
  });
});


Meteor.subscribe('logs');
