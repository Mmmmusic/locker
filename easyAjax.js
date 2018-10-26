/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2018-07-26 18:37:35
 * @version $Id$
 */

// 01 ajax - get封装
// 
function get(url,callback){
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
        if(xhr.readyState === 4 && xhr.status === 200){
            callback && callback(xhr.responseText)  // 回调函数
        }
    }
    xhr.open('get',url,true);
    xhr.send();
}

// 02 ajax - get封装(json)
// 
function getJSON(url,callback){
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
        if(xhr.readyState === 4 && xhr.status === 200){
            callback && callback(JSON.parse(xhr.responseText));
        }
    }
    xhr.open('get',url,true);
    xhr.send();
}

// 03 ajax - post封装
// 
function post(url,data,callback){
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
        if(xhr.readyState === 4 && xhr.status === 200){
            callback = callback(JSON.parse(xhr.responseText));
        }
    }
    xhr.open('post',url,true);
    xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
    xhr.send(data);
}