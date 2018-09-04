var express = require('express');
var router = express.Router();

const SchemaTest = require('../policies/SchemaTest')
/* GET home page. */
router.get('/', function(req,res) {
	res.render('test')
})
router.post('/schema', SchemaTest.saved)
module.exports = router;
