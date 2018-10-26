/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2018-09-05 11:46:15
 * @version $Id$
 */
;(function(){

  function setFontSize(){

    // 获取浏览器窗口宽度
    var w = window.innerWidth;
    if(w > 700){
      w = 700;
    }
    // 屏幕适配换算
    document.documentElement.style.fontSize = w/750*100 + 'px';

  }

  // 默认执行
  setFontSize();

  var timer = null;
  // 二级绑定防止 window事件 冲突
  window.addEventListener("resize",function(){

    clearTimeout(timer);
    // 防止多余运算
    timer = setTimeout(function(){
      setFontSize();
    },20);

  });

})();