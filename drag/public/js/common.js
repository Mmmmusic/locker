// 请求

// 预发布
var ajaxRoot = '';

var ajaxUrl = {

  // 0 GET 1 POST

};

$("input").on("blur",function(){
  setTimeout(function () {
    $('html,body').scrollTop(0);
  },0);
});
$("input").on("focus",function(){
  var scrollHeight = $(this).offset().top/2;
  setTimeout(function () {
    $('html,body').scrollTop(scrollHeight);    
  },0);
});

function setCookie(val,key,exdays){
  var d = new Date();
  d.setTime(d.getTime()+(exdays*24*60*60*1000));
  var expires = "expires="+d.toGMTString()+";Path="+escape("/");
  document.cookie = key+"="+val+"; "+expires;
}
function getCookie(key){
  var name = key + "=";
  var ca = document.cookie.split(';');
  for(var i=0; i<ca.length; i++) {
      var c = ca[i].trim();
      if (c.indexOf(name)==0) { return c.substring(name.length,c.length); }
  }
  return "";
}
function delCookie(key){ 
  var date = new Date();
  date.setTime(date.getTime()-10000);
  document.cookie = key+"=v;expires="+date.toGMTString()+";Path="+escape("/");
}

// 微信回调
function weChatCallback(){
  if(!localStorage.getItem('weChatId')){
    var wechat_hdf = getParams('channelName');
    if(wechat_hdf && wechat_hdf=='wechat_hdf'){
      saveUserMsg(window.location.href,'callBackParams');
    }
    // 获取code
    var urlCode = getParams('code');
    if(urlCode == '' || urlCode == undefined || urlCode == null){
      var callback = encodeURI(window.location.href);
      // 预发布
      window.location.href = 'http://open.weixin.qq.com/connect/oauth2/authorize?appid=wx4946053af3726675&redirect_uri='+callback+'&response_type=code&scope=snsapi_base#wechat_redirect';
    }
    // 获取weChatId
    if(urlCode != '' || urlCode != undefined || urlCode != null){
      var token = getToken(token);
      if(urlCode){
        $.ajax({
          type:'POST',
          url:ajaxUrl.weChatVerify,
          data:{
            code:urlCode
          },
          headers:{
            'version': '2.0',
            'access-token':token,
            'signature': getSignature(),
            'client': getClient(),
          },
          success:function(res){
            console.log(res);
            if(res.code == 200){
              var weChatId = res.data.weChatId;
              saveUserInfo(weChatId,'weChatId');
            }
          },
          error:function(err){
            console.log(err);
          }
        });
      }
    } 
  }
}

hideAllNonBaseMenuItem();

function hideAllNonBaseMenuItem(status){
  // 功能开关
  var token = getToken(token);
  // 获取sdk
  $.ajax({
    type:'POST',
    url:ajaxUrl.getSdk,
    data:JSON.stringify({
      url:window.location.href,
    }),
    headers:{
      'version': '2.0',
      'access-token':token,
      'signature': getSignature(),
      'client': getClient(),
      "Content-Type": "application/json;charset=utf-8",
    },
    success:function(res){
      console.log(res);
      if(res.code == 200){
        var info = res.data;
        wx.config({
          debug: false,
          appId: info.appId,
          timestamp:info.timestamp,
          nonceStr: info.nonceStr,
          signature: info.signature,
          jsApiList: ['hideOptionMenu,showOptionMenu']
        });
        wx.ready(function(){
          if(status){
            wx.showOptionMenu();
          }else{
            wx.hideOptionMenu();
          }
        });
      }
    }
  });
}

// var _mtac = {};
// (function() {
//   var mta = document.createElement("script");
//   mta.src = "//pingjs.qq.com/h5/stats.js?v2.0.4";
//   mta.setAttribute("name", "MTAH5");
//   mta.setAttribute("sid", "500670235");
//   mta.setAttribute("cid", "500670816");
//   var s = document.getElementsByTagName("script")[0];
//   s.parentNode.insertBefore(mta, s);
// })();

// if(console.log){
//   console.log = function(){};
// }

var MtaH5 = {
  clickStat:function(){},
};

// 正则
var regular = {
  passwordVerify:/^(?![0-9]+$)(?![a-zA-Z]+$)(?!([^(0-9a-zA-Z)]|[\\(\\)])+$)([^(0-9a-zA-Z)]|[\\(\\)]|[a-zA-Z]|[0-9]){6,12}$/,
};

// 随机数
function randomNum(a,b){
  return Math.floor(Math.random() * (b - a) + 1) + a;
}

// 键盘弹起
function userKeyUp(name){
  var h = window.innerHeight;
  window.addEventListener("resize",function(){
    if(window.innerHeight < h){
      $(name).hide();
    }else{
      $(name).show();
    }
  });
}

