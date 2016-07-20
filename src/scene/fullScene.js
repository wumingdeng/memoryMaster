/**
 * Created by chenzhaowen on 16-6-21.
 * 全屏场景
 */
var fullScene = sceneBase.extend({

    ctor:function(id,info){
        this._super(id,info);
        //cc.director.getRunningScene().addChild(this)
        //cc.director.runScene(this);
        this.changeScene();
        this.initFullScene();
    },
    initFullScene:function(){

    },


    //全屏类型直接切换场景
    changeScene:function(){
        var newScene = new cc.Scene();
        newScene.addChild(this);
        cc.director.runScene(newScene);
    },

    onEnter:function(){
        this._super();
        trace("进入寝宫",this._id)
        //添加底层工具栏
        GAME_BAR = new gameBar();
        cc.director.getRunningScene().addChild(GAME_BAR,1000);
    },

    onTouchEnded:function(touch,event){
        var isTouchItem = this._super(touch,event);
        if (!isTouchItem) {
            var location = touch.getLocation();
            if (location.y < 200) {
                this.backTo()
            }
        }
    },

    //点底下区域 可以返回上一个场景
    backTo:function(){
        var sid = this._info.back;
        if (sid) {
            trace('返回上一个场景:' + sid);
            sceneManager.createScene(sid);
        }
    }


});