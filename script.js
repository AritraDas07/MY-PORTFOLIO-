// Always start at top of page on reload
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

// Loading Screen
function hideLoader() {
    const loader = document.querySelector('.loader-overlay');
    if (loader) loader.classList.add('hidden');
}

if (document.readyState === 'complete') {
    setTimeout(hideLoader, 1200);
} else {
    window.addEventListener('load', () => setTimeout(hideLoader, 1200));
}

// Hero Photo Hover - Reset to starting position
const heroPhoto = document.querySelector('.hero-photo');
if (heroPhoto) {
    let photoTilted = false;
    window.addEventListener('scroll', () => {
        if (!photoTilted && window.scrollY > 5) {
            heroPhoto.classList.add('tilted');
            photoTilted = true;
        }
    });
    heroPhoto.addEventListener('mouseenter', () => {
        heroPhoto.classList.remove('tilted');
    });
    heroPhoto.addEventListener('mouseleave', () => {
        if (photoTilted) {
            heroPhoto.classList.add('tilted');
        }
    });
}

// Falling SVG - Only terminal (top-right)
let terminalFallen = false;
const decoTerminal = document.querySelector('.deco-terminal');
const heroContent = document.querySelector('.hero-content');

function calculateFallDistance() {
    if (!decoTerminal || !heroContent) return;
    const heroContentRect = heroContent.getBoundingClientRect();
    const heroContentBottom = heroContentRect.bottom;
    const terminalRect = decoTerminal.getBoundingClientRect();
    const terminalFall = Math.max(0, heroContentBottom - terminalRect.bottom - 50);
    decoTerminal.style.setProperty('--fall-distance', `${terminalFall}px`);
}

calculateFallDistance();
window.addEventListener('resize', calculateFallDistance);

window.addEventListener('scroll', () => {
    if (decoTerminal && !terminalFallen && window.scrollY > 5) {
        decoTerminal.classList.add('falling');
        terminalFallen = true;
    }
});

// Paper Tear Gap Parallax Effect
const pageGap = document.querySelector('.page-gap');
const paperTearBottom = document.querySelector('.paper-tear-bottom');
const paperTearBottomBgGray = document.querySelector('.paper-tear-bottom svg path[fill="#d0d0d0"]');
const tearTapeSticker = document.querySelector('.tear-tape-sticker');
const minGapHeight = -30;

function updateTapePosition() {
    if (paperTearBottom && tearTapeSticker) {
        const rect = paperTearBottom.getBoundingClientRect();
        tearTapeSticker.style.setProperty('--tape-position', `${rect.top}px`);
    }
}

