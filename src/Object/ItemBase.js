/**
 * Created by chenzhaowen on 16-6-20.
 */


var itemBase = cc.Class.extend({
    _id:null,           //唯一id
    _source:null,       //对应场景中的物品对象
    _clickArea:null,    //物品的有效点击区域
    _info:null,        //物品的所有信息
    _action:null,       //编辑好的物品动作
    _originalPos:null,  //物品的原始位置   可以拖动的物品才用到
    _isSelected:false,  //是否被选中

    ctor:function(id,node,action){
        this._id = id;
        this._source = node;
        this._action = action;

        this.init(id);


    },
    init:function(id){
        this._info = itemManager.getItemState(id);
        this._source.onEnter = this.onEnter.bind(this);
        if (this._info.visible == false) {
            this._source.visible = false;
            //return false;
        }

        //初始化点击区域
        if (this._source._className == "Node"){
            var click = (this._source.getChildByName("click") || this._source.getChildren()[0])
            var pos = click.convertToWorldSpace(cc.p(0,0));
            this._clickArea = new cc.Rect();
            this._clickArea.x = pos.x;
            this._clickArea.y = pos.y;
            this._clickArea.width = click.width;
            this._clickArea.height = click.height;

            this._source.runAction(this._action);
            //让有默认动画的物品开始播放默认动画
            if (this._action.getAnimationInfo("base")) {
                console.log("fuck....")
                this._action.play("base",true);
            } else {
                this._action.gotoFrameAndPause(0);
            }
        } else {
            this._clickArea = this._source.getBoundingBox();
        }

        this._originalPos = this._source.getPosition();
        return true;
    },

    onEnter:function(){
        console.log("fuck")
        //如果是进场景就自动播放的物品
        cc.Node.prototype.onEnter.call(this._source)
        if (this.haveBehavior(ITEM_BEHAVIOR.autoAction)){
            this.onAction();
        }
    },

    /***检测有没完成任务
    */
    checkTask:function(isWait){
        taskManager.checkTask(this,isWait); //等待状态另外处理
    },


    onTouchBegan:function(touch,event){
        if (!this.haveBehavior(ITEM_BEHAVIOR.move)) {

        }

        return true
    },
    onTouchMoved:function(touch,event){
        if (this.haveBehavior(ITEM_BEHAVIOR.move)) {
            var delta = touch.getDelta();
            this._source.x += delta.x;
            this._source.y += delta.y;
        }
    },
    onTouchEnded:function(touch,event){
        if (this.haveBehavior(ITEM_BEHAVIOR.wait)){
            //判断是不是选择好要组合的物品了
            if (g_nowSelectItem) {
                if (g_nowSelectItem.checkTouchTarget(this)){        //如果成功组合会返回true
                    return;
                }
            }
        }
        //可移动物品
        if (this.haveBehavior(ITEM_BEHAVIOR.move)){
            //判断目标
            var pos = touch.getLocation();

            this.onMoveTo(pos);
        } else {
            if (g_nowSelectItem) {
                g_nowSelectItem.onSelectItem();
            }
        }

        if (this.haveBehavior(ITEM_BEHAVIOR.hint)){
            this.onHint();
        }
        if (this.haveBehavior(ITEM_BEHAVIOR.action)){
            this.onAction();
        }
        if (this.haveBehavior(ITEM_BEHAVIOR.talk)){
            this.onTalk();
        }
        if (this.haveBehavior(ITEM_BEHAVIOR.goto)){
            this.onGotoNextScene();
        }
        if (this.haveBehavior(ITEM_BEHAVIOR.global)){
            this.onGetGlobalItem();
        }
    },

    isTouchItem:function(location){
        if (this._info.visible == false) {
            return false
        }
        return cc.rectContainsPoint(this._clickArea,location)
    },


    //返回物品是否有传入的交互行为
    haveBehavior:function(behavior){
        var behaviors = this._info.behavior;
        if (cc.isArray(behaviors)){
            for (var i = 0; i < behaviors.length; ++i){
                if (behaviors[i] == behavior)
                    return true;
            }
        }
        return behavior == behaviors
    },

    //调用提示
    onHint:function(next) {
        next = next ||this.checkTask.bind(this);
        var hid = this._info.hint;
        var hint = new hintLayer(hid,next);
        cc.director.getRunningScene().addChild(hint,100);

    },
    onAction:function(next){
        next = next ||this.checkTask.bind(this);
        if (this._action == null || this._action.getAnimationInfo("doAction") == null) {
            trace1("没有编辑物品动画..")
            next();
            return;
            //return new Error("没有编辑物品动画.." + this._id)
        }
        this._action.play("doAction",false)

        function onEndAction(frame){
            var event = frame.getEvent();
            if (event == "end") {
                next();
            }
        }
        this._action.setFrameEventCallFunc(onEndAction.bind(this))

    },
    //调用对话
    onTalk:function(next) {
        next = next || this.checkTask.bind(this);
        var tid = this._info.talk;
        if (!tid) {
            cc.error("物品数据中没有对话ID")
        }
        var talkLayer = new dialogueLayer(tid,next);
        cc.director.getRunningScene().addChild(talkLayer,100);
    },
    //获取全局物品
    onGetGlobalItem:function(next){
        next = next || this.checkTask.bind(this);
        GAME_BAR.addGlobalItem(this._info.global,next);
    },

    //物品触发等待动作
    onWait:function(){

        function finishWait(){
            this.checkTask(true);
        }
        this.onAction(finishWait.bind(this));
    },

    //移动到..
    onMoveTo:function(pos){
        var target = itemManager.getItem(this._info.move);
        if (target.isTouchItem(pos)){
            //完成组合
            trace("完成组合 Congratulations...")
            target.onWait(); //播放动作 并且检测任务
            this._source.visible = false;    //隐藏

        } else {
            //回到原点
            var back = new cc.MoveTo(0.3,this._originalPos);
            this._source.runAction(back);
            var dis = cc.pDistance(this._originalPos,this._source.getPosition())
            if (dis < 10  || this._isSelected == false){
                this.onSelectItem();
            }
        }
    },

    onSelectItem:function(){
        if (this._isSelected){
            //删除文字
            this._source.removeChild(this._text)
            this._text = null;
            g_nowSelectItem = null;
        } else {
            //添加文字
            var name = this._info.name;
            this._text = new ccui.Text();
            this._text.setString(name);
            this._text.setFontSize(30);
            this._text.x = this._source.width/2;
            this._text.y = this._source.height;
            this._source.addChild(this._text);
            g_nowSelectItem = this;
        }
        this._isSelected = !this._isSelected
    },

    checkTouchTarget:function(target){
        //寻找目标
        var waitItem = itemManager.getItem(this._info.move);

        if (waitItem == target) {
            g_nowSelectItem.onSelectItem(); //取消选中
            target.onWait(); //播放动作 并且检测任务
            return true;
        }
        return false;
    },

    isVisible:function(){
        return this._info.visible;
    },

    //进入下一个场景
    onGotoNextScene:function(){
        var sid = this._info.goto;
        sceneManager.createScene(sid);
    }
});
