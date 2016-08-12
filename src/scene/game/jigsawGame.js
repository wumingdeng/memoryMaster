/**
 * Created by Fizzo on 16/7/13.
 */

var jigsawGame = cc.Layer.extend({
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
    _listener:null,
    _current_r : null,
    _current_drop : null,
    _pieceInitPos:[],
    _adjacent:[],
    _index:null,    //游戏序号
    _node:null,
    ctor: function (index, ui ,tid) {
        this._super()
        //cc.Texture2D.setNeedGetAlpha(true)  //打开取透明度
        this._index = index;
        this._node = ui;
        this._taskId = tid;
        this.initLayer()
    },
    initLayer: function () {
        this._current_drag = null
        this._vsizeRect.width = cc.winSize.width
        this._vsizeRect.height = cc.winSize.height
        this._vsizeRect.x = 0
        this._vsizeRect.y = 0

        this._node.setPosition(vsize.width / 2, vsize.height / 2)

        this.analysisAdjacentData(this._index)
        this._node.setLocalZOrder(2)


        this._zNum = this._pieceCount //初始的z坐标设置为碎片的最大个数

        var _listener = cc.EventListener.create({
            swallowTouches:true,
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: this.onTouchBeganFun.bind(this),
            onTouchMoved: this.onTouchMovedFun.bind(this),
            onTouchEnded: this.onTouchEndedFun.bind(this),
            onTouchCancelled: this.onTouchCanceledFun.bind(this)
        });
        var sprites = this._node.getChildren()
        for (var key in sprites) {
            var spt = sprites[key]
            if (spt.name == "BG" || spt.tag == 0){
                continue;
            }
            if(key == "0")
                cc.eventManager.addListener(_listener, spt);
            else{
                cc.eventManager.addListener(_listener.clone(), spt);
            }

            this._pieceCount++
        }
        this.initAdjacentInfo()
    },
    initAdjacentInfo:function(){
        var spts = this._node.getChildren()
        for (var key in spts) {
            var target = spts[key]
            if (target.name == "BG" || target.tag == 0){
                continue;
            }
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

    },
    getElementByTag:function(arr,tag){
        for(var idx in arr){
            var temp = arr[idx]
            if(temp.t = tag)
                return temp
        }
    },
    /**
     * 根据两个tag值判断是否为相邻的对象
    * @param {Number} tarTag
    * @param {Number} souTag
     * */
    isAdjacnet:function(tarTag,souTag){
        var tarAdj = this._adjacent[tarTag]
        for(var key in tarAdj){
            var tar = tarAdj[key]
            if (souTag == tar) return true
        }
        return false
    },
    /**
     * 获取相邻对象的数据
     * @param {cc.Sprite} tar
     * @param {cc.Sprite} sou
     * */
    getAdjacentInfo:function(tar,sou){
        var adjacentInfo = {}
        var targetPos = this._pieceInitPos[tar.getTag()]
        var adjacentPos = this._pieceInitPos[sou.getTag()]
        adjacentInfo.direction = cc.p(adjacentPos.x-targetPos.x,adjacentPos.y-targetPos.y)
        adjacentInfo.distance = Math.sqrt(adjacentInfo.direction.x*adjacentInfo.direction.x + adjacentInfo.direction.y*adjacentInfo.direction.y)
        adjacentInfo.direction.x = adjacentInfo.direction.x/adjacentInfo.distance
        adjacentInfo.direction.y = adjacentInfo.direction.y/adjacentInfo.distance
        adjacentInfo.originPoint = cc.p(targetPos.x-adjacentPos.x,targetPos.y - adjacentPos.y)
        return adjacentInfo
    },
    /*获取数组中有效的元素的个数*/
    getElementNum:function(arr){
        var num = 0
        arr.forEach(function(e){
            if(e != null)
                num++
        })
        return num;
    },
    onTouchBeganFun:function(touch, event) {
        
        if (this._isTouch)  return false
        if (this._isGameEnd) return false
        var sender = event.getCurrentTarget()
        var p = sender.getParent().convertTouchToNodeSpace(touch)
        if (cc.rectContainsPoint(sender.getBoundingBox(),p))
        {
            if (!cfun.getOriginalAlphaPoint(sender,touch.getLocation())) {
                this._isTouch = true
                event.stopPropagation()
                this._currentContents = this._piece_joined[sender.getTag()]
                this._current_drag = sender
                this._beginPoint = sender.convertTouchToNodeSpace(touch)
                var midPoint = cc.p(sender.width / 2, sender.height / 2)
                this._beginPoint = cc.pSub(midPoint, this._beginPoint)

                if (this.getElementNum(this._currentContents) != this._pieceCount) {
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
            } else {
                return false
            }
        }else{
            return false
        }
    },
    onTouchMovedFun : function(touch, event){
        var p = event.getCurrentTarget().getParent().convertTouchToNodeSpace(touch)
        var targetPos = cc.pAdd(touch.getLocation(),this._beginPoint)
        //filter current source moved to outside of scene
        if (cc.rectContainsPoint(this._vsizeRect,targetPos)) {
            var movePoint = cc.pSub(p, cc.p(this._current_drag.x, this._current_drag.y))
            var contentSptPoint = cc.p()
            for (var key  in this._currentContents) {
                if (key != this._current_drag.getTag()) {
                    var contentPiece = this._currentContents[key]
                    contentSptPoint.x = contentPiece.sprite.x + movePoint.x
                    contentSptPoint.y = contentPiece.sprite.y + movePoint.y
                    contentPiece.sprite.setPosition(cc.pAdd(contentSptPoint, this._beginPoint))
                }
            }
            this._current_drag.setPosition(cc.pAdd(p, this._beginPoint))
        }
    },
    onTouchEndedFun : function(touch, event){
        this._current_r = this._current_drag.getBoundingBox()
        var smallest_d = 9999999
        var sm = null
        this._isTouch = false
        for (var key in this._currentContents) {
            var currentPiece = this._currentContents[key]
            if (this.isIntersectWithOther(currentPiece)) {
                //  find smallest distance of all intersect pieces?
                var drag_rect = this._current_drag.getBoundingBox()
                var target_rect = this._current_drop.sprite.getBoundingBox()
                var current_d = (drag_rect.x - target_rect.x) * (drag_rect.x - target_rect.x) +
                    (drag_rect.y - target_rect.y) * (drag_rect.y - target_rect.y)
                if (current_d < smallest_d) {
                    this._current_drag = currentPiece.sprite
                    sm = this._current_drag
                    smallest_d = current_d
                    var adjacentPiece = this._current_drop.adjacent_piece_tags[this._current_drag.getTag()]
                    //if adjacentPiece == nil ,maybe adjacent staticdata is worry
                    if (adjacentPiece) {
                        var originPoint = adjacentPiece.originPoint
                        var cur_move_point = cc.p(this._current_drop.sprite.x - originPoint.x, this._current_drop.sprite.y - originPoint.y)
                        var cur_content_move_point = cc.pSub(cur_move_point, cc.p(this._current_drag.x, this._current_drag.y))
                        var moveBy = new cc.MoveTo(0.5, cur_move_point)

                        function moveEndFun() {
                            if (this.getElementNum(this._currentContents) == this._pieceCount) {
                                this._isGameEnd = true
                                //selfLayer._commonUI.GameConfirm(4)
                                function onPlayAnimation() {
                                    //--播放找到物品的效果
                                    //local finishAnimation,finishAction = cfun.createAnimation(selfLayer._sceneFilePath.."clue4_faguangtexiao.csb")
                                    //finishAnimation.setPosition(vsize.width/2,vsize.height/2)
                                    //selfLayer._uiLayer.addChild(finishAnimation,1)
                                    //finishAction.gotoFrameAndPlay(0,false)
                                }

                                //先移到中间
                                for (var key in this._currentContents) {
                                    var contentPiece = this._currentContents[key]
                                    var move = cc.MoveTo.create(1, this._pieceInitPos[contentPiece.tag])
                                    if (key == this._pieceCount) {
                                        contentPiece.sprite.runAction(new cc.Sequence(move.clone(), new cc.CallFunc(onPlayAnimation)))
                                    } else {
                                        contentPiece.sprite.runAction(move.clone())
                                    }
                                }

                                //完成任务
                                this.finishGame()
                            }
                        }

                        var moveCallBack = new cc.CallFunc(moveEndFun.bind(this))
                        this._current_drag.runAction(new cc.Sequence(moveBy, moveCallBack))
                        for (var key in this._currentContents) {
                            var contentPiece = this._currentContents[key]
                            if (contentPiece.tag != this._current_drag.getTag()) {
                                var contentSptPoint = {}
                                contentSptPoint.x = contentPiece.sprite.x + cur_content_move_point.x
                                contentSptPoint.y = contentPiece.sprite.y + cur_content_move_point.y
                                var moveBy = new cc.MoveTo(0.5, contentSptPoint)
                                contentPiece.sprite.runAction(moveBy)
                            }
                        }
                        this._currentContents[this._current_drop.tag] = this._current_drop
                        var targetContents = this._piece_joined[this._current_drop.tag]
                        for (var key in targetContents) {
                            var tar = targetContents[key]
                            this._currentContents[tar.tag] = tar
                        }
                        for (var key in this._currentContents) {
                            var cur = this._currentContents[key]
                            cur.sprite.setLocalZOrder(this._zNum)
                            this._piece_joined[cur.tag] = this._currentContents
                            targetContents[cur.tag] = cur
                        }
                        //判断游戏结束
                        if (this._currentContents == this._pieceCount) {
                            this._isGameEnd = true
                        }
                        break
                    }
                }
            }
        }
        this._current_drop = sm
    },
    onTouchCanceledFun : function(touch, event){
        this._isTouch = false
    },
    /**
     * 判断是否已经拼凑在一起
     * @param {cc.Sprite} drag
     * @param {cc.Sprite} drop
     * */
    isNotJoined:function(drag,drop){
        if (drag.tag == drop.tag) return false
        var join = this._piece_joined[drag.tag][drop.tag] == null
        return join
    },
    isIntersectWithOther:function(drag) {
        if (this._pieces.length <= 0) return false
        var dragAdjArr = this._adjacent[drag.tag]
        for (var key in dragAdjArr){
            var adj = dragAdjArr[key]
            var drop = this._pieces[adj]
            if (this.isNotJoined(drag, drop)) {
                // check direct vector to make sure it is in correct direction
                var ai = drag.adjacent_piece_tags[drop.tag]
                var current_direction = cc.p(drop.sprite.getPositionX() - drag.sprite.x, drop.sprite.y - drag.sprite.y)
                var current_distance = Math.sqrt(current_direction.x * current_direction.x + current_direction.y * current_direction.y)
                if (Math.abs(ai.distance - current_distance) <= 15) {
                    // make dot
                    if (current_distance != 0) {
                        current_direction.x = current_direction.x / current_distance
                        current_direction.y = current_direction.y / current_distance
                    }
                    var dot = ai.direction.x * current_direction.x + ai.direction.y * current_direction.y
                    if (dot > 1)
                        dot = 1
                    if (dot < -1)
                        dot = -1
                    var angle = Math.acos(dot)
                    if (angle < Math.PI / 32) {
                        this._current_drop = drop
                        return true
                    }
                }
            }
        }
        return false
    },
    /**解析相邻的静态数据
     * @param {Number} sdIdx 静态数据的索引ID
     * */
    analysisAdjacentData:function(){
        var adjacentStr = GAME_CONFIG["g"+this._index].adjacent
        var adjacentPositionStr = GAME_CONFIG["g"+this._index].com_pos
        var adjacent = adjacentStr.split("_")
        var adjacentPos = adjacentPositionStr.split("_")

        var length = adjacent.length>adjacentPos.length?adjacent.length:adjacentPos.length
        for(var idx = 0;idx<length;idx++) {
            var adj = adjacent[idx]
            var adjPos = adjacentPos[idx]
            var adjTags = adj.split("`")
            var adjacentPositionsArray = adjPos.split("`")
            var tempArr = []
            for (var i in adjTags) {
                var adj = adjTags[i]
                tempArr.push(Number(adj))
            }
            this._pieceInitPos.push(cc.p(Number(adjacentPositionsArray[0]),Number(adjacentPositionsArray[1])))
            this._adjacent.push(tempArr)
        }
    },

    finishGame:function(){
        trace("完成拼图")
        this.parent.finishGame();
    }
})