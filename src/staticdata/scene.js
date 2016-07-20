/**
 * Created by chenzhaowen on 16-6-17.
 */


var SCENE_Type = {
    full:1,     //全屏
    embed:2,     //嵌入
    game:3      //玩法场景
};
var SCENE_CONFIG = {

};
/**格式样例
 {
    name:"寝宫",
    type: SCENE_Type.full,  //场景类型
    gameId:1                //当场景是个小游戏时配置 对应的game.js文件中配置玩法的详细信息
    item: [1, 2, 3, 4, 5],   //场景中可点击的物品
    ui: "res/hotel/entrance.json", //场景对应的UI
    animation:"res/animation/begin.json",   //开场动画
    back:1          //点击下面区域要返回的场景  如果多选 配成数组
},*/

SCENE_CONFIG.data = {
    "s1": {
        name:"寝宫",
        type: SCENE_Type.full,  //场景类型
        item: [101, 102, 103, 104, 105, 106, 107, 108],   //场景中可点击的物品
        ui: "res/gameScene/qingong/qingong.json", //场景对应的UI
    },
    "s2": {
        name:"桌面",
        type: SCENE_Type.embed,  //场景类型
        item: [201, 202, 203],   //场景中可点击的物品
        ui: "res/gameScene/qingong/desktop/desktop.json", //场景对应的UI
    },
    "s3":{
        name:"掖庭",
        type: SCENE_Type.full,  //场景类型
        item: [301, 302],   //场景中可点击的物品
        ui: "res/gameScene/yeting/yeting.json", //场景对应的UI
        back:1          //返回哪个场景
    },
    "s4":{
        name:"纸团拼图",
        type: SCENE_Type.game,  //小游戏场景
        gameId:1,               //对应玩法的详细配置
        item: [],   //玩法中可以加入各种可以交互的主玩法物品 只跟玩法本身有关的物品不用配置进来
        back:1
    },
    "s5":{
        name:"花园",
        type: SCENE_Type.full,  //场景类型
        item: [501, 502],   //场景中可点击的物品
        ui: "res/gameScene/huayuan/huayuan.json", //场景对应的UI
        back:1
    }
};

//存在服务端的场景状态
SCENE_STATE = {

};

