var express = require('express');
var router = express.Router();
var exec = require("child_process").exec;
var multer = require('multer')
var fs = require('fs')

const adminPolicy = require('../policies/adminPolicy')
/* GET home page. */
router.get('/', function(req, res) {
	res.render('admin');  
});
router.post('/saveApp', adminPolicy.saveFile, adminPolicy.saveInfo);
router.get('/appList', adminPolicy.appList)
router.get('/appData',adminPolicy.appData)
router.get('/delApp', adminPolicy.delApp)
// router.post('/appUpload', adminPolicy.saveFile)
module.exports = router;
