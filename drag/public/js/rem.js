;(function(){
    function setFontSize(){
        var W=window.innerWidth;
        document.documentElement.style.fontSize=W/750*100+"px";
    }
    
    setFontSize();
    
    var timer;
    
    window.addEventListener("resize",function(){
        clearTimeout(timer);
        timer=setTimeout(function(){
            setFontSize();
        },20);  
    });
})();