// var Promise = require('bluebird');
// var request = Promise.promisify(require('request'));
// var domain = require('../config/domain');

// function Api(ops){
//   var that = this;
//   this.getCommuity();
// }

// Api.prototype.getCommuity = function(circleId,unionid){
//   var url = domain.domain + '/WebApi/circleDetail?circleId=' + circleId + '&unionid=' + unionid
//   //return new Promise(function(resolve,reject){
//     request({url:url,json:true}).function(res){
//       var data  = res.body;
//       resolve(data)
//     }
//   //})
// }
// module.exports = Api;