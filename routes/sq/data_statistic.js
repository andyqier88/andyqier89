 var express = require('express');
 var router = express.Router();
 var request = require('request');
 var apiUrl = require('../../config/apiurl');
 var siteUrl = require('../../config/url');
 var sha1 = require('sha1');
 var path = require('path');
 var crypto = require('crypto');
 var Promise = require('bluebird');
 var co = require('co');
 var Q = require('q');
 var urlmain = require('../../config/url');
 var until = require('../../until/until');
 var Wechat = require('../../wechat/wechat');
 var urlencode = require('urlencode');
 var app = express();
 var cookieParser = require('cookie-parser')
 var wechat_file = path.join(__dirname, '../../config/wechat.txt')
 app.use(cookieParser())
 // 测试号
// var AppID = 'wx4c9353e974660e51';
// var AppSecret = 'd4624c36b6795d1d99dcf0547af5443d';
// 正式号
var AppID = 'wx89cceffd5e57ccfa';
var AppSecret = '4530c63870302ad4b8301338396fad82';
 //var url = urlmain.url

 var url = urlmain.url + '/data_statistic'
 var wechat_file = path.join(__dirname, '../../config/wechat.txt')
 var wechat_ticket_file = path.join(__dirname, '../../config/wechat_ticket.txt')
 var gbk = require('gbk');

 function asyncCallback(gen) {
     return function() {
         return Q.async(gen).apply(null, arguments).done();
     };
 }
 router.get('/', asyncCallback(function*(req, res, next) {
     var config = {
             wechat: {
                //测试号
                // appID: 'wx4c9353e974660e51',
                // appSecret: 'd4624c36b6795d1d99dcf0547af5443d',
                // token: 'learnwx',
                // 正式号
                appID: 'wx89cceffd5e57ccfa',
                appSecret: '4530c63870302ad4b8301338396fad82',
                token: 'beijingyibingding',
                 getAccesstoken: function() {
                     return until.readFileAsync(wechat_file)
                 },
                 saveAccesstoken: function(data) {
                     data = JSON.stringify(data);
                     return until.writeFileAsync(wechat_file, data)
                 },
                 getTicket: function() {
                     return until.readFileAsync(wechat_ticket_file)
                 },
                 saveTicket: function(data) {
                     data = JSON.stringify(data);
                     return until.writeFileAsync(wechat_ticket_file, data)
                 },
                 getunionid: function() {
                     return until.readFileAsync(unionid)
                 },
                 saveunionid: function(data) {
                     data = JSON.stringify(data);
                     return until.writeFileAsync(unionid, data)
                 }
             }
         }
         //生成字符串
     var createNonce = function() {
             return Math.random().toString(36).substr(2, 15)
         }
         //生成时间戳
     var createTimeStamp = function() {
         return parseInt(new Date().getTime() / 1000, 10) + ''
     }
     var _sign = function(noncestr, ticket, timestamp, url) {
         var params = [
             'noncestr=' + noncestr,
             'jsapi_ticket=' + ticket,
             'timestamp=' + timestamp,
             'url=' + url
         ]
         var str = params.sort().join('&')
         var shasum = crypto.createHash('sha1')
         shasum.update(str)
         return shasum.digest('hex')
     }

     function sign(ticket, url) {
         var noncestr = createNonce()
         var timestamp = createTimeStamp()
         var signature = _sign(noncestr, ticket, timestamp, url);
         //console.log(ticket)
         //console.log(url)
         return {
             noncestr: noncestr,
             timestamp: timestamp,
             signature: signature
         }
     }
     //获取jsapiTicket票据
     var wechatApi = new Wechat(config.wechat)
     var data = yield wechatApi.fetchAccessToken()
     console.log(data)
     var access_token = data.access_token
         //console.log(access_token)
     var ticketData = yield wechatApi.fetchTicket(access_token)
     var ticket = ticketData.ticket
         //console.log(ticket)
         //console.log(ticketData)
     var url = urlmain.url + '/data_statistic' + req.url
     console.log(url)
     var params = sign(ticket, url)
         // 通过code换取网页授权
     var arttalkId = req.query.arttalkId;
     var shareUserId = req.query.shareUserId;
     //console.log(req.cookies.unionid)
     console.log(req.body);
     //var userId = req.cookies.userId.loginUser;
     var userId = req.query.userId;
     var getUrl = apiUrl.api + '/WebApi/ratingStatistical?userId=' + userId + "&arttalkId=" + arttalkId
     console.log(getUrl);
     // var decodeUrl = urldecode(postUrl);
     //-?unionid=' + unionid + '&arttalkId=' + arttalkId + '&gzopenId=' +userMes.openid + '&iconUrl=' + userMes.headimgurl + '&nickName=' + userMes.nickname + '&gender=' + userMes.sex + '&shareUserId=' + shareUserId;
     request.get({
             url: getUrl,
             json: true
         },
         function(error, response, body) {
             var dataApi = body;
             console.log(dataApi)
                 //console.log(userMes.nickname);
             res.render('data_statistic', { params, arttalkId,userId,dataApi });
         }
     )
     //res.render('data_statistic', { params });
 }));

 module.exports = router;