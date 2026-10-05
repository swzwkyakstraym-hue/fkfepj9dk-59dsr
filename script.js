(() => {
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

const loader = $('#loader');
const nav = $('#nav');
const navLinks = $('#navLinks');
const navToggle = $('#navToggle');
const navCta = $('#navCta');
const backToTop = $('#backToTop');
const sections = $$('section[id]');
const navLinkEls = $$('.nav-link');
const animatedEls = $$('[data-animate]');

let ticking = false;
let lastScroll = 0;

function onLoad() {
loader.classList.add('hidden');
setTimeout(() => loader.remove(), 400);
initIntersectionObserver();
initSmoothScroll();
initNavScroll();
initBackToTop();
initMobileMenu();
setActiveNav();
}
function initIntersectionObserver() {
const observer = new IntersectionObserver((entries) => {
entries.forEach(entry => {
if (entry.isIntersecting) {
entry.target.classList.add('visible');
observer.unobserve(entry.target);
}
});
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
animatedEls.forEach(el => observer.observe(el));
}
function initSmoothScroll() {
$$('a[href^="#"]').forEach(anchor => {
anchor.addEventListener('click', e => {
const targetId = anchor.getAttribute('href');
if (targetId === '#') return;
const target = $(targetId);
if (target) {
e.preventDefault();
const offset = nav.offsetHeight;
const targetPos = target.getBoundingClientRect().top + window.scrollY - offset;
window.scrollTo({ top: targetPos, behavior: 'smooth' });
closeMobileMenu();
}
});
});
}
function initNavScroll() {
function onScroll() {
if (!ticking) {
requestAnimationFrame(() => {
const scrollY = window.scrollY;
nav.classList.toggle('scrolled', scrollY > 20);
backToTop.classList.toggle('visible', scrollY > 300);
setActiveNav();
ticking = false;
});
ticking = true;
}
}
window.addEventListener('scroll', onScroll, { passive: true });
}
function setActiveNav() {
const scrollPos = window.scrollY + nav.offsetHeight + 100;
let current = '';
sections.forEach(section => {
const top = section.offsetTop;
const height = section.offsetHeight;
if (scrollPos >= top && scrollPos < top + height) {
current = section.id;
}
});
navLinkEls.forEach(link => {
link.classList.toggle('active', link.dataset.section === current);
});
}
function initBackToTop() {
backToTop.addEventListener('click', () => {
window.scrollTo({ top: 0, behavior: 'smooth' });
});
}
function initMobileMenu() {
navToggle.addEventListener('click', () => {
const expanded = navToggle.getAttribute('aria-expanded') === 'true';
navToggle.setAttribute('aria-expanded', !expanded);
navLinks.classList.toggle('open');
document.body.style.overflow = expanded ? '' : 'hidden';
});
navLinkEls.forEach(link => {
link.addEventListener('click', closeMobileMenu);
});
document.addEventListener('click', e => {
if (navLinks.classList.contains('open') &&
!navLinks.contains(e.target) &&
!navToggle.contains(e.target)) {
closeMobileMenu();
}
});
}
function closeMobileMenu() {
navLinks.classList.remove('open');
navToggle.setAttribute('aria-expanded', 'false');
document.body.style.overflow = '';
}

if (document.readyState === 'loading') {
document.addEventListener('DOMContentLoaded', onLoad);
} else {
onLoad();
}
})();