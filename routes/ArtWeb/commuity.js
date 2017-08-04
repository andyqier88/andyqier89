var express = require('express');
var sha1 = require('sha1');
var app = express();
var until = require('../../until/until');
var Wechat = require('../../wechat/wechat');
var urlmain = require('../../config/url');
var session = require('express-session');
var Koa = require("koa");
var request = require('request');
var Promise = require('bluebird');
var path = require('path');
var crypto = require('crypto');
var co = require('co');
var Q = require('q');
var apiUrl = require('../../config/apiurl');

var cookieParser = require('cookie-parser')
var wechat_file = path.join(__dirname, '../../config/wechat.txt')
app.use(cookieParser())
app.use(cookieParser('commuity'));
app.use(session({
    secret: 'commuity',
    name: "commuity", //这里的name值得是cookie的name，默认cookie的name是：connect.sid
    cookie: { path: '/commuity', expires: new Date(Date.now() + 36000000000), httpOnly: true }, //设置maxAge是80000ms，即80s后session和相应的cookie失效过期
    resave: true,
    saveUninitialized: true
}));
var urlencode = require('urlencode');
var router = express.Router();
// var cookie = require('cookie');
// var parse = require('../config/parse');
// 测试号
// var AppID = 'wx4c9353e974660e51';
// var AppSecret = 'd4624c36b6795d1d99dcf0547af5443d';
// 正式号
var AppID = 'wx89cceffd5e57ccfa';
var AppSecret = '4530c63870302ad4b8301338396fad82';
//var url = urlmain.url
var rp = require('request-promise');
var wechat_file = path.join(__dirname, '../../config/wechat.txt')
var wechat_ticket_file = path.join(__dirname, '../../config/wechat_ticket.txt')

function asyncCallback(gen) {
    return function() {
        return Q.async(gen).apply(null, arguments).done();
    };
}
router.all('/', asyncCallback(function*(req, res, next) {
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
        //console.log(data)
    var access_token = data.access_token
        //console.log(access_token)
    var ticketData = yield wechatApi.fetchTicket(access_token)
    var ticket = ticketData.ticket
        //console.log(ticket)
        //console.log(ticketData)
    var url = urlmain.url + '/commuity' + req.url
    console.log(url)
    console.log("quanzi")
    var params = sign(ticket, url)
        // 通过code换取网页授权
    var code = req.query.code;
    var circleId = req.query.circleId;
    var shareUserId = req.query.shareUserId;
    console.log(req.query)
    console.log(req.url)
    console.log(url)
    if (!req.session.commuity_session) {
        request.get({
                url: 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + AppID + '&secret=' + AppSecret + '&code=' + code + '&grant_type=authorization_code',
            },
            function(error, response, body) {
                if (response.statusCode == 200 || response.statusCode == 304) {
                    //console.log(JSON.parse(body));
                    var data = JSON.parse(body);
                    var unionid = data.unionid;
                    var access_token = data.access_token;
                    var openid = data.openid;
                    request.get({ url: 'https://api.weixin.qq.com/sns/userinfo?access_token=' + access_token + '&openid=' + openid + '&lang=zh_CN', json: true },
                        function(error, response, body) {
                            var userMes = body;
                            console.log(userMes);
                            if (response.statusCode == 200 || response.statusCode == 304) {
                                // res.cookie("userMes", {
                                //     unionid: unionid,
                                //     circleId: circleId,
                                //     gzopenId: userMes.openid,
                                //     iconUrl: userMes.headimgurl,
                                //     nickName: userMes.nickname,
                                //     gender: userMes.sex,
                                //     shareUserId: shareUserId
                                // }, { path: '/commuity', expires: new Date(Date.now() + 6000000), httpOnly: true, sign: true })
                                var iconUrl = userMes.headimgurl;
                                var nickName = userMes.nickname;
                                var gzopenId = userMes.openid;
                                var gender = userMes.sex;
                                var unionid = userMes.unionid;
                                var commuity_session = {
                                    iconUrl: iconUrl,
                                    nickName: nickName,
                                    gzopenId: gzopenId,
                                    gender: gender,
                                    unionid: unionid
                                }
                                req.session.commuity_session = commuity_session;
                                request.post({
                                        url: apiUrl.api + '/WebApi/circleDetail',
                                        form: {
                                            unionid: unionid,
                                            circleId: circleId,
                                            gzopenId: userMes.openid,
                                            iconUrl: userMes.headimgurl,
                                            nickName: userMes.nickname,
                                            gender: userMes.sex,
                                            shareUserId: shareUserId
                                        },
                                        json: true
                                    },
                                    function(error, response, body) {
                                        var dataApi = body;
                                        console.log(dataApi)
                                        if(dataApi.code == 100){
                                            res.render('commuity', { params, circleId, unionid, dataApi });
                                        }else if(dataApi.code == 202){
                                            res.send("作品已被删除")
                                        }else{
                                            res.send("系统错误")
                                        }
                                    }
                                )
                            }
                        })
                } else {
                    console.log(response.statusCode);
                }
            }
        );
    } else {
        var unionid = req.session.commuity_session.unionid;
        var nickName = req.session.commuity_session.nickName;
        var gzopenId = req.session.commuity_session.gzopenId;
        var gender = req.session.commuity_session.gender;
        var userId = req.session.commuity_session.userId;
        var iconUrl = req.session.commuity_session.iconUrl;
        console.log(req.cookies);
        console.log(req.cookies.userMes);
        request.post({
                url: apiUrl.api + '/WebApi/circleDetail',
                form: {
                    unionid: unionid,
                    circleId: circleId,
                    gzopenId: gzopenId,
                    iconUrl: iconUrl,
                    nickName: nickName,
                    gender: gender,
                    shareUserId: shareUserId
                },
                json: true
            },
            function(error, response, body) {
                var dataApi = body;
                console.log(dataApi)
                res.render('commuity', { params, circleId, unionid, dataApi });
            }
        )
    }
}));
module.exports = router;
