const exec = require('child_process').exec;

module.exports = {
	sparkSubmit(req, res, next) {
		var submit = 'spark-submit '+'../app/'+req.body.APP+' --file='+req.body.data + ' ' +  req.body.paramater
		exec(submit, function (err, stdout, stderr) {
			if(err !== null) {
				console.log('exec error :' + err)
				res.send({status: false, result:"error"})
			}
			else {
				req.body.stdout = stdout
				next()
			}
		});
	}
}

