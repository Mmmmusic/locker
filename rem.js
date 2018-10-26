;(function(){
    function setFontSize(){
        var W=window.innerWidth;//获取浏览器窗口宽度
        
        document.documentElement.style.fontSize=W/375*100+"px"//获取当前窗口宽度，除以初始参考窗口，乘以100，计算html fontSize
    
    }
    
    setFontSize();
    
    var timer;
    
    window.addEventListener("resize",function(){
        clearTimeout(timer);//防止多次触发resize,多余运算
        timer=setTimeout(function(){
            setFontSize();
        },20)  
    
    })
})();