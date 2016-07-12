
var searchScene = cc.Layer.extend({
    __cname:"searchScene",
    _widget:null,
    _uiLayer:null,
    caseID:0,
    sceneID:0,
    gameType:0,
    taskID:1001,
    itemAllCount:7, // 一共要寻找的物品个数
    itemCurCount:6, // 物品的寻找物品个数
    allItemCount:0,
    top:null,
    _bottom:null,
    _itemLayer:null,
    _input:null,
    _isCountDown:false,
    prizeItemData:[],
    isGameEnd:false,
    itemListData:[],   //要找的物品
    _selectEnabled:true,   //是否可以选择物品
    _pauseEnabled:true,   //是否可暂停
    _inventory:null,    //左侧物品栏
    _level:null,
    ctor:function(sceneid,level,taskID,gameType,isCountDown){
        this._super();
        this.init(sceneid,level,taskID,gameType,isCountDown);
    },
    getItemStaticData:function(sceneid) {
        Iteminfo = ITEM_TAB[sceneid];
    },
    init:function (sceneid,level,taskID,gameType,isCountDown) {
        this.sceneID = sceneid;
        this.level = level;
        this.taskID = taskID;
        this.gameType = gameType;
        this._isCountDown = isCountDown;
        this.getItemStaticData(sceneid);
        this._uiLayer = new cc.Layer();
        this.addChild(this._uiLayer);
        this.itemListData = [];
        this.allItemCount = Iteminfo.data.length;


        cc.spriteFrameCache.addSpriteFrames(res.baseUI_plist);


        //物品层
        this._itemLayer = new searchItemLayer(this);
        this._uiLayer.addChild(this._itemLayer,0);

        while (this.itemListData.length < this.itemAllCount) {
            var index = Math.floor(Math.random() * this.allItemCount);
            ////-关键物证
            if (Iteminfo.data[index][Iteminfo.ISEVIDENCE] == 2) {

            } else if (Iteminfo.data[index][Iteminfo.ACTION_TYPE] != null && Iteminfo.data[index][Iteminfo.ACTION_TYPE] != 1) {
                //特殊物品不能出现在列表里

                //////- 奖励物品个数的规则
            } else if (Iteminfo.data[index][Iteminfo.ISPRIZE] == 1) {

            } else {
                if (!gfun.checkHasItemByTable(this.itemListData, Iteminfo.data[index][Iteminfo.ID], Iteminfo.ID)) {
                    if (this._itemLayer.itemPanel.getChildByTag(Iteminfo.data[index][Iteminfo.ID]))
                    {
                        cc.log("random num is == " + index);
                        this.itemListData.push(Iteminfo.data[index]);
                    }
                }
            }
        }



        //底层
        this._bottom = new searchBottomLayer(this);
        this._bottom.setAnchorPoint(0,0);
        this._bottom.setPositionX(vsize.width/2 - (this._bottom.width)/2);
        this._bottom.initItemListText();
        this._uiLayer.addChild(this._bottom,2);




        this.top = new gameTopLayer(this,120,false);
        this.top.setAnchorPoint(0,0);
        this.top.setPosition(cc.winSize.width/2- this.top.width/2,vsize.height-this.top.height);
        this._uiLayer.addChild(this.top,4);

        var _draw = null;
        function nightModule() {
            //require "gameview/searchNightMask"
            //var nightMash = searchNightMask:create(this._itemLayer)
            //this._uiLayer.addChild(nightMash,1)
        }

        if (this.gameType == GAMETYPE_FIND_SOMETHING_NORMAL) {
            textModule()
        } else if (this.gameType == GAMETYPE_FIND_SOMETHING_NIGHT) {
            nightModule();
        } else {
            //pictureModule()
        }

        MW.isTipAction = false;

        return true;
    },
    //暂停
    stopGame:function(bool) {
        this.top.onGameStop(bool);  //暂停顶层
        this._bottom.onGameStop(bool);   //暂停底层
    },
    quitFromGame:function (pSender) {
        var scene = new cc.Scene();
        scene.addChild(new SysMenu());
        cc.director.runScene(new cc.TransitionFade(1.2, scene));
    },
    replay:function(){
        //var scene = new cc.Scene();
        //scene.addChild(this.ctor());
        var scene = searchScene.scene(this.sceneID,this.level,this.taskID,this.gameType,this._isCountDown)
        cc.director.runScene(new cc.TransitionFade(1.2, scene));
    },
    finish:function(){
        //cc.director.getActionManager().pauseTarget(this.top);
        cc.director.getActionManager().pauseAllRunningActions();
        this.stopGame(true)
        var json = ccs.load(res.success_json,"res/");
        var node = json.node,action = json.action;
        node.runAction(action);
        action.gotoFrameAndPlay(0,false);

        node.x = (cc.winSize.width - node.width) / 2;
        node.y = (cc.winSize.height - node.height) / 2;
        this.addChild(node);
        var exitBtn = node.getChildByName("btnExit");
        var replayBtn = node.getChildByName("btnReplay");

        cfun.setButtonFun(exitBtn,null,null,this.quitFromGame,null,this);
        cfun.setButtonFun(replayBtn,null,null,this.replay,null,this);
    },
    onSoundControl:function(){
        MW.SOUND = !MW.SOUND;
        var audioEngine = cc.audioEngine;
        if(MW.SOUND){
            audioEngine.playMusic(res.mainMainMusic_mp3);
        }
        else{
            audioEngine.stopMusic();
            audioEngine.stopAllEffects();
        }
    },
    onModeControl:function(){
    },
    onExit:function(){
        this._super();
        console.log("exit")
        MW.isStoreImageData = false;
        MW.imageData = null;
    }
});


searchScene.scene = function (sceneid,level,taskID,gameType,isCountDown) {
    var scene = new cc.Scene();
    var layer = new searchScene(sceneid,level,taskID,gameType,isCountDown);
    scene.addChild(layer);
    return scene;
};