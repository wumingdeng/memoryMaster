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
                taskManager.completeTask(4001); //先直接完成游戏
                break;
            default:
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
sceneManager.getAdjacentScene = function(sid) {

};