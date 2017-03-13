/**
 * Created by chenzhaowen on 16-6-17.
 */

ITEM_BEHAVIOR = {
    none:0,         //无交互
    hint:1,      //提示  如果需要不同的提示文本 配置成数组
    animation:2,    //动画
    action:3,       //播放动作
    move:4,         //拖动 配置要拖动到哪个物品上
    goto:5,         //跳转场景
    global:6,        //获得全局物品
    talk:7,          //对话
    autoAction:8,      //一进场景就要动的物品
    wait:9          //等待被其他物品组合 值为要组合的物品ID 这个状态时如果配置了hint 点击会出现提示
};

ITEM_CONFIG = {

};

/**
 {
    name: "门口的某个人",
    hint: 1,           //对应的提示文本
    animation: 1,     //对应的点击动画
    action: true,     //是否自身播放动画
    move: 2,          //物品可以拖动 配置可以交互的物品ID
    goto: 2,          //通往哪个场景
    global: 1,         //点击后获得全局物品
    talk: 1,        //触发的对话
    visible: true,     //初始的显示状态
    behavior: ITEM_BEHAVIOR.hint  //初始行为 多个行为时配成数组
}
 */
ITEM_CONFIG.data = {
    //s1寝宫
    "i101": {
        name: "抽屉",
        state:{
            "0":{
                visible:true,
                hint:1,
                wait:["g5"],
                behavior: [ITEM_BEHAVIOR.wait,ITEM_BEHAVIOR.hint],
            },
            "1":{
                behavior: ITEM_BEHAVIOR.goto,  //初始行为
                goto:2
            }
        }
    },

    "i102": {
        name: "无人机",
        state:{
            "0":{
                visible: true,     //初始的显示状态
                behavior: ITEM_BEHAVIOR.goto,  //初始行为
                goto:3
            },
            "1":{
                visible:false
            }
        }
    },
    "i103": {
        name: "窗帘",
        state:{
            "0":{
                visible: true,     //初始的显示状态
                actionIndex:1,  //播放第几个动画 默认1
                behavior:ITEM_BEHAVIOR.action   //蜡烛变成点击可熄灭
            },
            "1":{
                visible:false
            }
        }
    },
    "i104": {
        name:"小桌子",
        state:{
            "0":{
                visible:true,
                goto:10,
                behavior:ITEM_BEHAVIOR.goto
            },
            "1":{
                visible:true,
                behavior:ITEM_BEHAVIOR.none
            }
        }
    },
    "i105": {
        name:"凌乱的拼图",
        state:{
            "0":{
                visible:true,
                hint:2,
                behavior:ITEM_BEHAVIOR.hint
            },
            "1":{
                visible:true,
                goto:8,
                behavior:ITEM_BEHAVIOR.goto
            },
            "2":{
                visible:false,
                behavior:ITEM_BEHAVIOR.none
            }
        }
    },
    "i106": {
        name:"拼好的拼图",
        state:{
            "0":{
                visible:false,
            },
            "1":{
                visible:true,
                hint:16,
                behavior:ITEM_BEHAVIOR.hint
            }
        }
    },
    "i107": {
        name:"凳子",
        state:{
            "0":{
                visible:true,
                move:cc.p(-562,196),
                behavior:ITEM_BEHAVIOR.move
            },
            "1":{
                visible:false,
                behavior:ITEM_BEHAVIOR.none
            }
        }
    },
    "i108": {
        name:"凳子就位",
        state:{
            "0":{
                visible:false,
                wait:107,
                behavior:ITEM_BEHAVIOR.wait
            },
            "1":{
                visible:true,
                behavior:ITEM_BEHAVIOR.none
            }
        }
    },
    "i109": {
        name: "空抽屉1",
        state:{
            "0":{
                visible: true,     //初始的显示状态
                behavior: ITEM_BEHAVIOR.goto,  //初始行为
                goto:5
            },
            "1":{
                visible:false   //杜鹃动画播完就可以隐藏了
            }
        }
    },
    "i110": {
        name: "空抽屉2",
        state:{
            "0":{
                visible: true,     //初始的显示状态
                behavior: ITEM_BEHAVIOR.goto,  //初始行为
                goto:5
            },
            "1":{
                visible:false   //杜鹃动画播完就可以隐藏了
            }
        }
    },
    "i111": {
        name: "空抽屉3",
        state:{
            "0":{
                visible: true,     //初始的显示状态
                behavior: ITEM_BEHAVIOR.goto,  //初始行为
                goto:5
            },
            "1":{
                visible:false   //杜鹃动画播完就可以隐藏了
            }
        }
    },
    "i112":{
        name: "藏钥匙的盒子",
        state:{
            "0":{
                visible: true,     //初始的显示状态
                behavior: ITEM_BEHAVIOR.goto,  //初始行为
                goto:9
            },
            "1":{
                behavior: ITEM_BEHAVIOR.none,  //初始行为
                visible:true   //杜鹃动画播完就可以隐藏了
            }
        }
    },
    "i113":{
        name: "电脑",
        state:{
            "0":{
                visible: true,     //初始的显示状态
                behavior: ITEM_BEHAVIOR.none
            },
            "1":{
                visible:false
            }
        }
    },

    "i114":{
        name: "手帕",
        state:{
            "0":{
                visible: true,     //初始的显示状态
                behavior: ITEM_BEHAVIOR.goto,  //初始行为
                goto:6
            },
            "1":{
                behavior: ITEM_BEHAVIOR.none,  //初始行为
                visible:true   //杜鹃动画播完就可以隐藏了
            }
        }
    },

    "i115":{
        name: "罗盘",
        state:{
            "0":{
                visible: true,     //初始的显示状态
                behavior: ITEM_BEHAVIOR.global,  //初始行为
                global:3
            },
            "1":{
                behavior: ITEM_BEHAVIOR.none,  //初始行为
                visible:false   //杜鹃动画播完就可以隐藏了
            }
        }
    },
    "i116":{
        name: "暗门",
        state:{
            "0":{
                visible: true,     //初始的显示状态
                behavior: ITEM_BEHAVIOR.none,  //初始行为
            },
            "1":{
                behavior: [ITEM_BEHAVIOR.wait,ITEM_BEHAVIOR.hint],  //初始行为
                hint:7,   //杜鹃动画播完就可以隐藏了
                wait:["g3"]
            },
            "2":{
                visible:false,
                behavior:ITEM_BEHAVIOR.none
            }
        }
    },
    "i117":{
        name: "打开的暗门",
        state:{
            "0":{
                visible: false,     //初始的显示状态
                behavior: ITEM_BEHAVIOR.none,  //初始行为
            },
            "1":{
                visible: true,     //初始的显示状态
                goto:18,
                behavior: ITEM_BEHAVIOR.goto  //初始行为
            }
        }
    },
    "i118":{
        name:"桌上的纸团",
        state:{
            "0":{
                visible:true,
                behavior:ITEM_BEHAVIOR.none,
            },
            "1":{
                visible:false
            }
        }
    },
    "i119":{
        name:"柜子",
        state:{
            "0":{
                visible:true,
                goto:15,
                behavior:ITEM_BEHAVIOR.goto,
            },
            "1":{
                behavior:ITEM_BEHAVIOR.none
            }
        }
    },
    "i198":{
        name: "云朵移动",
        state:{
            "0":{
                visible: true,     //初始的显示状态
                behavior: ITEM_BEHAVIOR.none,  //初始行为
            }
        }
    },
    "i199":{
        name: "场景光晕",
        state:{
            "0":{
                visible: true,     //初始的显示状态
                behavior: ITEM_BEHAVIOR.none,  //初始行为
            }
        }
    },

    //s2抽屉
    "i201":{
        name:"娃娃",
        state:{
            "0":{
                visible:true,
                behavior:ITEM_BEHAVIOR.action,
            },
            "1":{
                visible:false   //燃烧的蜡烛消失
            }
        }
    },
    "i211":{
        name:"拨开的娃娃",   //钥匙是可收集的全局物品 开始时不可见
        state:{
            "0":{
                visible:false,
            },
            "1":{
                visible:true, //熄灭的蜡烛变成可见
                behavior:ITEM_BEHAVIOR.none
            }
        }
    },
    "i202":{
        name:"小狗",
        state:{
            "0":{
                visible:true,
                behavior:ITEM_BEHAVIOR.action,
            },
            "1":{
                visible:false   //燃烧的蜡烛消失
            }
        }
    },
    "i212":{
        name:"拨开的小狗",   //钥匙是可收集的全局物品 开始时不可见
        state:{
            "0":{
                visible:false
            },
            "1":{
                visible:true, //熄灭的蜡烛变成可见
                behavior:ITEM_BEHAVIOR.none
            }
        }
    },
    "i203":{
        name:"鼠标",
        state:{
            "0":{
                visible:true,
                behavior:ITEM_BEHAVIOR.action,
            },
            "1":{
                visible:false   //燃烧的蜡烛消失
            }
        }
    },
    "i213":{
        name:"拨开的鼠标",   //钥匙是可收集的全局物品 开始时不可见
        state:{
            "0":{
                visible:false,
            },
            "1":{
                visible:true, //熄灭的蜡烛变成可见
                behavior:ITEM_BEHAVIOR.none
            }
        }
    },
    "i204":{
        name:"钉书机",
        state:{
            "0":{
                visible:true,
                behavior:ITEM_BEHAVIOR.action,
            },
            "1":{
                visible:false   //燃烧的蜡烛消失
            }
        }
    },
    "i214":{
        name:"拨开的钉书机",
        state:{
            "0":{
                visible:false,
            },
            "1":{
                visible:true,
                behavior:ITEM_BEHAVIOR.none
            }
        }
    },
    "i205":{
        name:"本子",
        state:{
            "0":{
                visible:true,
                behavior:ITEM_BEHAVIOR.action
            },
            "1":{
                visible:false
            }
        }
    },
    "i215":{
        name:"拨开的本子",
        state:{
            "0":{
                visible:false
            },
            "1":{
                visible:true,
                behavior:ITEM_BEHAVIOR.none
            }
        }
    },
    "i206":{
        name:"纸",
        state:{
            "0":{
                visible:true,
                behavior:ITEM_BEHAVIOR.action
            },
            "1":{
                visible:false
            }
        }
    },
    "i216":{
        name:"拨开的纸",
        state:{
            "0":{
                visible:false
            },
            "1":{
                visible:true,
                behavior:ITEM_BEHAVIOR.none
            }
        }
    },
    "i207":{
        name:"纸2",
        state:{
            "0":{
                visible:true,
                behavior:ITEM_BEHAVIOR.action
            },
            "1":{
                visible:false
            }
        }
    },
    "i217":{
        name:"拨开的纸2",
        state:{
            "0":{
                visible:false
            },
            "1":{
                visible:true,
                behavior:ITEM_BEHAVIOR.none
            }
        }
    },
    "i208":{
        name:"手机",
        state:{
            "0":{
                visible:true,
                behavior:ITEM_BEHAVIOR.none
            },
            "1":{
                visible:true,
                behavior:ITEM_BEHAVIOR.action
            },
            "2":{
                visible:false
            }
        }
    },
    //s3窗口
    "i301":{
        name:"无人机",
        state:{
            "0":{
                visible:true,
                behavior:ITEM_BEHAVIOR.action,
            },
            "1":{
                visible:false,   //飞机消失
                behavior:ITEM_BEHAVIOR.none,
            }
        }
    },
   //s4木质拼图
    "i401":{
        name:"拼图1",
        state:{
            "0":{
                visible:true,
                wait:["g3"],
                hint:1,
                behavior:[ITEM_BEHAVIOR.wait,ITEM_BEHAVIOR.hint]
            },
            "1":{
                visible:false
            }
        }
    },
    //s4木质拼图
    "i411":{
        name:"完成的拼图1",
        state:{
            "0":{
                visible:false,
            },
            "1":{
                visible:true,
                behavior:ITEM_BEHAVIOR.none
            }
        }
    },
    "i402":{
        name:"拼图2",
        state:{
            "0":{
                visible:true,
                wait:["g4"],
                hint:1,
                behavior:[ITEM_BEHAVIOR.wait,ITEM_BEHAVIOR.hint]
            },
            "1":{
                visible:false
            }
        }
    },
    //s4木质拼图
    "i412":{
        name:"完成的拼图2",
        state:{
            "0":{
                visible:false,
            },
            "1":{
                visible:true,
                behavior:ITEM_BEHAVIOR.none
            }
        }
    },

    //S9盒子场景
    "i901":{
        name:"盖子",
        state:{
            "0":{
                visible:true,
                behavior:ITEM_BEHAVIOR.action
            },
            "1":{
                visible:false,
                behavior:ITEM_BEHAVIOR.none,
            }
        }
    },
    "i911":{
        name:"打开的盖子",
        state:{
            "0":{
                visible:false,
                behavior:ITEM_BEHAVIOR.none,
            },
            "1":{
                visible:true
            }
        }
    },
    "i902":{
        name:"钥匙",
        state:{
            "0":{
                visible:false,
                behavior:ITEM_BEHAVIOR.none
            },
            "1":{
                visible:true,
                global:5,
                behavior:ITEM_BEHAVIOR.global,
            },
            "2":{
                visible:false,
                behavior:ITEM_BEHAVIOR.none
            }
        }
    },
    //小桌子
    "i1001":{
        name:"纸团",
        state:{
            "0":{
                visible:true,
                global:6,
                behavior:ITEM_BEHAVIOR.global,
            },
            "1":{
                visible:false,
                behavior:ITEM_BEHAVIOR.none
            }
        }
    },
    "i1002":{
        name:"电话",
        state:{
            "0":{
                visible:true,
                hint:4,
                behavior:ITEM_BEHAVIOR.hint,
            }
        }
    },

    "i1101":{
        name:"没解锁的电脑",
        state:{
            "0":{
                visible:true,
                actionIndex:1,
                behavior:ITEM_BEHAVIOR.action
            },
            "1":{
                hint:3,
                behavior:ITEM_BEHAVIOR.hint,
            },
            "2":{
                hint:15,
                actionIndex:2,
                wait:["g7"],
                behavior:[ITEM_BEHAVIOR.wait,ITEM_BEHAVIOR.hint]
            },
            "3":{
                actionIndex:3,
                behavior:ITEM_BEHAVIOR.action
            },
            "4":{
                actionIndex:4,
                behavior:ITEM_BEHAVIOR.none
            }
        }
    },
    "i1301":{
        name:"柜子1",
        state:{
            "0":{
                visible:true,
                actionIndex:1,
                behavior:ITEM_BEHAVIOR.action
            }
        }
    },
    "i1302":{
        name:"柜子2",
        state:{
            "0":{
                visible:true,
                actionIndex:1,
                behavior:ITEM_BEHAVIOR.action
            }
        }
    },
    "i1303":{
        name:"柜子3",
        state:{
            "0":{
                visible:true,
                actionIndex:1,
                behavior:ITEM_BEHAVIOR.action
            }
        }
    },
    "i1304":{
        name:"柜子4",
        state:{
            "0":{
                visible:true,
                actionIndex:1,
                behavior:ITEM_BEHAVIOR.action
            }
        }
    },
    "i1305":{
        name:"柜子5",
        state:{
            "0":{
                visible:true,
                actionIndex:1,
                behavior:ITEM_BEHAVIOR.action
            }
        }
    },
    "i1306":{
        name:"柜子6",
        state:{
            "0":{
                visible:true,
                actionIndex:1,
                behavior:ITEM_BEHAVIOR.action
            }
        }
    },
    "i1307":{
        name:"柜子7",
        state:{
            "0":{
                visible:true,
                actionIndex:1,
                behavior:ITEM_BEHAVIOR.action
            }
        }
    },
    "i1801":{
        name:"操作台",
        state:{
            "0":{
                visible: true,     //初始的显示状态
                goto:16,
                behavior: ITEM_BEHAVIOR.goto,  //初始行为
            }
        }
    },
    "i1898":{
        name:"屏幕",
        state:{
            "0":{
                visible: true,     //初始的显示状态
                behavior: ITEM_BEHAVIOR.none,  //初始行为
            }
        }
    },
    "i1899":{
        name:"线光",
        state:{
            "0":{
                visible: true,     //初始的显示状态
                behavior: ITEM_BEHAVIOR.none,  //初始行为
            }
        }
    }

};


//记录在服务端或者本地的状态
ITEM_STATE = {
    "1":{
        visible:true,
        behavior:ITEM_BEHAVIOR.goto
    }
};