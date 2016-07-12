/**
 * Created by Fizzo on 16/5/12.
 */

var tskTrcHlp = {} //namespace

//---     tskTrcHlp.task_trace的下标索引      ---
tskTrcHlp.INDEXID=0
tskTrcHlp.TASK_ID=1
tskTrcHlp.AMOUNT1=2
tskTrcHlp.AMOUNT2=3
tskTrcHlp.STATUS=4
tskTrcHlp.task_trace = []  //ongoing tasks

//--- task status
//-- task trace only save current focus task line,when complete a task,set status to tst_over
//-- and try to give a next task,if next task still have prev task need to be finished,do nothing
//    -- if all prev task are finished,generate a new record of task trace and delete useless one.
//-- when give next task,also need check this task's prev task have an "or" style prevtask,if
//-- this task need finish task a or b can give,and current finish b,add case info 's task_clear_line
//-- with b's id.when look back for all prev task finished,should use this varible.when the task is
//-- no a next task,add case info 's task_clear_line with current task_id and trigger open/unlock next
//-- case logic.
tskTrcHlp.TST_NOT_ACCEPT = 0 //--can not accept now
tskTrcHlp.TST_ACCEPT_NOTFIN = 1 //--accepted not finish
tskTrcHlp.TST_ACCEPT_FIN = 2 //--accepted and finish not submit
tskTrcHlp.TST_OVER = 3 //-- accepted and finsihed and submit
tskTrcHlp.TST_ACCEPT_LOCK = 4

//--- prize type
tskTrcHlp.PZT_COIN = 1
tskTrcHlp.PZT_ENERGY = 2
tskTrcHlp.PZT_EXP = 3
tskTrcHlp.PZT_RMB = 4
tskTrcHlp.PZT_OTHER = 5

/**
 * update task,
 * success return true ,or return false
 * @param {Object} extra
 * @return {boolean} isUpdate
 */
tskTrcHlp.onTimeUpdateTaskTrace = function(extra) {
//-- look up all trask trace of me
//collectModifyData = true    --设置成一起发数据
    var type = extra.h  //执行的行为
    var targetId = extra.t //执行的目标ID
    var add_amount = extra.m //执行的目标次数
    var st = extra.s //目标的状态
    var tidArr = extra.ts.split("`") //目前的相关连的任务ID
    var isUpdate = false
    for(var i=0;i<tidArr.length;i++){
        var tid = tidArr[i]
        var idx = tskTrcHlp.findTaskTraceIndexByTaskId(tid)
        var taskStatic = tskTrcHlp.findTaskStaticByTaskId(tid)
        if (taskStatic != null && idx >= 0)
        {
            //--examine the task need is same
            var behavior1 = Math.floor(taskStatic[SD_TASK.BEHAVIOR_TYPENAMOUNT1] / 1000)
            var amount1 = taskStatic[SD_TASK.BEHAVIOR_TYPENAMOUNT1] % 1000
            var statueTarget = taskStatic[SD_TASK.BEHAVIOR_STATUETARGET1].split("`")
            var tar1 =statueTarget[0]
            var st1 = statueTarget[1]

            var behavior2 = Math.floor(taskStatic[SD_TASK.BEHAVIOR_TYPENAMOUNT2] / 1000)
            var amount2 = taskStatic[SD_TASK.BEHAVIOR_TYPENAMOUNT2] % 1000
            var tar2 = taskStatic[SD_TASK.BEHAVIOR_STATUETARGET2].split("`")[0]
            var st2 = taskStatic[SD_TASK.BEHAVIOR_STATUETARGET2].split("`")[1]

            var step1 = tskTrcHlp.checkStep(behavior1, tar1, amount1, type, st1, targetId, add_amount,st, idx,tskTrcHlp.AMOUNT1)
            var step2 = tskTrcHlp.checkStep(behavior2, tar2, amount2, type, st2, targetId, add_amount,st, idx,tskTrcHlp.AMOUNT2)
            isUpdate = step1 && step2
            if (isUpdate) {
                //change task status to accepted_finish_not_commit
                tskTrcHlp.task_trace[idx][tskTrcHlp.STATUS] = tskTrcHlp.TST_OVER
                tskTrcHlp.triggerEndTask(idx)
                tskTrcHlp.deleteTaskTraceByIdx(idx)
                console.log("you complete a task sir!")
                return true
            }else{
                continue;
            }
        }
        return false
    }
}

