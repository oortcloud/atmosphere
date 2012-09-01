(function() {

  new ForkMe({
    user: 'oortcloud',
    repo: 'atmosphere',
    ribbon: {
      position: 'left',
      color: 'gray'
    }
  });

  Meteor.startup(function() {
    Meteor.accounts._enableAutoLogin();
  });

})();
