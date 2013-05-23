_.mixin({

  // Stock validators

  presenceOf: function(field) {
    var self = this;

    return function(doc) {
      var value = _.nestedValue(doc, field);

      if (_.isUndefined(value) || _.isBlank(value)) {
        var message = _.humanize(field.replace('.', ' ')) + ' cannot be blank';
        return {
          field: field,
          message: message
        };
      }
    };
  },

  formatOf: function(field, regex, messageSuffix) {
    return function(doc) {
      var value = _.nestedValue(doc, field);

      if (value && !regex.test(value)) {
        var message = _.humanize(field.replace('.', ' ')) + ' ' + messageSuffix;
        return {
          field: field,
          message: message
        };
      }
    };
  },

  lengthOf: function(field, options) {
    return function(doc) {
      var message;
      var value = _.nestedValue(doc, field) || '';

      if (value && options.lte && options.gte && (value.length > options.lte || value.length < options.gte))
        message = _.humanize(field.replace('.', ' ')) + ' must be between ' + options.gte + ' and ' + options.lte + ' characters';

      if (message)
        return {
          field: field,
          message: message
        };
    };
  },

  uniquenessOf: function(field, options) {
    return function(doc) {
      var value = _.nestedValue(doc, field);
      if (value && options.in) {
        var query = {};
        query[field] = value;
        var count = Packages.find(query).count();
        if (count > 0) {
          var message = _.humanize(field.replace('.', ' ')) + ' must be unique';
          return {
            field: field,
            message: message
          };
        }
      }
    }
  },

  validUrl: function(field) {
    return function(doc) {
      var value = _.nestedValue(doc, field);
      var urlMatcher = /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi;

      if (value && !urlMatcher.test(value)) {
        var message = _.humanize(field.replace('.', ' ')) + ' must be a valid URL';
        return {
          field: field,
          message: message
        };
      }
    };
  },

  validEmail: function(field) {
    return function(doc) {
      var value = _.nestedValue(doc, field);
      var emailMatcher = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      if (value && !emailMatcher.test(value)) {
        var message = _.humanize(field.replace('.', ' ')) + ' must be a valid email address';
        return {
          field: field,
          message: message
        };
      }
    };
  }
});
