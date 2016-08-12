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
        name: "左侧的杜鹃",
        state:{
            "0":{
                autoAction:true,
                visible: true,     //初始的显示状态
                behavior: ITEM_BEHAVIOR.autoAction,  //初始行为
            },
            "1":{
                visible:false   //杜鹃动画播完就可以隐藏了
            },
            "2":{
                visible:true,   //左侧的杜鹃出现
                talk:2,
                behavior:ITEM_BEHAVIOR.talk
            },
            "3":{
                visible:false   //隐藏左侧杜鹃
            }
        }
    },

    "i102": {
        name: "右侧的杜鹃",
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
        name: "燃烧的蜡烛",
        state:{
            "0":{
                hint: 1,           //对应的提示文本
                action:true,
                visible: true,     //初始的显示状态
                behavior: ITEM_BEHAVIOR.hint,  //初始行为
            },
            "1":{
                behavior:ITEM_BEHAVIOR.action   //蜡烛变成点击可熄灭
            },
            "2":{
                visible:false   //燃烧的蜡烛消失
            },
            "3":{    //蜡烛点亮并且无提示
                visible:true,
                behavior:ITEM_BEHAVIOR.none
            }
        }
    },
    "i104":{
        name:"熄灭的蜡烛",
        state:{
            "0":{
                visible:false,
            },
            "1":{
                visible:true, //熄灭的蜡烛变成可见
                wait:108,
                behavior:ITEM_BEHAVIOR.wait
            },
            "2":{
                visible:false   //隐藏蜡烛熄灭的图片
            }
        }
    },
    "i105":{
        name:"化妆盒",
        state:{
            "0":{
                hint:2,
                visible:true,
                behavior:ITEM_BEHAVIOR.hint,
            },
            "1":{
                goto:2,
                behavior:ITEM_BEHAVIOR.goto   //这时再点击化妆盒会打开桌面的小场景
            },
            "2":{
                behavior:ITEM_BEHAVIOR.none     //完成桌面场景的所有交互 这时场景自动关闭 点击寝宫的化妆盒也不在打开这个场景
            }
        }
    },
    "i106":{
        name:"窗户",
        state:{
            "0":{
                hint:3,
                visible:true,
                behavior:ITEM_BEHAVIOR.hint,
            },
            "1":{
                goto:3,     //窗户变成可以通往掖庭
                behavior: ITEM_BEHAVIOR.goto
            },
            "2":{
                goto:[3,5]      //拿到钥匙后从窗户可以通往花园~
            }
        }
    },
    "i107":{
        name:"眉笔",
        state:{
            "0":{
                global:2,   //全局物品2
                visible:true,
                behavior:ITEM_BEHAVIOR.global,
            },
            "1":{
                visible:false
            }
        }
    },
    "i108":{
        name:"火种",
        state:{
            "0":{
                move:104,   //组合熄灭的蜡烛
                visible:true,
                behavior:ITEM_BEHAVIOR.move,
            },
            "1":{
                visible:false
            }
        }
    },
    //s2桌面
    "i201":{
        name:"桌上的化妆盒",
        state:{
            "0":{
                hint:4,
                visible:true,
                behavior:ITEM_BEHAVIOR.hint,
            },
            "1":{
                action:true,    //化妆盒有个打开的帧动画
                behavior:ITEM_BEHAVIOR.action       //化妆盒变成可以打开
            },
            "2":{
                visible:false   //关闭的化妆盒消失
            },
        }
    },
    "i202":{
        name:"桌上的钥匙",   //钥匙是可收集的全局物品 开始时不可见
        state:{
            "0":{
                visible:false,
            },
            "1":{
                behavior:ITEM_BEHAVIOR.global,
                global:3,
                visible:true    //钥匙出现
            },
            "2":{
                visible:false
            }
        }
    },
    "i203":{
        name:"打开的化妆盒",
        state:{
            "0":{
                visible:false,
                behavior:ITEM_BEHAVIOR.none,     //这东西没有交互行为
            },
            "1":{
                visible:true    //出现打开的化妆盒
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