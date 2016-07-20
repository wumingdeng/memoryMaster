var fonts = {
    custom_font:"res/fonts/customFont.ttf"
}

var baseRes = {
    AlertResource_png : "res/AlertResource.png",
    AlertResource_plist : "res/AlertResource.plist",
    baseUI_png : "res/baseUI.png",
    baseUI_plist : "res/baseUI.plist",
    HelloWorld_png : "res/HelloWorld.png",
    qishi_plist:"res/qishi_loading.plist",
    qishi_png:"res/qishi_loading.png",
    defen_fnt:"res/fonts/defen.fnt",
    defen_png:"res/fonts/defen.png"
};

var baseRes_resources = [];
for (var i in baseRes) {
    baseRes_resources.push(baseRes[i]);
}

var loginSceneRes = {
    loginScene_json : "res/loginScene/LoginScene.json",

    logindonghuaxiaoguo_json : "res/loginScene/logodonghuaxiaoguo.json",
    qidong_baimaguanyinzhangdonghua_json : "res/loginScene/qidong_baimaguanyinzhangdonghua.json",
    niao_json : "res/loginScene/niao.json",
    niaodonghua_json : "res/loginScene/niaodonghua.json",
    yun_json : "res/loginScene/yun.json",
    qidong_di_png : "res/loginScene/qidong_di.jpg",
    qidongdonghua_plist : "res/loginScene/qidongdonghua.plist",
    qidongdonghua_png:"res/loginScene/qidongdonghua.png",
    feixing_plist : "res/particle/feixing.plist",
    feixing_png : "res/particle/feixing.png",
    tongyong_tishixing01_plist : "res/particle/tongyong_tishixing01.plist",
    tongyong_tishixing01_png : "res/particle/tongyong_tishixing01.png",
    xingxing03_plist : "res/particle/xingxing03.plist",
    xingxing03_png : "res/particle/xingxing03.png",
    xuanz005_plist : "res/particle/xuanz005.plist",
    xuanz005_png : "res/particle/xuanz005.png",
    zair002_png:"res/particle/zair002.png",
    zair002_plist:"res/particle/zair002.plist"
};

var loginSceneRes_resources = [];
for (var i in loginSceneRes) {
    loginSceneRes_resources.push(loginSceneRes[i]);
}

var audioRes = {

}