// 时间格式化
Date.prototype.Format = function (fmt) { //author: test
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  // var s = new Date().Format("yyyy-MM-dd hh:mm:ss");
  return fmt;
};

// 时间戳
function getTimer(time) {     
  var t = new Date(time).toLocaleString().split(' ')[0]; 
  return t; 
};     

// 百度转高德坐标
function bd_decrypt(bd_lng, bd_lat) {
  var X_PI = Math.PI * 3000.0 / 180.0;
  var x = bd_lng - 0.0065;
  var y = bd_lat - 0.006;
  var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * X_PI);
  var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * X_PI);
  var gg_lng = z * Math.cos(theta);
  var gg_lat = z * Math.sin(theta);
  return {lng: gg_lng, lat: gg_lat}
}

// 高德转百度
function bd_encrypt(gg_lng, gg_lat) {
  var X_PI = Math.PI * 3000.0 / 180.0;
  var x = gg_lng, y = gg_lat;
  var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * X_PI);
  var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * X_PI);
  var bd_lng = z * Math.cos(theta) + 0.0065;
  var bd_lat = z * Math.sin(theta) + 0.006;
  return {lng: bd_lng,lat: bd_lat,};
}

// 计算两点之间距离
function Rad(d){
  return d * Math.PI / 180.0;//经纬度转换成三角函数中度分表形式。
}

//计算两点距离，参数分别为第一点的纬度，经度；第二点的纬度，经度
function GetDistance(lat1,lng1,lat2,lng2){
  var radLat1 = Rad(lat1);
  var radLat2 = Rad(lat2);
  var a = radLat1 - radLat2;
  var  b = Rad(lng1) - Rad(lng2);
  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) +
  Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
  s = s *6378.137 ;// EARTH_RADIUS;
  s = Math.round(s * 10000) / 10000 ; //输出为公里
  s = Math.floor(s * 100) / 100 ; //保留两位小数
  return s;
}

// url
function getUrl(url){
  var arr = url.split("?")[1].split("&");
  var obj = {};
  for(var i = 0;i < arr.length;i++){
    var key = arr[i].split("=")[0];
    var val = arr[i].split("=")[1];
    obj[key] = val;
  }
  return obj;
}

// params
function getParams(key) {
  var url = location.search.replace(/^\?/, '').split('&');
  var paramsObj = {};
  for (var i = 0, iLen = url.length; i < iLen; i++) {
      var param = url[i].split('=');
      paramsObj[param[0]] = param[1];
  }
  if (key) {
      return paramsObj[key] || '';
  }
  return paramsObj;
}

// 数组去除空元素
function trimSpace(array){  
  for(var i = 0 ;i<array.length;i++)  
  {  
    if(array[i] == " " || array[i] == null || typeof(array[i]) == "undefined")  
    {  
      array.splice(i,1);  
      i = i-1;  
    }  
  }  
  return array;  
}

// 存localStorage
function saveUserInfo(val,name){
  // 先将localStorage中的值读取,如果没有则是空数组
  var UserInfo = localStorage.getItem(name);
  UserInfo = UserInfo ? JSON.parse(UserInfo) : [];
  UserInfo.pop();
  // 将参数添加到UserInfo中
  UserInfo.push(val);
  // 再将UserInfo转换为JSON字符串存到localStorage覆盖原本UserInfo
  localStorage.setItem(name,JSON.stringify(UserInfo));
}

// 存sessionStorage 加密
function saveUserMsg(val, name) {
  var newval = val;
  if (typeof (val) == 'string'){
    var c = String.fromCharCode(val.charCodeAt(0) + val.length);
    for (var i = 1; i < val.length; i++) {
      c += String.fromCharCode(val.charCodeAt(i) + val.charCodeAt(i - 1));
    }
    newval = escape(c);
  }
  // 先将sessionStorage中的值读取,如果没有则是空数组
  var UserMsg = sessionStorage.getItem(name);
  UserMsg = UserMsg ? JSON.parse(UserMsg) : [];
  UserMsg.pop();
  // 将参数添加到UserMsg中
  UserMsg.push(newval);
  // 再将UserMsg转换为JSON字符串存到sessionStorage覆盖原本UserMsg
  sessionStorage.setItem(name, JSON.stringify(UserMsg));
}

// 取sessionStorage   解密
function getUserMsg(name) {
  if(JSON.parse(sessionStorage.getItem(name))){
    var val = JSON.parse(sessionStorage.getItem(name))[0];
    if(typeof(val) == 'number'){
      c = val;
    }else{
      val = unescape(val);
      var c = String.fromCharCode(val.charCodeAt(0) - val.length);
      for (var i = 1; i < val.length; i++) {
        c += String.fromCharCode(val.charCodeAt(i) - c.charCodeAt(i - 1));
      }
    }
    return c;
  }
}

