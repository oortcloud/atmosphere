Filter = { _registry: {} };

// Prepare target `Meteor.methods` for filtering
Filter.prepareMethods = function(methods) {
  var self = this;

  // Wrap methods so we can hook into filters at run time
  _.each(methods, function(method, methodName) {
    methods[methodName] = self._wrapMethod(method, methodName);
  });
};

Filter.prepareCallMethods = function() {
  var self = this;

  // Wrap methods so we can hook into filters at run time
  _.each(['call', 'apply'], function(methodName) {
    Meteor[methodName] = self._wrapMethod(Meteor[methodName], methodName, true);
  });
};

// Apply the actual filters (at run time)
Filter.applyFilters = function(wrappedMethodName, calledMethodName, isCallHandler, args) {
  var callback;
  var self = this;
  var filters = Filter._registry[wrappedMethodName].filters;

  // If we're working on a callMethod remove the called method
  // name from the arguments list
  if (isCallHandler)
    args.shift()

  // A method for catching return value from filter
  self.next = function next() {
    self._returnValue = _.toArray(arguments);
    return self._returnValue;
  };

  // For call handler we need to mess with the arguments
  if (isCallHandler) {

    // Hold onto the callback for later
    callback = args.pop();

    // If it's not a function put it back
    if (!_.isFunction(callback))
      args.push(callback);

  }        

  // Put `next` convenience method at the end the filter's call arguments
  args.push(self.next);

  // Apply each filter
  _.each(filters, function(filter) {

    // For regular filters we've already figured out if the filter
    // is applicable to the method being called. For call handlers
    // we figure it out at runtime
    if (isCallHandler && !filter.appliesTo(calledMethodName))
      return;

    // Keep track of previous args in case filter returns nothing
    var beforeArgs = _.clone(args);


    if (isCallHandler && filter.callHandler) {
      args = filter.callHandler.apply(self, args);
    } else {
      args = filter.handler.apply(self, args);
    }

    // Get next args from
    //    1) next() ret value, or
    //    2) filter ret value, or
    //    3) pass on the orignal args
    if (self._returnValue)
      args = self._returnValue;
    else
      args = _.isBoolean(args) ? args : (args || beforeArgs);

    // Clear out the previous value
    delete self._returnValue;

    // Make sure we have an array and not a scalar
    if (_.isArguments(args))
      args = _.toArray(args);

    // Make sure we have an array and not a scalar
    if (!_.isArray(args))
      args = [args];
  });

  // Get rid of `next` convenience method if it's still hanging around
  if (_.last(args) === self.next)
    args.pop();

  // For call handlers we need to undo the work on args we did eariler
  if (isCallHandler) {

    // Put the callback back if there's one
    if (_.isFunction(callback))
      args.push(callback);

    // Get the method name back in front of the other arguments
    args.unshift(calledMethodName);
  }

  // Return the args and self to be used by the target method
  return {
    args: args,
    context: self
  };
};

// Every time we add more method filters we need to push them 
// into the _filters so we can get them later
Filter.methods = function(filters) {
  this._filters = this._filters || [];
  this._filters.unshift(this._parseConfiguration(filters));
  this._filters = _.flatten(this._filters);
};

// Load the method's filters, we run this only the first time
// the method gets executed
Filter.loadFilters = function(wrappedMethodName, calledMethodName, isCallHandler) {
  var self = this;

  // We haven't loaded this method's filters yet
  if (!self._registry[wrappedMethodName]) {

    // Default registry entry
    self._registry[wrappedMethodName] = self._registry[wrappedMethodName] || {
      filters: []
    };

    // Add each method filter for the method to the registry
    _.each(self._filters, function(filter, index) {
      
      // For regular methods we check of it applies, for call handlers
      // we have to wait until runtime
      if (isCallHandler || filter.appliesTo(wrappedMethodName))
        self._registry[wrappedMethodName].filters.unshift(filter);

    });
  }
};

// Makes an array from a scalar unless it's undefined
Filter._makeArrayOrUndefined = function(val) {
  var arrayVal = val;
  if (_.isDefined(arrayVal) && !_.isArray(arrayVal))
    arrayVal = [arrayVal];

  return arrayVal;
};

// Instrument the method so that it loads and applies filters to
// itself at runtime.
Filter._wrapMethod = function _wrapMethod(method, wrappedMethodName, isCallHandler) {
  var self = this;

  // return wrapped method
  return function() {
    var args = _.toArray(arguments);
    var calledMethodName = isCallHandler ? _.first(args) : wrappedMethodName;

    // Damn shame we have to do this here but I don't see any other
    // way to have tests not broken
    if (calledMethodName === 'tinytest/run')
      return method.apply(this, args);

    // If we haven't already, load the filters for this method
    self.loadFilters(wrappedMethodName, calledMethodName, isCallHandler);
    
    // Do the actual business of running each filter
    var ret = self.applyFilters.call(this, wrappedMethodName, calledMethodName, isCallHandler, args);
    
    // Run the original method with the filtered context and arguments
    return method.apply(ret.context, ret.args);
  };
};

// Munge filter setup info so we can do cool shorthand configuration tricks
Filter._parseConfiguration = function(filters) {
  var self = this;
  var handler, next;
  var normalized = [];
  filters = this._makeArrayOrUndefined(filters);

  while (filter = filters.shift()) {
    // Peek at the the next filter
    next = filters.shift();

    // Allow passing in a filter handler followed by a configuration literal
    if (_.isFunction(filter)
        && _.isDefined(next)
        && !_.isFunction(next)
        && _.isUndefined(next.filter)) {

      // Merge em'
      handler = filter;
      next.handler = handler;
      filter = next;

    // Otherwise just put it back
    } else {
      filters.unshift(next);
    }

    // Allow passing in a filter method without any configuration
    if (_.isFunction(filter))
      filter = { handler: filter };

    // Allow scalar values for `except` and `only` configuration
    filter.except = self._makeArrayOrUndefined(filter.except);
    filter.only = self._makeArrayOrUndefined(filter.only);

    // Extend it
    _.extend(filter, FilterHelpers);

    // Ok, it's ready
    normalized.unshift(filter);
  }

  return normalized;
};

// Helpers
FilterHelpers = {

  // Check if a filter aught to be applied to a method
  appliesTo: function(methodName) {

    // Notice we're negating the whole this
    return !(

      // It's not in the `only` list
      (this.only && !_.contains(this.only, methodName))
        ||
      // Or it's on the `except` list
      (this.except && _.contains(this.except, methodName))
    );
  }
};

// Filter Meteor.methods

// Cache original method
Meteor._original_methods = Meteor.methods;
Meteor.methods = function(methods) {

  // Wrap methods so we can hook into filters at run time
  Filter.prepareMethods(methods);
  
  return Meteor._original_methods.call(this, methods);
};

if (Meteor.is_client)
  Filter.prepareCallMethods();
