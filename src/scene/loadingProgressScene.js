/**
 * Created by Fizzo on 16/5/9.
 */

var loadingProgressLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        this._super();
        var label1 = new cc.LabelTTF("loading", "Arial", 48);
        this.addChild(label1);
        label1.color = cc.color(255, 0, 0);
        label1.x = vSize.width / 2;
        label1.y = vSize.height / 2;
        //addUITableManagement(null,baseRes.AlertResource_plist)
        return true;
    },
    loadingFinishCall:function(layer){
        saveComUI(baseRes.baseUI_plist)
        console.log("loading finish!")
        var cleanupBtn = new ccui.Button(res.HelloWorld_png,res.HelloWorld_png,res.HelloWorld_png)

        console.log("fuck you")
        cleanupBtn.addClickEventListener(function(){
            removeUITableManagement()
            cc.spriteFrameCache.removeUnusedSpriteFrames()
            cc.director.getTextureCache().removeUnusedTextures()
            var alert = new cc.Sprite( cc.spriteFrameCache.getSpriteFrame("Alert_reel_di.png"))
            alert.x = vSize.width / 3
            alert.y = vSize.height / 3
            layer.addChild(alert)
        })
        layer.addChild(cleanupBtn)
        cleanupBtn.attr(
            {
                x: vSize.width / 2,
                y: vSize.height / 2
            }
        )
    },
    enterHelloScene:function(){
        var resource = []
        resource.push({plist:baseRes.baseUI_plist,png:baseRes.baseUI_png})
        resource.push({plist:baseRes.AlertResource_plist,png:baseRes.AlertResource_png})
        this.loopLoadingRes(resource,this.loadingFinishCall,this)
    },
    //    --初始化每一个场景所需要的资源
    //--为了让资源的加载与删除避开两个场景间的切换的一些峰值统一在进入场景后调用
    //--@author wmd
    //--@param #number sceneIndex  index of scene
    //@param call
    iniLoading:function(sceneIndex,onFinishCallBack) {
        switch(sceneIndex){
            case 1:
                this.enterHelloScene();
                break;
            case 2:
                break;
            default :
                break;
        }
        if(onFinishCallBack) onFinishCallBack.call();
    },
    //--循环加载资源
    loopLoadingRes:function(resources,loadingCallBackFun,target) {
        cc.spriteFrameCache.removeUnusedSpriteFrames()
        cc.director.getTextureCache().removeUnusedTextures()
        var count = 0
        function loadingFun(num) {
            count = num+1
            if (count >= resources.length) {
                loadingCallBackFun(target);
            }else{
                var res = resources[count]
                plistAsyncLoading(res.plist, res.png, loadingFun, count)
            }
        }
        loadingFun(-1)
    }
});

var loadingProgressScene = cc.Scene.extend({
    layer:null,
    sid:0,
    cb:null,
    ctor:function(sid,cb){
        this._super();
        this.sid = sid;
        this.cb = cb;
        removeUITableManagement()
    },
    onEnter:function () {
        console.log("onEnter")
        this._super();
        this.layer = new loadingProgressLayer();
        this.addChild(this.layer);
    },
    onEnterTransitionDidFinish:function(){
        this._super();
        console.log("onEnterTransitionDidFinish")
        this.layer.iniLoading(this.sid,this.cb)
    },
    onExitTransitionDidStart:function(){
        this._super();
        console.log("onExitTransitionDidStart")
    },
    onExit:function(){
        console.log("onExit")
    },
    cleanup:function(){
        this._super();
        console.log("cleanup")
    }
});

