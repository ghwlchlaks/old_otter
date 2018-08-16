var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/back', function(req, res, next) {
  res.render('back', { title: 'Express' });
});

module.exports = router;
