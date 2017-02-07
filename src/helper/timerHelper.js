/**
 * Created by Fizzo on 16/5/24.
 */

var timerHelper = {} //namespace

timerHelper.TEMPORARY_TIMER_TABLE = []
//---创建只在本场景使用的计时器 切场景将被移除
/**
 *  * <p>
 *   The scheduled method will be called every 'interval' seconds.</br>
 *   If paused is YES, then it won't be called until it is resumed.<br/>
 *   If 'interval' is 0, it will be called every frame, but if so, it recommended to use 'scheduleUpdateForTarget:' instead.<br/>
 *   If the callback function is already scheduled, then only the interval parameter will be updated without re-scheduling it again.<br/>
 * </p>
 * @param callback {function} callback function
 * @param target {cc.Class} callback function
 * @param {Number} repeat
 * @param {Number} delay
 * @param interval {Number} time interval
 * @param paused {boolean} */
timerHelper.createTimer = function(callback, target ,interval, repeat, delay,paused,key){
    var timerObj = {}
    if(arguments.length == 4){
        cc.director.getScheduler().schedule(callback, target, interval, cc.REPEAT_FOREVER, 0, false, repeat)
        timerObj = {k:repeat,tar:target,cb:callback}
    }else{
        cc.director.getScheduler().schedule(callback, target, interval, repeat, delay, paused, key)
        timerObj = {k:key,tar:target,cb:callback}
    }
    timerHelper.TEMPORARY_TIMER_TABLE.push(timerObj)
}


//--移除定时器
timerHelper.removeTimer = function(key){
    for (var idx in this.TEMPORARY_TIMER_TABLE) {
        var t = this.TEMPORARY_TIMER_TABLE[idx]
        if (t.k == key) {
            this.TEMPORARY_TIMER_TABLE.splice(Number(idx), 1)
            cc.director.getScheduler().unschedule(key, t.tar)
            break;
        }
    }
}

//--移除所有定时器
timerHelper.removeAllTimer = function(){
    this.TEMPORARY_TIMER_TABLE.forEach(function(e){
        cc.director.getScheduler().unschedule(e.k, e.tar)
    })
    this.TEMPORARY_TIMER_TABLE = []
}

timerHelper.TALK_TIME=10001 //手机通话时间的定时器
timerHelper.SILDE_TIME=10002 //手机滑动的文本的闪光定时器
timerHelper.NUMBER_BTN_TIME=10003 //手机输入数字按钮的定时器