/**
 * Created by chenzhaowen on 16-7-27.
 * 游戏场景
 */

var gameScene = sceneBase.extend({
    _returnBtn:null,
    _game:null, //当前开启的玩法场景
    _touchSceneItem:false, //是否点击到场景配置的物品
    _black:null,    //黑色底
    ctor:function(id,info){
        this._super(id,info);
        // if()
        // var gRes = scene_resources["s"+id]
        // cc.LoaderScene.preload(gRes, function () {
            this.initGame()
            this.changeScene()
        // }, this);
    },
    get currentGame(){
        return this._game
    },
    //根据配置选择游戏
    initGame:function(){
        var gameId = this._info.gameId;
        var gameType = GAME_CONFIG["g" + gameId].type
        var gameIndex = GAME_CONFIG["g" + gameId].index;
        this.embedTyp = this._info.et || 1
        switch(gameType) {
            case GAME_TYPE.puzzle:
                this._game = new jigsawGame(gameId,this)
                break;
            case GAME_TYPE.findSomething:
                this._game = new findSomethingLayer(gameId,this)
                break;
            case GAME_TYPE.phone:
                this._game = new phoneLayer(gameId,this)
                break;
            case GAME_TYPE.search:
                this._game = new searchScene(gameIndex,this);
                break;
            case GAME_TYPE.scratch:
                this._game = new scratchScene(gameId,this)
                break;
            case GAME_TYPE.sortmap:
                this._game = new sortMapLayer(gameId,this)
                break;
            case GAME_TYPE.gyro:
                this._game = new gyroLayer(gameId,this)
                break;
            case GAME_TYPE.machine:
                this._game = new machineGame(this);
            default:
                break;
        }
        this.addChild(this._game)

        //// 添加返回按钮
        //this._returnBtn = new ccui.Button(res.game_return_png,res.game_return_png,res.game_return_png,ccui.Widget.LOCAL_TEXTURE)
        //this._returnBtn.setTouchEnabled(true);
        //
        //function onTouchReturn(sender,touchType){
        //    if (touchType != ccui.Widget.TOUCH_ENDED) return;
        //
        //
        //    /**处理有些游戏场景需要这退出之前做一些特殊处理
        //     * 例如动作之类*/
        //    if(this._game.onCusExit){
        //        this._game.onCusExit(this.backTo)
        //        // this._game.onCusExit()
        //    }else{
        //        this.backTo()
        //    }
        //}
        //this._returnBtn.addTouchEventListener(onTouchReturn.bind(this))
        //this._returnBtn.x = vsize.width - 100;
        //this._returnBtn.y = vsize.height - 100;
        //this.addChild(this._returnBtn,100)

    },

    onTouchBegan:function(touch,event){
        this._super(touch,event);
        this._touchSceneItem = this._isTouch;
        if (this._game.onTouchBegan) {
            this._game.onTouchBegan(touch,event);
        }
        return true
    },

    onTouchMoved:function(touch,event){
        this._super(touch,event);
        if (this._game.onTouchMoved) {
            this._game.onTouchMoved(touch,event);
        }
    },
    onTouchEnded:function(touch,event){
        this._super(touch,event);
        if (this._game.onTouchEnded) {
            this._game.onTouchEnded(touch,event);
        }
    },
    onTouchCancelled:function(touch,event){
        this._super(touch,event);
        if (this._game.onTouchCancelled) {
            this._game.onTouchCancelled(touch,event);
        }
    },

    onSetReturnBtnVisibel:function(bool){
        this._returnBtn.visible = bool
    },

    //全屏类型直接切换场景
    changeScene:function(){
        if(this.embedTyp==EMBED_Type.full){
            var newScene = new cc.Scene();
            newScene.addChild(this);

            //cc.director.runScene(new cc.TransitionCrossFade(1, newScene));
            //cc.director.runScene(new cc.TransitionTurnOffTiles(1, newScene));
            //cc.director.runScene(new cc.TransitionSplitCols(1, newScene));
            cc.director.runScene(new cc.TransitionFadeTR(1, newScene));
            sceneManager.scene = this;
        }else{
            sceneManager.baseScene.setSceneTouch(false)
            var parclose = new ccui.Layout();
            this._black = parclose;
            parclose.setContentSize(vsize);
            parclose.setTouchEnabled(true);
            parclose.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID)
            parclose.setBackGroundColor(cc.color(0,0,0));
            parclose.setBackGroundColorOpacity(200);
            parclose.setAnchorPoint(0.5,0.5);
            parclose.setPosition(vsize.width / 2, vsize.height / 2);
            this.addChild(parclose,-1)
            sceneManager.baseScene.addChild(this,999)

            //打开动作
            // parclose.scale = 0;
            // var big = cc.scaleTo(0.3,1);
            // this._ui.setScale(0)
            // function onShow() {
            //     var show = big.clone()
            //     this._ui.runAction(show);
            // }
            // parclose.runAction(cc.sequence(big,cc.callFunc(onShow.bind(this))));
        }
    },

    //完成游戏
    finishGame:function(){
        taskManager.finishGameTask();
    },

    // onTouchEnded:function(touch,event){
    //    var isTouchItem = this._super(touch,event);
    //    if (!isTouchItem) {
    //        var location = touch.getLocation();
    //        if (location.y < 200) {
    //            this.backTo()
    //        }
    //    }
    // },

    //点底下区域 可以返回上一个场景
    backTo:function(callback){
        function onClose() {
            sceneManager.baseScene.setSceneTouch(true)
            if(this.embedTyp==EMBED_Type.full){
                var sid = this._info.back;
                if (sid) {
                    trace('返回上一个场景:' + sid);
                    sceneManager.createScene(sid);
                }
            }else{
                var hide = cc.fadeTo(0.3,0);
                function onHide() {
                    sceneManager.scene.removeFromParent();
                    sceneManager.closeScene();
                    PLAYER_STATE.scene = PLAYER_STATE.mainScene; //玩家从嵌入场景出来
                    if (callback) {
                        callback();
                    }
                }
                if (this._ui) this._ui.visible = false;
                this._black.runAction(cc.sequence(hide,cc.callFunc(onHide,this)))
            }
        }
        if (this._game.backTo) {
            this._game.backTo(onClose.bind(this))
        } else {
            onClose.bind(this)();
        }

    }
})