const Request= require('request')
const {RTMClient} = require('@slack/client')

const token = "xoxp-401187969874-400943764356-420021840003-d5c684a0a98a6f414e8ed830f8d856bb"
const rtm = new RTMClient(token)
rtm.start()


function sendToSlack(message, conversationId, callback) {
  rtm.sendMessage(message, conversationId)
    .then((res) => {
      callback(res.ts)
    }).catch(console.error)
}

module.exports = {
  CheckUser(req, res, next) {
    const name = req.body.name
    Request({
      method: 'get',
      url: `https://slack.com/api/users.list?token=${token}&pretty=1`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      }
    }, function(err, response, body){
      try{
        if(!err && response.statusCode ==200){
          const result = JSON.parse(body)
          check = false
          for (var data in result.members) {
            if (result.members[data].name === name){
              check = true
              const info = result.members[data]
              res.send({status: true, result: info})
              req.body.id = info.id
              console.log(req.body.id)
              next()
            }
          }
          if (check == false) {
            res.send({status: false, result: "noMember"})
          }
        } else {
          res.send({status:false, reuslt: err})
        }
      }catch(e) {
        res.send({status:false, result:e})
      }
    })
  },
  sendToService(req, res) {
    const target = req.body.target
    const stdout = req.body.stdout
    const user = req.body.user
    const id = req.body.id

    if (target == "slack") {
      sendToSlack("result : "+stdout, id, function(response) {
        console.log(response)
        res.send({status: true, result: response})
      })
    } else if(target == "email") {
      sendToEmail("result : "+stdout, user, function(response) {
        console.log(response)
        res.send({status: true, result: response})
      })
    } else {}
  }
}


// function sendToSlack (message, callback) {
//   slack.webhook({
//     channel: "#random", // 전송될 슬랙 채널
//     username: "webhookbot", //슬랙에 표시될 이름
//     text: message
//   }, function(err, response) {
//     if(!err) {
//             console.log("slack send success")
//             callback(response)
//         }
//     else {
//             console.log("slack send failed")
//             callback(err)
//         }
//   });
// }

// function sendToEmail(message, ToMailName, callback) {
//       console.log(ToMailName)
//       let transport = nodemailer.createTransport({
//           service : 'gmail',
//           auth: {
//               user: 'guildzeta@gmail.com',
//               pass: 'dksdidzja1'
//           }
//       })
//       let mailOptions = {
//           from: 'guildzeta@gmail.com',
//           to: ToMailName,
//           subject: 'spark result',
//           html: '<h1> result </h1>' +
//                 '<p>'+ message +'</p>'
//       }
//       transport.sendMail(mailOptions, function(error, info){
//           if(error){
//               console.log(error)
//               callback(error)
//           } else {
//               console.log(info)
//               callback(info)
//           }
//       })
//   }
