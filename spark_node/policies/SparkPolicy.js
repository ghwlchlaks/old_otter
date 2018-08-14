const exec = require('child_process').exec;
const Slack = require('slack-node');
const webhookUri = "https://hooks.slack.com/services/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";
const slack = new Slack();
const fs = require('fs')
const multiparty = require('multiparty');
slack.setWebhook(webhookUri);

var dataFolder = 'data' //HDFS data folder name

//mongodb model
const Meta = require('../models/metaModel').Meta

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
		var submit = 'spark-submit '+'app/'+req.body.APP+' --file='+req.body.data + ' ' +  req.body.paramater
		exec(submit, function (err, stdout, stderr) {

			console.log(submit);
			sendToSlack("해당 작업을 완료하였습니다. 결과값 : "+stdout)
			res.send({result : stdout});
		});
	},
	makeList(req, res) {
		exec("curl -i 'http://192.168.2.12:50070/webhdfs/v1//data?op=LISTSTATUS'" , function(err, stdout, stderr){
			//make data list
			var dataList = stdout.split('pathSuffix":"')
			for(var i=1 ; i<dataList.length ; i++){
                		dataList[i] = dataList[i].split('","permission')[0]
        		}
			fs.readdir('./app', function (err, files){
				res.send({applist: files, datalist : dataList});
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
	},
        upload(req, res){
                var form = new multiparty.Form({
                        fileNames: 'uploadtest.txt',
                        autoFiles: false,
                        uploadDir: 'app/',
//                      maxFilesSize: 1024 * 1024 * 5
                });
                form.parse(req, function(error, fields, files){
                        var path = files.fileInput[0].path
                        var originalName = files.fileInput[0].originalFilename
                        console.log('file path : ' + path);
                        console.log('original name : ' + originalName);

                        //rename upload file
                        fs.rename(path, 'app/'+originalName, function (err){
                                console.log('renamed complete');
                        });
                        fs.readdir('./app', function (err, files){
                                res.send({applist: files})
                        });
                });

        },
	dataUpload(req, res){
		var DummyPath = 'app/'
		var form = new multiparty.Form({
			fileNames: 'uploadtest.txt',
			autoFiles: false,
			uploadDir: DummyPath,
//	                maxFilesSize: 1024 * 1024 * 5
		});
		form.parse(req, function(error, fields, files){
			var path = files.fileInput[0].path
			var originalName = files.fileInput[0].originalFilename
			console.log('file path : ' + path);
			console.log('original name : ' + originalName);

			//rename upload file
			fs.rename(path, DummyPath+originalName, function (err){
				console.log('renamed complete');
			});

			//Upload DATA to HDFS
			exec('hdfs dfs -put '+DummyPath+originalName + ' /' + dataFolder , function(err, stdout, stderr){
				console.log('Upload DATA to HDFS')
				//Remove Dummy DATA
				exec('rm '+DummyPath+originalName , function(err, stdout, stderr){
					console.log('Remove Dummy DATA');
					//make new data list


					exec("curl -i 'http://192.168.2.12:50070/webhdfs/v1//data?op=LISTSTATUS'" , function(err, stdout, stderr){
						//make data list
						var dataList = stdout.split('pathSuffix":"')
						for(var i=1 ; i<dataList.length ; i++){
			                		dataList[i] = dataList[i].split('","permission')[0]
			        		}
						fs.readdir('./app', function (err, files){
							res.send({datalist : dataList});
						});
					});
				});
			});
        	});

	},
	dataDelete(req, res){
		//Remove DATA to HDFS
		exec('hdfs dfs -rm /' + dataFolder +'/'+ req.body.data , function(err, stdout, stderr){
			console.log('Remove DATA to HDFS')
			//make new data list


			exec("curl -i 'http://192.168.2.12:50070/webhdfs/v1//data?op=LISTSTATUS'" , function(err, stdout, stderr){
				//make data list
				var dataList = stdout.split('pathSuffix":"')
				for(var i=1 ; i<dataList.length ; i++){
	                		dataList[i] = dataList[i].split('","permission')[0]
	        		}
				fs.readdir('./app', function (err, files){
					res.send({datalist : dataList})
				});
			});
		});
	},
	 makeParamaterBlank(req, res){

		var appname = req.body.appname

		console.log('select ' + appname)

		Meta.findOne({appName : appname}, function(error, metadata){
			console.log('--- Read one ---')
				if(error){
					console.log(error)
				}else{
					data = metadata.help
					if(data[data.length-1] == ''){
						data.splice(data.length-1,1)
					}


					for(var i=0 ; i < data.length ; i++){
			 			data[i] = data[i].split('[')[0]
					//	console.log(data[i])
					}
					res.send({paralist : data})
				}
		})
	}
}

