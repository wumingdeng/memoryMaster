/**
 * Created by chenzhaowen on 16-6-17.
 */

TASK_TYPE = {
    auto:0,      //自动触发并完成
    click:1,     //点击物品
    combination:2,   //组合
    multi:3,         //多个操作才能完成的任务   可以把其他各类型任务打个包 并且不影响其他任务
    game:4,         //完成游戏的任务
};

TASK_CONFIG = {

};



TASK_CONFIG.data = {
    1001:{
        description: "窗帘打开",
        scene:1,
        type:TASK_TYPE.click,
        target:103,
        nextTask:1002,
        isOpen:true,
        result:{
        }

    },

    1002: {
        description: "椅子移动到位",
        scene: 1,    //任务发生的场景
        type: TASK_TYPE.click,     //任务类型
        target: 107,   //任务的目标物品
        nextTask:[],
        isOpen:true,
        result: {
            i105:1,
            i107:1,
            i108:1
        }
    },

    1003: {
        description: "找到拼图碎片2",
        scene: 1,    //任务发生的场景
        type: TASK_TYPE.click,     //任务类型
        target: 106,   //任务的目标物品
        nextTask:[4002],
        isOpen:true,
        result: {
            i106:1
        }
    },

    1004: {
        description:"打开抽屉",
        scene:1,
        type:TASK_TYPE.combination,
        target:101,
        result:{
            i101:1,
            open:2
        }
    },


    1005: {
        description:"找到罗盘",
        scene:1,
        type:TASK_TYPE.click,
        isOpen:true,
        target:115,
        result:{
            i115:1,
            hint:12
        }
    },

    1006:{
        description:"打开密道",
        scene:1,
        type:TASK_TYPE.combination,
        target:116,
        result:{
            i116:2,
            i117:1,
            hint:9
        }
    },



    2001:{
        description:"拨开娃娃",
        scene:2,    //桌面场景的任务
        type:TASK_TYPE.click,
        target:201,
        nextTask:null,
        isOpen:true,
        completeTask:[2008],
        result:{
            i201:1,
            i211:1
        }
    },
    2002:{
        description:"拨开小狗",
        scene:2,    //桌面场景的任务
        type:TASK_TYPE.click,
        target:202,
        nextTask:null,
        isOpen:true,
        completeTask:[],
        result:{
            i202:1,
            i212:1
        }
    },
    2003:{
        description:"拨开鼠标",
        scene:2,    //桌面场景的任务
        type:TASK_TYPE.click,
        target:203,
        nextTask:null,
        isOpen:true,
        completeTask:[2008],
        result:{
            i203:1,
            i213:1
        }
    },
    2004:{
        description:"拨开钉书机",
        scene:2,    //桌面场景的任务
        type:TASK_TYPE.click,
        target:204,
        nextTask:null,
        isOpen:true,
        completeTask:[2008],
        result:{
            i204:1,
            i214:1
        }
    },
    2005:{
        description:"拨开本子",
        scene:2,    //桌面场景的任务
        type:TASK_TYPE.click,
        target:205,
        nextTask:null,
        isOpen:true,
        completeTask:[2008],
        result:{
            i205:1,
            i215:1
        }
    },
    2006:{
        description:"拨开纸1",
        scene:2,    //桌面场景的任务
        type:TASK_TYPE.click,
        target:206,
        nextTask:null,
        isOpen:true,
        completeTask:[2008],
        result:{
            i206:1,
            i216:1
        }
    },
    2007:{
        description:"拨开纸2",
        scene:2,    //桌面场景的任务
        type:TASK_TYPE.click,
        target:207,
        nextTask:null,
        isOpen:true,
        completeTask:[2008],
        result:{
            i207:1,
            i217:1
        }
    },
    2008:{
        description:"拨开所有杂物",
        scene:2,
        type:TASK_TYPE.multi,
        target:[2001,2003,2004,2005,2006,2007],
        nextTask:2009,
        isOpen:true,
        result:{
            i208:1
        }
    },
    2009:{
        description:"找到手机",
        scene:2,
        type:TASK_TYPE.click,
        target:208,
        nextTask:null,
        isOpen:true,
        result:{
            i208:2,
            hint:14,
            close:2
        }
    },

    3001:{
        description:"赶走无人机",
        scene:3,
        type:TASK_TYPE.click,
        target:301,
        nextTask:null,
        isOpen:true,
        result:{
            i301:1,
            i102:1,  //场景1的无人机消失
            close:3,
            hint:11
        }

    },

    4001:{
        description:"完成拼图1",
        scene:4,
        type:TASK_TYPE.combination,
        target:401,
        completeTask:[4003],
        result:{
            i107:1,
            i401:1,
            i411:1
        }
    },

    4002:{
        description:"完成拼图2",
        scene:4,
        type:TASK_TYPE.combination,
        target:402,
        completeTask:[4003],
        result:{
            i108:1,
            i402:1,
            i412:1
        }
    },
    4003:{
        description:"完成所有拼图",
        scene:4,
        type:TASK_TYPE.multi,
        target:[4001,4002],
        nextTask:[],
        isOpen:true,
        result:{
            i104:1,
            close:4
        }
    },
    8001:{
        description:"完成记忆拼图",
        scene:8,
        type:TASK_TYPE.game,    //完成游戏就完成的任务
        result:{
            i105:2,
            i106:1,
            hint:16
        }
    },
    9001:{
        description:"打开盒子",
        scene:9,
        type:TASK_TYPE.click,
        target:901,
        nextTask:[9002],
        isOpen:true,
        result:{
            i901:1,
            i911:1,
            i902:1
        }
    },
    9002:{
        description:"找到抽屉钥匙",
        scene:9,
        type:TASK_TYPE.click,
        target:902,
        nextTask:[1004],
        result:{
            i902:2,
            i112:1,
            close:9
        }
    },

    //小桌子场景的任务
    10001:{
        description:"找到纸团",
        scene:10,
        type:TASK_TYPE.click,
        target:1001,
        nextTask:[],
        isOpen:true,
        result:{
            i1001:1,
            i118:1,
            hint:13
        }
    },
    11001:{
        description:"打开电脑",
        scene:11,
        type:TASK_TYPE.click,
        target:1101,
        isOpen:true,
        result:{
            i1101:1
        }
    },
    11002:{
        description:"解锁电脑",
        scene:11,
        type:TASK_TYPE.click,
        target:1101,
        nextTask:1006,
        result:{
            i116:1,
            i1101:3,
            use:7,
            memory:true
        }
    },

    12001:{
        description:"完成纸团拼图",
        scene:12,
        type:TASK_TYPE.game,    //完成游戏就完成的任务
        nextTask:11002,
        result:{
            completeTask:11001,
            use:6,
            hint:5,
            i1101:2,
            global:7
        }
    },
    6001:{
        description:"完成找线索任务",
        scene:6,
        type:TASK_TYPE.game,    //完成游戏就完成的任务
        nextTask:[],
        result:{
            i114:1,
            hint:17
        }
    }
};

//任务状态
TASK_STATE = {
    "1001":{
        isFinish:false
    }
};
