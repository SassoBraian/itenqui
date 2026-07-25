document.addEventListener('DOMContentLoaded', () => {
    // ================= NAVBAR SCROLL EFFECT =================
    const navbar = document.getElementById('navbar');
    
    const handleNavbarScroll = () => {
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleNavbarScroll);
    handleNavbarScroll(); // Initial check

    // ================= MOBILE HAMBURGER MENU =================
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            
            // Hamburger icon animation
            const spans = menuToggle.querySelectorAll('span');
            if (navLinks.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const spans = menuToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }

    // ================= SMOOTH SCROLL FOR ANCHORS =================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId !== '#' && targetId.length > 1) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    const navHeight = navbar.offsetHeight;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - navHeight;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // ================= RESPONSIVE SPACES CAROUSEL =================
    const track = document.getElementById('carouselTrack');
    const dotsContainer = document.getElementById('carouselDots');
    const items = Array.from(track.children);
    
    let currentIndex = 0;
    let visibleItems = 6;
    let totalPages = 1;
    let autoPlayInterval = null;

    const calculateCarouselLayout = () => {
        const width = window.innerWidth;
        if (width > 850) {
            visibleItems = 6;
        } else if (width > 600) {
            visibleItems = 3;
        } else {
            visibleItems = 2;
        }
        totalPages = Math.ceil(items.length / visibleItems);
        
        // Adjust track items width
        items.forEach(item => {
            item.style.flex = `0 0 ${100 / visibleItems}%`;
        });

        // Regenerate dots
        generateDots();
        
        // Adjust slide position if current page is out of bounds
        if (currentIndex >= totalPages) {
            currentIndex = totalPages - 1;
        }
        moveToSlide(currentIndex);
    };

    const generateDots = () => {
        dotsContainer.innerHTML = '';
        if (totalPages <= 1) {
            dotsContainer.style.display = 'none';
            return;
        } else {
            dotsContainer.style.display = 'flex';
        }

        for (let i = 0; i < totalPages; i++) {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (i === currentIndex) dot.classList.add('active');
            dot.setAttribute('data-slide', i);
            dot.addEventListener('click', () => {
                stopAutoPlay();
                moveToSlide(i);
                startAutoPlay();
            });
            dotsContainer.appendChild(dot);
        }
    };

    const moveToSlide = (index) => {
        currentIndex = index;
        
         // Calculate shift percentage
        let shiftPercent = 0;
        const containerWidth = track.parentElement.offsetWidth;
        let shiftPx = 0;
        
        if (index === totalPages - 1 && items.length % visibleItems !== 0) {
            // Align the last items to the right edge
            const remainder = items.length % visibleItems;
            shiftPercent = (items.length - visibleItems) * (100 / visibleItems);
            const itemWidth = containerWidth / visibleItems;
            shiftPx = (items.length - visibleItems) * itemWidth;
        } else {
            shiftPercent = index * visibleItems * (100 / visibleItems);
            shiftPx = index * containerWidth;
        }
        
        track.style.transform = `translateX(-${shiftPercent}%)`;
        track.style.transform = `translateX(-${shiftPx}px)`;
        
        // Update active dot
        const dots = Array.from(dotsContainer.children);
        dots.forEach((dot, i) => {
            if (i === index) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    };

    // Auto Play
    const startAutoPlay = () => {
        if (totalPages <= 1) return;
        autoPlayInterval = setInterval(() => {
            let nextIndex = currentIndex + 1;
            if (nextIndex >= totalPages) {
                nextIndex = 0;
            }
            moveToSlide(nextIndex);
        }, 5000);
    };

    const stopAutoPlay = () => {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
    };

    // Swipe Support for Touch Devices
    let startX = 0;
    let isSwiping = false;

    track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isSwiping = true;
        stopAutoPlay();
    });

    track.addEventListener('touchmove', (e) => {
        if (!isSwiping) return;
        const currentX = e.touches[0].clientX;
        const diffX = startX - currentX;

        // Minimum swipe distance of 50px
        if (Math.abs(diffX) > 50) {
            if (diffX > 0) {
                // Swipe left -> Next slide
                let nextIndex = currentIndex + 1;
                if (nextIndex < totalPages) {
                    moveToSlide(nextIndex);
                }
            } else {
                // Swipe right -> Prev slide
                let prevIndex = currentIndex - 1;
                if (prevIndex >= 0) {
                    moveToSlide(prevIndex);
                }
            }
            isSwiping = false; // Reset until next touchstart
        }
    });

    track.addEventListener('touchend', () => {
        isSwiping = false;
        startAutoPlay();
    });

    // Event listeners for window resize
    window.addEventListener('resize', calculateCarouselLayout);

    // Initial setup
    calculateCarouselLayout();
    startAutoPlay();

    // ================= STATS COUNTER ANIMATION =================
    const statsGrid = document.querySelector('.stats-grid');
    const counters = document.querySelectorAll('.number-highlight');
    const duration = 2000; // Duration of animation in ms

    const animateCounters = () => {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const start = 0;
            const startTime = performance.now();

            const updateCounter = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function: easeOutQuad
                const easeProgress = progress * (2 - progress);
                
                const currentValue = Math.floor(easeProgress * (target - start) + start);
                counter.textContent = currentValue;

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target; // Ensure exact final value
                }
            };

            requestAnimationFrame(updateCounter);
        });
    };

    if (statsGrid && counters.length > 0) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.unobserve(entry.target); // Trigger only once
                }
            });
        }, {
            threshold: 0.2 // Trigger when 20% of the section is visible
        });

        observer.observe(statsGrid);
    }
});
