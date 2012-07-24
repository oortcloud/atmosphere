
new Appstrap({
  hosts: {
    production: ['atmosphere.meteor.com']
  },
  github: {
    user: 'possibilities',
    repo: 'atmosphere',
    forkMe: {
      position: 'left'
    }
  },
  tabs: {
    name: 'navigation',
    tabs: [
      'packages',
      'help'
    ]
  }
});

Meteor.accounts.google.config('883542766681-7tgmlmqt2oe8lm7nc56h65n0n4g24am6.apps.googleusercontent.com', 'http://dev.atmospher.es');
Meteor.accounts.facebook.config('396848297039113', 'http://dev.atmospher.es');
