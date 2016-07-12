/**
 * Created by chenzhaowen on 16-5-9.
 */

var serverPath = "http://192.168.18.216:8088"
var sendRequest = function(url, params, isPost, callback, errorcallback){
    if(url == null || url == '')
        return;

    var xhr = cc.loader.getXMLHttpRequest();
    if(isPost){
        xhr.open("POST",url);
    }else{
        xhr.open("GET",url);
    }
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
        if(xhr.readyState == 4 && xhr.status == 200){
            var response = xhr.responseText;
            if(callback)
                callback(response);
        }else if(xhr.readyState == 4 && xhr.status != 200){
            var response = xhr.responseText;
            if(errorcallback)
                errorcallback(response);
        }
    };

    if(params == null || params == ""){
        xhr.send();
    }else{
        xhr.send(params);
    }
};