#ifdef GL_ES
precision mediump float;
#endif

varying vec4 v_fragmentColor;
varying vec2 v_texCoord;

// input value
uniform float fSampleDist;
uniform float fSampleStrength;

uniform vec2 resolution;
// copy by kael but not so useful
//uniform

vec4 blur(vec2);
vec4 blur2(vec2);
vec4 blur3(vec2);
vec4 blur4(vec2);
void main(void)
{
    gl_FragColor = blur2(v_texCoord) * v_fragmentColor;
}



vec4 lerp(float s,vec4 a, vec4 b){
    return a+s*(b-a);
}

float rand(vec2 co)
{
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

vec3 noise(vec2 uv)
{
    vec2 p = abs(sin(uv * 13.0 + uv.x * CC_Time[1] * sin(uv.y)));
    
    return vec3(sin (0.2 * CC_Time[1] + sin(p * 0.5) * CC_Time[1] / cos(50.0)) * 10.0,0.3+0.5 * abs(sin(CC_Time[1] * tan(5.0))));
}

vec4 blur2(vec2 p){
    vec2 dir = noise(p).xy;
    dir = vec2(sin(rand(dir))*0.5+0.5,sin(rand(dir))*0.5+0.5);
    float radius = (sin(CC_Time[1]/1000.0)*0.5+0.5);//rand(p);

//    float v = rand(p);
    if(radius > 0.0 && radius < 0.33){
        dir.x = dir.x/2.0;
        dir.y = dir.y/2.0;
    }else if(radius >= 0.33 && radius < 0.66){
        dir.y = 0.0;
    }else{
        dir.x = 0.0;
    }
//    dir = noise(dir).xy;
    float dist = length(dir);
    dir/=dist;
    
    vec4 color = texture2D(CC_Texture0,p);
    vec4 sum = color;
    float samples[10];
    samples[0]=-0.08;
    samples[1]=-0.05;
    samples[2]=-0.03;
    samples[3]=-0.02;
    samples[4]=-0.01;
    samples[5]=0.01;
    samples[6]=0.02;
    samples[7]=0.03;
    samples[8]=0.05;
    samples[9]=0.08;
    for (int i = 0; i < 10; ++i)
    {
        sum += texture2D(CC_Texture0, p + dir*samples[i]*fSampleDist);
//        sum += texture2D(CC_Texture0, p + dir*samples[i]*0.3);
    }
    
    sum /= 11.0;
    //directx code:
    //float3 result = saturate(texCol0.rgb - Density*(texCol1.rgb));
    //GLSL equivalent:
    //vec3 result = clamp(texCol0.rgb - Density*(texCol1.rgb), 0.0, 1.0);
    
    float t = clamp(dist * fSampleStrength,0.0, 1.0);
//    float t = clamp(dist * 5.6,0.0, 1.0);
    return lerp(t,color, sum);
}

vec4 blur3(vec2 p){
    
    vec4 color = vec4(0.0);
//    p.y = 1.0-p.y;
    for(float x = 0.0; x < 8.0; x += 1.0){
        float radius = (16.0 - x) * (sin(CC_Time[1]/1000.0)*0.5+0.5);//rand(p);
        vec2 direction = vec2(0.5,0.5);
        if(mod(x, 2.0) == 0.0){
            direction.x = radius;
            direction.y = 0.0;
        }else{
            direction.x = 0.0;
            direction.y = radius;
        }
        
        vec2 off1 = vec2(1.3846153846) * direction;
        vec2 off2 = vec2(3.2307692308) * direction;
        color += texture2D(CC_Texture0, p) * 0.2270270270;
        color += texture2D(CC_Texture0, p + (off1 / resolution)) * 0.3162162162;
        color += texture2D(CC_Texture0, p - (off1 / resolution)) * 0.3162162162;
        color += texture2D(CC_Texture0, p + (off2 / resolution)) * 0.0702702703;
        color += texture2D(CC_Texture0, p - (off2 / resolution)) * 0.0702702703;
//        vec2 off1 = vec2(1.411764705882353) * direction;
//        vec2 off2 = vec2(3.2941176470588234) * direction;
//        vec2 off3 = vec2(5.176470588235294) * direction;
//
//        color += texture2D(CC_Texture0, p) * 0.1964825501511404;
//        color += texture2D(CC_Texture0, p + (off1 / resolution)) * 0.2969069646728344;
//        color += texture2D(CC_Texture0, p - (off1 / resolution)) * 0.2969069646728344;
//        color += texture2D(CC_Texture0, p + (off2 / resolution)) * 0.09447039785044732;
//        color += texture2D(CC_Texture0, p - (off2 / resolution)) * 0.09447039785044732;
//        color += texture2D(CC_Texture0, p + (off3 / resolution)) * 0.010381362401148057;
//        color += texture2D(CC_Texture0, p - (off3 / resolution)) * 0.010381362401148057;
    
    }
    
    return color/8.0;
}

vec4 blur4(vec2 p){
    vec2 blurSize=vec2((1.0/1136.0)*1.0,(1.0/640.0)*1.5);
    vec4 sum = vec4(0.0);
    float alpha = texture2D(CC_Texture0 , v_texCoord).a;
    
    sum += texture2D(CC_Texture0, v_texCoord - 11.0 * blurSize) * 0.01;
    sum += texture2D(CC_Texture0, v_texCoord - 9.0 * blurSize) * 0.02;
    sum += texture2D(CC_Texture0, v_texCoord - 7.0 * blurSize) * 0.05;
    sum += texture2D(CC_Texture0, v_texCoord - 5.0 * blurSize) * 0.09;
    sum += texture2D(CC_Texture0, v_texCoord - 3.0 * blurSize) * 0.12;
    sum += texture2D(CC_Texture0, v_texCoord - 1.0 * blurSize) * 0.15;
    sum += texture2D(CC_Texture0, v_texCoord                 ) * 0.16;
    sum += texture2D(CC_Texture0, v_texCoord + 1.0 * blurSize) * 0.15;
    sum += texture2D(CC_Texture0, v_texCoord + 3.0 * blurSize) * 0.12;
    sum += texture2D(CC_Texture0, v_texCoord + 5.0 * blurSize) * 0.09;
    sum += texture2D(CC_Texture0, v_texCoord + 7.0 * blurSize) * 0.05;
    sum += texture2D(CC_Texture0, v_texCoord + 9.0 * blurSize) * 0.02;
    sum += texture2D(CC_Texture0, v_texCoord + 11.0 * blurSize) * 0.01;
    
    vec4 temp = vec4(0,0,0,0);
    vec4 substract = vec4(0,0,0,0);
    temp = (sum - substract);
    if(alpha < 0.05)
    {
        return vec4(0 , 0 , 0 , 0);
    }
    else
    {
        return temp;
    }
}
