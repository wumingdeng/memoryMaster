/**
 * Created by chenzhaowen on 17-1-24.
 */

var sfun = {}

//左右移动 查看整个场景
sfun.viewScene = function(scene,callback) {
    //var speed = 500;
    //var left = new cc.MoveTo.create(scene._maxX / speed,cc.p(scene._maxX,0));
    //var right = new cc.MoveTo.create((scene._maxX - scene._minX) / speed, cc.p(scene._minX,0));
    //var back = new cc.MoveTo.create(Math.abs(scene._minX / speed), cc.p(0,0));
    //scene._ui.runAction(new cc.Sequence(left,right,back, new cc.CallFunc(callback)));
    var left = cc.moveTo(2.5,cc.p(scene._maxX - 500,0)).easing(cc.easeInOut(4.0))
    var back = cc.moveTo(1.5,cc.p(0,0)).easing(cc.easeIn(1.0))
    var big = cc.scaleTo(2.5,1.1).easing(cc.easeInOut(4.0));
    var small = cc.scaleTo(1.5,1);

    scene._ui.runAction(cc.sequence(cc.spawn(big,left),cc.delayTime(0.5),cc.spawn(back,small),new cc.CallFunc(callback)));
};

sfun.moveScene = function(ox,callback) {
    var scene = sceneManager.scene;
    if (!scene._ui) return 0;
    var nowX = scene._ui.x;
    if (nowX + ox < scene._minX) {
        ox = scene._minX;
    } else if (nowX + ox > scene._maxX) {
        ox = scene._maxX;
    }
    var speed = 1500;
    var move = cc.moveBy(ox / speed,cc.p(ox,0));
    function onFinish() {
        if (callback) {
            callback();
        }
    }
    scene._ui.runAction(cc.sequence(move,cc.callFunc(onFinish)))
    return ox //返回移动了多少像素
}


//镜头拉近的效果
sfun.lookAt = function(scene,x,y,zoom,callback) {
    var ui = scene._ui
    if (ui._isChange) return;
    ui._ap = ui.getAnchorPoint();
    ui.setAnchorPoint(x / ui.width, y / ui.height);
    ui._x = ui.x;
    ui._y = ui.y;
    ui.x += x;
    ui.y += y;
    var big = new cc.ScaleTo(0.5,zoom);
    ui._isChange = true;
    cfun.addFullScreen("pull")
    function onBig() {
        if (callback) {
            callback();
        }
        cfun.removeFullScreen("pull")
    }
    ui.runAction(new cc.Sequence(big,new cc.CallFunc(onBig)));
};

//镜头还原
sfun.lookOrigin = function(scene) {
    var ui = scene._ui;
    if (ui._isChange) {
        var small = new cc.ScaleTo(0.3,1);
        function onOrigin(){
            ui.setAnchorPoint(0,0);
            ui.x = ui._x;
            ui.y = ui._y;
            ui._isChange = false;
            cfun.removeFullScreen("Origin")
        }
        cfun.addFullScreen("Origin");
        ui.runAction(new cc.Sequence(small,new cc.CallFunc(onOrigin)));
    }
};



//加个问号
sfun.addInterrogation = function(pos) {
    //记忆动画
    var animation = ccs.load(res.game_why_json,"res/");
    var why = animation.node;
    why.setPosition(pos);
    cc.director.getRunningScene().addChild(why,1001);
    var action = animation.action;
    why.runAction(action);
    action.gotoFrameAndPlay(0,false);
    function onEndAction(frame) {
        var event = frame.getEvent();
        if (event == "end") {
            why.removeFromParent();
        }
    }
    action.setFrameEventCallFunc(onEndAction)
}