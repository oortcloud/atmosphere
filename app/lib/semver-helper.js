SemverHelper = {
  isValidVersion: function(version) {
    try {
      new Semver(version);
      return true;
    } catch (err) {
      if (err instanceof TypeError && err.message && err.message.indexOf('Invalid Version') >= 0) {
        return false;
      }
      throw err;
    }
  }
}
