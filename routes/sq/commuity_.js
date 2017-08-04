var express = require('express');
var app = express();
var router = express.Router();
var request = require('request');
var urlmain = require('../../config/url');
var until = require('../../until/until');
var Wechat = require('../../wechat/wechat');
var path = require('path');
var fs = require('fs');
var Q = require('q');
var AppID = 'wx4c9353e974660e51';
var AppSecret = 'd4624c36b6795d1d99dcf0547af5443d';
//var url = urlmain.url
var unionidpath = path.join(__dirname, '../../config/unionid.txt')
var config = {
    wechat: {
        appID: 'wx4c9353e974660e51',
        appSecret: 'd4624c36b6795d1d99dcf0547af5443d',
        token: 'learnwx'
    }
}
var url = urlmain.url + '/commuity'

//获取授权登陆code ，access_token

// console.log(get_code_url);
// request.get({ url: get_code_url, json: true }, function(error, response, body) {
//     //var data  = response.query;
//     console.log(response.url.code)
//     console.log('response.url')
//         //res.redirect(get_code_url)
//         // router.get('/',function(req,res){
//         //   console.log(req.query)
//         //   res.redirect(url)
//         // })
// })
router.get('/', function(req, res, next) {
    var code_url = "https://open.weixin.qq.com/connect/oauth2/authorize?";
    var redirect_uri = url + req.url;
    var scope = 'snsapi_base';
    var get_code_url = code_url + 'appid=' + config.wechat.appID + '&redirect_uri=' + redirect_uri + '&response_type=code&scope=' 
    + scope + '&state=state' + '#wechat_redirect'
        request.get({ url: get_code_url, json: true }, function(error, response, body) {
        //var data  = response.query;
        console.log(response.url.code)
        //console.log('response.url')
        //res.redirect(get_code_url)
        // router.get('/',function(req,res){
        //   console.log(req.query)
        
        // })
        })
    var code = req.query.code;
    var circleId = req.query.circleId;
    var options = {
        url: 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + AppID + '&secret=' + AppSecret + '&code=' 
        + code + '&grant_type=authorization_code',
        json: true
    }
    request.get(options, function(error, response, body) {
        if (response.statusCode == 200 || response.statusCode == 304) {
            //console.log(JSON.parse(body));
            console.log(response.body)
            var data = body;
            var unionid = data.unionid
            var datastr = JSON.stringify(body)
                // var unionid = data.unionid;
                //console.log(data)
                //console.log (data.unionid)
                // fs.readFile(unionidpath,"utf-8",function(err,data){
                //   if(!err){
                //     var unioniddata = data.unionid;
                //     console.log(unioniddata)
                //   }
                // })
                //console.log(data.unionid);

            res.render('commuity', { circleId, unionid })
        } else {
            console.log(response.statusCode);
        }

    });

//res.redirect(get_code_url)

    //console.log("get_wx_access_token")
    //console.log("code_return: "+req.query.code)
    // 第一步：用户同意授权，获取code
    // var router = '/commuity' + req.url;
    // // 这是编码后的地址
    // var return_uri = url + router;
    // var scope = 'snsapi_base';

    // res.redirect('https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + AppID + '&redirect_uri=' 
    //   + return_uri + '&response_type=code&scope=' 
    //   + scope + '&state=STATE#wechat_redirect');
    // 第二步：通过code换取unionid


});
// router.get('/',function(){
//   var wechatApi = new Wechat(config.wechat)
//   var data = yield wechatApi.fetchAccessToken()
//   //console.log(data)
//   var access_token = data.access_token
// })
module.exports = router;
