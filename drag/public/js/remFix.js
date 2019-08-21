;(function(){
  function setFontSize(){
      var W=window.innerWidth;
      if(W>=750){
        W=640;
      }else if(W<330){
        W=300;
      }else if(W<=375){
        W=350;
      }
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