/**
 * Created by Fizzo on 16/7/13.
 */

var jigsawLayer = cc.Layer.extend({
    _current_drag: null,
    _vsizeRect: cc.rect(),
    _sceneId: 0,
    _caseId: 0,
    _taskId: 0,
    _pieceCount: 0,//碎片的个数
    _zNum: 0, //碎片的z坐标
    _piece_joined:[], //存放着已经拼凑在一起的对象的关联数据
    _pieces:[], //存放每个对象的相邻的数据，下标对应的是对象的tag值 元素结构 {tag:number,adjacent_piece_tags:[],sprite:cc.Sprite}
    _isTouch:false,//判断是否同时点击屏幕
    _isGameEnd:false,//判断是否游戏已经结束
    _currentContents:[],//当前选中的对象的相连对象
    _beginPoint:cc.p(),//当前的点击位置
    ctor: function (sid, gid) {
        this._super()
        this.initLayer()
    },
    initLayer: function (caseId, sceneId, taskId, gameId) {
        this._current_drag = null
        this._vsizeRect.width = cc.winSize.width
        this._vsizeRect.height = cc.winSize.height
        this._vsizeRect.x = 0
        this._vsizeRect.y = 0

        this._sceneId = sceneId
        this._caseId = caseId
        this._taskId = taskId
        //this._sceneFilePath,this._sceneFileName =  cfun.getGameConfigRootPathAndGameFileName(sceneId)
        this._node = ccs.load(res.gameScene4_json).node
        this._node.setPosition(vsize.width / 2, vsize.height / 2)
        var bg = extraFunc.createSprite(res.clue_bg)
        this.addChild(bg, 0)
        bg.setAnchorPoint(.5, .5)
        bg.setPosition(vsize.width / 2, vsize.height / 2)
        //get staticdata entrace
        //getAdjacentStaticData(caseId,sceneId)
        //this.analysisAdjacenData()
        //require("gameview.ClueCommonLayer")
        this.addChild(this._node, 2)


        this._pieceCount = this._node.getChildrenCount()
        this._zNum = this._pieceCount //初始的z坐标设置为碎片的最大个数
        this.initAdjacentInfo()
        //var taskstatic = gfun.findTaskstaticByTaskid(taskId)
        //var png = taskstatic[CaseHubData.Taskinfo.TASK_LOGO2]
        //this._commonUI = ClueCommonLayer.create(png, onContactEnd, this._caseId, taskId, gameId)
        //this.addChild(this._commonUI)
        //return true
    },
    initAdjacentInfo:function(){
        var spts = this._node.getChildren()
        for (var key in spts) {
            var target = spts[key]
            var piece = {}
            piece.tag = target.getTag()
            piece.adjacent_piece_tags = {}
            piece.sprite = target
            for (var k in spts) {
                var adjacent = spts[k]
                if (target != adjacent) {
                    if (this.isAdjacnet(target.getTag(), adjacent.getTag())) {
                        piece.adjacent_piece_tags[adjacent.getTag()] = this.getAdjacentInfo(target, adjacent)
                    }
                }
            }
            var contents = []
            contents[target.getTag()] = piece
            this._piece_joined[piece.tag] = contents
            this._pieces[target.getTag()] = piece
        }
        for (var key in spts) {
            var spt = spts[key]
            spt.addTouchEventListener(this.onTouchFun,this)
        }
    },
    getElementByTag:function(arr,tag){
        for(var idx in arr){
            var temp = arr[idx]
            if(temp.t = tag)
                return temp
        }
    },
    isAdjacnet:function(tarTag,souTag){

    },
    getAdjacentInfo:function(tar,sou){

    },
    /*判断是否点击在透明区域里*/
    getOriginalAlphaPoint:function(source)
    {
        var touchPos = source.getTouchBeganPosition()
    },
    onTouchBeganFun:function(sender) {
        if (this._isTouch)  return false
        if (this._isGameEnd) return false
        if (this.getOriginalAlphaPoint(sender)) {
            this._isTouch = true
            //event.stopPropagation()
            this._currentContents = this._piece_joined[sender.getTag()]
            this._current_drag = sender
            this._beginPoint = source.getTouchBeganPosition()
            var midPoint = cc.p(sender.width / 2, sender.height / 2)
            this._beginPoint = cc.pSub(midPoint, this._beginPoint)

            if (this._currentContents.length != this._pieceCount) {
                if (this._zNum != this._current_drag.getLocalZOrder()) {
                    this._zNum++
                    for (var key  in this._currentContents) {
                        var contentPiece = this._currentContents[key]
                        var contentSpt = contentPiece.sprite
                        contentSpt.setLocalZOrder(this._zNum)
                    }
                }
            }
            return true
        }else{
            return false
        }
    },
    onTouchMovedFun : function(sender){
        //var p = event:getCurrentTarget():getParent():convertTouchToNodeSpace(touch)
        //var targetPos = cc.pAdd(touch:getLocation(),beginPoint)
        //--filter current source moved to outside of scene
        //if cc.rectContainsPoint(selfLayer._vsizeRect,targetPos) then
        //var movePoint = cc.pSub(p,cc.p(current_drag:getPositionX(),current_drag:getPositionY()))
        //var contentSptPoint = {}
        //for key ,contentPiece in pairs(currentContents) do
        //    if key ~= current_drag:getTag() then
        //contentSptPoint.x =  contentPiece.sprite:getPositionX() + movePoint.x
        //contentSptPoint.y =  contentPiece.sprite:getPositionY() + movePoint.y
        //contentPiece.sprite:setPosition(cc.pAdd(contentSptPoint,beginPoint))
        //end
        //end
        //current_drag:setPosition(cc.pAdd(p,beginPoint))
        //end
    },
    onTouchEndedFun : function(sender){

    },
    onTouchCanceledFun : function(sender){

    },
    onTouchFun:function(type,sender){
        switch(type){
            case ccui.Widget.TOUCH_BEGAN:
                this.onTouchBeganFun(sender)
                break;
            case ccui.Widget.TOUCH_MOVED:
                this.onTouchMovedFun(sender)
                break;
            case ccui.Widget.TOUCH_ENDED:
                this.onTouchEndedFun(sender)
                break;
            default :
                this.onTouchCanceledFun(sender)
                break;
        }

    }
})

var jigsawScene = cc.Scene.extend({
    _sceneId: 0,
    _gameId: 0,
    _taskid: 0,
    ctor: function (sid, gid, tid) {
        this._super()
        this._sceneId = sid
        this._gameId = gid
        this._taskid = tid
    },
    onEnter: function () {
        this._super()
        var layer = new jigsawLayer(this._sceneId, this._gameId, this._taskid)
        this.addChild(layer)
    },
    cleanup: function () {
        this._super()
    },
    onExit: function () {
        this._super()
    }
})