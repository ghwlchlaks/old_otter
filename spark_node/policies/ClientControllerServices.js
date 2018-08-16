const exec = require('child_process').exec;
const fs = require('fs')
const multiparty = require('multiparty');

var dataFolder = 'data' //HDFS data folder name

//mongodb model
const Meta = require('../models/metaModel').Meta

module.exports = {
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
					res.send({paralist : data, description : metadata.description})
				}
		})
	}
}
