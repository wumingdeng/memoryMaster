/**
 * Created by chenzhaowen on 16-7-27.
 * 游戏场景
 */

var gameScene = sceneBase.extend({

    ctor:function(id,info){
        this._super(id,info);

        this.initGame();
        this.changeScene();
    },

    //根据配置选择游戏
    initGame:function(){
        var gameId = this._info.gameId;
        var gameType = GAME_CONFIG["g" + gameId].type
        // var index = GAME_CONFIG["g" + gameId].index
        var game
        switch(gameType) {
            case GAME_TYPE.puzzle:
                game = new jigsawGame(gameId,this._ui)
        }

        this.addChild(game);

        //添加返回按钮
        var returnBtn = new ccui.Button()
        returnBtn.setTouchEnabled(true);
        returnBtn.loadTextures(res.game_return_png,res.game_return_png,res.game_return_png);

        function onTouchReturn(sender,touchType){
            if (touchType != ccui.Widget.TOUCH_ENDED) return;
            this.backTo()
        }
        returnBtn.addTouchEventListener(onTouchReturn.bind(this))

        returnBtn.x = vsize.width - 100;
        returnBtn.y = vsize.height - 100;
        this.addChild(returnBtn,100)
    },

    //全屏类型直接切换场景
    changeScene:function(){
        var newScene = new cc.Scene();
        newScene.addChild(this);
        cc.director.runScene(newScene);
    },

    //完成游戏
    finishGame:function(){
        taskManager.finishGameTask();
    },

    //onTouchEnded:function(touch,event){
    //    var isTouchItem = this._super(touch,event);
    //    if (!isTouchItem) {
    //        var location = touch.getLocation();
    //        if (location.y < 200) {
    //            this.backTo()
    //        }
    //    }
    //},

    //点底下区域 可以返回上一个场景
    backTo:function(){
        var sid = this._info.back;
        if (sid) {
            trace('返回上一个场景:' + sid);
            sceneManager.createScene(sid);
        }
    }

})