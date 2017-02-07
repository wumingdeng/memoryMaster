/**
 * Created by chenzhaowen on 16-7-21.
 */


//判断对象是否为空
var isEmptyObject = function(obj) {
    for (var k in obj)
        if (obj.hasOwnProperty(k)) return false;
    return true;
};


var arrExt = {};//nameSpace

/**
 * @param {Array} t
 * @param {Object} item
 * @param {boolean} removeAll*/
arrExt.removeItem = function(t, item, removeAll) {
    for (var i = t.length; i >= 0; --i) {
        if (t[i] == item) {
            t.splice(i,1);
            if (!removeAll) {
                break;
            }
        }
    }
};

var sptExt = {};//nameSpace

/**
 * @param {string} name
 * @param {string} plist
 * @return {cc.Sprite} sprite
 * */
sptExt.createSprite = function(name,plist) {
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

var extfun = {}
extfun.seekWidgetByName = function (root, name) {
    if (!root)
        return null;
    if (root.getName() === name)
        return root;
    var arrayRootChildren = root.getChildren();
    var length = arrayRootChildren.length;
    for (var i = 0; i < length; i++) {
        var child = arrayRootChildren[i];
        var res = extfun.seekWidgetByName(child, name);
        if (res !== null)
            return res;
    }
    return null;
}