// 存sessionStorage
function saveSession(val, name) {
  // 先将sessionStorage中的值读取,如果没有则是空数组
  var Session = sessionStorage.getItem(name);
  Session = Session ? JSON.parse(Session) : [];
  Session.pop();
  // 将参数添加到Session中
  Session.push(val);
  // 再将Session转换为JSON字符串存到sessionStorage覆盖原本Session
  sessionStorage.setItem(name, JSON.stringify(Session));
}

// 取sessionStorage
function getSession(name) {
  var val;
  if (JSON.parse(sessionStorage.getItem(name))) {
    var val = JSON.parse(sessionStorage.getItem(name))[0];
    return val;
  }
}

// saveUserInfo(a,"token");

function getToken(token){
  var token = localStorage.getItem("accessToken");
  token = token ? JSON.parse(token)[0].accessToken : '';
  if(getCookie('accessToken')){
    var token = getCookie('accessToken');
    getCookie("perfection") == 'true' ? saveUserInfo(true,"perfection") : saveUserInfo(false,"perfection"); 
    getCookie("certification") == 'true' ? saveUserInfo(true,"certification") : saveUserInfo(false,"certification"); 
    // 本地存儲
    saveUserInfo({'accessToken':getCookie("accessToken")},"accessToken");
    saveUserInfo(getCookie("cardType"),"cardType");
    saveUserInfo(getCookie("mobile"),"mobile");
    saveUserInfo(getCookie("portrait"),"portrait");
  }
  return token;
}

// 调试
if(getParams('channelType') == 'debug'){
  $('head').append('<script src="../../public/js/vConsole.js"></script>');
}else if(getParams('channelType') == 'debugT'){
  $('head').append('<script src="../../../public/js/vConsole.js"></script>');
}

// WGS84转GCj02
function wgs84togcj02(lng, lat) {
  var lat = +lat;
  var lng = +lng;
  var dlat = transformlat(lng - 105.0, lat - 35.0);
  var dlng = transformlng(lng - 105.0, lat - 35.0);
  var radlat = lat / 180.0 * PI;
  var magic = Math.sin(radlat);
  magic = 1 - ee * magic * magic;
  var sqrtmagic = Math.sqrt(magic);
  dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
  dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
  var mglat = lat + dlat;
  var mglng = lng + dlng;
  return [mglng, mglat];
};
// GCj02转BD09
function gcj02tobd09(lng, lat) {
  var lat = +lat;
  var lng = +lng;
  var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_PI);
  var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_PI);
  var bd_lng = z * Math.cos(theta) + 0.0065;
  var bd_lat = z * Math.sin(theta) + 0.006;
  return [bd_lng, bd_lat];
};

// 状态提示
function tip(val){
  if($(".notice-mask,.err-notice")){
    $(".notice-mask,.err-notice").remove();
  }
  var parentNode = document.createElement('div');
  $(parentNode).attr('class','notice-mask');
  $("body").append(parentNode);
  var childNode = document.createElement('div');
  $(childNode).attr('class','err-notice');
  $(parentNode).append(childNode);
  var timer;
  if(val.length > 10){
    $(".err-notice").css({
      position:'absolute',
      width:'4rem',
      left:'50%',
      top:'50%',
      transform:'translate(-50%,-50%)',
      lineHeight:'0.4rem',
      backgroundColor:'rgba(0,0,0,.6)',
      fontSize:'0.32rem',
      letterSpacing:0,
      textAlign:'center',
      color:'#ffffff',
      borderRadius:'0.1rem',
      display:'none',
      padding:'0.24rem',
      wordBreak:'break-all'
    });
  }else{
    $(".err-notice").css({
      position:'absolute',
      left:'50%',
      top:'50%',
      transform:'translate(-50%,-50%)',
      lineHeight:'0.4rem',
      backgroundColor:'rgba(0,0,0,.6)',
      fontSize:'0.32rem',
      letterSpacing:0,
      textAlign:'center',
      color:'#ffffff',
      borderRadius:'0.1rem',
      display:'none',
      padding:'0.24rem',
      wordBreak:'break-all'
    });
  }
  $(".notice-mask").css({
    position:'fixed',
    top:0,
    right:0,
    bottom:0,
    left:0,
    backgroundColor:'transparent',
    zIndex:99999,
    display:'none',
  });
  clearTimeout(timer);
  $(".notice-mask").fadeIn(300);
  $(".err-notice").fadeIn(500).html(val);
  timer = setTimeout(function(){
    $(".notice-mask").fadeOut(300);
    $(".err-notice").fadeOut(500);
  },1500);
}

