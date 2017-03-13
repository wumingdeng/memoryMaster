/**
 * Created by chenzhaowen on 16-6-21.
 */

var sceneManager = {
    _scene:[],
    get scene(){ //记录当前的主场景
        return this._scene[this._scene.length - 1]; //返回最后放进数组的场景
    },
    set scene(s){
        this._scene = [s];
    },
    //获取主场景,(通常第一个加进去的苍井 )
    get baseScene(){
        return this._scene[0];
    }
};

//创建不同类型的场景
sceneManager.createScene = function(sid,loc){
    //var self = arguments.callee;
    if (this.scene && sid == this.scene._id) {
        return false;
    }
    if (this.scene && this.scene._info.type == SCENE_Type.embed) {
        this.scene.closeScene(create.bind(this))
    } else if (this.scene && this.scene._info.type == SCENE_Type.game && this.scene._info.et == EMBED_Type.embed) {
        this.scene.backTo(create.bind(this));
    } else {
        //直接进入场景
        var info = this.getSceneInfo(sid);
        if (cc.sys.isNative) {
            if (info.type == SCENE_Type.full || (info.type == SCENE_Type.game && (!info.et || info.et == EMBED_Type.full))) {
                console.log("run new scene")
                new loadingScene(create.bind(this), sid)
            } else {
                if (GAME_BAR) {
                    GAME_BAR.onCancelHint(null,true);
                }
                create.bind(this)();
            }
        } else {
            if (GAME_BAR) {
                GAME_BAR.onCancelHint(null,true);
            }
            create.bind(this)();
        }
    }
    function create() {
        var newScene;
        if (cc.isArray(sid) && sid.length > 1) {
            //弹出选择场景的界面
            var select = new selectScene(sid);
            cc.director.getRunningScene().addChild(select,1000)
        } else {
            var info = this.getSceneInfo(sid);
            switch (info.type) {
                case SCENE_Type.full:   //创建全屏的场景
                    this._scene = [];
                    newScene = new fullScene(sid,info);
                    PLAYER_STATE.mainScene = sid;
                    break;
                case SCENE_Type.embed:  //创建嵌入的场景
                    newScene = new embedScene(sid,info,loc);   //嵌入场景需要点击位置
                    break;
                case SCENE_Type.game:
                    //this._scene = [];
                    newScene = new gameScene(sid,info);
                    //taskManager.completeTask(4001); //先直接完成游戏
                    //PLAYER_STATE.scene = 3;   //强行回到掖庭
                    break;

            }
            PLAYER_STATE.scene = sid;   //改玩家状态
        }
        g_nowSelectItem = null;
        return newScene;
    }
};

sceneManager.closeScene = function() {
    this._scene.pop();
    GAME_BAR.initGlobalItems();
};

sceneManager.openScene = function(scene) {
    this._scene.push(scene);
}



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
    var items = info.item || [];  //场景中的物品
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

//获取场景的入口物品
sceneManager.getSceneEntrance = function(sceneId) {
    if (!sceneId) return false;
    var info = this.scene._info;
    var items = info.item;  //场景中的物品
    var sceneArr = [];  //存结果的数组
    //检查这些物品是否是其他场景的入口
    for (var i = 0; i < items.length; ++i){
        var itemInfo = itemManager.getItemState(items[i]);  //取物品当前的信息
        if (itemInfo.behavior == ITEM_BEHAVIOR.goto && itemInfo.visible == true){
            var sid = itemInfo.goto;
            if (sceneId == sid || (cc.isArray(sid) && sceneId in sid)) {
                return itemManager.getItem(items[i]);
            }
        }
    }
    //再加入上一个场景
    if (info.back == sceneId || (cc.isArray(info.back) && sceneId in info.back)) {
        return 'back';
    }

    return null;
}