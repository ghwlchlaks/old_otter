//slack config
const Slack = require('slack-node');
const webhookUri = "https://hooks.slack.com/services/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";
const slack = new Slack();
slack.setWebhook(webhookUri);

//mailer config
const nodemailer = require('nodemailer')

module.exports = {
  sendToService(req, res) {
    const target = req.body.target
    const stdout = req.body.stdout
    const user = req.body.user

    if (target == "slack") {
      sendToSlack("result : "+stdout, function(response) {
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


function sendToSlack (message, callback) {
  slack.webhook({
    channel: "@Choi", // 전송될 슬랙 채널
    username: "webhookbot", //슬랙에 표시될 이름
    text: message
  }, function(err, response) {
    if(!err) {
            console.log("slack send success")
            callback(response)
        }
    else {
            console.log("slack send failed")
            callback(err)
        }
  });
}

function sendToEmail(message, ToMailName, callback) {
      console.log(ToMailName)
      let transport = nodemailer.createTransport({
          service : 'gmail',
          auth: {
              user: 'guildzeta@gmail.com',
              pass: 'dksdidzja1'
          }
      })
      let mailOptions = {
          from: 'guildzeta@gmail.com',
          to: ToMailName,
          subject: 'spark result',
          html: '<h1> result </h1>' +
                '<p>'+ message +'</p>'
      }
      transport.sendMail(mailOptions, function(error, info){
          if(error){
              console.log(error)
              callback(error)
          } else {
              console.log(info)
              callback(info)
          }
      })
  }
