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

        var json = ccs.load(res.loginScene_json,"res/");
        var scene = this._scene = json.node;
        this.addChild(scene);
        var startBtn = ccui.helper.seekWidgetByName(scene,"startBtn");
        cfun.setButtonFun(startBtn,null,null,this.onStartGame);
        //startBtn.addTouchEventListener(this.onStartGame,this)
    },



    onStartGame:function(event){
        trace("开始游戏");
        //sceneManager.getSceneInfo(PLAYER_STATE.scene);
        sceneManager.createScene(PLAYER_STATE.mainScene);
    }
});
