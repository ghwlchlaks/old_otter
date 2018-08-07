var express = require('express');
var router = express.Router();
var exec = require("child_process").exec;
var multer = require('multer')
var fs = require('fs')


const SparkPolicy = require('../policies/SparkPolicy')
/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express'});  
});

router.post('/sparkSubmit', SparkPolicy.sparkSubmit )
router.post('/makeList', SparkPolicy.makeList )

router.get('/spark',SparkPolicy.command)
//router.get('/yarnAll', SparkPolicy.AllYarnStates)
router.get('/yarnAllState', SparkPolicy.AllYarnStates)
router.get('/appState', SparkPolicy.appState)

router.get('/appHelp',SparkPolicy.appHelp)
router.post('/upload',SparkPolicy.upload)

module.exports = router;
