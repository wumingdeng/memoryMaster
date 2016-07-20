/**
 * Created by chenzhaowen on 16-6-21.
 * 嵌入场景
 *
 */

var embedScene = sceneBase.extend({

    ctor:function(id,info){
        this._super(id,info);
        this.initScene();
        this.openScene();
    },

    initScene:function(){
        var bg = ccui.helper.seekWidgetByName(this._ui,"bg");
        bg.setPropagateTouchEvents(false);  //阻止事件传递
        bg.setSwallowTouches(false);
        bg.addTouchEventListener(this.onTouch.bind(this));
    },

    onTouch:function(sender,event){
        if (event == ccui.Widget.TOUCH_BEGAN){
            trace("I touch~!");
            this.closeScene();
        }
    },
    //弹出场景
    openScene:function(){
        cc.director.getRunningScene().addChild(this);
        this.scale = 0;
        //this.setTouchEnabled(false);
        var big = new cc.scaleTo(0.3,1);
        function onOpen(){
            //this.setTouchEnabled(true);
        }
        this.runAction(cc.sequence(big,cc.callFunc(onOpen,this)));
    },

    closeScene:function(){
        //this.setTouchEnabled(false);
        var small = new cc.scaleTo(0.3,0);
        function onRemove(){
            this.removeFromParent();
            PLAYER_STATE.scene = PLAYER_STATE.mainScene; //玩家从嵌入场景出来
        }
        this.runAction(cc.sequence(small,cc.callFunc(onRemove,this)))
    }

});