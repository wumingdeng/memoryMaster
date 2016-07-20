/**
 * Created by chenzhaowen on 16-7-6.
 * 出现提示
 */

var hintLayer = cc.Layer.extend({
    _id:null,
    _callback:null,

    ctor:function(hid,callback){
        this._super();
        this._id = hid;
        this._callback = callback;
        this.init();

    },

    init:function(){

        //加个容易
        var layout = new ccui.Layout();
        layout.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
        layout.setBackGroundColor(cc.color(128, 128, 128));
        layout.setContentSize(cc.size(vsize.width, 150));
        layout.x = 0;
        layout.y = vsize.height;
        this.addChild(layout);

        var hint = HINT_CONFIG["h" + this._id];
        var text = new ccui.Text(hint,"customFont",40);
        text.x = vsize.width/2;
        text.y = 80;
        text.setFontSize(30);
        text.setString(hint);
        layout.addChild(text);

        var move = new cc.MoveBy(0.5,cc.p(0,-layout.height));

        layout.runAction(cc.sequence(move,cc.delayTime(3),cc.callFunc(this.finishHint,this)))

        cfun.addTouchParclose(this);

    },
    finishHint:function(){
        this.removeFromParent();

        if(this._callback) {
            this._callback()
        }

    }
});
