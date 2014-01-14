Package.describe({
  summary: "The semantic versioner for npm"
});

Package.on_use(function (api, where) {
  Npm.depends({semver: '2.2.1'})
  api.add_files('semver.js', ['server']);
  api.export('Semver', ['server']);
});