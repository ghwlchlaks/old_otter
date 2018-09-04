var express = require('express');
var router = express.Router();

const SparkPolicy = require('../policies/SparkPolicy')
const ResultSendToServices = require('../policies/ResultSendToServices')
const YarnStateServices = require('../policies/YarnStateServices')
const ClientControllerServices = require('../policies/ClientControllerServices')
const Slack = require('../policies/Slack')
/* GET client home page. */
router.get('/', function(req, res, next) {
	res.render('client', { title: 'Express'});  
});

router.post('/sparkSubmit', SparkPolicy.sparkSubmit , ResultSendToServices.sendToService)

router.post('/makeList', ClientControllerServices.makeList)
router.post('/dataUpload',ClientControllerServices.dataUpload)
router.post('/dataDelete',ClientControllerServices.dataDelete)
router.post('/makeParameterBlank',ClientControllerServices.makeParameterBlank)
router.post('/sparkLog', ClientControllerServices.sparkLog)

router.get('/yarnAllState', YarnStateServices.AllYarnStates)
router.get('/appState', YarnStateServices.appState)

router.post('/slack', Slack.sendToService)
router.post('/slacklist', Slack.CheckUser,Slack.sendToService)
module.exports = router;
