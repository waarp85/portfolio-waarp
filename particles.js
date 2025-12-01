// Particle Text Effect for "DIGITAL / MATTER"
function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const heroSection = document.getElementById('hero');

    // Set canvas size
    canvas.width = heroSection.offsetWidth;
    canvas.height = heroSection.offsetHeight;

    const particles = [];
    const mouse = { x: null, y: null, radius: 100 };

    // Text configuration
    const lines = ['DIGITAL', '/', 'MATTER'];
    const fontSize = Math.min(canvas.width * 0.15, 200); // Responsive font size
    ctx.font = `900 ${fontSize}px Inter, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Create particles from text
    const lineHeight = fontSize * 0.8;
    lines.forEach((text, lineIndex) => {
        const y = canvas.height / 2 + (lineIndex - 1) * lineHeight;
        const x = canvas.width / 2;

        // Draw text to get pixel data
        ctx.fillStyle = '#fff';
        ctx.fillText(text, x, y);

        // Get text bounds
        const metrics = ctx.measureText(text);
        const textWidth = metrics.width;
        const textHeight = fontSize;

        // Sample pixels from text
        const imageData = ctx.getImageData(
            x - textWidth / 2,
            y - textHeight / 2,
            textWidth,
            textHeight
        );

        // Clear canvas for particle rendering
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Create particles from pixels
        const particleDensity = 3; // Lower = more particles
        for (let py = 0; py < imageData.height; py += particleDensity) {
            for (let px = 0; px < imageData.width; px += particleDensity) {
                const index = (py * imageData.width + px) * 4;
                const alpha = imageData.data[index + 3];

                if (alpha > 128) { // If pixel is part of text
                    particles.push({
                        x: x - textWidth / 2 + px,
                        y: y - textHeight / 2 + py,
                        originX: x - textWidth / 2 + px,
                        originY: y - textHeight / 2 + py,
                        vx: 0,
                        vy: 0,
                        size: 1.5
                    });
                }
            }
        }
    });

    // Mouse tracking
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    canvas.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            // Calculate distance from mouse
            if (mouse.x !== null && mouse.y !== null) {
                const dx = mouse.x - particle.x;
                const dy = mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mouse.radius) {
                    // Push particles away from mouse
                    const force = (mouse.radius - distance) / mouse.radius;
                    const angle = Math.atan2(dy, dx);
                    particle.vx -= Math.cos(angle) * force * 3;
                    particle.vy -= Math.sin(angle) * force * 3;
                }
            }

            // Return to original position
            const returnForce = 0.15;
            particle.vx += (particle.originX - particle.x) * returnForce;
            particle.vy += (particle.originY - particle.y) * returnForce;

            // Apply velocity
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Damping
            particle.vx *= 0.85;
            particle.vy *= 0.85;

            // Draw particle
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.fill();
        });

        requestAnimationFrame(animate);
    }

    animate();

    // Handle resize
    window.addEventListener('resize', () => {
        location.reload(); // Reload to recalculate particles
    });
}
