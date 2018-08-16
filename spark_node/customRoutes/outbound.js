var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/outbound', function(req, res, next) {
  res.render('outbound', { title: 'Express' });
});

module.exports = router;
