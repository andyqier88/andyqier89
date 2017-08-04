var express = require('express');
var router = express.Router();
var request = require('request');
// var domain = require('../../config/domain');
var sha1 = require('sha1');
var path = require('path');
var crypto = require('crypto');
// var wx_config = require('./index/config')
// var config = {
//  wechat:{
//    appID:'wx4c9353e974660e51',
//    appSecret:'d4624c36b6795d1d99dcf0547af5443d',
//    token:'learnwx'
//  }
//请求外部链接
// router.all('/', function(req, res){
//   var method = req.method.toUpperCase();
//   var proxy_url = domain.domain + '/book/17604305?fields=id,title,url';

//   var options = {
//           headers: {"Connection": "close"},
//           url: proxy_url,
//           method: method,
//           json: true,
//           body: req.body
//   };
//   function callback(error, response, data) {
//       if (!error && response.statusCode == 200) {
//           res.render('art_video', {data:'data'});
//       }
//       else{
//         console.log(error)
//       }
//   }
//   request(options, callback);
// });
module.exports = router;