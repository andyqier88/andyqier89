var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var request = require('request');
var apiUrl = require('../../config/apiurl');
var siteUrl = require('../../config/url');
var sha1 = require('sha1');
var path = require('path');
var crypto = require('crypto');
var Promise = require('bluebird');
var co = require('co');
var Q = require('q');
var apiUrl = require('../../config/apiurl');
var urlmain = require('../../config/url');
var until = require('../../until/until');
var Wechat = require('../../wechat/wechat');
var app = express();


var router = express.Router();
var wechat_file = path.join(__dirname, '../../config/wechat.txt');


// 测试号
// var AppID = 'wx4c9353e974660e51';
// var AppSecret = 'd4624c36b6795d1d99dcf0547af5443d';
// 正式号
var AppID = 'wx89cceffd5e57ccfa';
var AppSecret = '4530c63870302ad4b8301338396fad82';
//var url = urlmain.url

var url = urlmain.url + '/auction'
var wechat_file = path.join(__dirname, '../../config/wechat.txt')
var wechat_ticket_file = path.join(__dirname, '../../config/wechat_ticket.txt')

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
    var url = urlmain.url + '/auction' + req.url
    console.log(url)
    var params = sign(ticket, url)
        // 通过code换取网页授权
    var code = req.query.code;
    var arttalkId = req.query.arttalkId;
    var shareUserId = req.query.shareUserId;
    //console.log(req.cookies.unionid)
    //console.log(req.body);
    
 if (!req.session.show_session) {
    request.get({
            url: 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + AppID + '&secret=' + AppSecret + '&code=' + code + '&grant_type=authorization_code',
        },
        function(error, response, body) {
            if (response.statusCode == 200 || response.statusCode == 304) {
                //console.log(JSON.parse(body));https://api.weixin.qq.com/sns/userinfo?https://api.weixin.qq.com/cgi-bin/user/info
                var data = JSON.parse(body);
                var unionid = data.unionid; 
                var access_token_sub = data.access_token;
                var openid = data.openid;
                var refresh_token = data.refresh_token;
                //start 请求微信用户信息
                request.get({ url: 'https://api.weixin.qq.com/cgi-bin/user/info?access_token=' + access_token + '&openid=' + openid + '&lang=zh_CN' },
                        function(error, response, body) {
                            var userMes = JSON.parse(body);
                            console.log('userMes:'+userMes);
                            var auction_session = {
                                subscribe: subscribe,
                                iconUrl: iconUrl,
                                nickName: nickName,
                                gzopenId: gzopenId,
                                gender: gender,
                                unionid: unionid,
                            }
                            var subscribe = userMes.subscribe;
                            var iconUrl = userMes.headimgurl;
                            var nickName = userMes.nickname;
                            var gzopenId = userMes.openid;
                            var gender = userMes.sex;
                            //var unionid = userMes.unionid;
                            console.log('unionid:'+unionid);
                            if (response.statusCode == 200 || response.statusCode == 304) {
                                //start 请求拍卖详情API接口
                                // gzopenId: userMes.openid,
                                // iconUrl: userMes.headimgurl,
                                // nickName: userMes.nickname,
                                // gender: userMes.sex,
                                console.log(unionid);
                                var postUrl = apiUrl.api + '/WebApi/auctionDetail';
                                console.log(postUrl);
                                request.post({
                                            url: postUrl,
                                            form: {
                                                unionid: unionid,
                                                arttalkId: arttalkId,
                                                shareUserId: shareUserId
                                            },
                                            json: true
                                        },
                                        function(error, response, body) {
                                            var dataApi = body;
                                            
                                            console.log(dataApi)
                                            if (dataApi.code == 308) {
                                                res.send("无拍卖数据")
                                                console.log("无拍卖数据")
                                            } else if(dataApi.code == 100) {
                                                var userId = dataApi.data.loginUser;
                                                //req.session.dataApi = dataApi;
                                                var show_session = {
                                                    subscribe: subscribe,
                                                    iconUrl: iconUrl,
                                                    nickName: nickName,
                                                    gzopenId: gzopenId,
                                                    gender: gender,
                                                    unionid: unionid
                                                }
                                                req.session.show_session = show_session;
                                                //console.log('req.session1:'+req.session.auction_session);
                                                // req.session.shareUserId = shareUserId;
                                                // res.cookie("auction", {
                                                //     unionid: unionid,
                                                //     arttalkId: arttalkId,
                                                //     gzopenId: gzopenId,
                                                //     iconUrl: iconUrl,
                                                //     nickName: nickName,
                                                //     gender: gender,
                                                //     shareUserId: shareUserId,
                                                //     userId: userId,
                                                //     subscribe: subscribe,
                                                // }, { path: '/auction', expires: new Date(Date.now() + 7200000), httpOnly: true, sign: true }); 
                                                res.render('auction', { params,access_token, arttalkId, unionid, apiUrl, subscribe, userId, nickName, gzopenId, gender, iconUrl, dataApi });
                                            }else if(dataApi.code == 101){
                                                res.send("系统错误");
                                            }else{
                                                res.send("未知错误");
                                            }
                                        }
                                    ) //end 请求拍卖详情API接口
                            }
                        }) //end 请求微信用户信息
                console.log(data);
            } else {
                console.log(response.statusCode);
            }
        }
    );
} else {
    var unionid= req.session.show_session.unionid;
    var subscribe= req.session.show_session.subscribe;
    var nickName= req.session.show_session.nickName;
    var gzopenId= req.session.show_session.gzopenId;
    var gender= req.session.show_session.gender;
    var userId= req.session.show_session.userId;
    var iconUrl= req.session.show_session.iconUrl;
    console.log('req.session2:'+req.session);
    console.log('req.session2:'+unionid);
    console.log('req.session2:'+arttalkId);
    console.log('req.session2:'+shareUserId);
    var postUrl = apiUrl.api + '/WebApi/auctionDetail'
        // gzopenId: gzopenId,
        // iconUrl: iconUrl,
        // nickName: nickName,
        // gender: gender,
    request.post({
            url: postUrl,
            form: {
                unionid: req.session.show_session.unionid,
                arttalkId: arttalkId,
                shareUserId: shareUserId
            },
            json: true
        },
        function(error, response, body) {
            var dataApi = body;
            console.log(dataApi);
            res.render('auction', { params,access_token, arttalkId, unionid, apiUrl, subscribe, nickName, gzopenId, gender, iconUrl, userId, dataApi });
        }
    )
}
}));

module.exports = router;
