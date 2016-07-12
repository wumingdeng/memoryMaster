/**
 * Created by chenzhaowen on 16-5-5.
 */
var Tip = cc.Layer.extend({
    _itemTag:null,
    _action:null,
    tip:null,
    ctor:function(itemTag){
        this._super();
        this.init(itemTag)
    },
    init:function(itemTag){
        this._itemTag = itemTag;
        this.tip = new cc.Sprite("#gameBottom_tishidonghua.png");
        this.tip.setScale(0);
        this.addChild(this.tip);

    },
    runTipAction:function(targetP,callBackFun) {
        //先移动到目标位置
        var speed = 1200;
        var originalP = cc.p(this.x, this.y);
        var distance = cc.pDistance(originalP, targetP);
        var move = cc.moveTo(distance / speed, targetP);
        var ease = move.easing(cc.easeIn(0.6));
        //    var alpha = cc.FadeOut:create(distance/speed)
        var big = cc.scaleTo(distance / speed, 1.0, 1.0);
        var tip = this.tip;
        function onPlay() {
            //self._action:gotoFrameAndPlay(0, true)
            var rotation = cc.rotateBy(2,360);
            var big = cc.scaleTo(1,1.2);
            var small = cc.scaleTo(1,1);

            tip.runAction(cc.repeatForever(cc.spawn(rotation,cc.sequence(big,small))));
            callBackFun()
        }

        this.runAction(cc.sequence(ease, cc.callFunc(onPlay)));
        this.tip.runAction(big);
    }

});