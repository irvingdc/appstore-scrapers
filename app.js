var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors')

var index = require('./routes/index');

var tencent = require('./routes/tencent');
var _360 = require('./routes/360');
var baidu = require('./routes/baidu');
var xiaomi = require('./routes/xiaomi');
var himarket = require('./routes/himarket');
var huawei = require('./routes/huawei');
var anzhi = require('./routes/anzhi');
var wandoujia = require('./routes/wandoujia');
var sogou = require('./routes/sogou');
var _91 = require('./routes/91');
var oppo = require('./routes/oppo');
var lenovo = require('./routes/lenovo');
var pp = require('./routes/pp');

var app = express();
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

let mainRoute = "/scrapers/"

app.use(mainRoute, index);
app.use(mainRoute+'tencent', tencent);
app.use(mainRoute+'360', _360);
app.use(mainRoute+'baidu', baidu);
app.use(mainRoute+'xiaomi', xiaomi);
app.use(mainRoute+'himarket', himarket);
app.use(mainRoute+'huawei', huawei);
app.use(mainRoute+'anzhi', anzhi);
app.use(mainRoute+'wandoujia', wandoujia);
app.use(mainRoute+'sogou', sogou);
app.use(mainRoute+'91', _91);
app.use(mainRoute+'oppo', oppo);
app.use(mainRoute+'lenovo', lenovo);
app.use(mainRoute+'pp', pp);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

module.exports = app;