/**
 * find taskTrace index by taskId,if can't find taskTrace index return -1
 * @param {number} taskId
 * @return {number} taskTrace index */
tskTrcHlp.findTaskTraceIndexByTaskId = function(taskId){
    for(var idx in tskTrcHlp.task_trace){
        if(tskTrcHlp.task_trace[idx][tskTrcHlp.TASK_ID] == taskId) return Number(idx);
    }
    return -1
}

/**
 * find taskstatic by taskId,if can't find taskTrace index return null
 * @param {number} taskId
 * @return {Array} taskStatic */
tskTrcHlp.findTaskStaticByTaskId = function(taskId)
{
    for(var idx in SD_TASK.data){
        var taskStatic = SD_TASK.data[idx]
        if(taskStatic[SD_TASK.ID] == taskId) return taskStatic
    }
    return null
}

/**
 *check step of the task，all the necessary conditions were satisfy
 * @param {number} need_behavior
 * @param {number} need_target
 * @param {number} need_amount
 * @param {number} need_statue
 * @param {number} behavior
 * @param {number} target
 * @param {number} add_amount
 * @param {number} idx taskTrace's index
 * @param {number} amountIdx amount's index in the taskTrace
 * @return {boolean} whether satisfy
 * */
tskTrcHlp.checkStep = function(need_behavior,need_target,need_amount,need_statue,behavior,target,add_amount,targetStatue,idx,amountIdx) {
    if (need_behavior != 0) {
        if (behavior == need_behavior && need_target == target && targetStatue == need_statue) {
            //if (tskTrcHlp.task_trace[idx] == null || cc.isUndefined(tskTrcHlp.task_trace[idx])) {//--then trace of current case is over
            if (tskTrcHlp.task_trace[idx] == null || typeof tskTrcHlp.task_trace[idx] === 'undefined') {//--then trace of current case is over
                return false
            }
            /*TODO
             *
             *
             * */
            tskTrcHlp.task_trace[idx][amountIdx] = tskTrcHlp.task_trace[idx][amountIdx] + add_amount
            return tskTrcHlp.task_trace[idx][amountIdx] >= need_amount
        } else {
            return false
        }
    }else{
        return true
    }
}

/**
 * task is update and trigger next step want to do
 * @param {number} traceidx
 * */
tskTrcHlp.triggerEndTask=function(traceidx) {
    /**
     * TODO
     * call complete task and accept next task,or do anything
     * */
    tskTrcHlp.completeTask(traceidx,null)  //--这里会向服务端更新下任务数据 这时服务端同时存在已完成和刚接到的任务
}

/**
 * complete task and accept next task
 * @param {number} traceidx
 * @param {number} special_next
 * */
