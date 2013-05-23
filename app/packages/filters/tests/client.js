// Client side tests

var addFunkFilter = function(funk, next) {
  this.next("funkyFunkyFunk" + funk);
};

Filter.methods([
  { callHandler: addFunkFilter, only: 'testMethod' }
]);

testAsyncMulti("filters - client filters", [

  // Should apply client and server side filters
  function(test, expect) {
    var ensureValueIsFiltered = expect(function(err, result) {
      test.equal(result, 'funkyFunkyFunkIsTheRealFuffFunk');
    });
    Meteor.call('testMethod', 'IsTheReal', ensureValueIsFiltered);
  },

  // Make sure you it can be called without a callback
  function(test, expect) {
    var result = Meteor.call('testMethod', 'IsTheReal');
    test.isUndefined(result);
  },
  
  // Make sure it doesn't get wrapped because it's not on the `only` list
  function(test, expect) {
    Meteor.call('echoArgument', 'NoWrap!', expect(function(err, result) {
      test.equal(result, 'NoWrap!');
    }));
  }
]);
