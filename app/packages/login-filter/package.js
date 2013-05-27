Package.describe({
  summary: "Login filter for atmosphere"
});

Package.on_use(function (api) {
  api.use('filters', ['client','server']);
  api.add_files('common.js', ['server', 'client']);
});
