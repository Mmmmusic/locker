window.onload=function(){
    var lay=getStyle(box1,'backgroundColor');
    alert(lay)
    function getStyle(obj,attr){
        return obj.currentStyle?obj.currentStyle[attr]:window.getComputedStyle(obj,null)[attr]
    }
}
