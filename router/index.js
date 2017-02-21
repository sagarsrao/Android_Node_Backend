const user = require('./routes/user');
//const book = require('./routes/book');

module.exports = function(app) {
  app.use('/api/user', user);
  //app.use('/api/book', book);
};
