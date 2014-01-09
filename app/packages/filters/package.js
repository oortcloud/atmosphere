Package.describe({
  summary: "Middleware filters for Meteor.methods and friends"
});

Package.on_use(function (api) {
  api.use('livedata', 'server');
  api.use('underscore', ['server', 'client']);

  api.add_files('utils.js', ['server', 'client']);
  api.add_files('common.js', ['server', 'client']);
  api.export("Filter");
});

Package.on_test(function (api) {
  api.use('test-helpers', ['client', 'server']);
  
  api.add_files('tests/common.js', ['server', 'client']);
  api.add_files('tests/setup.js', 'server');
  api.add_files('tests/server.js', 'server');
  api.add_files('tests/client.js', 'client');
});
