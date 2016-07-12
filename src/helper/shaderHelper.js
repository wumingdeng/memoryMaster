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
shaderHelper.createShaderFullColorEffect = function (node,color) {
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
            shader.setUniformLocationWith3f(shader.getUniformLocationForName("fullColor"), color);
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
