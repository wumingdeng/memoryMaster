/**
 * Created by chenzhaowen on 16-6-17.
 */


var SCENE_Type = {
    full:1,     //全屏
    embed:2,     //嵌入
    game:3      //玩法场景
};

//全屏切换的玩法场景，或者嵌入在场景中的玩法场景,默认为全屏切换
var EMBED_Type = {
    full:1,     //全屏
    embed:2,     //嵌入
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
        name:"房间",
        type: SCENE_Type.full,  //场景类型
        item: [101,103,104],   //场景中可点击的物品
        ui: "res/room/gameScene_1.json" //场景对应的UI
    },
    "s2": {
        name:"抽屉",
        type: SCENE_Type.embed,  //场景类型
        item: [201,202,203,204,205,206,207,208,211,212,213,214,215,216,217],   //场景中可点击的物品
        ui: "res/room/chouti/CJ1_chouti.json", //场景对应的UI
        back:1
    },
    "s4":{
        name:"掖庭",
        type: SCENE_Type.full,  //场景类型
        item: [301, 302],   //场景中可点击的物品
        ui: "res/yeting/yeting.json", //场景对应的UI
        back:1          //返回哪个场景
    },
    "s3":{
        name:"纸团拼图",
        type: SCENE_Type.game,  //小游戏场景
        gameId:1,               //对应玩法的详细配置
        item: [],   //玩法中可以加入各种可以交互的主玩法物品 只跟玩法本身有关的物品不用配置进来
        ui:"res/gameScene/gameScene_4/gameScene4_1.json",       //玩法对应的UI
        back:4
    },
    "s5":{
        name:"花园",
        type: SCENE_Type.full,  //场景类型
        item: [501, 502],   //场景中可点击的物品
        ui: "res/huayuan/huayuan.json", //场景对应的UI
        back:1
    },
    "s6":{
        name:"找线索",
        type: SCENE_Type.game,  //小游戏场景
        gameId:2,               //对应玩法的详细配置
        ui:"res/gameScene/gameScene_7/gameScene7_1.json"
    },
    "s7":{
        name:"手机",
        type: SCENE_Type.game,  //小游戏场景
        et:EMBED_Type.full,
        gameId:3,
        item: [],   //场景中可点击的物品
        ui:"res/phone/shoujidonghua_mimajiesuo.json",
        back:1
    }
};

//存在服务端的场景状态
SCENE_STATE = {

};

