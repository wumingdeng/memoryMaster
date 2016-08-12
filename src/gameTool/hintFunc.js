/**
 * Created by chenzhaowen on 16-7-21.
 */


var hintFun =  {
    _btn:null,
    _start:null,    //遍历的初始场景
    _target:null,   //查到的目标场景
    _searched:null, //已搜寻的场景
    _queue:null,    //遍历用的队列
    _from:null,     //记录场景关系 如:场景A是从场景B进入
    _path:null,     //最终求出的路径
    _tasks:null     //存找到的最近一个场景的任务
};

//初始化提示
hintFun.init = function(btn){
    //this.refresh();
    this._btn = btn;
    //根据提示状态改变按钮显示

};

//重置提示
hintFun.refresh = function() {
    this._searched = {};    //初始化已搜索的场景
    this._target = null;
    this._start = null;
    this._from = {};
    this._path = [];
    this._tasks = null;

    this._searched = {};
    this._queue = [];
};

hintFun.beginHint = function(){
    trace("点击提示");
    var nowPath = this.isOnTheWay();
    if (!nowPath) {
        this.search();
        nowPath = this._path;
    }
    //如果任务在当前场景就消耗提示 指向任务物品
    if (nowPath.length == 1){
        //指向场景中随机一个任务物品
        var taskArr = []
        for (var id  in this._tasks) {
            taskArr.push(id);
        }
        var taskInfo = this._tasks[taskArr[Math.floor(Math.random() * taskArr.length)]];     //随机取任务
        var targetItem = taskInfo.target;

        //消耗次数 并且提示物品
        trace("请点击物品.." + targetItem);
    } else {
        //如果任务在其他场景 就指向场景入口 如果目标场景是嵌入场景 在指向目标场景时就消耗提示次数
        var sceneInfo = sceneManager.getSceneInfo(nowPath[1]);
        if (nowPath.length == 2 && sceneInfo.type == SCENE_Type.embed) {
            //消耗次数 并且指向场景入口
            trace("进入嵌入场景.." + nowPath[1]);
        } else {
            //不消耗次数 提示进入下一个场景
            trace("任务要先进入下个场景中..." + nowPath[1]);
        }
    }

};

//图的广度优先遍历
hintFun.search = function(){
    this.refresh();
    var nowScene = PLAYER_STATE.scene;    //起始场景
    this._start = nowScene;

    this._queue.push(nowScene);
    //进行图的广度优先遍历
    var isFind = false;
    do {
        nowScene = this._queue.shift();
        this._searched[nowScene] = true;    //已经搜索过就打上标记
        this._tasks = this.findTask(nowScene);    //取任务
        if (this._tasks) {
            //找到任务了
            isFind = true;
            this._target = nowScene;
            this._path = this.getPath();
            trace("找到提示任务..sid = " + this._target);
        } else {
            var nearSid = sceneManager.getNearScene(nowScene);
            for (var i = 0; i < nearSid.length; ++i) {
                //把附近场景加入队列 可以加些压入队列的规则 影响查找的顺序
                if (!(nearSid[i] in this._searched)) {  //过滤掉已经搜索过的场景
                    this._queue.push(nearSid[i]);
                    this._from[String(nearSid[i])] = nowScene;
                }
            }
        }

    } while(!isFind && this._queue.length != 0);
    if (!this._tasks) {
        cc.error("没找到任务~!! 就这么结束了吗?")
    }

};

/**
    判断玩家是否在提示给出的路径上
 */
hintFun.isOnTheWay = function(){
    if (!this._path || this._path.length == 0){
        //如果没有路径或者离开路径就重新提示
        return false
    }
    var nowScene = PLAYER_STATE.scene;
    for (var i = 0; i < this._path.length; ++i) {
        if (nowScene == this._path[i]) {
            return this.getPath(nowScene);  //把当前到目标场景的路径返回
        }
    }
    return false;
};

//取到达目标场景的路径
hintFun.getPath = function(from){
    from = from || this._start;
    var to = this._target;
    if (!this._target ||!this._searched[to] || !this._searched[from]){
        return false;       //无结果
    }
    var path = [];

    for (var i = to; i != from; i = Number(this._from[i])) {
        path.unshift(i);
    }
    path.unshift(from);

    return path;
};

//找出场景中的任务
hintFun.findTask = function(sid) {
    var tasks = {};
    cc.extend(tasks,taskManager.getSceneTask(sid)); //把任务信息复制到tasks
    for (var tid in tasks) {
        //把MULTI类型的任务过滤掉
        if(tasks[tid].type == TASK_TYPE.multi){
            delete tasks[tid];
            continue;
        }
        //把未开启的任务过滤掉
        var state = taskManager.getTaskState(tid);
        if (!state.isOpen) {
            delete tasks[tid];
        }
    }
    //this._searched[sid] = true; //标记找过的场景
    if (isEmptyObject(tasks)) {
        return false
    } else {
        return tasks;
    }
};


