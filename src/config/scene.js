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
        item: [101,102,103,119,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,198,199],   //场景中可点击的物品
        ui: "res/room/gameScene_1.json", //场景对应的UI
        animation:res.romm_open_animation_json
    },
    "s2": {
        name:"抽屉",
        type: SCENE_Type.embed,  //场景类型
        item: [201,202,203,204,205,206,207,208,211,212,213,214,215,216,217],   //场景中可点击的物品
        ui: "res/room/chouti/CJ1_chouti.json", //场景对应的UI
        back:1
    },
    "s3": {
        name:"窗口",
        type: SCENE_Type.embed,  //场景类型
        item: [301],   //场景中可点击的物品
        ui: res.room_chuangkou_json, //场景对应的UI
        back:1
    },

    "s4":{
        name:"木质拼图",
        type: SCENE_Type.embed,  //场景类型
        item: [401, 402, 411, 412],   //场景中可点击的物品
        ui: "res/room/pintu/pintu.json", //场景对应的UI
        back:1          //返回哪个场景
    },

    "s5":{
        name:"空抽屉",
        type: SCENE_Type.embed,  //场景类型
        item: [],   //场景中可点击的物品
        ui: "res/room/chouti/CJ1_chouti_0.json", //场景对应的UI
        back:1
    },
    "s6":{
        name:"找线索",
        type: SCENE_Type.game,  //小游戏场景
        et:EMBED_Type.embed,
        gameId:2,               //对应玩法的详细配置
        ui:"res/embedgame/findclue/gameScene7_1.json"
    },
    "s7":{
        name:"手机",
        type: SCENE_Type.game,  //小游戏场景
        et:EMBED_Type.embed,
        item:[],
        gameId:3,
        ui:"res/phone/mimajiesuo.json"
    },
    "s8":{
        name:"拼图",
        type: SCENE_Type.game,  //小游戏场景
        et:EMBED_Type.embed,
        gameId:5,               //对应玩法的详细配置
        ui:"res/wupinwanfa_pintu/wupinwanfa_pintu.json",       //玩法对应的UI
    },
    "s9":{
        name:'盒子',
        type: SCENE_Type.embed,
        item: [901,902,911],
        ui: res.room_hezi_json,
        back:1
    },
    "s10":{
        name:'小桌子',
        type: SCENE_Type.embed,
        item: [1001,1002],
        ui: res.room_desk_json,
        back:1
    },
    "s11":{
        name:'电脑',
        type: SCENE_Type.embed,
        item: [1101],
        ui: res.room_compute_json,
    },
    "s12":{
        name:'纸团',
        type: SCENE_Type.game,
        et:EMBED_Type.embed,
        gameId:1,
        ui: res.zhituan_json
    },

    "s13":{
        name:'擦除',
        type: SCENE_Type.game,
        // et:EMBED_Type.embed,
        gameId:6,
        ui: res.scratch_json
    },
    "s14":{
        name:'整理地图',
        type: SCENE_Type.game,
        // et:EMBED_Type.embed,
        gameId:7,
        ui: res.gameScene8_json
    },

    "s15": {
        name: "柜子",
        type: SCENE_Type.game,
        gameId: 8,
        item: [1301, 1302, 1303, 1304, 1305, 1306, 1307],
        ui: res.guizi_json,
        back: 1
    },
    "s16": {
        name: "操作台",
        type: SCENE_Type.game,
        gameId: 9,
        item:[],
        ui: res.oprateMachin_json,
        back:1
    },
    "s17":{
        name: "莲花",
        type: SCENE_Type.game,
        gameId: 10,
        ui: res.lianhua_json
    },
    "s18": {
        name: "隧道",
        type: SCENE_Type.full,
        item:[1801,1898,1899],
        ui: res.suidao_json,
        back:1
    },
};

//存在服务端的场景状态
SCENE_STATE = {

};

