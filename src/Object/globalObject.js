/**
 * Created by chenzhaowen on 16-7-8.
 */


var globalObject = cc.Node.extend({
    _id:null,
    _tag:null,
    _info:null, //配置信息
    _img:null,  //皮肤
    _isTouch:false, //是否点到全局物品
    _target:null,   //全局物品的目标
    _text:null,     //名字
    ctor:function(id){
        this._super();
        this._id = id;
        this._tag = id;
        this.init();


    },
    init:function(){
        this._super()
        this._info = GLOBAL_ITEM_CONFIG["g" + this._id];
        var imgPath = this._info.img;
        this._img = new cc.Sprite(imgPath);
        this._img.tag = this._id;
        this.addChild(this._img);

        //获取目标
        this._target = {}
        var targets = this._info.target;
        if (cc.isArray(targets)) {
            for (var i = 0;i<targets.length;++i) {
                var item = itemManager.getItem(targets[i]);
                if (item) {
                    this._target[targets[i]] = item;
                }
            }
        } else {
            var item = itemManager.getItem(targets[i]);
            if (item) {
                this._target[targets] = item;
            }
        }

        cfun.addEventListener(this,this.touchBegan,this.touchMoved,this.touchEnded,this.touchConcelled)


    },

    isTouchItem:function(pos){
        var bb = cc.rect(0,0, this._img._contentSize.width, this._img._contentSize.height);
        return cc.rectContainsPoint(bb, this._img.convertToNodeSpace(pos));
    },

    touchBegan:function(touch,event){
        var pos = touch.getLocation();
        if (this.isTouchItem(pos)){
            trace1("global began");
            this._isTouch = true;
            touch.stopPropagation();     //停止向下传递事件
            return true;
        }
        return false
    },
    touchMoved:function(touch,event){
        if (!this._isTouch) return false;
        var location = touch.getLocation();
        var pos = this._img.parent.convertToNodeSpace(location);
        this._img.setPosition(pos);
        trace2("global move")
    },
    touchEnded:function(touch,event){
        if (!this._isTouch) return false;
        this._isTouch = false;
        var loc = touch.getLocation();
        //判断是否移到目标上
        var target = this.checkTarget(loc)
        if(target) {
            trace("找到目标")
            target.onWait(); //播放动作 并且检测任务
            this.useGlobalItem();
        } else {
            //回到原处
            var moveBack = new cc.moveTo(0.3,cc.p(0,0))
            this._img.runAction(moveBack)
        }

        //var des = cc.pDistance(this._img.getPosition(),cc.p(0,0));
        //if (des < 10) {
        //    //标记成选定物品
        //    this.onSelectItem()
        //}
        this.onSelectItem()

        touch.stopPropagation()
        trace2("global end")
    },
    touchConcelled:function(touch,event){
        this.touchEnded(touch,event)
    },
    checkTarget:function(pos){
        for (var id in this._target) {
            if(this._target[id].isTouchItem(pos)){
                return this._target[id]
            }
        }
        return false;

    },

    //全局物品被使用
    useGlobalItem:function(){
        //判断这个物品还有没有用 如果还有用到 就放回全局物品栏 如果没用了 就删除
        if (true) {
            GAME_BAR.deleteMyGlobalItems(this._id);

        } else {
            //一个全局物品对应多个目标的逻辑....

        }

    },

    //检测被点击的目标可不可以被组合
    checkTouchTarget:function(target){
        var find = false;
        //寻找目标
        for (var id in this._target){
            if (this._target[id] == target){
                find = true;
                break;
            }
        }

        if (find) {
            g_nowSelectItem.onSelectItem(); //取消选中
            target.onWait(); //播放动作 并且检测任务
            this.useGlobalItem();
            return true;
        }
        return false;
    },

    //选中物品
    onSelectItem:function(){
        if (this._isSelected){
            //删除文字
            this._img.removeChild(this._text)
            this._text = null;
            g_nowSelectItem = null;
        } else {
            //添加文字
            var name = this._info.name;
            this._text = new ccui.Text();
            this._text.setString(name);
            this._text.setFontSize(30);
            this._text.x = this._img.width/2;
            this._text.y = 100;
            this._img.addChild(this._text);
            g_nowSelectItem = this;
        }
        this._isSelected = !this._isSelected;
    },

    onEnter:function(){
        this._super();

    }

});