/**
 * Created by Fizzo on 16/5/11.
 */
var audioHelper = {}

audioHelper.isPlayMusic = "true"
audioHelper.isPlaySound = "false"

/**
 * @param {string} musicPath 选择播放的音乐
 * 打开背景音乐*/
audioHelper.openMusic = function(musicPath){
    audioHelper.isPlayMusic = "true"
    cc.sys.localStorage.setItem("isPlayMusic",true)
    if(!cc.audioEngine.isMusicPlaying() && musicPath){
        cc.audioEngine.playMusic(musicPath,true)
    }
}

/**
 * @param {string} musicPath 选择播放的音乐
 * 打开背景音乐*/
audioHelper.playSound = function(musicPath){
    audioHelper.isPlayMusic = "true"
    cc.sys.localStorage.setItem("isPlayMusic",true)
    if(!cc.audioEngine.isMusicPlaying() && musicPath){
        cc.audioEngine.playMusic(musicPath,true)
    }
}

//---关闭背景音乐
audioHelper.closeMusic = function() {
    audioHelper.isPlayMusic = "false"
    cc.sys.localStorage.setItem("isPlayMusic",false)
    if (cc.audioEngine.isMusicPlaying){
        cc.audioEngine.stopMusic(true)
    }
}

/**
 * 设置背景音乐音量大小
 * @param {int} value
 * */
audioHelper.setMusicVolume = function(value){
    value = value<0 ? 0:value
    cc.audioEngine.setMusicVolume(value)
    cc.sys.localStorage.setItem("musicVolume",value)
}

/**
 * 打开音效*/
audioHelper.openSound = function(){
    audioHelper.isPlaySound = "true"
    cc.sys.localStorage.setItem("isPlaySound",true)
}
/**
 * 关闭音效*/
audioHelper.closeSound = function(){
    audioHelper.isPlaySound = "false"
    cc.sys.localStorage.setItem("isPlaySound",false)
    cc.audioEngine.stopAllEffects()
}

/**
 * 设置音效的音量*/
audioHelper.setSoundVolume = function(value){
    cc.audioEngine.setEffectsVolume(value)
    cc.sys.localStorage.setItem("soundVolume",value)
}

audioHelper.init = function(){
    var music = cc.sys.localStorage.getItem("isPlayMusic")
    if(!music){
        music = true
        cc.sys.localStorage.setItem("isPlayMusic",music)
    }
    audioHelper.isPlayMusic = music

    var sound = cc.sys.localStorage.getItem("isPlaySound")
    if(!sound){
        sound = true
        cc.sys.localStorage.setItem("isPlaySound",sound)
    }
    audioHelper.isPlaySound = sound

    var musicVolume = cc.sys.localStorage.getItem("musicVolume")
    if(!musicVolume){
        audioHelper.setMusicVolume(1)
    }
    cc.audioEngine.setMusicVolume(Number(musicVolume))

    var soundVolume = cc.sys.localStorage.getItem("soundVolume")
    if(!soundVolume){
        audioHelper.setSoundVolume(1)
    }
    cc.audioEngine.setEffectsVolume(Number(soundVolume))
}
