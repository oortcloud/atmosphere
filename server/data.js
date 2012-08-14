Packages = new Meteor.Collection('packages');
Packages.allow({});

Meteor.startup(function() {
	Packages.update({}, {$set: {updatedAt: new Date()}});	
});
