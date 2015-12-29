var _ = require('underscore'),
    fs = require('fs'),
    env = process.env.NODE_ENV || 'development',
    config = require('../../config/config.json')[env],
    booksToRead = require('../../config/booksToRead.json'),
    booksRead = require('../../config/booksRead.json');
    thisMonthBook = require('../../config/thisMonthBook.json');

var Bookclub = function Bookclub() {
  var self = this;
  self.config = config;
  self.booksToRead = booksToRead;
  self.thisMonthBook = thisMonthBook;
  self.booksRead = booksRead;

  self.thisMonth = function (client, message, cmdArgs) {
    var d = new Date();
    var month = d.getMonth();
    if (month === self.thisMonthBook.month) {
      client.say(message.args[0], 'This months book is ' + self.thisMonthBook.title + ' by ' + self.thisMonthBook.author);
    } else {
      self.changeBook(client, month, message.args[0]);
    }
  };

  self.suggest = function (client, message, cmdArgs) {
    var input = cmdArgs.split("; ");
    if (input.length !== 3) {
      if (input.length !== 2) {
        input.push("unknown"); input.push(null);
      }else if (input.length === 2) { input.push(null) }
    }

    var books = _.filter(self.booksToRead, function (book) { return book.title.toLowerCase() === input[0].toLowerCase(); });
    var titles = _.map(books, function (book) { return book.title.toLowerCase(); });
    var read = _.filter(self.booksRead, function (book) { return book.title.toLowerCase() === input[0].toLowerCase(); });
    var titlesRead = _.map(read, function (book) { return book.title.toLowerCase(); });
    // console.log(books);
    // console.log(titles);
    // console.log(titlesRead);

    if (_.contains(titlesRead, input[0].toLowerCase())) {
      client.say(message.args[0], 'That book has already been read');
    } else if (!_.contains(titles, input[0].toLowerCase())) {
      self.booksToRead.push( { title: input[0], author: input[1], pages: input[2], suggested: message.nick, month: 0} );
      self.write('booksToRead', self.booksToRead);
      client.say(message.args[0], 'Book added!');
    } else client.say(message.args[0], 'That book has already been suggested');
  };

  self.changeBook = function (client, month, channel) {
    //add book to read list
    self.booksRead.push(thisMonthBook);
    self.write('booksRead', self.booksRead);
    //choose random book from booksToRead
    newbook = Math.floor(Math.random()*self.booksToRead.length);
    self.thisMonthBook = self.booksToRead[newbook];
    self.booksToRead.splice(newbook, 1);
    self.thisMonthBook.month = month;
    // write out booksToRead and thisMonthBook
    self.write('booksToRead', self.booksToRead);
    self.write('thisMonthFileName', self.thisMonthFileName);
    //say book and cvhange TOPIC
    client.say(channel, 'This months book is ' + self.thisMonthBook.title + ' by ' + self.thisMonthBook.author + ' suggested by ' + self.thisMonthBook.suggested);
    self.setTopic(client, channel, 'This months book is ' + self.thisMonthBook.title + ' by ' + self.thisMonthBook.author)
  };

  self.setTopic = function (client, channel, topic) {
    // ignore if not configured to set topic
    if (typeof config.setTopic === 'undefined' || !config.setTopic) {
      return false;
    }
    // construct new topic
    var newTopic = topic;
    if (typeof config.topicBase !== 'undefined') {
      newTopic = topic + ' ' + config.topicBase;
    }
    // set it
    client.send('TOPIC', channel, newTopic);
  };

  self.write = function (fileName, file) {
    fileName = 'plugin_code/bookclub/config/' + fileName + '.json';
    fs.writeFile(fileName, JSON.stringify(file, null, 2), function (err) {
      if (err) return console.log(err);
      console.log('writing to ' + fileName);
    });
  };
}

exports = module.exports = Bookclub;
