/**;
 * Created by chenzhaowen on 16/4/22.;
 */;

var s_searchItemLayer = null;
var searchItemLayer = cc.Layer.extend({
    game:null,
    menuLayer:null,
    _fullCover:null, //做暂停的遮挡;
    _tipEffectTab:{},  //提示效果的存放数组;
    _curItemList:[], //当前的物品列表中的物品;
    _curAndClickedItemList:{}, //当前与被寻找过的物品列表;
    _isPlayFindAnimation:false,  //正在播放找到物品动作;
    _reward:{}, //游戏过程中获得的奖励 。“奖励类型｀奖励个数”;
    _dragItem:null, //可拖动的物品;

    _sceneid:null,    //提示效果;
    compass:null, //道具 真*罗盘;
    compassTarget:null,    //罗盘道具指向的目标;
    bottom:null,
    animationCount:0,    //用来判断物品动作是否播放完了;
    area:null,    //缩放区域;
    isPlayTip:false, //是否在播放提示动作;

    itemPanel:null,

    _checkClickItems:[],  //可点击的物品 里面可能会有奖励物品;

    _actionItems:[],   //特殊动作的物品;

    loadBackgroundTimeID:0,



    _itemScene:null,    //整个场景;
    schemeNum:0, //方案数;
    itemTab:{},  //标记每个物品有几种摆法;
    schemeTab:{},   //存放不同方案;
    curScheme:null,   //当前方案;
    logText:null, //打印信息;

    totalItemNum:null,    //要找物品的
    remainItemNum:null,  //剩余物品数

    scenePath:null,

    ctor:function(game) {
        this._super();
        this.init(game);
    },
    init:function(game) {
        //cc.spriteFrameCache.addSpriteFrames(res.gameScene_1_zhuguang_plist);
        s_searchItemLayer = this;
        this.game = game;
        this._actionItems = [];  //初始化数组;
        //设置物品数;
        this.totalItemNum = this.game.itemAllCount;
        this.remainItemNum = this.totalItemNum;
        this._sceneid = game.sceneID;
        this.compass = null;
        this._contrlLayer =new cc.Layer();
        this.addChild(this._contrlLayer);
        this.isPlayTip = false;

        this.scenePath = "res/gameScene/searchGame/gameScene_" + Number(game.sceneID+1);

        var sceneFileName = this.scenePath + "/gameScene_" + Number(game.sceneID+1) + ".json";

        this._itemScene = ccs.load(sceneFileName).node;
        this.itemPanel = this._itemScene.getChildByName("scheme0");
        ///开始取不同方案的摆放位置;
        //this.reorderItem(this._itemScene);


        this._itemScene.setAnchorPoint(0,0);
        //默认视窗对准图的中心;
        this._itemScene.setPositionX(vsize.width/2 - this._itemScene.width/2);

        this.addChild(this._itemScene);

        var isMove = false;
        var isScroll = false;  //是否多点;
        var touchsNum = 0; //触点数;
        ///添加场景可缩放;

        var progressTime = 0;

        var dispatcherTime = 1;
        for (var i in this.game.prizeItemData) {
            this._checkClickItems.push(this.game.prizeItemData[i][Iteminfo.ID]);
        }

        function onTouchEnded(touch, event) {
            var self = event.getCurrentTarget();
            touchsNum = touchsNum - 1;
    //        if (event.invalidTouch == true) {
    //            return false;
    //        }
            if (self.game._selectEnabled == false) { cc.log("已被设置成不可选"); return; };  //是否可以选物品;
            if (self.game.isGameEnd == true) { return cc.log("游戏已结束"); };   //结束游戏后不可点击;
            if (touchsNum > 0) {
                return cc.log("多点点击");
            }


            if (isScroll) {
                isScroll = false;
                isMove = false;
                return;
            }
            if (isMove) {
                isMove = false;
                return;
            }

            var location = touch.getLocation();
            location = cc.pAdd(location,clickArea[dispatcherTime]);
            var p = self._itemScene.convertToNodeSpace(location);
            var temp = self.getClickItem(p);
            var hasCurListItem = temp[0];
            var curClickItem = temp[1];
            if (!hasCurListItem) {
                if (dispatcherTime<9) {
                    dispatcherTime = dispatcherTime + 1;
                    touchsNum = touchsNum + 1;
                    onTouchEnded(touch,event);
                } else {
                    dispatcherTime = 1;
                    self.game.top.onDoubleClicked(false,location.x,location.y);
                }
            } else {
                if (curClickItem == null) {
                    //说明点击到正在提示到物品了; //什么事都不做;
                    return false;
                }
                var coverItems = [];
                var arr = self.itemPanel.getChildren()
                for (var i in arr) {
                    if (cc.rectContainsPoint(arr[i].getBoundingBox(),p)) {
                        if (arr[i].getTag() >= 0) {   //过滤掉提示动画;
                            coverItems.push(arr[i]);
                        }
                    }
                }
                var maxZ = curClickItem.getLocalZOrder();
                var coverIdx = coverItems.length - 1;
                function hasCurItemList(itemID) {
                    for (var i in self._curItemList) {
                        if (self._curItemList[i] && itemID == self._curItemList[i].itemTag) {
                            return true;
                        }
                    }
                    return false;
                }
                while (coverIdx >= 0) {
                    var coverItem = coverItems[coverIdx];
                    if (coverItem.getLocalZOrder() > maxZ) {
                        var isCheckItem = hasCurItemList(coverItem.getTag()) && Iteminfo.data[coverItem.getTag() - 1][Iteminfo.ISTRANSPREN] == 1;
                        if (isCheckItem) {
                            curClickItem = coverItem;
                            break;
                        } else {
                            //做透明度判断
                            if (cfun.getOriginalAlphaPoint(coverItem,location)) {
                                cc.log("点击到透明区域");
                            } else {
                                curClickItem = coverItem;
                                break;
                            }
                        }
                    }
                    coverIdx = coverIdx - 1;
                }

                var index = self._checkClickItems.indexOf(curClickItem.getTag());
                //var index =  table.keyOfItem(self._checkClickItems,curClickItem.getTag());

                if (index>=0) {
                    dispatcherTime = 1;
                    self.itemTouchFun(curClickItem);
                } else {
                    if (dispatcherTime<9) {
                        dispatcherTime = dispatcherTime + 1;
                        touchsNum = touchsNum + 1;   //这里手动调用 没经过touchBegan 所以加1;
                        onTouchEnded(touch,event);
                    } else {
                        dispatcherTime = 1;
                        self.game.top.onDoubleClicked(false,location.x,location.y);
                    }
                }
            }
        }

        function onTouchMoved(touch,event){
            var self = event.getCurrentTarget();
            var location = touch.getLocation();
            var p = self.itemPanel.convertToNodeSpace(location);
            if (self._dragItem && !self._dragItem.isLock) {
                if (self._dragItem.getScale() == 1) {
                    self._dragItem.setPosition(p.x,p.y + 70);    //跟着移动;
                } else {
                    //正在播放点击动作 只改x坐标;
                    self._dragItem.setPositionX(p.x);
                }
                return true;
            }
            if (!isMove) {
                var dis = cc.pDistance(location,touch.getStartLocation());
                if (Math.abs(dis) > 30) {
                    isMove = true;
                }
            }
        }
        function onTouchBegan(touch, event){
            touchsNum = touchsNum + 1;
            if (touchsNum > 1) {
                isScroll = true;
            }
            var self = event.getCurrentTarget();
            var location = touch.getLocation();
            location = cc.pAdd(location,clickArea[dispatcherTime]);
            var p = self._itemScene.convertToNodeSpace(location);

            return true;
        }
        function onClearTouches(event){
            cc.log("收到自定义事件~！！ 多点出错 清空touch点");
            touchsNum = 0;
            isScroll = false;
            isMove = false;
        }

        cfun.addEventListener(this,onTouchBegan,onTouchMoved,onTouchEnded)

        /// remove unused item;
        var isOriginal = this.itemPanel.getName() == "scheme0"; //是否是原始摆放;

        for (var key in this.itemPanel.getChildren()) {
            var item = this.itemPanel.getChildren()[key];
            if (isOriginal) {
                item.setLocalZOrder(Number(key));    //原始摆放就设置下z值;
            }
        }
        for (var i in this._itemScene.getChildren()) {
            var child = this._itemScene.getChildren()[i];
            var name = child.getName();
            if (name.indexOf("scheme") != -1) {   //"scheme0是初始最佳摆法"
                if (name == "scheme0") {
                    child.setVisible(true);
                } else {
                    child.setVisible(false);
                }
            }
        }
        if (isOriginal) {
            ///加载配置的物品动画;
    //        this.loadItemAnimation();
        }
        cc.log("load } .........");
        this.animationCount = 0;
        return true;
    },
    //删除单个提示
    deleteTipByTag:function(tag) {
        if (MW.isTipAction) { //条件是提示存在 并且已经播放完提示动画
            //修改提示效果的数组
            var tip = s_searchItemLayer._tipEffectTab[tag];
            if (tip) {
                cc.log("清除",tip.name);
                tip.removeFromParent();
                delete s_searchItemLayer._tipEffectTab.tag;
            }
        }
    },

    //删除全部提示;
    deleteAllTip:function() {
        //清除现有的提示;
        for (var i in s_searchItemLayer._tipEffectTab) {
            cc.log("清除",s_searchItemLayer._tipEffectTab[i]._itemTag);
            if (s_searchItemLayer._tipEffectTab[i] && s_searchItemLayer._tipEffectTab[i]._itemTag) {
                s_searchItemLayer._tipEffectTab[i].removeFromParent();
            }
        }
        s_searchItemLayer._tipEffectTab = [];
    },

    //-物品提示;
    //@param btn 点击提示的按钮，主要取位置;
    setTipFun:function(btn,num) {
        if (MW.isTipAction) {
            this.deleteAllTip();
        }
        var isSkill = true;
        if (num == null) {
            num = 1;
            isSkill = false; //说明不是技能触发的;
        }
        var isPlayTip = true;    //正在播放动作;
        MW.isTipAction = true;
        //this.area.setTouchEnabled(false);  //设置成不能缩放;
        var has = true;
        var index = 0;
        var tipList = [];
        while (index < this.game.itemCurCount) {
            var item = this._curItemList[index];
            if (item) {
                if (item.target) { //设置了前置目标;
                    //判断目标找到了没有;
                    if ( !table.find(self._actionItems, item.target)) {
                        //如果前置目标已找到 就可以提示;
                        tipList.push(this._curItemList[index]);
                    }
                } else {
                    tipList.push(this._curItemList[index]);
                }
            }
            index = index + 1;
        }
        //把特殊物品也加入到可提示的数组中;
        for (var i in this._actionItems) {
            tipList.push({name:"superItem",itemTag:this._actionItems[i]});
        }
        if (tipList.length == 0) { return; }

        //如果技能要提示的个数大于剩下的物品数 那只提示剩下的物品;
        if (num > tipList.length) { num = tipList.length };

        var tipEffect = null;   //提示效果;
        var tipTag = null;  //提示物品的tag值;
        //根据个数做提示;
        function runActionOfTipEffect() {
            for (var i = 1;i <= num; ++i) {
                index = Math.floor(Math.random()*tipList.length);
                tipTag = tipList[index].itemTag;
                tipEffect = new Tip(tipList[index].itemTag);
                tipEffect.setName("tip" + index);
                tipEffect.setTag(-100);

                //放进数组
                s_searchItemLayer._tipEffectTab[tipList[index].itemTag] = tipEffect;

                var item = s_searchItemLayer.itemPanel.getChildByTag(tipList[index].itemTag);

                //给被提示的物品一个状态;
                item.isInTip = true;

                cc.log("提示：" + tipList[index].name);
        //        cc.Director.getInstance().getRunningScene().addChild(tipEffect);
                s_searchItemLayer.itemPanel.addChild(tipEffect,10000);
                //播放动作;
                var speed = 300;
                var originalP = cc.p(btn.getPositionX(),btn.getPositionY());
                originalP = btn.convertToWorldSpace();  //获取世界坐标;
                originalP = s_searchItemLayer.itemPanel.convertToNodeSpace(originalP);
                tipEffect.setPosition(originalP);
                function runActionTip(){
                    var targetP = cc.p(item.getPositionX(),item.getPositionY());
    //                targetP = cfun.getWorldSpaceLocation(item);
                    function callBack(){
                        btn.setTouchEnabled(true);
                        if (s_searchItemLayer.game.gameType != 2) {  //过滤黑夜模式;
                            //this.area.setTouchEnabled(true);  //还原成可以缩放;
                        }
                        isPlayTip = false;
                        item.isInTip = false;
                    }
                    tipEffect.runTipAction(targetP,callBack);
                    if (i == num) {
                    }
                }
                if (isSkill) {
                    runActionTip();
                } else {
                    ActionHelper.TipEffect(s_searchItemLayer.game._bottom.mainBottom,1,runActionTip);
                }
                tipList[index] = undefined;
            }
        }

        runActionOfTipEffect();
        //点击提示音效;
        cc.audioEngine.playEffect(res.game_Prompt_mp3);


        return tipTag;
    },
    getClickItem:function(p,list) {
        list = list || this._checkClickItems;
        var clickItem = null;
        var maxZ = -1;
        for (var idx in list) {
            var tag = list[idx];
            var item = this.itemPanel.getChildByTag(tag);
            if (item!=null && tag >= 0) {
                //取物品的区域
                var rect = item.getBoundingBox();
                if (rect.width == 0 ) {    //如果是0 说明是动画节点
                    var img = item.getChildren()[0];
                    rect.width = img.width;
                    rect.height = img.height;
                    rect.x = rect.x - rect.width/2
                    rect.y = rect.y - rect.height/2
                }
                if (cc.rectContainsPoint(rect,p)) {
                    var itemZ = item.getLocalZOrder();
                    var ret = cfun.getOriginalAlphaPoint(item,p);
                    if (Iteminfo.data[tag - 1][Iteminfo.ISTRANSPREN] == 1) {
                        if (itemZ > maxZ) {
                            clickItem = item;
                            maxZ = itemZ;
                        }
                    }
                }
            }
        }
        if (clickItem) {
            //返回层级最高的物品
            if (clickItem.isInTip) {
                return [true, null];
            }else {
                return [true,clickItem];
            }
        }
        return [false];
    },
    setCurItemList:function(curList) {
        this._curItemList = curList;
        for(var i in this._curItemList) {
            this._checkClickItems.push(this._curItemList[i].itemTag);
        }
    },
    //点到要选的物品
    itemTouchFun:function(sender) {
        var itemTag = sender.getTag();
        if (sender.texture) {

        }
        this.deleteTipByTag(itemTag); //删除提示
        function checkItem(self,itemStruct) { //检索列表的物品
            if (itemStruct == null) { return [true] }
            if (itemStruct[Iteminfo.ISPRIZE] == 1) { return [false,-1] }  // 奖励物品
            for (var i in self._curAndClickedItemList) {
                if (self._curAndClickedItemList[i].name == itemStruct[Iteminfo.ITEMNAME]) {
                    return [false,self._curAndClickedItemList[i].index,self._curAndClickedItemList[i].name]
                }
            }
            return [true]
        }
        function findItemStruct(self) {
            for(var i in self._checkClickItems) {
                if (itemTag == self._checkClickItems[i]) { return self._checkClickItems[i]; }
            }
        }
        itemTag = findItemStruct(this);
        var itemStruct = Iteminfo.data[itemTag - 1];
        var temp = checkItem(this,itemStruct);
        var hasItem = temp[0];
        var curIdx = temp[1];
        var name = temp[2];
        if (hasItem ) {
            return;
        } else {
    //        sender.setLocalZOrder(100)
            var itemName;
            var itmTg = -1;
            if (curIdx == -1) {   //filter prize item
                cc.log("u find prize item");
                var prizeInfo = itemStruct[Iteminfo.PRIZEINFO]
                self._reward.push(prizeInfo);
            } else {
                this.game.top.onDoubleClicked(itemTag,sender.x,sender.y);
                var arr = Object.keys(this._curAndClickedItemList);
                if (this.game.itemAllCount != arr.length) {
                    //说明还有要找的物品没显示在列表里
                    var hasItem = false
                    var item = {}
                    while (!hasItem) {
                        //直到找到没出现过的物品为止
                        var index = Math.floor(Math.random() * this.game.itemAllCount);
                        item = this.game.itemListData[index];
                        itemName = item[Iteminfo.ITEMNAME];
                        hasItem = checkItem(this,item)[0];
                    }
                    itmTg = item[Iteminfo.ID];
                    var preItem = item[Iteminfo.TARGET];
                    this._curItemList[curIdx - 1] = {itemTag: itmTg, name: itemName, target: preItem};
                    cc.log("curItemList:" + itemName + " " + itmTg);
                    //var index = table.keyOfItem(this._checkClickItems, itemTag);
                    var index = this._checkClickItems.indexOf(itemTag);
                    if(index>=0) {
                        this._checkClickItems[index] = itmTg;
                        //直接用tag值做索引 操作起来方便
                        this._curAndClickedItemList[itmTg] = {index: curIdx, name: itemName};
                        cc.log("insert table curAndClickedItemList ");
                    }
                } else {
                    table.removeItem(this._checkClickItems,itemTag);
                    //this._curItemList.splice(curIdx - 1,1);
                    this._curItemList[curIdx - 1] = null;
                    itemName = "";
                    if (this._curItemList.length == 0) {   //此时游戏已经结束 应该做相应的处理
                        //this.game.top.onGameStop(true);
                        this.game._bottom.onGameStop(true);
                        this.game.isGameEnd = true;   //置结束状态
                    }
                }
                //看看找到的物品是不是罗盘道具的目标
                if (sender == this.compassTarget && this.compass) {
                    cc.log("目标已清除");
                    this.compassTarget = null;
                    //清除罗盘
                    this.compass.remove();
                    this.compass = null;
                }
            }
            if (itemStruct[Iteminfo.ISEVIDENCE]==2) { //关键物证
                this.playFindedAnimation(sender, curIdx, true, name, itemName, itmTg, this.checkSuccess);
            } else if  (itemStruct[Iteminfo.ISEVIDENCE] == 1 && this.game._input.taskId == itemStruct[Iteminfo.TASKID])
            { //普通物证
                this.playFindedAnimation(sender, curIdx, true, name, itemName, itmTg, this.checkSuccess);
            } else {
                this.playFindedAnimation(sender,curIdx,false,"",itemName,itmTg,this.checkSuccess);
            }
        }
    },
    checkSuccess:function() {
        s_searchItemLayer.animationCount = s_searchItemLayer.animationCount - 1; //计数减1
        //var nums = cfun.getNum(s_searchItemLayer._curItemList);
        var nums = s_searchItemLayer._curItemList.length
        cc.log("the curItemList's nums is " + nums);
        if (nums == 0 && s_searchItemLayer.animationCount == 0) {
            s_searchItemLayer.game.finish();
        }
    },
    playFindedAnimation:function(sender,curIdx,isEvidence,name,itemName,itemId,callBack_playeFindedOver) {
        searchItemLayer._isPlayFindAnimation = true;
        var targetPoint = null; //要移动到的点
        var newp = sender.getParent().convertToWorldSpace(cc.p(sender.getPosition()));
        if (curIdx == -1) {  //filter is prize item;
            targetPoint = newp;
        } else {
            this.animationCount = this.animationCount + 1; //在播放动作的物体技术加1;
            targetPoint = this.game._bottom.getPositionById(curIdx);    //获得世界坐标;
        }
        sender.setPosition(newp);
        //把物体放在最上层;
        sender.retain();
        sender.removeFromParent();
        cc.director.getRunningScene().addChild(sender,cc.director.getRunningScene().getChildren().length);
        sender.release();
        function remove(item) {
            item.removeFromParent();
        }
        //刷新要找物品数;
        function refreshItemNum() {
            //刷新物品数量;
            if (curIdx != -1) {  //filter prize item;
                s_searchItemLayer.remainItemNum = s_searchItemLayer.remainItemNum - 1;
                s_searchItemLayer.game._bottom._lblCount.setString(s_searchItemLayer.remainItemNum + "/" + s_searchItemLayer.totalItemNum);
            }
        }
        function itemMoveAction(self) {
            //var currentScale = self.itemPanel.getScale()*self.area.getZoomScale() * sender.getScale();
            var currentScale = 1;
            sender.setScale(currentScale);
            var biger = cc.scaleTo(0.3,currentScale*1.2);
            var smaller = cc.scaleTo(0.3,currentScale);
            var disppear = cc.fadeOut(.5);
            var speed = 1000;
            var distance = cc.pDistance(cc.p(targetPoint.x + 50 ,targetPoint.y),cc.p(sender.getPositionX(),sender.getPositionY()));
            var move = cc.moveTo(distance/speed,cc.p(targetPoint.x ,targetPoint.y));
            return cc.sequence(biger,cc.callFunc(refreshItemNum),smaller,cc.spawn(move,disppear),cc.callFunc(remove));
        }
        var action = itemMoveAction(this);
        function deleteText() {
            //播放划线效果;
            function deleteTextCallBack() {
                s_searchItemLayer._isPlayFindAnimation = false;
                if (!isEvidence) {
                    //跟新数字并检查是否完成;
                    callBack_playeFindedOver();
                }
    //                refreshItemNum();  //更新文字放在找到物品，物品播放放大动作时;
            }
            s_searchItemLayer.game._bottom.playDeleteText(curIdx,itemName,itemId,deleteTextCallBack);
        }
        //显示弹窗;
        function pop() {
            function callbackFun(){
                this.game.stopGame(false);
                callBack_playeFindedOver();  //点完确定再检查是否完成;
            }
            if (this.game._input.taskId) {
                var wuzhengPath = Iteminfo.data[sender.getTag() - 1][Iteminfo.PICTURE];
                var evidenceRootPath = this.scenePath + "/evidence/";
                var wuzheng = new cc.Sprite(evidenceRootPath + wuzhengPath);
                var name = Iteminfo.data[sender.getTag() - 1][Iteminfo.BRIEF];
                if (!name) {
                    name = Iteminfo.data[sender.getTag() - 1][Iteminfo.ITEMNAME];
                }

            }
        }
        function finishAction() {
            //等动作做完 改下状态;
            s_searchItemLayer._isPlayFindAnimation = false;
        }
        if (isEvidence) {
            if (sender.playIt) {
                //先播放内置动画;
                sender.callback = function() {
                    if (sender.actionType == ITEM_TYPE.FIND_WITHOUT_ANIMATION) {   //找到 但是不往下飞的物品;
                        pop();
                        deleteText();
                        table.removeItem(this._actionItems,sender.getTag());    //移除;
                    } else if ( sender.actionType == ITEM_TYPE.FIND_ANIMATION) {   //点击播放动画的物品;
                        var action = itemMoveAction(this);
                        sender.runAction(cc.sequence(action,cc.callFunc(pop),cc.callFunc(deleteText)));
                    } else if ( sender.actionType == ITEM_TYPE.CASE_ITEM) {   //点击到全局物品;
                        //弹窗 并且打开左侧物品栏;
                        pop();
                        deleteText()
                    }
                }
                sender.playIt();
            } else {
                sender.runAction(cc.sequence(action,cc.callFunc(pop),cc.callFunc(deleteText)));
            }
        } else if ( curIdx == -1) {
            sender.runAction(cc.sequence(action, cc.callFunc(finishAction)));
        } else {
            sender.runAction(cc.sequence(action,cc.callFunc(deleteText)));
        }
    }
});