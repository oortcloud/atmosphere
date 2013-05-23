_.mixin({

  validate: function(doc, validators) {
    return _.reduce(validators, function(errors, validator) {
      var error = validator.call({
        moof: 123
      }, doc);
      if (_.isObject(error)) {
        errors[error.field] = errors[error.field] || [];
        errors[error.field].push(error.message);
      }
      return errors;
    }, {});
  },

  nestedValue: function(doc, field) {
    if (!_.isUndefined(doc[field]))
      return doc[field];

    var fields = field.split('.');
    return _.reduce(fields, function(value, field) {
      if (_.isObject(value))
        return value[field];
      return value;
    }, doc);
  },

});
