#!/usr/bin/env node
/**
 * Creabot
 * main application script
 * @author creadak <creadak@gmail.com>
 * @version 1.1.0
 */
console.log('butlerbot');

// Set node env
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

// dependencies
const bot = require('./app/bot');

// init the bot
bot.init();
// load plugins
require('./plugins.js')(bot);
