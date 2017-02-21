const mongoose = require('mongoose');
const Schema = mongoose.Schema;//Defines the schema in mongo database
//Table creation inside the mongo database
const UserSchema = new Schema({
  name: String,
  email: String,
  password: String
});
//using Mongoose we are connectig the model to the database
module.exports = mongoose.model('User', UserSchema);
