# Node Modules for Meteor

*Node module hacks encapsulated*

There's not really a whole lot going on here. We needed a way to encapsulate Meteor's current node module hacks so we can depend on common packages without being bound to a common strategy.

## Usage

### Deploying to meteor.com

The only way to bundle a node module at this point is to include it in the `public/`. Yes this is a terrible hack and all the files in your node modules will be *reachable* along with your apps legitimate assets. If you don't mind all of this you don't have to do anything but install the `node-modules` and load modules like this:

    var awssum = NodeModules.require('awssum');

### Deploying elsewhere

If you're not deploying to meteor.com you might have the ability to place your node modules wherever you choose. If the module is available to nodejs's `require()` you don't have to do anything special. Require your modules just like the example above.

You can also tell `node-modules` where your packages are located using `NodeModules.setPath()`:

    NodeModules.setPath('/absolute/or/relative/path/to/node_modules');
    var awssum = NodeModules.require('awssum');
