
const canvas = document.createElement('canvas');
canvas.id = 'webgl-background';
canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.width = '100%';
canvas.style.height = '100%';
canvas.style.zIndex = '0'; // Behind content but visible
canvas.style.pointerEvents = 'none';
document.body.prepend(canvas);

const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false });

if (!gl) {
    console.error('WebGL not supported');
}

// Shaders
const vertexShaderSource = `
    attribute vec2 position;
    void main() {
        gl_Position = vec4(position, 0.0, 1.0);
    }
`;

const fragmentShaderSource = `
    precision highp float;
    
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;
    uniform float u_time;
    
    // Grid parameters
    const float gridSize = 40.0;
    const float thickness = 0.02; // Line thickness
    
    void main() {
        vec2 st = gl_FragCoord.xy / u_resolution.y; // Correct aspect ratio
        vec2 mouse = u_mouse / u_resolution.y;
        mouse.y = (u_resolution.y - u_mouse.y) / u_resolution.y; // Flip Y for shader coords if needed, but standard input is usually usually Y-down in JS, needs flip here? Let's assume standard GL coord system (0,0 bottom left)

        // Correction for mouse Y to match GL coords (0 at bottom)
        // JS mouse is 0 at top. 
        vec2 jsMouse = vec2(u_mouse.x, u_resolution.y - u_mouse.y);
        vec2 normMouse = jsMouse / u_resolution.y;

        // Distance from mouse
        float dist = distance(st, normMouse);
        
        // Distortion intensity
        float strength = 0.1 * smoothstep(0.4, 0.0, dist); // Effect radius
        
        // Distort UVs
        vec2 distortedSt = st - (st - normMouse) * strength;
        
        // Draw Grid
        // We use fract to repeat the space
        // Correct aspect ratio scaling for grid cells
        vec2 gridSt = distortedSt * gridSize;
        
        // Soft lines
        vec2 lines = smoothstep(0.5 - thickness, 0.5, fract(gridSt)) - 
                     smoothstep(0.5, 0.5 + thickness, fract(gridSt));
                     
        // Make it a grid (both X and Y lines) => logic: if near integer, it's a line
        // Easier: check distance to nearest integer
        vec2 gridPos = fract(gridSt);
        float lineX = smoothstep(thickness, 0.0, abs(gridPos.x - 0.5)); // Center lines? No, fract goes 0->1.
        // Let's us abs(fract - 0.5) to find center, or just use step near 0 or 1.
        // Simple distinct lines:
        // Simple distinct lines (Corrected logic)
        // x > 0.98 OR x < 0.02
        float lx = step(1.0 - thickness, gridPos.x) + (1.0 - step(thickness, gridPos.x));
        float ly = step(1.0 - thickness, gridPos.y) + (1.0 - step(thickness, gridPos.y)); 
        
        // Combine
        float grid = max(lx, ly);
        
        // Fading
        grid *= 0.15; // Opacity
        
        // Add subtle flows/noise if requested later, for now just warp
        
        gl_FragColor = vec4(vec3(1.0), grid);
    }
`;

// Helper to compile shader
function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(program));
}

gl.useProgram(program);

// Attributes
const positionLocation = gl.getAttribLocation(program, 'position');
const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1,
    1, -1,
    -1, 1,
    -1, 1,
    1, -1,
    1, 1,
]), gl.STATIC_DRAW);

gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

// Uniforms
const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
const mouseLocation = gl.getUniformLocation(program, 'u_mouse');
const timeLocation = gl.getUniformLocation(program, 'u_time');

// Resize
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
}
window.addEventListener('resize', resize);
resize();

// Mouse tracking
let mouseX = 0;
let mouseY = 0;
// Smooth mouse for effect
let targetX = 0;
let targetY = 0;

window.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
});

// Animation Loop
const startTime = Date.now();

function animate() {
    // Lerp mouse
    mouseX += (targetX - mouseX) * 0.1;
    mouseY += (targetY - mouseY) * 0.1;

    gl.uniform2f(mouseLocation, mouseX, mouseY);
    gl.uniform1f(timeLocation, (Date.now() - startTime) * 0.001);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
    requestAnimationFrame(animate);
}

animate();
