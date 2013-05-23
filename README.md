# Atmosphere Smart Package Database

[Atmosphere](https://atmosphere.meteor.com) is a database of smart packages for [Meteor](http://meteor.com), the node.js framework.

To learn about smart packages and how to use them for your Meteor project, please checkout [Meteorite](http://oortcloud.github.com/meteorite), the smart packager for Meteor.

This branch has several differences:

- Its up to date with Meteor 0.6.3.1 (and hence uses websockets)
- It doesn't require meteorite to deploy/run
- The packages have been migrated to `/packages`

The reason for this is several dependencies with the master branch repo are outdated and don't work with 0.6.0+

Packages need to be kept up to date while the next engine compatible version of meteorite is complete
