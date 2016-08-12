/**
 * Created by chenzhaowen on 16-6-21.
 */

var sceneManager = {

};


//创建不同类型的场景
sceneManager.createScene = function(sid){
    //var self = arguments.callee;
    if (cc.isArray(sid) && sid.length > 1) {
        //弹出选择场景的界面
        var select = new selectScene(sid);
        cc.director.getRunningScene().addChild(select,1000)

    } else {
        //直接进入场景
        var info = this.getSceneInfo(sid);
        switch (info.type) {
            case SCENE_Type.full:   //创建全屏的场景
                new fullScene(sid,info);
                PLAYER_STATE.mainScene = sid;
                break;
            case SCENE_Type.embed:  //创建嵌入的场景
                new embedScene(sid,info);
                break;
            case SCENE_Type.game:
                new gameScene(sid,info);
                //taskManager.completeTask(4001); //先直接完成游戏
                //PLAYER_STATE.scene = 3;   //强行回到掖庭
                break;

        }
        PLAYER_STATE.scene = sid;   //改玩家状态
    }
    g_nowSelectItem = null;
};



//根据id 获得场景信息
sceneManager.getSceneInfo = function(sid){
    var info = cc.sys.localStorage.getItem("s" + sid)
    if (info) {
        JSON.parse(info);
    } else {
        info = SCENE_CONFIG.data["s" + sid];
    }
    return info
};




//返回场景中是否有可以做的任务
sceneManager.sceneHaveTask = function(sid){

};

//获得相邻的场景
sceneManager.getNearScene = function(sid) {
    var info = this.getSceneInfo(sid);
    var items = info.item;  //场景中的物品
    var sceneArr = [];  //存结果的数组
    //检查这些物品是否是其他场景的入口
    for (var i = 0; i < items.length; ++i){
        var itemInfo = itemManager.getItemState(items[i]);  //取物品当前的信息
        if (itemInfo.behavior == ITEM_BEHAVIOR.goto && itemInfo.visible == true){
            var nearSid = itemInfo.goto;
            nearSid = cc.isArray(nearSid) ? nearSid:[nearSid];  //变成数组
            for (var j = 0; j < nearSid.length; ++j) {
                sceneArr.push(nearSid[j]);
            }
        }
    }
    //再加入上一个场景
    if (info.back) {
        sceneArr.push(info.back);
    }

    return sceneArr;
};