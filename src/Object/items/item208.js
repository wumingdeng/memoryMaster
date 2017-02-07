/**
 * Created by chenzhaowen on 17-2-5.
 * 手机
 */

ITEMS[208] = itemBase.extend({

    ctor:function(id,node,action){
        this._super(id,node,action);
        trace("创建特殊物品 208")
    },
    onTouchEnded:function(touch,event){
        //手机直接飞到工具栏
        //this._super(touch,event);
        //if (this._info.nowState == 1) {
        //    this.onTalk(this.onAction.bind(this));
        //} else {
        //}
        this.onFindPhone();
    },
    onFindPhone:function(){
        trace("找到手机")
        //螺旋走位 飞入工具栏
        var source = this._source;
        var btn = GAME_BAR._phoneBtn;
        var pos = btn.convertToWorldSpace(cc.p(0,0));
        pos = source.parent.convertToNodeSpace(pos);
        var controlPoints = [
            cc.p(source.x,source.y),
            cc.p(pos.x, vsize.height / 2),
            pos ];
        var big = cc.scaleTo(0.6,1.5).easing(cc.easeElasticIn());
        var move = cc.bezierTo(1, controlPoints);
        var small = cc.scaleTo(1,.2);
        var rotation = cc.rotateTo(0.1,45);

        var phone = new cc.MotionStreak(1, 10, source.width, cc.color.WHITE, "res/globalItem/shouji.png");
        source.parent.addChild(phone);
        phone.x = source.x;
        phone.y = source.y;
        //var back = move.clone().reverse();
        source.setLocalZOrder(10000);
        source.runAction(cc.sequence(big,cc.delayTime(0.4),rotation,cc.spawn(move,small)));
        function onFollow(dt) {
            phone.x = source.x;
            phone.y = source.y;
            phone.setStroke(source.width * source.scaleX);
        }
        var colorAction = cc.sequence(
            cc.tintTo(0.2, 255, 0, 0),
            cc.tintTo(0.2, 0, 255, 0),
            cc.tintTo(0.2, 0, 0, 255),
            cc.tintTo(0.2, 0, 255, 255),
            cc.tintTo(0.2, 255, 255, 0),
            cc.tintTo(0.2, 255, 0, 255),
            cc.tintTo(0.2, 255, 255, 255)
        ).repeatForever();
        phone.runAction(colorAction);
        phone.schedule(onFollow);




    }


});