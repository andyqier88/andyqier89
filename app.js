"use strict"
var Koa = require("koa");
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//wx
var wechat = require('./wechat/g');
var until = require('./until/until');
//const art_video = require('./routes/art_video');

var index = require('./routes/ArtWeb/index');
var users = require('./routes/ArtWeb/users');
var art_video = require('./routes/ArtWeb/art_video');
var art_video_get = require('./routes/ArtWeb/art_video');
var commuity = require('./routes/ArtWeb/commuity');
var oauth = require('./routes/ArtWeb/oauth_');
var sq = require('./routes/ArtWeb/sq');
var art_talk = require('./routes/ArtWeb/art_talk');
var arttalk_oauth = require('./routes/ArtWeb/arttalk_oauth');
var arttalksq = require('./routes/ArtWeb/arttalksq');
var auction_oauth = require('./routes/ArtWeb/auction_oauth');
var auctionsq = require('./routes/ArtWeb/auctionsq');
var auction = require('./routes/ArtWeb/auction');
var data_statistic = require('./routes/ArtWeb/data_statistic');
var limited_show = require('./routes/ArtWeb/limited_show');
var deleted = require('./routes/ArtWeb/deleted');
var limshow_oauth = require('./routes/ArtWeb/limshow_oauth');
var limshowsq = require('./routes/ArtWeb/limshowsq');
var test_index = require('./routes/ArtWeb/index');
var app = express();
var session = require('express-session');
var appk = new Koa();
//var router = express.Router();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static(path.join(__dirname, 'ArtWebStatic')));
app.use(cookieParser('arttalk'));
app.use(session({
    secret: 'arttalk',
    name: "art", //这里的name值得是cookie的name，默认cookie的name是：connect.sid
    cookie: { path: '/', expires: new Date(Date.now() + 36000000000), httpOnly: true }, //设置maxAge是80000ms，即80s后session和相应的cookie失效过期
    resave: true,
    saveUninitialized: true
}));
app.use('/ArtWeb', index);
app.use('/ArtWeb/users', users);
app.use('/ArtWeb/art_video', art_video);
app.use('/ArtWeb/commuity', commuity);
app.use('/ArtWeb/oauth_', oauth);
app.use('/ArtWeb/sq', sq);
app.use('/ArtWeb/art_talk',art_talk);
app.use('/ArtWeb/auction',auction);
app.use('/ArtWeb/arttalk_oauth',arttalk_oauth);
app.use('/ArtWeb/arttalksq',arttalksq);
app.use('/ArtWeb/auction_oauth',auction_oauth);
app.use('/ArtWeb/auctionsq',auctionsq);
app.use('/ArtWeb/data_statistic',data_statistic);
app.use('/ArtWeb/limited_show',limited_show);
app.use('/ArtWeb/deleted',deleted);
app.use('/ArtWeb/limshow_oauth',limshow_oauth);
app.use('/ArtWeb/limshowsq',limshowsq);
app.use('/ArtWeb/index',test_index);
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

console.log("listening:3000");

module.exports = app;