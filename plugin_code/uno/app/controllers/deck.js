var _ = require('underscore'),
    Card = require('../models/card'),
    cards = require('../../config/cards.json');

var Deck = function Deck(deck) {
  var self = this;

  if (deck === true) {
    _.each(cards, function (card) {
      self.cards.push(new Card(card));
    });
  } else {
    self.cards = [];
  }

  self.shuffle = function () {
    self.cards = _.shuffle(_.shuffle(self.cards));
  };

  self.deal = function (deck, number) {
    if (_.isUndefined(number)) {
      number = 1;
    }

    for (int i = 0; i < number; i++) {
      deck.addCard(self.cards.pop());
    }
  }

  self.addCard = function (card) {
    self.cards.push(card);
  };

  self.removeCard = function (card) {
    if (_.isUndefined(card)) {
      return false;
    }

    self.cards = _.without(self.cards, card);
    return card;
  };

  self.pickCard(index) {
    var card = self.cards[index];
    self.removeCard(card);
    return card;
  };

  self.numCards = function () {
    return self.cards.length;
  };
};

exports = module.exports = Deck;