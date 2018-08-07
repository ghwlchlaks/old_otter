var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/cluster', function(req, res, next) {
  res.render('cluster', { title: 'Express' });
});

module.exports = router;
