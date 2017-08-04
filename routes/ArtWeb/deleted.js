var express = require('express');
var app = express();
var router = express.Router();
var request = require('request');
var urlmain = require('../../config/url');

/* 微信登陆 */
var AppID = 'wx4c9353e974660e51';
var AppSecret = 'd4624c36b6795d1d99dcf0547af5443d';
var url = urlmain.url
router.get('/', function(req, res, next) {
  res.render("deleted",{dele:"艺论被删除"})
});

module.exports = router;