/**
 * Created by chenzhaowen on 16-6-30.
 */

var loginScene = cc.Scene.extend({
    _scene:null,
    ctor:function(){
        this._super();
        this.init();
    },
    init:function(){
        this._super()
        var scene = ccs.load(res.loginScene_json,"res/").node;
        this.addChild(scene);
        var startBtn = ccui.helper.seekWidgetByName(scene,"startBtn");
        cfun.setButtonFun(startBtn,null,null,this.onStartGame);
    },

    onStartGame:function(event){
        trace("开始游戏");
        sceneManager.createScene(PLAYER_STATE.mainScene);
    }
});
