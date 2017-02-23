/**
 * Created by chenzhaowen on 16-6-21.
 */

var loadingScene = cc.Layer.extend({
    ctor:function(){
        this._super();
        this.init()
    },
    init:function(){
        this._super()
        var newScene = new cc.Scene();
        newScene.addChild(this);
        cc.director.runScene(newScene);

        var json = ccs.load(res.loading_json,"res/")
        this._ui = json.node;
        this._action = json.action;
        this._action.gotoFrameAndPlay(0,true)
        this._ui.runAction(this._action)
        this.addChild(this._ui)
        this.onLoadingCallfun()
    },
    onLoadingCallfun:function(){
        var gRes = s_ResNative["s1"]
        console.log("enter scene :"+PLAYER_STATE.mainScene)
        //var gRes = s_ResNative["s"+PLAYER_STATE.mainScene]
        function loadingFun(num)
        {
           if(num>=gRes.length){
               sceneManager.createScene(PLAYER_STATE.mainScene)
            }else{
                var idx = num++
                plistAsyncLoading(gRes[idx].plist,gRes[idx].png,loadingFun,num)
            }
        }
        loadingFun(0)
    },
    cleanup:function(){
        this._super();
    },
    onEnter:function(){
        this._super();
    },
    onExit:function(){
        this._super();
    },
    onEnterTransitionDidFinish:function(){
        this._super();
    },
    onExitTransitionDidStart: function () {
        this._super();
    },

});