function updateGapParallax() {
    if (!pageGap || !paperTearBottom) return;

    const isMobile = window.innerWidth <= 768;
    if (isMobile) return;

    const scrollY = window.scrollY;
    const initialGapHeight = 300;
    const scrollStart = 100;
    const scrollRange = 200;
    const stickerDelay = 30;
    const stickerStart = scrollStart + scrollRange + stickerDelay;
    const stickerRange = 60;

    updateTapePosition();

    if (scrollY <= scrollStart) {
        pageGap.style.setProperty('height', initialGapHeight + 'px', 'important');
        paperTearBottom.style.setProperty('margin-top', '0px', 'important');
        if (paperTearBottomBgGray) paperTearBottomBgGray.style.opacity = '1';
        if (tearTapeSticker) {
            tearTapeSticker.style.transform = 'rotate(-8deg) translateY(-40px) translateZ(30px) rotateX(35deg)';
            tearTapeSticker.style.opacity = '0';
        }
    } else if (scrollY >= scrollStart && scrollY <= scrollStart + scrollRange) {
        const progress = (scrollY - scrollStart) / scrollRange;
        const currentHeight = initialGapHeight - (initialGapHeight - minGapHeight) * progress;

        if (currentHeight >= 0) {
            pageGap.style.setProperty('height', currentHeight + 'px', 'important');
            paperTearBottom.style.setProperty('margin-top', '0px', 'important');
            if (paperTearBottomBgGray) paperTearBottomBgGray.style.opacity = '1';
            if (tearTapeSticker) {
                tearTapeSticker.style.transform = 'rotate(-8deg) translateY(-100px) translateZ(50px) rotateX(45deg)';
                tearTapeSticker.style.opacity = '0';
            }
        } else {
            pageGap.style.setProperty('height', '0px', 'important');
            paperTearBottom.style.setProperty('margin-top', currentHeight + 'px', 'important');
            const negativePart = Math.abs(minGapHeight);
            const negativeProgress = Math.abs(currentHeight) / negativePart;
            const opacity = 1 - negativeProgress;

            if (paperTearBottomBgGray) paperTearBottomBgGray.style.opacity = opacity;
            if (tearTapeSticker) {
                tearTapeSticker.style.transform = 'rotate(-8deg) translateY(-100px) translateZ(50px) rotateX(45deg)';
                tearTapeSticker.style.opacity = '0';
            }
        }
    } else if (scrollY > stickerStart && scrollY < stickerStart + stickerRange) {
        pageGap.style.setProperty('height', '0px', 'important');
        paperTearBottom.style.setProperty('margin-top', minGapHeight + 'px', 'important');
        if (paperTearBottomBgGray) paperTearBottomBgGray.style.opacity = '0';

        if (tearTapeSticker) {
            const stickerProgress = (scrollY - stickerStart) / stickerRange;
            const translateY = -40 + (40 * stickerProgress);
            const translateZ = 30 - (30 * stickerProgress);
            const rotateX = 35 - (35 * stickerProgress);
            const opacityVal = Math.min(1, Math.max(0, (stickerProgress - 0.35) * 1.54));

            tearTapeSticker.style.transform = `rotate(-8deg) translateY(${translateY}px) translateZ(${translateZ}px) rotateX(${rotateX}deg)`;
            tearTapeSticker.style.opacity = opacityVal;
        }
    } else if (scrollY >= stickerStart + stickerRange) {
        pageGap.style.setProperty('height', '0px', 'important');
        paperTearBottom.style.setProperty('margin-top', minGapHeight + 'px', 'important');
        if (paperTearBottomBgGray) paperTearBottomBgGray.style.opacity = '0';
        if (tearTapeSticker) {
            tearTapeSticker.style.transform = 'rotate(-8deg) translateY(0px) translateZ(0px) rotateX(0deg)';
            tearTapeSticker.style.opacity = '1';
        }
    } else {
        pageGap.style.setProperty('height', '0px', 'important');
        paperTearBottom.style.setProperty('margin-top', minGapHeight + 'px', 'important');
        if (paperTearBottomBgGray) paperTearBottomBgGray.style.opacity = '0';
        if (tearTapeSticker) {
            tearTapeSticker.style.transform = 'rotate(-8deg) translateY(-40px) translateZ(30px) rotateX(35deg)';
            tearTapeSticker.style.opacity = '0';
        }
    }
}

window.addEventListener('scroll', updateGapParallax);
window.addEventListener('resize', updateGapParallax);
requestAnimationFrame(() => updateGapParallax());

// Highlight Parallax Effect
const highlights = document.querySelectorAll('.highlight');
const highlightData = new Map();

highlights.forEach((highlight, index) => {
    const direction = index % 2 === 0 ? 'left' : 'right';
    highlight.setAttribute('data-direction', direction);
    highlightData.set(highlight, {
        hasStarted: false,
        startScroll: 0,
        duration: 100,
        direction: direction
    });
});

function updateHighlights() {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;

    highlights.forEach(highlight => {
        const rect = highlight.getBoundingClientRect();
        const elementTop = rect.top + scrollY;
        const data = highlightData.get(highlight);
        const triggerPoint = scrollY + windowHeight * 0.8;

        if (!data.hasStarted && triggerPoint >= elementTop) {
            data.hasStarted = true;
            data.startScroll = scrollY;
        }

        if (data.hasStarted) {
            const progress = Math.min(1, Math.max(0, (scrollY - data.startScroll) / data.duration));
            highlight.style.setProperty('--highlight-progress', `${progress * 100}%`);
        }

        if (data.hasStarted && scrollY < data.startScroll - 50) {
            data.hasStarted = false;
            highlight.style.setProperty('--highlight-progress', '0%');
        }
    });
}

window.addEventListener('scroll', updateHighlights);
requestAnimationFrame(() => updateHighlights());

// Journey Timeline Book Page Effect
const journeyTimeline = document.querySelector('.journey-timeline');
const journeyTimelineBack = document.querySelector('.journey-timeline-back');
const journeyTimelineData = {
    hasStarted: false,
    startScroll: 0,
    pageRange: 200
};

