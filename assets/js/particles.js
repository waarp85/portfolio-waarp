// ============================================
// WAARP - Static Large Logo with Localized Blur
// Overlaid blurred version revealed by cursor mask
// ============================================

class InteractiveLogo {
    constructor(container) {
        this.container = container;
        this.wrapper = null;
        this.sharpLogo = null;
        this.blurredLogo = null;
        this.maskRadius = 180; // Size of the blur circle
    }

    init() {
        // Main wrapper
        this.wrapper = document.createElement('div');
        this.wrapper.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 100%;
            max-width: 1440px; /* +20% larger */
            height: auto;
            z-index: 10;
            opacity: 0;
            pointer-events: auto; /* Enable interaction */
        `;

        // 1. Sharp Logo (Base)
        this.sharpLogo = new Image();
        this.sharpLogo.src = 'assets/images/ai.svg';
        this.sharpLogo.style.cssText = `
            width: 100%;
            height: auto;
            display: block;
            pointer-events: none;
        `;

        // 2. Blurred Logo (Overlay)
        this.blurredLogo = new Image();
        this.blurredLogo.src = 'assets/images/ai.svg';
        this.blurredLogo.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: block;
            pointer-events: none;
            filter: blur(8px); /* The blur effect */
            /* Initial Mask: hidden or outside */
            -webkit-mask-image: radial-gradient(circle 100px at -100px -100px, black 100%, transparent 100%);
            mask-image: radial-gradient(circle 100px at -100px -100px, black 100%, transparent 100%);
            -webkit-mask-repeat: no-repeat;
            mask-repeat: no-repeat;
            will-change: mask-image, -webkit-mask-image;
        `;

        this.wrapper.appendChild(this.sharpLogo);
        this.wrapper.appendChild(this.blurredLogo);
        this.container.appendChild(this.wrapper);

        this.bindEvents();
        return true;
    }

    bindEvents() {
        // Track mouse over the container
        this.wrapper.addEventListener('mousemove', (e) => {
            const rect = this.wrapper.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Update the mask position to reveal the blurred layer
            const gradient = `radial-gradient(circle ${this.maskRadius}px at ${x}px ${y}px, black 30%, transparent 80%)`;

            this.blurredLogo.style.webkitMaskImage = gradient;
            this.blurredLogo.style.maskImage = gradient;
        });

        // Hide mask when leaving
        this.wrapper.addEventListener('mouseleave', () => {
            const gradient = `radial-gradient(circle ${this.maskRadius}px at -1000px -1000px, black 100%, transparent 100%)`;
            this.blurredLogo.style.webkitMaskImage = gradient;
            this.blurredLogo.style.maskImage = gradient;
        });
    }

    fadeIn() {
        gsap.to(this.wrapper, {
            opacity: 1,
            duration: 2,
            ease: "power2.inOut"
        });
    }

    destroy() {
        if (this.wrapper) this.wrapper.remove();
    }
}

// Initialization Logic
let appLogo = null;

function initAppLogo() {
    const heroSection = document.getElementById('hero');
    if (!heroSection) return;
    if (heroSection.querySelector('img[src*="ai.svg"]')) return; // Prevent double init

    setTimeout(() => {
        gsap.to('.hero-title', {
            opacity: 0,
            duration: 1.5,
            onComplete: () => {
                appLogo = new InteractiveLogo(heroSection);
                if (appLogo.init()) {
                    appLogo.fadeIn();
                }
            }
        });
    }, 3000);
}

window.addEventListener('beforeunload', () => {
    if (appLogo) appLogo.destroy();
});

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAppLogo);
} else {
    initAppLogo();
}
