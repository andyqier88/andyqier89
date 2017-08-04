var express = require('express');
var router = express.Router();
var sha1 = require('sha1');
var app = express();
var until = require('../until/until');
var Wechat = require('../wechat/wechat');
var urlmain = require('../config/url');
var Koa = require("koa");
var request = require('request');
var Promise = require('bluebird');
var path = require('path');
var crypto = require('crypto');
var co = require('co');
var Q = require('q');
var request = require('request');
var apiUrl = require('../config/apiurl');

app.use(require('express-promise')());

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });
var wechat_file = path.join(__dirname, '../config/wechat.txt')
var wechat_ticket_file = path.join(__dirname, '../config/wechat_ticket.txt')

var config = {
        wechat: {
            appID: 'wx4c9353e974660e51',
            appSecret: 'd4624c36b6795d1d99dcf0547af5443d',
            token: 'learnwx'
        }
    }
    //var datas={}
function asyncCallback(gen) {
    return function() {
        return Q.async(gen).apply(null, arguments).done();
    };
}
router.get('/art_video', asyncCallback(function*(req, res) {
    console.log(req.query)
    var videoId = req.query.id

    //console.log(code)
    // var method = req.method.toUpperCase();
    // var proxy_url = domain.domain + '/book/17604305?fields=id,title,url';
    // //var proxy_url = domain.domain + '/WebApi/videoDetail';

    // var options = {
    //         headers: {"Connection": "close"},
    //         url: proxy_url,
    //         method: method,
    //         json: true,
    //         body: req.body
    // };

    // function callback(error, response, data) {
    //   console.log(response.statusCode)
    //     if (!error && response.statusCode == 200) {
    //       datas.videoData = data
    //       //res.render('art_video', {data:data});
    //     }
    //     else{
    //       console.log(error)
    //     }
    // }

    var config = {
            wechat: {
                appID: 'wx4c9353e974660e51',
                appSecret: 'd4624c36b6795d1d99dcf0547af5443d',
                token: 'learnwx',
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
    var url = urlmain.url + req.url
        //console.log(url)
    var params = sign(ticket, url)
        //console.log(params)


    //datas.params = params
    //console.log(datas)
    res.render('art_video', { params, videoId, author: "艺论官方" })
}))

//app.get('/commuity',function(req,res,next){
//获取code
// var url = urlmain.url+'/commuity'
//   //获取授权登陆code ，access_token
//   var code_url = "https://open.weixin.qq.com/connect/oauth2/authorize?";
//   var redirect_uri = url;
//   var scope = 'snsapi_base';
//   var get_code_url=code_url+'appid='+config.wechat.appID+'&redirect_uri='+redirect_uri+'&response_type=code&scope='+scope+'#wechat_redirect'
//   console.log(get_code_url);
//   request.get({url:get_code_url,json:true},function(error, response, body){
//       //var data  = response.query;
//       console.log(response.url)
//       console.log('response.url')
//       //res.redirect(get_code_url)
//       res.redirect(200,get_code_url)
//   })

//var code = req.query.code
//console.log(code)
//获取access_token
// var token_url = 'https://api.weixin.qq.com/sns/oauth2/access_token?';
// var secret = config.wechat.appSecret;
// //var get_token_url = token_url + 'appid='+ config.wechat.appID+ '&secret='+secret +'&code='+code+'&grant_type=authorization_code'

// request.get({url:get_token_url,json:true},function(error, response, body){
//   //var jsondata = JSON.parse(body); 
//   console.log(body.unionid)
//   console.log(body.scope)
// })

//})
//app.use(config.wechat);
router.get('/', function(req, res, next) {
    //console.log(req.query);
    var token = config.wechat.token;
    var signature = req.query.signature;
    var nonce = req.query.nonce;
    var timestamp = req.query.timestamp;
    var echostr = req.query.echostr;
    var str = [token, timestamp, nonce].sort().join('');
    var sha = sha1(str);
    if (sha === signature) {
        //res.send(echostr);
    } else {
        res.send("Error:此链接禁止访问");
    }
});
module.exports = router;
