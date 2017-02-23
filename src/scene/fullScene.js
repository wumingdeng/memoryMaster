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
        this.addChild(GAME_BAR,2000);

        //播放开场动画
        this.setSceneTouch(true);
//        this.onActionConnectPhone()
    },
    /**TODO
     * 未调整成配置方式,
     * demo版本后需要调整
     * 目前为拼接动画,在播放手机动画后调用地图动画
    * */
    onActionConnectPhone:function(){
        this.setSceneTouch(false)
        GAME_BAR.visible = false
        this.addChild(new phoneLayer(0,this),2000)
    },
    onMapAction:function(){
        if(this._info.animation) {
            var json = ccs.load(this._info.animation,"res/")
            var animation = json.node;
            var action = json.action;
            animation.x = vsize.width / 2;
            animation.y = vsize.height / 2;

            animation.runAction(action);
            cfun.addFullScreen("openScene");

            this.addChild(animation,2000)
            action.play('action1',false);
            function onFinish(frame) {
               if (frame.getEvent() == 'finish') {
                   cfun.removeFullScreen("openScene");
                   this.onEndOpenSceneActionfun()
                   animation.removeFromParent();
               } else if (frame.getEvent() == 'move') {
                   function onView() {
                       MEMORY_CONFIG.s1.show = []
                       memoryManager.memory(true);
                       GAME_BAR.setTouchEnabled(false);
                       function onIntroFinish(frame) {
                           if(frame.getEvent() == 'finish') {
                               intro.node.removeFromParent();
                               cfun.removeFullScreen("view");
                               this.setSceneTouch(true);
                               GAME_BAR.setTouchEnabled(true);
                               memoryManager.memory(true);
                               MEMORY_CONFIG.s1.show = [-1]
                               GAME_BAR.showGameBar();
                               var hint = new hintLayer(10);
                               sceneManager.scene.addChild(hint,100);
                           }
                       }
                       var intro = cfun.getAnimation(res.memory_intro_json,false,onIntroFinish.bind(this));
                       // intro.node.x = vsize.width / 2
                       // intro.node.y = vsize.height / 2;
                       this.addChild(intro.node,2000);
                   }
                   sfun.viewScene(this,onView.bind(this))
               }
            }
            action.setFrameEventCallFunc(onFinish.bind(this))
        }
    },
    onEndOpenSceneActionfun:function(){
        GAME_BAR.visible = true
        //this.setSceneTouch(true)
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