
var irc = NodeModules.require('irc');

var notifyIrc = function(message) {
  var client = new irc.Client('irc.freenode.net', 'atmosphere', {
    userName: 'Atmosphere',
    realName: 'Atmosphere Smart Packages',
    channels: ['#meteor'],
  });
  
  client.addListener('join#oortcloud', function () {
    client.say('#oortcloud', message);
    client.disconnect("Be smart! https://atmosphere.meteor.com");
  });

};
