if (_.isUndefined(Meteor.settings))
  Meteor.settings = {}

_.defaults(Meteor.settings, {
  meteorDeveloper: {
    appId: 'od9XHcFkZWDoiGLdM',
    appSecret: 'sDjFiEAPYmDYxDmp5hJR8RAMJZwCdFqyiN'
  }
});

ServiceConfiguration.configurations.remove({service: 'meteor-developer'});
ServiceConfiguration.configurations.insert({
  service: "meteor-developer",
  clientId: Meteor.settings.meteorDeveloper.appId,
  secret: Meteor.settings.meteorDeveloper.appSecret
});

ServerInfo.settings = {
  path: '/info',
  user: 'atmosphere',
  password: 'possibilities',
  extras: undefined //a function or any other data to add
};