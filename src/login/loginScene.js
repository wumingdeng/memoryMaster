/**
 * Created by chenzhaowen on 16-6-30.
 */

var loginScene = cc.Scene.extend({
    _scene:null,
    _startBtnAction:null,
    _registerBtnAction:null,
    _bindBtnAction:null,
    ctor:function(){
        this._super();
        this.init();
        taskManager.initTask();
        memoryManager.init();
    },
    init:function(){
        this._super()
        var json = ccs.load(res.login_json,"res/");
        var scene = this._scene = json.node;
        var action = json.action;
        scene.runAction(action);

        function onLoginEvent(frame) {
            var event = frame.getEvent();
            if (event == "open") {

            }
        }
        action.setFrameEventCallFunc(onLoginEvent);
        action.gotoFrameAndPlay(0,false)

        this.addChild(scene);
        var startBtn = cfun.seekWidgetByName(scene,"startBtn");

        function onStartCancel() {
            var big = cc.scaleTo(0.2,1).easing(cc.easeElasticOut(1));
            startNode.runAction(big);
        }

        function onStartGame(sender,type) {
            if (type == ccui.Widget.TOUCH_BEGAN) {
                var small = cc.scaleTo(0.2,0.9);
                startNode.runAction(small);
            } else if (type == ccui.Widget.TOUCH_MOVED) {
            } else if (type == ccui.Widget.TOUCH_ENDED) {
                onStartCancel();
                this.onStartGame();
            } else if (type == ccui.Widget.TOUCH_CANCELED) {
                onStartCancel()
            }
        }
        // cfun.setButtonFun(startBtn,onStartBegin,null,onStartEnded.bind(this),onStartCancel);

        startBtn.addTouchEventListener(onStartGame,this)

        var startNode = cfun.seekWidgetByName(scene,"startAction");
        var registerNode = cfun.seekWidgetByName(scene,"registerAction");
        this._startBtnAction = ccs.load(res.login_begin_json,"res/").action;
        this._registerBtnAction = ccs.load(res.login_register_json,"res/").action;

        startNode.runAction(this._startBtnAction);
        registerNode.runAction(this._registerBtnAction);

        this._startBtnAction.gotoFrameAndPlay(0,true);
        this._registerBtnAction.gotoFrameAndPlay(0,true);

        var title = cfun.seekWidgetByName(scene,"titleAction");
        var titleAction = ccs.load(res.login_title_json,"res/").action;
        title.runAction(titleAction)
        titleAction.gotoFrameAndPlay(0,true);

        var light = cfun.seekWidgetByName(scene,"lightAction");
        var lightAction = ccs.load(res.login_light_json,"res/").action;
        light.runAction(lightAction);
        lightAction.gotoFrameAndPlay(0,true);



    },
    onStartGame:function(event){
        trace("开始游戏");
        //sceneManager.getSceneInfo(PLAYER_STATE.scene);
        sceneManager.createScene(PLAYER_STATE.mainScene);
    },
    cleanup:function(){
        this._super()
    }
});
