/**
 * Created by chenzhaowen on 16-7-8.
 * 游戏工具栏
 */

GAME_BAR = null;
var gameBar = cc.Layer.extend({
    _ui:null,
    _globalArea:null,
    _mainBar:null,
    _items:null,    //存放全局物品
    _phoneBtn:null, //手机按钮

    ctor:function(){
        this._super();
        this.init();
    },
    init:function(){
        this._ui = ccs.load(res.gameBar_json,"res/").node;
        this._ui.setContentSize(vsize.width,this._ui.height);
        this.addChild(this._ui);

        this._globalArea = ccui.helper.seekWidgetByName(this._ui,"globalArea");

        this._mainBar = ccui.helper.seekWidgetByName(this._ui,"mainBar");

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
            item.x = this._items.length * 100 + 70
            item.y = this._globalArea.height/2;
            this._items.push(item);
            item.index = this._items.length;

        }

        //提示功能
        var hintBtn = ccui.helper.seekWidgetByName(this._ui,"hintBtn");
        hintFun.init(hintBtn);
        function onHint(sender,type){
            if (type != ccui.Widget.TOUCH_ENDED) return;
            hintFun.beginHint()

        }
        hintBtn.addTouchEventListener(onHint)

        //手机界面
        this._phoneBtn = ccui.helper.seekWidgetByName(this._ui,"phoneBtn");
        function onPhone(sender,type){
            if (type != ccui.Widget.TOUCH_ENDED) return;
            this.onOpenPhone();

        }
        this._phoneBtn.addTouchEventListener(onPhone.bind(this));
    },

    touchBegan:function(touch,event){
        var location = touch.getLocation()
        if (cc.rectContainsPoint(this._mainBar.getBoundingBox(),location)){
            trace("touch mainBar")
            touch.stopPropagation();
            return true
        }
    },

    //添加全局物品
    addGlobalItem:function(id,callback){

        this.setMyGlobalItems(id);
        var item = new globalObject(id);
        this._globalArea.addChild(item);
        item.y = this._globalArea.height/2;
        item.x = this._items.length * 100 + 70;
        this._items.push(item);
        item.index = this._items.length;    //记下索引
        if (callback) {
            callback();
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

        this._globalArea.removeChildByTag(id);

        //后面的物品往前移动
        for (;delIndex < this._items.length; ++delIndex){
            this._items[delIndex].x -= 100;
        }


    },

    //打开设置
    openSet:function(){
        
    },

    //提示
    onHint:function(){

    },

    //手机界面
    onOpenPhone:function(){
        sceneManager.createScene(7);
    },

    hide:function(){

    }


});