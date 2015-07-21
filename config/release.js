/* jshint node:true */
// var RSVP = require('rsvp');

// For details on each option run `ember help release`
module.exports = {
  local: false,
  // remote: 'some_remote',
  // annotation: "Release %@",
  // message: "Bumped version to %@",
  manifest: ['package.json'],
  strategy: 'semver',
  // format: 'YYYY-MM-DD',
  // timezone: 'America/Los_Angeles',
  //
  // beforeCommit: function(project, versions) {
  //   return new RSVP.Promise(function(resolve, reject) {
  //     // Do custom things here...
  //   });
  // }
};
