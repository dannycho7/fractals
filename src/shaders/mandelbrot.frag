#version 330 core

in vec4 gl_FragCoord;
 
out vec4 fragColor;

#define MAX_ITER 100

// Assume coords consists of the real number (x) and imaginary number (y)
float mandelbrot(vec2 coords) {
	vec2 z = vec2(0, 0);
	for (int i = 0; i < MAX_ITER; ++i) {
        float x = (z.x * z.x - z.y * z.y) + coords.x;
        float y = (z.y * z.x + z.x * z.y) + coords.y;
        z.x = x;
        z.y = y;
        if (length(z) > 2) {
			return float(i) / MAX_ITER;
		}
	}
	return 0.0f;
}

void main() {
	vec2 coords = gl_FragCoord.xy/540 - vec2(1.0f, 1.0f);
	float a = mandelbrot(coords);
	fragColor = vec4(a, a, a, 1.0f);
}
