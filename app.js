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

app.use('/scrapers/', index);
app.use('/scrapers/tencent', tencent);
app.use('/scrapers/360', _360);
app.use('/scrapers/baidu', baidu);
app.use('/scrapers/xiaomi', xiaomi);
app.use('/scrapers/himarket', himarket);
app.use('/scrapers/huawei', huawei);
app.use('/scrapers/anzhi', anzhi);
app.use('/scrapers/wandoujia', wandoujia);
app.use('/scrapers/sogou', sogou);
app.use('/scrapers/91', _91);
app.use('/scrapers/oppo', oppo);
app.use('/scrapers/lenovo', lenovo);
app.use('/scrapers/pp', pp);

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
