exports.JSONCookies = function(obj){
      var cookies = Object.keys(obj);    //获取obj对象的property
      var key;
      var val;
    
       //循环判断并解析
      for (var i = 0; i < cookies.length; i++) {
        key = cookies[i];
        val = exports.JSONCookie(obj[key]);
    
        //如果是JSON字符序列则保存
        if (val) {
          obj[key] = val;
        }
      }
    
      return obj;
    };
    
   //解析JSON字符序列
    exports.JSONCookie = function(str) {
      if (!str || str.substr(0, 2) !== 'j:') return; //判断是否为JSON字符序列，如果不是返回undefined
    
      try {
        return JSON.parse(str.slice(2));    //解析JSON字符序列
      } catch (err) {
        // no op
      }
    };