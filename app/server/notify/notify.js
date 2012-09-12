
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
      
      if (prefix) {
        notifyIrc('[' + prefix + '] ' + pkg.name + ' v' + pkg.latest);
      }
    }
  }
};