tskTrcHlp.completeTask = function(traceidx,special_next) {
    //-- update current exist task trace,and give next task
    var taskid = tskTrcHlp.task_trace[traceidx][tskTrcHlp.TASK_ID]
    var taskStatic = tskTrcHlp.findTaskStaticByTaskId(taskid)
    var next_tasks = taskStatic[SD_TASK.NEXTTASKS]
    if (next_tasks == "") {
        //--not more tasks, finish task
        //TODO
        //--像服务器发送完成任务请求
        //UserHttpRequest.completeTask(taskid, true)
    }else{
        //--give prize
        tskTrcHlp.giveTaskPrizes(taskStatic)
        //--get next tasks
        var next_one = []
        var nts = []
        if (next_tasks.indexOf('_') != -1) {
            var next_tids = next_tasks.split('_')
            if (next_tids.length > 0) {
                //--have next task option
                if (next_tids[special_next] != null) {
                    nts = next_tids[special_next].split('`')
                    //--table.insert(next_one, next_tids[special_next])
                } else {
                    //--table.insert(next_one, next_tids[1])
                    nts = next_tids[1].split('`')
                }
                for (var i = 0; i < nts.length; i++) {
                    next_one.push(nts[i])
                }
            }
        }else{
            nts = next_tasks.split('`')
            for(var i = 0;i<nts.length;i++){
                next_one.push(nts[i])
            }
        }
    }
    //-- check next tasks can be accepted or not
    var idx_list = []
    for(var i=0;i<next_one.length;i++) {
        var the_tid = Number(next_one[i])
        var accepted = tskTrcHlp.acceptTask(the_tid)
        //-- if all task of this task 's prev finished,
        //-- mark key_clear,and also remove all tracer
        if (accepted) {
            //gfun.getTaskPrizeOfOpenScene(caseid, the_tid)
            //var idx = gfun.findCaseById(caseid)
            for(var i in tskTrcHlp.task_trace){
                var status = tskTrcHlp.task_trace[i][tskTrcHlp.STATUS]
                var the_tid = tskTrcHlp.task_trace[i][tskTrcHlp.TASK_ID]
                var taskdata = tskTrcHlp.findTaskStaticByTaskId(the_tid)
                //-- if this task will have  options, save route  map
                if (taskdata[SD_TASK.NEXTTASKS].indexOf('_') != -1) {
                    //CASE_INFOS[idx][CLEARID] = CASE_INFOS[idx][CLEARID] + '`' + the_tid
                }
                if(status == tskTrcHlp.TST_OVER) {
                    idx_list[i] = the_tid
                }
            }
        }
    }
    //--delete task  trace which is  over
    for (var idx in idx_list){
        //--像服务器发送完成任务请求
        //TODO
        //UserHttpRequest.completeTask(tid, true)
        tskTrcHlp.deleteTracesByTaskid(idx_list[idx])
    }
}

/**
 * check PrevTask
 * -- check prev task line is ok
 * @param {number} taskid
 * @param {string} prevtask
 * */
tskTrcHlp.checkPrevTask = function(taskid,prevtask) {
    //-- check target need accepted tasks's prev is completed?
    //-- if not prev task,is ok
    if (prevtask == "") {
        return true
    }
    //-- get all key task_ids
    //-- get key task route map
    var can_accept = false
    var task_mode = 0
    var task_list = []
    //-- get need prev task mode and list data
    if (prevtask.indexOf('_') > 0) {
        //-- you need finished taska or taskb first
        task_list = prevtask.split('_')
        task_mode = 1
    } else {
        //-- you need finished task and taskb first
        task_list = prevtask.split('`')
        task_mode = 2
    }
    var fined = 0
    for (var i in tskTrcHlp.task_trace) {
        //-- check current focus task's status and check it is can be accepted
        var current_task_progress = tskTrcHlp.task_trace[i][tskTrcHlp.TASK_ID]
        var status = tskTrcHlp.task_trace[i][tskTrcHlp.STATUS]
        for (var j in task_list) {
            var need_tid = task_list[j]
            if (task_mode == 1) {
                if (status == tskTrcHlp.TST_OVER && Number(need_tid) == current_task_progress) {
                    can_accept = true
                    break
                }
            }else if (task_mode == 2) {
                if (status == tskTrcHlp.TST_OVER && Number(need_tid) == current_task_progress) {
                    fined = fined + 1
                }
            }
            if (can_accept) {
                break
            }
        }
        if (fined == task_list.length && task_mode == 2) {
            can_accept = true
        }
        //-- all clear and say yes for accepted
        return can_accept
    }
}

