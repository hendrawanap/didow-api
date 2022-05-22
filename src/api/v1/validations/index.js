const Joi = require('joi');
const words = require('./words')(Joi);

module.exports = {
  words,
};
