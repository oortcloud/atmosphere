Meteor.publish('packages', function() {

  Logs.insert({
    name: 'publish.packages',
    userId: this.userId()
  });

  return Packages.find({
    visible: { $ne: false }
  }, {
    sort: {
      updatedAt: -1
    }
  });
});

Meteor.publish('allPackages', function() {

  Logs.insert({
    name: 'publish.allPackages',
    userId: this.userId()
  });

  return Packages.find({}, {
    sort: {
      updatedAt: -1
    }
  });
});
