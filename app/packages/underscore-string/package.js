Package.describe({
  summary: "underscore.string repackaged for Meteor"
});

Package.on_use(function (api, where) {
  where = where || ['client', 'server'];

  api.add_files('lib/underscore.string/lib/underscore.string.js', where);
  api.add_files('common.js', where);
});
