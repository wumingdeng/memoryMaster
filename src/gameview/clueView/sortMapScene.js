/**
 * Created by Fizzo on 16/7/8.
 */

var _sceneId = null;
var _gameId = 0;
var _isOutline = false;
var _curMaskLight = null;
var _curLightTable = null;

var sortMapLayer = cc.Layer.extend({
    sprite:null,
    _node:null,
    _checkPos:[],
    largerDistance : 0,
    innerPos : cc.p(),
    _curSortNum : 0,
    _curPiece:null,
    _clueCount:0,
    _allClueCount:0,
    ctor:function () {
        this._super();
        this._checkPos = [{x:530.21,y:400.30,r:2},{x:234.03,y:511.39,r:2},{x:117.82,y:321.84,r:1},{x:433.78,y:516.38,r:2},{x:176.91,y:176.04,r:3},{x:439.94,y:267.28,r:3}];
        var sortMap = ccs.load(res.gameScene8_json).node;
        this.addChild(sortMap);
        for (var i = 1; i <= this._checkPos.length; i++) {
            var image = sortMap.getChildByName("Image_" + i);
            image.addTouchEventListener(this.onTouchFun,this)
        }
        return true;
    },
    onTouchFun:function(sender,type) {
        if (type == ccui.Widget.TOUCH_BEGAN) {
            if (this._curPiece) return
            else {
                sender.setLocalZOrder(1)
                this._curPiece = sender
                var beganPos = sender.getTouchBeganPosition()
                this.innerPos = cc.pSub(cc.p(sender.x, sender.y), beganPos)
            }
        } else if (type == ccui.Widget.TOUCH_MOVED) {
            var beganPos = sender.getTouchBeganPosition()
            var movePos = sender.getTouchMovePosition()
            if (this.isInnerSide(movePos)) {
                var distance = Math.sqrt(Math.pow((beganPos.x - movePos.x), 2) + Math.pow((beganPos.y - movePos.y), 2))
                if (distance > this.largerDistance) this.largerDistance = distance
                if (this.largerDistance > 5) {
                    movePos = cc.pAdd(movePos, this.innerPos)
                    sender.setPosition(movePos)
                }
                //if (this.checkPiecePlace() ) {
                //    _curLightTable[sender.getTag()].setPosition(movePos)
                //    _curLightTable[sender.getTag()].setVisible(true)
                //}
                //else{
                //    _curLightTable[sender.getTag()].setVisible(false)
                //}
            }
        } else if (type == ccui.Widget.TOUCH_ENDED) {
            if (this.largerDistance <= 5) {
                var txtName = sender.getChildByName("txtName")
                txtName.setRotation(txtName.getRotation() - 90)
                sender.setRotation(sender.getRotation() + 90)
            }
            var isSign = this.checkPiecePlace()
            if (isSign) {
                this._curSortNum = this._curSortNum + 1
                sender.setTouchEnabled(false)
                var signPos = this._checkPos[this._curPiece.getTag()-1]
                var moveTo = cc.moveTo(1, cc.p(signPos.x, signPos.y))
                function checkIsSuccess() {
                    if (this._checkPos.length == this._curSortNum) {
                        this.success()
                    }
                }
                sender.runAction(cc.sequence(moveTo, cc.callFunc(checkIsSuccess,this)))
                //_curLightTable[sender.getTag()].setVisible(false)
            }
            this.largerDistance = 0
            sender.setLocalZOrder(0)
            this._curPiece = null
        }
    },
    isInnerSide:function(sourcePos) {
        if( sourcePos.x + sourcePos.width / 4 > vSize.width)
            return false
        else if(sourcePos.x - sourcePos.width / 4 < 0)
            return false
        else if(sourcePos.y - sourcePos.height / 4 < 0)
            return false
        else if(sourcePos.y + sourcePos.height/ 4 > vSize.height)
            return false
        else
            return true
    },
    //
    success:function () {
        if (this._clueCount == this._allClueCount) {
            //TODO do you want to do something
            console.log("fuck you")
        }
    },
    //返回 0 1 2 3 表示四个方向
    getCurrentPieceRotation:function () {
        return (this._curPiece.getRotation() / 90) % 4
    },
    //-- 首先获取静态数据取到当前需要找的点
    //-- 然后检索当前的可视区域里手否有存在静态数据里的点
    checkPiecePlace:function() {
        var curX = this._curPiece.x
        var curY = this._curPiece.y
        var placePos = this._checkPos[this._curPiece.getTag()-1]
        var sourceX = placePos.x
        var sourceY = placePos.y
        var rotationIdx = placePos.r
        var dins = Math.sqrt(Math.pow((curX - sourceX), 2) + Math.pow((curY - sourceY), 2))
        if (dins > 50)
            return false
        else {
            if (rotationIdx == this.getCurrentPieceRotation())
                return true
            else
                return false
        }
    }
});

var sortMapScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new sortMapLayer();
        this.addChild(layer);
    }
});

