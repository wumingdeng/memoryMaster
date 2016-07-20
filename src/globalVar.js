/**
 * Created by Fizzo on 16/4/29.
 */
var TRACE_LEVEL = 0;
var vsize = cc.director.getVisibleSize();
vSize = cc.director.getVisibleSize()
vSizeOrg = cc.director.getVisibleOrigin()
if (cc.sys.isNative){
    frameSize = cc.director.getOpenGLView().getFrameSize()
}

var k={
    errorCode:{},
    successCode:{}
}
k.errorCode.CREATE_FILE = 0
k.errorCode.NETWORK = 1
k.errorCode.NO_NEW_VERSION = 2
k.errorCode.UNCOMPRESS = 3
k.errorCode.NETWORK_CANNOT_INITCURL = 4
k.errorCode.NETWORK_NOVERSION_URL = 5
k.errorCode.NETWORK_PACKGE_URL_WRONG = 6
k.errorCode.NEED_UPDATE_ENGINE = 7
k.errorCode.WRONG_SHA1 = 8
k.successCode.CHECK_UPDATE = 0
k.successCode.CHECK_UPDATE_SIZE = 1
k.successCode.DOWNLOAD_OK = 2
k.successCode.UNZIP_OK = 3
k.successCode.UPDATE_OK = 4

// 网络状态的编码
kCCNetworkStatusNotReachable = 0
kCCNetworkStatusReachableViaWWAN = 2
kCCNetworkStatusReachableViaWiFi = 1