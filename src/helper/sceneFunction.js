/**
 * Created by chenzhaowen on 17-1-24.
 */

var sfun = {}

//左右移动 查看整个场景
sfun.viewScene = function(scene,callback) {
    var speed = 500;
    var left = new cc.MoveTo.create(scene._maxX / speed,cc.p(scene._maxX,0));
    var right = new cc.MoveTo.create((scene._maxX - scene._minX) / speed, cc.p(scene._minX,0));
    var back = new cc.MoveTo.create(Math.abs(scene._minX / speed), cc.p(0,0));
    scene._ui.runAction(new cc.Sequence(left,right,back, new cc.CallFunc(callback)));
};


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