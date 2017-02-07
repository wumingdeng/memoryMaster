/**
 * Created by chenzhaowen on 16-6-21.
 * 嵌入场景
 *
 */

var embedScene = sceneBase.extend({
    _bg:null,
    _window:null,
    _clickLoc:null, //小场景飞出的坐标
    ctor:function(id,info,loc,type){
        if(arguments.length == 3){
            this._super(id,info);
        }
        //var gRes = scene_resources["s"+id]
        //cc.LoaderScene.preload(gRes, function () {
        //    this.init()
        this._clickLoc = loc;
        this.initScene();
        this.openScene();
        //}, this);
    },

    initScene:function(){
        this._bg = ccui.helper.seekWidgetByName(this._ui,"bg");
        this._window = ccui.helper.seekWidgetByName(this._ui,"window");
        this._bg.setPropagateTouchEvents(false);  //阻止事件传递
        this._bg.setSwallowTouches(false);
        this._bg.addTouchEventListener(this.onTouch.bind(this));
    },

    onTouch:function(sender,event){
        if (event == ccui.Widget.TOUCH_BEGAN){
            trace("I touch~!");
            this.closeScene();
        }
    },
    //弹出场景
    openScene:function(){
        var loc = this._clickLoc;
        var sloc = sceneManager.scene._ui.convertToNodeSpace(loc);
        sfun.lookAt(sceneManager.scene,sloc.x,sloc.y,1.2);
        this._window.setScale(0);
        this._window.$x = this._window.x;
        this._window.$y = this._window.y;
        this._window.setPosition(loc.x,loc.y);
        this._bg.setOpacity(0);
        var big = new cc.scaleTo(0.5,1).easing(cc.easeInOut(2.0));
        var showBg = cc.fadeTo(0.5,255*0.8);
        var move = cc.moveTo(0.5,cc.p(this._window.$x,this._window.$y)).easing(cc.easeInOut(2.0));
        cc.director.getRunningScene().addChild(this);
        //this.setTouchEnabled(false);
        function onOpen(){
            //this.setTouchEnabled(true);
        }
        this._window.runAction(cc.spawn(big,move));
        this._bg.runAction(showBg);
    },

    closeScene:function(){
        //this.setTouchEnabled(false);
        var small = cc.scaleTo(0.3,0);
        var move = cc.moveTo(0.3,cc.p(this._clickLoc.x,this._clickLoc.y));
        var hide = cc.fadeTo(0.3,0);
        function onRemove(){
            this.removeFromParent();
            PLAYER_STATE.scene = PLAYER_STATE.mainScene; //玩家从嵌入场景出来
        }
        sfun.lookOrigin(sceneManager.scene);
        this._window.runAction(cc.sequence(cc.spawn(small,move),cc.callFunc(onRemove,this)))
        this._bg.runAction(hide);
    }

});