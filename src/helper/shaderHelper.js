/**
 * Created by Fizzo on 16/7/12.
 */
var shaderHelper = {} //nameSpace

shaderHelper.shaderBeforeCache = new Array() //存放添加的shader

/**
 * 曝光效果
 * @param {cc.Sprite}||{ccui.ImageView} source
 */
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

/**
 * 图片全色效果
 * @param {cc.Sprite}||{ccui.ImageView} source
 * @param {cc.vec3} color 颜色值*/
shaderHelper.createShaderFullColorEffect = function (source,color) {
    shaderHelper.shaderBeforeCache.push({n: source.getName(), gs: source.getShaderProgram()})
    var shader = new cc.GLProgram(res.shader_public, res.shader_fullColor);
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

/**
 *设置shader的模糊效果
 * @param {cc.Sprite}||{ccui.ImageView} source
 */
shaderHelper.createShaderBlurEffect_2 = function(source){
    shaderHelper.shaderBeforeCache.push({n: source.getName(), gs: source.getShaderProgram()})
    var shader = new cc.GLProgram(res.shader_public, res.shader_blur);
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
        }
        if (cc.sys.isNative) {
            var program = cc.GLProgramState.getOrCreateWithGLProgram(shader)
            source.setGLProgramState(program)
            shaderHelper.adjustShaderBlur(source,false,7,10)
        } else {
            source.shaderProgram = shader;
        }
    }
}

/**
//设置shader的模糊效果的具体参数
//不做单独使用
//要调节模糊度请先调用createShaderBlurEffect方法
// * @param {cc.Node} program
 * @param {Boolean} isOsmotic
 * @param {Number} blurRadius
 * @param {Number} sampleNum
 * @param {cc.p} resolution*/
shaderHelper.adjustShaderBlur = function(node,isOsmotic,blurRadius,sampleNum,resolution) {
    if (resolution) {
        node.getGLProgramState().setUniformVec2("resolution", resolution)
    } else{
        node.getGLProgramState().setUniformVec2("resolution", cc.p(node.width, node.height))
    }
    if (blurRadius) {
        node.getGLProgramState().setUniformFloat("blurRadius", blurRadius)
    }else {
        node.getGLProgramState().setUniformFloat("blurRadius", 8.0)
    }
    if (sampleNum) {
        node.getGLProgramState().setUniformFloat("sampleNum", sampleNum)
    }else {
        node.getGLProgramState().setUniformFloat("sampleNum", 8.0)
    }
    if (isOsmotic) {
        //--是否让子节点也模糊
        var children = node.getChildren()
        children.forEach(function(v){
            shaderHelper.adjustShaderBlur(v, isOsmotic, blurRadius, sampleNum, resolution)
        })
    }
}

/**
 * 设置对象的边做光晕效果
 * @param {cc.Sprite}||{ccui.ImageView} spt
 * @param {cc.math.vec3} color*/
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
    var bgTxtr = new cc.RenderTexture(filterNode.width,filterNode.height,cc.Texture2D.PIXEL_FORMAT_RGBA8888)
    console.log("xxxxxx")
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
    _maskSpt.setName("_maskSpt")
    return _maskSpt
}
/**
 * remove shader
 * @param {cc.Node} source*/
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