/**
 * GeoHub - Core Application Logic (app.js)
 * Implements interactivity, GIS layer simulation, data inspection, and dynamic filtering.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // 1. Navigation & Scroll Indicators
    // ==========================================================================
    const navbar = document.querySelector('.navbar-header');
    const scrollProgress = document.getElementById('scroll-progress');
    const navLinks = document.querySelectorAll('.nav-link');
    const drawerLinks = document.querySelectorAll('.drawer-link');
    const sections = document.querySelectorAll('section');

    // Navbar scroll background change + scroll progress bar
    window.addEventListener('scroll', () => {
        // Toggle glass class
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Calculate scroll progress percentage
        const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
        scrollProgress.style.width = scrolled + '%';
        
        // Scroll spy: Active section link highlight
        let currentSectionId = 'hero';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        // Update Nav Menu Links
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });

        // Update Drawer Links
        drawerLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    // ==========================================================================
    // 2. Mobile Navigation Drawer Controls
    // ==========================================================================
    const menuToggle = document.getElementById('menuToggle');
    const mobileDrawer = document.getElementById('mobileDrawer');
    const drawerClose = document.getElementById('drawerClose');
    const drawerOverlay = document.getElementById('drawerOverlay');

    function openDrawer() {
        mobileDrawer.classList.add('open');
        drawerOverlay.classList.add('show');
        document.body.style.overflow = 'hidden'; // disable background scroll
    }

    function closeDrawer() {
        mobileDrawer.classList.remove('open');
        drawerOverlay.classList.remove('show');
        document.body.style.overflow = 'auto'; // enable background scroll
    }

    if (menuToggle && mobileDrawer && drawerClose && drawerOverlay) {
        menuToggle.addEventListener('click', openDrawer);
        drawerClose.addEventListener('click', closeDrawer);
        drawerOverlay.addEventListener('click', closeDrawer);
        
        // Close drawer on clicking links
        drawerLinks.forEach(link => {
            link.addEventListener('click', closeDrawer);
        });
    }




    // ==========================================================================
    // 4. Client-side Dynamic Filtering (Software Showcase)
    // ==========================================================================
    const softwareFilterBtns = document.querySelectorAll('#softwareFilters .filter-btn');
    const softwareCards = document.querySelectorAll('#softwareGrid .software-card');

    softwareFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active from all btns
            softwareFilterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.dataset.filter;

            softwareCards.forEach(card => {
                // Reset card display first
                card.classList.remove('hidden');

                if (filterValue !== 'all') {
                    const categories = card.dataset.category.split(' ');
                    if (!categories.includes(filterValue)) {
                        card.classList.add('hidden');
                    }
                }
            });
        });
    });

    // ==========================================================================
    // 5. Client-side Dynamic Filtering (Courses)
    // ==========================================================================
    const coursesFilterBtns = document.querySelectorAll('#coursesFilters .filter-btn');
    const courseCards = document.querySelectorAll('#coursesGrid .course-card');

    coursesFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active from all btns
            coursesFilterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.dataset.filter;

            courseCards.forEach(card => {
                // Reset display
                card.classList.remove('hidden');

                if (filterValue !== 'all') {
                    if (card.dataset.level !== filterValue) {
                        card.classList.add('hidden');
                    }
                }
            });
        });
    });

});