function updateJourneyTimeline() {
    if (!journeyTimeline || !journeyTimelineBack) return;
    if (window.innerWidth < 769) return;

    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const rect = journeyTimeline.getBoundingClientRect();
    const elementTop = rect.top + scrollY;
    const triggerPoint = scrollY + windowHeight * 0.5;

    if (!journeyTimelineData.hasStarted && triggerPoint >= elementTop) {
        journeyTimelineData.hasStarted = true;
        journeyTimelineData.startScroll = scrollY;
    }

    if (journeyTimelineData.hasStarted) {
        const progress = Math.min(1, Math.max(0, (scrollY - journeyTimelineData.startScroll) / journeyTimelineData.pageRange));
        const rotateY = 180 - (180 * progress); 

        journeyTimeline.style.transform = `rotateY(${rotateY}deg)`;
        journeyTimelineBack.style.transform = `rotateY(${rotateY}deg)`;

        if (rotateY > 95) {
            journeyTimeline.style.zIndex = '1';
            journeyTimelineBack.style.zIndex = '100';
        } else {
            journeyTimeline.style.zIndex = '100';
            journeyTimelineBack.style.zIndex = '1';
        }
        if (progress >= 1) journeyTimeline.style.overflowY = 'auto';
        else journeyTimeline.style.overflowY = 'hidden';
    } else {
        journeyTimeline.style.transform = 'rotateY(180deg)';
        journeyTimelineBack.style.transform = 'rotateY(180deg)';
        journeyTimeline.style.zIndex = '1';
        journeyTimelineBack.style.zIndex = '100';
        journeyTimeline.style.overflowY = 'hidden';
    }
}

window.addEventListener('scroll', updateJourneyTimeline);
requestAnimationFrame(() => updateJourneyTimeline());

// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
    const body = document.body;
    const icon = themeToggle.querySelector('i');
    const currentTheme = localStorage.getItem('theme') || 'light';
    body.setAttribute('data-theme', currentTheme);
    updateIcon(currentTheme);

    themeToggle.addEventListener('click', () => {
        const theme = body.getAttribute('data-theme');
        const newTheme = theme === 'light' ? 'dark' : 'light';
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateIcon(newTheme);
    });

    function updateIcon(theme) {
        if (theme === 'dark') {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }
}

// Smooth Scroll for Navigation
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        if (targetSection) targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// Smart Navbar Scroll
const navbar = document.querySelector('.navbar');
let lastScroll = 0;
window.addEventListener('scroll', () => {
    if (!navbar) return;
    const currentScroll = window.pageYOffset;
    if (currentScroll > lastScroll && currentScroll > 100) navbar.classList.add('navbar-hidden');
    else if (currentScroll < lastScroll) navbar.classList.remove('navbar-hidden');
    
    // Active link highlighting
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        if (currentScroll >= sectionTop && currentScroll < sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) link.classList.add('active');
            });
        }
    });
    lastScroll = currentScroll;
});

// Intersection Observer for fade-in animations
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -100px 0px' };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('fade-in');
    });
}, observerOptions);
document.querySelectorAll('.section, .timeline-item-flat, .skill-box').forEach(el => observer.observe(el));

// Matrix Typing Effect for Hero Greeting
const greetingElement = document.getElementById('hero-greeting');
if (greetingElement) {
    const finalText = 'Hi there! 👋';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    function matrixTypingEffect() {
        let iterations = 0;
        const interval = setInterval(() => {
            greetingElement.textContent = finalText.split('').map((char, index) => {
                if (index < iterations) return finalText[index];
                if (char === ' ' || char === '👋') return char;
                return chars[Math.floor(Math.random() * chars.length)];
            }).join('');
            if (iterations >= finalText.length) clearInterval(interval);
            iterations += 1/3;
        }, 50);
    }
    setTimeout(matrixTypingEffect, 500);
}

