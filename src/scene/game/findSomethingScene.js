/**
 * Created by Fizzo on 16/7/8.
 */

var findSomethingLayer = cc.Layer.extend({
    _draw: null, //mask visible zoom
    _progress: null, //进度条的状态
    _sceneId: null, // scene's id
    _gameId: null, // game's id
    _node: null, // widget
    _checkPos: null, //
    _holeUI: null, //
    _maskSpt: null, //mask tagert
    _loadingTimer: null, //
    _clueCount: 0, //
    _allClueCount: 0, //
    _clueCountText: null,
    _rectArr: null,
    _listener: null,
    _loadingbarTimer: null, //读条精灵
    _loadingbarTimerText: null, //读条文本的显示
    _yesOrNo: false, //display true or false
    _curTag: 0, //check
    _index:0,//game's index
    _taskId:0,
    _pt:null,
    _findOne:false,
    _isCg:false,  //是否为完整的游戏
    _par:null,
    ctor: function (index, parent ,tid) {
        this._super();
        this._index = index;
        this._par = parent
        this._node = parent._ui;
        this._taskId = tid;
        this.initScene()
    },
    initGameData: function () {
        this._checkPos = GAME_CONFIG["g"+this._index].checkPos.split("_")
        var ct = 0
        this._checkPos.forEach(function (e) {
            var yesOrNo = e.split("`")[2]
            if (yesOrNo == "1")
                ct++;
        })
        this._allClueCount = ct;
    },
    initScene: function () {
        this.initGameData()
        this.drawWidget()
        this._node.getChildByName("imgSource").setVisible(false)
        this._clueCountText = this._node.getChildByName("txtProgess")
        this._clueCountText.setString("0/" + this._allClueCount)

        /*放大镜的遮罩效果*/
        var holesClipper = new cc.ClippingNode() //--剪裁节点
        holesClipper.setInverted(true)
        holesClipper.addChild(this._maskSpt)
        this._draw = new cc.DrawNode()
        var points = [cc.p(0, 0), cc.p(230, 0), cc.p(230, 230), cc.p(0, 230)]
        this._draw.drawPoly(points, cc.color(1, 0, 0, 0.5), 4, cc.color(0, 0, 1, 1))

        this._holeUI = sptExt.createSprite("02.png","findSome.plist")
        if(this._isCg) {
            var sptYes = sptExt.createSprite("gg.png", "gameScene7_1.plist")
            sptYes.setName("yes")
            sptYes.setOpacity(0)
            var sptNo = sptExt.createSprite("XX.png", "gameScene7_1.plist")
            sptNo.setName("no")
            sptNo.setOpacity(0)
            sptNo.setPosition(125, 25)
            sptYes.setPosition(125, 25)
            this._holeUI.addChild(sptYes)
            this._holeUI.addChild(sptNo)
        }
        holesClipper.setStencil(this._draw)
        this._draw.setVisible(false)
        this._holeUI.setVisible(false)
        holesClipper.setRotation(180)
        holesClipper.setScaleX(-1)
        this._node.addChild(holesClipper)

        var maskW = this._maskSpt.width
        var maskH = this._maskSpt.height

        this.addChild(this._holeUI, 100)
        holesClipper.setPosition(Number(this._rectArr[0]) + maskW / 2, Number(this._rectArr[1]) + maskH / 2)

        if(this._isCg) {
            var spt = sptExt.createSprite("jindutiao.png", "gameScene7_1.plist")
            this._loadingbarTimer = sptExt.createSprite("jindutiaodi.png", "gameScene7_1.plist")
            this._pt = new cc.ProgressTimer(spt)
            this._pt.setPosition(this._loadingbarTimer.width / 2, this._loadingbarTimer.height / 2)
            this._pt.setMidpoint(cc.p(0, 0))
            this._pt.setBarChangeRate(cc.p(1, 0))
            this._pt.setType(cc.ProgressTimer.TYPE_BAR)
            this.addChild(this._loadingbarTimer)
            this._loadingbarTimer.addChild(this._pt)
            this._loadingbarTimerText = new cc.LabelTTF()
            this._loadingbarTimerText.setFontSize(27)
            this._loadingbarTimerText.setPosition(this._pt.getPosition())
            this._loadingbarTimer.addChild(this._loadingbarTimerText)
            this._loadingbarTimer.setVisible(false)
        }
        this._listener = cc.eventManager.addListener({
            prevTouchId: -1,
            swallowTouches:false,
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: this.TouchBegan.bind(this),
            onTouchMoved: this.TouchMoved.bind(this),
            onTouchEnded: this.TouchEnded.bind(this),
            onTouchCancelled: this.TouchCancelled.bind(this)
        }, this._node);
    },
    TouchBegan: function (touch,event) {
        if(this._findOne) return false
        var location = touch.getLocation()
        var innerPos = this._maskSpt.convertToNodeSpace(location)
        this._draw.setPosition(innerPos.x - 115 - this._rectArr[2] / 2, innerPos.y - 115 - this._rectArr[3] / 2)
        this._holeUI.setPosition(location)
        this._progress = 0
        var isInner = this.isInner(innerPos)
        this._holeUI.setVisible(isInner)
        this._draw.setVisible(isInner)
        if (isInner)
            this.checkFindClue(location)
        return true
    },
    TouchMoved: function (touch,event) {
        var location = touch.getLocation()
        var innerPos = this._maskSpt.convertToNodeSpace(location)
        this._draw.setPosition(innerPos.x - 115 - this._rectArr[2] / 2, innerPos.y - 115 - this._rectArr[3] / 2)
        this._holeUI.setPosition(location)
        var isInner = this.isInner(innerPos)
        if (isInner)
            this.checkFindClue(location)
        this._draw.setVisible(isInner)
        this._holeUI.setVisible(isInner)

    },
    TouchEnded: function (touch,event) {
        this._draw.setVisible(false)
        this._holeUI.setVisible(false)
        this._progress = -1
        if(this._isCg)
            this.updateClue()
    },
    TouchCancelled: function (event) {

    },
//-- 首先获取静态数据取到当前需要找的点
//-- 然后检索当前的可视区域里手否有存在静态数据里的点
//-- 如果存在的话。读条信息，d
    checkFindClue: function (pos) {
        if(this._findOne) return
        for (var i in this._checkPos) {
            var idx = Number(i)+1
            var v = this._checkPos[i]
            if (v == "") continue
            var yesOrNot = v.split("`")[2]
            var rect = this._node.getChildByTag(idx).getBoundingBox()
            var customRect = cc.rect(this._holeUI.getPositionX(), this._holeUI.getPositionY(), 30, 30)
            if (cc.rectIntersectsRect(rect, customRect)) {
                this._curTag = idx
                this._yesOrNo = yesOrNot
                if(this._isCg){
                    if (this._progress == 1) {
                        this.updateClue(pos)
                    } else {
                        this._progress = 0
                        this.updateClue(pos)
                    }
                }else{
                    this._findOne = true
                    var cur = this._node.getChildByTag(this._curTag)
                    cur.setVisible(true)
                    ActionHelper.twinkleAction(cur, 2,this.onSuccess.bind(this))
                }
                return;
            } else {
                this._node.getChildByTag(idx).setVisible(false)
            }
        }
        this._curTag = 0
        this._progress = -1
        if(this._isCg)
            this.updateClue(pos)
    },
    /*做检查线索的检测状态*/
    updateClue: function (positon) {
        self = this;
        if (self._progress == 0) {
            self._progress = 1
            self._node.getChildByTag(self._curTag).setVisible(true)
            function loadEndFun() {
                timerHelper.removeTimer(timerHelper.TIMER_KEY_GAMESCENE7_loadingTimer)
                self._loadingbarTimer.setVisible(false)

                //--把成功找到的数组设置为"", 以方便后续的遍历数组的优化过滤
                //--由于数组的下标跟资源的tag值想对应，所以不能直接清理数组，会导致数组跟对应的资源数据对不上
                self._checkPos[self._curTag-1] = ""
                if (self._yesOrNo=="1") {
                    self.onSuccess()
                } else {
                    self.onFail()
                }
                var cur = self._node.getChildByTag(self._curTag)
                ActionHelper.twinkleAction(cur, 2)
            }
            self._loadingbarTimer.setPosition(positon.x, positon.y + 85)
            self._loadingbarTimer.setVisible(true)
            self._loadingbarTimerText.setString("0%")
            var tempPecent = 0
            this._pt.setPercentage(tempPecent)
            /*检测线索过程中的读条效果*/
            function onReadLoading() {
                if (tempPecent < 100) {
                    this._pt.setPercentage(tempPecent)
                    tempPecent = tempPecent + 1
                    this._loadingbarTimerText.setString(tempPecent + "%")
                }else{
                    this._findOne=true
                    loadEndFun()
                }
            }
            timerHelper.createTimer(onReadLoading,this,0,timerHelper.TIMER_KEY_GAMESCENE7_loadingTimer)
        } else if (self._progress == -1) {
            if (self._loadingbarTimer.isVisible()) {
                timerHelper.removeTimer(timerHelper.TIMER_KEY_GAMESCENE7_loadingTimer)
                self._loadingbarTimer.setVisible(false)
            }

            if (self._curTag != 0) {
                /*当前检测对象为第一次检测到
                * 被检测后的对象不在显示在界面上
                * */
                if (self._checkPos[self._curTag-1] != "") {
                    self._node.getChildByTag(self._curTag).setVisible(false)
                }
            }
        }
        else if (self._progress == 1) {
            if (self._loadingbarTimer.isVisible()) {
                self._loadingbarTimer.setPositionX(positon.x)
                self._loadingbarTimer.setPositionY(positon.y + 85)
            }
        }
    }
    ,
    isInner: function (pos) {
        var maskW = this._maskSpt.width
        var maskH = this._maskSpt.height
        var result = pos.x < maskW
            &&
            pos.x > 0
            &&
            pos.y > 0
            &&
            pos.y < maskH
        return result
    }
    ,/*渲染寻找线索的区域
     * 遮挡线索物品
     * */
    drawWidget: function () {
        var bgTxtr = new cc.RenderTexture(cc.winSize.width, cc.winSize.height, cc.Texture2D.PIXEL_FORMAT_RGBA8888)
        bgTxtr.begin()
        this._node.visit()
        bgTxtr.end()
        this._rectArr = GAME_CONFIG["g"+this._index].validRect.split("`")
        var tx = bgTxtr.getSprite().getTexture()
        var rect = cc.rect(Number(this._rectArr[0]), Number(this._rectArr[1]), Number(this._rectArr[2]), Number(this._rectArr[3]))
        this._maskSpt = new cc.Sprite(tx, rect,false)
    },
    onSuccess:function() {
        self = this
        function runFailedAction(){
            var cur = self._node.getChildByTag(self._curTag)
            cur.setLocalZOrder(1000)
            //--根据两个坐标点求距离
            //--以每秒300像素的速度

            var evidence = self._node.getChildByName("evidence")
            var spt = sptExt.createSprite("CJ1_chouti_yuankuang1.png", res.findSome_plist)
            spt.setPosition(cur.getPosition())
            spt.setVisible(true)
            self._node.addChild(spt,100)
            var distance = Math.sqrt(Math.pow(cur.getPositionX() - evidence.getPositionX(), 2) + Math.pow(cur.getPositionY() - evidence.getPositionY(), 2))
            var moveTo = new cc.MoveTo(distance / 300, evidence.getPosition())
            var big = cc.scaleTo(0.5,1.5).easing(cc.easeInOut(2.0));
            var moveToClone = moveTo.clone()
            function moveEndFun() {
                spt.setVisible(true)
                this._findOne = false
            }
            cur.runAction(cc.sequence(cc.spawn(moveTo,big),cc.callFunc(moveEndFun.bind(self))))
            spt.runAction(moveToClone)
            self._clueCount++;
            self._clueCountText.setString(self._clueCount+"/"+self._allClueCount)
            if (self._clueCount == self._allClueCount) {
                self._listener.setEnabled(false)
                self._draw.setVisible(false)
                self._holeUI.setVisible(false)
                self._par.finishGame()
            }
        }
        if(this._isCg)
            self.failed(self._holeUI.getChildByName("yes"),runFailedAction)
        else
            runFailedAction()
    },
    onFail:function(){
        this.failed(this._holeUI.getChildByName("no"))
    },
    failed:function(spt,callBack){
        function resetFun(){
            spt.setOpacity(0)
            if (callBack)
                callBack()
        }
        var fin = new cc.FadeIn(0.5)
        spt.runAction(new cc.Sequence(fin,new cc.CallFunc(resetFun)))
    },
})
