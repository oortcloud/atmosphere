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