// 加载
// 如果是二级文件夹,layer可传
function loading(status,layer){
  if($(".notice-mask,.err-notice")){
    $(".notice-mask,.err-notice").remove();
  }
  var parentNode = document.createElement('div');
  $(parentNode).attr('class','notice-mask');
  $("body").append(parentNode);
  var childNode = document.createElement('div');
  $(childNode).attr('class','err-notice');
  $(parentNode).append(childNode);
  var aniNode = document.createElement('img');
  if(!layer){
    $(aniNode).attr({
      class:'ani-load',
      src:'../../public/images/appointment/load.png',
    });
    $(childNode).append(aniNode);
  }else{
    $(aniNode).attr({
      class:'ani-load',
      src:'../../../public/images/appointment/load.png',
    });
    $(childNode).append(aniNode);
  };

  $(".err-notice").css({
    position:'absolute',
    left:'50%',
    top:'50%',
    transform:'translate(-50%,-50%)',
    width:'0.8rem',
    height:'0.8rem',
    backgroundColor:'rgba(0,0,0,.6)',
    borderRadius:'0.16rem',
    display:status,
    padding:'0.14rem',
    display:'flex',
    justifyContent:'center'
  });
  $(".notice-mask").css({
    position:'fixed',
    top:0,
    right:0,
    bottom:0,
    left:0,
    backgroundColor:'rgba(0,0,0,.06)',
    zIndex:99999,
    display:status,
  });
  $(".ani-load").css({
    width:'100%',
    height:'100%',
    animation: 'loading 1s steps(12,end) infinite',
  });
};

function transformation(str) { 
  var RexStr = /\<|\>|\"|\'|\&/g;
  str = str.replace(RexStr, function(MatchStr) { 
    switch (MatchStr) { 
    case "<": 
      return "&lt;"; 
      break; 
    case ">": 
      return "&gt;"; 
      break; 
    case "\"": 
      return ""; 
      break; 
    case "&": 
      return "&"; 
      break; 
    default: 
      break; 
    } 
  });
  return str; 
};

// 禁止改变字体大小
;(function() {
  if (typeof WeixinJSBridge == "object" && typeof WeixinJSBridge.invoke == "function") {
    handleFontSize();
  } else {
    if (document.addEventListener) {
      document.addEventListener("WeixinJSBridgeReady", handleFontSize, false);
    } else if (document.attachEvent) {
      document.attachEvent("WeixinJSBridgeReady", handleFontSize);
      document.attachEvent("onWeixinJSBridgeReady", handleFontSize);
    }
  }
  function handleFontSize() {
    WeixinJSBridge.invoke('setFontSizeCallback', { 'fontSize' : 0 });
    WeixinJSBridge.on('menu:setfont', function() {
      WeixinJSBridge.invoke('setFontSizeCallback', { 'fontSize' : 0 });
    });
  }
})();

$("head").append("<meta name='referrer' content='origin' />");

