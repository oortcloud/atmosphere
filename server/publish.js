Meteor.publish('packages', function() {
  return Packages.find({
    visible: { $ne: false }
  }, {
    sort: {
      updatedAt: -1
    }
  });
});

Meteor.publish('allPackages', function() {
  return Packages.find({}, {
    sort: {
      updatedAt: -1
    }
  });
});
