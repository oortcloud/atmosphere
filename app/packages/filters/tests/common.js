Tinytest.add("filters - defining filters", function (test) {
  var noop1 = function noop1() {};
  var noop2 = function noop2() {};

  // Returns a filter for each config object
  var result = Filter._parseConfiguration([noop1, noop1]);
  test.equal(result.length, 2);

  // Handler is assigned to filter's handler attribute
  var firstResult = _.first(result);
  test.equal(firstResult.handler, noop1);

  // If not specified there's no only/except values in the filter
  test.isUndefined(firstResult.only);
  test.isUndefined(firstResult.except);

  // If an object argument is paried with a function argument
  // the function is treated as the handler
  var result = Filter._parseConfiguration([
    noop1, { only: ['echoYngwie', 'echoDerrida'] },
    noop2, { except: ['echoRebecca'] }
  ]);
  // NOTE the results of _parseConfiguration are in reverse order but
  // in real life they get applied in the correct order, I couldn't easily
  // untangle this so gave up since everything is fine other than the
  // clarity of these tests.
  var firstResult = _.first(result);
  test.equal(firstResult.handler, noop2);
  test.equal(firstResult.except, ['echoRebecca']);
  test.isUndefined(firstResult.only);
  var secondResult = _.last(result);
  test.equal(secondResult.only, ['echoYngwie', 'echoDerrida']);
  test.equal(secondResult.handler, noop1);

  // If an accept/only are scalar should come out as a single item array
  var result = Filter._parseConfiguration([
    { handler: noop1, only: 'moof' }
  ]);
  var firstResult = _.first(result);
  test.equal(firstResult.only, ['moof']);

  // If an argument is a single method treat it as a filter
  var result = Filter._parseConfiguration(noop1);
  var firstResult = _.first(result);
  test.isTrue(_.isObject(firstResult));
  test.equal(firstResult.handler, noop1);

  // If an argument is a object method treat it as a filter
  var result = Filter._parseConfiguration({
    handler: noop1
  });
  var firstResult = _.first(result);
  test.isTrue(_.isObject(firstResult));
  test.equal(firstResult.handler, noop1);
});
