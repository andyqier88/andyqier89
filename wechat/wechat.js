"use strict"
var Promise = require('bluebird');
var request = Promise.promisify(require('request'));

var prefix = "https://api.weixin.qq.com/cgi-bin/";
var api = {
	accessToken :prefix + 'token?grant_type=client_credential',
	ticket: prefix + 'ticket/getticket?'
}

function Wechat(ops){
	var that = this;
	this.appID = ops.appID;
	this.appSecret = ops.appSecret;
	this.getAccesstoken = ops.getAccesstoken;
	this.saveAccesstoken = ops.saveAccesstoken;
	this.getTicket = ops.getTicket;
	this.saveTicket = ops.saveTicket;
	
	this.fetchAccessToken()
	// this.getAccesstoken()
	// this.fetchTicket()
		// .then(function(data){
		// 	try{
		// 		data = JSON.parse(data);
		// 		//console.log(data)
		// 	}
		// 	catch(e){
		// 		return that.updateAccessToken()
		// 	}
		// 	if(that.isValidAccessToken(data)){
		// 		//console.log(data)
		// 		return Promise.resolve(data);
		// 	}else{
		// 		return that.updateAccessToken()
		// 	}
		// })
		// .then(function(data){
			
		// 	that.access_token = data.access_token;
		// 	that.expires_in = data.expires_in;
		// 	that.saveAccesstoken(data);
		// })
}
//获取access token
Wechat.prototype.fetchAccessToken = function(data){
	var that = this;

	return this.getAccesstoken()
		.then(function(data){
			try{
				data=JSON.parse(data)

			}
			catch(e){
				return that.updateAccessToken()
			}
			if(that.isValidAccessToken(data)){
				return Promise.resolve(data)
				
			}else{
				return that.updateAccessToken()
			}
		})
		.then(function(data){
			
			that.saveAccesstoken(data)
			return Promise.resolve(data)
		})
}
//更新accesstoken
Wechat.prototype.updateAccessToken = function(){
	var appID = this.appID;
	var appSecret = this.appSecret;
	var url = api.accessToken + '&appid=' + appID + '&secret=' + appSecret;
	return new Promise(function(resolve,reject){
		request({url:url,json:true}).then(function(res){
			var data  = res.body;
			
			var now = (new Date().getTime());
			var expires_in =now + (data.expires_in -20);
			data.expires_in = expires_in;
			resolve(data)
		})
	})
}

//获取票据
Wechat.prototype.fetchTicket = function(access_token){
	var that = this;
	return this.getTicket()
		.then(function(data){
			console.log('data')
			try{
				data=JSON.parse(data)
				
			}
			catch(e){
				return that.updateTicket(access_token)
			}
			if(that.isValidTicket(data)){
				return Promise.resolve(data)
			}else{
				return that.updateTicket(access_token)
			}
		})
		.then(function(data){
			that.saveTicket(data);
			return Promise.resolve(data)
		})
}
//更新票据
Wechat.prototype.updateTicket = function(access_token){
	var url = api.ticket + 'access_token=' + access_token + '&type=jsapi' ;
	console.log(url);
	console.log("更新票据:"+url);
	return new Promise(function(resolve,reject){
		request({url:url,json:true}).then(function(res){
			var data  = res.body;
			var now = (new Date().getTime());
			var expires_in =now + (data.expires_in - 20);
			data.expires_in = expires_in;
			resolve(data)
		})
	})
}

Wechat.prototype.isValidAccessToken = function(data) {
	if(!data|| !data.access_token|| !data.expires_in){
		return false;
	}

	var access_token = data.access_token;
	var expires_in = data.expires_in;
	var now = (new Date().getTime());
	if(now < expires_in){
		return true;
	}else{
		return false
	}
};
//验证ticket
Wechat.prototype.isValidTicket = function(data) {
	if(!data|| !data.ticket|| !data.expires_in){
		return false;
	}

	var ticket = data.ticket;
	var expires_in = data.expires_in;
	var now = (new Date().getTime());
	if(ticket&&now < expires_in){
		return true;
	}else{
		return false
	}
};


module.exports = Wechat;