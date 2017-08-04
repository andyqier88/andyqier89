var express = require('express');
var app = express();
var router = express.Router();
var request = require('request');
var urlmain = require('../../config/url');

/* 微信登陆 */
// 测试号
var AppID = 'wx4c9353e974660e51';
var AppSecret = 'd4624c36b6795d1d99dcf0547af5443d';
// 正式号
var AppID = 'wx89cceffd5e57ccfa';
var AppSecret = '4530c63870302ad4b8301338396fad82';
var url = urlmain.url
router.get('/', function(req, res, next) {
    //console.log("oauth - login")

    // 第一步：用户同意授权，获取code
    //var router = '/commuity' + req.url;
    // 这是编码后的地址
    //var return_uri = url + router;
    //var scope = 'snsapi_base';

    //res.redirect('https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + AppID + '&redirect_uri=' 
    //  + return_uri + '&response_type=code&scope=' 
    //  + scope + '&state=STATE#wechat_redirect');

});

module.exports = router;
