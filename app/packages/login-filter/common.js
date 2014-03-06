// // NOTE: this is very hacky so here's how it works:
// // We're using a `callHandler` to prepend the client
// // name and version to `login` and on then a regular
// // filter to check this info before invoking `login`.
// // Obviously Atmosphere always gets a pass as it's
// // always at the right version. The reason we need to
// // do is so that Atmosphere will know what version mrt
// // is at when it connects. Often we'll reject logins
// // from old clients. It should also be obvious that
// // there's no security behind this, anyone can forge
// // this client info to use an incompatible client.
// 
// if (Meteor.isClient)
//   Filter.methods([
//     {
//       callHandler: function(options) {
//         options.unshift('0.2.0');
//         options.unshift('atm');
//         return [options];
//       },
//       only: 'login'
//     }
//   ]);
// 
// 
if (Meteor.isServer)

  Filter.methods([
    {
      handler: function(client, version, options) {
        
        // Logs.insert({
        //   name: 'methods.login',
        //   client: client,
        //   version: version,
        //   options: options,
        //   stamp: new Date()
        // });
        // 
        // console.log(version)
        // var minVersion = '0.2.0';
        // if (!_.contains(['atm', 'mrt'], client) || (client === 'mrt' && version < minVersion))
        //   throw new Meteor.Error(400, "Y'oopsy¡ You need a newer version of " +
        //                               "Meteorite to use Atmosphere! It must be " +
        //                               "greater or equal to v" + minVersion +
        //                               " Do this: npm install -g meteorite"
        //                               );
        
        // mrt calling us
        if (client === 'mrt')
          this.next(options);
        else
          this.next(client, version, options);
      },
      only: 'login',
    }
  ]);