var res = {

    //公用资源
    game_top_json:"res/gameScene/gameTop.json",
    baseUI_plist:"res/baseUI.plist",
    baseUI_png:"res/baseUI.png",
    MainScene_json:"res/MainScene.json",

    custom_ttf:"res/gameScene/fonts/customFont.ttf",
    defen_fnt:"res/gameScene/fonts/defen.fnt",
    defen_png:"res/gameScene/fonts/defen.png",
    jcdf_fnt:"res/gameScene/fonts/jcdf.fnt",
    jcdf_png:"res/gameScene/fonts/jcdf.png",
    ljdf_png:"res/gameScene/fonts/gameUI_lianjidengfen.png",

    scratch_png : "res/gameScene/scratch/scratch1.png",
    scratch_plist : "res/gameScene/scratch/scratch1.plist",
    scratch_json : "res/gameScene/scratch/scratch1.json",
    clue_bg : "res/background/ClueUI_bg.jpg",
    menu_bg:"res/background/qidong_di.jpg",
    menu_png : 'res/menu.png',

    //找物品通用资源
    line_animation_plist:"res/animation/wupumingchenghuaquxian_Animation/anjianwupinhuaxian_Animation.plist",
    line_animation_png:"res/animation/wupumingchenghuaquxian_Animation/anjianwupinhuaxian_Animation.png",
    game_bottom_json:"res/gameScene/gameBottom.json",
    game_sceneui_plist:"res/gameSceneUI.plist",
    game_sceneui_png:"res/gameSceneUI.png",

    lianji_plist:"res/animation/lianji/changjing_lianjiXGJL.plist",
    lianji_png:"res/animation/lianji/changjing_lianjiXGJL.png",
    lianji_num1_plist:"res/animation/lianji/changjing_lianjiXGJL1.plist",
    lianji_num1_png:"res/animation/lianji/changjing_lianjiXGJL1.png",
    lianji_num3_plist:"res/animation/lianji/changjing_lianjiXGJLX3.plist",
    lianji_num3_png:"res/animation/lianji/changjing_lianjiXGJLX3.png",
    lianji_num4_plist:"res/animation/lianji/changjing_lianjiXGJLX4.plist",
    lianji_num4_png:"res/animation/lianji/changjing_lianjiXGJLX4.png",
    lianji_num5_plist:"res/animation/lianji/changjing_lianjiXGJLX5.plist",
    lianji_num5_png:"res/animation/lianji/changjing_lianjiXGJLX5.png",
    lianji_num6_plist:"res/animation/lianji/changjing_lianjiXGJLX6.plist",
    lianji_num6_png:"res/animation/lianji/changjing_lianjiXGJLX6.png",
    lianji_jiangli_json:"res/animation/lianji/xianchang_liangjiJLXG.json",
    lianji_num2_json:"res/animation/lianji/xianchang_lianjiX2.json",
    lianji_num3_json:"res/animation/lianji/xianchang_lianjiX3.json",
    lianji_num4_json:"res/animation/lianji/xianchang_lianjiX4.json",
    lianji_num5_json:"res/animation/lianji/xianchang_lianjiX5.json",
    lianji_num6_json:"res/animation/lianji/xianchang_lianjiX6.json",
    lianji_json:"res/animation/lianji/xianchang_lianjiXG.json",

    lianji_boom_json:"res/animation/lianjibaozha/baozhaguangxiaoguo.json",
    boom_lizi_plist:"res/animation/lianjibaozha/bz01.plist",
    boom_lizi_png:"res/animation/lianjibaozha/bz01.png",


    //点击错误
    click_wrong_plist:"res/animation/cuowudianji/dianjicuowudonghua.plist",
    click_wrong_png:"res/animation/cuowudianji/dianjicuowudonghua.png",
    click_continuousError_json:"res/animation/cuowudianji/continuousError.json",
    click_error_daojishi_json:"res/animation/cuowudianji/cuowu_shijiandaojishi.json",

    //挑战失败
    gameFail_json:"res/animation/tiaozhanshibai/gameFail.json",
    jixvBtn_png:"res/animation/tiaozhanshibai/gameUI_zdxjixu.png",
    shibai_png:"res/animation/tiaozhanshibai/shibai.png",
    shibaixg_png:"res/animation/tiaozhanshibai/shibaiguangxiao.png",
    tiaozhan_png:"res/animation/tiaozhanshibai/tianzhan.png",

    //挑战成功
    success_json:"res/animation/tiaozhanchenggong/accountsView.json",
    success_cg_png:"res/animation/tiaozhanchenggong/jiesuan_chenggong.png",
    success_fg_png:"res/animation/tiaozhanchenggong/jiesuan_chenggongfaguang.png",
    success_tz_png:"res/animation/tiaozhanchenggong/jiesuan_tianzhan.png",

    //暂停界面
    pauseUI_json:"res/gameScene/pauseUI.json",

    //提示效果
    prompt_fire_plist:"res/animation/tishihuoyan/xianchang_zhukongqu_houyanXG.plist",
    prompt_fire_png:"res/animation/tishihuoyan/xianchang_zhukongqu_houyanXG.png",
    prompt_fire_json:"res/animation/tishihuoyan/zhukongqu_houyanXG.json",

    click_tip_json:"res/animation/tishidianji/dianjijinengxiaoguo.json",
    click_tip_plist:"res/animation/tishidianji/dianjijinengxiaoguo.plist",
    click_tip_png:"res/animation/tishidianji/dianjijinengxiaoguo.png",

    //search scene1资源
    wuzhenglihe_png:"res/gameScene/searchGame/gameScene_1/evidence/gameUI_wuzhenglihe.png",
    wuzhengshoupai_png:"res/gameScene/searchGame/gameScene_1/evidence/gameUI_wuzhengshoupai.png",
    gameScene_1_jpg:"res/gameScene/searchGame/gameScene_1/gameScene_1.jpg",
    gameScene_1_json:"res/gameScene/searchGame/gameScene_1/gameScene_1.json",
    gameScene_1_plist:"res/gameScene/searchGame/gameScene_1/gameScene_1.plist",
    gameScene_1_png:"res/gameScene/searchGame/gameScene_1/gameScene_1.png",
    gameScene_1_02_jpg:"res/gameScene/searchGame/gameScene_1/gameScene_1_02.jpg",
    gameScene_1_zhuguang_plist:"res/gameScene/searchGame/gameScene_1/gameScene_1_zhuguang.plist",
    gameScene_1_zhuguang_png:"res/gameScene/searchGame/gameScene_1/gameScene_1_zhuguang.png",
    huomiao_json:"res/gameScene/searchGame/gameScene_1/huomiao.json",
    jiangli_tq_plist:"res/gameScene/searchGame/gameScene_1/jiangli_tq.plist",
    jiangli_tq_png:"res/gameScene/searchGame/gameScene_1/jiangli_tq.png",
    shoushihe_json:"res/gameScene/searchGame/gameScene_1/shoushihe.json",

    //公共音效
    common_click_mp3:"res/audio/Sound/common_click.mp3",
    //玩法音效
    clickError_mp3:"res/audio/Sound/game_clickError.mp3",
    clickWarn_mp3:"res/audio/Sound/game_clickWarn.mp3",
    game_combo2_mp3:"res/audio/Sound/game_combo2.mp3",
    game_combo3_mp3:"res/audio/Sound/game_combo3.mp3",
    game_combo4_mp3:"res/audio/Sound/game_combo4.mp3",
    game_combo5_mp3:"res/audio/Sound/game_combo5.mp3",
    game_comboAward1_mp3:"res/audio/Sound/game_comboAward1.mp3",
    game_comboAward2_mp3:"res/audio/Sound/game_comboAward2.mp3",
    game_find_mp3:"res/audio/Sound/game_find.mp3",
    game_listTime_mp3:"res/audio/Sound/game_listTime.mp3",
    game_newEvidence_mp3:"res/audio/Sound/game_newEvidence.mp3",
    game_Prompt_mp3:"res/audio/Sound/game_Prompt.mp3",
    game_useSkill_mp3:"res/audio/Sound/game_useSkill.mp3",

    Hello_png:"res/HelloWorld.png",

    //线索玩法 8
    gameScene8_json : "res/gameScene/sortMapGame/gameScene_8.json",
    gameScene8_png : "res/gameScene/sortMapGame/gameScene_8.png",
    gameScene8_plist : "res/gameScene/sortMapGame/gameScene_8.plist",

    //线索玩法 7
    gameScene7_json:"res/gameScene/gameScene_7/gameScene7_1.json",
    gameScene7_png:"res/gameScene/gameScene_7/gameScene7_1.png",
    gameScene7_plist:"res/gameScene/gameScene_7/gameScene7_1.plist",

    //线索玩法 4
    //线索玩法 4
    gameScene4_json:"res/gameScene/gameScene_4/gameScene4_1.json",
    gameScene4_png:"res/gameScene/gameScene_4/gameScene4_1.png",
    gameScene4_plist:"res/gameScene/gameScene_4/gameScene4_1.plist",

    //线索玩法 5
    gameScene5_json:"res/gameScene/gameScene_5/gameScene5_1.json",
    gameScene5_png:"res/gameScene/gameScene_5/gameScene5_1.png",
    gameScene5_plist:"res/gameScene/gameScene_5/gameScene5_1.plist",

    //shader source
    shader_blur:"res/shader/example_Blur.fsh",
    shader_celShading:"res/shader/example_celShading.fsh",
    shader_fastBlur:"res/shader/example_fastBlur.fsh",
    shader_fullColor:"res/shader/fullColor.fsh",
    shader_grass:"res/shader/grass.fsh",
    shader_gray:"res/shader/gray.fsh",
    shader_outLine:"res/shader/outLine.fsh",
    shader_public:"res/shader/public.vsh",

    gameBar_json:"res/gameScene/gameBar/gameBar.json",
    loginScene_json :"res/loginScene.json",
    //寝宫场景
    qingong_json: "res/gameScene/qingong/qingong.json",
    leftDujuan_json:"res/gameScene/qingong/leftDujuan.json",
    rightDuJuan_json:"res/gameScene/qingong/rightDujuan.json",
    qingong_desktop_json:"res/gameScene/qingong/desktop/desktop.json",

    //掖庭
    yeting_json:"res/gameScene/yeting/yeting.json",
    foXiang_json:"res/gameScene/yeting/foXiang.json",

    //花园
    huayuan_json:"res/gameScene/huayuan/huayuan.json",
    door_json:"res/gameScene/huayuan/door.json",
};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}

