Package.describe({
  summary: "Login filter for atmosphere"
});

Package.on_use(function (api) {
  api.add_files('common.js', ['server', 'client']);
});
