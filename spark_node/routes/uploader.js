var express = require('express');
var router = express.Router();
var multer = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'app/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
var upload = multer({ storage: storage })

/* GET home page. */
router.get('/', function(req, res) {
  res.render('uploadApp');
});


router.post('/', upload.single('userfile'), function(req, res){
  res.send('Uploaded : ' + req.file);
  console.log(req.file);
});


module.exports = router;
