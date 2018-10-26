function directHandle(e,fn){
  var w=$(this).width();
  var h=$(this).height();
  var ol=$(this).offset().left;
  var ot=$(this).offset().top;
  var st=$("html").scrollTop();
  // console.log(ot,"--------")
  //参考对角线交叉点
  var x=e.clientX-w/2-ol;
  var y=h/2-(e.clientY-ot+st);
  var limit=Math.abs(Math.atan2(h/2,w/2)*180/Math.PI);//临界角度
  var angle=Math.atan2(y,x)*180/Math.PI;

  // console.log(angle)
  if(angle>=limit&&angle<180-limit){
    e.dirtop=true;
  }

  if(angle>-limit&&angle<limit){
    e.dirright=true;
  }

  if(angle<=-limit&&angle>-(180-limit)){
    e.dirbottom=true
  }

  if((angle>=180-limit&&angle<180)||(angle>-180&&angle<-(180-limit))){
    e.dirleft=true;
  }

  fn.call(this,e);//this指向当前jquery对象
}

$.fn.extend({
  dirover:function(fn){
    $(this).mouseenter(function(e){
      directHandle.call(this,e,fn)//改变directHandle this指向
    })
  },
  dirout:function(fn){
    $(this).mouseleave(function(e){
      directHandle.call(this,e,fn)
    })
  }
})