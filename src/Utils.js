/**
 * Created by chenzhaowen on 16-5-11.
 */
var Utils = {}
Utils.ArrayProto = Array.prototype;
Utils.slice = Utils.ArrayProto.slice;

Utils.decode = decodeURIComponent;
Utils.encode = encodeURIComponent;

Utils.defaults = function(obj){
    cc.each(Utils.slice.call(arguments, 1), function(o){
        for(var k in o){
            if (obj[k] == null) obj[k] = o[k];
        }
    });
    return obj;
};

Utils.formData = function(o) {
    var kvps = [], regEx = /%20/g;
    for (var k in o) kvps.push(Utils.encode(k).replace(regEx, "+") + "=" + Utils.encode(o[k].toString()).replace(regEx, "+"));
    return kvps.join('&');
};

Utils.ajax = function(o){
    var xhr = cc.loader.getXMLHttpRequest();
    o = Utils.defaults(o, {type: "GET", data: null, dataType: 'json', progress: null, contentType: "application/x-www-form-urlencoded"});
    //ajax进度的
    //if(o.progress) Utils.Progress.start(o.progress);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4){
            if (xhr.status < 300){
                var res;
                if(o.dataType == 'json'){
                    res = window.JSON ? window.JSON.parse(xhr.responseText): eval(xhr.responseText);
                }else{
                    res = xhr.responseText;
                }
                if(!!res) o.success(res);
                ////ajax进度的
                //if(o.progress) Utils.Progress.done();
            }else{
                if(o.error) o.error(xhr, xhr.status, xhr.statusText);
            }
        }
    };
    //是否需要带cookie的跨域
    //if("withCredentials" in xhr) xhr.withCredentials = true;
    var url = o.url, data = null;
    var isPost = o.type == "POST" || o.type == "PUT";
    if( o.data && typeof o.data == 'object' ){
        data = Utils.formData(o.data);
    }
    if (!isPost && data) {
        url += "?" + data;
        data = null;
    }
    xhr.open(o.type, url, true);
    if (isPost) {
        xhr.setRequestHeader("Content-Type", o.contentType);
    }
    xhr.send(data);
    return xhr;
};

Utils.get = function(url, data, success){
    if(cc.isFunction(data)){
        success = data;
        data = null;
    }
    Utils.ajax({url: url, type: "GET", data: data, success: success});
};

Utils.post = function(url, data, success){
    if(cc.isFunction(data)){
        success = data;
        data = null;
    }
    Utils.ajax({url: url, type: "POST", data: data, success: success});
};

