var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/inbound', function(req, res, next) {
  res.render('inbound', { title: 'Express' });
});

module.exports = router;
