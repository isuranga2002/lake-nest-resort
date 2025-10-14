// Load configuration from config.json and populate the website
document.addEventListener('DOMContentLoaded', function() {
    loadConfig();
    initMobileMenu();
    initScrollEffects();
    initHeroVideo();
    initGallerySlider();
    initVideoPlayer();
    updateBookingDates();
});

// Load config.json and update page content
async function loadConfig() {
    try {
        const response = await fetch('config.json');
        const config = await response.json();
        
        // Update villa name in multiple places
        const villaNameElements = document.querySelectorAll('#villa-name, #header-name, #footer-name');
        villaNameElements.forEach(element => {
            if (element) element.textContent = config.villaName;
        });
        
        // Update description
        const descriptionElement = document.getElementById('villa-description');
        if (descriptionElement) {
            descriptionElement.textContent = config.description;
        }
        
        // Update phone numbers
        const phone1Elements = document.querySelectorAll('#phone1, #phone-header');
        phone1Elements.forEach(element => {
            if (element) {
                element.textContent = config.phone1;
                element.href = 'tel:+94' + config.phone1;
            }
        });
        
        const phone2Elements = document.querySelectorAll('#phone2');
        phone2Elements.forEach(element => {
            if (element) {
                element.textContent = config.phone2;
                element.href = 'tel:+94' + config.phone2;
            }
        });
        
        // Update email
        const emailElements = document.querySelectorAll('#email, #email-header, #email-contact');
        emailElements.forEach(element => {
            if (element) {
                element.textContent = config.email;
                element.href = 'mailto:' + config.email;
            }
        });
        
        // Update address in multiple places
        const addressElements = document.querySelectorAll('#address, #address-about');
        addressElements.forEach(element => {
            if (element) {
                element.textContent = config.address;
            }
        });
        
        // Update social links
        const facebookLinks = document.querySelectorAll('#facebook-link, #facebook-header, #facebook-contact');
        facebookLinks.forEach(element => {
            if (element && config.facebook) {
                element.href = config.facebook;
            }
        });
        
        // Update WhatsApp links
        const whatsappLinks = document.querySelectorAll('#whatsapp-link, #whatsapp-contact, #whatsapp-text');
        whatsappLinks.forEach(element => {
            if (element && config.whatsapp) {
                element.href = config.whatsapp;
                if (element.id === 'whatsapp-text') {
                    element.textContent = config.phone1;
                }
            }
        });
        
        // Update map iframe
        const mapFrame = document.getElementById('map-frame');
        if (mapFrame && config.googleMap) {
            mapFrame.src = config.googleMap;
        }
        
        // Update package prices
        const price6h = document.getElementById('price-6h');
        if (price6h) {
            price6h.textContent = config.package6h;
        }
        
        const price12h = document.getElementById('price-12h');
        if (price12h) {
            price12h.textContent = config.package12h;
        }
        
        const price24h = document.getElementById('price-24h');
        if (price24h) {
            price24h.textContent = config.package24h;
        }
        
        // Update room count
        const roomCount = document.getElementById('room-count');
        if (roomCount && config.numberOfRooms) {
            roomCount.textContent = config.numberOfRooms + ' Family Rooms';
        }
        
        // Load Facebook Pixel if provided
        if (config.facebookPixel && config.facebookPixel.trim() !== '') {
            loadFacebookPixel(config.facebookPixel);
        }
        
        // Load Google Ads if provided
        if (config.googleAds && config.googleAds.trim() !== '') {
            loadGoogleAds(config.googleAds);
        }
        
    } catch (error) {
        console.error('Error loading config:', error);
    }
}

// Initialize mobile menu toggle
function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const navOverlay = document.getElementById('nav-overlay');
    const navClose = document.getElementById('nav-close');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    if (menuToggle && navOverlay) {
        menuToggle.addEventListener('click', function() {
            navOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        if (navClose) {
            navClose.addEventListener('click', function() {
                navOverlay.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        }
        
        // Close menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navOverlay.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });
        
        // Close menu when clicking outside
        navOverlay.addEventListener('click', function(e) {
            if (e.target === navOverlay) {
                navOverlay.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }
}

// Initialize scroll effects for header
function initScrollEffects() {
    const header = document.querySelector('.header');
    
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
            }
        });
    }
    
    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.amenity-item, .package-card, .about-content');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(40px)';
        element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(element);
    });
}

// Initialize hero video controls
function initHeroVideo() {
    const heroVideo = document.querySelector('.hero-media');
    const pauseBtn = document.getElementById('hero-pause');
    let isPlaying = true;
    
    if (pauseBtn && heroVideo) {
        pauseBtn.addEventListener('click', function() {
            if (isPlaying) {
                heroVideo.pause();
                pauseBtn.querySelector('.pause-icon').textContent = '▶';
                isPlaying = false;
            } else {
                heroVideo.play();
                pauseBtn.querySelector('.pause-icon').textContent = '||';
                isPlaying = true;
            }
        });
    }
}

