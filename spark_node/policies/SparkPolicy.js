const  exec = require('child_process').exec;
const Slack = require('slack-node');
const webhookUri = "https://hooks.slack.com/services/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";
const slack = new Slack();
slack.setWebhook(webhookUri);

const sendToSlack = async(message) => {
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
