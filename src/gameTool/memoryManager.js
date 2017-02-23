/**
 * Created by chenzhaowen on 17-2-13.
 */

memoryManager = {
    _inMemoryModel:false,   //是否进入记忆模式
    _hideItem:[],
    _showItem:[],
    _isOpen:false,
    init:function() {
        this._isOpen = cc.sys.localStorage.getItem("openMemory");
    },

    //开启记忆模式功能
    openMemory:function() {
        this._isOpen = true;
        cc.sys.localStorage.setItem("openMemory","true");
    },

    isInMemory:function() {
        return this._inMemoryModel;
    },

    initItem:function(sid) {
        //把记忆模式才显示的物品隐藏
        var scene = sceneManager.scene._ui;
        var sid = sceneManager.scene._id;
        var config = MEMORY_CONFIG['s' + sid];
        if (config) {
            //显示掉配置的物品
            for (var i = 0; i < config.show.length; ++i) {
                var item = cfun.seekWidgetByTag(scene,config.show[i]);
                if (item) {
                    item.visible = false;
                    if (item._className == "Node") {
                        //如果是节点 必须把动画帧存起来
                        var jsonName = sceneManager.scene._path + "/" + item.getName() + ".json";
                        var itemAction = ccs.load(jsonName, "res/").action
                        item.runAction(itemAction);
                        itemAction.gotoFrameAndPlay(0,true);
                    }
                }
            }
        }

    },
    memory:function(force) {
        if (!this._isOpen && !force) {
            return;
        }
        if (sceneManager.scene._info.type != SCENE_Type.full) {
            return;
        }
        if (!this._inMemoryModel) {
            this._inMemoryModel = true;
            this.enterMemory();
            GAME_BAR.tipMemory()
            sceneManager.scene.setSceneTouch(false);
            GAME_BAR.hideGameBar(true);
        } else {
            this._inMemoryModel = false;
            //推出记忆模式
            this.exitMemory()
            GAME_BAR.stopTipMemory()
            sceneManager.scene.setSceneTouch(true);
        }
    },

    //进入记忆模式
    enterMemory:function() {
        var scene = sceneManager.scene._ui;
        var sid = sceneManager.scene._id;

        var move = cc.moveTo(0.5,cc.p(10,0));
        scene.runAction(cc.sequence(move,cc.callFunc(onShowMemory.bind(this))));

        function onShowMemory() {
            var config = MEMORY_CONFIG['s' + sid];
            if (config) {
                //隐藏掉配置的物品
                for (var i = 0; i < config.hide.length; ++i) {
                    var item = cfun.seekWidgetByTag(scene,config.hide[i]);
                    if (item && item.isVisible()) {
                        item.visible = false;
                        this._hideItem.push(config.hide[i]);
                    }
                }
                //显示配置的物品
                for (var i = 0; i < config.show.length; ++i) {
                    var item = cfun.seekWidgetByTag(scene,config.show[i]);
                    if (item && !item.isVisible()) {
                        item.visible = true;
                        item.setLocalZOrder(151);
                        this._showItem.push(config.show[i]);
                    }
                }

            }

            var count = 0;
            function visitScene(node) {
                var children = node.children;
                for (var i = 0; i < children.length; ++i) {
                    var child = children[i]
                    if (child.visible == true) {
                        if (child._className == "Sprite") {
                            child.visit();
                            count++;
                        }
                        if (child.children.length > 0) {
                            visitScene(child);
                        }
                    }
                }
            }

            var bg = scene.getChildByName("bg");
            var target = new cc.RenderTexture(vsize.width, vsize.height);
            target.anchorX = 0;
            target.anchorY = 0;
            target.x = -scene.x + vsize.width / 2;
            target.y = bg.height / 2;
            target.setName("memoryPic");
            target.begin();
            visitScene(scene);
            target.end();
            var sprite = new cc.Sprite(target.getSprite().texture);
            scene.addChild(target, 150);
            trace(count + "..........")
            shaderHelper.setColorHSL([target.sprite],0,0,0);
            target.scheduleUpdate();
            var sv = 0;
            target.update = function(dt) {
                var shader = target.sprite.shaderProgram;
                sv -= 0.003;
                shader.use();
                if(cc.sys.isNative) {
                    var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(shader);
                    glProgram_state.setUniformFloat("u_dS", sv);
                } else {
                    shader.setUniformLocationWith1f(target.sprite.$Sloc, sv);
                }
                shader.updateUniforms();
                if (sv <= -0.5) {
                    target.unscheduleUpdate();
                }
            }



            //添加动画效果
            var momery = ccs.load(res.memory_action_json,"res/");
            var mNode = momery.node;
            mNode.setName('memoryAction');
            var mAction = momery.action;
            mNode.runAction(mAction);

            mAction.gotoFrameAndPlay(0,false);
            mNode.setPosition(target.getPosition());

            function onEvent(frame) {
                var event = frame.getEvent();
                if (event == "show") {
                    mAction.gotoFrameAndPlay(41,true);
                }
            }
            mAction.setFrameEventCallFunc(onEvent);
            //mNode.x = -scene.x;
            //mNode.y = 0;
            scene.addChild(mNode, 151);
        }
    },

    //退出记忆模式
    exitMemory:function() {

        var scene = sceneManager.scene._ui;
        var sid = sceneManager.scene._id;
        //还原隐藏掉的物品
        for (var i = 0; i < this._hideItem.length; ++i) {
            var item = cfun.seekWidgetByTag(scene,this._hideItem[i]);
            if (item) {
                item.visible = true;
            }
        }
        //还原显示的物品
        for (var i = 0; i < this._showItem.length; ++i) {
            var item = cfun.seekWidgetByTag(scene,this._showItem[i]);
            if (item ) {
                item.visible = false;
            }
        }
        this._showItem = [];
        this._hideItem = [];

        var memory = scene.getChildByName("memoryPic");
        if (memory) {
            memory.removeFromParent();
        }
        var action = scene.getChildByName("memoryAction");
        if (action) {
            action.removeFromParent();
        }
    }



}