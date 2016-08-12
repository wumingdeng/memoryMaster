/**
 * Created by chenzhaowen on 16-6-19.
 * 全局物品配置
 */


GLOBAL_ITEM_CONFIG = {
    g1:{
        name:"纸条",
        img:"res/globalItem/zhitiao.png",
        target:[102]        //全局物品交互的目标 可以是多个  全局物品使用后判断还有没有其他目标 如果没有了 就从物品栏中消失
    },
    g2:{
        name:"眉笔",
        img:"res/globalItem/meibi.png",
        target:[302]        //目标是佛像
    },
    g3:{
        name:"钥匙",
        img:"res/globalItem/yaoshi.png",
        target:[501]        //目标是花园的门
    }
};