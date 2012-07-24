DeployConfig.get('googleSecret', function(secret) {
  Meteor.accounts.google.setSecret(secret);
});

DeployConfig.get('facebookSecret', function(secret) {
  Meteor.accounts.facebook.setSecret(secret);
});
