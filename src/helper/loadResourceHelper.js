/**
 * Created by Fizzo on 16/5/6.
 */


//-- plist & png pack toget
/**
 * @param {string} plistName 加载的plist文件路径
 * @param {string) pngName 加载的图片的路径
 * @param {function} loadingCallBack 载入完成后的回调方法
 * @param {number} num 加载第几分文件*/
function plistAsyncLoading(plistName,pngName,loadingCallBack,num) {
    function plistImageAsyncCallBack(texture){
        if (plistName != "") {
            cc.spriteFrameCache.addSpriteFrames(plistName);
            console.log("loading...SpriteFrame:" + plistName)
        }
        console.log("loading...texture:" + texture.getName())
        addUITableManagement(texture, plistName)
        loadingCallBack(num)
    }
    /**
     * 判断图片是否存在，存在的话加载图片的
     * 图片没有存在的话，通过plist文件载入精灵帧缓存
     */
    if (jsb.fileUtils.isFileExist(pngName)) {
        cc.director.getTextureCache().addImageAsync(pngName, plistImageAsyncCallBack)
    }else{
        plistImageAsyncCallBack()
    }
}

var spriteFrameUITable = [] //存放精灵帧的数组，以便于在方便清理
var textureUITable = [] //存放纹理的数组，以便于在方便清理

/**
 * 对载入的资源做一次引用计数，防止进入场景中，把还没有使用的但是是需要的资源给清理掉
 * @param {cc.Texture2D} texture
 * @param {string} plist */
function addUITableManagement(texture,plist) {
    if (!isComUI(plist)) { //  --常驻内存的资源不加入管理
        console.log("express plist:"+plist)
        var spriteFramestable = jsb.fileUtils.getValueMapFromFile(plist)
        for (var key in  spriteFramestable["frames"]) {
            if (key) {
                var sptFrame = cc.spriteFrameCache.getSpriteFrame(key) 
                if (!sptFrame) {

                }else{
                    sptFrame.retain()
                    spriteFrameUITable.push(sptFrame)
                }
            }
        }
    }
    if (texture) {
        textureUITable.push(texture)
        texture.retain()
    }
    new ccui.Text
}
STATIC_RESOURCE = [   //把需要常驻内存的资源文件存放在该数组中
    "baseUI.plist",
]

//---是否是常驻内存的资源
function isComUI(plist){
    STATIC_RESOURCE.forEach(function(e){
        if(plist == e){
            return true
        }
    })
    return false
}

//--动态资源引用计数减一
function removeUITableManagement() {
    spriteFrameUITable.forEach(function(spriteFrame){
        spriteFrame.release()
    });
    textureUITable.forEach(function(texture){
        texture.release()
    });
    textureUITable = []
    spriteFrameUITable = []
}



