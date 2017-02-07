var res = {

    loginScene_json:"res/loginScene.json",


    //寝宫场景
    qingong_json: "res/qingong/qingong.json",
    leftDujuan_json:"res/qingong/leftDujuan.json",
    rightDuJuan_json:"res/qingong/rightDujuan.json",
    qingong_desktop_json:"res/qingong/desktop/desktop.json",

    //掖庭
    yeting_json:"res/yeting/yeting.json",
    foXiang_json:"res/yeting/foXiang.json",

    //花园
    huayuan_json:"res/huayuan/huayuan.json",
    door_json:"res/huayuan/door.json",

    //游戏通用
    game_return_png:"res/gameScene/Game_fanhui.png",
    gameBar_json:"res/gameBar/gameBar.json",
    custom_font:"res/font/customFont.ttf",
    custom_font:"res/font/customFont.ttf",

    //碎片拼图
    jisawGame_1_json:"res/gameScene/gameScene_4/gameScene4_1.json",
    jisawGame_1_png:"res/gameScene/gameScene_4/gameScene4_1.png",
    gameBg_png:"res/background/SceneUI_bg.jpg",

    //找杂物
    //findGame_1_json:"res/gameScene/gameScene_5/gameScene5_1.json",
    //findGame_1_plist:"res/gameScene/gameScene_5/gameScene5_1.plist",
    //findGame_1_png:"res/gameScene/gameScene_5/gameScene5_1.png",

    // 找线索
    gameScene_7_json:"res/gameScene/gameScene_7/gameScene7_1.json",
    gameScene_7_plist:"res/gameScene/gameScene_7/gameScene7_1.plist",
    gameScene_7_png:"res/gameScene/gameScene_7/gameScene7_1.png",

    room_json:'res/room/gameScene_1.json',
    room_lianzi_json:'res/room/gameScene_1_lianzidakai.json',
    room_zd_json:'res/room/gameScene_1zhedang.plist',
    room_chouti_json:'res/room/chouti/CJ1_chouti.json',
    room_chouti_plist:"res/room/chouti/gameScene_1_chouti.plist",
    room_chouti_benzi_json:"res/room/chouti/chouti_benzi.json",
    room_chouti_dingshuji_json:"res/room/chouti/chouti_dingshuji.json",
    room_chouti_shubiao_json:"res/room/chouti/chouti_shubiao.json",
    room_chouti_wawa_json:"res/room/chouti/chouti_wawa.json",
    room_chouti_xiaogou_json:"res/room/chouti/chouti_xiaogou.json",
    room_chouti_zhi_json:"res/room/chouti/chouti_zhi.json",
    room_chouti_zhi2_json:"res/room/chouti/chouti_zhi2.json",

    phone_shoujidonghua_mimajiesuo_json:"res/phone/shoujidonghua_mimajiesuo.json"
};

var public_res=[
    res.game_return_png
]

var login_resources = [
    res.loginScene_json
]

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}

var scene_resources = {
    "s1":[
        res.custom_font,
        res.gameBar_json
    ],
    "s3":[
        res.jisawGame_1_json,
        res.gameBg_png,
        res.custom_font
    ],
    "s4":[
        res.yeting_json,
        res.foXiang_json,
        res.custom_font,
        res.gameBar_json
    ],
    "s2":[
    ],
    "s6":[
        res.gameScene_7_json,
        res.gameScene_7_plist,
        res.gameScene_7_png
    ],
    "s7":[
    ]
};
console.log((0.2+0.7).toFixed(3))