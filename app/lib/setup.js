Meteor.accounts.config({
  requireUsername: true,
  requireEmail: false
});

Groups = new MeteorGroups();

if (Meteor.is_server) {

  var user = Meteor.users.findOne({username: 'possibilities'});

  Groups.groups.remove({});
  Groups.groupsToUsers.remove({});

  Groups.removeUserFromGroup(user, 'groupInsert');
  Groups.removeUserFromGroup(user, 'groupUpdate');
  Groups.removeUserFromGroup(user, 'groupRemove');
  Groups.removeUserFromGroup(user, 'groupView');
  Groups.removeUserFromGroup(user, 'logsView');

  Groups.findOrCreateGroup('groupInsert');
  Groups.findOrCreateGroup('groupUpdate');
  Groups.findOrCreateGroup('groupRemove');
  Groups.findOrCreateGroup('groupView');
  Groups.findOrCreateGroup('logsView');
  
  Groups.addUserToGroup(user, 'groupInsert');
  Groups.addUserToGroup(user, 'groupUpdate');
  Groups.addUserToGroup(user, 'groupRemove');
  Groups.addUserToGroup(user, 'groupView');
  Groups.addUserToGroup(user, 'logsView');

}
