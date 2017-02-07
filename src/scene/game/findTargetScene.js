/**
 * Created by Fizzo on 16/7/14.
 */


var findTargetLayer = cc.Layer.extend({
    _uiLayer: null,
    _node: null,
    _sid: 0,
    _cid: 0,
    _tid: 0,
    _commonUI: null,     //公共UI
    _sceneFilePath: null,    //csb文件路径
    _sceneFileName: null,    //csb文件名
    _targetPiece: null,
    _isFind: false,
    _pieceArr: [],
    _pieceCount: 0,
    _beginPoint: cc.p(),
    ctor: function (sid, cid, tid) {
        this._super();
        this._sid = sid
        this._cid = cid
        this._tid = tid
        this.initLayer()
    },
    initLayer: function () {
        this._isFind = false
        //查配置 要找的物品的tag值
        //TODO
        var targetTag = 1
        //添加背景
        var clueBg = sptExt.createSprite(res.clue_bg)
        clueBg.setPosition(vsize.width / 2, vsize.height / 2)
        this.addChild(clueBg)

        //this._sceneFilePath,this._sceneFileName =  cfun.getGameConfigRootPathAndGameFileName(this._sceneid)
        this._node = ccs.load(res.gameScene5_json).node
        this.addChild(this._node)
        var _listener = cc.EventListener.create({
            //prevTouchId. -1,
            swallowTouches: true,
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: this.onTouchBeganFun.bind(this),
            onTouchMoved: this.onTouchMovedFun.bind(this),
            onTouchEnded: this.onTouchEndedFun.bind(this),
            onTouchCancelled: this.onTouchCanceledFun.bind(this)
        });
        this._pieceArr = this._node.getChildByName("pnlObjects").getChildren()
        this._pieceCount = this._node.getChildByName("pnlObjects").getChildrenCount()
        for (var key in  this._pieceArr) {
            var target = this._pieceArr[key]
            if (target.getTag() == targetTag) { //存下目标碎片
                this._targetPiece = target
            }
            if (key == "0")
                cc.eventManager.addListener(_listener, target);
            else {
                cc.eventManager.addListener(_listener.clone(), target);
            }
            target.setLocalZOrder(target.getTag())
        }

        //--添加公共UI
        //var taskstatic = gfun.findTaskstaticByTaskid(self._taskid)
        //var png = taskstatic[CaseHubData.Taskinfo.TASK_LOGO2]
        //self._commonUI = ClueCommonLayer.create(png,onFinish,self._caseid,taskid,gameId)
        //self.addChild(self._commonUI)
    },
    onTouchBeganFun: function (touch, event) {
        if (this._isFind) return false
        var sender = event.getCurrentTarget()
        var p = sender.getParent().convertTouchToNodeSpace(touch)
        if (cc.rectContainsPoint(sender.getBoundingBox(), p)) {
            if (!cfun.getOriginalAlphaPoint(sender, p)) {   //点击处是不透明的
                //触摸点和拖动物体中心点的位置差
                this._beginPoint = cc.pSub(cc.p(sender.x, sender.y), touch.getLocation())    //开始点 用动态属性保证同时移动多个物品时不互相干扰
                if (sender.getLocalZOrder() < this._pieceCount) {
                    for (var i in this._pieceArr) {
                        var pie = this._pieceArr[i]
                        pie.setLocalZOrder(pie.getLocalZOrder() - 1)
                    }
                    sender.setLocalZOrder(this._pieceCount)
                }
                return true
            }
        }
        return false
    },
    onTouchMovedFun: function (touch, event) {
        var current_drag = event.getCurrentTarget()
        current_drag.setPosition(cc.pAdd(touch.getLocation(), this._beginPoint))
    },
    onTouchEndedFun: function(touch, event) {
        if (this.pieceCheck()) {
            this._isFind = true
            //this._commonUI:GameConfirm()
            //--回到中间
            function onPlayAnimation() {
                //播放找到物品的效果
                //local finishAnimation,finishAction = cfun.createAnimation(selfLayer._sceneFilePath.."finishEffect.csb")
                //finishAnimation:setPosition(targetPiece:getPosition())
                //targetPiece:getParent():addChild(finishAnimation,100)
                //targetPiece:setVisible(true)
                //finishAction:gotoFrameAndPlay(0,false)
            }

            var speed = 1000
            var dest = cc.pDistance(cc.p(this._targetPiece.x, this._targetPiece.y), cc.p(vsize.width / 2, vsize.height / 2))
            var move = new cc.MoveTo(dest / speed, cc.p(vsize.width / 2, vsize.height / 2))
            this._targetPiece.runAction(new cc.Sequence(move, new cc.CallFunc(onPlayAnimation)))
        }
    },
    onTouchCanceledFun:function(touch,event){

    },
    pieceCheck: function () {
        for (var i in this._pieceArr) {
            var pie = this._pieceArr[i]
            if (pie != this._targetPiece && pie.getLocalZOrder() > this._targetPiece.getLocalZOrder()
                && cc.rectIntersectsRect(this._targetPiece.getBoundingBox(), pie.getBoundingBox())){
                //这里开始判断重叠的部分里 有没有出现两张图片都有像素的区域 有的话说明物品没被找到
                var rect = cc.rectIntersection(this._targetPiece.getBoundingBox(), pie.getBoundingBox())

                for (var i = rect.x; i < rect.x + rect.width; i += 10) {
                    for (var j = rect.y; j < rect.y + rect.height; j += 10) {
                        if (!cfun.getOriginalAlphaPoint(this._targetPiece, cc.p(i, j)) && !cfun.getOriginalAlphaPoint(pie, cc.p(i, j)))
                            return false
                    }
                }
            }
        }
        return true
    }
})
var findTargetScene = cc.Scene.extend({
    _sid: 0,
    _gid: 0,
    ctor: function (sid, gid) {
        this._super()
        this._gid = gid
        this._sid = sid
    },
    onEnter: function () {
        this._super();
        var layer = new findTargetLayer(this._gid, this._sid)
        this.addChild(layer)
    }
})