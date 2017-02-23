/**
 * Created by chenzhaowen on 16-7-6.
 * 出现提示
 */

var hintLayer = cc.Layer.extend({
    _id:null,
    _callback:null,
    _isRemove:false,
    ctor:function(hid,callback){
        this._super();
        this._id = hid;
        this._callback = callback;
        this.init();
    },
    init:function(){

        var bg = sptExt.createSprite('zhucaidan_duihua.png','gameScene_1_zhucaidan.plist');
        this.addChild(bg);

        bg.x = vsize.width / 2;
        bg.y = vsize.height - bg.height + 80;
        bg.scaleX = 0.1;

        ////加个容易
        //var layout = new ccui.Layout();
        //layout.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
        //layout.setBackGroundColor(cc.color(128, 128, 128));
        //layout.setContentSize(cc.size(vsize.width, 150));
        //layout.x = 0;
        //layout.y = vsize.height;
        //this.addChild(layout);

        var hint = HINT_CONFIG["h" + this._id];
        var text = new ccui.Text(hint,"SIMHEI",40);
        text.x = vsize.width/2;
        text.y = bg.y;
        text.setOpacity(0);
        text.setFontSize(36);
        text.setString(hint);
        this.addChild(text);

        var open = cc.scaleTo(0.5,1);
        var show = cc.fadeIn(0.3);

        bg.runAction(cc.sequence(open,cc.delayTime(3),cc.callFunc(this.finishHint,this)))
        text.runAction(cc.sequence(cc.delayTime(0.2),show));

        cfun.addTouchParclose(this);

    },
    finishHint:function(){
        this._isRemove = true
        this.removeFromParent();

        if(this._callback) {
            this._callback()
        }
    }
});
