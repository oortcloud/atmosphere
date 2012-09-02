Meteor.accounts.config({
  requireUsername: true,
  requireEmail: false
});

Groups = new MeteorGroups({
  adminGroup: 'admin'
});

// TEMP
// if (Meteor.is_server) {
//   Groups.findOrCreateGroup('admin');
//   var user = Meteor.users.findOne({username: 'possibilities'});
//   Groups.addUserToGroupName(user, 'admin');
// }
