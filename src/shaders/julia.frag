#version 330 core

in vec4 gl_FragCoord;
uniform float scale;

out vec4 fragColor;

vec2 z_m(vec2 z1, vec2 z2) {
    return vec2(z1.x * z2.x - z1.y * z2.y, z1.x * z2.y + z2.x * z1.y);
}

// julia eq: f(z) = z^2 + c
vec2 f(vec2 z, vec2 c) {
    return z_m(z, z) + c;
}

// Assume c consists of the real number (x) and imaginary number (y)
float julia(vec2 coords, vec3 julia) {
    // allows sets to fit within box by setting a "padding" via out of bounds values in [-1, 1] range.
    vec2 z = 1.5 * coords / scale;
    vec2 c = julia.xy;
    int max_iter = int(julia.z);
	for (int i = 0; i < max_iter; ++i) {
        z = f(z, c);
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
    // real, imag, max_iter
    vec3 julias[] = vec3[4](
        vec3(0.285f, 0.01f, 200),
        vec3(-0.70176f, -0.3842f, 150),
        vec3(-0.8f, 0.156f, 300),
        vec3(-0.7629f, 0.1889f, 100)
    );

    // partition the board into 4 pieces and load each c value
    vec2 coords_01 = gl_FragCoord.xy/1080;
    int offset = 0;
    if (coords_01.y > 0.5f) {
        offset += 2;
    }
    int i = int(ceil(coords_01.x * 2) - 1) + offset;
    vec2 coords_p_01 = mod(vec2(2 * coords_01.x, 2 * coords_01.y), 1);
    vec2 coords = 2 * coords_p_01 - vec2(1.0f, 1.0f);

	float a = julia(coords, julias[i]);
	fragColor = vec4(colorFunc(a), 1.0f);
}
