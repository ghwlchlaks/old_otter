var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/hdfs', function(req, res, next) {
  res.render('hdfs', { title: 'Express' });
});

module.exports = router;
