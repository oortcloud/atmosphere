Packages = new Meteor.Collection('packages');
Packages.allow({});

Logs = new Meteor.Collection('logs');
Logs.allow({});

var userIsAdmin = function(userId) {
  return Groups.isUserInGroupName(userId, 'admin');
};

Meteor.publish('logs', function() {
  if (userIsAdmin(this.userId()))
    return Logs.find();
});
