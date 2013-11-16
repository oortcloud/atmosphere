
_.mixin(_.string.exports());

_.mixin({

    removeId: function(doc) {
      delete doc._id;
      return doc;
    },

    flatErrors: function(errors) {
      return Array.prototype.concat.apply([], _.values(errors))
    },

    parseAuthor: function(rawAuthor) {
      var author = rawAuthor;
      if (_.isString(rawAuthor)) {
        var authorParts = /([\w\s\-]+)(<\w+@[\w\.]+>)?\s*(\(.+\))?/gi.exec(rawAuthor);
        author = {
          name: _.trim(authorParts[1])
        };
        
        if (authorParts[2])
          author.email = _.trim(authorParts[2], '<>');

        if (authorParts[3])
          author.url = _.trim(authorParts[3], '()');
      }

      return author;
    }

});
