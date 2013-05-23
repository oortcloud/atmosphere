Package.describe({
  summary: "A smart package for showing those fucking github ribbons"
});

Package.on_use(function (api) {
  api.use('jquery', 'client');

  api.add_files('client.js', 'client');
  api.add_files('styles.css', 'client');
});
