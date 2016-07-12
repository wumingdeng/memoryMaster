/**
 * Created by Fizzo on 16/5/3.
 */
var g_writable_path = jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "/";
var self = null;
var assetManagerLayer = cc.Layer.extend({
    _loginUI: null,
    _ak: null,//热更新管理
    g_update_info: null,//最新的json结构
    g_usre_info: null,//本地的json结构
    info_text: null,
    _parent: null,
    _autoTime: 0, /*更新失败的次数*/
    onCallFun: null,//更新后的回调
    _connectTimer: 0,
    _tempDownDirName: "downTemp",
    _versionBeforeUpdate: null, //更新前的版本号
    _needDcvst: true, //--whether need display text with check version statue
    //_log: "",
    ctor: function () {
        this._super();
        this.checkUpdate();
        self = this;
        return true;
    },
    updateProgress: function () {
        if (this._needDcvst) {
            //this.parent
        }
    },
    checkUpdate: function () {
        var manifestPath = "res/Manifests/project.manifest"
        //cc.log("Storage path for this test : " + storagePath);
        this.info_text = new ccui.Text("")
        this.info_text.setFontSize(30)

        this.info_text.setPosition(vSize.width / 2, vSize.height / 2)
        this.addChild(this.info_text)

        if (jsb.fileUtils.isFileExist(g_writable_path + "ures.json")) {
            // if engine version is not same,we should update from appstore then change local res lres.json,then clear writable folder
            // if have ures.json,check whether engine version is same
            // we consider that lres.json's engine should be the latest
            // if not same,we clear writable folder and initial like first
            // if same,use ures.json as global update info
            var lres = JSON.parse(jsb.fileUtils.getStringFromFile("res/lres.json"))
            var ures = JSON.parse(jsb.fileUtils.getStringFromFile(g_writable_path + "ures.json"))
            //还要比对文件自带的版本和写入路径下记录的初始版本是否一致
            //不一致说明用户覆盖安装了
            //这时候把写入路径下的东西删除。然后按照自带版本进行更新
            var originalVer = cc.sys.localStorage.getItem("originalVersion")
            if (originalVer && originalVer != "") {
                if (originalVer != lres.game_version) {
                    jsb.fileUtils.removeDirectory(g_writable_path + "res/")
                    jsb.fileUtils.removeDirectory(g_writable_path + "src/")
                    jsb.fileUtils.removeFile(g_writable_path + "ures.json")

                    cc.fileUtils.writeStringToFile(jsb.fileUtils.getStringFromFile("res/lres.json"), g_writable_path + "ures.json")
                    ures = lres
                    //直接用lres做更新
                    //更新本地数据的初始版本号
                    cc.sys.localStorage.setItem("originalVersion", lres.game_version)
                }
            } else {
                cc.log("unbelievable~！没取到本地数据里的初始版本！")
            }
            if (lres.engine_version == ures.engine_version)
                this.g_usre_info = ures
            else
                this.initWritable()
        } else {
            this.initWritable()
        }
        cc.log("version local is :" + this.g_usre_info.game_version)
        this._versionBeforeUpdate = this.g_usre_info.game_version
        //--                 存下之前的版本
        //this._parent.versionText(this.g_usre_info.game_version)
        this._ak = cc.AssetsManagerK.create("", this.g_usre_info.updateUrl + "/version", g_writable_path,this.onError,this.onProgress,this.onSuccess)
        this._ak.retain()
        console.log(this.g_usre_info.updateUrl + "/version")
        // assetmanagerK's delegate implementor should have onerror,onprogress,onsuccess function
        this._ak.setConnectionTimeout(5)
        this._ak.checkUpdate()
        cc.log("get version .......")
        return true;
    },
    onProgress:function (percent){

    },
    initWritable:function() {
         var lresStr = jsb.fileUtils.getStringFromFile("res/lres.json")
         this.g_usre_info = JSON.parse(lresStr)
         cc.fileUtils.writeStringToFile(lresStr,g_writable_path+"ures.json")
         //--本地数据中存一份初始的版本号
         cc.sys.localStorage.setItem("originalVersion", this.g_usre_info.game_version)
    },
    onError: function (code) {
        switch (code) {
            case k.successCode.CREATE_FILE:
                cc.log("创建失败")
                break;
            case k.successCode.NETWORK:
                console.log("网络错误")
            case k.successCode.NO_NEW_VERSION:
                cc.log("没有版本")
                break;
            case k.successCode.UNCOMPRESS:
                cc.log("解压失败,错误的包")
                break;
            case k.successCode.NETWORK_CANNOT_INITCURL:
                cc.log("curl")
                break;
           case k.successCode.NETWORK_PACKGE_URL_WRONG:
                cc.log("url错")
                break;
           case k.successCode.NEED_UPDATE_ENGINE:
                cc.log("引擎版本错误")
                break;
           case k.successCode.NETWORK_NOVERSION_URL:
                cc.log("创建失败")
                break;
           case k.successCode.WRONG_SHA1:
                cc.log("sha错误")
                break;
            default:
                break;
        }
    }
    ,
    onSuccess: function (code) {
        switch (code) {
            case k.successCode.CHECK_UPDATE:
                cc.log("版本号ok")
                self.onGetVersionCode()
                break;
            case k.successCode.CHECK_UPDATE_SIZE:
                console.log(self._ak.getPackageSize())
                self._ak.startUpdate()
                break;
            case k.successCode.DOWNLOAD_OK:
                cc.log("下载ok")
                break;
            case k.successCode.UNZIP_OK:
                cc.log("解压ok")
                break;
            case k.successCode.UPDATE_OK:
                cc.log("更新ok")
                break;
            default:
                break;
        }
    }
    ,
    /**
     * 比对版本号
     * */
    compareGameVersion:function() {
        var version_code = this._ak.getVersionCode()
        var remote_game_code = version_code.split("_")[0]
        var local_game_code = this.g_usre_info.game_version
         // we just compare two version code directly,if not same begin to update
        var isNew = remote_game_code == local_game_code
        //this._parent.onCheckVersionSuccess(isNew)
        //检测版本完成
        this._needDcvst = false
        if (isNew)
            this.okEnterGame(!isNew)
        else{
            var remote_humanCode = remote_game_code.substring( 0, remote_game_code.lastIndexOf("."))
            var local_humanCode = local_game_code.substring( 0, local_game_code.lastIndexOf('.'))
            var remote_sha1 = remote_game_code.substring(remote_game_code.lastIndexOf('.') + 1,remote_game_code.length)
            var local_sha1 = local_game_code.substring(local_game_code.lastIndexOf('.') + 1,local_game_code.length)
            if (remote_humanCode == local_humanCode && remote_sha1 != local_sha1) {
                // same version number,but different sha1,maybe change by user,cause an error
                this.onError(k.errorCode.WRONG_SHA1)
            }else{
                var down_url = this.g_usre_info.updateUrl+"/"+local_game_code+"-to-"+remote_game_code+".zip"
                //console.log(down_url);
                this._ak.setPackageUrl(down_url)
                // todo optional get package size
                // todo information view
                // do update get zip
                this._ak.getUpdateFileSize()
            }
        }
    },
     onGetVersionCode:function() {
         var version_code = this._ak.getVersionCode()
         var remote_engine_code = version_code.split("_")[1]
         var local_engine_code = this.g_usre_info.engine_version
         if (remote_engine_code == local_engine_code) {
             this.compareGameVersion()
         }else {
             this.onError(k.errorCode.NEED_UPDATE_ENGINE)
         }
     },
    onExit: function () {
        this._ak.release()
        self = null
        this._super();
    }
    ,
    initWritable: function () {
        this.g_usre_info = JSON.parse(jsb.fileUtils.getStringFromFile("lres.json"))
        //cfun.writeFile(jsb.fileUtils.getStringFromFile("lres.json"), g_writable_path + "ures.json")
        //--本地数据中存一份初始的版本号
        cc.sys.localStorage.setItem("originalVersion", this.g_usre_info.game_version)
    }
    ,
    onLoadJsFiles: function () {
        cc.loader.loadJs(jsFiles, function () {
            cc.LoaderScene.preload(g_resources, function () {
                //cc.director.runScene(new assetManagerScene());
            }, this);

        });
    }
});

var assetManagerScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new assetManagerLayer();
        this.addChild(layer);
    }
});