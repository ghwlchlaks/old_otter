var express = require('express');
var router = express.Router();

const AdminControllerServices = require('../policies/AdminControllerServices')

/* admin page. */
router.get('/', function(req, res) {
	res.render('admin');  
});

router.post('/saveApp', AdminControllerServices.saveFile, AdminControllerServices.saveInfo);
router.get('/appList', AdminControllerServices.appList)
router.get('/appData',AdminControllerServices.appData)
router.get('/delApp', AdminControllerServices.delApp)

module.exports = router;
