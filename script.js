// ==========================================================================
// 1. INITIAL LOADING SCREEN (โหลดเฉพาะตอนเข้าครั้งแรก)
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('initial-loader');
    const fillBar = document.getElementById('loader-bar-fill');
    const percentText = document.getElementById('loader-percent');

    if (sessionStorage.getItem('sw_visited')) {
        if (loader) loader.style.display = 'none';
    } else {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.floor(Math.random() * 15) + 5;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                setTimeout(() => {
                    if (loader) loader.classList.add('fade-out');
                    sessionStorage.setItem('sw_visited', 'true');
                }, 400);
            }
            if (fillBar) fillBar.style.width = `${progress}%`;
            if (percentText) percentText.innerText = `${progress}%`;
        }, 60);
    }
});

// ==========================================================================
// 2. BACKGROUND CANVAS ANIMATION (บล็อกพิกเซลหมุนลอย)
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.createElement('canvas');
    canvas.id = 'bg-canvas';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = 45;

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 12 + 4,
            speedX: (Math.random() - 0.5) * 1.5,
            speedY: (Math.random() - 0.5) * 1.5,
            color: Math.random() > 0.5 ? '#00E5FF' : '#FF007F',
            alpha: Math.random() * 0.7 + 0.3
        });
    }

    function animateCanvas() {
        ctx.clearRect(0, 0, width, height);

        ctx.strokeStyle = 'rgba(0, 229, 255, 0.06)';
        ctx.lineWidth = 1;
        const gridSize = 50;
        for (let x = 0; x < width; x += gridSize) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
        }
        for (let y = 0; y < height; y += gridSize) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
        }

        particles.forEach(p => {
            p.x += p.speedX; p.y += p.speedY;
            if (p.x < 0 || p.x > width) p.speedX *= -1;
            if (p.y < 0 || p.y > height) p.speedY *= -1;

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.strokeStyle = p.color;
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.alpha;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 12;

            ctx.strokeRect(-p.size / 2, -p.size / 2, p.size, p.size);
            ctx.fillRect(-p.size / 4, -p.size / 4, p.size / 2, p.size / 2);

            ctx.restore();
        });

        requestAnimationFrame(animateCanvas);
    }
    animateCanvas();
});

// ==========================================================================
// 3. CURSOR LOGIC (ลื่นไหล ไม่ดีด)
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    const cursorDot = document.getElementById('cursor-dot');
    const cursorOutline = document.getElementById('cursor-outline');

    let mouseX = -100, mouseY = -100;
    let outlineX = -100, outlineY = -100;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX; mouseY = e.clientY;
        if (cursorDot) {
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        }
    });

    function renderCursor() {
        if (cursorOutline && mouseX !== -100) {
            outlineX += (mouseX - outlineX) * 0.25;
            outlineY += (mouseY - outlineY) * 0.25;
            cursorOutline.style.left = `${outlineX}px`;
            cursorOutline.style.top = `${outlineY}px`;
        }
        requestAnimationFrame(renderCursor);
    }
    renderCursor();

    document.querySelectorAll('a, button, .card').forEach(el => {
        el.addEventListener('mouseenter', () => cursorOutline && cursorOutline.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => cursorOutline && cursorOutline.classList.remove('cursor-hover'));
    });
});

// ==========================================================================
// 4. PAGE TRANSITION (เอฟเฟกต์สลายพิกเซล)
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href]').forEach(link => {
        link.addEventListener('click', (e) => {
            const targetUrl = link.getAttribute('href');
            if (!targetUrl || targetUrl.startsWith('#') || link.getAttribute('target') === '_blank') return;

            e.preventDefault();

            const clickX = e.clientX;
            const clickY = e.clientY;

            const dissolveOverlay = document.createElement('div');
            dissolveOverlay.className = 'silver-wolf-dissolve';
            document.body.appendChild(dissolveOverlay);

            for (let i = 0; i < 45; i++) {
                const pixel = document.createElement('div');
                pixel.className = 'sw-pixel';
                const size = Math.random() * 25 + 10;
                pixel.style.width = `${size}px`;
                pixel.style.height = `${size}px`;
                pixel.style.left = `${clickX + (Math.random() - 0.5) * 200}px`;
                pixel.style.top = `${clickY + (Math.random() - 0.5) * 200}px`;
                pixel.style.setProperty('--dx', `${(Math.random() - 0.5) * 500}px`);
                pixel.style.setProperty('--dy', `${(Math.random() - 0.5) * 500}px`);
                dissolveOverlay.appendChild(pixel);
            }

            document.body.classList.add('page-glitch-exit');
            setTimeout(() => { window.location.href = targetUrl; }, 450);
        });
    });
});
