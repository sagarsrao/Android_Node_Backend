const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const config = require('../../config');

const Book = require('../../app/models/book');

router.use(function(req, res, next) {
  const token = req.body.token || req.query.token || req.headers['x-access-token'];

  if(token) {
    jwt.verify(token, config.secret, function(err, decoded) {
      if(err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        req.decoded = decoded;
        next();
      }
    })
  } else {
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });
  }
});

router.post('/', function(req, res) {
  const { title, author, category } = req.body;

  if(!title || !author || !category) {
    return res.json({success: false, msg: "Invalid book details!"});
  }

  const book = new Book({
    title,
    author,
    category
  });

  book.save(function(err) {
    if(err) {
      throw err;
      return res.json({success: false, msg: err.message});
    }

    console.log("Book saved successfully");
    return res.json({success: true})
  });
});

router.get('/list', function(req, res) {
  console.log(req.query);
  Book.find({}, function(err, books) {
    if(err) {
      console.log(err);
      res.json({success: false, msg: "Error while fetching books"});
    }

    res.json(books);
  });
});

module.exports = router;
