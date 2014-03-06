Template.accounts.events({
  'click .add': function() {
    MeteorDeveloperAccounts.requestCredential(function(tokenOrError) {
      if(tokenOrError && tokenOrError instanceof Error) {
        console.log('Error during OAuth:' + tokenOrError);
      } else {
        console.log('Calling server method updateAccountWithGoogleService token:' + tokenOrError);
        Meteor.call('updateAccountWithMeteorDeveloper', tokenOrError);
      }
    });
  }
});

