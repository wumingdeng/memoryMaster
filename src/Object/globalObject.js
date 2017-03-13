/**
 * Created by chenzhaowen on 16-7-8.
 */


var globalObject = cc.Node.extend({
    _id:null,
    _info:null, //配置信息
    _skin:null, //皮肤
    _img:null,  //在物品栏中的图片
    _imgMove:null,  //移动时的图片
    _isTouch:false, //是否点到全局物品
    _target:null,   //全局物品的目标
    _sceneId:null,  //打开的场景id
    _text:null,     //名字
    _plus:null,     //加号
    _touchEnabled:true, //点击控制
    ctor:function(id){
        this._super();
        this._id = id;
        this.tag = Number(id);
        this.init();


    },
    init:function(){
        this._super()
        this._skin = new cc.Sprite();
        this._skin.tag = this._id;

        this._info = GLOBAL_ITEM_CONFIG["g" + this._id];
        if(!this._info) return
        var imgPath = this._info.img;
        this._img = new cc.Sprite(imgPath);
        this._skin.addChild(this._img);

        var imgMovePath = this._info.imgMove;
        this._imgMove = new cc.Sprite(imgMovePath);
        this._skin.addChild(this._imgMove);

        this.addChild(this._skin);

        this.updateTarget();

        this._sceneId = this._info.scene;   //物品对应打开的场景

        //可打开的物品添加一个加号
        if (this._sceneId) {
            var animation = ccs.load(res.gameBar_scene_item_json,"res/");
            this._plus = animation.node;
            var action = animation.action;
            this._plus.runAction(action);
            action.gotoFrameAndPlay(0,true);
            this._skin.addChild(this._plus);
            this._plus.x = 50;
            this._plus.y = 50;
        }

        cfun.addEventListener(this,this.touchBegan,this.touchMoved,this.touchEnded,this.touchConcelled)


    },

    setTouchEnabled:function(bool) {
        this._touchEnabled = bool;
    },

    //更新物品使用的目标 每次打开新场景都要更新..
    updateTarget:function(){
        //获取目标
        this._target = {}
        if(!this._info) return
        var targets = this._info.target;
        if (cc.isArray(targets)) {
            for (var i = 0;i<targets.length;++i) {
                var item = sceneManager.scene.getItem(targets[i]);
                if (item) {
                    this._target[targets[i]] = item;
                }
            }
        } else {
            var item = sceneManager.scene.getItem(targets);
            if (item) {
                this._target[targets] = item;
            }
        }
    },

    isTouchItem:function(pos){
        var bb = cc.rect(0,0, this._img.width, this._img.height);
        return cc.rectContainsPoint(bb, this._img.convertToNodeSpace(pos));
    },

    touchBegan:function(touch,event){
        if (!this._touchEnabled) return false;
        var pos = touch.getLocation();
        if (this.isTouchItem(pos)){
            trace1("global began");
            this._isTouch = true;
            this.showMoveImg();
            if(!cc.sys.isNative || cc.sys.platform == cc.sys.MACOS){
                console.log("dkdkdk")
                touch.stopPropagation();     //停止向下传递事件
            }
            return true;
        }
        return false
    },
    touchMoved:function(touch,event){
        if (!this._touchEnabled) return false;
        if (!this._isTouch) return false;
        if (this._sceneId) {
            return true;    //打开场景的全局物品不移动
        }
        var location = touch.getLocation();
        var pos = this._skin.parent.convertToNodeSpace(location);
        this._skin.setPosition(pos);
        return true;
        trace2("global move")
    },
    touchEnded:function(touch,event){
        if (!this._touchEnabled) return false;
        if (!this._isTouch) return false;
        this._isTouch = false;
        var loc = touch.getLocation();
        if (this._sceneId) {    //打开场景
            if (this.isTouchItem(loc)) {
                sceneManager.createScene(this._sceneId, loc);
                this.showImg();
            }
            return true;
        }
        //判断是否移到目标上
        loc = sceneManager.scene._ui.convertToNodeSpace(loc);
        var target = this.checkTarget(loc)
        if(target) {
            trace("找到目标")
            GAME_BAR.onCancelHint(target);
            target.onWait(); //播放动作 并且检测任务
            this.useGlobalItem();
        } else {
            //回到原处
            var moveBack = new cc.moveTo(0.3,cc.p(0,0))
            this.setTouchEnabled(false)
            function onBack() {
                this.showImg();
                this.setTouchEnabled(true)
            }
            this._skin.runAction(cc.sequence(moveBack,cc.callFunc(onBack.bind(this))))
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
            var item = this._target[id]
            if (item.haveBehavior(ITEM_BEHAVIOR.wait)){
                for(var i = 0; i < item._info.wait.length; i++) {
                    var gid = item._info.wait[i].substring(1);
                    if (gid == this._id) {
                        if(this._target[id].isTouchItem(pos)){
                            return this._target[id]
                        }
                    }
                }
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
            //this._skin.removeChild(this._text)
            //this._text = null;
            g_nowSelectItem = null;
        } else {
            //添加文字
            //var name = this._info.name;
            //this._text = new ccui.Text();
            ////this._text.setString(name);
            //this._text.setString("");
            //this._text.setFontSize(30);
            //this._text.x = this._skin.width/2;
            //this._text.y = 100;
            //this._skin.addChild(this._text);
            g_nowSelectItem = this;
        }
        this._isSelected = !this._isSelected;
    },

    onEnter:function(){
        this._super();

    },

    showImg:function() {
        if (this._plus) {
            this._plus.visible = true;
        }
        this._img.visible = true;
        this._imgMove.visible = false;
        this._imgMove.scale = 1;
    },

    showMoveImg:function() {
        if (this._plus) {
            this._plus.visible = false;
        }
        this._img.visible = false;
        this._imgMove.visible = true;
        var big = cc.scaleTo(0.2,1.3);
        this._imgMove.runAction(big);
    }
});