var res = {

    loginScene_json:"res/loginScene.json",
    gameBar_json:"res/gameBar/gameBar.json",

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

    //碎片拼图
    jisawGame_1_json:"res/gameScene/gameScene_4/gameScene4_1.json",
    jisawGame_1_png:"res/gameScene/gameScene_4/gameScene4_1.png",
    gameBg_png:"res/background/SceneUI_bg.jpg",

    custom_font:"res/font/customFont.ttf"
};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}

var scene_resources = {
    "s1":[
        res.qingong_json
    ]
};
