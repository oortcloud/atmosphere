
Notify = {
  send: function(type, mode, pkg) {

    if (type === 'package') {

      var prefix;
      switch(mode) {
        case 'new':
          prefix = 'package added';
          break;
        case 'update':
        prefix = 'package updated';
          break;
      }
      
      var messages = [];

      if (prefix)
        messages.push('[' + prefix + '] ' + pkg.name + ' v' + pkg.latest)

      if (mode === 'new') {

        //TODO NOT DRY!
        var packageCount = Packages.find({
          visible: { $ne: false }
        }).count();

        messages.push('Nice job! We now have ' + packageCount + ' community packages!');

      }

      notifyIrc(messages);

    }
  }
};

