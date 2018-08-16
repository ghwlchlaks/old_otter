var express = require('express');
var router = express.Router();
var exec = require("child_process").exec;
var multer = require('multer')
var fs = require('fs')
var storage = multer.diskStorage({
	destination: function(req, file, cb) {
	// file type 
		console.log(file.originalname)
		cb(null, '../uploadFiles')
		
	},
	filename: function(req, file, cb) {
		cb(null, file.originalname+'-'+ Date.now())
	}
});
var upload = multer({storage: storage})
var appRoute = 'app/'
var appFolder = './app'

const SparkPolicy = require('../policies/SparkPolicy')
/* GET home page. */
router.get('/front', function(req, res, next) {
	console.log(req.query.spkfile);
    console.log(req.query.textfile);
    console.log(req.query.username);

    console.log(req.body.user);

    exec('hdfs dfs -ls /', function(err, stdout, stderr){
	//make user list
	var userList = stdout.split('\n')	
	for(var i=1 ; i<userList.length-1 ; i++){
		userList[i] = userList[i].split('/')[1]
		console.log(userList[i])
	}

      fs.readdir(appFolder, function (err, files){	

          //res.render('spk', {applist: files, userlist: userList});
		res.render('front', { title: 'Express',applist: files, userlist: userList });
      });
    });
  
});
router.post('/', function(req, res, next){

    var submit = 'spark-submit ' + appRoute + req.body.APP + ' --file=' + req.body.data + ' --user=' + req.body.user + ' ' + req.body.paramater
    console.log(submit);

    exec('hdfs dfs -ls /' + req.body.user , function(err, stdout, stderr){
	//make file list to username
	var fileList = stdout.split('\n')
	for(var i=1 ; i<fileList.length-1 ; i++){
		fileList[i] = fileList[i].split('/'+req.body.user+'/')[1]
		console.log(fileList[i])
	}

        exec(submit, function (err, stdout, stderr) {

	  console.log(submit);

	  res.send({result : stdout , datalist : fileList});

        });

    });

});
//router.get('/spark',SparkPolicy.command)
//router.get('/yarnAll', SparkPolicy.AllYarnStates)
router.get('/yarnAllState', SparkPolicy.AllYarnStates)
router.get('/appState', SparkPolicy.appState)

router.post('/uploads',upload.single(),function(req, res, next){

})
module.exports = router;
