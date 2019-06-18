/*
 * This is main file for seeding encompass_seed
 * Commands:
 * md-seed run - this populates db from seed files
 * md-seed run --dropdb - this resets and populates db
 * md-seed g users - this is how you create an individual seed file
 */

var mongooseLib = require('mongoose');

var Users = require('./seeders/users.seeder');

// to be able to read the .env file
require('dotenv').config();

mongooseLib.Promise = global.Promise || Promise;

module.exports = {
  // Export the mongoose lib
  mongoose: mongooseLib,

  // Export the mongodb url
  mongoURL: process.env.MONGO_URL || 'mongodb://localhost:27017/mtlogin_test',

  /*
    Seeders List
    ------
    order is important
  */
  seedersList: {
    Users,
  },
};
