Package.describe({
  summary: "Tiny ~1200 byte Express-inspired client-side router"
});

Package.on_use(function (api, where) {
  api.add_files('page-js/index.js', 'client');
});