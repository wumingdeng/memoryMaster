/**;
 * Created by chenzhaowen on 16/4/20.;
 */;

var s_searchBottomLayer = null;

var searchBottomLayer = cc.Layer.extend({
    _widget:null,
    _lblCount:null,   //物品数量;
    percent:0,
    isClickTipBtn:false,
    promptTimer:null, //提示能量增加定时器;
    itemListPanel:null,
    mainBottom:null,
    _itemLayer:null,
    curAndClickedItemList:{}, //当前与被寻找过的物品列表;
    progressTime:null,    //定时器;
    btnTip:null,
    isLayerTouch:false,
    game:null,
    ITEMLIST_FONTSIZE:30,
    setTextArr:{},
    init:function(game) {
        s_searchBottomLayer = this;
        this.game = game;
        this._itemLayer = game._itemLayer;
        this.setTextArr = {};
        cc.spriteFrameCache.addSpriteFrames(res.line_animation_plist);
        cc.spriteFrameCache.addSpriteFrames(res.game_sceneui_plist);
        cc.spriteFrameCache.addSpriteFrames(res.click_tip_plist);
        var json = ccs.load("res/gameScene/gameBottom.json","res/");
        this._widget = json.node.getChildByName("bottomUI");

        this.setContentSize(this._widget.getContentSize());
        this.mainBottom = this._widget.getChildByName("panelMain");

        this.itemListPanel =  this.mainBottom.getChildByName("itemListPanel");
        this.btnTIp = this.mainBottom.getChildByName("btnTip");
        this.addChild(json.node);
        //添加物品列表的数字;
        var countUI = this.mainBottom.getChildByName("pnlCount");
        countUI.setVisible(true);
        this._lblCount = countUI.getChildByName("lblPro");
        //初始化显示数量;
        this._lblCount.setString(game.itemListData.length+"/"+game.itemListData.length);
        var currentItem = null;     //当前在提示的物品;
        var timeSound = null;   //时间音效;

        var isTouchBottom = false
        function itemListTouchFun(sender,eventType) {
            if (eventType == ccui.Widget.TOUCH_BEGAN) {
                isTouchBottom = true;
            }  else {
                if (!isTouchBottom) {
                    return false;
                }
            }
            if (currentItem == null) {
                currentItem = sender;
            }
            //防止点多个提示;
            if (sender != currentItem) {
                return;
            }
            var itemTxtID = sender.getTag();
            var labelPanel =  s_searchBottomLayer.itemListPanel.getChildByName("Panel_" + itemTxtID);
            function removeItemTipInTheBottom() {
                if (labelPanel.getChildByTag(10) != null) {
                    labelPanel.removeChildByTag(10);
                }
                if (labelPanel.getChildByTag(11) !=null) {
                    labelPanel.removeChildByTag(11);
                }
                if (labelPanel.getChildByTag(12) !=null) {
                    labelPanel.removeChildByTag(12);
                }
                //if (s_searchBottomLayer.progressTime) {
                    s_searchBottomLayer.unschedule(setProgressPercentage);
                    //s_searchBottomLayer.progressTime = null;
                //}
                currentItem = null;
                //关闭音效;
                if (timeSound) {
                    cc.audioEngine.stopEffect(timeSound);
                    timeSound = null;
                }
            }
            if (eventType == ccui.Widget.TOUCH_MOVED) {
                if (cc.pDistance(sender.getTouchBeganPosition(),sender.getTouchMovePosition())>15) {
                    removeItemTipInTheBottom();
                    return false;
                }
            } else if (eventType == ccui.Widget.TOUCH_ENDED || eventType == ccui.Widget.TOUCH_CANCELED){
                isTouchBottom = false
                removeItemTipInTheBottom();
                return false;
            } else if ( eventType == ccui.Widget.TOUCH_BEGAN) {
                var item = s_searchBottomLayer._itemLayer._curItemList[itemTxtID - 1];
                if (item != null) {
                    //开始播放时间走动音效;
                    timeSound = cc.audioEngine.playEffect(res.game_listTime_mp3);
                    var itemTag = item.itemTag;
                    var target = s_searchBottomLayer._itemLayer.itemPanel.getChildByTag(itemTag);
                    var maoSprite;
                    var child = target.getChildren()[0];
                    if (child) {
                        //说明做了动画;
                        maoSprite = new cc.Sprite(child.texture,child.getTextureRect(),child.isTextureRectRotated());
                    } else {
                        maoSprite = new cc.Sprite(target.texture,target.getTextureRect(),target.isTextureRectRotated());
                    }
                    var shadow = null; //剪影;
                    var lanSprite = new cc.Sprite("#SceneUI_wupts.png");
                    var per = 100;
                    var tiplayer = new cc.Layer();
                    tiplayer.setContentSize(lanSprite.getContentSize());
                    var mao = new cc.ProgressTimer(new cc.Sprite("#SceneUI_wupts2.png"));
                    function setProgressPercentage() {
                        per = per - 1;
                        mao.setPercentage(per);
                        if (per == 0) {
                            tiplayer.reorderChild(maoSprite,tiplayer.getChildrenCount());
                            shadow.removeFromParent();
                            s_searchBottomLayer.unschedule(setProgressPercentage);
                            //关闭音效;
                            if (timeSound) {
                                cc.audioEngine.stopEffect(timeSound);
                                timeSound = null;
                            }
                            //做放大效果;
                            var nowScale = maoSprite.getScale();
                            var bigger = cc.scaleTo(0.3,nowScale*1.15);
                            var ease = bigger.easing(cc.easeBackOut());
                            maoSprite.runAction(ease);
                        }
                    }
                    mao.type = cc.ProgressTimer.TYPE_RADIAL;
                    mao.setReverseDirection(false);
                    mao.setPercentage(per);
    //                var sndrPostn = labelPanel:convertToNodeSpace(sender.getTouchBeganPosition());
                    var sndrPostn = cc.p(labelPanel.width/2,labelPanel.height/2);
                    mao.setAnchorPoint(0.5,0);
                    mao.setPosition(0,20);   //调整位置;
                    lanSprite.setAnchorPoint(0.5,0);
                    maoSprite.setAnchorPoint(0.5,0.5);
                    tiplayer.setPosition(sndrPostn.x,sndrPostn.y + 80);
                    tiplayer.setTag(10);
                    var maoSptSize = maoSprite.getContentSize();
                    var xxxBox = lanSprite.getContentSize();
                    var scale = 0;
                    if (maoSptSize.height > maoSptSize.width) {
                        scale = 80/maoSptSize.height;
                    } else {
                        scale = 80/maoSptSize.width;
                    }
                    if (scale > 1) { scale = 1 }
                    maoSprite.setScale(scale);
                    maoSprite.setPosition(0,xxxBox.height/2);
                    shadow = new cc.Sprite(maoSprite.texture,maoSprite.getTextureRect(),maoSprite.isTextureRectRotated());
                    shadow = s_searchBottomLayer.makeShadow(shadow); //取剪影;

                    shadow.setAnchorPoint(0.5,0.5);
                    shadow.setScale(scale);
                    shadow.setPosition(0,xxxBox.height/2);
                    tiplayer.addChild(lanSprite,0);
                    tiplayer.addChild(maoSprite,1);
                    tiplayer.addChild(shadow,2);
                    tiplayer.addChild(mao,3);
                    labelPanel.addChild(tiplayer);
                    //if (s_searchBottomLayer.progressTime) {
                    //    s_searchBottomLayer.unschedule(setProgressPercentage);
                        //s_searchBottomLayer.progressTime = null;
                    //}
                    s_searchBottomLayer.schedule(setProgressPercentage, 0.03);
                }
            }
        }
        for(var i = 1;i <= 6; ++i){
            var child = null;
            var panel = this.itemListPanel.getChildByName("Panel_"+i);
            if (game.gameType == 3) {   //图片模式;
                panel.setContentSize(cc.size(65,65));
                panel.removeAllChildren();
                var pnlX = 0;
                if (i <6) {
                    pnlX = (i-1)*71;
                } else {
                    panel.setVisible(false);
                    panel.setTouchEnabled(false);
                }
                panel.setPosition(pnlX,10);
                cc.log("pnlX = " + pnlX);
            } else {
                var text = panel.getChildByTag(i); //tag在ui里写;
                //text.setColor(cc.color(255,255,255));
            }

            //function onTouchBegan(touch,event) {
            //    itemListTouchFun(touch,event);
            //}
            //function onTouchMoved(touch,event) {
            //    itemListTouchFun(touch,event);
            //}
            //function onTouchEnded(touch,event) {
            //    itemListTouchFun(touch,event);
            //}
            panel.addTouchEventListener(itemListTouchFun);
            //cfun.addEventListener(panel,onTouchBegan,onTouchMoved,onTouchEnded)
        }


        cfun.setButtonFun(this.btnTIp,null,null,this.tipFun,null,this);
        //初始化提示能量槽;
        this.promptTimer = this.schedule(this.addPromptTimes,1);

        return true;
    },
    tipFun:function(sender){
        if (s_searchBottomLayer.isLayerTouch) {
            cc.log("WTF.........ohohohohohohohohoooo");
            return true;
        }
        if (s_searchBottomLayer.percent > 20) {
            s_searchBottomLayer.isClickTipBtn = true;
            s_searchBottomLayer.percent = s_searchBottomLayer.percent - 20;
            var idx = Math.floor(s_searchBottomLayer.percent/20)+1;
            s_searchBottomLayer.mainBottom.removeChild(s_searchBottomLayer.mainBottom.getChildByName("tipTrought" + idx));
            sender.setTouchEnabled(false);
            s_searchBottomLayer._itemLayer.setTipFun(sender);    //提示操作;
        } else {
            cc.log("不能提示，呵呵");
            if (!s_searchBottomLayer.parent.getChildByName("tipRecover")) {
                var sp = ActionHelper.tipRecover();
                sender.getParent().addChild(sp);
                sp.setName("tipRecover");
                sp.setPosition(sender.getPositionX() + sender.width/2,sender.getPositionY() + sender.height/2);
            }
        }
    },
    addPromptTimes:function(d) {
        //播放些增加的效果
        this.percent = this.percent + 1
        if (this.percent > 100) {
            this.percent = 100;
        } else {
            var idx = Math.floor(this.percent / 20) + 1;
            var firstIdx = 1;
            var pos = [0, 44, 16, 5, 16, 44];
            while (idx > firstIdx) {
                var layer = this.mainBottom.getChildByName("imgPnl" + firstIdx);
                var sptLight = layer.getChildByName("imgtishi" + firstIdx);
                layer.setPositionY(pos[firstIdx]);
                sptLight.setPositionY(sptLight.height / 2);
                if (this.mainBottom.getChildByName("tipTrought"+firstIdx) == null) {
                    var animation = ActionHelper.TipTroughAction();
                    animation.setName("tipTrought"+firstIdx);
                    animation.setPosition(layer.getPositionX()+animation.width/2,pos[firstIdx]+animation.height/2);
                    this.mainBottom.addChild(animation);
                }
                firstIdx = firstIdx + 1;
            }
            if (idx <= 5) {
                var layer = this.mainBottom.getChildByName("imgPnl" + idx);
                var sptLight = layer.getChildByName("imgtishi" + idx);
                var sptH = sptLight.height;
                var curY = 0;
                var costTime = 1;
                if (this.isClickTipBtn) {
                    var curProgress = this.percent % 20;
                    curY = curProgress / 20 * sptH;
                    layer.setPositionY(pos[idx] - layer.height + curY);
                    sptLight.setPositionY(sptH / 2 + layer.height - curY);
                    this.isClickTipBtn = false;
                }
                var moBy = (layer.height - curY) / 20;

                var actionMoveBy_1 = cc.moveBy(0.95, cc.p(0, -moBy));
                var actionMoveBy_2 = cc.moveBy(0.95, cc.p(0, moBy));
                sptLight.runAction(actionMoveBy_1);
                layer.runAction(actionMoveBy_2);
                while (idx < 5) {
                    idx = idx + 1;
                    var otherlayer = this.mainBottom.getChildByName("imgPnl" + idx);
                    var otherSptLight = otherlayer.getChildByName("imgtishi" + idx);
                    var osptH = otherSptLight.height;
                    otherlayer.setPositionY(pos[idx] - otherlayer.height);
                    otherSptLight.setPositionY(osptH / 2 + otherlayer.height);
                }
            }
        }
    },

    onEnter:function(){
        this._super();
        cc.each(this.setTextArr,function(text,name){
            text.setString(name);
        });
    },
    initItemListText:function() {
        var itemNum = 1;
        var itemTemp = null;
        for (var i = 0; i < this.game.itemListData.length; ++i) {
            var index = Math.floor(Math.random() * this.game.itemListData.length);
            itemTemp = this.game.itemListData[i];
            this.game.itemListData[i] = this.game.itemListData[index];
            this.game.itemListData[index] = itemTemp;
        }
        var curItemList = [];  //当前在找的物品
        this._itemLayer._curAndClickedItemList = {};
        while (itemNum <= this.game.itemCurCount) {
            var item = this.game.itemListData[itemNum];
            var itemName = item[Iteminfo.ITEMNAME];
            var itemTag = item[Iteminfo.ID];
            var preTarget = item[Iteminfo.TARGET];
            if (!this._itemLayer.itemPanel.getChildByTag(itemTag)) {    //防止图中没有配置好的物品
                cc.log("没有找到物品:" + itemTag);
                continue;
            }
            this._itemLayer._curAndClickedItemList[itemTag] = {index : itemNum,name : itemName};
    //        table.insert(searchItemLayer._curAndClickedItemList,{index=itemNum,name=itemName})
            curItemList.push({itemTag:item[Iteminfo.ID],name:itemName,target : preTarget});
            var itmLtPnl = this.itemListPanel.getChildByName("Panel_"+itemNum);
            if (this.game.gameType != 3) {
                //设置字体大小
                itmLtPnl.getChildByTag(itemNum).setFontSize(this.ITEMLIST_FONTSIZE);
                //function onSetString(){
                //    this.setString(itemName);
                //}
                //itmLtPnl.getChildByTag(itemNum).scheduleOnce(onSetString,3);
                this.setTextArr[itemName] = itmLtPnl.getChildByTag(itemNum);
                //itmLtPnl.getChildByTag(itemNum).setString(itemName);
            } else {
                var itemTag = item[Iteminfo.ID];
                var target = this._itemLayer.itemPanel.getChildByTag(itemTag);
                var imgSpt = new cc.Sprite(target.texture,target.getTextureRect(),target.isTextureRectRotated());
                imgSpt.setAnchorPoint(0,0);
                if (imgSpt.width > imgSpt.height) {
                    imgSpt.setScale(itmLtPnl.width / imgSpt.width);
                } else {
                    imgSpt.setScale(itmLtPnl.width/imgSpt.height);
                }
                imgSpt.setPosition(0,0);
                var shadow = this.makeShadow(imgSpt);
                shadow.attr({
                    tag:itemNum,
                    x:itmLtPnl.width/2,
                    y:itmLtPnl.height/2
                });
                itmLtPnl.addChild(shadow);
            }
            itemNum = itemNum + 1;
        }
        this._itemLayer.setCurItemList(curItemList);
    },
    getPositionById:function(id) {
        var text = this.itemListPanel.getChildByName("Panel_" + id).getChildByTag(id);
        return text.convertToWorldSpace(cc.p(text.width * text.getAnchorPoint().x, text.height * text.getAnchorPoint().y));
    },

    getLineAnimation:function () {
        var animation = cc.animationCache.getAnimation("LineAnimation");
        if (!animation) {
            var animFrames = [];
            var str = "";
            for (var i = 0; i < 6; i++) {
                str = "wupimingchenghuaxian" + i + ".png";
                var frame = cc.spriteFrameCache.getSpriteFrame(str);
                animFrames.push(frame);
            }
            animation = new cc.Animation(animFrames, 0.05);
            cc.animationCache.addAnimation(animation, "LineAnimation");
        }
        return cc.animate(animation);
    },
    //给找到的物品划线
    playDeleteText:function(id,itemName,itemId,callBack_playeFindedOver) {
        var itemText;
        if (this.game.gameType != 3) {
            itemText = ccui.helper.seekWidgetByName(this.itemListPanel, "Panel_" + id).getChildren()[0];    //把划线效果加在文本上
        } else {
            itemText = ccui.helper.seekWidgetByName(this.itemListPanel, "Panel_" + id);    //把划线效果加在文本上
        }
        //创建线条
        var lineAnimation = this.getLineAnimation();
        var actionEnd = false;
        function onFinish(sender) {
            actionEnd = true;
            sender.removeFromParent();
            s_searchBottomLayer.setItemListPanelText(id,itemName,itemId);   //更新要找物体显示
            if (typeof(callBack_playeFindedOver) == "function") {
                callBack_playeFindedOver()
            }
        }
        var lineSp = new cc.Sprite("#wupimingchenghuaxian1.png");
        lineSp.x = itemText.width / 2;
        lineSp.y = itemText.height / 2;
        itemText.addChild(lineSp);
        lineSp.runAction(cc.sequence(lineAnimation,cc.callFunc(onFinish,lineSp)));
        var deleteId = null;
        function onDelete() {
            if (!actionEnd) { // 过滤掉暂停时的播放顺序异常，
                this.setItemListPanelText(id,"",itemId);   //更新要找物体显示
            }
            this.unschedule(deleteId);
        }
        deleteId = this.schedule(onDelete,0.2,false);
    },

    setItemListPanelText:function(curIdx,itemName,itmTg) {
        var itmLtPnl = this.itemListPanel.getChildByName("Panel_"+curIdx);
        if (this.game.gameType!=3) {
            var text = itmLtPnl.getChildByTag(curIdx);
            text.setString(itemName);
            cc.log(text.getFontName());
            if (itemName != "") {
                //加特效 放大 闪烁;
                var cr = text.getColor();
                function onBlink() {
                    text.setTextColor(cc.color(255, 255, 255));
                    text.setColor(cc.color(255, 255, 255));
                }

                function onBack() {
                    text.setTextColor(cc.color(40, 58, 50));
                    text.setColor(cc.color(255, 255, 255));
                    //text.setTextColor(cc.color(0, 0, 0));
                }

                text.setScale(0);
                text.setAnchorPoint(.5, .5);
                var bigger = cc.scaleTo(.3, 1);
                text.runAction(cc.sequence(cc.delayTime(.5), bigger.easing(cc.easeElasticOut(0.5)), cc.callFunc(onBlink), cc.delayTime(0.15), cc.callFunc(onBack)));
            }
        } else {
            itmLtPnl.removeChildByTag(curIdx);
            if (itmTg != -1) {
                var target = this._itemLayer.itemPanel.getChildByTag(itmTg);
                var spt = new cc.Sprite(target.getTexture(),target.getTextureRect(),target.isTextureRectRotated());
                spt.setColor(cc.color(1,0,0,0));
                spt.setVisible(true);
                spt.setAnchorPoint(.5,.5);
                if (spt.width > spt.height) {
                    spt.setScale(itmLtPnl.width / spt.width);
                } else {
                    spt.setScale(itmLtPnl.width / spt.height);
                }
                var shadow = this.makeShadow(spt);
                shadow.setTag(curIdx);
                shadow.setPositionX(itmLtPnl.getContentSize().width/2);
                shadow.setPositionY(itmLtPnl.getContentSize().height/2);
                shadow.setAnchorPoint(0,0);
                itmLtPnl.addChild(shadow);
            }
        }
    },
    //生成剪影
    makeShadow:function(target) {
        var location = cc.p(target.getPositionX(),target.getPositionY());   //先把物体放到0,0 用renderTexture不知道怎么选定范围
        var anchorP = target.getAnchorPoint();
        target.setPosition(0,0);
        target.setAnchorPoint(0,0);
        var rt = new cc.RenderTexture(target.width,target.height,cc.Texture2D.PIXEL_FORMAT_RGBA8888);
        //rt.setContentSize(target.width,target.height);
        var mask = new cc.DrawNode();
        var mask2 = new cc.DrawNode();
        var mask3 = new cc.DrawNode();
        var lsize = target.getBoundingBox();
        var points = [
            cc.p(0,0),
            cc.p(lsize.width,0),
            cc.p(lsize.width,lsize.height),
            cc.p(0,lsize.height)
        ];
        mask.drawPoly(points,cc.color(0,0,0,255),0,cc.color(0,0,0,0));
        mask2.drawPoly(points,cc.color(0,0,0,255),0,cc.color(0,0,0,0));
        mask3.drawPoly(points,cc.color(0,0,0,255),0,cc.color(0,0,0,0));
        mask.setBlendFunc(gl.DST_COLOR,1);
        mask2.setBlendFunc(gl.DST_COLOR,1);
        mask3.setBlendFunc(gl.DST_COLOR,0);
        rt.begin();
        target.visit();
        mask.visit();
        mask2.visit();
        mask3.visit();
        rt.end();
        target.setPosition(location);
        target.setAnchorPoint(anchorP);
        return rt;
    },
    getPositionById:function(id) {
        var text = this.itemListPanel.getChildByName("Panel_" + id).getChildByTag(id);
        return text.convertToWorldSpace(cc.p(text.width * text.getAnchorPoint().x, text.height * text.getAnchorPoint().y));
    },
    onGameStop:function(bool) {
        if (bool) {
            this.unschedule(this.addPromptTimes);
        } else {
            //打开定时器
            this.schedule(this.addPromptTimes, 1);
        }
    },
    ctor:function(game) {
        this._super();
        this.init(game);
    }

});



