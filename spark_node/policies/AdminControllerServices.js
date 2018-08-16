const exec = require('child_process').exec;
const fs = require('fs')
const multiparty = require('multiparty');

//mongodb model
const Meta = require('../models/metaModel').Meta;

module.exports = {
	saveInfo(req, res) {
		//var body = req.body
		var body = req.info
		Meta.findOne({appName : body.appName}, function(err, user) {
			if(err) {
				res.send({status:false, result: err})
			}
			if(!user) {
				//save data
				//console.log(body['help[]'])
				meta = new Meta({
					appName : body.appName[0],
					description : body.description[0],
					type : body.type[0],
					username : body.username[0],
					//help : body['help[]']
					help : body.help
				})
				meta.save(function(err, user) {
					//console.log('create', user)
					res.send({status: true, result: user})
				})
			} else {
				res.send({status: false, result: "file exists"})
			}
		})
	},

	saveFile(req, res, next) {
		console.log(req.body)
		var form = new multiparty.Form({
			autoFiles: false,
			uploadDir: 'app/',
		});
		form.parse(req, function(error, fields, files){
			//console.log(files)
			//console.log(fields)
			var path = files.appFile[0].path;
			var originalName = files.appFile[0].originalFilename
			if(error) {res.send({status: false, result:error})}
			else {
				fs.rename(path, 'app/' +originalName, function(err){
					if(err) {res.send({status: false, result: err})}
					else {
						//res.send({status: true, result: originalName})
						req.info = fields
						next()
					}
				})
			}
        });
	},
	appList(req, res) {
		var submit = 'ls app/'
		exec(submit, function(error, stdout, stderr) {
			if(error !== null) {
				//console.log('exec error :' + error)
				res.send({status: false, result:error})
			} else {
				res.send({status:true ,result: stdout})
			}
		});	
	},
	appData(req, res) {
		var id = req.query.id
		Meta.findOne({appName:id}, function(err, app) {
			if(err) {res.send({status: false, result: err})}
			if(!app) {res.send({status: false, result: "not exists app data"})}
			else {
				res.send({status: true, result: app})
			}
		})
	},
	delApp(req, res) {
		var id = req.query.id
		var path = 'app/'+id
		fs.exists(path, function(exists) {
			if(!exists) {res.send({status: false, result: "not exists"})}
			else {
				fs.unlink(path, function(err){
					if(err) {res.send({status: false, result: "permission denied"})}
					else {
						Meta.remove({appName:id},function(err, result) {
							if(err) {res.send({status: false, result:err})}
							if(!result) {res.send({status: false, result: result})}
							else {
								res.send({status: true, result: result})
							}
						})
					}
				}) 
			}
		})
	}
}

