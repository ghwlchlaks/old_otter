const {WebClient} = require('@slack/client')
const token = 'xoxp-401187969874-400943764356-429588191991-fd8e255bcf9ee5b0ed296e6115fbd0ac'
const web = new WebClient(token)
const Request= require('request')

function sendToSlack(message, conversationId, callback) {
  web.chat.postMessage({channel:conversationId, text: message})
  .then((res)=> {
    callback(res.ts)
  }).catch(console.error)
}

module.exports = {
  
  sendToService(req, res, next) {
    const target = req.body.target
    const stdout = req.body.stdout
    const user = req.body.user
    const id = req.body.id

    if (target == "slack") {
      var check = checkUser(id)
      console.log(check)
      if (!check.status) {
        res.send({status: false, result: "slack user not found"})
      } else {
        
        sendToSlack("result : "+stdout, check.userId, function(response) {
          console.log(response)
          res.send({status: true, result: response})
        })
      }
    } else if(target == "email") {
      sendToEmail("result : "+stdout, user, function(response) {
        console.log(response)
        res.send({status: true, result: response})
      })
    } else {}
  }
}

function checkUser(id, callback) {
  Request({
    method: 'get',
    url: `https://slack.com/api/rtm.start?token=${token}&pretty=1`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    }
  }, function(err, response, body){
    try{
      if(!err && response.statusCode ==200){
        const result = JSON.parse(body)
        var users = result.users
        for (var i in users) {
          if (users[i].name == id ) {
            var ims = result.ims
            for (var j in ims) {
              if (ims[j].user == users[i].id){
                //console.log(ims[j].id)
                callback(ims[j].id)
                
              }
            }
          }
        }
        //return {status: true, userId: }
      }
    }catch(e){
      callback(false)
    }
  })

}