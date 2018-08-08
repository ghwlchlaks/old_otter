const exec = require('child_process').exec;
const fs = require('fs')
const multiparty = require('multiparty');

//mongodb model
const Meta = require('../models/metaModel').Meta;

module.exports = {
	saveInfo(req, res) {
		var body = req.body
		
		Meta.findOne({appName : body.appName}, function(err, user) {
			if(err) {
				res.send({status:false, result: err})
			}
			if(!user) {
				//save data
				//console.log(body['help[]'])
				meta = new Meta({
					appName : body.appName,
					description : body.description,
					type : body.type,
					username : body.username,
					help : body['help[]']
				})
				meta.save(function(err, user) {
					//console.log('create', user)
					res.send({status: true, result: user})
				})
			} else {
				res.send({status: false, result: "file exists"})
			}
		})
	}
}

