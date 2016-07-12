 /**
 * Created by chenzhaowen on 16-4-18.
 */

//require("gameview.ClueCommonLayer")

var g_sharedScratchScene;
scratchScene = cc.Layer.extend({
    _uiLayer: null,
    _commonUI: null,
    _dialog: null,
    _caseid: 0,
    _sceneid: 0,
    _taskid: 0,
    _sceneFilePath: null, //文件路径
    _sceneFileName: null, //文件名
    eventDispatcher: null,
    mask: null, //擦除的线
    find: null, //要找的物体
    top: null, //遮挡的图
    topSize: null, //顶层大小
    renderTexture: null,
    targetCount: null,
    drawCount: 0, //已经擦掉了多少像素
    targetWidth: null,
    targetHeight: null,
    pixels: [], //存擦除标志
    drawWidth: 20, //擦除的宽度
    beginPoint: null,
    endPoint: null,
    drawPoint: {}, //把要绘制的点存起来
    isFind: false, //是否找到
    ranCount: 0, //随机宽度划线的计数
    isBegin: false, //开始点击，屏蔽第二个点击的点
    osTime: null, //用来看运行时间
    isDebug: true, //是否调试
    
    init: function(caseid, sceneid, taskid, gameId) {
        this._caseid = caseid;
        this._sceneid = sceneid;
        this._taskid = taskid;
        this.isFind = false;

        winSize = cc.director.getWinSize();
        var json = ccs.load("res/gameScene/scratch/scratch1.json","res/");
        
        var game = json.node, action = json.action;
        this.addChild(game);
        console.log(game.getContentSize());
        console.log(cc.view.getCanvasSize());
        game.x = (winSize.width - game.width) / 2;
        var bg = new cc.Sprite("res/background/ClueUI_bg.jpg");
        this.addChild(bg, -1);
        bg.attr({
            x: (winSize.width - game.width) / 2,
            y: 0,
            anchorX: 0,
            anchorY: 0
        });
        
        this.find = game.getChildByName("find")
        //初始化遮罩
        this.mask = new cc.DrawNode();
        this.mask.retain();
        //初始化要寻找物体的信息
        this.targetWidth = this.find.getContentSize().width;
        this.targetHeight = this.find.getContentSize().height;
        this.targetCount = this.targetWidth * this.targetHeight;
        //var findTexture = find.getTexture();
        for (var i = 0; i < this.targetWidth; ++i) {
            this.pixels[i] = [];
            for (var j = 0; j < this.targetHeight; ++j) {
                if (false) {
                    this.pixels[i][j] = 1;
                    this.drawCount++;
                } else {
                    this.pixels[i][j] = 0;
                }
            }
        }
        
        this.targetCount = this.targetCount - this.drawCount; //要找的点数要减去透明像素
        this.drawCount = 0
        //    cc.Texture2D.setNeedGetAlpha(false) //关闭Textrue2d取透明度

        //添加遮挡的图
        this.top = game.getChildByName("mask");
        //    top.setVisible(false)
        this.top.removeFromParent();
        this.topSize = this.top.getContentSize();
        this.top.setAnchorPoint(0, 0);
        this.top.setPosition(0, 0);
        //加个RenderTexture判断像素
        this.renderTexture = new cc.RenderTexture(this.topSize.width, this.topSize.height, cc.Texture2D.PIXEL_FORMAT_RGBA8888);
        //TODO 位置要根据配置来设置
        this.renderTexture.setPosition(winSize.width / 2, winSize.height / 2 - 50);
        this.renderTexture.beginWithClear(0, 0, 0, 0);
        this.top.visit() //把遮挡显示出来
        this.renderTexture.end()
        
        this.addChild(this.renderTexture);

        //载入公共UI
        //var taskstatic = gfun.findTaskstaticByTaskid(taskid)
        //var png = taskstatic[CaseHubData.Taskinfo.TASK_LOGO2]
        //self._commonUI = ClueCommonLayer.create(png,onFinish,self._caseid,taskid,gameId)
        //self.addChild(self._commonUI)


        //注册事件
        if ('touches' in cc.sys.capabilities) {
            cc.eventManager.addListener({
                prevTouchId: -1,
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                onTouchBegan: this.TouchBegan,
                onTouchMoved: this.TouchMoved,
                onTouchEnded: this.TouchEnded,
                onTouchCancelled: this.TouchCancelled
            }, this);
        } else {
            cc.log("MOUSE Not supported");
        }
        
        return true;
    },
    TouchBegan: function(event) {
        var self = event.getCurrentTarget();
        if (!self.isBegin) {
            cc.log("Let's begin...");
            self.beginPoint = cc.p(event.getLocation());
            self.drawPoint = [self.beginPoint];
            self.isBegin = true;
            return true;
        } else {
            return false;
        }
    },
    moveCount: 0, //移动计数
    TouchMoved: function(event) {
        if (event.getButton() == cc.EventMouse.BUTTON_LEFT) {
            var self = event.getCurrentTarget();
            if (self.isBegin) {
                self.moveCount++;
                self.endPoint = cc.p(event.getLocation()) //获取当前的点
                self.calcPoint(self.beginPoint, self.endPoint);
                self.drawPoint.push(self.endPoint);
                if (self.moveCount % 5 == 0) { //每5次
                    self.drawMask();
                }
                self.beginPoint = self.endPoint;
            }
        }
    },
    TouchEnded: function(event) {
        var self = event.getCurrentTarget();
        cc.log("ended");
        self.drawMask();
        self.moveCount = 0;
        self.isBegin = false;
    },
    TouchCancelled: function(event) {
        var self = event.getCurrentTarget();
        self.isBegin = false;
    },
    drawMask: function() {
        var ranWidth = this.drawWidth; //随机线宽
        var drawBegin;  //开始绘制的点
        this.ranCount++;
        if (this.ranCount%3 == 0) {
            ranWidth = this.drawWidth + parseInt(6 * Math.random() - 3, 10);
        }
        for (var i in this.drawPoint) {
            if (i == "0") {
                drawBegin = this.drawPoint[i];
            } else {
                //坐标转换到renderTexture上
                var bp = this.renderTexture.convertToNodeSpace(drawBegin);
                bp.x = bp.x + this.topSize.width / 2;
                bp.y = bp.y + this.topSize.height / 2;
                var ep = this.renderTexture.convertToNodeSpace(this.drawPoint[i]);
                ep.x = ep.x + this.topSize.width / 2;
                ep.y = ep.y + this.topSize.height / 2;
                this.mask.drawSegment(bp, ep, ranWidth / 2 + 2, cc.color(255, 0, 0, 255*.2));
                this.mask.drawSegment(bp, ep, ranWidth / 2, cc.color(0, 0, 255, 255));
                drawBegin = this.drawPoint[i];
            }
        }

        this.drawPoint = [drawBegin];
        //    mask:setBlendFunc(0,GL_ONE_MINUS_SRC_ALPHA) //设置颜色混合模式
        this.mask.setBlendFunc(0,gl.ONE_MINUS_SRC_ALPHA); //设置颜色混合模式
        this.renderTexture.begin();
        this.mask.visit();
        this.renderTexture.end();
    },
    calcPoint: function(beginP, endP) {
        if (!this.isFind && (cc.rectContainsPoint(this.find.getBoundingBox(),endP) || cc.rectContainsPoint(this.find.getBoundingBox(),beginP))) { //其中一个触摸点在区域内
            var relativeX = endP.x - this.find.getBoundingBox().x;  //当前相对的x坐标
            var relativeY = endP.y - this.find.getBoundingBox().y;  //当前相对的y坐标
            var brelativeX = beginP.x - this.find.getBoundingBox().x;   //相对目标区域的开始点x坐标
            var brelativeY = beginP.y - this.find.getBoundingBox().y;   //相对目标区域的开始点y坐标
            if (relativeX < brelativeX) { //保证开始点在左边
                var temp = relativeX;
                relativeX = brelativeX;
                brelativeX = temp;
                var temp = relativeY;
                relativeY = brelativeY;
                brelativeY = temp;
            }
            var minY;  //分出y坐标的大小
            var maxY;
            if (relativeY > brelativeY) {
                maxY = relativeY;
                minY = brelativeY;
            } else {
                maxY = brelativeY;
                minY = relativeY;
            }
            //按照鼠标的位置和擦除的宽度，把pixels里面的标志变成1;
            //把在区域外的点转换到区域内
            var exchangePoint = null;   //要替换的点
            //依次判断两点连线与区域四条边是否相交，相交的话取交点，再把区域外的点换成交点
            //求左边的交点
            var intersection = cc.pIntersectPoint(cc.p(brelativeX, brelativeY), cc.p(relativeX, relativeY), cc.p(0, 0), cc.p(0, this.targetHeight));
            if (intersection.x <= relativeX && intersection.x >= brelativeX
                && intersection.y <= maxY
                && intersection.y >= minY) {
                exchangePoint = intersection    //满足条件说明交点在线段上
            }
            if (!exchangePoint) {   //跟上边求交点
                intersection = cc.pIntersectPoint(cc.p(brelativeX, brelativeY), cc.p(relativeX, relativeY), cc.p(0, this.targetHeight), cc.p(this.targetWidth, this.targetHeight))
                if (intersection.x <= relativeX && intersection.x >= brelativeX
                    && intersection.y <= maxY
                    && intersection.y >= minY) {
                    exchangePoint = intersection;
                }
            }
            if (!exchangePoint) {   //跟右边求交点
                intersection = cc.pIntersectPoint(cc.p(brelativeX, brelativeY), cc.p(relativeX, relativeY), cc.p(this.targetWidth, 0), cc.p(this.targetWidth, this.targetHeight))
                if (intersection.x <= relativeX && intersection.x >= brelativeX
                    && intersection.y <= maxY && intersection.y >= minY) {
                    exchangePoint = intersection;
                }
            }
            if (!exchangePoint) {   //跟下边求交点
                intersection = cc.pIntersectPoint(cc.p(brelativeX, brelativeY), cc.p(relativeX, relativeY), cc.p(this.targetWidth, 0), cc.p(0, 0))
                if (intersection.x <= relativeX && intersection.x >= brelativeX
                    && intersection.y <= maxY && intersection.y >= minY) {
                    exchangePoint = intersection;
                }
            }
            //经过上面的步骤，肯定找到线段和矩形的交点了
            if (!cc.rectContainsPoint(cc.rect(0, 0, this.find.getBoundingBox().width, this.find.getBoundingBox().height), cc.p(relativeX, relativeY))){
                //end点在区域外
                relativeX = exchangePoint.x;    //把endP换成相交的点
                relativeY = exchangePoint.y;   //把endP换成相交的点
            } else if (!cc.rectContainsPoint(cc.rect(0,0,this.find.getBoundingBox().width,this.find.getBoundingBox().height),cc.p(brelativeX,brelativeY))){
                //begin点在区域外
                brelativeX = exchangePoint.x  //把beginP换成相交的点
                brelativeY = exchangePoint.y;
            }
            //求斜率 要保证分母不为0;
            var kk = (relativeX - brelativeX) == 0 ?  1  : (relativeY - brelativeY)/(relativeX - brelativeX);
            var bb = relativeY - kk*relativeX;   //根据公式。。。。y = kx + bb。。。求b;
            var Normalize = cc.pNormalize(cc.p(relativeX - brelativeX,relativeY - brelativeY)) ;   //创建单位向量
            var distance = cc.pDistance(beginP,endP);   //两点的距离
            var forX = brelativeX;
            var forY = brelativeY; //用于循环
            //先置一遍开始点附近的标志位
            var xfrom = brelativeX-this.drawWidth/2 < 0 ?  0  : brelativeX - this.drawWidth/2;
            var xto = brelativeX+this.drawWidth/2 > this.targetWidth ? this.targetWidth : brelativeX+this.drawWidth/2;
            var yfrom = brelativeY-this.drawWidth/2 < 0 ?  0  : brelativeY - this.drawWidth/2;
            var yto = brelativeY+this.drawWidth/2 > this.targetHeight ? this.targetHeight : brelativeY+this.drawWidth/2;
            for (var fx = xfrom;fx <= xto;++fx){
                for (var fy = yfrom;fy <= yto; ++fy){
                    if (this.pixels[Math.floor(fx)][Math.floor(fy)] == 0) {
                        this.drawCount = this.drawCount + 1;   //擦除计数加1;
                        this.pixels[Math.floor(fx)][Math.floor(fy)] = 1;
                    }
                }
            }
            // print("distance:",distance)
            //开始按照标准向量置标志位
            for (var dis = 0;dis <= distance;dis += 2) { //距离递增的循环
                forX = forX + Normalize.x * 2;
                forY = forY + Normalize.y * 2;
                if (Normalize.y > 0) { //线段有向右上方延伸的趋势，只要置取点为中心取到的矩形的右边和上边
                    if (forY + this.drawWidth / 2 < this.targetHeight) {
                        //置矩形上边的标志位
                        var xfrom = forX - this.drawWidth / 2 < 0 ?  0  : forX - this.drawWidth / 2;
                        var xto = forX + this.drawWidth / 2 > this.targetWidth ? this.targetWidth : forX + this.drawWidth / 2;
                        for (var xx = xfrom; xx <= xto; ++xx) {
                            if (this.pixels[Math.floor(xx)][Math.floor(forY + this.drawWidth / 2)] == 0) {
                                this.drawCount++;   //擦除计数加1;
                                this.pixels[Math.floor(xx)][Math.floor(forY + this.drawWidth / 2)] = 1;
                            }
                        }
                    }
                } else {   //线段有向右下方延伸的趋势，只要置取点为中心取到的矩形的右边和下边
                    if (forY - this.drawWidth / 2 > 0) {
                        //置矩形下边的标志位
                        var xfrom = forX - this.drawWidth / 2 < 0 ?  0  : forX - this.drawWidth / 2;
                        var xto = forX + this.drawWidth / 2 > this.targetWidth ? this.targetWidth : forX + this.drawWidth / 2;
                        for (var xx = xfrom; xx <= xto; xx++) {
                            if (this.pixels[Math.floor(xx)][Math.floor(forY - this.drawWidth / 2)] == 0) {
                                this.drawCount = this.drawCount + 1;   //擦除计数加1;
                                this.pixels[Math.floor(xx)][Math.floor(forY - this.drawWidth / 2)] = 1;
                            }
                        }
                    }
                }

                if (forX + this.drawWidth / 2 < this.targetWidth) {
                    //置矩形右边的标志位
                    var yfrom = forY - this.drawWidth / 2 < 0 ?  0  : forY - this.drawWidth / 2;
                    var yto = forY + this.drawWidth / 2 > this.targetHeight ? this.targetHeight : forY + this.drawWidth / 2;
                    for (var yy = yfrom; yy <= yto; ++yy) {
                        if (this.pixels[Math.floor(forX + this.drawWidth / 2)][Math.floor(yy)] == 0) {
                            this.drawCount = this.drawCount + 1;   //擦除计数加1;
                            this.pixels[Math.floor(forX + this.drawWidth / 2)][Math.floor(yy)] = 1;
                        }
                    }
                }
            } //距离循环结束

            //现在标志位置完了 判断擦除计数
            cc.log(this.drawCount + "/" + this.targetCount);
            if (this.drawCount > this.targetCount*0.6) {
                cc.log("you win.......................");
                this.isFind = true;
                this.backToMenu();
                //            selfLayer._commonUI:GameEnd()
                //selfLayer._commonUI:GameConfirm()
                //播放兰花动画
                //var finishAnimation,finishAction = cfun.createAnimation(selfLayer._sceneFilePath.."finishEffect.csb")
                //finishAnimation:setPosition(find:getPosition())
                //find:getParent():addChild(finishAnimation)
                //find:setVisible(true)
                //finishAction:gotoFrameAndPlay(0,false)
            }

        }
    },

    backToMenu:function() {
        var scene = new cc.Scene();
        scene.addChild(new SysMenu());
        cc.director.runScene(new cc.TransitionFade(1.2, scene));
    },

    ctor: function() {
        this._super();
        this.init(1, 1, 1, 1);
    }

});

scratchScene.scene = function() {
    var scene = new cc.Scene();
    var layer = new scratchScene();
    scene.addChild(layer);
    return scene;
};


