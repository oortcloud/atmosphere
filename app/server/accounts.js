Meteor.methods({
  updateAccountWithMeteorDeveloper: function(token) {
    var result = MeteorDeveloperAccounts.retrieveCredential(token);
  
    console.log('updateAccountWithMeteorDeveloper, token:' + token
      + ' result:' + EJSON.stringify(result));

    if (result && result.serviceData) {
      // Remove the id so multiple accounts can connect the same md account
      delete result.serviceData['id'];

      Meteor.users.update(Meteor.userId(), 
        { '$set': { 'services.meteor-developer': result.serviceData } });

      return true;
    }

    return false;
  }
});