function encodeData(data) {
  var publicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCXvSMcKoqxOdpWt/XWJdOWJtsWtuQh6/mPoFOC\nnp0cbcytIF9iDWT3h+kNIsDTWIsL6hiDZx8V6eYe0nDY5jjI9LgNPmL+whNCLa80m6yergMS4/iv\nV2ymvbfWP+Arko9w/+u2hNJN6Puzw+UQki+yQeAUeA3VIgOZVr7J36F5HQIDAQAB';
  // 精准预约
  if(getUserMsg('clientId')){
    var publicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCiO7+eXB2b26FlOUlbCe3pD+drPnaTOEKZyRnI\nWDAPrqwlCR6sAhrz8s/06ab6g0T36xLXp9sNBnUDetGnZqAcXEpVMKgXDv68tGuT7HFZ9y2h7zkc\nd02VtdcTPTVTLXUH3XjSQKx6fDDp1Q1vejNVy6QyL1WINee4wbhc/sQTKwIDAQAB';
  }else if(getUserMsg('shrelease')){
    publicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCCoMhnRlOpHL/25gjmmGd6eceQ6vARLRm/HvXh\nva29fs1OhyLGKYC3L3dQujOM5m+875l4fpTDHjFuUjSJUkXJclP457Iwj0ZnFo9DtjP27Qlo+a9K\nxD0pzR9pbHkn7y74R2M8tzz6O+/PbVw1HlFvSD0g3yX/a3Z+eBtvPhMw1QIDAQAB';
  }
  var privateKey = 'MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBALXHHRaHLf5sOhxZI1FjKochCloBC4u/szUZcePMyZe3FvPVSkrUKVKDYtum1Cr7yx3ZSEX3Iw4rZbmoZLugLOOEGQeaTFhEJiLE4UpnnnHzHxS8IssEef9+dK0t0OHa3+bFhYQY96+7FnA4fm0Rod+3LF+C9HbHYTmCpu9Bxk6NAgMBAAECgYB6mU1kCU4a/5F91xy74p8nPkCGDZhk66kJUhz/H/qDCahAUgVmTIuGLDj7nhwQ1XvbqNVW4uTQxLI6MnmmFdTPhZIZTTqenXH04+I8PK5I5tgGuPGNXs4u1oiW3lQKyBtRMzycuoXF0X0pQaYzkxViAaTlqpWXhJO/6dEHij+MPQJBAO9qP403YK9YNySWJzgsXxGI6niJ9rX5OBb9KYfK7TfnvE/xiEi1xS0jNv2GgJ3h/9pVsGXMKxXIkQMFCE/m2M8CQQDCXrwZ0vufnrjCI73OtwnJlgpJwf69lE4NQ5nHeJK8/DldLbmkbD18E7MAoDHyBVt1OCyhHVNX98RddK8fYMHjAkEAm2aAp735QPdmm5XnERwj/TK81s7eV5HTqYBb86txPKdrYQyq5F8wBDNmXzttwo1OUD7sh7b1hGcyUR50HcD+mwJAFzjmVFeGxJ1cCaXniYkI3FLWy9UnsFLFuIP5HYHkVjv0RpOt+F0OQ4K/AjYhgX7uXGTnwCAW0w3BIkFMov0WbQJATkZX+600O1HnbmQKIlJW4u9nlVemN2KYyBNTwJFDdih1Grw7IUGvWBgjD0WaTn+A0+/wqy48JsFWCajl9X/6uA==';

  var result = '';

  var encrypt = new JSEncrypt();
  encrypt.setPublicKey(publicKey);

  result = encrypt.encryptLong(data);

  // console.log('解密',result);

  return result || data;           //正式环境需要加密
  return data; //测试环境
}

function decodeData(data) {
  var publicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCXvSMcKoqxOdpWt/XWJdOWJtsWtuQh6/mPoFOC\nnp0cbcytIF9iDWT3h+kNIsDTWIsL6hiDZx8V6eYe0nDY5jjI9LgNPmL+whNCLa80m6yergMS4/iv\nV2ymvbfWP+Arko9w/+u2hNJN6Puzw+UQki+yQeAUeA3VIgOZVr7J36F5HQIDAQAB';
  var privateKey = 'MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBALXHHRaHLf5sOhxZI1FjKochCloBC4u/szUZcePMyZe3FvPVSkrUKVKDYtum1Cr7yx3ZSEX3Iw4rZbmoZLugLOOEGQeaTFhEJiLE4UpnnnHzHxS8IssEef9+dK0t0OHa3+bFhYQY96+7FnA4fm0Rod+3LF+C9HbHYTmCpu9Bxk6NAgMBAAECgYB6mU1kCU4a/5F91xy74p8nPkCGDZhk66kJUhz/H/qDCahAUgVmTIuGLDj7nhwQ1XvbqNVW4uTQxLI6MnmmFdTPhZIZTTqenXH04+I8PK5I5tgGuPGNXs4u1oiW3lQKyBtRMzycuoXF0X0pQaYzkxViAaTlqpWXhJO/6dEHij+MPQJBAO9qP403YK9YNySWJzgsXxGI6niJ9rX5OBb9KYfK7TfnvE/xiEi1xS0jNv2GgJ3h/9pVsGXMKxXIkQMFCE/m2M8CQQDCXrwZ0vufnrjCI73OtwnJlgpJwf69lE4NQ5nHeJK8/DldLbmkbD18E7MAoDHyBVt1OCyhHVNX98RddK8fYMHjAkEAm2aAp735QPdmm5XnERwj/TK81s7eV5HTqYBb86txPKdrYQyq5F8wBDNmXzttwo1OUD7sh7b1hGcyUR50HcD+mwJAFzjmVFeGxJ1cCaXniYkI3FLWy9UnsFLFuIP5HYHkVjv0RpOt+F0OQ4K/AjYhgX7uXGTnwCAW0w3BIkFMov0WbQJATkZX+600O1HnbmQKIlJW4u9nlVemN2KYyBNTwJFDdih1Grw7IUGvWBgjD0WaTn+A0+/wqy48JsFWCajl9X/6uA==';
  if(getParams('sign')){
    var privateKey = 'MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAKI7v55cHZvboWU5SVsJ7ekP52s+dpM4QpnJGchYMA+urCUJHqwCGvPyz/TppvqDRPfrEten2w0GdQN60admoBxcSlUwqBcO/ry0a5PscVn3LaHvORx3TZW11xM9NVMtdQfdeNJArHp8MOnVDW96M1XLpDIvVYg157jBuFz+xBMrAgMBAAECgYBjvP3iOtmNL2q7E4wQpzsXtMpeeWlmuwjfCO6L6AOsMIPuxPuRXj35ykalWFxq2Pc2v9O2t6CJEnYv7HsmQoadzO5jDGV3jHWuC3L9kljYMbmgJFTQVpqePWf7/pWokn0mmOKGBLZhqvq2BEx3YVNMf/+L1Dm65fEvQO70wkEEUQJBAOLVh2oi1CmRG16gAiHYwpRBz8SFI4aA2YIJ+NL4mgk8lK3Ubq7coxtnIkCkhFQBK0k480Uio6QaTBuvOmCk9gMCQQC3F9Khke/8enFMvaeTi1cdRbCK+2j3vqS7OWG2pMCp1fjjbYZSv4QcC1aAYtIq39deT2RTy4XBFJKf1UPT2Bm5AkAv9vr1ZHv8diSVc7w/r/glJW1rnsOOU3yq1LT613qq7VZ7E2p8K0eKKdrCVIduw/iFOTenrNVxg+YIDJuJiBhFAkEAnKXGMTQSFnqPyy+MW0DhFItWY2J8SVKT0BdlEYXdzLDkE3jWbp+qoO/WX1utIr+GnQrh9ItxcWNvm040jOAcCQJAX08z2Kituk/dFJZnqfYkJDZ8CRHbB8bUKabCfghwdWqSphyB3G3GYwjYU2mOeBwdMgeG9la8l9BCrsMioY1sxA==';
  }
  var decrypt = new JSEncrypt();
  decrypt.setPrivateKey(privateKey);

  var uncrypted = decrypt.decryptLong(data) || decrypt.decrypt(data);

  return uncrypted;
}

