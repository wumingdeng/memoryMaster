/**;
 * Created by chenzhaowen on 16/4/21.;
 */;

cfun = {};

var trace = function() {
    cc.log(Array.prototype.join.call(arguments,","))
};

var trace1 = function(){
    if (TRACE_LEVEL >= 1) {
        cc.log(Array.prototype.join.call(arguments,","))
    }
};

var trace2 = function(){
    if (TRACE_LEVEL >= 1) {
        cc.log(Array.prototype.join.call(arguments,","))
    }
};



///发自定义事件;
//@param eventName string 事件名;
cfun.dispatchEvent = function(eventName, data) {
    var event = new cc.EventCustom(eventName);
    event.setUserData(data);
    cc.eventManager.dispatchEvent(event);
};

///监听自定义事件;
//@param eventName string 事件名;
//@param handler function 处理方法;
cfun.eventListener = function(eventName,handler){
    var listener = cc.EventListener.create({
        event: cc.EventListener.CUSTOM,
        eventName: eventName,
        callback: handler
    });
    cc.eventManager.addListener(listener, 1);
    return listener;
};

cfun.addEventListener = function(target,began,moved,ended,cancelled) {
    if ('mouse' in cc.sys.capabilities) {
        var listener = {
            event: cc.EventListener.MOUSE
        };
        if (began) {
            listener.onMouseDown = began.bind(target);
        }
        if (moved) {
            listener.onMouseMove = moved.bind(target);
        }
        if (ended) {
            listener.onMouseUp = ended.bind(target);
        }
        if (cancelled) {

        }
        cc.eventManager.addListener(listener,target);
    } else if ('touches' in cc.sys.capabilities) {
        var listener = {
            event: cc.EventListener.TOUCH_ONE_BY_ONE
        };
        if (began) {
            listener.onTouchBegan = began.bind(target);
        }
        if (moved) {
            listener.onTouchMoved = moved.bind(target);
        }
        if (ended) {
            listener.onTouchEnded = ended.bind(target);
        }
        if (cancelled) {
            listener.onTouchCancelled = cancelled.bind(target);
        }
        cc.eventManager.addListener(listener,target);
    }
};

cfun.setButtonFun = function(source,beginFun,moveFun,endFun,canceleFun,target,sound) {
    //按下动作
    function pressAction(button) {
        var smaller = cc.scaleTo(0.07,0.9);
        button.runAction(smaller);
    }
    //弹起动作
    function recoveryAction(button) {
        var bigger = cc.scaleTo(0.1,1);
        var ease = bigger.easing(cc.easeBounceIn());
        button.runAction(ease);
    }
    function onTouchFun(source,type) {
        if (type == ccui.Widget.TOUCH_BEGAN) {
            source.isTouch = true;
            cfun.addFullScreen("button");
            source.setBrightStyle(ccui.Widget.BRIGHT_STYLE_NORMAL);
            pressAction(source);
            if (beginFun) {
                target && beginFun.call(target,source, type);
                target || beginFun(source,type);
            }
        } else if (type == ccui.Widget.TOUCH_MOVED) {
            source.setBrightStyle(ccui.Widget.BRIGHT_STYLE_NORMAL);
            var movePos = source.getTouchMovePosition();
            var isMoveOut = source.hitTest(movePos);
            if (!isMoveOut) {
                recoveryAction(source)
            }
            if (moveFun) {
                target && moveFun.call(target,source, type);
                target || moveFun(source,type);
            }
        } else if (type == ccui.Widget.TOUCH_ENDED) {
            source.isTouch = false;
            cfun.removeFullScreen("button");
            recoveryAction(source);
            if (endFun) {
                target && endFun.call(target,source, type);
                target || endFun(source,type);
                //大部分操作都是响应touchEnd 音效先放这里。。。
                if (sound) {
                    if (sound != "") {     //传入""不播放音效
                        cc.audioEngine.playEffect(sound);
                    }
                } else {
                    //cc.audioEngine.playEffect(res.common_click_mp3)
                }
            }
        } else if (type == ccui.Widget.TOUCH_CANCELED) {
            source.isTouch = false;
            cfun.removeFullScreen("button");
            recoveryAction(source);
            if (canceleFun) {
                target && canceleFun.call(target,source, type);
                target || canceleFun(source,type);
            }
        }
    }
    source.addTouchEventListener(onTouchFun,target);
    source.onExit = function() {
        //source._super();
        if (source.isTouch) {
            cfun.removeFullScreen("button");
        }
    };
    //if (!source.nodeEvent) {
    //    function onNodeEvent(event) {
    //        if (event == "exit") {
    //            if (source.isTouch) {
    //                cfun.removeFullScreen("button")
    //            }
    //        }
    //    }
    //    source.nodeEvent = true;
    //    source.registerScriptHandler(onNodeEvent);
    //}
};


