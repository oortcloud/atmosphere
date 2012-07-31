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
      'git'
    ];

    var cleanupPackage = function(obj) {
      return _.reduce(allowedFields, function(newObj, key) {
        if (obj[key])
          newObj[key] = obj[key];
        return newObj;
      }, {});
    };

    var prepareForUpdate = function(obj) {
      delete obj._id;
      return obj;
    };

    var requireFields = function(obj) {
      _.each(requiredFields, function(reqField) {
        if (!obj[reqField])
          throw new Meteor.Error(500, reqField + " is a required smart.json field!");
      });
    };

    // Validate
    // TODO do a lot more
    requireFields(pkgInfo);
    
    // Get rid of keys we don't want
    pkgInfo = cleanupPackage(pkgInfo);

    // Let's see if we have a record for the package
    var pkgRecord = Packages.findOne({ name: pkgInfo.name });

    // Ok we have one
    if (pkgRecord) {

      // Only the owner can update it
      if (pkgRecord.userId !== this.userId())
        throw new Meteor.Error(401, "That ain't yr package son!")
      
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

        // Assign packages
        if (pkgInfo.packages)
          pkgRecord.packages = pkgInfo.packages;

        pkgRecord.latest = pkgInfo.version;
      }

      // Timestamp it
      pkgRecord.updatedAt.push(new Date());
      
      // Get the update ID before
      var id = pkgRecord._id;

      // Do the update
      Packages.update(id, {
        $set: prepareForUpdate(pkgRecord)
      });
    } else {

      // Prepare new package record
      pkgInfo.userId = this.userId();
      pkgInfo.latest = pkgInfo.version;
      pkgInfo.createdAt = new Date();
      pkgInfo.updatedAt = [new Date()];

      // Setup first version
      pkgInfo.versions = [{
        version: pkgInfo.version,
        createdAt: new Date(),
        updatedAt: [new Date()]
      }];
      
      // Assign packages
      if (pkgInfo.packages)
        version.packages = pkgInfo.packages;
      
      Packages.insert(pkgInfo);
    }
  }
});
