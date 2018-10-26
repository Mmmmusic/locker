/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2018-07-16 20:10:21
 * @version $Id$
 */

function ani(obj,st,val,fn){
            var x=0;
            var con=parseInt(getStyle(obj,st));
            var target=val;
            if(target>con){
                var timer=setInterval(function(){
                    x+=60;
                    if(x>=target-con){
                        clearInterval(timer);
                        obj.style[st]=target+'px';
                        fn();
                    }else{
                        obj.style[st]=con+x+'px';
                    }
                },30)
            }else{
                var timer=setInterval(function(){
                    x+=60;
                    if(x>=con-target){
                        clearInterval(timer);
                        obj.style[st]=target+'px';
                        fn();            
                    }else{
                        obj.style[st]=con-x+'px';
                    }
                },30)
            }
        }     

function getStyle(obj,attr){
    return obj.currentStyle?obj.currentStyle[attr]:window.getComputedStyle(obj,null)[attr]
}