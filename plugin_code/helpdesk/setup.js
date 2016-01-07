var Helpdesk = require('./app/controllers/helpdesk.js');

module.exports = function(app) {
  var helpdesk = new Helpdesk();

  // Join Channels
  app.joinChannels(helpdesk.config.channelsToJoin);

  // Add commands
  app.cmd('help', '', helpdesk.config.channels, helpdesk.config.channelsToExclude, helpdesk.help);
};
