/**
 * Created by chenzhaowen on 16/4/25.
 */

var s_gameTOpLayer = null;
var gameTopLayer = cc.Layer.extend({
    _clickPos:{},  // world position
    _contrlLayer:null,
    _widget:null,
    _pause:null,
    _nowGame:null, //当前游戏
    _score:0,
    _errorEffect:null,
    _removeTimeer:null,
    _comboCount:0,  //连击统计 用于计算连击奖励
    _timeCount:0,    //时间统计 用于计算时间得分
    _mainCover :null,
    // _rightCover:null

    _lblTask   :null,
    _lblPoints :null, //本局游戏的积分
    _lblTime   :null, //游戏时间
    _imgEnergyBar:null,
    _leftTime  :0,
    _initTime  :0,
    _TimerID   :null,
    _progressID:null,

    panelCenter:null,
    panelRight:null,
    panelLeft:null,

    _timeRecorded:0,
    _timeErrorGap:null,
    _timeNoOperate:null,
    _curScale:0,
    // _score     :null
    _shouldPause:false,
    _isaForwardTimer:null,

    lianjiNum:0,//倍数 使用前请调用getLianjiNum()
    selectErrs:0,   //点错的计算
    isInLianji:false,   //是否一连击
    regressionId:null,    //判断一连击的定时器
    onelianjiCount:0,    //一连击计数（暂停恢复后根据计数重置定时器）
    REGRESSION_TIME:7,   //衰减一格用的时间
    pauseView:null,   //暂停界面
    pausedActions:null,    //被暂停的动作
    moveToArr:[0,30,110,175,240,305,380],
    displacement_second:65,
    btnPause:null,   //暂停按钮
    clickErrTime:null,   //记下点击错误的时间
    countTime:0.2,  //一连击定时间隔
    
    
    
    
    ctor:function(game,initailTime,directionBool) {
        this._super();
        this.init(game,initailTime,directionBool);
    },

    init:function(game,initailTime,directionBool) {
        cc.spriteFrameCache.addSpriteFrames(res.lianji_plist);
        cc.spriteFrameCache.addSpriteFrames(res.click_wrong_plist);
        this._nowGame = game;
        s_gameTOpLayer = this;
        this.lianjiNum = 0;
        this.isInLianji = false;
        this.regressionId = null;
        this._shouldPause = false;
        this.clickErrTime = null;
        this.selectErrs = 0;
        this._leftTime = 0;
        //////-add menu control layer
        this._widget = ccs.load(res.game_top_json,"res/").node;
        this.addChild(this._widget,1);
        this._widget = this._widget.getChildByName("topUI");
        //    this.addChild(this._pause,10)
        this.setContentSize(this._widget.getContentSize());
        this._contrlLayer = new cc.Layer();
        this._contrlLayer.setPositionY(-vsize.height + this._widget.height);
        this.addChild(this._contrlLayer,2);

            //var ctrlUI = this._widget.getChildByName("Panel_30")
        this._widget.setAnchorPoint(cc.p(0,0));
        this._widget.setPosition(cc.p(0,0));  ////widget 设置锚点y方向0.5 不起作用？？
        var topBar = this._widget.getChildByName("topBar");
        var width = 1 * topBar.getContentSize().width;
        topBar.setContentSize(width,topBar.height);

        this.panelCenter = topBar.getChildByName("panelCenter");
        this.panelLeft = topBar.getChildByName("panelLeft");
        this.panelRight = topBar.getChildByName("panelRight");

        this._lblTime = this.panelRight.getChildByName("lblTime"); //时间
        this._lblPoints = this.panelCenter.getChildByName("lblScore");
        //    _imgEnergyBar =  panelCenter.getChildByName("imgMask")
        //    _imgEnergyBar.setScaleX(1)    //设置初始状态

        this._imgEnergyBar = new cc.Sprite("#gameTop_zhedang.png")
        this._imgEnergyBar.setName("imgMask");
        var source = new cc.Sprite("#gameTop_lianjitiao.png")
        var holesClipper = new cc.ClippingNode(); //剪裁节点
        holesClipper.setAlphaThreshold(0.05);
        holesClipper.setPosition(178,11);
        source.setPosition(0,0);
        this._imgEnergyBar.setPosition(0,0);
        holesClipper.addChild(source);
        holesClipper.setInverted(true);
        holesClipper.setStencil(this._imgEnergyBar);

        this.panelCenter.getChildByName("pnlDi").addChild(holesClipper);


        this.btnPause = this.panelLeft.getChildByName("btnPause");

        function onPause(sender, eventType) {
            //如果游戏结束 不可以暂停
            if (game.isGameEnd) {
                return;
            }
            if (game._pauseEnabled == false) { //不让暂停。。
                return
            }
            s_gameTOpLayer.pauseOrRestartGame(true)
        }
        cfun.setButtonFun(this.btnPause,null,null,onPause);
        //this.btnPause.addTouchEventListener(onPause);

            //// init control layer
        //    _score = 0
        this._score = 0;
        this._lblPoints.setString(this._score);


        //set time and mode
        this._isaForwardTimer = directionBool;
        this._initTime = initailTime;
        if (this._isaForwardTimer) {
            this._leftTime = initailTime;
        }
        this._lblTime.setString(cfun.getTimeNumberWithoutHourConvertString(this._leftTime));

            //app进入前台
        //function onEnterForeground() {
        //    print("前台呵呵")
        //}
        //
        //    //app进入后台
        //function onEnterBackground() {
        //    print("后台暂停")
        //    onPause()
        //}
        //var eventDispatcher = cc.director.getEventDispatcher()
        //var customListenerFg = cc.EventListenerCustom:create("APP_ENTER_FOREGROUND_EVENT",onEnterForeground)
        //var customListenerBg = cc.EventListenerCustom:create("APP_ENTER_BACKGROUND_EVENT",onEnterBackground)
        //eventDispatcher.addEventListenerWithFixedPriority(customListenerFg, 1)
        //eventDispatcher.addEventListenerWithFixedPriority(customListenerBg, 1)
        //return true


    },
    onEnter:function() {
        this._super();
        this.onGameStart();
    },
    onGameStart:function() { //public methord
        //if (this._TimerID != null) {
        //    this.unschedule(this._TimerID);
        //}
        this.schedule(this.setGameTimeLable, 1.0);
        if (this.isInLianji) {  //重新开始一连击的计时
            //if (this.regressionId) {
            //    this.unschedule(this.regressionId);
            //    this.regressionId = null;
            //}
            this.schedule(this.onLianji, this.countTime);
        }
        //this.setFullscreenIsolate(false)
        this._contrlLayer.visible = true;
    },
    //倒计时 或 正计时
    setGameTimeLable:function() {
        if (this._shouldPause == true) {
            return;
        }
        if (null==this._isaForwardTimer) {
            cc.log("warning! before run schedule timers, you should set direction of runtime a bool value");
            return;
        }
        if (this._isaForwardTimer) { // isCountDown;
            if (this._leftTime > 0) {
                this._leftTime = this._leftTime - 1;
            }
        } else {
            this._leftTime = this._leftTime+1;
        }
        //消耗的时间加1 用于计算时间得分;
        this._timeCount = this._timeCount + 1;
        this._lblTime.setString(cfun.getTimeNumberWithoutHourConvertString(this._leftTime));
        if (this._leftTime == 0) {  //结束游戏;
            if (this._errorEffect) {
                this._errorEffect.removeFromParent();
                cc.log("移除点错提示");
            }
            cc.log("time out");
            this.onGameStop(true);
            this.onGamePaused();
            function fail(){
                //var loading = require(resRoute["loadingProgressScene"]);
                //loading.caseId = _gameTopLayer._nowGame.caseID;
                //loading._isCheckCaseVer = false;
                //var loadingScene = loading:create(CASEDETAIL_SCENE);
                //cfun.changeScene(loadingScene);
                //            loading:loadingCaseDetailUI(_gameTopLayer._nowGame.caseID);
            }
            //发送挑战失败事件;
            //var failEvent = cc.EventCustom:new(GAME_FAIL_EVENT)    //发事件;
            //cc.director.getEventDispatcher():dispatchEvent(failEvent);
            ActionHelper.tiaozhanshibai(fail);
            //        fail();
            this._nowGame.isGameEnd = true;
        }
    },
    stopTimer:function(){
        this.unschedule(this.setGameTimeLable);
    },
    ////#####  game stop settings
    onGameStop:function(bool) { //public methord
        if (bool) {
            //调用能量槽减短函数
            this.stopTimer();
            if (this.isInLianji && this.regressionId) {
                this.unschedule(this.regressionId);
                this.regressionId = null;
            }
            this.btnPause.setTouchEnabled(false); //屏蔽暂停按钮
            //if (this + _nowGame.__cname == "JigsawScene") {
            //    this._contrlLayer.setVisible(false);
            //}
            cc.director.getActionManager().resumeTarget(this._contrlLayer);
            cc.log("//-game over//-")
        } else {
            this.onGameStart();
            this.btnPause.setTouchEnabled(true);
        }
    },
    ////- game pause settings
    onGamePaused:function(tOrf) {   //public methord
        //    _shouldPause = tOrf
        //    this.setFullscreenIsolate(tOrf)
        //    if (tOrf == true) {
        //        Director:pause()
        //    else
        //        Director:resume()
        //    }
        this._imgEnergyBar.stopAllActions();
    },

    pauseOrRestartGame:function(bool) {
        if (bool == this._shouldPause)  return; //防止连续调用
        this._shouldPause = bool
        if (!this._shouldPause) {
            if (typeof this._nowGame.removeShaderBlur == "function") { //移除模糊
                this._nowGame.removeShaderBlur();
            }
            this._nowGame.stopGame(false);
            cc.director.getActionManager().resumeTargets(this.pausedActions); //恢复所有动作
        } else {
            //暂停
            var pause = new PauseLayer(this._nowGame);
            cc.log("////////game paused////-");
            if (this._nowGame.addShaderBlur) {//添加模糊
                this._nowGame.addShaderBlur(pause);
            }
            cc.director.getRunningScene().addChild(pause, cc.director.getRunningScene().getChildren().length);
            this._nowGame.stopGame(true);
            this.pausedActions = cc.director.getActionManager().pauseAllRunningActions();   //暂停所有动作
        }
    },
    onLianji:function(dt) {
        //消除一连击的状态
        this.onelianjiCount = this.onelianjiCount + dt;
        if (this.onelianjiCount >= this.REGRESSION_TIME) {
            //if (this.regressionId) {
                this.unschedule(this.onLianji);
            //}
            this.regressionId = null;
            this.isInLianji = false;
            this.onelianjiCount = 0;
            this.lianjiNum = 0;
            cc.log("消除连击状态");
        }
    },
    ////////////////////
        //@param #boolean TorF
    //@param #float x
    //@param #float y
    //@param #bool  是否显示点击错误（黑夜模式使用。。）
    //@param #number addNum 增加的连击数
    onDoubleClicked:function(TorF,x,y,invalidTouch,addNum) {     //true则连击,false则取消连击
        this._clickPos["x"] = x;
        this._clickPos["y"] = y;
        addNum = addNum || 1;    //默认是1;
        //if (this.regressionId) {    //移除判断一连击的定时器;
            this.unschedule(this.onLianji);
            //this.regressionId = null;
        //}
    //    this.playComboAwardAction();
        if (TorF==false) {
            //音效;
            cc.audioEngine.playEffect(res.clickError_mp3);
            //点错了 清除连击数 重置连击槽;
            this.lianjiNum = 0;
            this.isInLianji = false;
            this._imgEnergyBar.stopAllActions();
            this._imgEnergyBar.setPositionX(0);
            var errTime = new Date().getTime();
            this.clickErrTime = this.clickErrTime || errTime;
            if (this.clickErrTime) {
                if (errTime - this.clickErrTime < 3000) {  //点错间隔小于2秒;
                    this.selectErrs = this.selectErrs + 1;
                } else {
                    this.selectErrs = 1;
                }
            }
            this.clickErrTime = errTime;
            for (var i = 2; i <= 6; ++i) {
                this.panelCenter.getChildByName("img_" + i).setVisible(false);
                this.panelCenter.getChildByName("img_" + i).stopAllActions();
            }
            if (this.selectErrs == 5 && this._nowGame.__cname != "JigsawScene") {
                //音效;
                cc.audioEngine.playEffect(res.clickWarn_mp3);
                //显示连续点错的提示;
                //var animation,action = cfun.createAnimation("res/Animation/continuousErrorAnimation/continuousError.csb");
                var json = ccs.load(res.click_continuousError_json,"res/");
                var animation = json.node;
                var action = json.action;
                animation.runAction(action);
                action.gotoFrameAndPlay(0, false);
                this._errorEffect = animation;
                this._errorEffect.setAnchorPoint(0, .5);
                this._errorEffect.setPosition(0, vsize.height / 2);

                //            var removeTimeer = nil;
                function onFinish(frame) {
                    s_gameTOpLayer._errorEffect.removeFromParent();
                    s_gameTOpLayer._errorEffect = null;
                    cc.log("移除点错提示");
                }

                this._errorEffect.schedule(onFinish, 3.5, 1);
                cc.director.getRunningScene().addChild(this._errorEffect, cc.director.getRunningScene().getChildren().length);
                this.selectErrs = 0;
            }
            //隐藏连击框;
            if (this._nowGame.__cname != "JigsawScene" && !this.invalidTouch) { //不是拼图 并且不是黑夜模式的点在黑色区域处;
                var cuoImg = new cc.Sprite("#gameUI_cuowutishi.png");
                var cuoPos = this._contrlLayer.convertToNodeSpace(this._clickPos);
                cuoImg.setCascadeOpacityEnabled(true);
                cuoImg.setPosition(cuoPos);
                cuoImg.setOpacity(0);
                cuoImg.setScale(0.5);
                this._contrlLayer.addChild(cuoImg, 99);
                var actionFaleIn = cc.fadeIn(0.2);
                var actionScale1 = cc.scaleTo(0.2, 1.2);
                var actionScale2 = cc.scaleTo(0.1, 1);
                var spwn = cc.spawn(actionFaleIn, actionScale1);

                function removeCallFun() {
                    cuoImg.removeFromParent();
                }

                var removeFun = cc.callFunc(removeCallFun);
                var sqe = cc.sequence(spwn, actionScale2, removeFun);
                cuoImg.runAction(sqe);
            }
        } else {
            //点对了;
            this.selectErrs = 0;
            this.lianjiNum = this.lianjiNum + addNum;
            cc.log("少年！ 你已经" + this.lianjiNum + "连击了！");
            if (this.lianjiNum > 1) {
                this.playComboAwardAction();
                //说明形成连击了 连击统计加一;
                this._comboCount = this._comboCount + 1;
            }
            //播放连击数动作;
            if (this.lianjiNum > 1 && this.lianjiNum <= 6) {
                this.playComboNumAction();
            }
            if (this.lianjiNum > 6 ) {
                this.lianjiNum = 6;
            }
            this.isInLianji = false;
            this.playComboAction();
            //加分;
            //cfun.changeNum(this._lblPoints,this._score,this._score +100 * this.lianjiNum);
            this._score = this._score + 100 * this.lianjiNum;
            this._lblPoints.setString(this._score);
            if (this.lianjiNum == 2) {
                //音效;
                cc.audioEngine.playEffect(res.game_combo2_mp3);
            }else if (this.lianjiNum == 3) {
                cc.audioEngine.playEffect(res.game_combo3_mp3);
            }else if (this.lianjiNum == 4) {
                cc.audioEngine.playEffect(res.game_combo4_mp3);
            }else if (this.lianjiNum == 5) {
                cc.audioEngine.playEffect(res.game_combo5_mp3);
            }else if (this.lianjiNum == 6) {
                //超过6连击随机播放一种音效;
                var rand = Math.floor(Math.random()*2);
                if (rand == 1) {
                    cc.audioEngine.playEffect(res.game_comboAward1_mp3);
                } else {
                    cc.audioEngine.playEffect(res.game_comboAward2_mp3);
                }
            }
            //同时播放找到东西的音效;
            cc.audioEngine.playEffect(res.game_find_mp3);
        }

    },
    playComboAction:function() {
        if (this.lianjiNum == 1) {
            this.Regression();
        } else {
            //        var speed = 1.5
            var targetPos = this.panelCenter.getChildByName("pnlDi").convertToWorldSpace(cc.p(0, 0));
            var nowScaleX = this._imgEnergyBar.getPositionX();
            var targetScaleX = this.moveToArr[this.lianjiNum];
            targetPos = cc.pAdd(cc.p(targetScaleX - 40, 10), targetPos);

            var run = cc.moveTo(.2, cc.p(targetScaleX, 0));
            var ease = run.easing(cc.easeSineOut());
            this._imgEnergyBar.stopAllActions(); //先移除之前的
            function beginRegression() {
                s_gameTOpLayer.Regression();
            }

            function lastStepFun() {
                ActionHelper.lianjiNumBoomEffect(targetPos)
            }

            this._imgEnergyBar.runAction(cc.sequence(ease, cc.callFunc(beginRegression), cc.callFunc(lastStepFun)));
        }
    },
    //连击槽衰减
    Regression:function() {
        function onOneLianji() {   //一连击的计时
            //设置个判断1连击的定时器
            this.onelianjiCount = 0;
            this.isInLianji = true;
            //if (s_gameTOpLayer.regressionId) {
            //    s_gameTOpLayer.unschedule(s_gameTOpLayer.regressionId);
            //    s_gameTOpLayer.regressionId = null;
            //}
            this.schedule(s_gameTOpLayer.onLianji,s_gameTOpLayer.countTime);
        }
        function callback() {
            s_gameTOpLayer.lianjiNum = s_gameTOpLayer.lianjiNum - 1;   //连击数减一
            //改变连击数字
            s_gameTOpLayer.playComboNumAction();
            s_gameTOpLayer.Regression();   //继续减到下一格
        }
        if (this.lianjiNum == 0) {
            return;
        } else if (this.lianjiNum == 1) {
            onOneLianji.apply(this);
        } else {
            var moveToPosX = this.moveToArr[this.lianjiNum-1];
            var regression = cc.moveTo(this.REGRESSION_TIME,cc.p(moveToPosX,0));
            this._imgEnergyBar.stopAllActions();  //先移除之前的
            this._imgEnergyBar.runAction(cc.sequence(regression,cc.callFunc(callback)));    //开始衰减
        }
    },
    //播放连击数字动作
    playComboNumAction:function() {
        for (var i = 2; i <= 6; ++i) {
            var imgNum = this.panelCenter.getChildByName("img_" + i);    //数字对应的图片
            if (i <= this.lianjiNum) {
                //恢复数字的显示状态
                imgNum.stopAllActions();
                imgNum.setVisible(true);
                imgNum.setScale(0.5);    //初始是0.5
                imgNum.setOpacity(255);
                if (imgNum.getAnchorPoint().x == 0) {
                    //说明播放了旋转消除动作 锚点和位置要重置
                    imgNum.setRotation(0);
                    imgNum.setAnchorPoint(.5, .5);
                    imgNum.setPositionX(imgNum.getPositionX() + imgNum.width / 2);
                    imgNum.setPositionY(imgNum.getPositionY() + imgNum.height / 2);
                }
                if (i == this.lianjiNum) {
                    //播放动作
                    ActionHelper.lianjiNumEffectScaleAction(imgNum);
                }
            } else {
                //如果是显示状态 说明是衰减下来的 这时播放消失动作
                if (imgNum.isVisible()) {
                    ActionHelper.lianjiNumEffectRationAction(imgNum);
                }
            }
        }
    },
    playComboAwardAction:function() {
        var animation = ActionHelper.comboAction(this.lianjiNum);
        var soucreX = this._clickPos.x;
        var sourceY = this._clickPos.y;
        var anmtnX = 0;
        var anmtnY = 0;
        if (soucreX - animation.width < 0 ) {
            soucreX = animation.width;
            anmtnX = animation.width / 2;
        } else {
            anmtnX = soucreX - animation.width/2;
        }
        if (sourceY + animation.height> vsize.height) {
            anmtnY = sourceY - animation.height / 2;
            sourceY = sourceY - animation.height;
        } else {
            anmtnY = sourceY +  animation.height/2;
        }
        animation.setPosition(anmtnX,anmtnY);
        this._contrlLayer.addChild(animation,10);
        var pnlScore = new ccui.Layout();
        pnlScore.setTouchEnabled(false);
        pnlScore.setContentSize(cc.size(200,50));
        var lblscore = new cc.LabelAtlas("",res.ljdf_png,25,36,"0");
        var imgPlus = new cc.Sprite("#gameUI_lianjijiahao.png");
        lblscore.setString(String(100 * this.lianjiNum));
    //    lblscore.setString(99888);
        lblscore.setPosition(imgPlus.width+lblscore.width/2-50,-20);
        pnlScore.addChild(imgPlus);
        pnlScore.addChild(lblscore);
        function lianjiXiaoguo(){
            function removeCallFun(){
                pnlScore.removeFromParent();
            }
            var actionScale = cc.scaleTo(0.1,.9);
            var actionScale1 = cc.scaleTo(0.1,1);
            var actionFale = cc.fadeIn(0.1);
            var removeFun = cc.callFunc(removeCallFun);
            var sqwn1 = cc.spawn(actionScale,actionFale);
            var seq = cc.sequence(sqwn1,actionScale1,cc.delayTime(.7),removeFun);
            pnlScore.runAction(seq);
        }
        if (this.lianjiNum > 6) {
            pnlScore.setRotation(-12);
            animation.addChild(pnlScore);
            pnlScore.setPosition(-40, -30);
            lianjiXiaoguo();
        } else {
            pnlScore.setCascadeOpacityEnabled(true);
            pnlScore.setOpacity(1);
            pnlScore.setPosition(soucreX,sourceY+70);
            this._contrlLayer.addChild(pnlScore,10);

            function removeFunCall1() {
                pnlScore.removeFromParent();
            }
            var actionMove = cc.moveBy(0.2,cc.p(0,25));
            var actionFaleOut = cc.fadeOut(0.1);
            var actionFale1 = cc.fadeIn(0.1);
            var sqwn2 = cc.spawn(actionMove,actionFale1);
            var sqwn3 = cc.spawn(actionMove,actionFaleOut);
            var removeFun1 = cc.callFunc(removeFunCall1);
            var seq1 = cc.sequence(sqwn2,cc.delayTime(0.6),sqwn3,removeFun1);
            pnlScore.runAction(seq1);
        }
    }
});