_.mixin(_.string.exports());

Packages = new Meteor.Collection('packages');
Packages.allow({});

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

  removeId: function(doc) {
    delete doc._id;
    return doc;
  },

  flattenErrors: function(errors) {
    return Array.prototype.concat.apply([], _.values(errors))
  },

  parseAuthor: function(rawAuthor) {
    var author = rawAuthor;
    if (_.isString(rawAuthor)) {
      var authorParts = /([\w\s]+)(<\w+@[\w\.]+>)?\s*(\(.+\))/gi.exec(rawAuthor);
      return {
        name: _.trim(authorParts[1]),
        email: _.trim(authorParts[2], '<>'),
        url: _.trim(authorParts[3], '()'),
      };
    }

    return author;
  },
  nestedValue: function(doc, field) {
    if (!_.isUndefined(doc[field]))
      return doc[field];

    var fields = field.split('.');
    return _.reduce(fields, function(value, field) {
      if (_.isObject(value) && !_.isUndefined(value[field]))
        return value[field];
      return value;
    }, doc);
  },

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

Meteor.methods({
  publish: function(pkgInfo) {
    Packages.remove({name: 'underscore-string'});

    pkgInfo.author = _.parseAuthor(pkgInfo.author);

    var versionFormat = /^\d{1,3}\.\d{1,3}\.\d{1,3}[\.\d\w]*$/;

    var errors = _.validate(pkgInfo, [

      // Name
      _.presenceOf   ('name'),
      _.lengthOf     ('name', { gte: 1, lte: 30 }),
      _.uniquenessOf ('name', { in: Packages }),

      // Description
      _.presenceOf   ('description'),
      _.lengthOf     ('description', { gte: 20, lte: 500 }),

      // Homepage
      _.presenceOf   ('homepage'),
      _.validUrl     ('homepage'),

      // Author
      _.presenceOf   ('author.name'),
      _.lengthOf     ('author.name', { gte: 5, lte: 50 }),
      _.presenceOf   ('author.email'),
      _.validEmail   ('author.email'),
      _.validUrl     ('author.url'),

      // Version
      _.presenceOf   ('version'),
      _.formatOf     ('version', versionFormat, 'must be correctly formatted (e.g. 0.0.3, 0.0.4rc1, etc)'),

      // Git url
      _.presenceOf   ('git'),
      _.validUrl     ('git')

    ]);

    var errorMessages = _.flattenErrors(errors);

    if (errorMessages.length > 0)
      throw new Meteor.Error(422, "Package could not be saved", errorMessages);

    var packageFields = [
      'name',
      'description',
      'homepage',
      'author',
      'version',
      'git',
      'packages',
      'visible',
      'meteor'
    ];

    // these are the fields that get saved to each version
    var versionFields = [
      'git',
      'version',
      'meteor',
      'packages'
    ]
    
    var updatePackage = function(oldPkg, newPkg) {
      return _.each(packageFields, function(key) {
        if (key !== 'packages')
          newPkg[key] = oldPkg[key];
      });
    };

    // Get rid of keys we don't want
    pkgInfo = _.pick(pkgInfo, packageFields);

    // Setup defaults
    pkgInfo.visible = _.isUndefined(pkgInfo.visible) ? true : pkgInfo.visible;
    
    // prepare version
    var now = new Date;
    var versionRecord = _.pick(pkgInfo, versionFields);
    versionRecord.createdAt = now;
    
    // Let's see if we have a record for the package
    var pkgRecord = Packages.findOne({ name: pkgInfo.name });
    
    // Ok we have one
    if (pkgRecord) {

      // Only the owner can update it
      if (pkgRecord.userId !== this.userId())
        throw new Meteor.Error(401, "That ain't yr package son!");

      if (pkgRecord.latest === pkgInfo.version)
        throw new Meteor.Error(500, "Version " + pkgInfo.version + " already exists!");

      // Add new version
      pkgRecord.versions.push(versionRecord);

      // Assign packages
      if (pkgInfo.packages)
        pkgRecord.packages = pkgInfo.packages;

      pkgRecord.latest = pkgInfo.version;

      // Timestamp it
      pkgRecord.updatedAt = new Date();

      updatePackage(pkgRecord, pkgInfo);
      
      // Get the update ID first
      var id = pkgRecord._id;

      // Do the update
      Packages.update(id, {
        $set: _.removeId(pkgRecord)
      });
    } else {

      // Setup new package record
      var newPackage = _.extend(pkgInfo, {
        userId: this.userId(),
        lastest: pkgInfo.version,
        createdAt: now,
        updatedAt: now,
        versions: [versionRecord]
      });

      // Insert it
      Packages.insert(newPackage);
    }
  }
});
