/**
 * Created by Fizzo on 16/5/11.
 */

var alertHelper = {}

alertHelper.showAlert = function(title, message, buttonLabels, listener,type){
    if (!buttonLabels) {
        buttonLabels = []
    }
    if(!listener) {
        listener = function(){}
    }
    var alert = new alertLayer(title, message, buttonLabels,listener,type)
    extraFunc.addFullScreen("alert")
    cc.director.getRunningScene().addChild(alert,10086)
    alert.setGlobalZOrder(1)
    alert.display()
    alert._isExist = true
}

var alertLayer = cc.Layer.extend({
    _pop:null,
    _time:0,
    _isExist:false,
    ctor:function(title, message, buttonLabels, listener,type){
        this._super();
        this.init(title, message, buttonLabels, listener,type)
        return true;
    },
//    onEnter:function () {
//        console.log("o hai you")
//    },
    init:function(title, message, buttonLabels,listener,type){
        self = this;
        if (type && type == gc.ALERT_TYPE_NEW) {
            self._pop = extraFunc.createSprite("tishikuangxinziyuan.png", "AlertResource.plist")

        }else {
            self._pop = extraFunc.createSprite("zhujiemian_tishitanchukuang.png", "AlertResource.plist")
        }
        self._pop.setCascadeOpacityEnabled(true)
        self._pop.setCascadeColorEnabled(true)
        self._pop.setAnchorPoint(.5,.5)
        self._pop.setPosition(vSize.width/2,vSize.height/2)
        self.addChild(self._pop,1)

        //--添加标题
        var nameText =new cc.LabelTTF(title,"jsonBaseUI/fonts/customFont.ttf",22)
        nameText.setPosition(self._pop.width/2,self._pop.height-20)
        nameText.setColor(cc.color(0,0,0))
        //--    self._pop:addChild(nameText,1)
        nameText.setGlobalZOrder(1)
        //--添加内容
        var contentText = new cc.LabelTTF(message,"jsonBaseUI/fonts/customFont.ttf",26,{},cc.TEXT_ALIGNMENT_CENTER,cc.TEXT_ALIGNMENT_CENTER)
        contentText.setPosition(self._pop.width/2,self._pop.height/2 + 20)
        contentText.setColor(cc.color(0,0,0))
        contentText.setContentSize(350,200)
        self._pop.addChild(contentText,1)
        contentText.setGlobalZOrder(1)
                                
        self._parclose = extraFunc.getParclose(this,cc.color(0,0,0),100,false)
                                 
        //--添加按钮
        for(var idx in buttonLabels) {
            var button = new ccui.Button()
            button.setTag(Number(idx))
            button.setName("button" + idx)
            //var btn = buttonLabels[i - 1]
            
            //--根据参数选择按钮皮肤
            var skin = null
            switch (buttonLabels[idx]) {
                case gc.BTN_LOGIN_OK:
                    if (buttonLabels.length == 1) {
                        //-- 一个按钮时用大的资源
                        skin = "zhujiemian_gengxinshibaiquedinganniu.png"
                    } else {
                        skin = "zhujiemian_gengxinquedinganniu.png"
                    }
                    break;
                case gc.BTN_ALERT_OK:
                    skin = "zhujiemian_gengxinquedinganniu.png"
                    break;
                case gc.BTN_NO:
                    skin = "zhujiemian_gengxinzanbuanniu.png"
                    break;
                case gc.BTN_CONCEL:
                    skin = "zhujiemian_buttonCacle.png"
                    break;
                case gc.BTN_RETURN:
                    skin = "zhujiemian_buttonCacle.png"
                    break;
                case gc.BTN_REPEAT:
                    skin = "zhujiemian_chongshianniu.png"
                    break;
                default :
                    skin = "zhujiemian_gengxinquedinganniu.png"
                    break;
            }
            console.log(skin)
            button.loadTextures(skin,skin,skin,ccui.Widget.PLIST_TEXTURE)
            function onClick(sender) {

                extraFunc.removeFullScreen("alert")
                listener(sender.getTag()) //--把序号传给回调方法
                //--关闭弹窗
                self.removeFromParent()
                this._isExist = false
            }
            extraFunc.setButtonFun(button, null, null, onClick)
            button.setTouchEnabled(true)
            self._pop.addChild(button, 1)
        }
        if(buttonLabels.length == 0) {
            //--定时关闭
            function onClose() {

                extraFunc.removeFullScreen("alert")
                cc.director.getScheduler().unscheduleScriptEntry(self._timer)
                self._timer = null
                self.removeFromParent()
                this._isExist = false
            }
            self._timer = cc.director.getScheduler().schedule(onClose, 2, false)
        }else if(buttonLabels.length == 1) {
                                 
            self._pop.getChildByName("button0").setPosition(self._pop.width / 2, self._pop.height / 2 - 80)
        }else if(buttonLabels.length == 2) {
            self._pop.getChildByName("button0").setPosition(self._pop.width / 2 - 85, self._pop.height / 2 - 80)
            self._pop.getChildByName("button1").setPosition(self._pop.width / 2 + 85, self._pop.height / 2 - 80)
        }
    },
    //--做弹出效果
    display:function() {
        this._pop.setScale(0)
        var bigger = new cc.ScaleTo(.4, 1)
        var ease = new cc.EaseBackOut(bigger)
        function addEvent() {
            //TODO
        }
        this._pop.runAction(new cc.Sequence(new cc.DelayTime(.1), ease,new cc.CallFunc(addEvent)))
    }
})