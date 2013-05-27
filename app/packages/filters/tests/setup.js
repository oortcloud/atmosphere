// Setup stuff we need for tests

var testMethod = function(funk) {
  return funk + 'Funk';
};

Meteor.methods({
  testMethod: testMethod,
  testMethodCallsNext: testMethod,
  testMethodReturnsNext: testMethod,
  testMethodReturnsArguments: testMethod,
  testMethodMultiFilters: testMethod,
  testMultiFiltersSeperateDeclarations: testMethod,
  testMethodMultiFilterContext: testMethod,
  testMethodReturnsNothing: testMethod,
  testMethodReturnsFalse: testMethod,
  testMethodReturnsJSArguments: testMethod,
  echoArgument: function(funk) {
    return funk;
  }
});

var testFilter = function(funk) {
  return funk + 'Fuff';
};

var testFilterCallsNext = function(funk, next) {
  next(funk + 'Buff');
};

var testFilterReturnsNext = function(funk, next) {
  return next(funk + 'Puff');
};

var testFilterReturnsArguments = function(funk, next) {
  return funk + 'Duff';
};

var testFilterForMethodDefinedInFuture = function(funk, next) {
  return funk + 'Delorian';
};

var testFilterMultiFilters1 = function(funk, next) {
  return funk + '1';
};
var testFilterMultiFilters2 = function(funk, next) {
  return funk + '2';
};
var testFilterMultiFilters3 = function(funk, next) {
  return funk + '3';
};

var testFilterMultiFiltersSeperateDeclarations1 = function(funk, next) {
  return funk + '1';
};
var testFilterMultiFiltersSeperateDeclarations2 = function(funk, next) {
  return funk + '2';
};

var testFilterMultiFilterContext1 = function(funk, next) {
  this.testAttribute = 'Munk';
  return funk;
};
var testFilterMultiFilterContext2 = function(funk, next) {
  this.testAttribute = this.testAttribute + 'Punk';
  return funk;
};
var testFilterMultiFilterContext3 = function(funk, next) {
  this.testAttribute = this.testAttribute + 'Pump';
  return funk + this.testAttribute;
};

var testFilterReturnsNothing = function(funk) {};

var testFilterReturnsFalse = function(funk) {
  return false;
};

var testFilterReturnsJSArguments = function(funk) {
  return arguments;
};

Filter.methods([
  testFilter, { only: 'testMethod' },
  testFilterCallsNext, { only: 'testMethodCallsNext' },
  testFilterReturnsNext, { only: 'testMethodReturnsNext' },
  testFilterReturnsArguments, { only: 'testMethodReturnsArguments' },
  testFilterMultiFilters1, { only: 'testMethodMultiFilters' },
  testFilterMultiFilters2, { only: 'testMethodMultiFilters' },
  testFilterMultiFilters3, { only: 'testMethodMultiFilters' },
  testFilterMultiFiltersSeperateDeclarations1, { only: 'testMultiFiltersSeperateDeclarations' },
  testFilterMultiFilterContext1, { only: 'testMethodMultiFilterContext' },
  testFilterMultiFilterContext2, { only: 'testMethodMultiFilterContext' },
  testFilterMultiFilterContext3, { only: 'testMethodMultiFilterContext' },
  testFilterForMethodDefinedInFuture, { only: 'testMethodDefinedInFuture' },
  testFilterReturnsNothing, { only: 'testMethodReturnsNothing' },
  testFilterReturnsFalse, { only: 'testMethodReturnsFalse' },
  testFilterReturnsJSArguments, { only: 'testMethodReturnsJSArguments' }
]);

Filter.methods([
  testFilterMultiFiltersSeperateDeclarations2, { only: 'testMultiFiltersSeperateDeclarations' }
]);

Meteor.methods({
  testMethodDefinedInFuture: testMethod
});
