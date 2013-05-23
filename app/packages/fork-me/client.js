ForkMe = function(github) {
  var self = this;

  var colors = {
    red: 'aa0000',
    green: '007200',
    darkblue: '121621',
    orange: 'ff7600',
    gray: '6d6d6d',
    white: 'ffffff'
  };

  github.ribbon || (github.ribbon = {});
  github.ribbon.position || (github.ribbon.position = 'right');
  github.ribbon.color || (github.ribbon.color = 'gray');
  github.ribbon.colorCode = colors[github.ribbon.color];

  // Might as well make them look like mustache templates
  _.templateSettings = {
    interpolate : /\{\{(.+?)\}\}/g
  };

  // Setup context
  var urlTemplate = 'https://github.com/{{user}}/{{repo}}';
  var imgUrlTemplate = 'https://s3.amazonaws.com/github/ribbons/forkme_{{ribbon.position}}_{{ribbon.color}}_{{ribbon.colorCode}}.png';
  
  github.url = _.template(urlTemplate)(github);
  github.bannerImg = _.template(imgUrlTemplate)(github);
  github.bannerAlt = 'Fork me on GitHub';

  // Compile banner template
  var bannerTemplate = _.template('<a href="{{url}}"><img class="githubBanner {{ribbon.position}}" src="{{bannerImg}}" alt="{{bannerAlt}}"></a>');
  var forkMeRibbon = $(bannerTemplate(github));

  Meteor.startup(function() {
    $('body').append(forkMeRibbon);
  });
};
