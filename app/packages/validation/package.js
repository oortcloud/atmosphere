Package.describe({
  summary: "A smart package for validation"
});

Package.on_use(function (api, where) {
  where || (where = ['client', 'server']);
  // Deps
  api.use('underscore', where);
  api.use('underscore-string', where);

  // Core
  api.add_files('validation.js', where);
  api.add_files('validators.js', where);
});
