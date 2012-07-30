DeployConfig.get('googleSecret', function(secret) {
  Meteor.accounts.google.setSecret(secret);
});

DeployConfig.get('facebookSecret', function(secret) {
  Meteor.accounts.facebook.setSecret(secret);
});

DeployConfig.get('twitterSecret', function(secret) {
  Meteor.accounts.twitter.setSecret(secret);
});

Packages = new Meteor.Collection('packages');
Packages.allow({});

Meteor.publish('packages', function() {
  return Packages.find();
});

Meteor.methods({
  publish: function(pkgInfo) {
    
    var pkg = Packages.findOne({ name: pkgInfo.name });

    if (pkg) {
      pkg.latest = pkgInfo.version;
      pkgInfo.updatedAt = new Date();

      pkg.versions.push({
        version: pkgInfo.version,
        packages: pkgInfo.packages
      });

      delete pkgInfo.packages;
      delete pkgInfo.version;

      Packages.update(pkg._id, {
        $set: pkgInfo
      });
    } else {
      pkg = pkgInfo;

      pkg.userId = this.userId();
      pkgInfo.latest = pkgInfo.version;
      pkgInfo.createdAt = pkgInfo.updatedAt = new Date();
      pkgInfo.versions = [{
        version: pkgInfo.version,
        packages: pkgInfo.packages
      }];
      
      delete pkgInfo.packages;
      delete pkgInfo.version;

      Packages.insert(pkgInfo);
    }
  }
});