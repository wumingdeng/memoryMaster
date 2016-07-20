/**
 * Created by chenzhaowen on 16-7-5.
 */

ITEMS[102] = itemBase.extend({

    ctor:function(id,node,action){
        this._super(id,node,action);
        trace("创建特殊物品 102")
    },
    onTouchEnded:function(touch,event){
        //杜鹃先对话 后走到左边
        if (this._info.nowState == 1) {
            this.onTalk(this.onAction.bind(this));
        } else {
            this._super(touch,event);
        }
    },


});