// Progress Bar Functionality
const progressBarFill = document.querySelector('.progress-bar-fill');
const checkpoints = document.querySelectorAll('.checkpoint');
function updateProgressBar() {
    if (!progressBarFill) return;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    const scrolled = window.scrollY;
    const progress = (scrolled / documentHeight) * 100;
    progressBarFill.style.width = progress + '%';

    const sections = ['hero', 'about', 'experience', 'projects', 'skills', 'contact'];
    let activeIndex = 0;
    sections.forEach((sectionId, index) => {
        const section = document.getElementById(sectionId);
        if (section) {
            const rect = section.getBoundingClientRect();
            if (rect.top <= windowHeight / 2 && rect.bottom >= windowHeight / 2) activeIndex = index;
        }
    });

    checkpoints.forEach((checkpoint, index) => {
        if (index <= activeIndex) checkpoint.classList.add('active');
        else checkpoint.classList.remove('active');
    });
}
checkpoints.forEach(checkpoint => {
    checkpoint.addEventListener('click', () => {
        const sectionId = checkpoint.getAttribute('data-section');
        const section = document.getElementById(sectionId);
        if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});
window.addEventListener('scroll', updateProgressBar);
window.addEventListener('resize', updateProgressBar);
updateProgressBar();

// Journey Map with Leaflet
if (typeof L !== 'undefined' && document.getElementById('journey-map')) {
    const initialView = { center: [22.5, 82.0], zoom: 4 };

    const map = L.map('journey-map', {
        center: initialView.center,
        zoom: initialView.zoom,
        scrollWheelZoom: false,
        zoomControl: true
    });

    L.tileLayer('https://watercolormaps.collection.cooperhewitt.org/tile/watercolor/{z}/{x}/{y}.jpg', {
        attribution: '© Stamen Design, © OpenStreetMap contributors',
        maxZoom: 16
    }).addTo(map);

    L.Control.Home = L.Control.extend({
        onAdd: function(map) {
            const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-home');
            const link = L.DomUtil.create('a', '', container);
            link.href = '#';
            link.title = 'Reset map view';
            link.innerHTML = '<i class="fas fa-home"></i>';
            L.DomEvent.on(link, 'click', function(e) {
                e.preventDefault();
                map.setView(initialView.center, initialView.zoom);
            });
            return container;
        }
    });
    new L.Control.Home({ position: 'topright' }).addTo(map);

    const locations = [
        {
            coords: [22.0667, 88.0698],
            country: 'India',
            companies: [
                { city: 'Haldia', company: 'NexForge Studio / HIT', period: '2025 - Present', role: 'Co-Founder / CEO' },
                { city: 'Mumbai', company: 'IIT Bombay', period: 'Jan - Mar 2025', role: 'Full-Stack Dev Intern' }
            ]
        },
        {
            coords: [20.0, 78.0],
            country: 'Remote',
            companies: [
                { city: 'Remote', company: 'Codec Technologies', period: 'Oct - Dec 2025', role: 'AI Intern' },
                { city: 'Remote', company: 'AWS APAC', period: 'Nov 2025', role: 'Solutions Architect' },
                { city: 'Remote', company: 'Deloitte', period: 'Nov 2025', role: 'Data Analytics' },
                { city: 'Remote', company: 'Josh Talks', period: 'Jul - Sept 2025', role: 'Linguistic Expert' },
            ]
        }
    ];

    const markers = {};
    locations.forEach(location => {
        const isCurrent = location.country === 'India';
        const markerIcon = L.divIcon({
            className: isCurrent ? 'neo-marker neo-marker-current' : 'neo-marker',
            html: `
                <div class="neo-marker-label ${isCurrent ? 'neo-marker-label-current' : ''}">${location.country}</div>
                <div class="neo-marker-pin ${isCurrent ? 'neo-marker-pin-current' : ''}"></div>
            `,
            iconSize: isCurrent ? [35, 35] : [30, 30],
            iconAnchor: isCurrent ? [17.5, 50] : [15, 45],
            popupAnchor: [0, isCurrent ? -50 : -45]
        });

        let popupContent = `<div class="map-popup">`;
        popupContent += `<div class="map-popup-country">${location.country}</div>`;

        location.companies.forEach((company, index) => {
            if (index > 0) popupContent += `<div class="map-popup-divider"></div>`;
            popupContent += `
                <div class="map-popup-company">
                    <strong>${company.company}</strong>
                    <span>${company.role}</span>
                    <small>${company.city}</small>
                    <small>${company.period}</small>
                </div>
            `;
        });
        popupContent += `</div>`;

        const marker = L.marker(location.coords, { icon: markerIcon }).addTo(map);
        marker.bindPopup(popupContent);
        markers[location.country] = marker;
    });

    document.querySelectorAll('.timeline-item-flat').forEach(item => {
        item.addEventListener('click', () => {
            const country = item.getAttribute('data-country');
            const marker = markers[country];
            if (marker) {
                map.setView(marker.getLatLng(), 6, { animate: true, duration: 1 });
                setTimeout(() => marker.openPopup(), 500);
            }
        });
    });
}
