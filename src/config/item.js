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
                visible: true,     //初始的显示状态
                behavior: ITEM_BEHAVIOR.goto,  //初始行为
                goto:2
            },
            "1":{
                visible:false   //杜鹃动画播完就可以隐藏了
            }
        }
    },

    "i102": {
        name: "窗帘",
        state:{
            "0":{
                visible: false     //初始的显示状态
            },
            "1":{
                talk:1,
                action:true,
                visible:true,   //右侧杜鹃出现
                behavior: [ITEM_BEHAVIOR.talk,ITEM_BEHAVIOR.action],  //初始行为 点击触发多个行为
            },
            "2":{
                visible:false   //右侧杜鹃消失
            },
            "3":{    //右侧的杜鹃又有对话了
                talk:4,
                visible:true,
                wait:["g1"],
                behavior:[ITEM_BEHAVIOR.talk,ITEM_BEHAVIOR.wait]    //杜鹃这时有两个行为 点击对话 和 等着组合纸条
            },
            "4":{
                visible:false,
                behavior:ITEM_BEHAVIOR.none
            }
        }
    },
    "i103": {
        name: "窗帘",
        state:{
            "0":{
                visible: true,     //初始的显示状态
                behavior:ITEM_BEHAVIOR.action   //蜡烛变成点击可熄灭
            },
            "1":{
                visible:false
            }
        }
    },
    "i104":{
        name:"拉开的窗帘",
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
                global:1,   //全局物品1
                visible:true,
                behavior:ITEM_BEHAVIOR.global
            },
            "2":{
                visible:false
            }
        }
    },
    //s3掖庭
    "i301":{
        name:"纸团",
        state:{
            "0":{
                goto:4,     //进入拼图玩法
                visible:true,
                behavior:ITEM_BEHAVIOR.goto,
            },
            "1":{
                visible:false,   //纸条消失
                behavior:ITEM_BEHAVIOR.none,
            }
        }
    },
    "i302":{
        name:"佛像",
        state:{
            "0":{
                action:true,    //有一个消失的动画
                hint:null,      //等待被其他物品组合
                wait:["g2"],         //配置等待的物品
                behavior:ITEM_BEHAVIOR.wait,     //佛像刚开始没有交互
            },
            "1":{
                visible:false   //完成组合后佛像消失
            }
        }
    },
    "i501":{
        name:"关闭的门",
        state:{
            "0":{
                hint:5,
                wait:["g3"],    //需要一把钥匙
                action:true,    //门有一个打开动画
                visible:true,
                behavior:[ITEM_BEHAVIOR.hint,ITEM_BEHAVIOR.wait],
            },
            "1":{
                visible:false   //关闭的门组合后播放打开动画 下回就不显示了
            }
        }
    },
    "i502":{
        state:{
            name:"打开的门",
            "0":{
                goto:6, //到下一个场景
                visible:false,
                behavior:ITEM_BEHAVIOR.none,
            },
            "1":{
                visible:true    //动画播放完后显示打开的门
            }
        }
    },
};


//记录在服务端或者本地的状态
ITEM_STATE = {
    "1":{
        visible:true,
        behavior:ITEM_BEHAVIOR.goto
    }
};