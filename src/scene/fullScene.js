/**
 * Created by chenzhaowen on 16-6-21.
 * 全屏场景
 */
var fullScene = sceneBase.extend({
    _isReadyBack:false,
    _arrow:null,    //场景切换箭头
    ctor:function(id,info){
        this._super(id,info);
        // this.changeScene();
        var gRes = scene_resources["s"+id]
        cc.LoaderScene.preload(gRes, function () {
            this.initFullScene();
            this.changeScene()
        }, this);
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
        function onView() {
            cfun.removeFullScreen("view");
        }
        //cfun.addFullScreen("view");
        //sfun.viewScene(this,onView);
    },

    onTouchEnded:function(touch,event){
        var isTouchItem = this._super(touch,event);
        if (!isTouchItem) {
            var location = touch.getLocation();
            if (location.y < 200) {
                this.backTo()
            } else if (this._isReadyBack) {
                this._isReadyBack = false;
                this._arrow.removeFromParent()
            }
        }
    },

    //点底下区域 可以返回上一个场景
    backTo:function(){
        var sid = this._info.back;
        if (!sid) {
            return;
        }
        if (this._isReadyBack) {
            trace('返回上一个场景:' + sid);
            sceneManager.createScene(sid);
        } else {
            this._isReadyBack = true;
            this._arrow = new cc.Sprite("res/common/jiantou.png");
            var sname = sceneManager.getSceneInfo(sid).name;
            var nameText = new ccui.Text(sname,"customFont",30);
            nameText.x = 37;
            nameText.y = 80;
            this._arrow.addChild(nameText);
            this.addChild(this._arrow);
            this._arrow.x = vsize.width/2;
            this._arrow.y = 100;
            var jump = cc.jumpBy(3, cc.p(0, 0), 30, 3);
            jump = cc.repeatForever(jump);
            this._arrow.runAction(jump);
        }
    }


});