/**
 * Created by Fizzo on 17/3/6.
 */

var gyroLayer = cc.Layer.extend({
    _logIndex:0,
    _node:null,
    _par:null,
    ctor:function(index,parent){
        this._super()
        this._par = parent
        this._node = parent._ui;
        this.init()
    },
    init:function () {
        this._super();

        if( 'accelerometer' in cc.sys.capabilities ) {
            var self = this;
            // call is called 30 times per second
            cc.inputManager.setAccelerometerInterval(1/30);
            cc.inputManager.setAccelerometerEnabled(true);

            var _listener = cc.EventListener.create({
                event: cc.EventListener.ACCELERATION,
                callback: function(accelEvent, event) {
                    var target = event.getCurrentTarget();

                    var w = vsize.width;
                    var h = vsize.height;

                    var x = w * accelEvent.x + w/2;
                    var y = h * accelEvent.y + h/2;

                    // Low pass filter
                    x = x*0.2 + target.prevX*0.8;
                    y = y*0.2 + target.prevY*0.8;

//                    target.prevX = x;
//                    target.prevY = y;
                    target.sprite.x = x/5 + vsize.width/3;
                    target.sprite.y = y/5 + vsize.height/3;
                }
            });
            cc.eventManager.addListener(_listener, this);
//             cc.eventManager.addListener({
//                 event: cc.EventListener.ACCELERATION,
//                 callback: function(accelEvent, event){
//                     var target = event.getCurrentTarget();
//                     // self._logIndex++;
//                     // if (self._logIndex > 20)
//                     // {
//                     //    cc.log('Accel x: '+ accelEvent.x + ' y:' + accelEvent.y + ' z:' + accelEvent.z + ' time:' + accelEvent.timestamp );
//                     //    self._logIndex = 0;
//                     // }
//
//                     var w = vsize.width;
//                     var h = vsize.height;
//
//                     var x = w * accelEvent.x + w/2;
//                     var y = h * accelEvent.y + h/2;
//
//                     // Low pass filter
//                     x = x*0.2 + target.prevX*0.8;
//                     y = y*0.2 + target.prevY*0.8;
//
//                     target.sprite.x = x/5 + vsize.width/3;
//                     target.sprite.y = y/5 + vsize.height/3;
//                 }
//             }, this);

            // var sprite = this.sprite = new cc.Sprite("res/Game/gongju_guanbi.png");
             var sprite = this.sprite = cfun.seekWidgetByName(this._node,"lianye_disanceng_2")
            // this.addChild( sprite );
//             sprite.x = vsize.width/2;
//             sprite.y = vsize.height/2;

            // for low-pass filter
            this.prevX = vsize.width/2;
            this.prevY = vsize.height/2;
        } else {
            cc.log("ACCELEROMETER not supported");
        }
    },
    onEnter:function(){
        this._super();
    }
})