// Initialize gallery slider
function initGallerySlider() {
    const galleryImages = [
        'assets/room1.jpg',
        'assets/room2.jpg',
        'assets/room3.jpg',
        'assets/room4.jpg',
        'assets/room5.jpg',
        'assets/room6.jpg',
        'assets/room7.jpg',
        'assets/room8.jpg',
        'assets/room9.jpg'
    ];
    
    let currentGalleryIndex = 0;
    const galleryImage = document.getElementById('gallery-current');
    const galleryPrev = document.querySelector('.gallery-prev');
    const galleryNext = document.querySelector('.gallery-next');
    
    if (galleryPrev && galleryNext && galleryImage) {
        function updateGalleryImage() {
            galleryImage.style.opacity = '0';
            setTimeout(function() {
                galleryImage.src = galleryImages[currentGalleryIndex];
                galleryImage.style.opacity = '1';
            }, 300);
        }
        
        galleryPrev.addEventListener('click', function() {
            currentGalleryIndex = (currentGalleryIndex - 1 + galleryImages.length) % galleryImages.length;
            updateGalleryImage();
        });
        
        galleryNext.addEventListener('click', function() {
            currentGalleryIndex = (currentGalleryIndex + 1) % galleryImages.length;
            updateGalleryImage();
        });
        
        // Auto-advance gallery every 5 seconds
        setInterval(function() {
            currentGalleryIndex = (currentGalleryIndex + 1) % galleryImages.length;
            updateGalleryImage();
        }, 5000);
        
        // Add transition effect to gallery image
        galleryImage.style.transition = 'opacity 0.3s ease';
    }
}

// Initialize video player in about section
function initVideoPlayer() {
    const videoPlayBtn = document.querySelector('.video-play-btn');
    const aboutVideo = document.querySelector('.about-video');
    
    if (videoPlayBtn && aboutVideo) {
        videoPlayBtn.addEventListener('click', function() {
            if (aboutVideo.paused) {
                aboutVideo.play();
                videoPlayBtn.style.opacity = '0';
            } else {
                aboutVideo.pause();
                videoPlayBtn.style.opacity = '1';
            }
        });
        
        aboutVideo.addEventListener('click', function() {
            if (!aboutVideo.paused) {
                aboutVideo.pause();
                videoPlayBtn.style.opacity = '1';
            }
        });
        
        aboutVideo.addEventListener('play', function() {
            videoPlayBtn.style.opacity = '0';
        });
        
        aboutVideo.addEventListener('pause', function() {
            videoPlayBtn.style.opacity = '1';
        });
    }
}

// Update booking widget with current dates
function updateBookingDates() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Format dates
    const arrivalDay = today.getDate();
    const arrivalMonth = today.toLocaleDateString('en-US', { month: 'short' }).toLowerCase();
    const arrivalYear = today.getFullYear().toString().slice(-2);
    
    const departureDay = tomorrow.getDate();
    const departureMonth = tomorrow.toLocaleDateString('en-US', { month: 'short' }).toLowerCase();
    const departureYear = tomorrow.getFullYear().toString().slice(-2);
    
    // Update arrival date
    const arrivalDayElement = document.getElementById('arrival-day');
    const arrivalMonthElement = document.getElementById('arrival-month');
    
    if (arrivalDayElement && arrivalMonthElement) {
        arrivalDayElement.textContent = arrivalDay;
        arrivalMonthElement.textContent = arrivalMonth + ' \'' + arrivalYear;
    }
    
    // Update departure date
    const departureDayElement = document.getElementById('departure-day');
    const departureMonthElement = document.getElementById('departure-month');
    
    if (departureDayElement && departureMonthElement) {
        departureDayElement.textContent = departureDay;
        departureMonthElement.textContent = departureMonth + ' \'' + departureYear;
    }
}

// Load Facebook Pixel
function loadFacebookPixel(pixelCode) {
    try {
        const script = document.createElement('script');
        script.innerHTML = pixelCode;
        document.head.appendChild(script);
    } catch (error) {
        console.error('Error loading Facebook Pixel:', error);
    }
}

// Load Google Ads
function loadGoogleAds(adsCode) {
    try {
        const script = document.createElement('script');
        script.innerHTML = adsCode;
        document.head.appendChild(script);
    } catch (error) {
        console.error('Error loading Google Ads:', error);
    }
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const headerOffset = 100;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Add page loading animation
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    setTimeout(function() {
        document.body.style.transition = 'opacity 0.6s ease';
        document.body.style.opacity = '1';
    }, 100);
});