function objKeySort(obj) {
  var newkey = Object.keys(obj).sort();
  var newObj = {};
  for (var i = 0; i < newkey.length; i++) {
    newObj[newkey[i]] = obj[newkey[i]];
  }
  return newObj;
}

// 参数加密 post请求
function postParamsEncode(params) {
  console.log(params);
  var postparams = encodeData(JSON.stringify(objKeySort(params)));
  return postparams;
}

// 参数加密 get请求
function getParamsEncode(params) {
  var val = [];
  var obj = [];
  var prams = '';
  var paramsNew;
  for (var key in params) {
    val.push(key);
    obj.push(params[key]);
  }
  if (obj.length <= 1) {
    paramsNew = val + '=' + obj;
  } else {
    for (var i = 0; i < obj.length; i++) {
      prams += val[i] + '=' + obj[i] + '&';
    }
    paramsNew = prams.substring(0, prams.length - 1);
  }
  // console.log(paramsNew);
  var getparams = encodeData(paramsNew);
  return getparams;
}

function uuid(len, radix) {
  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  var uuid = [],
      i;
  radix = radix || chars.length;

  if (len) {
    // Compact form
    for (i = 0; i < len; i++) {
      uuid[i] = chars[0 | Math.random() * radix];
    }
  } else {
    // rfc4122, version 4 form
    var r;

    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    uuid[14] = '4';

    // Fill in random data. At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random() * 16;
        uuid[i] = chars[i == 19 ? r & 0x3 | 0x8 : r];
      }
    }
  }
  return uuid.join('');
}

// 签名
function getSignature() {
  var myuuid = uuid();
  myuuid = myuuid.split('-').reduce(function (a, b) {
    return a + b;
  });
  var timestamp = new Date().valueOf();
  return encodeData(myuuid + '+' + timestamp);
}

// 判断client
function getClient(){
  var client = 'A868E677C04F42B6840B0D58D7D27DDE';
  var shssdc = sessionStorage.getItem('shssdc');
  if (JSON.parse(shssdc) && JSON.parse(shssdc)[0].appKey) {// 口腔医院
    client = "D3F21C5E771F4266831304E47C07A939";
  }else if(getUserMsg('clientId')){     // 精准预约
    client = getUserMsg('clientId');
  }else if(getUserMsg('shrelease')){   // 上海发布
    client = '471A3DF670234E66B3A5D8503AAC260A';
  }
  return client;
}

// clear
function clearStorage(){
  localStorage.removeItem('accessToken');
  localStorage.removeItem('perfection');
  localStorage.removeItem('certification');
  localStorage.removeItem('cardType');
  localStorage.removeItem('portrait');
  localStorage.removeItem('thirdStatus');
  delCookie('accessToken');
  delCookie('perfection');
  delCookie('certification');
  delCookie('cardType');
  delCookie('portrait');
  delCookie('thirdStatus');
  saveUserMsg('asjkasjqwoivkja','logStatus');
}

