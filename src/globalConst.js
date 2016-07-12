/**
 * Created by Fizzo on 16/5/17.
 */

var gc = {} //namespace
//---提示框的按钮
gc.BTN_ALERT_OK = "确定(提示)"
gc.BTN_LOGIN_OK = "确定(登陆)"
gc.BTN_NO = "暂不"
gc.BTN_CONCEL = "取消"
gc.BTN_RETURN = "重新登录"
gc.BTN_REPEAT = "重试"

//----不同类型的提示框底
gc.ALERT_TYPE_OLD = 1
gc.ALERT_TYPE_NEW = 2
gc.ALERT_TYPE_REEL = 3 //--卷轴

gc.TIMER_KEY_LODERBAR = 10001 //登陆界面的进度条的定时器
gc.TIMER_KEY_logoLight = 10002 //登陆界面的发光效果的定时器
gc.TIMER_KEY_GAMESCENE7_loadingTimer = "10003" //放大镜找线索的定时器ID