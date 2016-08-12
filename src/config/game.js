/**
 * Created by chenzhaowen on 16-6-18.
 */

//游戏类型
GAME_TYPE = {
    puzzle:1,
    findSomething:2,
};

GAME_CONFIG = {
    "g1":{
        description:"纸团碎片拼图",
        type:GAME_TYPE.puzzle,
        // adjacent:["","2`4","1`3`4`5","2`5`9","1`2`5`6`7","2`3`4`7`8`9","4`7","4`5`6`8","5`7`9","3`5`8"],
        // com_pos:["","-200.08`42.12","-66.35`127.68","79.04`158.58","-128.41`-10.61","31.56`40.74","-147.02`-142.24","27.62`-113.82","135.75`-56.11","178.32`18.19"],
        adjacent:"_2`4_1`3`4`5_2`5`9_1`2`5`6`7_2`3`4`7`8`9_4`7_4`5`6`8_5`7`9_3`5`8",
        com_pos:"_-200.08`42.12_-66.35`127.68_79.04`158.58_-128.41`-10.61_31.56`40.74_-147.02`-142.24_27.62`-113.82_135.75`-56.11_178.32`18.19",
        index:0
    },
    "g2":{
        description:"找线索",
        type:GAME_TYPE.findSomething,
        checkPos:"813`395`1_303`400`1_354`155`1_645`260`1_558`436`0_521`274`0_825`177`0",
        index:0
    }
};