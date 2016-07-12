#ifdef GL_ES
precision mediump float;
#endif

varying vec4 v_fragmentColor;
varying vec2 v_texCoord;

uniform vec2 resolution;//模糊对象的实际分辨率
uniform float blurRadius;//半径
uniform float sampleNum;//间隔的段数

vec4 blur(vec2);

void main(void)
{
    vec4 col = blur(v_texCoord); //* v_fragmentColor.rgb;
    gl_FragColor = vec4(col) * v_fragmentColor;
}

vec4 blur(vec2 p)
{
    if (blurRadius > 0.0 && sampleNum > 1.0)
    {
        vec4 col = vec4(0);
        vec2 unit = 1.0 / resolution.xy;//单位坐标

        float r = blurRadius;
        float sampleStep = r / sampleNum;

        float count = 0.0;
        //遍历一个矩形，当前的坐标为中心点，遍历矩形中每个像素点的颜色
        for(float x = -r; x < r; x += sampleStep)
        {
            for(float y = -r; y < r; y += sampleStep)
            {
                float weight = (r - abs(x)) * (r - abs(y));//权重，p点的权重最高，向四周依次减少
                col += texture2D(CC_Texture0, p + vec2(x * unit.x, y * unit.y)) * weight;
                count += weight;
            }
        }
        //得到实际模糊颜色的值
        return col / count;
    }
    
    vec4 v_orColor = v_fragmentColor * texture2D(CC_Texture0, v_texCoord);
    gl_FragColor = vec4(255, 255, 0, v_orColor.a);
    
    return texture2D(CC_Texture0, p);
}
