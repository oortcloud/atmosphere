if (Meteor.is_client) {
  Accounts.ui.config({
    passwordSignupFields: 'USERNAME_ONLY'
  });
}