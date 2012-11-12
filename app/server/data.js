Packages = new Meteor.Collection('packages');
Packages.allow({});

Logs = new Meteor.Collection('logs');
Logs.allow({});

Meteor.publish('logs', function() {
  if (Groups.isUserInGroup(this.userId, 'logsView'))
    return Logs.find({}, {limit: 300});
});
