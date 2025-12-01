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

// ==========================
// HACKING DECODE ANIMATION
// ==========================

function hackingDecodeEffect() {
    const title = document.getElementById('decode-title');
    if (!title) return;

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*{}[]<>/\\|~';
    const finalText = ['DIGITAL', '/', 'MATTER'];

    // First: Animate WAARP sliding up with GSAP (like the original)
    gsap.to('.line', {
        y: 0,
        duration: 1.5,
        ease: 'power4.out',
        delay: 0.5,
        onComplete: () => {
            // Wait 1 second after WAARP appears, then start decode
            setTimeout(() => {
                startDecodeSequence();
            }, 1000);
        }
    });

    function startDecodeSequence() {
        const lineWrapper = title.querySelector('.line-wrapper');
        const lineSpan = lineWrapper.querySelector('.line');

        if (!lineSpan) return;

        // Phase 1: Glitch WAARP
        glitchText(lineSpan, 'WAARP', 1000, () => {
            // Phase 2: Scramble and expand
            scrambleAndExpand(title, () => {
                // Phase 3: Decode to final text
                decodeToFinal(title, finalText);
            });
        });
    }

    function glitchText(element, text, duration, callback) {
        const iterations = 20;
        const interval = duration / iterations;
        let count = 0;

        const glitchInterval = setInterval(() => {
            element.innerHTML = text.split('').map((char, i) => {
                if (Math.random() > 0.7) {
                    return `<span style="opacity: 0.5">${chars[Math.floor(Math.random() * chars.length)]}</span>`;
                }
                return char;
            }).join('');

            count++;
            if (count >= iterations) {
                clearInterval(glitchInterval);
                element.textContent = text;
                if (callback) callback();
            }
        }, interval);
    }

    function scrambleAndExpand(element, callback) {
        const targetLength = 'DIGITALMATTER'.length;
        let scrambleCount = 0;
        const maxScrambles = 30;

        const scrambleInterval = setInterval(() => {
            let scrambled = '';
            for (let i = 0; i < targetLength; i++) {
                scrambled += chars[Math.floor(Math.random() * chars.length)];
            }
            element.textContent = scrambled;
            element.style.letterSpacing = '0.2em';

            scrambleCount++;
            if (scrambleCount >= maxScrambles) {
                clearInterval(scrambleInterval);
                if (callback) callback();
            }
        }, 50);
    }

    function decodeToFinal(element, targetLines) {
        // Smoothly animate letter-spacing back to normal with GSAP
        gsap.to(element, {
            letterSpacing: '0em',
            duration: 0.8,
            ease: 'power2.out'
        });

        // Create line structure
        element.innerHTML = targetLines.map(line =>
            `<div class="decode-line">${'█'.repeat(line.length)}</div>`
        ).join('');

        const lines = element.querySelectorAll('.decode-line');

        function decodeCharacter(lineIdx, charIdx, targetChar) {
            const line = lines[lineIdx];
            if (!line) return;

            let iterations = 0;
            const maxIterations = 15;

            const charInterval = setInterval(() => {
                const currentText = line.textContent.split('');

                if (iterations < maxIterations - 1) {
                    currentText[charIdx] = chars[Math.floor(Math.random() * chars.length)];
                } else {
                    currentText[charIdx] = targetChar;
                    clearInterval(charInterval);
                }

                line.textContent = currentText.join('');
                iterations++;
            }, 30);
        }

        // Decode each character with cascading effect
        let globalCharIndex = 0;
        targetLines.forEach((lineText, lineIdx) => {
            lineText.split('').forEach((char, charIdx) => {
                setTimeout(() => {
                    decodeCharacter(lineIdx, charIdx, char);
                }, globalCharIndex * 40);
                globalCharIndex++;
            });
        });

        // Final cleanup - no need to set letter-spacing since GSAP already animated it
        setTimeout(() => {
            element.style.lineHeight = '0.8';
        }, globalCharIndex * 40 + 500);
    }
}

// Initialize decode effect when page loads
window.addEventListener('load', () => {
    hackingDecodeEffect();
});

// Hero Animation for other pages (standard slide-up)
const tl = gsap.timeline();

// Only animate if NOT on index page with decode effect
if (!document.getElementById('decode-title')) {
    tl.to('.line', {
        y: 0,
        duration: 1.5,
        stagger: 0.2,
        ease: 'power4.out',
        delay: 0.5
    });
}

// Scroll Animations
gsap.registerPlugin(ScrollTrigger);

// Bio Text Reveal
gsap.from('.bio-text', {
    scrollTrigger: {
        trigger: '#bio',
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: true
    },
    opacity: 0.2,
    y: 50,
    duration: 1
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

    if (!localStorage.getItem('cookiesAccepted')) {
        setTimeout(() => {
            banner.classList.add('show');
        }, 1000);
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

// Combined Mouse Coordinates and Custom Cursor
document.addEventListener('mousemove', (e) => {
    // Custom cursor
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

    // Coordinates display
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
