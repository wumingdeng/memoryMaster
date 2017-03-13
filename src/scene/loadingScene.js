/**
 * Created by chenzhaowen on 16-6-21.
 */

var loadingScene = cc.Layer.extend({
    _cbfun:null,
    _sid:null,
    ctor:function(cbfun,sid){
        this._super();
        this._cbfun = cbfun
        this._sid = sid
        self = this
        this.init()
    },
    init:function(){
        this._super()
        var json = ccs.load(res.loading_json,"res/")
        this._ui = json.node;
        this._action = json.action;
        this._action.gotoFrameAndPlay(0,true)
        this._ui.runAction(this._action)
        this.addChild(this._ui)
        var newScene = new cc.Scene();
        newScene.addChild(this);
        cc.director.runScene(newScene);

    },
    onLoadingCallfun:function(){
        console.log("enter scene id:"+this._sid)
        var gRes = s_ResNative["s"+this._sid]
        function loadingFun(num)
        {
           if(num>=gRes.length){
               self._cbfun()
            }else{
                var idx = num++
                plistAsyncLoading(gRes[idx].plist,gRes[idx].png,loadingFun,num)
            }
        }
        loadingFun(0)
    },
    cleanup:function(){
        this._super();
        if(cc.sys.isNative){
            // cc.textureCache.removeUnusedTextures()
            // cc.spriteFrameCache.removeUnusedSpriteFrames()
        }
    },
    onEnter:function(){
        this._super();
        console.log("onEnter")

    },
    onExit:function(){
        this._super();
        console.log("onExit")
    },
    onEnterTransitionDidFinish:function(){
        this._super();
        console.log("onEnterTransitionDidFinish")
        this.onLoadingCallfun()
    },
    onExitTransitionDidStart: function () {
        this._super();
        console.log("onExitTransitionDidStart")
    },

});
