var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Contact = mongoose.model('Contact');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
	res.render('index',{});
});

