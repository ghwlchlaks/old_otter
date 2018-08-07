const exec = require('child_process').exec;
const Slack = require('slack-node');
const webhookUri = "https://hooks.slack.com/services/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";
const slack = new Slack();
const fs = require('fs')
const multiparty = require('multiparty');
slack.setWebhook(webhookUri);

const  sendToSlack = (message) => {
  slack.webhook({
    channel: "#general", // 전송될 슬랙 채널
    username: "webhookbot", //슬랙에 표시될 이름
    text: message
  }, function(err, response) {
    if(!err) {
            console.log("slack send success")
        }
    else {
            console.log("slack send failed")
        }
  });
}

module.exports = {
	command(req, res) {
		var exec_command = "spark-submit ../wordcount.py --type even"
		child = exec(exec_command, function(error, stdout, stderr){
			//console.log("stdout: "+ stdout)
			//console.log("stderr: "+ stderr)
			if(error !== null) {
				console.log('exec error :' + error)
				res.send({status: false, result:"error"})
			}
			else {
				sendToSlack("해당 작업을 완료하였습니다. 결과값 : "+stdout)
				//res.render('spark', {status: true, result:stdout})
				res.send({status: true, result: stdout})
			}
		})	
	},
	AllYarnStates(req, res) {
		//var exec_command = "yarn application -list -appStates ALL"
		var exec_command = 'curl --compressed -H "Accept:application/json"  POST  "http://zest2:8088/ws/v1/cluster/apps"'
		
		child = exec(exec_command, function(error, stdout, stderr){
			if(error !== null) {
				console.log('exec error :' + error)
				res.send({status: false, result:"error"})
			}
//			res.render('AllYarnStates', {status: true, result:stdout})
			var data = JSON.parse(stdout).apps.app;
			data.sort(function(a,b){
				return a.startedTime > b.startedTime ? -1 : a.startedTime < b.startedTime ? 1 : 0;
			})
			//console.log(data)
			res.send({status:true, result:data})			
		})
	},
	appState(req, res) {
		var application_id =req.query.id
		var exec_command = 'curl --compressed -H "Accept:application/json"  POST  "http://zest2:8088/ws/v1/cluster/apps/"'+req.query.id
		 child = exec(exec_command, function(error, stdout, stderr){
                        if(error !== null) {
                                console.log('exec error :' + error)
                                res.send({status: false, result:"error"})
                        }
                        var data = JSON.parse(stdout).app;
//                      console.log(data.apps.app)
                        res.send({status:true, result:data})
                })
	
	},
	sparkSubmit(req, res) {
		var submit = 'spark-submit '+'app/'+req.body.APP+' --file='+req.body.data+' --user='+req.body.user+' '+req.body.paramater
		exec(submit, function (err, stdout, stderr) {

			console.log(submit);
			sendToSlack("해당 작업을 완료하였습니다. 결과값 : "+stdout)
			res.send({result : stdout});
		});
	},
	makeList(req, res) {
		exec('hdfs dfs -ls /' + req.body.user , function(err, stdout, stderr){
			//make file list to username
			var dataList = stdout.split('\n')
			for(var i=1 ; i<dataList.length-1 ; i++){
                		dataList[i] = dataList[i].split('/'+req.body.user+'/')[1]
                		console.log(dataList[i])
        		}
			exec('hdfs dfs -ls /', function(err, stdout, stderr){
			        //make user list
			        var userList = stdout.split('\n')
			        for(var i=1 ; i<userList.length-1 ; i++){
			                userList[i] = userList[i].split('/')[1]
			                console.log(userList[i])
				        }
				fs.readdir('./app', function (err, files){
					res.send({applist: files, userlist: userList, datalist : dataList});
				});
			});
		});
	},

	appHelp(req, res) {
		var appName = req.query.name
		console.log(appName)
		var submit = 'cat app/'+appName
		exec(submit, function(error, stdout, stderr) {
			if(error !== null) {
				console.log('exec error :' + error)
				res.send({status: false, result:"error"})
			}
			
			res.send({status:true ,result: stdout})
		});
		

	upload(req, res){
		var form = new multiparty.Form({
			fileNames: 'uploadtest.txt',
			autoFiles: false,
			uploadDir: 'app/',
//	                maxFilesSize: 1024 * 1024 * 5
		});
		form.parse(req, function(error, fields, files){
			var path = files.fileInput[0].path
			var originalName = files.fileInput[0].originalFilename
			console.log(path);
			console.log(originalName);

			//rename upload file
			fs.rename(path, 'app/'+originalName, function (err){
				console.log('renamed complete');
			});
//			console.log('filename :'+files.fileInput[0].path)
			fs.readdir('./app', function (err, files){
				res.send({applist: files})
			});
        	});

	}
}

