/**
 * Created by Fizzo on 16/7/8.
 */
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
    _curMaskLight:[],
    _curLightTable:[],
    _isOutline:false,
    _gameId:0,
    _sceneId:0,
    ctor:function (gid,par) {
        this._super();
        this._gameId = gid
        this._checkPos = GAME_CONFIG["g"+gid].checkPos;
        var sortMap = par._ui;
        
        // this.addChild(sortMap);
        for (var i = 1; i <= this._checkPos.length; i++) {
            var image = sortMap.getChildByName("Image_" + i);
            var txtName = image.getChildByName("txtName")
            image.addTouchEventListener(this.onTouchFun,this)
            var maskSpt = shaderHelper.setSurroundingAreaLight(image,cc.math.vec3(1,1,0))
            maskSpt.setVisible(false)
            this._curLightTable[i-1] = maskSpt
            sortMap.addChild(maskSpt)
            image.setRotation(0)
            txtName.setRotation(0)
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
                /*检测到在目标区域范围里，该对象的光晕效果打开否则关闭*/
                 if (this.checkPiecePlace() ) {
                    this._curLightTable[sender.getTag()-1].setPosition(movePos)
                     this._curLightTable[sender.getTag()-1].setVisible(true)
                 }
                 else{
                     this._curLightTable[sender.getTag()-1].setVisible(false)
                 }
            }
        } else if (type == ccui.Widget.TOUCH_ENDED) {
            /*在移动范围不超过 5像素做单击处理*/
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
                this._curLightTable[sender.getTag()-1].setVisible(false)
            }
            this.largerDistance = 0
            sender.setLocalZOrder(0)
            this._curPiece = null
        }else if(type == ccui.Widget.TOUCH_CANCELED){
            this.largerDistance = 0
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
            var trueRt = rotationIdx == this.getCurrentPieceRotation()
            return trueRt
        }
    }
});


