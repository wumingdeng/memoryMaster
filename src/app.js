
var IamNotkey = "8567b3775db070c8"
var meToo = "hehehe"

var userName = "VbR0mYLybtyv0WMC"
var password = "sB3NH5ItSzCksev9"

var HelloWorldLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        //audioHelper.openMusic()
        //cc.audioEngine.playMusic("res/audio/music/gameBGM.mp3",true);

//        audioHelper.init()
//        var stop = new ccui.Button(baseRes.HelloWorld_png,baseRes.HelloWorld_png,baseRes.HelloWorld_png,ccui.Widget.LOCAL_TEXTURE)
//        stop.addClickEventListener(function(){
//            audioHelper.closeMusic()
//        })
//        var volume = 1;
//        var resumePlay = new ccui.Button(baseRes.HelloWorld_png,baseRes.HelloWorld_png,baseRes.HelloWorld_png,ccui.Widget.LOCAL_TEXTURE)
//        resumePlay.addClickEventListener(function(){
//            volume = volume - 0.1
//            audioHelper.setMusicVolume(volume)
//        })
//        stop.x = vSize.width/2
//        stop.y = vSize.height/2
//        resumePlay.x = vSize.width/2 + 200
//        resumePlay.y = vSize.height/2 + 200
//        this.addChild(stop)
//        this.addChild(resumePlay)
//        tskTrcHlp.task_trace = [
//            [1,1001,10,0,tskTrcHlp.TST_ACCEPT_NOTFIN]
//        ]
//        var extra = {}
//        extra.behavior = 1
//        extra.tid = 1001
//        tskTrcHlp.onTimeUpdateTaskTrace(extra,1,10)
//        new loadingProgressScene(1,null)
//        cc.spriteFrameCache.addSpriteFrames(baseRes.AlertResource_plist,baseRes.AlertResource_png);
//        function onDo(index){
//            if(index == 1){
//
//            }else if(index == 2){
//
//            }
//        }
//        alertHelper.showAlert("hua","dddd",[gc.BTN_ALERT_OK,gc.BTN_CONCEL],onDo,1)

        //["1","3","4"].map(parseInt)


        //var mainscene = ccs.load(res.MainScene_json);
        //this.addChild(mainscene.node);
        //function success(data){
        //    document.write(data.res)
        //}
        //Utils.get("http://192.168.18.165:8080/api/getPlayCount",null,success);
        var sprite = new cc.Sprite(res.gameScene7_png)
        sprite.x = 100
        sprite.y = 200
        ActionHelper.twinkleAction(sprite,1)
        this.addChild(sprite)
        return true;
    },
    pageViewEvent: function(pageView, type){
        switch (type){
            case ccui.PageView.EVENT_TURNING:
                cc.log(" pageView.getCurPageIndex === " + pageView.getCurPageIndex());
                break;
            default:
                cc.log(" pageView.Event.type === "+type);
                break;
        }
    },
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

