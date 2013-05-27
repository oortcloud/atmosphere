var require = Npm.require;
var path = require("path");
var fs = require("fs");

NodeModules = {
  _path: null,

  require: function(moduleName) {
    var module;
    
    // check specified spot
    if (NodeModules._path)
      try {
        module = require(path.join(NodeModules._path, moduleName));
      } catch (e) {}

    // try no path
    if (!module)
      try {
        module = require(moduleName)
      } catch (e) {}

    var basePath = path.resolve('.');
    if (basePath === '/')
      basePath = path.dirname(global.require.main.filename);

    if (!module) {
      var bundlePath = path.join(basePath, 'bundle');

      if (fs.existsSync(bundlePath))
        basePath = path.join(bundlePath);

      var publicPath = path.join(basePath, 'public/node_modules');

      if (fs.existsSync(publicPath))
        basePath = publicPath;
      else
        basePath = path.join(basePath, 'static/node_modules');
    
      var modulePath = path.join(basePath, moduleName);

      if (fs.existsSync(basePath)) {

        // try public
        if (fs.existsSync(modulePath))
          try {
            module = require(modulePath);
          } catch (e) {}
      }
    }
    
    return module;
  },

  setPath: function(basePath) {
    if (basePath.indexOf('~') >= -1)
      basePath.replace('~', process.env.HOME);

    if (basePath[0] === '/')
      NodeModules._path = basePath;
    else
      NodeModules._path = path.join(resolvedPath, basePath);
  }
};
