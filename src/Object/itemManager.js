/**
 * Created by chenzhaowen on 16-7-1.
 */

var ITEMS = {};     //存放物品的子类


var itemManager = {};

itemManager.itemsArr = [];     //当前创建的物品


//创建物品
itemManager.createItem = function(id,ui,action){
    var item;
    if (ITEMS[id]){
        item = new ITEMS[id](id,ui,action);  //如果有对物品做特殊处理 使用子类
    } else {
        item = new itemBase(id,ui,action);
    }
    this.itemsArr[id] = item;   //把创建好的物品存下来
    return item;
};


//根据id 取物品的状态信息
itemManager.getItemState = function(id){
    //先找有没有存物品状态 如果没有存 就用默认配置
    var info = cc.sys.localStorage.getItem("i" + id);
    //字符串要转成对象
    var newInfo = {};   //新对象 不改变配置
    if (!info) {
        info = itemManager.getItemInfoById(id);
        cc.extend(newInfo, info);
        var nowState = newInfo.nowState || 0;
        newInfo.nowState = nowState;    //补上现在状态的字段
        cc.extend(newInfo, newInfo.state[nowState]);
        delete newInfo.state;
    } else {
        info = JSON.parse(info);
        cc.extend(newInfo,info);
    }
    return newInfo;
};

itemManager.setItemState = function(id,info){
    //看下物品的显示状态有没改变
    if(this.itemsArr[id] && ("visible" in info)){
        this.itemsArr[id]._source.visible = info.visible;

        if (info.visible && this.itemsArr[id]._action){
            //如果是从隐藏到出现 就把物品变成没播放过动画的状态
            //让有默认动画的物品开始播放默认动画
            //if (this.itemsArr[id]._action.getAnimationInfo("base")) {
            //    this.itemsArr[id]._action.play("base",true);
            //} else {
            //    this.itemsArr[id]._action.gotoFrameAndPause(0);
            //}
            //设置到相应的帧数
            var item = this.itemsArr[id]
            var nowIndex = item._info.actionIndex || 1;
            if (item._action) {
                if (item._action.isAnimationInfoExists("action" + nowIndex)) {
                    var action = item._action.getAnimationInfo("action" + nowIndex);
                    var frame = action.startIndex;
                    item._action.gotoFrameAndPause(frame);
                }
            }
            //让有默认动画的物品开始播放默认动画
            if (item._action.isAnimationInfoExists("base") && nowIndex == 1) {
                item._haveBaseAction = true;
                item._action.play("base",true);
            }
        }
    }

    //调用后会修改或新建一份保存在服务端的物品信息
    var oldState = itemManager.getItemState(id);
    for (var key in info) {
        oldState[key] = info[key];
    }
    //更新物品里面的信息
    if (this.itemsArr[id]) {
        this.itemsArr[id]._info = oldState;
    }
    oldState = JSON.stringify(oldState);
    //把改变后的状态写到本地或服务端
    cc.sys.localStorage.setItem("i" + id,oldState);
};

//获得物品配置
itemManager.getItemInfoById = function(id){
    return ITEM_CONFIG.data["i" + id];
};

itemManager.getItem = function(id) {
    return this.itemsArr[id];
};

itemManager.destroyItems = function(){

};