// 网络出错 如果是二级文件夹,layer可传
function networkErr(layer, style){
  var network_err_html ='';
  if(layer == 1){     // 嵌套1层
  //   network_err_html = `
  // <div class="network-err">
  //   <div class="network-err-show">
  //     <img src="../../public/images/appointment/error-network.png" alt="">
  //     <p class="err-txt">连接错误</p>
  //     <p class="err-btn"><span class="err-button">重新加载</span></p>
  //   </div>
  // </div>`;
  network_err_html = "\n  <div class=\"network-err\">\n    <div class=\"network-err-show\">\n      <img src=\"../../public/images/appointment/error-network.png\" alt=\"\">\n      <p class=\"err-txt\">\u8FDE\u63A5\u9519\u8BEF</p>\n      <p class=\"err-btn\"><span class=\"err-button\">\u91CD\u65B0\u52A0\u8F7D</span></p>\n    </div>\n  </div>";
  }else if(layer == 2){    // 嵌套2层
  //   network_err_html = `
  // <div class="network-err">
  //   <div class="network-err-show">
  //     <img src="../../../public/images/appointment/error-network.png" alt="">
  //     <p class="err-txt">连接错误</p>
  //     <p class="err-btn"><span class="err-button">重新加载</span></p>
  //   </div>
  // </div>`;
  network_err_html = "\n  <div class=\"network-err\">\n    <div class=\"network-err-show\">\n      <img src=\"../../../public/images/appointment/error-network.png\" alt=\"\">\n      <p class=\"err-txt\">\u8FDE\u63A5\u9519\u8BEF</p>\n      <p class=\"err-btn\"><span class=\"err-button\">\u91CD\u65B0\u52A0\u8F7D</span></p>\n    </div>\n  </div>";
  }
  if(style){
    $('.network-err').css(style);
  }

  //  点击重新加载
  $('body').on('click', function(e){
    var e = e || window.event;
    var target = e.target || e.srcElement;

    // if(target.className == 'err-button'){
    //   var errurl = window.location.href;
    //   if (errurl.split('?t=').length > 1) {   // 判断第一个参数是否为t
    //     var errurlParams = errurl.split('?t=')[1].split('&');
    //     var errurlNewParams = `?t=${new Date().getTime()}`;
    //     for (var i = 0; i < errurlParams.length;i++){
    //       if(i>0){
    //         errurlNewParams += `&${errurlParams[i]}`;
    //       }
    //     }
    //     window.location.replace(`${errurl.split('?t=')[0]}${errurlNewParams}`);
    //   } else if (errurl.split('?').length > 1) {   // 第一个参数不为t，携带参数
    //     errParam = errurl.split('?')[1];
    //     if (errParam.split('&t').length > 1) {   // 携带参数是否含t
    //       window.location.replace(`${errurl.split('&t=')[0]}&t=${new Date().getTime()}`);
    //     }else{
    //       window.location.replace(`${errurl}&t=${new Date().getTime()}`);
    //     }
    //   } else {   // 无携带参数
    //     window.location.replace(`${errurl}?t=${new Date().getTime()}`);
    //   }
    // }
    if (target.className == 'err-button') {
      var errurl = window.location.href;
    
      if (errurl.split('?t=').length > 1) {
        // 判断第一个参数是否为t
        var errurlParams = errurl.split('?t=')[1].split('&');
        var errurlNewParams = "?t=".concat(new Date().getTime());
    
        for (var i = 0; i < errurlParams.length; i++) {
          if (i > 0) {
            errurlNewParams += "&".concat(errurlParams[i]);
          }
        }
    
        window.location.replace("".concat(errurl.split('?t=')[0]).concat(errurlNewParams));
      } else if (errurl.split('?').length > 1) {
        // 第一个参数不为t，携带参数
        errParam = errurl.split('?')[1];
    
        if (errParam.split('&t').length > 1) {
          // 携带参数是否含t
          window.location.replace("".concat(errurl.split('&t=')[0], "&t=").concat(new Date().getTime()));
        } else {
          window.location.replace("".concat(errurl, "&t=").concat(new Date().getTime()));
        }
      } else {
        // 无携带参数
        window.location.replace("".concat(errurl, "?t=").concat(new Date().getTime()));
      }
    }
  });
  return network_err_html;
}

