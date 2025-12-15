// Custom Cursor
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
const links = document.querySelectorAll('a, .work-cell');

links.forEach(link => {
    link.addEventListener('mouseenter', () => {
        gsap.to(follower, {
            scale: 3,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            border: 'none'
        });
    });
    link.addEventListener('mouseleave', () => {
        gsap.to(follower, {
            scale: 1,
            backgroundColor: 'transparent',
            border: '1px solid rgba(255, 255, 255, 0.5)'
        });
    });
});

// Hero Animation
const tl = gsap.timeline();

tl.to('.line', {
    y: 0,
    duration: 1.5,
    stagger: 0.2,
    ease: 'power4.out',
    delay: 0.5
});

// Scroll Animations
gsap.registerPlugin(ScrollTrigger);

// Bio Text Reveal - Word by Word on Scroll (Fluid Cascade)
const bioWords = gsap.utils.toArray('#bio-reveal .word');
const totalWords = bioWords.length;

bioWords.forEach((word, i) => {
    // Calculate staggered start/end positions for each word
    const startOffset = (i / totalWords) * 40; // Spread words across 40% of scroll range
    const endOffset = startOffset + 10; // Each word animates over 10% of scroll

    gsap.fromTo(word,
        {
            opacity: 0.1,
            filter: 'blur(4px)',
            y: 8
        },
        {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            scrollTrigger: {
                trigger: '#bio',
                start: `top ${90 - startOffset}%`,
                end: `top ${60 - endOffset}%`,
                scrub: 0.5, // Smooth scrubbing
            },
            ease: 'power2.out'
        }
    );
});

// Work Grid Reveal
gsap.utils.toArray('.work-cell').forEach((cell, i) => {
    gsap.from(cell, {
        scrollTrigger: {
            trigger: cell,
            start: 'top 90%',
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        delay: i % 2 * 0.1,
        ease: 'power2.out'
    });
});

// Cookie Banner
function initCookieBanner() {
    const banner = document.querySelector('.cookie-banner');
    const acceptBtn = document.querySelector('.cookie-btn');

    if (!banner || !acceptBtn) return;

    // Hide banner if already accepted
    if (localStorage.getItem('cookiesAccepted')) {
        banner.classList.remove('show');
        return;
    }

    acceptBtn.addEventListener('click', () => {
        localStorage.setItem('cookiesAccepted', 'true');
        gsap.to(banner, {
            y: 100,
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
                banner.classList.remove('show');
            }
        });
    });
}

window.addEventListener('load', initCookieBanner);

// Technical UI Logic
function updateSystemClock() {
    const clock = document.getElementById('system-clock');
    if (!clock) return;

    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    clock.textContent = `LOC: ${hours}:${minutes}:${seconds}`;
}

setInterval(updateSystemClock, 1000);
updateSystemClock();

// Mouse Coordinates and Custom Cursor
document.addEventListener('mousemove', (e) => {
    gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1
    });
    gsap.to(follower, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.3
    });

    const coords = document.getElementById('mouse-coords');
    if (coords) {
        const x = String(e.clientX).padStart(4, '0');
        const y = String(e.clientY).padStart(4, '0');
        coords.textContent = `POS: ${x} | ${y}`;
    }
});

// Scroll Progress Indicator
function initScrollIndicator() {
    if (!document.getElementById('scroll-indicator')) {
        const indicator = document.createElement('div');
        indicator.id = 'scroll-indicator';
        document.body.appendChild(indicator);
    }
}

function updateScrollProgress() {
    const indicator = document.getElementById('scroll-indicator');
    if (!indicator) return;

    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;

    const totalBars = 15;
    const filledBars = Math.round((scrollPercent / 100) * totalBars);
    const emptyBars = totalBars - filledBars;

    const bar = '|'.repeat(filledBars) + '.'.repeat(emptyBars);
    indicator.textContent = `SCROLL [${bar}] ${String(scrollPercent).padStart(3, '0')}%`;
}

initScrollIndicator();
window.addEventListener('scroll', updateScrollProgress);
window.addEventListener('resize', updateScrollProgress);
updateScrollProgress();