/**
 * accept Task
 * @param {number} itid */
tskTrcHlp.acceptTask = function(itid){
    var canAccept = false
    if (itid != 0) {
        //-- is prevtask all finished?
        var taskinfo = tskTrcHlp.findTaskStaticByTaskId(itid)
        var prevtask = taskinfo[SD_TASK.PREVTASKS]
        canAccept = tskTrcHlp.checkPrevTask(itid, prevtask)
        if (canAccept) {
            //-- grab a new task
            var tasktrace = []

            tasktrace.push(1) //-- id
            tasktrace.push(itid) //--taskid
            tasktrace.push(0) //--need amount1
            tasktrace.push(0)//--need amount2
            var taskstatus = 0
            if (taskinfo[SD_TASK.CONDITION] == "") {
                taskstatus = tskTrcHlp.TST_ACCEPT_NOTFIN
            } else {
                taskstatus = tskTrcHlp.TST_ACCEPT_LOCK
            }
            tasktrace.push(taskstatus) //--status, 0 - can not accept now, 1 - accepted not finish, 2 - accepted finish not submit，3 - finish  and submit(should  be  deleted)
            //table.insert(tasktrace, ROLE_DATA["userId"]) //--uid
            tskTrcHlp.task_trace.push(tasktrace)
            console.log("changllenge:" + itid + " accepted")
        }else{             console.log("condition not fit")
        }
        //--向服务端更新任务
        //TODO
        //gfun.modifyTaskTrace()
    }
    return canAccept
}

/**
 * delete TaskTrace By Idx
 * @param {number} traceidx */
tskTrcHlp.deleteTaskTraceByIdx = function(traceidx){
    for(var idx in tskTrcHlp.task_trace) {
        var task = tskTrcHlp.task_trace[idx]
        if (task[tskTrcHlp.TASK_ID] == traceidx) {
            tskTrcHlp.task_trace.splice(idx, 1)
            console.log("delete traceIdx = " + traceidx)
            break;
        }
    }
}

/**
 * delete TaskTrace By taskid
 * @param {number} traceidx */
tskTrcHlp.deleteTracesByTaskid = function(tid){
    for(var key in tskTrcHlp.task_trace){
        var task = tskTrcHlp.task_trace[key]
        if (task[tskTrcHlp.TASK_ID] == tid){
            tskTrcHlp.task_trace.splice(key,1)
            //table.remove(tskTrcHlp.task_trace,key)
            console.log("delete taskid = "+tid)
            break;
        }
    }
}

/**
 * get task prize
 * @param {number} pz_type prize type
 * @param {number} amount prize amount*/
tskTrcHlp.giveTaskPrize=function(pz_type,amount) {
    if (pz_type != 0){
        switch(pz_type){
            case tskTrcHlp.PZT_COIN:
                break;
            case tskTrcHlp.PZT_ENERGY:
                break;
            case tskTrcHlp.PZT_EXP:
                break;
            case tskTrcHlp.PZT_RMB:
                break;
            case tskTrcHlp.PZT_OTHER:
                break;
            default :
                break;
        }
    }
}
/**
 * analysis taskstatic prize
 * @param {Array} whichTask  target taskstatic*/
tskTrcHlp.giveTaskPrizes = function(whichTask) {
    var pz1 = whichTask[SD_TASK.PRIZE_TYPENAMOUNT1]
    var pz2 = whichTask[SD_TASK.PRIZE_TYPENAMOUNT2]
    var zm1 = pz1 % 1000000
    var zm2 = pz2 % 1000000
    var ptype1 = Math.floor(pz1 / 1000000)
    var ptype2 = Math.floor(pz2 / 1000000)
    tskTrcHlp.giveTaskPrize(ptype1, zm1)
    tskTrcHlp.giveTaskPrize(ptype2, zm2)
}