/**
 * Created by Fizzo on 17/2/5.
 */
var phoneLayer = cc.Layer.extend({
    _vsizeRect: cc.rect(),
    _taskId:0,
    _index:null,    //游戏序号
    _node:null,
    _action:null,
    _jieting:null,
    _guaduan:null,
    _isConnect:true, //手机的通话状态,
    _isSilde:false, //手机接听是滑动的状态
    _silde:null,
    _highLight:null,
    _selectNum:null, //当前按下数字的按钮
    _password:"", //密码
    _isSelectState:false, //false初始状态,true:按住状态
    ctor: function (index,parent, tid) {
        this._super()
        this._index = index;
        this._node = parent._ui;
        this._action = parent._action;
        this._taskId = 1;
        this.initLayer()
    },
    initLayer: function () {
        this._vsizeRect.width = cc.winSize.width
        this._vsizeRect.height = cc.winSize.height
        this._vsizeRect.x = 0
        this._vsizeRect.y = 0
        this._node.setPosition(this._vsizeRect.width / 2, this._vsizeRect.height / 2)

        var _listener = cc.EventListener.create({
            swallowTouches:true,
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: this.onTouchBeganFun.bind(this),
            onTouchMoved: this.onTouchMovedFun.bind(this),
            onTouchEnded: this.onTouchEndedFun.bind(this),
            onTouchCancelled: this.onTouchCanceledFun.bind(this)
        });
        if(this._taskId == 1){
            extfun.seekWidgetByName(this._node,"jiesuo").setVisible(false)
            extfun.seekWidgetByName(this._node,"tonghuajiemian").setVisible(false)

            this._jieting = extfun.seekWidgetByName(this._node,"dianhuajieting01_2")
            this._guaduan = extfun.seekWidgetByName(this._node,"dianhuajieting01_2_0")
            cc.eventManager.addListener(_listener, this._jieting);
            cc.eventManager.addListener(_listener.clone(), this._guaduan);
            this.onSildeLight()

        }else{
            extfun.seekWidgetByName(this._node,"jietingdianhua").setVisible(false)
            extfun.seekWidgetByName(this._node,"tonghuajiemian").setVisible(false)

            //输入密码界面的10个按钮
            for(var i=0;i<10;i++){
                var btn = extfun.seekWidgetByName(this._node,"mimashuzi_0"+i)

                btn.setOpacity(0)
                if(i == 0) {
                    cc.eventManager.addListener(_listener, btn);
                }else{
                    cc.eventManager.addListener(_listener.clone(), btn);
                }
            }
            //输入密码界面顶上的6个显示密码输入个数
            for(var i=1;i<=6;i++){
               extfun.seekWidgetByName(this._node,"mimaxianshi_00"+i).setOpacity(0)
            }
        }
    },
    onTouchBeganFun:function(touch, event){
        if(this._taskId == 1) {
            if (this._isSilde) return false
            var target = event.getCurrentTarget()
            if(target == this._jieting) {
                var p = this._jieting.convertTouchToNodeSpace(touch)
                if ((p.x < this._jieting.width && p.x > 0) && (p.y < this._jieting.height && p.y > 0)) return true
            }else if(target == this._guaduan){
                var p = target.parent.convertTouchToNodeSpace(touch)
                if(cc.rectContainsPoint(target.getBoundingBox(),p)){
                    this._isConnect = false
                    return true
                }
            }
        }else{
            if(this._password.length>=6) return false
            var target = event.getCurrentTarget()
            var p = target.parent.convertTouchToNodeSpace(touch)
            if(cc.rectContainsPoint(target.getBoundingBox(),p)){
                this._selectNum = target
                this._password += this._selectNum.getName().substr(this._selectNum.getName().length - 1, 1)
                target.opacity = 255
                var dian = extfun.seekWidgetByName(this._node,"mimaxianshi_00"+this._password.length)
                dian.runAction(cc.fadeIn(0.2))
                return true
            }
        }
    },
    onTouchEndedFun:function(touch, event){
        if(this._taskId == 1) {
            if(this._isConnect) {
                this._silde.visible = false
                this._highLight.visible = false

                this._action.gotoFrameAndPlay(-1, false)
                this._node.runAction(this._action)
                function onEndAction(frame) {
                    var event = frame.getEvent();
                    if (event == "end") {
                        extfun.seekWidgetByName(this._node, "jietingdianhua").setVisible(false)
                        extfun.seekWidgetByName(this._node, "tonghuajiemian").setVisible(true)
                        this.onConnection()
                        this._isSilde = false
                        this._isConnect = true
                    }
                }

                this._action.setFrameEventCallFunc(onEndAction.bind(this))
                this._isSilde = true
            }else{
                this.onUnconnection()

            }
        }else{
            if(!this._isSelectState)
                this._selectNum.runAction(cc.fadeOut(0.2))
            this._isSelectState = false
        }
    },
    onTouchMovedFun:function(touch, event){
        if(this._taskId == 0) {
            if (!this._isSelectState){
                var p = this._selectNum.parent.convertTouchToNodeSpace(touch)
                if (!cc.rectContainsPoint(this._selectNum.getBoundingBox(), p)) {
                    this._isSelectState = true
                    this._selectNum.runAction(cc.fadeOut(0.2))
                }
            }
        }
    },
    onTouchCanceledFun:function(touch, event){
    },
    onSildeLight:function(){
        this._silde = sptExt.createSprite("res/phone/dianhuajieting05.png")
        this._highLight = sptExt.createSprite("res/phone/dianhuajieting04_gaoguang.png")
        var holesClipper = new cc.ClippingNode() //--剪裁节点
        holesClipper.setAnchorPoint(0.5,0.5)
        holesClipper.addChild(this._silde)
        holesClipper.stencil = this._highLight
        holesClipper.setPosition(180.68,-81.82)
        this._node.addChild(holesClipper)

        this._highLight.setPosition(-40,0)
        var actionBy = cc.moveBy(1, cc.p(80, 0));
        var actionByBack = actionBy.reverse();
        this._highLight.runAction(cc.repeatForever(cc.sequence(actionBy, actionByBack)));

    },
    onConnection:function(){
        var timeLabel = extfun.seekWidgetByName(this._node,"time")
        var t = 1
        function onTick1(dt) {
            if(t == 10){ //TODO 通话一定时间后
                timerHelper.removeTimer(timerHelper.TALK_TIME)
            }else{
                timeLabel.setString(cfun.getTimeNumberWithoutHourConvertString(t++))
            }
        }
        timerHelper.createTimer(onTick1,this,1,timerHelper.TALK_TIME)
    },
    onUnconnection:function(){
        timerHelper.removeTimer(timerHelper.TALK_TIME)
        extfun.seekWidgetByName(this._node,"time").setVisible(false)
        extfun.seekWidgetByName(this._node,"time_0").setVisible(true)
        extfun.seekWidgetByName(this._node, "tonghuajiemian").opacity = 100
    }
});