var g_menuResources = [
    //res.custom_ttf,
    res.menu_bg,
    res.Hello_png,
    res.common_click_mp3
];

var g_scratchGame = [
    res.scratch_json,
    res.scratch_png,
    res.scratch_plist,
    res.clue_bg
];

//拼图
var g_jigsawGame = [
    res.gameScene4_json,
    res.gameScene4_plist,
    res.gameScene4_png,
    res.clue_bg
]

//碎纸条拼图玩法
var g_sortMapGame = [
    res.gameScene8_json,
    res.gameScene8_plist,
    res.gameScene8_png,
    res.shader_public,
    res.shader_fullColor,
    res.shader_blur,
    res.clue_bg
]
//放大镜找线索
var g_findSomethingGame = [
    res.gameScene7_json,
    res.gameScene7_plist,
    res.gameScene7_png,
    res.shader_public,
    res.shader_celShading
]

//杂物中找线索
var g_findTargetGame = [
    res.gameScene5_json,
    res.gameScene5_plist,
    res.gameScene5_png
]

var scene_resources = [
    res.gameBar_json,
    res.loginScene_json,
    res.qingong_json,
    res.leftDujuan_json,
    res.rightDuJuan_json,
    res.qingong_desktop_json,
    res.yeting_json,
    res.foXiang_json,
    res.huayuan_json,
    res.door_json
];


