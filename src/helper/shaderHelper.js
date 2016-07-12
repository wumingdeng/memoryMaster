/**
 * Created by Fizzo on 16/7/12.
 */
var shaderHelper = {} //nameSpace
shaderHelper.shaderBeforeCache = new Array() //存放添加的shader

shaderHelper.createShaderBirghtEffect = function(source)
{
    var rect = source.getTexture().getContentSizeInPixels()
    shaderHelper.shaderBeforeCache.push({n:source.getName(),gs:source.getShaderProgram()})
    var shader = new cc.GLProgram(res.shader_public, res.shader_celShading);
    if ('opengl' in cc.sys.capabilities) {
        if (cc.sys.isNative) {
            shader.link();
            shader.updateUniforms();
        }
        else {
            shader.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);
            shader.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);
            shader.addAttribute(cc.ATTRIBUTE_NAME_COLOR, cc.VERTEX_ATTRIB_COLOR);
            shader.link();
            shader.updateUniforms();
            shader.use();
            shader.setUniformLocationWith2f(shader.getUniformLocationForName("resolution"), rect.width, rect.height);
        }
        if (cc.sys.isNative) {
            var program = cc.GLProgramState.getOrCreateWithGLProgram(shader)
            program.setUniformVec2("resolution", cc.p(rect.width, rect.height))
            source.setGLProgramState(program)
        } else {
            source.shaderProgram = shader;
        }
    }
}

//------------------------------------
//@param node cc.Node 要设置的对象
//@param color cc.vec3 颜色值
shaderHelper.createShaderFullColorEffect = function (source,color) {
    shaderHelper.shaderBeforeCache.push({n: source.getName(), gs: source.getShaderProgram()})
    var shader = new cc.GLProgram(res.shader_public, res.shader_celShading);
    if ('opengl' in cc.sys.capabilities) {
        if (cc.sys.isNative) {
            shader.link();
            shader.updateUniforms();
        }
        else {
            shader.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);
            shader.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);
            shader.addAttribute(cc.ATTRIBUTE_NAME_COLOR, cc.VERTEX_ATTRIB_COLOR);
            shader.link();
            shader.updateUniforms();
            shader.use();
            shader.setUniformLocationWith3f(shader.getUniformLocationForName("fullColor"), 1,1,0);
        }
        if (cc.sys.isNative) {
            var program = cc.GLProgramState.getOrCreateWithGLProgram(shader)
            program.setUniformVec3("fullColor", color)
            source.setGLProgramState(program)
        } else {
            source.shaderProgram = shader;
        }
    }
}

shaderHelper.removeShaderEffect = function(source){
    if (source) {
        shaderHelper.shaderBeforeCache.forEach(function(ca){
            if(ca.n == source.getName()){
                if(cc.sys.isNative){
                    source.setShaderProgram(ca.gs)
                }else{
                    source.shaderProgram = ca.gs;
                }

            }
        })
    }
}
shaderHelper.createShaderBlurEffect_2 = function(source){

}
shaderHelper.adjustShaderBlur = function(){

}
shaderHelper.setSurroundingAreaLight = function(spt,color){
    var classType =  spt._className
    var sptclone = null
    var filterNode = null
    if (classType == "Sprite") {
        sptclone = new cc.Sprite(spt.getTexture())
        sptclone.setAnchorPoint(0, 0)
        filterNode = sptclone
    }else if (classType == "ImageView") {
        sptclone = spt.clone()
        filterNode = sptclone.getVirtualRenderer()
        filterNode.setAnchorPoint(0, 0)
    }
    shaderHelper.createShaderFullColorEffect(filterNode,color)
    var bgTxtr = new cc.RenderTexture(filterNode.width,filterNode.height,cc.Texture2D.PIXEL_FORMAT_BGRA8888)
    bgTxtr.begin()
    filterNode.visit()
    bgTxtr.end()
    var tx = bgTxtr.getSprite().getTexture()
    var _maskSpt  = new cc.Sprite(tx)
    var SCALE_X = 1.1
    var SCALE_Y = 1.1
    _maskSpt.setScaleY(SCALE_Y)
    _maskSpt.setPosition(spt.getPosition())
    _maskSpt.setRotation(spt.getRotation()+180)
    _maskSpt.setScaleX(-SCALE_X)
    shaderHelper.createShaderBlurEffect_2(_maskSpt)
    shaderHelper.adjustShaderBlur(_maskSpt,false,7,10)
    _maskSpt.setName("_maskSpt")
    return _maskSpt
}
