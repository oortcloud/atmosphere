
var irc = NodeModules.require('irc');

var channels = [
  '#meteor',
  '#oortcloud'
];

var clientConfig = {
  userName: 'Atmosphere',
  realName: 'Atmosphere Smart Packages',
  channels: channels,
};

var notifyIrc = function(messages) {
  messages = _.isArray(messages) ? messages : [messages];

  var client = new irc.Client('irc.freenode.net', 'atmosphere', clientConfig);
  
  var done = _.after(channels.length, function() {
    client.disconnect("Be smart! https://atmosphere.meteor.com");
  });

  _.each(channels, function(channel) {
    client.addListener('join' + channel, function () {
      _.each(messages, function(message) {
        client.say(channel, message);
      });
      done();
    });
  });

};
