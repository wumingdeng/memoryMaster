
varying vec4 v_fragmentColor;	
varying vec2 v_texCoord;	
//uniform sampler2D CC_Texture0;	
		
uniform vec3 fullColor;

void main()			
{
	vec4 v_orColor = v_fragmentColor * texture2D(CC_Texture0, v_texCoord);
	//float gray = dot(v_orColor.rgb, vec3(1, 0.9, 0));
	gl_FragColor = vec4(fullColor,v_orColor.a);
}