
var App = require('../models/appSchema').App
var Parameter = require('../models/appSchema').Parameter

module.exports = {
    saved(req, res) {
        var info = req.body
        parameter = []
        for (var data of info.parameter) {
            parameter.push(data)
        }
        app = new App({
            "appName" : info.appName,
            "description" : info.description,
            "author" : info.author,
            "parameters" : parameter,
            "version" : info.version,
            "type" :info.type
        })
        app.save(function(err, result) {
            if(err){
                res.send({status: false, result: err})
            } else {
                res.send({status : true, result: result})
            }
        })
    }
}