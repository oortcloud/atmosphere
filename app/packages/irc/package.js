Package.describe({
  summary: "Npm 'irc' wrapper"
});

Npm.depends({
	irc: '0.3.6'
});

Package.on_use(function (api) {
  api.add_files('server.js', 'server');
  api.export("irc");
});