var g_searchGame = [
    [   //
        res.custom_ttf,
        res.ljdf_png,
        res.defen_fnt,
        res.defen_png,
        res.jcdf_fnt,
        res.jcdf_png,
        res.line_animation_plist,
        res.line_animation_png,
        res.game_bottom_json,
        res.game_sceneui_plist,
        res.game_sceneui_png,
        res.line_animation_png,
        res.line_animation_plist,
        res.game_top_json,
        res.click_wrong_plist,
        res.click_wrong_png,
        res.baseUI_plist,
        res.baseUI_png,
        res.lianji_plist,
        res.lianji_png,
        res.lianji_num1_plist,
        res.lianji_num1_png,
        res.lianji_num3_plist,
        res.lianji_num3_png,
        res.lianji_num4_plist,
        res.lianji_num4_png,
        res.lianji_num5_plist,
        res.lianji_num5_png,
        res.lianji_num6_plist,
        res.lianji_num6_png,
        res.lianji_jiangli_json,
        res.lianji_num2_json,
        res.lianji_num3_json,
        res.lianji_num4_json,
        res.lianji_num5_json,
        res.lianji_num6_json,
        res.lianji_json,
        res.clickError_mp3,
        res.clickWarn_mp3,
        res.game_combo2_mp3,
        res.game_combo3_mp3,
        res.game_combo4_mp3,
        res.game_combo5_mp3,
        res.game_comboAward1_mp3,
        res.game_comboAward2_mp3,
        res.game_find_mp3,
        res.game_listTime_mp3,
        res.game_newEvidence_mp3,
        res.game_Prompt_mp3,
        res.game_useSkill_mp3,
        res.click_continuousError_json,
        res.click_error_daojishi_json,
        res.lianji_boom_json,
        res.boom_lizi_plist,
        res.boom_lizi_png,
        res.gameFail_json,
        res.jixvBtn_png,
        res.shibai_png,
        res.shibaixg_png,
        res.tiaozhan_png,
        res.pauseUI_json,
        res.prompt_fire_plist,
        res.prompt_fire_png,
        res.prompt_fire_json,
        res.click_tip_json,
        res.click_tip_plist,
        res.click_tip_png,
        res.common_click_mp3,
        res.success_json,
        res.success_cg_png,
        res.success_tz_png,
        res.success_fg_png
    ],
    [   //场景1
        res.wuzhenglihe_png,
        res.wuzhengshoupai_png,
        res.gameScene_1_jpg,
        res.gameScene_1_json,
        res.gameScene_1_plist,
        res.gameScene_1_png,
        res.gameScene_1_02_jpg,
        res.gameScene_1_zhuguang_plist,
        res.gameScene_1_zhuguang_png,
        res.huomiao_json,
        res.jiangli_tq_plist,
        res.jiangli_tq_png,
        res.shoushihe_json
    ]
];