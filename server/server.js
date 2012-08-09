Packages = new Meteor.Collection('packages');
Packages.allow({});

Meteor.publish('packages', function(options) {
  options || (options = {});
  options.includeHidden = _.isUndefined(options.includeHidden) ? false : options.includeHidden;
  var query = {};
  if (!options.includeHidden)
    query.visible = {$ne: false};
  return Packages.find(query, {
    sort: {
      updatedAt: -1
    }
  });
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
      'packages',
      'visible',
      'meteor'
    ];

    var requiredFields = [
      'name',
      'description',
      'homepage',
      'author',
      'version',
      'git'
    ];
    
    // these are the fields that get saved to each version
    var versionFields = [
      'git',
      'version',
      'meteor',
      'packages'
    ]
    
    var sliceObject = function(obj, fields) {
      return _.reduce(fields, function(newObj, key) {
        if (!_.isUndefined(obj[key]))
          newObj[key] = obj[key];
        return newObj;
      }, {});
    }
    
    var updatePackage = function(oldPkg, newPkg) {
      return _.each(allowedFields, function(key) {
        if (key !== 'packages')
          newPkg[key] = oldPkg[key];
      });
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
    pkgInfo = sliceObject(pkgInfo, allowedFields);

    // Setup defaults
    pkgInfo.visible = _.isUndefined(pkgInfo.visible) ? true : pkgInfo.visible;
    
    // prepare version
    var now = new Date;
    var versionRecord = sliceObject(pkgInfo, versionFields);
    versionFields.createdAt = now;
    
    // Let's see if we have a record for the package
    var pkgRecord = Packages.findOne({ name: pkgInfo.name });
    
    // TODO this whole thing is a mess
    // Ok we have one
    if (pkgRecord) {

      // Only the owner can update it
      if (pkgRecord.userId !== this.userId())
        throw new Meteor.Error(401, "That ain't yr package son!");

      if (pkgRecord.latest === pkgInfo.version)
        throw new Meteor.Error(500, "Version " + pkgInfo.version + " already exists!");

      // Add new version
      pkgRecord.versions.push(versionRecord);

      // Assign packages
      if (pkgInfo.packages)
        pkgRecord.packages = pkgInfo.packages;

      pkgRecord.latest = pkgInfo.version;

      // Timestamp it
      pkgRecord.updatedAt = new Date();

      updatePackage(pkgRecord, pkgInfo);
      
      // Get the update ID first
      var id = pkgRecord._id;

      // Do the update
      Packages.update(id, {
        $set: prepareForUpdate(pkgRecord)
      });
    } else {

      // Prepare new package record
      pkgInfo.userId = this.userId();
      pkgInfo.latest = pkgInfo.version;
      pkgInfo.createdAt = now;
      pkgInfo.updatedAt = now;
      
      pkgInfo.versions = [versionRecord];
      
      Packages.insert(pkgInfo);
    }
  }
});