// 第三方网络出错 如果是二级文件夹,layer可传
function thirdNetworkErr(layer, style){
  var network_err_html ='';
  if(layer == 1){     // 嵌套1层
  //   network_err_html = `
  // <div class="network-err">
  //   <div class="network-err-show">
  //     <img src="../../public/images/appointment/error-network.png" alt="">
  //     <p class="err-txt">连接错误</p>
  //     <p class="err-btn"><span class="err-button">重新加载</span></p>
  //   </div>
  // </div>`;
  network_err_html = "\n  <div class=\"network-err\">\n    <div class=\"network-err-show\">\n      <img src=\"../../public/images/appointment/error-network.png\" alt=\"\">\n      <p class=\"err-txt\">\u8FDE\u63A5\u9519\u8BEF</p>\n      <p class=\"err-btn\"><span class=\"err-button\">\u91CD\u65B0\u52A0\u8F7D</span></p>\n    </div>\n  </div>";
  }else if(layer == 2){    // 嵌套2层
    // network_err_html = `
    // <div class="network-err">
    //   <div class="network-err-show">
    //     <img src="../../../public/images/appointment/error-network.png" alt="">
    //     <p class="err-txt">连接错误</p>
    //     <p class="err-btn"><span class="err-button">重新加载</span></p>
    //   </div>
    // </div>`;
    network_err_html = "\n    <div class=\"network-err\">\n      <div class=\"network-err-show\">\n        <img src=\"../../../public/images/appointment/error-network.png\" alt=\"\">\n        <p class=\"err-txt\">\u8FDE\u63A5\u9519\u8BEF</p>\n        <p class=\"err-btn\"><span class=\"err-button\">\u91CD\u65B0\u52A0\u8F7D</span></p>\n      </div>\n    </div>";
  }
  if(style){
    $('.network-err').css(style);
  }

  //  点击重新加载
  $('body').on('click', function(e){
    var e = e || window.event;
    var target = e.target || e.srcElement;

    // if(target.className == 'err-button'){
    //   var errurl = window.location.href;
    //   var errurlArr= errurl.split('&');
    //   var newErrurl='';
    //   // 获取除code之外的链接
    //   for(var i=0;i<errurlArr.length;i++){
    //     console.log(errurlArr[i].indexOf('code'))
    //     if(i === 0){
    //       newErrurl += errurlArr[i];
    //     }else if(errurlArr[i].indexOf('code=') === -1){
    //       newErrurl += `&${errurlArr[i]}`;
    //     }
    //   }
      
    //   errurl = newErrurl;
    //   if(errurl.split('?t=').length > 1) {   // 判断第一个参数是否为t
    //     var errurlParams = errurl.split('?t=')[1].split('&');
    //     var errurlNewParams = `?t=${new Date().getTime()}`;
    //     for(var i = 0; i < errurlParams.length;i++){
    //       if(i>0){
    //         errurlNewParams += `&${errurlParams[i]}`;
    //       }
    //     }
    //     window.location.replace(`${errurl.split('?t=')[0]}${errurlNewParams}`);
    //   }else if(errurl.split('?').length > 1){   // 第一个参数不为t，携带参数
    //     errParam = errurl.split('?')[1];
    //     if(errParam.split('&t').length > 1){   // 携带参数是否含t
    //       window.location.replace(`${errurl.split('&t=')[0]}&t=${new Date().getTime()}`);
    //     }else{
    //       window.location.replace(`${errurl}&t=${new Date().getTime()}`);
    //     }
    //   }else{   // 无携带参数
    //     window.location.replace(`${errurl}?t=${new Date().getTime()}`);
    //   }
    // }
    if(target.className == 'err-button'){
      var errurl = window.location.href;
      var errurlArr = errurl.split('&');
      var newErrurl = ''; // 获取除code之外的链接
    
      for(var i = 0; i < errurlArr.length; i++){
        console.log(errurlArr[i].indexOf('code'));
    
        if(i === 0){
          newErrurl += errurlArr[i];
        }else if(errurlArr[i].indexOf('code=') === -1){
          newErrurl += "&".concat(errurlArr[i]);
        }
      }
    
      errurl = newErrurl;
    
       if(errurl.split('?t=').length > 1){
        // 判断第一个参数是否为t
        var errurlParams = errurl.split('?t=')[1].split('&');
        var errurlNewParams = "?t=".concat(new Date().getTime());
    
        for(var i = 0; i < errurlParams.length; i++){
          if(i > 0){
            errurlNewParams += "&".concat(errurlParams[i]);
          }
        }
    
        window.location.replace("".concat(errurl.split('?t=')[0]).concat(errurlNewParams));
      }else if(errurl.split('?').length > 1){
        // 第一个参数不为t，携带参数
        errParam = errurl.split('?')[1];
    
        if(errParam.split('&t').length > 1){
          // 携带参数是否含t
          window.location.replace("".concat(errurl.split('&t=')[0], "&t=").concat(new Date().getTime()));
        }else{
          window.location.replace("".concat(errurl, "&t=").concat(new Date().getTime()));
        }
      }else{
        // 无携带参数
        window.location.replace("".concat(errurl, "?t=").concat(new Date().getTime()));
      }
    }
  });
  return network_err_html;
}