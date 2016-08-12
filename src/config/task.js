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
        description: "杜鹃移动",
        scene:1,
        type:TASK_TYPE.auto,
        target:101,
        nextTask:1002,
        isOpen:true,
        result:{
            i101:1,
            i102:1
        }

    },

    1002: {
        description: "和右侧杜鹃对话",
        scene: 1,    //任务发生的场景
        type: TASK_TYPE.click,     //任务类型
        target: 102,   //任务的目标物品
        nextTask:[1003,1005],
        result: {
            i101:2,
            i102:2,
            i103:1,
            i105:1

        }
    },

    1003:{
        description: "让蜡烛熄灭",
        scene:1,
        type:TASK_TYPE.click,
        target:103,   //目标是蜡烛
        nextTask:1008,
        result:{
            i103:2,
            i104:1
        }
    },
    1004:{
        description: "点击化妆盒 并且和左侧对娟对话",
        scene:1,
        type:TASK_TYPE.multi,
        target:[1005,2001],       //配置前置任务
        nextTask:4001,
        isOpen:true,
        result:{
            talk:3,     //播放对话
            i106:1
        }
    },
    1005:{
        description:"和左侧杜鹃说话",
        scene:1,
        type:TASK_TYPE.click,
        target:101,
        nextTask:null,
        completeTask:1004,
        result:{
            //没有改变状态 但会影响10004任务
        }
    },
    1006:{
        description:"得到眉笔",
        scene:1,
        type:TASK_TYPE.click,
        target:107,
        nextTask:3001,
        isOpen:true,
        result:{
            //global:2,   //这个配置应该可以省略
            i107:1
        }
    },
    1007:{
        description:"把纸条交给杜鹃",
        scene:1,
        type:TASK_TYPE.combination,
        target:102,
        nextTask:2002,
        result:{
            talk:5,     //任务完成后会播放一段对话
            i102:4,
            i201:1
        }
    },

    1008:{
        description:"点亮熄灭的蜡烛",
        scene:1,
        type:TASK_TYPE.combination,
        target:104,
        nextTask:null,
        result:{
            i103:3,
            i104:2,
            i108:1
        }
    },

    2001:{
        description:"点击化妆盒提示",
        scene:2,    //桌面场景的任务
        type:TASK_TYPE.click,
        target:201,
        nextTask:null,
        isOpen:true,
        completeTask:[1004,2004],
        result:{
            //没有改变状态 但会影响10004任务
        }
    },
    2002:{
        description:"把化妆盒打开",
        scene:2,
        type:TASK_TYPE.click,
        target:201,
        nextTask:[2003],
        completeTask:2004,
        result:{
            i201:2,
            i202:1,
            i203:1
        }
    },
    2003:{
        description:"收集钥匙",
        scene:2,
        type:TASK_TYPE.click,
        target:202,
        nextTask:[5001],
        completeTask:2004,
        result:{
            //global:3,
            i106:2,
            i202:2
        }
    },
    2004:{
        description:"完成桌面场景的所有交互",
        scene:2,
        type:TASK_TYPE.multi,
        target:[2001,2002,2003],
        nextTask:null,
        isOpen:true,
        result:{
            i105:2
        }
    },

    3001:{
        description:"等待眉笔的佛像?",
        scene:3,
        type:TASK_TYPE.combination, //这是一个组合物品的任务
        target:302,
        nextTask:null,
        result:{
            i302:1
        }
    },
    4001:{
        description:"完成纸团拼图",
        scene:4,
        type:TASK_TYPE.game,    //完成游戏就完成的任务
        nextTask:1007,
        result:{
            global:1,        //完成后获得全局物品 纸条
            i301:1,
            i101:3,
            i102:3
        }
    },
    5001:{
        description:"用钥匙开门",
        scene:5,
        type:TASK_TYPE.combination, //完成钥匙和门的组合
        target:501,
        nextTask:null,
        result:{
            i501:1,
            i502:1
        }
    },

};

//任务状态
TASK_STATE = {
    "1001":{
        isFinish:false
    }
};

