import './style.css';

// Mobile Menu Functionality
document.addEventListener('DOMContentLoaded', function() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileOverlay = document.getElementById('mobileOverlay');
  
  // Toggle mobile menu
  function toggleMobileMenu() {
    const isOpen = mobileMenu.classList.contains('active');
    
    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }
  
  // Open mobile menu
  function openMobileMenu() {
    mobileMenu.classList.add('active');
    mobileOverlay.classList.add('active');
    mobileMenuBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
    
    // Change hamburger to X icon
    mobileMenuBtn.innerHTML = `
      <svg class="w-6 h-6 text-red-950" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    `;
  }
  
  // Close mobile menu
  function closeMobileMenu() {
    mobileMenu.classList.remove('active');
    mobileOverlay.classList.remove('active');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = ''; // Restore scrolling
    
    // Change X back to hamburger icon
    mobileMenuBtn.innerHTML = `
      <svg class="w-6 h-6 text-red-950" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
      </svg>
    `;
  }
  
  // Event listeners
  mobileMenuBtn.addEventListener('click', toggleMobileMenu);
  mobileOverlay.addEventListener('click', closeMobileMenu);
  
  // Close menu when clicking on mobile menu links
  const mobileMenuLinks = mobileMenu.querySelectorAll('a');
  mobileMenuLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });
  
  // Close menu on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
      closeMobileMenu();
    }
  });
  
  // Close menu on window resize if screen becomes large
  window.addEventListener('resize', function() {
    if (window.innerWidth >= 768 && mobileMenu.classList.contains('active')) {
      closeMobileMenu();
    }
  });
});

// Carousel Functionality
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const indicators = document.querySelectorAll('.indicator');
const totalSlides = slides.length;

function showSlide(index) {
  // Remove active class from all slides and indicators
  slides.forEach((slide, i) => {
    slide.classList.remove('active');
    // Reset slide content animations
    const content = slide.querySelector('.slide-content');
    if (content) {
      content.style.animation = 'none';
      setTimeout(() => {
        content.style.animation = '';
      }, 10);
    }
  });
  
  indicators.forEach(indicator => {
    indicator.classList.remove('active');
    indicator.setAttribute('aria-selected', 'false');
  });
  
  // Add active class to current slide and indicator
  slides[index].classList.add('active');
  indicators[index].classList.add('active');
  indicators[index].setAttribute('aria-selected', 'true');
  
  // Trigger parallax animation for background
  const activeBg = slides[index].querySelector('.slide-bg');
  if (activeBg) {
    activeBg.style.transform = 'translateX(-10%) translateY(-10%) scale(1.1)';
    setTimeout(() => {
      activeBg.style.transform = 'translateX(0%) translateY(0%) scale(1)';
    }, 50);
  }
}

function changeSlide(direction) {
  currentSlide += direction;
  
  if (currentSlide >= totalSlides) {
    currentSlide = 0;
  } else if (currentSlide < 0) {
    currentSlide = totalSlides - 1;
  }
  
  showSlide(currentSlide);
}

function goToSlide(index) {
  currentSlide = index;
  showSlide(currentSlide);
}

// Auto-advance carousel with parallax
function autoAdvance() {
  changeSlide(1);
}

// Parallax scroll effect
function handleParallaxScroll() {
  const scrolled = window.pageYOffset;
  const parallaxElements = document.querySelectorAll('.slide-bg');
  
  parallaxElements.forEach((element, index) => {
    const speed = 0.5;
    const yPos = -(scrolled * speed);
    element.style.transform = `translate3d(0, ${yPos}px, 0)`;
  });
}

// Mouse parallax effect
function handleMouseParallax(e) {
  const activeSlide = document.querySelector('.slide.active');
  if (!activeSlide) return;
  
  const rect = activeSlide.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  
  const rotateX = (y - centerY) / centerY * 2;
  const rotateY = (centerX - x) / centerX * 2;
  
  const floatingElements = activeSlide.querySelectorAll('.floating-element');
  floatingElements.forEach((element, index) => {
    const speed = (index + 1) * 0.5;
    element.style.transform = `translate(${rotateY * speed}px, ${rotateX * speed}px)`;
  });
}

// Make functions global so HTML can access them
window.changeSlide = changeSlide;
window.goToSlide = goToSlide;

// Add event listeners for parallax effects
window.addEventListener('scroll', handleParallaxScroll);
document.addEventListener('mousemove', handleMouseParallax);

// Auto-advance carousel
setInterval(autoAdvance, 5000);

// Intersection Observer for scroll animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

// Initialize scroll animations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .slide-in-up, .stagger-animation');
  animatedElements.forEach(el => observer.observe(el));
});
