const exec = require('child_process').exec;
const fs = require('fs')
const multiparty = require('multiparty');

var dataFolder = 'data' //HDFS data folder name

//mongodb model
const App = require('../models/appSchema').App

module.exports = {
    makeList(req, res) {
		exec("curl -i 'http://192.168.2.12:50070/webhdfs/v1//data?op=LISTSTATUS'" , function(err, stdout, stderr){
			//make data list
			var dataList = stdout.split('pathSuffix":"')
			for(var i=1 ; i<dataList.length ; i++){
                		dataList[i] = dataList[i].split('","permission')[0]
        		}
			fs.readdir('../app', function (err, files){
				res.send({applist: files, datalist : dataList});
			});
		});
	},
	dataUpload(req, res){
		var DummyPath = '../app/'
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
						fs.readdir('../app', function (err, files){
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
				fs.readdir('../app', function (err, files){
					res.send({datalist : dataList})
				});
			});
		});
	},
	 makeParameterBlank(req, res){
		var appname = req.body.appname
		console.log('select ' + appname)
		App.findOne({appName : appname}, function(error, metadata){
				if(error){
					console.log(error)
				}else{
					//parameters data list
					var nameList = new Array()
					var descriptionList = new Array()
					var defaultList = new Array()
					var typeList = new Array()
					var typeDataList = new Array()
					var typeMaxList = new Array()
					var typeMinList = new Array()

					for (var i=0 ; i < metadata.parameters.length ; i++ ){
						nameList[i] = metadata.parameters[i].name
						descriptionList[i] = metadata.parameters[i].description
						defaultList[i] = metadata.parameters[i].default
						typeList[i] = metadata.parameters[i].inputType.boxType
						typeDataList[i] = metadata.parameters[i].inputType.data
						typeMaxList[i] = metadata.parameters[i].inputType.max
						typeMinList[i] = metadata.parameters[i].inputType.min
					}
					console.log(typeDataList[0].length)
					res.send({nameList : nameList,
						description : metadata.description,
						descriptionList : descriptionList,
						defaultList : defaultList,
						typeList : typeList,
						typeDataList : typeDataList,
						typeMaxList : typeMaxList,
						typeMinList : typeMinList
						})
				}
		})
	},
	sparkLog(req, res){
		//first, make log file to log4j
		fs.readFile('/var/log/spark.log', 'utf-8', function(err, data){

			var latelyLog = new Array()
			latelyLog[0] = ''
			var visibleLog = 20

			data = data.split('\n')

			for(i = data.length-2 ; i > data.length-visibleLog ; i--){
				for(j = visibleLog+2 ; j > -1 ; j--){
					latelyLog[j] = latelyLog[j] + data[i] + '\n'
				}
			}

			res.send({latelyLog : latelyLog, allLog : data})
		})
	}
}
