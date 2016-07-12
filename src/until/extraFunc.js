/**
 * Created by Fizzo on 16/5/16.
 */

var extraFunc = {}

//---添加全屏屏蔽
//--@param {string} name 传入遮挡的名称 保证不同遮挡间不干扰
//--@param listener 注册监听
extraFunc.addFullScreen = function(name,listener,isPropagate) {
    name = name || "fullScreen" //--默认用名为"fullScreen"的遮挡
    name = name.toString()
    if (cc.director.getRunningScene().getChildByName(name)) {
        var parclose = new ccui.Layout()

        parclose.setPropagateTouchEvents(false)
        parclose.setSwallowTouches(true)
        parclose.setContentSize(vSize)
        parclose.setTouchEnabled(true)
        parclose.setName(name)
        //--调整遮挡层位置
        cc.director.getRunningScene().addChild(parclose)
        if (listener) {
            isPropagate = isPropagate || false
            parclose.setPropagateTouchEvents(isPropagate)
            parclose.addTouchEventListener(listener)
        }
        console.log("添加全屏遮挡:" + name)
    }
}

//---取消全屏屏蔽
//@param name 传入遮挡的名称 保证不同遮挡间不干扰
extraFunc.removeFullScreen = function(name) {
    name = name || "fullScreen" //--默认用名为 "fullScreen" 的遮挡
    name = name.toString()
    if (cc.director.getRunningScene().getChildByName(name)) {
        cc.director.getRunningScene().removeChildByName(name)
        console.log("移除全屏遮挡:"+name)
    }
}

//--添加遮挡层
extraFunc.getParclose = function(layer,color,alpha,isTouch) {
    isTouch = isTouch == null ? true : isTouch
    var parclose = new ccui.Layout()
    parclose.setContentSize(vSize)
    parclose.setTouchEnabled(isTouch)
    if (color) {
        parclose.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
        parclose.setBackGroundColor(color)
    }
    if (alpha) {
        parclose.setOpacity(alpha)
    }
    //--调整遮挡层位置
    parclose.setAnchorPoint(layer.getAnchorPoint())
    layer.addChild(parclose, -10)
    return parclose
}

/**
 * @param name {string}
 * @param plist {string}
 * @return sprite {cc.Sprite}
 * */
extraFunc.createSprite = function(name,plist) {
    var sprite
    if (!plist) { //--没传plist先试着从纹理缓存创建
        sprite = new cc.Sprite(name)
        if (sprite) {
            return sprite
        }
    }
    var spFrame = cc.spriteFrameCache.getSpriteFrame(name)
    if (spFrame) {
        sprite = new cc.Sprite(spFrame)
        return sprite
    }else {
        if (plist) {
            console.log("创建的精灵:" + name + "  不存在！ 加载plist:" + plist)
            cc.spriteFrameCache.addSpriteFrames(plist)
            spFrame = cc.spriteFrameCache.getSpriteFrame(name)
            if (spFrame) {
                sprite = new cc.Sprite(spFrame)
                return sprite
            } else {
                console.log("创建精灵失败，请传入正确的plist文件")
                return null
            }
        } else {
            console.log("创建精灵失败")
            return null
        }
        return null
    }
}
//--button extra function
//--only support this button load same picture in different status
//---------------------------------------------------
//--@param #ccui.widget source
//--@param #function beginFun
//--@param #function moveFun
//--@param #function endFun
//--@param #function canceleFunc
//--@param sound string 音效的路径（没传用默认的音效）

/**
 * @param {ccui.Button} source
 * @param {function} beginFun
 * @param {function} moveFun
 * @param {function} endFun
 * @param {function} canceledFun
 * @param {string} sound 音效的路径（没传用默认的音效）
 * */
extraFunc.setButtonFun = function(source,beginFun,moveFun,endFun,canceledFun,sound){
    //--按下动作
    function pressAction(button) {
        var smaller = new cc.ScaleTo(0.07, 0.9)
        button.runAction(smaller)
    }
    //--弹起动作
    function recoveryAction(button) {
        var bigger = new cc.ScaleTo(0.1, 1)
        var ease = new cc.EaseBounceIn(bigger)
        button.runAction(ease)
    }
    function onTouchFun(source,type) {
        if (type == ccui.Widget.TOUCH_BEGAN) {
            extraFunc.addFullScreen("button")
            source.setBrightStyle(ccui.Widget.BRIGHT_STYLE_NORMAL)
            pressAction(source)
            if (beginFun) {
                beginFun(source, type)
            }
        }else if (type == ccui.Widget.TOUCH_MOVED) {
            source.setBrightStyle(ccui.Widget.BRIGHT_STYLE_NORMAL)
            var movePos = source.getTouchMovePosition()
            var isMoveOut = source.hitTest(movePos)
            if (!isMoveOut) {
                recoveryAction(source)
            }
            if (moveFun) {
                moveFun(source, type)
            }
        }else if(type == ccui.Widget.TOUCH_ENDED) {
            extraFunc.removeFullScreen("button")
            recoveryAction(source)
            if (endFun) {
                endFun(source, type)
                //--大部分操作都是响应touchEnd 音效先放这里。。。
                if (sound) {
                    if (sound != "") { //--传入 "" 不播放音效
                        cc.audioEngine.playEffect(sound,false)
                    }
                } else {
                    cc.audioEngine.playEffect("res/audio/Sound/common_click.mp3",false)
                }
            }
        }else if(type == ccui.Widget.TOUCH_CANCELED) {
            extraFunc.removeFullScreen("button")
            recoveryAction(source)
            if (canceledFun) {
                canceledFun(source, type)
            }
        }
    }
    source.addTouchEventListener(onTouchFun)
    source.onExit(function(){
        console.log("button exit")
        extraFunc.removeFullScreen("button")
    })
}

var table = {};//nameSpace

/**
 * @param {Array} t
 * @param {Object} item
 * @param {boolean} removeAll*/
table.removeItem = function(t, item, removeAll) {
    for (var i = t.length; i >= 0; --i) {
        if (t[i] == item) {
            t.splice(i,1);
            if (!removeAll) {
                break;
            }
        }
    }
};