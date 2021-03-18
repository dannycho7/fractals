#version 330 core

in vec4 gl_FragCoord;
 
out vec4 fragColor;

// z consists of the real number (x) and imaginary number (y)
// z = z.x + z.y * i
vec2 z_m(vec2 z1, vec2 z2) {
    return vec2(z1.x * z2.x - z1.y * z2.y, z1.x * z2.y + z2.x * z1.y);
}

// multi-julia eq: f(z, n) = z^n + c
vec2 f(vec2 z, vec2 c, int n) {
    vec2 res = z;
    for (int i = 1; i < n; ++i) {
        res = z_m(res, z);
    }
    return res + c;
}

float multi_julia(vec2 coords, vec3 julia) {
    // allows sets to fit within box by setting a "padding" via out of bounds values in [-1, 1] range.
    vec2 z = 1.5 * coords;
    vec2 c = julia.xy;
    int max_iter = int(julia.z);
	for (int i = 0; i < max_iter; ++i) {
        z = f(z, c, 4);
        if (length(z) > 2) {
			return float(i) / max_iter;
		}
	}
	return 0.0f;
}

// Convert from HSV to RGB
// Taken from: http://lolengine.net/blog/2013/07/27/rgb-to-hsv-in-glsl
vec3 hsv2rgc(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec3 colorFunc(float a) {
    // I tweaked these values numerous times and just chose a few that looked best
    // think of the first part of the sum as the base color/start of the range.
    // NOTE: hue ranges from [0, 2]
    vec3 color = vec3(0.7f + 0.7 * a, 0.8f + 0.2f * a, 0.4f + 0.6f * a);
    return hsv2rgc(color);
}

void main() {
	// offsetting by 0.5 more in the x loads the more standard photo of a mandelbrot
	vec2 coords = gl_FragCoord.xy/540 - vec2(1.0f, 1.0f);
	float a = multi_julia(coords, vec3(0.6f, 0.55f, 200));
	fragColor = vec4(colorFunc(a), 1.0f);
}
