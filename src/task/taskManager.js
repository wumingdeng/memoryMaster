/**
 * Created by chenzhaowen on 16-7-5.
 *
 * 处理任务
 */

TASKS = {};     //存放任务
//MULTI_TASKS = {};   //复合任务
taskManager = {};


//初始化任务配置
taskManager.initTask = function(){
    //把任务按照场景分好
    for (var id in TASK_CONFIG.data){
        //记录下复合任务 这些任务跟场景无关
        if (taskManager.getTaskState(id).isFinish == false){
            //if (TASK_CONFIG.data[id].type == TASK_TYPE.multi){
            //    MULTI_TASKS[id] = TASK_CONFIG.data[id];
            //} else {
                var sid = TASK_CONFIG.data[id].scene;   //取到任务发生的场景
                if (!TASKS[sid]) {
                    TASKS[sid] = {};
                }
                TASKS[sid][id] = TASK_CONFIG.data[id];
            //}
        }
    }
};



//取场景中的所有任务
taskManager.getSceneTask = function(sid){

    return TASKS[sid]
};


//根据id 获得任务状态
taskManager.getTaskState = function(tid){
    var info = cc.sys.localStorage.getItem("t" + tid);
    if (info) {
        info = JSON.parse(info);
    } else {
        info = {isFinish:false};
        info.isOpen = TASK_CONFIG.data[tid].isOpen;     //取任务是否开启
    }
    return info
};

taskManager.setTaskState = function(tid,info){

    var oldState = taskManager.getTaskState(tid);
    for (var key in info) {
        oldState[key] = info[key];
    }
    oldState = JSON.stringify(oldState);
    //把改变后的状态写到本地或服务端
    cc.sys.localStorage.setItem("t" + tid,oldState);
};

//获得任务配置信息
taskManager.getTaskInfoById = function(tid){
    //var tasks = taskManager.getSceneTask(PLAYER_STATE.scene)
    var tasks = taskManager.getSceneTask(Math.floor(tid/1000))
    for (var id in tasks) {
        if (id == tid) {
            return tasks[id]
        }
    }
    //for (id in MULTI_TASKS) {
    //    if (id == tid){
    //        return MULTI_TASKS[id]
    //    }
    //}
    return cc.error("没找到任务...逻辑一定有问题!")
};

//检测是否完成任务
taskManager.checkTask = function(item,isDone){
    var tasks = taskManager.getSceneTask(PLAYER_STATE.scene);
    for (var id in tasks) {
        var taskState = this.getTaskState(id);
        if (tasks[id].target == item._id && taskState.isOpen && !taskState.isFinish) {

            if (item.haveBehavior(ITEM_BEHAVIOR.wait)){
                if (isDone){
                    this.completeTask(id);      //完成了组合动作
                }
                return;
            }
            //物品满足完成任务的要求
            this.completeTask(id);
            return;
        }
    }
};

//完成任务
taskManager.completeTask = function(tid){
    //把任务状态变成已完成
    var state = taskManager.getTaskState(tid);
    if (state.isFinish) {
        trace(tid + "任务已完成");
        return true;
    }
    var info = {};
    info.isFinish = true;
    this.setTaskState(tid,info);

    //重置提示功能
    hintFun.refresh();

    //根据配置 改变状态
    var taskInfo = taskManager.getTaskInfoById(tid);
    var result = taskInfo.result;
    for (var key in result) {
        var temp = /i([\d]+)/.exec(key);
        if (temp) {
            //取到要改变状态的物品
            var itemId = temp[1];
            var itemInfo = itemManager.getItemInfoById(itemId);
            var changeInfo = itemInfo.state[result[key]];    //取到要改变的状态
            changeInfo.nowState = result[key];     //改变当前状态
            itemManager.setItemState(itemId,changeInfo);     //改变状态
            continue;
        }
        //完成任务后的各种行为
        //对话
        if (key == "talk") {
            var talkId = result[key];
            //var talkInfo = TALK_CONFIG["t" + talkId];
            var talkLayer = new dialogueLayer(talkId);
            cc.director.getRunningScene().addChild(talkLayer,100);
            continue;
        }
        //获得全局物品
        if (key == "global"){
            var globalId = result[key];
            trace("突然获得全局物品:" + globalId);
            GAME_BAR.addGlobalItem(globalId);
        }

        //消耗全局物品
        if (key == 'use') {
            var globalId = result[key];
            GAME_BAR.deleteMyGlobalItems(globalId);
        }

        //关闭场景
        if (key == "close") {
            if (sceneManager.scene._id == result[key]) {
                if (sceneManager.scene.closeScene) {
                    sceneManager.scene.closeScene();
                    continue;
                }
                if (sceneManager.scene.backTo) {
                    sceneManager.scene.backTo();
                    continue;
                }
            }
        }

        if (key == "open") {
            var sceneId = result[key];
            sceneManager.createScene(sceneId,cc.p(vsize.width / 2, vsize.height / 2));
        }

        if (key == "hint") {
            var hid = result[key];
            var hint = new hintLayer(hid);
            cc.director.getRunningScene().addChild(hint,100);
        }

        if (key == "memory") {
            memoryManager.openMemory();
            GAME_BAR.tipMemory();
        }

        if (key == "completeTask") {
            var taskId = result[key];
            this.completeTask(taskId);
        }

    }


    //开启其他任务
    var nextTask = taskInfo.nextTask;
    if (nextTask) {
        if (!cc.isArray(nextTask)) {
            nextTask = [nextTask];   //都变成数组
        }
        for(var i = 0; i < nextTask.length; ++i){
            var nextTaskId = nextTask[i];
            this.setTaskState(nextTaskId,{isOpen:true});     //改变任务开启状态

        }

    }


    //删除完成的任务
    delete TASKS[PLAYER_STATE.scene][tid];
    //delete MULTI_TASKS[tid];

    //判断有没有复合的任务已经完成了

    if (taskInfo.completeTask){
        var mulitTask = taskInfo.completeTask;
        if (!cc.isArray(mulitTask)) {
            mulitTask = [mulitTask];
        }
        //判断组合任务
        here:for (var j = 0; j < mulitTask.length; ++j) {
            var mulitTaskInfo = this.getTaskInfoById(mulitTask[j]);
            var targets = mulitTaskInfo.target;
            for (var i = 0; i < targets.length; ++i) {
                var state = this.getTaskState(targets[i]);
                if (!state.isFinish) {
                    continue here;
                }
            }
            //到这里说明复合任务已经完成
            this.completeTask(mulitTask[j]);
            return;
        }
    }

    //tasks:for (var id in MULTI_TASKS){
    //    var targets = MULTI_TASKS[id].target;
    //    for (var i = 0; i < targets.length; ++i) {
    //        var state = this.getTaskState(targets[i]);
    //        if (!state.isFinish) {
    //            continue tasks;
    //        }
    //    }
    //    //到这里说明复合任务已经完成
    //    this.completeTask(id);
    //    return;
    //}
};

//完成游戏场景的任务
taskManager.finishGameTask = function(){
    var tasks = this.getSceneTask(PLAYER_STATE.scene);
    for (var id in tasks) {
        if (tasks[id].type == TASK_TYPE.game) {
            this.completeTask(id);
        }
    }
}

taskManager.initTask();