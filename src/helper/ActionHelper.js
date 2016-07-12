/**
 * Created by chenzhaowen on 16-5-3.
 */
var ActionHelper = {};

//@function play combo effect
//@param num #number combo time
//@return action
ActionHelper.comboAction = function(num) {
    var animation = null;
    var action = null;
    var json = null;
    if (num < 7) {
        json = ccs.load("res/animation/lianji/xianchang_lianjiX" + num + ".json","res/");
    } else { // “连击奖励” 效果
        json = ccs.load("res/animation/lianji/xianchang_liangjiJLXG.json","res/");
    }
    animation = json.node;
    action = json.action;
    animation.runAction(action);
    animation.setContentSize(200,200);
    action.gotoFrameAndPlay(0,false);
    function playEndCallFun(frame) {
        var str = frame.getEvent()
        if (str == "end") {
            animation.removeFromParent()
        }
    }
    action.setFrameEventCallFunc(playEndCallFun)
    return animation;
};
ActionHelper.lianjiNumEffectScaleAction = function(source) {
    var actionScaleToBiger = cc.scaleTo(.5, .6);
    var actionScaleToNormad = cc.scaleTo(.5, .5);
    var scalespw = cc.sequence(actionScaleToBiger, actionScaleToNormad);
    source.runAction(cc.repeatForever(scalespw));
};

ActionHelper.lianjiNumEffectRationAction = function(source,callBackFun) {
    source.setAnchorPoint(0, 0);
    source.setPositionX(source.getPositionX() - source.width / 2);
    source.setPositionY(source.getPositionY() - source.height / 2);

    var actionFaleOut = cc.fadeOut(1);
    var actionRation = cc.rotateBy(1, 90, 90);
    var spw = cc.spawn(actionFaleOut, actionRation);

    function endFun() {
        source.setCascadeOpacityEnabled(true);
        source.setRotation(0);
        source.setVisible(false);
        source.setOpacity(255);
        source.setAnchorPoint(.5, .5);
        source.setPositionX(source.x + source.width / 2);
        source.setPositionY(source.y + source.height / 2);
        if (typeof(callBackFun) == "function") {
            callBackFun();
        }
    }

    var endfun = cc.callFunc(endFun);
    var seq = cc.sequence(spw, endfun);
    source.runAction(seq);
};

//@function [parent=#src.helper.ActionHelper] 连击爆炸效果
ActionHelper.lianjiNumBoomEffect = function(targetP,callBackFun) {
    var json = ccs.load(res.lianji_boom_json,"res/");
    var animation = json.node;
    var action = json.action;
    cc.director.getRunningScene().addChild(animation);
    animation.setAnchorPoint(1,.5);
    animation.setPosition(targetP);
    animation.runAction(action);
    action.gotoFrameAndPlay(0, 40, false);
    function playEndCallFun(frame){
        var str = frame.getEvent();
        if (str == "endCallFun") {
            animation.removeFromParent();
        }
    }
    action.setFrameEventCallFunc(playEndCallFun);
    //var par = new cc.ParticleSystem(res.boom_lizi_plist);
    ////par.setTexture(res.boom_lizi_png);
    ////par.setPosition(targetP);
    ////par.setPositionType(cc.POSITION_TYPE_FREE) //不会跟着动
    //var batch = new cc.ParticleBatchNode(par.texture);
    //cc.director.getRunningScene().addChild(batch,1000);
    //par.setPosition(batch);
};
ActionHelper.tiaozhanshibai = function(callBackFun) {
    var json = ccs.load(res.gameFail_json,"res/");
    var animation = json.node;
    var action = json.action;
    cc.director.getRunningScene().addChild(animation);
    animation.setPosition(vsize.width/2-animation.width/2,vsize.height/2-animation.height/2);
    animation.runAction(action);
    action.gotoFrameAndPlay(0, 100, false);
    function touchFun(sender,type){
        callBackFun();
    }
    gfun.setButtonFun(animation.getChildByName("btnCon"),null,null,touchFun);
//    animation.getChildByName("btnCon").addTouchEventListener(touchFun)
};

//@function play TipTrough effect
//@param num #number combo time
//@return action
ActionHelper.TipTroughAction = function() {
    var json = ccs.load(res.prompt_fire_json,"res/");
    var animation = json.node;
    var action = json.action;
    animation.runAction(action);
    action.gotoFrameAndPlay(0,true);
    animation.setContentSize(35,55);
    return animation;
};

//提示正在恢复
ActionHelper.tipRecover = function() {
    var pic = new cc.Sprite("#gameUI_skillrecover.png");
    pic.setScale(0);
    var bigger = cc.scaleTo(.2, 1);
    var raise = cc.moveBy(.2, cc.p(0, 90));
    var action1 = cc.spawn(bigger, raise);
    var disappear = cc.fadeOut(.2);
    var move = cc.moveBy(.2, cc.p(0, 40));
    var action2 = cc.spawn(disappear, move);

    function remove() {
        pic.removeFromParent()
    }

    pic.runAction(cc.sequence(action1, cc.delayTime(1), action2, cc.callFunc(remove)));
    return pic;
};

ActionHelper.TipEffect = function(layer,index,callBackFun) {
    var json = ccs.load(res.click_tip_json);
    var animation = json.node;
    var action = json.action;
    animation.setPositionX(115);
    animation.setPositionY(60);
    animation.runAction(action);
    action.gotoFrameAndPlay(0, false);
    function playEndCallFun(frame) {
        var str = frame.getEvent();
        if (str == "end") {
            animation.removeFromParent();
            var sptLight = layer.getChildByName("tishi" + index);
            var imgLight = layer.getChildByName("imgPnl" + index).getChildByName("imgtishi" + index);
//            imgLight.setVisible(true)
            layer.getChildByName("imgPnl"+index).setClippingEnabled(false);

            var actionScale = cc.scaleBy(.2,5);
            var actionFaOut = cc.fadeOut(.2);
            function lastStepFun() {
                imgLight.setOpacity(255);
                imgLight.setScale(1);
                layer.getChildByName("imgPnl" + index).setClippingEnabled(true);
//                var progressTo = cc.ProgressTo:create(5,100)
//                sptLight:runAction(cc.RepeatForever:create(progressTo))
            }
            var lastStepFun_1 = cc.callFunc(callBackFun);
            var lastStepFun_2 = cc.callFunc(lastStepFun);
            var spwn = cc.spawn(actionScale,actionFaOut);
            var seq = cc.sequence(spwn,lastStepFun_1,lastStepFun_2);
            imgLight.runAction(seq);
        }
    }
    action.setFrameEventCallFunc(playEndCallFun);
    layer.addChild(animation,100);
};

ActionHelper.twinkleAction = function(source,times,callBackFun) {
    function bright() {
        shaderHelper.createShaderBirghtEffect(source)
    }
    function reset() {
        shaderHelper.removeShaderEffect(source)
    }
    var seq = new cc.Sequence(new cc.CallFunc(bright), new cc.DelayTime(.1), new cc.CallFunc(reset), new cc.DelayTime(.1))
    if (times == null || times == 0) {
        source.runAction(new cc.RepeatForever(seq)
        )
    } else if (callBackFun) {
        source.runAction(new cc.Sequence(new cc.Repeat(seq, times), new cc.CallFunc(callBackFun)))
    } else {
        source.runAction(new cc.Repeat(seq, times))
    }
}