//-添加全屏屏蔽
//@param name 传入遮挡的名称 保证不同遮挡间不干扰
//@param listener 注册监听
cfun.addFullScreen = function(name,listener,isPropagate) {
    name = name || "fullScreen"; //默认用名为"fullScreen"的遮挡
    name = String(name);
    if (!cc.director.getRunningScene().getChildByName(name)) {
        var parclose = new ccui.Layout();
//        var function onClickFullScreen(sender,eventType)
//            if eventType == ccui.TouchEventType.began then
//                print("全屏遮挡began")
//            elseif eventType == ccui.TouchEventType.moved then
//                print("全屏遮挡moved")
//            elseif eventType == ccui.TouchEventType.ended then
//                print("全屏遮挡ended")
//            end
//        end
        parclose.setPropagateTouchEvents(false);
        parclose.setSwallowTouches(true);
        parclose.setContentSize(vsize);
        parclose.setTouchEnabled(true);
        parclose.setName(name);
//        parclose.setGlobalZOrder(100)
//        parclose:addTouchEventListener(onClickFullScreen)
        //调整遮挡层位置
        cc.director.getRunningScene().addChild(parclose);
        if (listener) {
            isPropagate = isPropagate || false;
            parclose.setPropagateTouchEvents(isPropagate);
//            parclose.setSwallowTouches(true)
            parclose.addTouchEventListener(listener);
        }
        trace1("添加全屏遮挡:" + name);
    }
};


//-取消全屏屏蔽
//@param name 传入遮挡的名称 保证不同遮挡间不干扰
cfun.removeFullScreen = function(name) {
    name = name || "fullScreen"; //默认用名为"fullScreen"的遮挡
    name = String(name);
    var screen = cc.director.getRunningScene().getChildByName(name)
    if (screen) {
        cc.director.getRunningScene().removeChild(screen);
        trace1("移除全屏遮挡:" + name);
    }
};

//给某一层或物品屏蔽点击
cfun.addTouchParclose = function(target){

    function isInTarget(pos) {
        if (target instanceof cc.Layer){
            return true;     //如果没有传入目标就默认都挡住
        } else {
            return cc.rectContainsPoint(target.getBoundingBox(),pos)
        }
    }



    function onBegan(touch){
        var pos = touch.getLocation();
        if (isInTarget(pos)){
            touch.stopPropagation()
        }
    }
    function onMoved(touch){
        var pos = touch.getLocation();
        if (isInTarget(pos)){
            touch.stopPropagation()
        }
    }
    function onEnded(touch){
        var pos = touch.getLocation();
        if (isInTarget(pos)){
            touch.stopPropagation()
        }
    }

    cfun.addEventListener(target,onBegan,onMoved,onEnded,onEnded)
};

cfun.getTimeNumberWithoutHourConvertString = function(num) {    //不带小时
    var minutes;
    var second;
    //  return os.data("%Y-%M-%d %H:%M:%S",num)
    if (num < 60) {
        minutes = "0";
        second = String(num);
    } else if (num < 6000) {
        minutes = String(Math.floor(num / 60));
        second = String(num % 60);
    } else {
//        error("要显示小时请使用string.getTimeNumberConvertString()方法，谢谢~")
        return "99:59";
    }
    if (minutes.length == 1 || minutes.length == 0) {
        minutes = "0" + minutes;
    }
    if (second.length == 1 || second.length == 0) {
        second = "0" + second;
    }
    return minutes + ":" + second;
};

cfun.isSpriteTransparentInPoint = function(sprite, point) {
    var oldPosition = sprite.getPosition();
    var pixel = new Uint8Array(4);
    sprite.setPosition(0,0);
    var tt = sprite.getTexture();
    var renderTexture = new cc.RenderTexture(sprite.width, sprite.height);
    //renderTexture.attr({
    //    x: cc.winSize.width / 2,
    //    y: cc.winSize.height / 2
    //});
    renderTexture.begin();
    sprite.visit();
    gl.readPixels(point.x, point.y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
    renderTexture.end();
    sprite.setPosition(oldPosition);

    return pixel;
};

//check sprite's alpha with world's position
cfun.getOriginalAlphaPoint = function(source,p) {
    if (!MW.imageData) {
        return false;
    }

    var texture = source.texture;
    var originalPoint = source.convertToNodeSpace(p)  //点击点在物体上的坐标
    //if (source.getDescription() == "ImageView") { //就版本取到的是ImageView 特殊处理
    //    cc.log("what?");
    //}
    var texturePixels = texture.getContentSizeInPixels();
    var rect = source.getTextureRect();
    var isRotated = source.isTextureRectRotated();
    originalPoint.y = rect.height - originalPoint.y
    if (isRotated) {
        originalPoint = cc.p(rect.height - originalPoint.y, originalPoint.x)
    }
    var alphaX = Math.round(originalPoint.x + rect.x);
    var alphaY = Math.round(rect.y + originalPoint.y);
    if (alphaX < 0 || alphaY < 0) {
        return false;
    }
    var ret = MW.imageData[(alphaY - 1) * texturePixels.width + alphaX];
    return ret == 0;
};


cfun.isNeedAlphaData = function(png){
    for(var i = 0;i < MW.needDataImage.length; ++i) {
        if (MW.needDataImage[i] == png) {
            return true;
        }
    }
    return false;
};

cfun.getNum = function(arr) {
    if (!cc.isArray(arr)) {
        cc.log("无法获取长度")
        return 0;
    }
    var len = 0;
    cc.each(arr,function(value,key){
        if (!cc.isUndefined(value) && value != null){
            len++;
        }
    });
    return len;
};
