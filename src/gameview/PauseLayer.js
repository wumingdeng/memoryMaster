/**
 * Created by chenzhaowen on 16-5-4.
 */
var s_PauseLayer = null;
var PauseLayer = cc.Layer.extend({
    game:null,
    instance:null,
    ctor:function(game){
        this._super();
        this.init(game);
    },
    init:function(game){
        this.game = game;
        s_PauseLayer = this;
        this.instance = ccs.load(res.pauseUI_json,"res/").node;
        this.addChild(this.instance);
        this.instance.setName("pauseLayer");
        var btnContinue = this.instance.getChildByName("btnContinue");  //继续按钮
        cfun.setButtonFun(btnContinue,null,null,this.onContinueGame);
        //    btnContinue:addTouchEventListener(onContinueGame)
        this.instance.setPosition(cc.winSize.width/2 - this.instance.width/2,0);
        //    this.instance.setContentSize(vsize)
        //退出按钮
        var backBtn = this.instance.getChildByName("btnQuit");
        backBtn.setTouchEnabled(true);
        cfun.setButtonFun(backBtn,null,null,this.quitFromGame);

        var btnSet = this.instance.getChildByName("btnSet");
        cfun.setButtonFun(btnSet,null,null,this.setGameFun);
        var btnAgain = this.instance.getChildByName("btnAgain");
        cfun.setButtonFun(btnAgain,null,null,this.resetGameFun);

        var black = this.instance.getChildByName("black");
        black.setOpacity(200);
        return true;
    },
    //继续游戏
    onContinueGame:function(sender,touchType) {
        s_PauseLayer.game.top.pauseOrRestartGame(false);
        s_PauseLayer.removeFromParent(true);
    },
    quitFromGame:function(){
        //cc.director.resume();
        if (s_PauseLayer.game.quitFromGame) {
            s_PauseLayer.game.quitFromGame();
        }
    },
    setGameFun:function(){

    },
    resetGameFun:function(){
        if (s_PauseLayer.game.replay) {
            s_PauseLayer.game.replay();
        }
    }
});