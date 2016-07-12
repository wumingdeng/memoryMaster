var SysMenu = cc.Layer.extend({
    ctor:function () {
        this._super();
        this.init();
    },
    init:function () {
        //cc.spriteFrameCache.addSpriteFrames(res.textureTransparentPack_plist);

        winSize = cc.director.getWinSize();

        cc.log("打开游戏" + document.fonts);
        var background = new cc.Sprite(res.menu_bg);
        background.attr({
            anchorX: 0,
            anchorY: 0,
            x: (winSize.width - background.width) / 2,
            y: 0
        });
        this.addChild(background, 0);

        var singalHeight = MW.menuHeight;
        var singalWidth = MW.menuWidth;
        var newGameNormal = new cc.Sprite(res.menu_png, cc.rect(0, 0, singalWidth, singalHeight));
        var newGameSelected = new cc.Sprite(res.menu_png, cc.rect(0, singalHeight, singalWidth, singalHeight));
        var newGameDisabled = new cc.Sprite(res.menu_png, cc.rect(0, singalHeight * 2, singalWidth, singalHeight));
        //
        //var gameSettingsNormal = new cc.Sprite(res.menu_png, cc.rect(singalWidth, 0, singalWidth, singalHeight));
        //var gameSettingsSelected = new cc.Sprite(res.menu_png, cc.rect(singalWidth, singalHeight, singalWidth, singalHeight));
        //var gameSettingsDisabled = new cc.Sprite(res.menu_png, cc.rect(singalWidth, singalHeight * 2, singalWidth, singalHeight));
        //
        //var aboutNormal = new cc.Sprite(res.menu_png, cc.rect(singalWidth * 2, 0, singalWidth, singalHeight));
        //var aboutSelected = new cc.Sprite(res.menu_png, cc.rect(singalWidth * 2, singalHeight, singalWidth, singalHeight));
        //var aboutDisabled = new cc.Sprite(res.menu_png, cc.rect(singalWidth * 2, singalHeight * 2, singalWidth, singalHeight));
        //var flare = new cc.Sprite(res.flare_jpg);
        //this.addChild(flare, 15, 10);
        //flare.visible = false;
        var newGame = new cc.MenuItemSprite(newGameNormal, newGameSelected, newGameDisabled, function () {
            //this.onButtonEffect();
            this.onNewGame();
            //flareEffect(flare, this, this.onNewGame);
        }.bind(this));


        //var gameSettings = new cc.MenuItemSprite(gameSettingsNormal, gameSettingsSelected, gameSettingsDisabled, this.onSettings, this);
        //var about = new cc.MenuItemSprite(aboutNormal, aboutSelected, aboutDisabled, this.onAbout, this);
        //newGame.scale = MW.SCALE;
        //gameSettings.scale = MW.SCALE;
        //about.scale = MW.SCALE;
        //
        var menu = new cc.Menu(newGame);
        menu.alignItemsVerticallyWithPadding(15);
        this.addChild(menu, 1, 2);
        menu.x = winSize.width / 2;
        menu.y = winSize.height / 2 - 140;
        //
        //var label = new cc.LabelTTF("Power by Cocos2d-JS", "Arial", 21);
        //label.setColor(cc.color(MW.FONTCOLOR));
        //this.addChild(label, 1);
        //label.x = winSize.width  / 2;
        //label.y = 80;
        //
        //this.schedule(this.update, 0.1);
        //
        //this._ship = new cc.Sprite("#ship03.png");
        //this.addChild(this._ship, 0, 4);
        //this._ship.x = Math.random() * winSize.width;
        //this._ship.y = 0;
        //this._ship.runAction(cc.moveBy(2, cc.p(Math.random() * winSize.width, this._ship.y + winSize.height + 100)));
        //
        //if (MW.SOUND) {
        //    cc.audioEngine.setMusicVolume(0.7);
        //    cc.audioEngine.playMusic(res.mainMainMusic_mp3, true);
        //}
        this.testLayer();
        return true;
    },
    onEnter:function(){
        this._super();
        //this.scheduleOnce(this.getColor, 0.5 );
    },
    getColor:function(){
        var res = cfun.isSpriteTransparentInPoint(this.sp,cc.p(10,20));
        cc.log(res);
    },
    sp:null,
    testLayer:function(){
        function callback(res) {
            cc.log(res);
        }
        function errorcallback(res){
            cc.log(res);
        }
        var url = serverPath + "/api/login";
        var data = {};
        data.un = "wen007";
        data.pwd = "111111";
        data.zid = 1;
        data.m5 = 123456;
        var pData = {"un":"wen007"};
        var jData = "un=wen007&pwd=111111";
        sendRequest(url, jData, true, callback, errorcallback);


        var left = new cc.LabelTTF("alignment left", "customFont", 32, cc.size(winSize.width, 50));
        //left.x = 500;
        left.y = 400;
        this.addChild(left)
        //if ( 'opengl' in cc.sys.capabilities) {
        //    var size = 4 * sp.width * sp.height;
        //    var array = new Uint8Array(size);
        //    gl.readPixels(500, 400, sp.width, sp.height, gl.RGBA, gl.UNSIGNED_BYTE, array);
        //    return array;
        //} else {
        //    // implement a canvas-html5 readpixels
        //    cc.log(2);
        //    return cc._renderContext.getImageData(x, winSize.height-y-h, w, h).data;
        //}
    },
    onNewGame:function (pSender) {
        //load resources
        MW.isStoreImageData = true;
        var sceneId = 1;
        var res = g_searchGame[0].concat(g_searchGame[sceneId]);  //通用资源加没个场景自己的资源
        cc.LoaderScene.preload(res, function () {
            cc.audioEngine.stopMusic();
            cc.audioEngine.stopAllEffects();
            var scene = new cc.Scene();
            scene.addChild(new searchScene(1,1,1001,2,true));
	        cc.director.runScene(new cc.TransitionFade(1.2, scene));
        }, this);
    },

    update:function () {
        if (this._ship.y > 750) {
            this._ship.x = Math.random() * winSize.width;
	        this._ship.y = 10;
            this._ship.runAction(cc.moveBy(
                parseInt(5 * Math.random(), 10),
                cc.p(Math.random() * winSize.width, this._ship.y + 750)
            ));
        }
    },
    onButtonEffect:function(){
        if (MW.SOUND) {
            var s = cc.audioEngine.playEffect(res.buttonEffet_mp3);
        }
    }
});

SysMenu.scene = function () {
    var scene = new cc.Scene();
    var layer = new SysMenu();
    scene.addChild(layer);
    return scene;
};
