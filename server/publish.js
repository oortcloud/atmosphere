
Meteor.publish('packages', function(options) {
  return Packages.find({
    visible: {
      $ne: false
    }
  }, {
    sort: {
      updatedAt: -1
    }
  });
});

Meteor.publish('allPackages', function(options) {
  return Packages.find({}, {
    sort: {
      updatedAt: -1
    }
  });
});
