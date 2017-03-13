/**
 * Created by chenzhaowen on 17-2-5.
 * 手机
 */

ITEMS[208] = itemBase.extend({
    _isAction:false, // 是否在播放过程中
    ctor:function(id,node,action){
        this._super(id,node,action);
        trace("创建特殊物品 208")
    },
    onTouchEnded:function(touch,event){
        //手机直接飞到工具栏
        if(!this._isAction && this.haveBehavior(ITEM_BEHAVIOR.action)) {
            this.onFindPhone();
        }
    },
    onFindPhone:function(){
        sceneManager.scene.setSceneTouch(false);
        GAME_BAR.setTouchEnabled(false);
        this._isAction = true
        trace("找到手机")
        //螺旋走位 飞入工具栏
        var source = this._source;
        var btn = GAME_BAR._phoneBtn;
        var pos = btn.convertToWorldSpace(cc.p(btn.width * btn.anchorX,btn.height * btn.anchorY));
        pos = source.parent.convertToNodeSpace(pos);
        var controlPoints = [
            cc.p(source.x,source.y + 100),
            cc.p(pos.x, vsize.height / 2 - 200),
            pos ];
        var big = cc.scaleTo(0.6,1.5).easing(cc.easeElasticIn());
        var up = cc.moveBy(0.6,cc.p(0,100));
        var move = cc.bezierTo(0.7, controlPoints);
        var small = cc.scaleTo(0.7,.2);
        var hide = cc.fadeOut(0.5);
        var rotation = cc.rotateTo(0.1,45);

        //var back = move.clone().reverse();
        source.setLocalZOrder(10000);
        source.runAction(cc.sequence(up,big,cc.callFunc(addEffect),cc.delayTime(1),cc.spawn(move,small),hide,cc.callFunc(onFinish.bind(this))));

        //播放找到动画
        var par = new cc.ParticleSystem(res.particle_find_plist);
        par.setTexture(new cc.Sprite(res.particle_find_png).texture);
        par.setPosition(cc.p(0,0));
        //par.setStartRadius(2);
        //par.setEndRadius(2);
        //par.setPositionType(cc.POSITION_TYPE_FREE) //不会跟着动
        var batch = new cc.ParticleBatchNode(par.texture);
        batch.addChild(par);
        batch.retain();
        function addEffect() {
            //加特效
            var effect = ccs.load(res.game_find_effect_json,"res/");
            var eNode = effect.node;
            var eAction = effect.action;
            eNode.runAction(eAction);
            eAction.gotoFrameAndPlay(0,false);
            eNode.x = source.width / 2 - 10;
            eNode.y = source.height / 2;
            source.addChild(eNode);
            function onEndAction() {
                eNode.removeFromParent();
            }
            eAction.setFrameEventCallFunc(onEndAction.bind(this))

            source.addChild(batch,-1);
            batch.x = source.width / 2;
            batch.y = source.height / 2;


        }

        function onFinish() {
            sceneManager.scene.setSceneTouch(true);
            GAME_BAR.setTouchEnabled(true);
            //batch.removeFromParent();
            cc.sys.localStorage.setItem("isFindPhone","true");
            GAME_BAR.findPhoneAction();
            this.checkTask();
            batch.release();
            this._isAction = false
            //播放手机找到动画
        }
        //var phone = new cc.MotionStreak(1, 10, source.width, cc.color.WHITE, "res/globalItem/shouji.png");
        //source.parent.addChild(phone);
        //phone.x = source.x;
        //phone.y = source.y;
        //function onFollow(dt) {
        //    phone.x = source.x;
        //    phone.y = source.y;
        //    phone.setStroke(source.width * source.scaleX);
        //}
        //var colorAction = cc.sequence(
        //    cc.tintTo(0.2, 255, 0, 0),
        //    cc.tintTo(0.2, 0, 255, 0),
        //    cc.tintTo(0.2, 0, 0, 255),
        //    cc.tintTo(0.2, 0, 255, 255),
        //    cc.tintTo(0.2, 255, 255, 0),
        //    cc.tintTo(0.2, 255, 0, 255),
        //    cc.tintTo(0.2, 255, 255, 255)
        //).repeatForever();
        //phone.runAction(colorAction);
        //phone.schedule(onFollow);




    }


});