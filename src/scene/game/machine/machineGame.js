/**
 * Created by chenzhaowen on 17-3-2.
 * 操作台玩法
 */


var machineGame = cc.Layer.extend({
    _par:null,
    _ui:null,
    pullRodNum:3,
    buttonNum:6,
    sliderNum:7,
    _pullRod:null,  //拉杆
    _button:null,   //按钮
    _slider:null,   //滑块
    _tipPic:null,   //提示图片
    _tipAction:null,    //提示动作
    _currentModel:1,    //当前操作
    gameModel:{
        pullRod:1,
        button:2,
        slider:3
    },
    ctor:function(parent) {
        this._super();
        this._par = parent;
        this._ui = parent._ui;
        this.init()
    },

    init:function() {
        this._pullRod = [];
        this._button = [];
        this._slider = [];
        //拉杆初始化
        for (var i = 1; i <= this.pullRodNum; ++i) {
            var rod = cfun.seekWidgetByName(this._ui,"pullRod" + i);
            if (rod) {
                var action = ccs.load(this._par._path + "/pullRod" + i + ".json","res/").action;
                rod.runAction(action)
                var pullrod = new pullRod(rod,action)
                this._pullRod.push(pullrod);
            }
        }

        //按钮初始华
        for (i = 1; i <= this.buttonNum; ++i) {
            var button = cfun.seekWidgetByName(this._ui,"m_button" + i);
            if (button) {
                var action = ccs.load(this._par._path + "/m_button" + i + ".json","res/").action;
                button.runAction(action)
                var mbutton = new mButton(button,action)
                this._button.push(mbutton);
            }
        }

        //滑块初始化
        for (i = 1; i <= this.sliderNum; ++i) {
            var slider = cfun.seekWidgetByName(this._ui,"slider" + i);
            if (slider) {
                var action = ccs.load(this._par._path + "/slider" + i + ".json","res/").action;
                slider.runAction(action)
                var mslider = new mSlider(slider,action)
                this._slider.push(slider);
            }
        }

        //初始化提示
        this._tipPic = cfun.seekWidgetByName(this._ui,"tipPic");
        this._tipAction = ccs.load(res.machin_game_tip,"res/").action;
        this._tipPic.runAction(this._tipAction);
        this._tipAction.gotoFrameAndPause(0);
    },

    gameTip:function(step) {
        this._tipAction.gotoFrameAndPause(step);
    }

})

var pullRod = cc.Node.extend({
    _node:null,
    _status:1,
    _action:null,
    ctor:function(img,action) {
        this._node = img;
        this._action = action;
        this.init();
    },

    init:function() {
        var click = cfun.seekWidgetByName(this._node,"click");
        click.addTouchEventListener(this.onPull,this);
    },

    onPull:function(sender,type) {
        if (type != ccui.Widget.TOUCH_ENDED) return;
        trace("pull~!")
        this._action.play('action' + this._status,false)
        //this._node.runAction(this._action)
        if (this._status == 1) {
            this._status = 2;
        } else {
            this._status = 1;
        }
    }
})

var mButton = cc.Node.extend({
    _node:null,
    _status:1,
    _action:null,
    ctor:function(img,action) {
        this._node = img;
        this._action = action;
        this.init();
    },

    init:function() {
        var click = cfun.seekWidgetByName(this._node,"click");
        click.addTouchEventListener(this.onPull,this);
    },

    onPull:function(sender,type) {
        if (type != ccui.Widget.TOUCH_ENDED) return;
        trace("press~!")
        this._action.play('action' + this._status,false)
        //this._node.runAction(this._action)
        if (this._status == 1) {
            this._status = 2;
        } else {
            this._status = 1;
        }
    }
})


var mSlider = cc.Node.extend({
    _node:null,
    _status:1,
    _action:null,
    _isPlay:false,
    _beganPos:null, //开始点击
    _tempPos:null,
    ctor:function(img,action) {
        this._node = img;
        this._action = action;
        this.init();
    },

    init:function() {
        var click = cfun.seekWidgetByName(this._node,"click");
        click.addTouchEventListener(this.onTouch,this);
    },

    onTouch:function(sender,type) {
        if (type == ccui.Widget.TOUCH_BEGAN) {
            this._tempPos = sender.getTouchBeganPosition();
        }
        if (type == ccui.Widget.TOUCH_MOVED) {
            if (this._isPlay) return;
            var movePos = sender.getTouchMovePosition();
            if (movePos.y - this._tempPos.y > 40) {
                //向上移动
                if (this._status == 1) {
                    return false;
                }
                this._tempPos = movePos;
                this._action.play('action' + (10 - this._status),false);
                this._status--;
            } else if (movePos.y - this._tempPos.y < -40) {
                //向下移动
                if (this._status == 5) {
                    return false;
                }
                this._tempPos = movePos;
                this._action.play('action' + this._status,false)
                this._status++;

            }
        }
    }
})