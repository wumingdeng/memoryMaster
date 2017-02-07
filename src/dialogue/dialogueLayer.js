/**
 * Created by chenzhaowen on 16-7-6.
 */

var dialogueLayer = cc.Layer.extend({
    _id:null,
    _info:null,
    _callback:null,

    ctor:function(id,callback) {
        this._super();
        this._id = id;
        this._callback = callback;
        this.init();
    },

    init:function(){
        this._super
        this._info = TALK_CONFIG["t" + this._id];
        var content = this._info.content;
        var text = new ccui.Text(content,"customFont",40);
        this.addChild(text);
        text.x = vsize.width/2;
        text.y = vsize.height/2;
        text.setFontSize(40);
        text.setString(content);

        this.scheduleOnce(this.onDisappear,3)

        cfun.addTouchParclose(this);

    },
    onDisappear:function(){
        if (this.parent) {
            this.finishDialogue()
            this.removeFromParent()
        }
    },
    //完成对话
    finishDialogue:function(){
        if (this._callback) {
            this._callback()
        }
    }

});
