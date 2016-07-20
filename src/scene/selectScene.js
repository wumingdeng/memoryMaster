/**
 * Created by chenzhaowen on 16-7-18.
 */

var selectScene = cc.Layer.extend({

    ctor:function(scenes){
        this._super();
        this.init(scenes);
    },

    init:function(scenes){

        var items = [];
        for (var i = 0;i < scenes.length; ++i){
            var sid = scenes[i];
            var sInfo = SCENE_CONFIG.data["s" + sid];
            var name = sInfo.name;
            var item = new cc.MenuItemFont(name,this.onSelect)
            item.sid = sid;
            items.push(item);
        }

        var menu = new cc.Menu(items);
        menu.alignItemsVertically()
        this.addChild(menu);
        cfun.addTouchParclose(this);
    },

    onSelect:function(sender){
        trace("enter scene " + sender.sid);
        sceneManager.createScene(sender.sid);
    },

    onEnter:function(){
        this._super();
    }

});