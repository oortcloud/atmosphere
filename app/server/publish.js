Meteor.publish('packageMetadata', function() {
  return Packages.find({
    visible: { $ne: false }, deleted: { $ne: true }
  }, {
    fields: {name: true, description: true, latest: true, updatedAt: true}
  });
});

Meteor.publish('package', function(name) {
  return Packages.find({
    name: name
  });
});

// for meteorite
Meteor.publish('packages', function(lastModified) {
  // Logs.insert({
  //   name: 'publish.packages',
  //   userId: this.userId,
  //   stamp: new Date()
  // });
  
  var query = {
    visible: {$ne: false}
  };
  
  if (lastModified)
    query.updatedAt = {$gt: +(lastModified)};

  return Packages.find(query, {
    sort: {updatedAt: -1}
  });
});

Meteor.publish('allPackages', function() {

  // Logs.insert({
  //   name: 'publish.allPackages',
  //   userId: this.userId,
  //   stamp: new Date()
  // });

  return Packages.find({}, {
    sort: {
      updatedAt: -1
    }
  });
});

Meteor.publish('installs', function(since) {
  console.log('publishing installs since', moment(since).format('lll'))
  return Installs.find({when: {$gt: +(since)}});
})

// auto publish current user services info
Meteor.publish(null, function() {
  return Meteor.users.find(this.userId, {fields: {'services.meteor-developer': true}});
});