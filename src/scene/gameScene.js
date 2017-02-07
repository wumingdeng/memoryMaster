/**
 * Created by chenzhaowen on 16-7-27.
 * 游戏场景
 */

var gameScene = sceneBase.extend({

    ctor:function(id,info){
        this._super(id,info);
        var gRes = scene_resources["s"+id]
        cc.LoaderScene.preload(gRes, function () {
            this.initGame()
            this.changeScene()
        }, this);
    },

    //根据配置选择游戏
    initGame:function(){
        var gameId = this._info.gameId;
        var gameType = GAME_CONFIG["g" + gameId].type
        this.embedTyp = GAME_CONFIG["g" + gameId].et || 1
        var game
        switch(gameType) {
            case GAME_TYPE.puzzle:
                game = new jigsawGame(gameId,this)
                break;
            case GAME_TYPE.findSomething:
                game = new findSomethingLayer(gameId,this)
                break;
            case GAME_TYPE.phone:
                game = new phoneLayer(gameId,this)
                break;
            default:
                break;
        }
    },

    //全屏类型直接切换场景
    changeScene:function(){
        if(this.embedTyp==EMBED_Type.full){
            var newScene = new cc.Scene();
            newScene.addChild(this);
            cc.director.runScene(newScene);
        }else{
            
        }
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