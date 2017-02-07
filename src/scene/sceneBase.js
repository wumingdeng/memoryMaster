/**
 * Created by chenzhaowen on 16-6-21.
 */

var sceneBase = cc.Layer.extend({
    _id:null,
    _itemArr:null,
    _type:null,     //场景的类型
    _info:null,     //场景信息
    _ui:null,
    _action:null,
    _clickItem:null,    //当前点击的物品
    _isTouch:false,     //鼠标事件的时候需要判断
    _path:"",       //场景文件路径
    _touchBegin:false,
    _canMove:false, //是否可以移动(根据背景图的大小判断)
    _bg:null,   //背景图
    _minX:null, //场景的最小X坐标
    _maxX:null, //最大X坐标

    //_scrollView:null,

    ctor:function(id,info){
        this._super();
        this._id = id;
        this._info = info;
        this.init();
    },

    init:function(){
        if (this._info.ui){
            var json = ccs.load(this._info.ui,"res/")
            this._ui = json.node;
            this._action = json.action;
            // action.gotoFrameAndPlay(-1,true)
            // this._ui.runAction(action)
            this.addChild(this._ui);
            this._path = cc.path.dirname(this._info.ui); //保存路径

            this._bg = this._ui.getChildByName('bg');
            if (this._bg && this._bg.width > vsize.width) {
                this._minX = -this._bg.width - this._bg.x + vsize.width;
                this._maxX = -this._bg.x;
                this._canMove = true;
            }

        }
        cfun.addEventListener(this,this.onTouchBegan,this.onTouchMoved,this.onTouchEnded,this.onTouchCancelled)

        this._initSceneItem();

    },

    //初始化场景中可交互的物品
    _initSceneItem:function(){
        var items = this._info.item;
        this._itemArr = [];     //不能把数组初始化放在属性定义里~! 否则子类会继承到这个数组
        for (var i in items) {
            var node = ccui.helper.seekWidgetByTag(this._ui,items[i]);
            if (!node) cc.error("没有找到物品" + items[i]);
            else{
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
        }
    },


    onTouchBegan:function(touch,event){
        var loc = touch.getLocation();
        loc = this._ui.convertToNodeSpace(loc);
        for (var i = 0; i < this._itemArr.length; ++i){
            if (this._itemArr[i].isTouchItem(loc)) {
                this._clickItem = this._itemArr[i];
                this._clickItem.onTouchBegan()
                this._isTouch = true;
                //return true;
                break;
            }
        }
        this._touchBegin = true;
        touch.stopPropagation();     //停止向下传递事件
        return true
    },

    onTouchMoved:function(touch,event){
        if (this._touchBegin && this._canMove) {
            var delta = touch.getDelta();
            this._ui.x += delta.x;
            //边界判断
            if (this._ui.x < this._minX) {
                this._ui.x = this._minX;
            }
            if (this._ui.x > this._maxX) {
                this._ui.x = this._maxX;
            }
            //return;
        }
        if (this._isTouch) {
            var loc = touch.getLocation();
            this._clickItem.onTouchMoved(touch,event);
        }
    },

    onTouchEnded:function(touch,event){
        this._touchBegin = false;
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
        //cc.director.setProjection(cc.Director.PROJECTION_3D);
    },

    onExit:function(){
        //cc.director.setProjection(cc.Director.PROJECTION_2D);
        this._super();
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
