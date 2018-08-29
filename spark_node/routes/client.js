var express = require('express');
var router = express.Router();

const SparkPolicy = require('../policies/SparkPolicy')
const ResultSendToServices = require('../policies/ResultSendToServices')
const YarnStateServices = require('../policies/YarnStateServices')
const ClientControllerServices = require('../policies/ClientControllerServices')
/* GET client home page. */
router.get('/', function(req, res, next) {
	res.render('client', { title: 'Express'});  
});

router.post('/sparkSubmit', SparkPolicy.sparkSubmit , ResultSendToServices.sendToService)

router.post('/makeList', ClientControllerServices.makeList)
router.post('/dataUpload',ClientControllerServices.dataUpload)
router.post('/dataDelete',ClientControllerServices.dataDelete)
router.post('/makeParamaterBlank',ClientControllerServices.makeParamaterBlank)
router.post('/sparkLog', ClientControllerServices.sparkLog)

router.get('/yarnAllState', YarnStateServices.AllYarnStates)
router.get('/appState', YarnStateServices.appState)

module.exports = router;
