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
    
    var pkgRecord = Packages.findOne({ name: pkgInfo.name });

    if (pkgRecord) {
      
      if (pkgRecord.userId !== this.userId())
        throw new Meteor.Error(401, "That ain't yr package son!")
      
      pkgInfo.updatedAt = new Date();

      if (pkgRecord.latest === pkgInfo.version) {
        // Update
        var lastIndex = pkgRecord.versions - 1;
        pkgRecord.versions[lastIndex] = {
          version: pkgInfo.version,
          packages: pkgInfo.packages
        };
      } else {
        // Add new version
        pkgRecord.versions.push({
          version: pkgInfo.version,
          packages: pkgInfo.packages
        });
        pkgRecord.latest = pkgInfo.version;
      }

      delete pkgInfo.packages;
      delete pkgInfo.version;

      Packages.update(pkgRecord._id, {
        $set: pkgInfo
      });
    } else {

      pkgRecord = pkgInfo;

      pkgRecord.userId = this.userId();
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