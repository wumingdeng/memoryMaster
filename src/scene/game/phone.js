/**
 * Created by Fizzo on 17/2/5.
 */
var phoneLayer = cc.Layer.extend({
    _vsizeRect: cc.rect(),
    _taskId:0,
    _index:null,    //手机状态0:开场动画;1:玩法1
    _node:null,
    _action:null,
    _jieting:null,
    _isConnect:false, //手机的通话状态,
    _isSilde:false, //手机接听是滑动的状态
    _silde:null,
    _highLight:null,
    _selectNum:null, //当前按下数字的按钮
    _password:"", //密码
    _isSelectState:false, //false初始状态,true:按住状态
    _json_01:null, //接听动画对象
    _json_02:null, //通话过程对象
    _listener:null,
    _that:null,
    _isEnd:false,
    ctor: function (index,parent) {
        this._super()
        this._index = index;
        if(index != 0){
            this._node = parent._ui;
            this._node.setScale(1.3)
            this._action = parent._action;
        }
        this._that = parent
        this.initLayer()
    },
    onEnter:function(){
        this._super()
        this._action.gotoFrameAndPlay(0,20, false)
        this._node.runAction(this._action)
    },
    onInitDisplay:function(){
        this._json_01 = ccs.load(res.phone_tonghuajieting_json,"res/")
        this._json_02 = ccs.load(res.phone_duihua01_json,"res/")

        this._node = this._json_01.node
        this._action = this._json_01.action
        this._json_02.node.setVisible(false)

        var parclose = new ccui.Layout();
        parclose.setContentSize(vsize);
        parclose.setTouchEnabled(true);
        parclose.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID)
        parclose.setBackGroundColor(cc.color(0,0,0));
        this.addChild(parclose,-1)

        this._node.setPosition(this._vsizeRect.width / 2-122, this._vsizeRect.height / 2)
        this.addChild(this._json_01.node);
        this._json_02.node.setPosition(this._vsizeRect.width / 2, this._vsizeRect.height / 2)
        this.addChild(this._json_02.node);
        this._json_02.action.retain();
    },
    
    initLayer: function () {
        this._vsizeRect.width = cc.winSize.width
        this._vsizeRect.height = cc.winSize.height
        this._vsizeRect.x = 0
        this._vsizeRect.y = 0
        if(this._index==0){
            this.onInitDisplay()
        }else{
            this._node.setPosition(this._vsizeRect.width / (2*1.3), this._vsizeRect.height / (2/1.3))
        }


        this._listener = cc.EventListener.create({
            swallowTouches:true,
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: this.onTouchBeganFun.bind(this),
            onTouchMoved: this.onTouchMovedFun.bind(this),
            onTouchEnded: this.onTouchEndedFun.bind(this),
            onTouchCancelled: this.onTouchCanceledFun.bind(this)
        });
        if(this._index == 0){
            this._jieting = extfun.seekWidgetByName(this._node,"dianhuajieting01_2")
            cc.eventManager.addListener(this._listener, this._jieting);
            this.onSildeLight()
        }else{
            //输入密码界面的10个按钮
            for(var i=0;i<10;i++){
                var btn = extfun.seekWidgetByName(this._node,"mimashuzi_0"+i)

                btn.setOpacity(0)
                if(i == 0) {
                    cc.eventManager.addListener(this._listener, btn);
                }else{
                    cc.eventManager.addListener(this._listener.clone(), btn);
                }
            }
            //输入密码界面顶上的6个显示密码输入个数
        }
    },
    onTouchBeganFun:function(touch, event){
        if(this._index == 0) {
            if (this._isSilde) return false
            var target = event.getCurrentTarget()
            if(target == this._jieting) {
                var p = this._jieting.convertTouchToNodeSpace(touch)
                if ((p.x < this._jieting.width && p.x > 0) && (p.y < this._jieting.height && p.y > 0)) return true
            }else if(target == this._qu){
                var p = target.parent.convertTouchToNodeSpace(touch)
                if(cc.rectContainsPoint(target.getBoundingBox(),p)){
                    this.onGoto()
                    return true
                }
            }else if(target == this._buqu){
                var p = target.parent.convertTouchToNodeSpace(touch)
                if(cc.rectContainsPoint(target.getBoundingBox(),p)){
                    this.onGoHell()
                    return true
                }
            }else if(this._isEnd && target == this){
                this.onGoHellRightNow()
            }
            return false;
        }else{
            if(this._password.length>=6){
                this.onCheckPassword()
                return false
            }
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
            return false
        }
    },
   onPasswordDisplay:function(){
        for(var i=1;i<=6;i++){
            extfun.seekWidgetByName(this._node,"mimaxianshi_00"+i).setOpacity(0)
        }
    },
    onCheckPassword:function(){
        function onpasswordError(frame){
            var event = frame.getEvent();
            if (event == "onShake") {
                this._password = ""
                this.onPasswordDisplay()
            }
        }
        this._action.gotoFrameAndPlay(34,50, false)
        this._action.setFrameEventCallFunc(onpasswordError.bind(this))
    },
    onTouchEndedFun:function(touch, event){
        if(this._index == 0) {
            if(!this._isConnect) {
                if(event.getCurrentTarget()==this._buqu||event.getCurrentTarget()==this._qu) return
                this._silde.visible = false
                this._highLight.visible = false

                this._action.gotoFrameAndPlay(90,120, false)
                // this._node.runAction(this._action)
                function onEndAction(frame) {
                    var event = frame.getEvent();
                    if (event == "end") {
                        this._json_02.node.setVisible(true)
                        this._node.setVisible(false)
                        this._node = this._json_02.node
                        this._action = this._json_02.action
                        this.onConnection()
                        this._isSilde = false
                        this._isConnect = true
                    }
                }
                this._action.setFrameEventCallFunc(onEndAction.bind(this))
                this._isSilde = true
            }
        }else{
            if(!this._isSelectState)
                this._selectNum.runAction(cc.fadeOut(0.2))
            this._isSelectState = false
        }
    },
    onTouchMovedFun:function(touch, event){
        if(this._index != 0) {
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
    backTo:function(callback){
        if(this._isEnd||GAME_BAR._isDown!=1) return
        this._isEnd = true
        GAME_BAR.showGameBar()
        function onEndAction(frame) {
            var event = frame.getEvent();
            if (event == "end") {
                callback && callback();
            }
        }
        this._action.gotoFrameAndPlay(140,160, false)
        this._action.setFrameEventCallFunc(onEndAction.bind(this))
    },
    onExit:function(){
        this._super()
        GAME_BAR._phoneScene = null
    },
    onSildeLight:function(){
        this._silde = sptExt.createSprite("dianhuajieting05.png",res.phone_plist)
        this._highLight = sptExt.createSprite("dianhuajieting04_gaoguang.png",res.phone_plist)
        var holesClipper = new cc.ClippingNode() //--剪裁节点
        holesClipper.setAnchorPoint(0.5,0.5)
        holesClipper.addChild(this._silde)
        holesClipper.stencil = this._highLight

        holesClipper.setPosition(177,-256)
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

        // this._action.gotoFrameAndPlay(0,810,false)
        // this._node.runAction(this._action)
        this._json_02.action.gotoFrameAndPlay(0,1241,false)
        this._json_02.node.runAction(this._json_02.action)
        function onEndAction(frame) {
            var event = frame.getEvent();
            if (event == "isGo") {
                this._qu = extfun.seekWidgetByName(this._node,"qubuqu_7")
                this._buqu = extfun.seekWidgetByName(this._node,"qubuqu_8")
                cc.eventManager.addListener(this._listener.clone(), this._qu);
                cc.eventManager.addListener(this._listener.clone(), this._buqu);
            }
        }
        // this._action.setFrameEventCallFunc(onEndAction.bind(this))
        this._json_02.action.setFrameEventCallFunc(onEndAction.bind(this))
    },
    onUnconnection:function(){
        timerHelper.removeTimer(timerHelper.TALK_TIME)
        extfun.seekWidgetByName(this._node,"time").setVisible(false)
        extfun.seekWidgetByName(this._node,"time_0").setVisible(true)
        extfun.seekWidgetByName(this._node,"tonghuajiemian").opacity = 100
    },
    onGoto:function(){
        
        this._json_02.action.release();
        this._that.onMapAction()
        this.removeFromParent()
    },
    onGoHell:function(){
        if(this._isEnd) return
        this._isEnd = true
        function onEndAction(frame) {
            var event = frame.getEvent();
            if (event == "end") {
                this._json_02.action.release();
                cc.eventManager.addListener(this._listener.clone(), this);
            }
        }
        this._action.setFrameEventCallFunc(onEndAction.bind(this))
        this._action.gotoFrameAndPlay(1241,1645,false)
    },
    onGoHellRightNow:function(){
        sceneManager.closeScene()
        cc.director.runScene(new loginScene())
    }
});
