/**
 * Created by chenzhaowen on 16-7-8.
 * 游戏工具栏
 */

var GAME_BAR = null;
var gameBar = cc.Layer.extend({
    _touchEnabled:true,
    _ui:null,
    _globalArea:null,
    _mainBar:null,
    _items:null,    //存放全局物品
    _phoneBtn:null, //手机按钮
    _hintBtn:null,  //提示按钮
    _helpBtn:null,  //帮助按钮
    _setBtn:null,
    _mapBtn:null,
    _memoryNode:null,   //记忆动画节点
    _memoryAction:null, //记忆动画
    _phoneScene:null,   //手机界面
    _callingNode:null,  //来电电话节点
    _callingAction:null,    //来电动画
    _isFindPhone:false, //是否有手机
    _isDown:false,
    _isInHint:false,    //提示中
    ctor:function(){
        this._super();
        this.init();
    },
    get isDown(){
        return this._isDown
    },
    setTouchEnabled:function(bool) {
        this._touchEnabled = bool;
    },
    init:function(){
        this._ui = ccs.load(res.gameBar_json,"res/").node;
        this._ui.setContentSize(vsize.width,this._ui.height);
        this.addChild(this._ui);

        this._globalArea = cfun.seekWidgetByName(this._ui,"globalArea");

        this._mainBar = cfun.seekWidgetByName(this._ui,"mainBar");

        //function onRejection(sender,type){
        //    trace("....")
        //
        //}
        //mainBar.setSwallowTouches(true);
        //mainBar.setTouchEnabled(true);
        //mainBar.addTouchEventListener(onRejection);

        //cfun.addEventListener(this,this.touchBegan,null)
        cfun.addTouchParclose(this._mainBar);

        //显示已有的全局物品
        this._items = [];
        var allItems = this.getMyGlobalItems();
        for (var id in allItems){
            var item = new globalObject(id);
            this._globalArea.addChild(item);
            item.x = this._items.length * 180 + 70
            item.y = this._globalArea.height/2;
            this._items.push(item);
            item.index = this._items.length;
        }

        //提示功能
        this._hintBtn = cfun.seekWidgetByName(this._ui,"hintBtn");
        hintFun.init(this._hintBtn);
        function onHint(sender,type){
            if (type != ccui.Widget.TOUCH_ENDED) return;
            this.onHint();
        }
        this._hintBtn.addTouchEventListener(onHint.bind(this))

        //手机界面
        this._initPhone();


        var memoryBtn = cfun.seekWidgetByName(this._ui,"memoryBtn");
        function onMemory(sender,type){
            if (type != ccui.Widget.TOUCH_ENDED) return;
            this.onEnterMemory();

        }
        memoryBtn.addTouchEventListener(onMemory.bind(this));


        //记忆动画
        this._memoryNode = cfun.seekWidgetByName(this._ui,"tipMemory");
        this._memoryAction = ccs.load("res/gameBar/jiyiDH.json","res/").action;
        this._memoryNode.runAction(this._memoryAction);
        this._memoryAction.gotoFrameAndPause(0);

        //返回按钮
        this._returnBtn = cfun.seekWidgetByName(this._ui,"returnBtn");
        this._returnBtn.addTouchEventListener(this.onReturn.bind(this));

        this._mReturnBtn = cfun.seekWidgetByName(this._ui,"memoryReturnBtn");
        this._mReturnBtn.addTouchEventListener(this.onReturn.bind(this));

        //物品栏光效
        var guang = ccs.load(res.gameBar_light_json,'res/');
        var guangNode = cfun.seekWidgetByName(this._mainBar,"WPL_guanyuanXG");
        var gAction = guang.action;
        guangNode.runAction(gAction);
        gAction.gotoFrameAndPlay(0,true);

        //帮助按钮
        this._helpBtn = cfun.seekWidgetByName(this._ui,"helpBtn");
        this._helpBtn.addTouchEventListener(this.onHelp.bind(this));

        this._setBtn = cfun.seekWidgetByName(this._ui,"setBtn");
        this._setBtn.addTouchEventListener(this.onSet.bind(this));
        this._mapBtn = cfun.seekWidgetByName(this._ui,"mapBtn");
        this._mapBtn.addTouchEventListener(this.onMap.bind(this));
        this._noteBtn = cfun.seekWidgetByName(this._ui,"noteBtn");
        this._noteBtn.addTouchEventListener(this.onNote.bind(this));



    },
    _initPhone:function(){
        this._phoneBtn = cfun.seekWidgetByName(this._ui,"phoneBtn");
        function onPhone(sender,type){
            if (type != ccui.Widget.TOUCH_ENDED) return;
            this.onOpenPhone();

        }
        this._phoneBtn.addTouchEventListener(onPhone.bind(this));

        //手机来电动画
        this._callingNode = cfun.seekWidgetByName(this._ui,"callingAction");
        this._callingAction = ccs.load(res.gameBar_calling_json,"res/").action;
        this._callingNode.runAction(this._callingAction);
        this._callingAction.gotoFrameAndPause(0);
        //this.phoneCalling();
        //是否显示手机
        this._isFindPhone = cc.sys.localStorage.getItem("isFindPhone");
        if (!this._isFindPhone) {
            this._callingNode.visible = false;
        }


    },

    //找到手机动画
    findPhoneAction:function() {
        function callback() {
            this._callingNode.visible = true;
            this._callingAction.gotoFrameAndPlay(0,80,false);
            this._isFindPhone = true
        }
        //转圈动画
        this.openEffect(this._phoneBtn,callback.bind(this));
    },

    openEffect:function(btn,callback) {
        var effect = ccs.load(res.gamebar_open_effect_json,"res/");
        var enode = effect.node;
        var eaction = effect.action;
        enode.runAction(eaction);
        eaction.gotoFrameAndPlay(0,false);
        btn.addChild(enode);
        enode.x = btn.width / 2;
        enode.y = btn.height / 2;
        function onEndAction() {
            enode.removeFromParent();
            if (callback) {
                callback();
            }
        }
        eaction.setFrameEventCallFunc(onEndAction.bind(this))


    },

    touchBegan:function(touch,event){
        var location = touch.getLocation()
        if (cc.rectContainsPoint(this._mainBar.getBoundingBox(),location)){
            trace("touch mainBar")
            touch.stopPropagation();
            return true
        }
        return false
    },

    //添加全局物品
    addGlobalItem:function(id,source,callback){

        this.setMyGlobalItems(id);
        var item = new globalObject(id);
        item.showMoveImg();
        this._globalArea.addChild(item);
        item.index = this._items.length;    //记下索引
        if (!source) {
            item.y = this._globalArea.height/2;
            item.x = this._items.length * 180 + 70;
            this._items.push(item);
            item.showImg();
        } else {
            item.setTouchEnabled(false);
            source.visible = false;
            var pos = source.convertToWorldSpace(cc.p(source.width * source.anchorX,source.height * source.anchorY));
            pos = this._globalArea.convertToNodeSpace(pos);
            item.setPosition(pos);
            item.scale = source.scale;
            var destPos = cc.p();
            destPos.y = this._globalArea.height/2;
            destPos.x = this._items.length * 180 + 70;
            this._items.push(item);



            var big = cc.scaleTo(0.3,1.5).easing(cc.easeElasticOut());
            var small = cc.scaleTo(0.2,1);
            var speed = 800;
            var distance = cc.pDistance(pos,destPos);

            var posArr = [
                pos,
                cc.p(destPos.x,pos.y),
                destPos
            ]
            var move = cc.bezierTo(distance/speed,posArr);
            var smaller = cc.scaleTo(distance/speed,0.3)

            function onFinish() {
                function onBoom(frame) {
                    if (frame.getEvent() == "finish") {
                        item.showImg();
                        item.visible = true;
                        item.scale = 1;
                        boom.node.removeFromParent();
                        item.setTouchEnabled(true);
                        if (callback) {
                            callback();
                        }
                    }
                }
                item.visible = false
                var boom = cfun.getAnimation(res.game_find_boom_json,false,onBoom);
                boom.node.setPosition(destPos)
                this._globalArea.addChild(boom.node);
            }
            function addEffect() {
                //加特效
                var effect = ccs.load(res.game_find_effect_json,"res/");
                var eNode = effect.node;
                var eAction = effect.action;
                eNode.runAction(eAction);
                eAction.gotoFrameAndPlay(0,false);
                eNode.x = item.width / 2 - 10;
                eNode.y = item.height / 2;
                item.addChild(eNode);
                function onEndAction() {
                    eNode.removeFromParent();
                }
                eAction.setFrameEventCallFunc(onEndAction.bind(this))
            }

            function onAddParticle() {
                //播放找到动画
                var par = new cc.ParticleSystem(res.particle_find_plist);
                par.setPositionType(cc.ParticleSystem.TYPE_FREE);
                par.setTexture(new cc.Sprite(res.particle_find_png).texture);
                par.setPosition(cc.p(0,0));
                //par.setPositionType(cc.POSITION_TYPE_FREE) //不会跟着动
                var batch = new cc.ParticleBatchNode(par.texture);
                batch.addChild(par);
                //item.addChild(batch,-1);
                batch.setPosition(item.getPosition());
                this._globalArea.addChild(batch,-1);
                function onDelPar() {
                    batch.removeFromParent();
                }
                function onStopPar() {
                    //batch.children[0].stopSystem();
                }
                batch.runAction(cc.sequence(move.clone(),cc.callFunc(onStopPar),cc.delayTime(1),cc.callFunc(onDelPar)));
            }
            item.runAction(cc.sequence(big,small,cc.callFunc(addEffect),cc.delayTime(1),cc.callFunc(onAddParticle.bind(this)),cc.spawn(move,smaller),new cc.CallFunc(onFinish.bind(this))))
        }
    },

    pushToGlobalArea:function(){

    },

    //获得所以已收集的全局物品
    getMyGlobalItems:function(){
        var items = cc.sys.localStorage.getItem("globalItems");
        if (items) {
            items = JSON.parse(items);
        } else {
            items = {};
        }
        return items
    },

    //记录下全局物品
    setMyGlobalItems:function(id){
        var items = this.getMyGlobalItems();
        items[id] = true;
        items = JSON.stringify(items);
        cc.sys.localStorage.setItem("globalItems",items);
    },

    //删除全局物品的记录
    deleteMyGlobalItems:function(id){
        var items = this.getMyGlobalItems();
        delete items[id];
        items = JSON.stringify(items);
        cc.sys.localStorage.setItem("globalItems",items);

        var delIndex    //移除位置的索引
        //从数组中删除
        for(var i = 0; i < this._items.length; ++i){
            if (this._items[i]._id == id){
                this._items.splice(i,1);
                delIndex = i
                break;
            }
        }
        if(this._globalArea.getChildByTag(id)){
            this._globalArea.removeChildByTag(id);
        }

        //后面的物品往前移动
        for (;delIndex < this._items.length; ++delIndex){
            this._items[delIndex].x -= 100;
        }
    },

    initGlobalItems:function(){
        for(var i = 0; i < this._items.length; ++i){
            this._items[i].updateTarget();
        }
    },

    //打开设置
    onSet:function(sender,type){
        if (type != ccui.Widget.TOUCH_ENDED) return;
        this.nonOpen(this._setBtn,true);
    },
    onHelp:function(sender,type) {
        if (type != ccui.Widget.TOUCH_ENDED) return;
        this.nonOpen(this._helpBtn,true);
    },
    onMap:function(sender,type) {
        if (type != ccui.Widget.TOUCH_ENDED) return;
        this.nonOpen(this._mapBtn);
    },
    onNote:function(sender,type) {
        if (type != ccui.Widget.TOUCH_ENDED) return;
        this.nonOpen(this._noteBtn);
    },


    //提示
    onHint:function(){
        //var nonOpen;
        //nonOpen = cfun.getAnimation(res.gameBar_not_open2_json, false, onFinish);
        //nonOpen.node.x = 1600;
        //nonOpen.node.y = 200;
        //function onFinish(frame) {
        //    if(frame.getEvent() == "finish") {
        //        nonOpen.node.removeFromParent();
        //    }
        //}
        //this._mainBar.addChild(nonOpen.node);
        //return;
        if(this._isInHint) {
            //sceneManager.scene._ui.removeChildByName("rollTip");
            //return;
        } else {
            this._isInHint = true;
            sceneManager.scene.setSceneTouch(false);
            var item = hintFun.beginHint();
            if (!item) {
                //没有任务了 或者在手机之类的不在场景树中的界面
                return;
            }
            //播放提示效果
            var img = item._source;
            var pos = img.convertToWorldSpace(cc.p(img.width*img.anchorX,img.height*img.anchorY));
            var targetPos = this._mainBar.convertToNodeSpace(pos);

            //移动场景
            var moveX = 0;
            var ox = 0;
            if (pos.x > vsize.width) {
                ox = pos.x - vsize.width;
                ox = ox > vsize.width ? ox : vsize.width; //至少移动一个屏幕大小
                moveX = sfun.moveScene(-ox);
            } else if (pos.x < 0) {
                ox = -pos.x;
                ox = ox > vsize.width ? ox : vsize.width;
                moveX = sfun.moveScene(ox);
            }
            targetPos.x += moveX;     //改变粒子效果的移动位置
            pos.x += moveX;

            var par = new cc.ParticleSystem(res.particle_find_plist);
            par.setTexture(new cc.Sprite(res.particle_hint_png).texture);
            par.setPosition(cc.p(0,0));
            //par.setStartRadius(2);
            //par.setEndRadius(2);
            //par.setPositionType(cc.POSITION_TYPE_FREE) //不会跟着动
            var batch = new cc.ParticleBatchNode(par.texture);
            batch.addChild(par);
            batch.setPosition(this._hintBtn.getPosition());
            this._mainBar.addChild(batch);

            var speed = 1200
            var move = cc.moveTo(cc.pDistance(batch.getPosition(),targetPos) / speed,targetPos);
            function onFinish() {
                sceneManager.scene.setSceneTouch(true);
                var newPos = sceneManager.scene._ui.convertToNodeSpace(pos);
                batch.removeFromParent();
                //移动到目标后 添加转圈效果
                var effect = cfun.getAnimation(res.game_tip_roll_json,true,onShow);
                effect.node.setPosition(newPos);
                effect.node.setName("rollTip");
                function onShow(frame) {
                    if (frame.getEvent() == "show") {
                        effect.action.play("action",true);
                    }
                    effect.action.clearFrameEventCallFunc();
                }
                sceneManager.scene._ui.addChild(effect.node,1000);
            }
            batch.runAction(cc.sequence(move,cc.callFunc(onFinish)))
        }

    },

    //手机界面
    onOpenPhone:function(){
        if(!this._isFindPhone) return;
        if(this._phoneScene){
            // this._phoneScene.game.onCusExit()
            // this._phoneScene.backTo();
            // this._phoneScene = null;
            // this.showGameBar()
        }else{
            this._phoneScene = sceneManager.createScene(7);
            //sceneManager.openScene(this._phoneScene)
            this.hideGameBar()
        }
    },


    hide:function(){

    },


    onReturn:function(sender,type) {
        if (type != ccui.Widget.TOUCH_ENDED) return;
        if (!this._touchEnabled) return;
        if (memoryManager.isInMemory()) {
            this.onEnterMemory();
            this.showGameBar();
            return;
        }
        if (sceneManager.scene.backTo)
            sceneManager.scene.backTo()
    },

    //进入记忆
    onEnterMemory:function(){
        memoryManager.memory();
    },

    //提示记忆开启
    tipMemory:function(){
        this._memoryAction.gotoFrameAndPlay(0,true);
    },
    stopTipMemory:function(){
        this._memoryAction.gotoFrameAndPause(0);
    },

    //来电
    phoneCalling:function(){
        this._callingAction.gotoFrameAndPlay(0,true);
    },
    stopPhoneCalling:function(){
        this._callingAction.gotoFrameAndPause(0);
    },

    //工具栏下沉
    hideGameBar:function(isMemory) {
        if (isMemory) {
            this._mReturnBtn.visible = true;
        } else {
            this._mReturnBtn.visible = false;
        }
        if(this._isDown) return
        var down = cc.moveTo(1,cc.p(0,-350));
        function onDown() {
            this._isDown = true;
        }
        //this._returnBtn.visible = false;
        //cfun.seekWidgetByName(this._ui,"jineng1_52").visible = false;
        this._mainBar.runAction(cc.sequence(down,cc.callFunc(onDown.bind(this))));
    },

    showGameBar:function() {
        if(!this._isDown) return
        var up = cc.moveTo(0.7,cc.p(0,0));
        function onUp() {
            this._isDown = false;
        }
        this._mReturnBtn.visible = false;
        this._returnBtn.visible = true;
        cfun.seekWidgetByName(this._ui,"jineng1_52").visible = true;
        this._mainBar.runAction(cc.sequence(up,cc.callFunc(onUp.bind(this))));
    },

    //未开放
    nonOpen:function(btn,pos){
        var nonOpen;
        if (pos == true) {
            nonOpen = cfun.getAnimation(res.gameBar_not_open_json, false, onFinish);
            nonOpen.node.x = 175;
            nonOpen.node.y = 70;
        } else {
            nonOpen = cfun.getAnimation(res.gameBar_not_open2_json, false, onFinish);
            nonOpen.node.x = -175;
            nonOpen.node.y = 70
        }
        function onFinish(frame) {
            if(frame.getEvent() == "finish") {
                nonOpen.node.removeFromParent();
            }
        }
        btn.addChild(nonOpen.node);

    }


});