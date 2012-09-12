
var irc = NodeModules.require('irc');
console.log(irc);
var notifyIrc = function(message) {
  var client = new irc.Client('irc.freenode.net', 'atmosphere', {
    userName: 'Atmosphere',
    realName: 'Atmosphere Smart Packages',
    channels: ['#oortcloud'],
  });
  
  client.addListener('join#oortcloud', function () {
    client.say('#oortcloud', message);
    client.disconnect("Be smart! https://atmosphere.meteor.com");
  });

};
