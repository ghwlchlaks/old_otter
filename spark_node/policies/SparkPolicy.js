const  exec = require('child_process').exec;
const { RTMClient } = require('@slack/client');

const token = 'xoxp-401187969874-400943764356-401054501843-c365ef356f487899724751af19e46660'

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
				const rtm = new RTMClient(token);
				rtm.start();
				const conversationId = 'CBT1L5DD1';
				rtm.sendMessage('해당 작업을 완료하였습니다. 결과값 '+stdout, conversationId).then((res)=> {
					console.log("message sent success: ", res.ts)
				}).catch(console.error);

				res.render('spark', {status: true, result:stdout})
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
//			console.log(data.apps.app)
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
	
	}
}
