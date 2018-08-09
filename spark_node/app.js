var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

//config
var dbconfig = require('./config/database');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');

//custompages
var frontRouter = require('./routes/front');
var inboundRouter = require('./routes/inbound');
var outboundRouter = require('./routes/outbound');
var backRouter = require('./routes/back');
var clusterRouter = require('./routes/cluster');
var hdfsRouter = require('./routes/hdfs');

mongoose.connect(dbconfig.meta_collection, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error: '))
db.once('open', function (callback) {
  console.log('mongo db connected..')
})

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: true}));

// default
app.use('/', indexRouter);
app.use('/users', usersRouter);

//admin page
app.use('/admin',adminRouter)
app.use('/saveApp', adminRouter)
app.use('/appList', adminRouter)
app.use('/appData', adminRouter)
app.use('/delApp',adminRouter)
//app.use('/admin/appUpload', adminRouter)


//userpages
app.get('/front',frontRouter);
app.get('/inbound',inboundRouter);
app.get('/outbound',outboundRouter);
app.get('/back',backRouter);
app.get('/cluster',clusterRouter);
app.get('/hdfs',hdfsRouter);

//yarn
app.use('/uploads', indexRouter)
app.use('/yarnAllState', indexRouter)
app.use('/appState', indexRouter)

app.use('/spk', indexRouter);


//css&js
app.use('/css', express.static(__dirname +'/node_modules/bootstrap/dist/css'));
app.use('/js', express.static(__dirname +'/node_modules/bootstrap/dist/js'));
app.use('/vendor', express.static(__dirname +'/node_modules/bootstrap/vendor'));
app.use('/data', express.static(__dirname +'/node_modules/bootstrap/data'));
app.use('/dist', express.static(__dirname +'/node_modules/bootstrap/dist'));


app.use('/appHelp', indexRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
app.listen(process.env.PORT || 3000, function() {
	console.log("server running")
})
module.exports = app;

