"use strict"
var sha1 = require('sha1');
var Wechat = require('./wechat');
module.exports = function(ops){
	var wechat = new Wechat(ops);
	return function *(next){
		//console.log(this.query);
		var token = ops.token;
		var signature = this.query.signature;
		var nonce =this.query.nonce;
		var timestamp = this.query.timestamp;
		var echostr = this.query.echostr;
		var str = [token,timestamp,nonce].sort().join('');
		var sha = sha1(str);
		if(sha === signature){
			this.body = echostr +"";
			//console.log("90");
		}else{
			this.body = "wrong";
		}
	}
}