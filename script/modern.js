document.addEventListener('DOMContentLoaded', () => {

    // --- Custom Cursor Logic ---
    const cursor = document.querySelector('.custom-cursor');
    if (cursor) {
        const hoverableElements = document.querySelectorAll('a, button, .project-card, .theme-dot');
        document.addEventListener('mousemove', (e) => {
            requestAnimationFrame(() => {
                cursor.style.left = e.clientX + 'px';
                cursor.style.top = e.clientY + 'px';
            });
        });
        hoverableElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });
    }

    // --- Scroll Animation Logic ---
    const sections = document.querySelectorAll('.content-section');
    if (sections.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                }
            });
        }, { threshold: 0.1 });
        sections.forEach(section => observer.observe(section));
    }

    // --- Active Nav Link on Scroll Logic ---
    const navLinks = document.querySelectorAll('.page-nav a');
    if (navLinks.length > 0 && sections.length > 0) {
        const navObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                    });
                }
            });
        }, { rootMargin: '-50% 0px -50% 0px' });
        sections.forEach(section => navObserver.observe(section));
    }

    // --- Multi-Theme Switcher Logic ---
    const themeDots = document.querySelectorAll('.theme-dot');
    const body = document.body;

    const applyTheme = (theme) => {
        body.dataset.theme = theme;

        // This helper function gets the RGB values of the primary color
        // so we can use it for semi-transparent backgrounds and shadows.
        const rootStyle = getComputedStyle(body);
        const accentColor = rootStyle.getPropertyValue('--primary-accent').trim();
        if (accentColor.startsWith('#')) {
            const hex = accentColor.substring(1);
            const rgb = [
                parseInt(hex.slice(0, 2), 16),
                parseInt(hex.slice(2, 4), 16),
                parseInt(hex.slice(4, 6), 16)
            ];
            body.style.setProperty('--primary-accent-rgb', rgb.join(', '));
        }

        localStorage.setItem('portfolio-theme', theme);
        themeDots.forEach(dot => {
            dot.classList.toggle('active', dot.dataset.theme === theme);
        });

        const faviconUrl = `../images/favicon/${theme}.png`;
        let link = document.querySelector("link[rel~='icon']");
        if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            link.type = 'image/png';
            document.head.appendChild(link);
        }
        link.href = faviconUrl;
    };

    themeDots.forEach(dot => {
        dot.addEventListener('click', () => {
            applyTheme(dot.dataset.theme);
        });
    });

    const savedTheme = localStorage.getItem('portfolio-theme') || 'matrix';
    applyTheme(savedTheme);


    // --- Matrix Background Logic ---
    const canvas = document.getElementById('matrix-background');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const setup = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            const columns = Math.floor(canvas.width / 16);
            return Array(columns).fill(1).map(() => ({
                x: Math.floor(Math.random() * columns) * 16,
                y: 0
            }));
        };

        let drops = setup();
        const matrix = "abcdefghijklmnopqrstuvwxyz123456789@#$%^&*()*&^%";

        const draw = () => {
            const accentColor = getComputedStyle(body).getPropertyValue('--primary-accent').trim();
            ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = accentColor;
            ctx.font = `16px monospace`;

            drops.forEach(d => {
                const text = matrix[Math.floor(Math.random() * matrix.length)];
                ctx.fillText(text, d.x, d.y * 16);
                if (d.y * 16 > canvas.height && Math.random() > 0.975) {
                    d.y = 0;
                }
                d.y++;
            });
            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        window.addEventListener('resize', () => {
            cancelAnimationFrame(animationFrameId);
            drops = setup();
            draw();
        });
    }
});