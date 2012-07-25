
new MeteorEnv({
  hosts: {
    production: ['atmosphere.meteor.com']
  }
});

var url, googleAppId, facebookAppId;

if (Meteor.env.is_development) {
  url = 'http://dev.atmosphere.meteor.com';
  googleAppId = '822601694185.apps.googleusercontent.com';
  facebookAppId = '396848297039113';
} else if (Meteor.env.is_production) {
  url = 'https://atmosphere.meteor.com';
  googleAppId = '822601694185-kscevmtfiip8f5ta9a6eupkmk24d3avm.apps.googleusercontent.com';
  facebookAppId = '286940654746222';
}

Meteor.accounts.google.config(googleAppId, url);
Meteor.accounts.facebook.config(facebookAppId, url);
