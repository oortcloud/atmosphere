Packages = new Meteor.Collection('packages');
Packages.allow({});

Logs = new Meteor.Collection('logs');
Logs.allow({});

Installs = new Meteor.Collection("installs");
Installs.allow({});


// I think this is causing a memory leak.
//
// Disabling while we investigate

// Meteor.publish("installsForPackage", function(packageName) {
//   if(!packageName) return [];
// 
//   var self = this,
//     packageInstalls_7day = 0,  //Excludes today
//     packageInstalls_Today = 0,
//     date = new Date(),
//     time_7_days_ago = new Date().getTime() - (1000 * 3600 * 24 * 7),
//     time_1_day_ago  = new Date().getTime() - (1000 * 3600 * 24 * 1),
//     initializing = true;
// 
//   packageInstalls_7day = Installs.find({
//                       name: packageName,
//                       when : { 
//                         $gte : time_7_days_ago,
//                         $lt  : time_1_day_ago
//                       }
//                     }).count();
// 
//   var handle = Installs.find({ name: packageName, when : { $gte : time_1_day_ago }}).observeChanges({
//     added: function (id, fields) {
//       packageInstalls_Today++;
// 
//       if(!initializing) self.changed('install_count', packageName, { today: packageInstalls_Today });
//     }
//   });
// 
//   initializing = false;
// 
//   self.added('install_count', packageName, { today: packageInstalls_Today, week: packageInstalls_7day });
// 
//   self.onStop(function () {
//     handle.stop();
//   });
// 
//   self.ready();
// });

FastRender.route('/', function(params) {
    //assumes 'blogPost' is the publication which sends
    //the given blog post
    this.subscribe('packageMetadata');
});

//Ignores the tail setup process when running locally
// Tail.ignore(true);