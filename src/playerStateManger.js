/**
 * Created by chenzhaowen on 16-6-23.
 * 管理玩家的状态
 */

var PLAYER_STATE = {
    _nowScene:null,
    _mainscene:null, //玩家所在的主场景 如果玩家进入嵌套场景 不改变这个值
    set scene(value){
        this._nowScene = value;
        cc.sys.localStorage.setItem("nowScene",value);
        trace1("设置SCENE",this._nowScene);
    },
    get scene(){
        if (!this._nowScene){
            this._nowScene = cc.sys.localStorage.getItem("nowScene") || 1;
            this._nowScene = Number(this._nowScene);
        }
        return this._nowScene;
    },

    set mainScene(value){
        this._mainscene = value;
        cc.sys.localStorage.setItem("mainScene",value);
        trace1("设置mainScene",this._mainscene);
    },

    get mainScene(){
         if (!this._mainscene){
             this._mainscene = cc.sys.localStorage.getItem("mainScene") || 1;
             this._mainscene = Number(this._mainscene);
         }
         return this._mainscene;
    },

    getItem:function(id){

    }


};



