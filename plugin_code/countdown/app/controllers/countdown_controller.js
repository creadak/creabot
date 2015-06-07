var _ = require('underscore'),
    Game = require('./game'),
    Player = require('../models/player'),
    env = process.env.NODE_ENV || 'development';
    config = require('../../config/config.json')[env];

var Countdown = function Countdown() {
  var self = this;
  self.game;
  self.config = config;
  self.challenges = [];

  self.accept = function (client, message, cmdArgs) {
    if (_.isUndefined(self.game) || self.game.states === Game.STATES.STOPPED) {
      var channel = message.args[0];
      var challengers = _.filter(self.challenges, function (challenge) { return challenge.challenged === message.nick; });
      var challengers = _.map(challengers, function (challenge) { return challenge.challenger; });

      if (!_.contains(challengers, cmdArgs[0])) {
        client.say('You haven\'t been challenged by ' + cmdArgs[0] + '. Challenging...');
        self.challenge(client, message, cmdArgs);
      } else {
        self.game = new Game(channel, client, self.config, cmdArgs[0], message.nick);
        self.join(client, message, cmdArgs);
      }
    } else {
      client.say('Sorry, challenges cannot currently be accepted');
    }
  };

  self.challenge = function (client, message, cmdArgs) {
    var channel = message.args[0];
    if (!_.contains(self.challeneges, { challenger: message.nick, challenged: cmdArgs[0] })) {
      self.challenges.push({ challenger: message.nick, challenged: cmdArgs[0] });
      client.say(channel, message.nick + ': has challenged ' + cmdArgs[0]);
      client.say(channel, cmdArgs[0] + ': To accept ' + message.nick + '\'s challenge, simply !accept ' + message.nick);
    } else {
      client.say(channel, message.nick + ': You have already challenged ' + cmdArgs[0] + '.');
    }
  };

  self.join = function (client, message, cmdArgs) {
    if (!_.isUndefined(self.game) && self.game.states === Game.STATES.WAITING) {
      var player = new Player(message.nick, message.user, message.host);
      self.game.addPlayer(player);
      _.without(self.challenges, { challenger: self.game.challenger_nick, challenged: self.game.challenged_nick });
    } else {
      client.say(message.args[0], 'Unable to join at the moment.');
    }
  };


  self.list = function (client, message, cmdArgs) {
    var challenges_sent = _.filter(self.challenges, function (challenge) { return challenge.challenger === message.nick; });
    var challenges_received = (self.challenges, function (challenge) { return challenge.challenged === message.nick; });

    challenges_sent = _.map(challenges, function (challenge) { return challenge.challenged; });
    challenges_received = _.map(challenges, function (challenge) { return challenge.challenger === message.nick; });

    if (challenges_sent.length < 1 ) {
      client.say(message.args[0], message.nick + ': You have issued no challenges.');
    } else {
      client.say(message.args[0], message.nick + ': You have issued challenges to the following players: ' + challenges_sent.join(', ') + '.');
    }

    if (challenges_received.length < 1) {
      client.say (message.args[0], message.nick + ': You have received no challenges.');
    } else {
      client.say(message.args[0], message.nick + ': You have been challenged by the following players: ' + challenges_reveived.join(', ') + '.');
    }
  };

  self.play = function (client, message, cmdArgs) {
    if (!_.isUndefined(self.game) && self.game.state === Game.STATES.PLAY_LETTERS) {
      var args;

      if (cmdArgs.length > 1) {
        args = cmdArgs.join('');
      } else {
        args = cmdArgs;
      }

      self.game.letters(message.nick, args);
    } else if (!_.isUndefined(self.game) && self.game.state === Game.STATES.PLAY_NUMBERS) {
      client.say('Numbers rounds not implemented yet!');
    } else {
      client.say(message.args[0], 'The select command is not available at the moment');
    }
  };

  self.select = function (client, message, cmdArgs) {
    if (!_.isUndefined(self.game) && self.game.state === Game.STATES.LETTERS) {
      var args;

      if (cmdArgs.length > 1) {
        args = cmdArgs.join('');
      } else {
        args = cmdArgs;
      }

      self.game.playLetters(message.nick, args);
    } else if (!_.isUndefined(self.game) && self.game.state === Game.STATES.NUMBERS) {
      client.say('Numbers rounds not implemented yet!');
    } else {
      client.say(message.args[0], 'The select command is not available at the moment');
    }
  };

  self.stop = function (client, message, cmdArgs) {
    if (_.isUndefined(self.game) || self.game.state !== STOPPED) {
      client.say(message.args[0], 'No game running to stop.'); 
    } else {
      self.game.stop(message.nick, false);
      self.game = undefined;
    }
  };
};

exports = module.exports = Countdown;