function getParams (key) {
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
var nativeObj= {
    //channelType: "",//localStorage.getItem("channelType"),//渠道标识channelType. 健康云:0, 微信:1, 云闪付:2
    isNative:getParams("isNative") || localStorage.getItem("isNative"),//平台0:非原生，1:原生(健康云)，2:微信
    frameType: getParams("frameType") || localStorage.getItem("frameType"),//框架标识frameType. IOS:0, Android:1
    htmlPath:location.href.substring(0,location.href.lastIndexOf('/')),
    //根据渠道注册函数（目前只注册页面激活、缓存）
    RegisterFun: function (activeCallback) {
        //健康云渠道
        if (nativeObj.isNative == "1") {
            //IOS Frame，注册函数
            if (nativeObj.frameType == "0") {
                IOSBridge(function (bridge) {
                    //注册函数
                    bridge.registerHandler('WebBridge', function (paramJSON, responseCallback) {
                        if (paramJSON.length > 0) {
                            var paramObj = JSON.parse(paramJSON);
                            switch (paramObj.ACTION) {
                                case "ACTIVEPAGE":
                                    activeCallback();
                                    break;
                                case "GETLOCALSTORAGE":
                                    var sValue = localStorage.getItem(paramObj.PARAM.KEY);
                                    if (!sValue) sValue = "";
                                    var responseObj = {
                                        ACTION: "GETLOCALSTORAGE",
                                        PARAM: {
                                            KEY: paramObj.PARAM.KEY,
                                            VALUE: sValue
                                        }
                                    };
                                    responseCallback(JSON.stringify(responseObj));//回调
                                    break;
                            }
                        }
                    });
                });
            }
            //Android Frame，注册函数
            if (nativeObj.frameType == "1") {
                AndroidBridge(function(bridge) {
                    bridge.registerHandler("WebBridge", function(paramJSON, responseCallback) {
                        if (paramJSON.length > 0) {
                            var paramObj = JSON.parse(paramJSON);
                            switch (paramObj.ACTION) {
                                case "ACTIVEPAGE":
                                    activeCallback();
                                    break;
                                case "GETLOCALSTORAGE":
                                    var sValue = localStorage.getItem(paramObj.PARAM.KEY);
                                    if (!sValue) sValue = "";
                                    var responseObj = {
                                        ACTION: "GETLOCALSTORAGE",
                                        PARAM: {
                                            KEY: paramObj.PARAM.KEY,
                                            VALUE: sValue
                                        }
                                    };
                                    responseCallback(JSON.stringify(responseObj));//回调
                                    break;
                            }
                        }

                    });
                });
            }
        }
    }
}
/*
/*
    paramObj: 参数对象
    callback: 回调函数（Web类型此参数无效）
 */
function NativeFunc(paramObj,callback) {
    if(callback==undefined || callback == null) callback=function(response){ };
    //原生渠道（健康云渠道）
    if(nativeObj.isNative=="1") {
        var JsonStr = JSON.stringify(paramObj);
        //IOS Frame
        if(nativeObj.frameType=="0"){
            IOSNativeFunc(JsonStr, callback);//IOS
        }
        //Android Frame
        else if(nativeObj.frameType=="1"){
            AndroidNativeFunc(JsonStr, callback);//Android
        }else{
            //原生不支持接口时，原始方法打开窗体
            if(paramObj.ACTION=="OPENURL") location.href = paramObj.PARAM.URL;//默认Web模式打开
            if(paramObj.ACTION=="LOCATION") callback();//不执行定位，直接回调
            if(paramObj.ACTION=="CLOSEPAGE") location.href = paramObj.PARAM.URL;//原生关闭当前WebView回到上一个WebView，Web操作为打开上一个URL地址
        }
    }
    //其他渠道（微信，云闪付 渠道）
    else{
        if(paramObj.ACTION=="OPENURL")// || paramObj.ACTION=="CLOSEPAGE")
            location.href = paramObj.PARAM.URL;//默认Web模式打开
    }
}

/*这段代码是固定的，必须要放到js中*/
function IOSBridge(callback) {
    if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }
    if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
    window.WVJBCallbacks = [callback];

    var WVJBIframe = document.createElement('iframe');
    WVJBIframe.style.display = 'none';
    WVJBIframe.src = 'https://__bridge_loaded__';
    document.documentElement.appendChild(WVJBIframe);
    setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0)
}
/*这段代码是固定的，必须要放到js中*/
function AndroidBridge(callback) {
    if (window.WebViewJavascriptBridge) {
        callback(WebViewJavascriptBridge)
    } else {
        document.addEventListener(
            'WebViewJavascriptBridgeReady'
            , function() {
                callback(WebViewJavascriptBridge)
            },
            false
        );
    }
}

/* 调用IOS 函数 paramJSON 参数, callback 回调函数 */
function IOSNativeFunc(paramJSON,callback) {
    IOSBridge(function (bridge) {
        bridge.callHandler('NativeBridge', paramJSON, callback);
    });
}

/* 调用Android 函数 paramJSON 参数, callback 回调函数 */
function AndroidNativeFunc(paramJSON,callback) {
    window.WebViewJavascriptBridge.callHandler(
        'NativeBridge'
        , paramJSON
        , callback
    );
}

/*与OC交互的所有JS方法都要放在此处注册，才能调用通过JS调用OC或者让OC调用这里的JS*/
// IOSBridge(function(bridge) {
//     document.getElementById('charts').addEventListener('click',function(){
//         bridge.callHandler('openUrl', location.origin+'/echarts/index.html', function(response) {
//             //
//         })
//     })
// })

function gotoLoginCheck(_code){
    //11:令牌access-token过期
    //12:令牌access-token无效
    if(_code=='11' || _code=='12' || _code=='13'||
        _code==11 || _code==12 || _code==13){
        //1s后跳到原生登录页面
        setTimeout(function(){
            NativeFunc({
                ACTION: "LOGOUT"
            });
        },1000);
    }
}

