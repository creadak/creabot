exports.connect = (app, callback) => {
  require('../plugin_code/cards_against_humanity/setup.js')(app);
  callback();
};
