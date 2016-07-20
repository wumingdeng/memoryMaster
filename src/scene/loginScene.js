/**
 * Created by Fizzo on 16/5/24.
 */

var loginLayer = cc.Layer.extend({
    _updateInfoText:null,
    _waitText:null,
    _loadingBar:null,
    _loadingMove:null,
    _enterBtn:null,
    _loginAndRegisterBtn:null,
    currentVersion:"",
    beforeVersion:"",
    _percent:100,
    logo:null,
    logoLight:null,
    logoRender:null,
    ctor:function(){
        this._super();
        this.init()
    },
    init:function(){
        self = this;
        self._updateInfoText = new ccui.Text("",fonts.custom_font,25)
        self._updateInfoText.setAnchorPoint(0.5,0.5)
        self._updateInfoText.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT)
        self._updateInfoText.setUnifySizeEnabled(true)
        self._updateInfoText.setContentSize(cc.size(200,40))
        self._updateInfoText.setPosition(cc.winSize.width/2,50)
        self.addChild(self._updateInfoText,1000)
        self._waitText = new ccui.Text("",fonts.custom_font,25)
        self._waitText.setAnchorPoint(0,0)
        self._waitText.setPositionX(self._updateInfoText.width)
        self._updateInfoText.addChild(self._waitText)

        var loginJson = ccs.load(loginSceneRes.loginScene_json);
        self._loginUI = loginJson.node
        var uiAction = loginJson.action
        self._loadingBar = self._loginUI.getChildByName("loadingBar")
        //--添加粒子效果
                                 
        //self._loadingMove = new cc.ParticleBatchNode(loginSceneRes.zair002_png)
        var par = new cc.ParticleSystem(loginSceneRes.zair002_plist)
        par.setPosition(0,0)
        par.texture = cc.textureCache.addImage(loginSceneRes.zair002_png)
        self._loadingMove = new cc.ParticleBatchNode(par.texture)
        self._loadingMove.addChild(par)
                                
        self._loadingBar.addChild(self._loadingMove)
                                 
        self._loadingMove.setPosition(cc.p(0,9))
        self._loadingMove.setVisible(false)
        self._loadingMove.setOpacity(100)
                                 
                                 
        par.setPositionType(cc.ParticleSystem.TYPE_GROUPED)

                                 
        var loadingMove = self._loginUI.getChildByName("imgMove")
        loadingMove.setVisible(false)   //--这个先不用
        self._loadingDi = self._loginUI.getChildByName("imgLoadingDi")
        self._loadingDi.setVisible(false) //--先隐藏底 用到的时候再出来
        self._loginUI.runAction(uiAction)
        self.addChild(self._loginUI)
        uiAction.gotoFrameAndPlay(0,155,false)


        //--添加白马关印章动画
        var whiteJson = ccs.load(loginSceneRes.qidong_baimaguanyinzhangdonghua_json);
        var whiteHorse = whiteJson.node;
        var whAction = whiteJson.action;
        whiteHorse.runAction(whAction)
        //--把印章放在地图上。。
        self._loginUI.getChildByName("imgBG").setLocalZOrder(-2)
        self._loginUI.addChild(whiteHorse,1)
        whiteHorse.setPosition(self._loginUI.width - 30, 270)
        whAction.gotoFrameAndPlay(0,false)

        //--添加Logo动画
        var logoJson = ccs.load(loginSceneRes.logindonghuaxiaoguo_json)
        var logoAnimation = logoJson.node;
        var logoAction = logoJson.action;
        logoAnimation.runAction(logoAction)
        logoAction.gotoFrameAndPlay(0,false)
        logoAnimation.setPosition(590,400)
        logoAnimation.setName("logoAnimation")
        self._loginUI.addChild(logoAnimation)

        function onAppear(frame) {
            if (frame.getEvent() == "appear") {
                //--加光效
                self.addLight()
                //--var applayer = app.create(self)
                //--self.addChild(applayer)
                self.onSuccess()
                self._updateInfoText.setString("")
            }
        }
        uiAction.setFrameEventCallFunc(onAppear)
        self.setLoginButton()
    },
    setLoginButton:function(){
        //--添加快速进入按钮
        self = this;
        function onQuickEnter(sender) {
            var isBinding = cc.sys.localStorage.getItem("isBinding")
            if (isBinding) {
                //--读本地数据
                var myUserName = c.sys.localStorage.getItem("userName")
                var myPassWord = c.sys.localStorage.getItem("passWord")
                var isUsed = false
                if (myUserName && myUserName != "" && myPassWord && myPassWord != "") {
                    myUserName = cryptoHelper.decryptoDataByKey(myUserName)  //--解密
                    myPassWord = cryptoHelper.decryptoDataByKey(myPassWord)
                    //if cfun.checkRegisterInput(myUserName,myPassWord) then //--避免解密出来的是乱码
                    //isUsed = true
                    //end
                }
                if (isUsed) {
                    //--使用本地存的上回登录的用户名密码登录
                    //cfun.beginWait(1, VisibleRect.center(cc.p(0, -100)))
                    //UserHttpRequest.login(onLoginSuccess, myUserName, myPassWord, 1)
                    return
                }
            }
            //--检测本地是否有存游客账号
            var tourAccount = cc.sys.localStorage.getItem("TourAccount")
            //cfun.beginWait(1,VisibleRect:center(cc.p(0,-100)))
            if (tourAccount != undefined && tourAccount != "") {// --本地有游客号
                //--用游客账号登录
                //local pwd = crypto.md5(tourAccount)
                //UserHttpRequest.login(onLoginSuccess,tourAccount,pwd,1)
            } else {
                //--申请游客账号
                //UserHttpRequest.requestTourName(onLoginSuccess)
            }
            cc.LoaderScene.preload(g_resources, function () {
                var targetScene = searchScene.scene(0,1,1001,3,false)
                cc.director.runScene(targetScene);
            }, this);
        }
        self._enterBtn = new ccui.Button()
        self._enterBtn.setTouchEnabled(false)
        self._enterBtn.loadTextures("dengrujiemian_kuaisukaishi.png","","",ccui.Widget.PLIST_TEXTURE)
        self._enterBtn.setOpacity(0)    //--先隐藏
        self._enterBtn.setPosition(cc.winSize.width/2 - 160,20)
        self.addChild(self._enterBtn)
        extraFunc.setButtonFun(self._enterBtn,null,null,onQuickEnter)

        //--添加登陆注册按钮
        function onOpenLoginAndRegister(sender) {
            //var lar = new lar(self)
            //self.addChild(lar)
            lar:display()
            //--隐藏按钮
            self._loginAndRegisterBtn.setVisible(false)
            self._enterBtn.setVisible(false)
            //--播放音效
            cc.audioEngine.playEffect("audio/Sound/common_click.mp3",false)
        }
        self._loginAndRegisterBtn = new ccui.Button()
        self._loginAndRegisterBtn.setTouchEnabled(false)
        //--    self._loginAndRegisterBtn:setPressedActionEnabled(true)
        self._loginAndRegisterBtn.loadTextures("dengrujiemian_dengruzhuce.png","","",ccui.Widget.PLIST_TEXTURE)
        self._loginAndRegisterBtn.setOpacity(0)   // --先隐藏
        self._loginAndRegisterBtn.setPosition(cc.winSize.width/2 + 190,20)
        self.addChild(self._loginAndRegisterBtn)
        extraFunc.setButtonFun(self._loginAndRegisterBtn,null,null,onOpenLoginAndRegister)
        //--    self._loginAndRegisterBtn:addTouchEventListener(onOpenLoginAndRegister)


    },
    onSuccess:function(isDownload,version,bVersion){
        self = this
        if (isDownload) {
            //--先存着。。
            self.currentVersion = version
            self.beforeVersion = bVersion
        }else {
            self._updateInfoText.setString("")
            self._waitText.setString("")
            //self._loadingBar.setVisible(false)
            //self._loadingDi.setVisible(false)
            //self.addEnterButton()
        }
        self._isDownload = isDownload
        this.moveLoading()
    },
    addLight:function(){
        self = this
        //--添加中间logo的光效
        self.logo = extraFunc.createSprite("qidong_datongqian1.png",loginSceneRes.qidongdonghua_plist)
    
        self.logoLight = extraFunc.createSprite("qidong_datongqian1-0.png",loginSceneRes.qidongdonghua_plist)

        var mask = new cc.ClippingNode()
        mask.setInverted(false)
        mask.addChild(self.logo)

        mask.setStencil(self.logoLight)

        var title = self._loginUI.getChildByName("logoAnimation")
        mask.setPosition(title.x - 16,title.y + 20)
        self._loginUI.addChild(mask)
        self.logoLight.x = -300
        function titleAnimation() {
            var lx = self.logoLight.x
            lx = lx + 6;
            if (lx > self.logo.width + 1400) {
                lx = -300
            }
            cc.log(lx)
            self.logoLight.setPosition(lx, 0)
            //self.logoRender.beginWithClear(0, 0, 0, 0)
            //self.logoLight.visit()
            //self.logo.visit()
            //self.logoRender.end()
        }
        timerHelper.createTimer(titleAnimation,this,0,gc.TIMER_KEY_logoLight)
    },
    removeLight:function(){
        timerHelper.removeTimer(gc.TIMER_KEY_logoLight)
        this.logoRender = null
        this.logoLight.release()
        this.logo.release()
        this.logoLight = null
        this.logo = null
    },
    enterGame:function(){

    },
    displayVersionText:function(){
        self = this;
        self._versionTxt = new ccui.Text("",fonts.custom_font,40)
        self._versionTxt.setUnifySizeEnabled(true)
        self._versionTxt.setContentSize(200,50)
        self._versionTxt.setTextColor(cc.color(250,190,110))
        self._versionTxt.setCascadeOpacityEnabled(true)
        self._versionTxt.setOpacity(0)
        self._versionTxt.setTouchEnabled(true)
        self._versionTxt.setEnabled(true)
        self._versionTxt.setPosition(cc.winSize.width- self._versionTxt.width/2,cc.winSize.height-self._versionTxt.height)
        self.addChild(self._versionTxt,10000)
        function setVisible(sender) {
            var opacity = self._versionTxt.getOpacity()
            if (opacity == 0) {
                sender.setOpacity(255)
            } else {
                sender.setOpacity(0)
            }
        }
        extraFunc.setButtonFun(self._versionTxt,null,null,setVisible)
    },
    moveLoading:function(){
        self = this;
        if (self._loadingDi.isVisible()) {
            self._updateInfoText.setPositionY(50)
            self._loadingDi.setVisible(true)   //--之前隐藏了 重新显示
        }
        var showPercent = 0
        function onMoveLoading() {
            if (showPercent < self._percent) {
                showPercent = showPercent + 1   //--显示的进度每帧加1 直到赶上真实的进度
                self._updateInfoText.setString(gt.UPDATE_VERSION + showPercent + "%")
                self._loadingBar.setPercent(showPercent)
                self._loadingMove.setVisible(true)
                self._loadingMove.setPositionX(self._loadingBar.width * showPercent / 100)
                if (showPercent >= 100) {
                    timerHelper.removeTimer(gc.TIMER_KEY_LODERBAR)
                    self._updateInfoText.setString("")
                    self._waitText.setString("")
                    self._loadingBar.setVisible(false)
                    self._loadingDi.setVisible(false)
                    self.addEnterButton()
                    //--走完更新流程 判断是否要重新登录刷新界面
                    var remote_game_code = self.currentVersion.split("_")[0]
                    var numArr = remote_game_code.split(".")
                    var tail = numArr[numArr.length - 1]
                    var loginVer = tail.match("(%d+)%a")   //--取登录版本
                    //--当前版本
                    var localver = self.beforeVersion
                    localver = localver.split(".")
                    localver = localver[localver.length - 1]
                    localver = localver.match("(%d+)%a")
                    //--判断登录版本是否相等
                    if (loginVer != localver) {
                        function onRefresh(index) {
                            if (index == 1) {
                                //--重新require
                                self.removeLight()
                                //TODO
                                // 刷新main 重新进入
                                //requireAgain("main")
                            }
                        }
                        //--提示用户重新进入
                        alertHelper.showAlert("提示", gt.UPDATE_OK, [gc.BTN_LOGIN_OK], onRefresh)
                    } else {
                        //--初始化全局变量
                        //initGlobalVariable()
                        //--重新引入更新流程之前引入的文件
                        //--require需要用的文件
                        //requireOriginalFile()
                    }
                }
            }
        }
        timerHelper.createTimer(onMoveLoading,self,0,gc.TIMER_KEY_LODERBAR)
    },
    addEnterButton:function(){
        var upward = new cc.MoveBy(.4,cc.p(0,160))
        var appear = new cc.FadeIn(.5)
        var action = new cc.Spawn(upward,appear)
        var action2 = action.clone()
        function onEnableEnter(sender) {
            sender.setTouchEnabled(true)
        }
        self._enterBtn.runAction(new cc.Sequence(action,new cc.CallFunc(onEnableEnter)))
        self._loginAndRegisterBtn.runAction(new cc.Sequence(action2,new cc.CallFunc(onEnableEnter)))
    },
    showButton:function(){
        self = this
        var bigger = new cc.ScaleTo(.1,1)
        var ease = new cc.EaseBounceOut(bigger)

        self._loginAndRegisterBtn.setScale(0.1)
        self._loginAndRegisterBtn.setVisible(true)
        self._loginAndRegisterBtn.runAction(ease)

        //--判断要不要显示快速进入
        var isBinding = cc.sys.localStorage.getItem("isBinding")
        if (isBinding == undefined || isBinding == "") {
            self._enterBtn.setScale(0.1)
            self._enterBtn.setVisible(true)
            self._enterBtn.runAction(ease.clone())
        }
    }
})

var loginScene_ii = cc.Scene.extend({
// var loginScene = cc.Scene.extend({
    layer: null,
    onEnter: function () {
        this._super();
        this.layer = new loginLayer();
        this.addChild(this.layer);
        this.onMusic()
    },
    onEnterTransitionDidFinish: function () {
        this._super();
        console.log("onEnterTransitionDidFinish")
    },
    onExitTransitionDidStart: function () {
        this._super();
        console.log("onExitTransitionDidStart")
    },
    onExit: function () {
        this._super();
        console.log("onExit")
    },
    cleanup: function () {
        this._super();
        console.log("cleanup")
    },
    onMusic:function() {
        //IS_IN_LOGIN = true
        //audioHelper.openMusic("res/audio/music/loginBGM.mp3", false)
        //var bgmTimer
        //function changeBGM() {
        //    audioHelper.openMusic("res/audio/music/caseBGM.mp3", true)
        //    cc.director.getScheduler().unschedule(changeBGM,this)
        //    timerHelper.removeTimer(bgmTimer)
        //    cc.log("ei ")
        //}
        //bgmTimer = timerHelper.createTimer(changeBGM,10,false)
        //cc.log("gan")
    }
})
