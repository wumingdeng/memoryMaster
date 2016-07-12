var vsize = cc.size(1136,640);

var ITEM_TAB = [];    //所有物品数据
var Iteminfo = null;    //使用中的物品数据

var MW = MW || {};

MW.isStoreImageData = true;
MW.imageData = null;

//需要保存透明度的图片资源
MW.needDataImage = [
    res.gameScene_1_png
];



MW.menuHeight = 36;
MW.menuWidth = 123;
MW.isTipAction = false;
GAMETYPE_FIND_SOMETHING = 1;  // 找物品
GAMETYPE_FIND_SOMETHING_NORMAL = 1;    //1、一般模式 2.黑夜模式，3.图片模式
GAMETYPE_FIND_SOMETHING_NIGHT = 2;
GAMETYPE_FIND_SOMETHING_PICTURE = 3;

//虚拟点击附近八个点
var multiple = 10;
var clickArea = [
    null,
    {x:0,y:0},
    {x:1*multiple,y:0},
    {x:1*multiple,y:1*multiple},
    {x:0,y:1*multiple},
    {x:-1*multiple,y:1*multiple},
    {x:-1*multiple,y:0},
    {x:-1*multiple,y:-1*multiple},
    {x:0,y:-1*multiple},
    {x:1*multiple,y:-1*multiple},
]

