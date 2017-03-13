/**
 * Created by chenzhaowen on 17-2-22.
 */


var searchBottom = cc.Layer.extend({
    _game:null,
    _ui:null,
    _textArea:null,
    ITEM_COUNT:10,
    _returnBtn:null,
    _touchEnabled:true,
    ctor:function(game) {
        this._game = game;
        this._super();
        //加载UI
        this.init();
        this.initText();

    },
    init:function() {
        this._ui = ccs.load(res.search_bottom_json,"res/").node;
        this.addChild(this._ui);
        this._textArea = cfun.seekWidgetByName(this._ui,"textArea");
        this._returnBtn = cfun.seekWidgetByName(this._ui,"returnBtn");
        this._returnBtn.addTouchEventListener(this.onReturn.bind(this))
    },

    initText:function() {
        var items = this._game._itemConfig.data;
        var itemCount = items.length > this.ITEM_COUNT ? this.ITEM_COUNT : items.length;
        for (var i = 0; i < this.ITEM_COUNT; ++i) {
            var text = cfun.seekWidgetByName(this._textArea,"text" + (i + 1));
            if (i < items.length) {
                text.setString(items[i][1]);
            } else {
                text.setString("");
            }
        }
    },

    getTextPosition:function(index) {
        var text = cfun.seekWidgetByName(this._textArea,"text" + index);
        return text.convertToWorldSpace(cc.p(text.width * text.anchorX, text.height * text.anchorY));
    },

    deleteText:function(index) {
        var del = cfun.getAnimation(res.search_delete_text_json,false,onFinish);
        var text = cfun.seekWidgetByName(this._textArea,"text" + index);
        function onFinish(frame) {
            var event = frame.getEvent();
            if (event == "end") {
                del.node.removeFromParent();
            } else if (event == 'hide') {
                //text.setTextColor(cc.color(100,100,100));
                text.color = cc.color(72,60,35)
            }
        }
        text.addChild(del.node);
        del.node.setPosition(text.width / 2,text.height / 2);
    },

    onReturn:function(sender,type) {
        if (!this._touchEnabled) return;
        if (type == ccui.Widget.TOUCH_ENDED) {
            this._game.closeGame();
        }
    },

    setTouchEnabled:function(bool) {
        this._touchEnabled = bool;
    }
})