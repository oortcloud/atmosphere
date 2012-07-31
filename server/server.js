Packages = new Meteor.Collection('packages');
Packages.allow({});

Meteor.publish('packages', function() {
  return Packages.find();
});

Meteor.methods({
  publish: function(pkgInfo) {

    var allowedFields = [
      'name',
      'description',
      'homepage',
      'author',
      'version',
      'git',
      'packages'
    ];

    var requiredFields = [
      'name',
      'description',
      'homepage',
      'author',
      'version',
      'git',
    ];

    // Let's see if we have a record for the package
    var pkgRecord = Packages.findOne({ name: pkgInfo.name });

    // Ok we have one
    if (pkgRecord) {
      
      if (pkgRecord.userId !== this.userId())
        throw new Meteor.Error(401, "That ain't yr package son!")
      
      pkgRecord.updatedAt.push(new Date());
      
      if (pkgRecord.latest === pkgInfo.version) {
        // Update
        var lastIndex = pkgRecord.versions.length - 1;
        pkgRecord.versions[lastIndex].version = pkgInfo.version;
        if (pkgInfo.packages)
          pkgRecord.versions[lastIndex].packages = pkgInfo.packages;
        pkgRecord.versions[lastIndex].updatedAt.push(new Date());
      
      } else {
        // Add new version
        pkgRecord.versions.push({
          version: pkgInfo.version,
          createdAt: new Date(),
          updatedAt: [new Date()]
        });
        if (pkgInfo.packages)
          pkgRecord.packages = pkgInfo.packages;
        pkgRecord.latest = pkgInfo.version;
      }
      
      var id = pkgRecord._id;
      delete pkgRecord._id;

      Packages.update(id, {
        $set: pkgRecord
      });
    } else {

      pkgInfo.userId = this.userId();
      pkgInfo.latest = pkgInfo.version;
      pkgInfo.createdAt = new Date();
      pkgInfo.updatedAt = [new Date()];

      var version = {
        version: pkgInfo.version,
        packages: pkgInfo.packages,
        createdAt: new Date(),
        updatedAt: [new Date()]
      };
      
      pkgInfo.versions = [];
      pkgInfo.versions.push(version);
      
      delete pkgInfo.packages;
      delete pkgInfo.version;
      
      Packages.insert(pkgInfo);
    }
  }
});
