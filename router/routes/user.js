const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);

const config = require('../../config');
const User = require('../../app/models/user');

router.post('/signup', function(req, res) {
const { name, email, password } = req.body;

if(!name || !password || !email) {
return res.json({success: false, msg: "Name or password or email is not present!"});
}

User.findOne({
email
}, function(err, user) {
if(user) {
  return res.json({success: false, msg: "Email is already present!"});
} else {
  const passwordToSave = bcrypt.hashSync(password, salt);

  const user = new User({
	name,
	email,
	password: passwordToSave
  });

  user.save(function(err) {
	if(err) {
	  throw err;
	  return res.json({success: false, msg: err.message});
	}

	console.log("User saved successfully");
	return res.json({success: true})
  });
}
});
});

router.post('/authenticate', function(req, res) {
  const { email, password } = req.body;

  if(!email || !password) {
    return res.json({success: false, msg: "Email or password is not present!"});
  }

  User.findOne({
    'email': email
  }, function(err, user) {
    if(err) {
      throw err;
    }

    if (!user) {
      return res.json({ success: false, message: 'Invalid email or password!.' });
    } else if (user) {
      if (!bcrypt.compareSync(password, user.password)) {
        res.json({ success: false, message: 'Invalid email or password!.' });
      } else {
        // if user is found and password is right
        // create a token
        const token = jwt.sign(user, config.secret, {
          expiresIn: 1440
        });

        res.json({
          success: true,
          msg: 'Token generated!',
          token
        })
      }
    }
  })
});

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

router.get('/list', function(req, res) {
  User.find({}, function(err, users) {
    if(err) {
      console.log(err);
      res.json({success: false, msg: "Error while fetching users"});
    }

    res.json(users);
  });
});

module.exports = router;
