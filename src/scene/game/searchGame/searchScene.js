/**
 * Created by chenzhaowen on 17-2-22.
 */


ITEM_TAB = [];
var searchScene = cc.Layer.extend({
    _index:null,
    _par:null,
    _ui:null,
    _itemConfig:null,
    _items:null,
    _bottom:null,   //底层UI
    _popup:null,   //弹出层的tag
    _actionCount:0,  //正在播放动作的物品

    ctor:function(index, parent) {
        this._super();
        this._index = index;
        this._par = parent;
        this._par.setSceneTouch(true);
        this._ui = parent._ui;
        this.init();
    },
    init:function() {
        this._itemConfig = ITEM_TAB[this._index];
        if (!this._itemConfig) {
            cc.error("没有物品配置");
            return false;
        }
        this._items = [];
        //初始化配置的物品
        for (var i = 0; i <  this._itemConfig.data.length; ++i) {
            var config =  this._itemConfig.data[i]
            var item = cfun.seekWidgetByTag(this._ui,config[this._itemConfig.ID])
            if (item) {
                var open = config[this._itemConfig.OPEN];
                var popup = config[this._itemConfig.POPUP];
                if (open) {
                    cfun.seekWidgetByTag(this._ui,open).visible = false;
                }
                this._items.push({img:item,index:i + 1,open:open,popup:popup});
            } else {
                cc.error("没找到物品:" + config[this._itemConfig.ID])
            }
        }

        //添加底层UI
        this._bottom = new searchBottom(this);
        this.addChild(this._bottom);

        //cfun.addEventListener(this,this.onTouchBegan,this.onTouchMoved,this.onTouchEnded,this.onTouchCancelled)

    },

    onTouchBegan:function(touch,event){
        return true;
    },

    onTouchMoved:function(touch,event){

        return true;
    },

    onTouchEnded:function(touch,event){
        if (this._par._touchSceneItem) return;  //点到场景物品就返回
        var location = touch.getLocation();
        //检查是否点到了物品
        for (var i = 0; i < this._items.length; ++i) {
            var item = this._items[i];
            var img = item.img;
            //if (!img.parent.parent.visible) continue;
            if (item.popup != this._popup) continue;    //判断物品是否在当前层上 底层的物品popup为空
            var index = item.index
            var config =  this._itemConfig.data[index - 1]
            if (cc.rectContainsPoint(img.getBoundingBox(),location)) {
                if (item.open) {
                    //打开配置的场景
                    this.openItem(item);

                } else {
                    trace("找到物品:" + config[1]);
                    //fly to bottom
                    this.findItem(item,i);
                    return true;
                }
            }
        }
    },

    onTouchCancelled:function(touch,event){

    },

    openItem:function(item) {
        this._par.setSceneTouch(false);
        this._popup = item.open;
        var layer = cfun.seekWidgetByTag(this._ui,item.open);
        layer.scale = 0;
        layer.visible = true;
        layer.setAnchorPoint(0,0);
        layer.x = item.img.x + item.img.width * item.img.scaleX / 2;
        layer.y = item.img.y + item.img.height * item.img.scaleY / 2;

        var big = cc.scaleTo(0.4,1);
        var move = cc.moveTo(0.4,cc.p(vsize.width/2,vsize.height/2));
        layer.runAction(cc.sequence(cc.spawn(big,move),cc.callFunc(onOpen.bind(this))));

        var bg = cfun.seekWidgetByName(layer,"bg");
        var area = cfun.seekWidgetByName(layer,"area");
        bg.setPropagateTouchEvents(false);  //阻止事件传递
        bg.setSwallowTouches(false);
        function onClose(sender,type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                var location = sender.getTouchEndPosition();
                if(area && !cc.rectContainsPoint(area.getBoundingBox(),location)) {
                    this.closeItem(item);
                    bg.addTouchEventListener(function(){});
                }
            }
        }
        function onOpen() {
            bg.addTouchEventListener(onClose.bind(this));
        }
        //area.setTouchEnabled(false);

    },

    closeItem:function(item) {
        var layer = cfun.seekWidgetByTag(this._ui,item.open);
        var small = cc.scaleTo(0.4,0);
        var pos = cc.p()
        pos.x = item.img.x + item.img.width * item.img.scaleX / 2;
        pos.y = item.img.y + item.img.height * item.img.scaleY / 2;
        var move = cc.moveTo(0.4, pos);
        function onClose() {
            layer.visible = false;
            this._par.setSceneTouch(true);
            this._popup = null;
        }
        layer.runAction(cc.sequence(cc.spawn(small,move),cc.callFunc(onClose.bind(this))))
    },

    findItem:function(item,i) {
        //从数组中删除
        var index = item.index;
        this._items.splice(i,1);
        var img = item.img;
        var big = cc.scaleTo(0.2,1.3).easing(cc.easeElasticOut());
        var speed = 1000;
        var desPos = this._bottom.getTextPosition(index)
        var curPos = img.getPosition();
        var posArr = [
            curPos,
            cc.p(desPos.x,curPos.y),
            desPos
        ]
        var distance = cc.pDistance(curPos,desPos);
        var move = cc.bezierTo(distance/speed,posArr);
        var small = cc.scaleTo(distance/speed,0.4);
        var hide = cc.fadeTo(distance/speed,0.3);
        this._actionCount++;
        function onFinish() {
            img.removeFromParent()
            //检查是否完成
            this._actionCount--;
            this.checkFinish();
        }
        function delText() {
            //删除文字效果
            this._bottom.deleteText(index)
        }
        img.setLocalZOrder(100);
        img.runAction(cc.sequence(big,cc.spawn(move,small),cc.callFunc(delText.bind(this)),hide,cc.callFunc(onFinish.bind(this))))
    },
    closeGame:function() {
        this._par.backTo();
    },

    checkFinish:function() {
        if (this._actionCount != 0) return false;
        for (var i = 0; i < this._items.length; ++i) {
            if (!this._items[i].open) { //打开小场景的物品 过滤掉
                return false;
            }
        }
        this.finishSearch();
        return true;
    },
    finishSearch:function() {
        trace("完成找物品")
        //显示找到的关键物品
        var tip = cfun.getAnimation(res.search_find_object_json,false)
        this._ui.addChild(tip.node,1000);
        tip.node.x = vsize.width / 2;
        tip.node.y = vsize.height / 2;
        this._par.finishGame();
        this._bottom.setTouchEnabled(false);

        function onPause() {
            cc.director.getScheduler().pauseTarget(this);
            this._bottom.setTouchEnabled(true);
            trace("hehe")
        }
        this.schedule(onPause.bind(this), 3);
    }

})