//Configurations
const express = require('express'); //Call express
const app = express();//define the app using express
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');

const config = require('./config');
const router = require('./router');

// =========================
// config
// =========================
const port = 8889;//set the port for which the app should run
mongoose.connect(config.database);//Using Mongoose to connect the database.
//configure the app to use body parser since it fetches the data from the POST
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(morgan('dev'));


// =========================
// routes
// =========================
app.get('/', function(req, res) {
  res.send('Hello AndroidNode Whats up!');
});

// API routes
router(app);
//sTART THE SEVER
app.listen(port);
console.log('Magic happens at http://localhost:' + port);
