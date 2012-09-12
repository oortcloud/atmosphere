
var irc = NodeModules.require('irc');

var notifyIrc = function(messages) {
  messages = _.isArray(messages) ? messages : [messages];

  var client = new irc.Client('irc.freenode.net', 'atmosphere', {
    userName: 'Atmosphere',
    realName: 'Atmosphere Smart Packages',
    channels: ['#meteor'],
  });
  
  client.addListener('join#meteor', function () {
    _.each(messages, function(message) {
      client.say('#meteor', message);
    });
    client.disconnect("Be smart! https://atmosphere.meteor.com");
  });

};
