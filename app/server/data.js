Packages = new Meteor.Collection('packages');
Packages.allow({
  insert: function() { return true; },
  update: function() { return true; },
  remove: function() { return true; }
});

Logs = new Meteor.Collection('logs');
Logs.allow({
  insert: function() { return true; },
  update: function() { return true; },
  remove: function() { return true; }
});

Meteor.publish('logs', function() {
  if (Meteor.users.find({_id: this.userId, groups: 'logsView'}))
    return Logs.find({}, {limit: 300});
});
