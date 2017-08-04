var config = {
 wechat:{
   appID:'wx4c9353e974660e51',
   appSecret:'d4624c36b6795d1d99dcf0547af5443d',
   token:'learnwx'
 }
 apifixurl : 'https://api.weixin.qq.com/',
 openfixurl:'https://open.weixin.qq.com/'
}
var express = require('express');
var router = express.Router();
var request = require('request');

/* 微信登陆 */
var AppID = 'wx4c9353e974660e51';
var AppSecret = 'd4624c36b6795d1d99dcf0547af5443d';
router.get('/art_video', function(req,res, next){
    //console.log("oauth - login")
    // 第一步：用户同意授权，获取code
    //var router = 'get_wx_access_token';
    // 这是编码后的地址
    var return_uri = 'http://www.uuucai.com.cn:3000/art_video';  
    var scope = 'snsapi_base';
    res.redirect(config.openfixurl + 'connect/oauth2/authorize?appid='+AppID+'&redirect_uri='+return_uri+'&response_type=code&scope='+scope+'&state=STATE#wechat_redirect');
    console.log(return_uri)
});


router.get('/art_video', function(req,res, next){
    //console.log("get_wx_access_token")
    //console.log("code_return: "+req.query.code)
    // 第二步：通过code换取网页授权access_token
    var code = req.query.code;
    request.get(
        {
          url:config.apifixurl+'sns/oauth2/access_token?appid='+AppID+'&secret='+AppSecret+'&code='+code+'&grant_type=authorization_code',
        },
        function(error, response, body){
            if(response.statusCode == 200){
                // 第三步：拉取用户信息(需scope为 snsapi_userinfo)
                //console.log(JSON.parse(body));
                var data = JSON.parse(body);
                var access_token = data.access_token;
                var openid = data.openid;
                request.get(
                    {
                        url:'https://api.weixin.qq.com/sns/userinfo?access_token='+access_token+'&openid='+openid+'&lang=zh_CN',
                    },
                    function(error, response, body){
                        if(response.statusCode == 200){
                          // 第四步：根据获取的用户信息进行对应操作
                          var userinfo = JSON.parse(body);
                          //console.log(JSON.parse(body));
                          console.log('获取微信信息成功！');
                          // 小测试，实际应用中，可以由此创建一个帐户
                          res.send("\
                              <h1>"+userinfo.nickname+" 的个人信息</h1>\
                              <p><img src='"+userinfo.headimgurl+"' /></p>\
                              <p>"+userinfo.city+"，"+userinfo.province+"，"+userinfo.country+"</p>\
                          ");
                        }else{
                          console.log(response.statusCode);
                        }
                    }
                );
            }else{
                console.log(response.statusCode);
            }
        }
    );
});
module.exports = router;