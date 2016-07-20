/**
 * Created by chenzhaowen on 16-6-21.
 */

var sceneBase = cc.Layer.extend({
    _id:null,
    _itemArr:null,
    _type:null,     //场景的类型
    _info:null,     //场景信息
    _ui:null,
    _clickItem:null,    //当前点击的物品
    _isTouch:false,     //鼠标事件的时候需要判断
    _path:"",       //场景文件路径

    ctor:function(id,info){
        this._super();
        this._id = id;
        this._info = info;
        this.init();
    },

    init:function(){
        this._super()
        var json = ccs.load(this._info.ui,"res/")
        this._ui = json.node;
        var action = json.action;
        //action.gotoFrameAndPlay(-1,true)
        //this._ui.runAction(action)
        this.addChild(this._ui);
        cfun.addEventListener(this,this.onTouchBegan,this.onTouchMoved,this.onTouchEnded,this.onTouchCancelled)
        this._path = cc.path.dirname(this._info.ui); //保存路径
        this._initSceneItem();
    },
    //初始化场景中可交互的物品
    _initSceneItem:function(){
        var items = this._info.item;
        this._itemArr = [];     //不能把数组初始化放在属性定义里~! 否则子类会继承到这个数组
        for (var i in items) {
            var node = ccui.helper.seekWidgetByTag(this._ui,items[i]);
            if (!node) cc.error("没有找到物品" + items[i]);
            if (node._className == "Node") {
                //如果是节点 必须把动画帧存起来
                var jsonName = this._path + "/" + node.getName() + ".json";
                var itemAction = ccs.load(jsonName,"res/").action
                var item = itemManager.createItem(items[i],node,itemAction);   //创建物品
            } else {
                item = itemManager.createItem(items[i],node);   //创建物品
            }
            this._itemArr.push(item);
        }
    },


    onTouchBegan:function(touch,event){
        var loc = touch.getLocation();
        for (var i = 0; i < this._itemArr.length; ++i){
            if (this._itemArr[i].isTouchItem(loc)) {
                this._clickItem = this._itemArr[i];
                this._clickItem.onTouchBegan()
                this._isTouch = true;
                //return true;
                break;
            }
        }
        touch.stopPropagation();     //停止向下传递事件
        return true
    },

    onTouchMoved:function(touch,event){
        if (!this._isTouch) return;
        var loc = touch.getLocation();
        this._clickItem.onTouchMoved(touch,event);
    },

    onTouchEnded:function(touch,event){
        if (!this._isTouch) return false;
        this._isTouch = false;
        var loc = touch.getLocation();
        this._clickItem.onTouchEnded(touch,event);

        return true;
    },

    onTouchCancelled:function(touch,event){
        if (!this._isTouch) return;
        this._isTouch = false;
        var loc = touch.getLocation();
        this._clickItem.onTouchCancelled(touch,event);
    },

    onEnter:function(){
        this._super();
    },

    onExit:function(){
        this._super()
        this._destroyScene();
    },

    //销毁场景
    _destroyScene:function(){

    },

    ////根据ID 取场景数据
    //_getSceneInfo:function(){
    //
    //
    //},
    //
    ////设置场景数据
    //setSceneInfo:function(){
    //
    //}

});
