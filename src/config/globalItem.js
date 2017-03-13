/**
 * Created by chenzhaowen on 16-6-19.
 * 全局物品配置
 */


GLOBAL_ITEM_CONFIG = {
    g1:{
        name:"手机",
        img:"res/globalItem/zhitiao.png",
        imgMove:"res/globalItem/zhitiao.png",
        target:[102]        //全局物品交互的目标 可以是多个  全局物品使用后判断还有没有其他目标 如果没有了 就从物品栏中消失
    },
    g2:{
        name:"破损的画",
        img:"res/globalItem/meibi.png",
        imgMove:"res/globalItem/meibi.png",
        target:[],
        scene:2       //从全局物品打开一个场景
    },
    g3:{
        name:"罗盘",
        img:"res/globalItem/item_lunpan.png",
        imgMove:"res/globalItem/item_lunpan2.png",
        target:[116],
    },
    g5:{
        name:"抽屉钥匙",
        img:"res/globalItem/item_yaoshi.png",
        imgMove:"res/globalItem/item_yaoshi2.png",
        target:[101]
    },
    g6:{
        name:"纸团",
        img:"res/globalItem/item_zhituan.png",
        imgMove:"res/globalItem/item_zhituan2.png",
        target:[1001],
        scene:12
    },
    g7:{
        name:"纸片",
        img:"res/globalItem/item_zhipian.png",
        imgMove:"res/globalItem/item_zhipian2.png",
        target:[1101]
    },
    g8:{
        name:"电脑",
        img:"res/globalItem/item_diannao.png",
        imgMove:"res/globalItem/item_diannao2.png",
        target:[],
        scene:11
    }
};