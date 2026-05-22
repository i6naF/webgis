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

    // ==========================================================================
    // 6. Interactive Coordinate Converter Widget
    // ==========================================================================
    const inputLat = document.getElementById('input-lat');
    const inputLng = document.getElementById('input-lng');
    const outputDms = document.getElementById('output-dms');
    const outputMercator = document.getElementById('output-mercator');
    const presetBtns = document.querySelectorAll('.preset-btn');
    const copyBtns = document.querySelectorAll('.copy-btn');

    // Decimal Degrees (DD) to DMS conversion
    function ddToDms(lat, lng) {
        const formatDMS = (val, isLat) => {
            const abs = Math.abs(val);
            const d = Math.floor(abs);
            const m = Math.floor((abs - d) * 60);
            const s = ((abs - d - m / 60) * 3600).toFixed(2);
            
            let dir = "";
            if (isLat) {
                dir = val >= 0 ? "شمالاً (N)" : "جنوباً (S)";
            } else {
                dir = val >= 0 ? "شرقاً (E)" : "غرباً (W)";
            }
            
            return `${d}° ${m}' ${s}" ${dir}`;
        };
        
        return `${formatDMS(lat, true)} | ${formatDMS(lng, false)}`;
    }

    // DD to Web Mercator (EPSG:3857) meters conversion
    function ddToWebMercator(lat, lng) {
        const r = 6378137;
        const maxMerc = 20037508.34;
        
        let x = lng * (Math.PI / 180) * r;
        
        // Clamp latitude to avoid infinity at poles ([-85.05112878, 85.05112878])
        const latClamped = Math.max(-85.05112878, Math.min(85.05112878, lat));
        let y = Math.log(Math.tan((90 + latClamped) * Math.PI / 360)) * r;
        
        // Force coordinates within EPSG:3857 boundaries
        if (x > maxMerc) x = maxMerc;
        if (x < -maxMerc) x = -maxMerc;
        if (y > maxMerc) y = maxMerc;
        if (y < -maxMerc) y = -maxMerc;
        
        return `X: ${x.toFixed(2)} م | Y: ${y.toFixed(2)} م`;
    }

    // Trigger update of converted values
    function updateConversion() {
        if (!inputLat || !inputLng || !outputDms || !outputMercator) return;
        
        let lat = parseFloat(inputLat.value);
        let lng = parseFloat(inputLng.value);
        
        if (isNaN(lat) || isNaN(lng)) {
            outputDms.textContent = "الرجاء إدخال إحداثيات صالحة";
            outputMercator.textContent = "الرجاء إدخال إحداثيات صالحة";
            return;
        }

        // Validate bounds
        if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
            outputDms.textContent = "الإحداثيات خارج الحدود المسموحة";
            outputMercator.textContent = "الإحداثيات خارج الحدود المسموحة";
            return;
        }

        outputDms.textContent = ddToDms(lat, lng);
        outputMercator.textContent = ddToWebMercator(lat, lng);
    }

    if (inputLat && inputLng) {
        inputLat.addEventListener('input', updateConversion);
        inputLng.addEventListener('input', updateConversion);
    }

    // Preset location buttons
    presetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const lat = btn.dataset.lat;
            const lng = btn.dataset.lng;
            if (inputLat && inputLng) {
                inputLat.value = lat;
                inputLng.value = lng;
                updateConversion();
                
                // Add a brief animation pulse to input fields on preset select
                inputLat.classList.add('pulse-highlight');
                inputLng.classList.add('pulse-highlight');
                setTimeout(() => {
                    inputLat.classList.remove('pulse-highlight');
                    inputLng.classList.remove('pulse-highlight');
                }, 600);
            }
        });
    });

    // Copy to Clipboard buttons
    copyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.dataset.target;
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
                const textToCopy = targetEl.textContent;
                navigator.clipboard.writeText(textToCopy).then(() => {
                    btn.classList.add('copied');
                    const span = btn.querySelector('span');
                    const icon = btn.querySelector('i');
                    const originalText = span ? span.textContent : 'نسخ';
                    const originalIconClass = icon ? Array.from(icon.classList) : ['fa-regular', 'fa-copy'];
                    
                    if (span) span.textContent = 'تم النسخ!';
                    if (icon) {
                        icon.className = 'fa-solid fa-check';
                    }
                    
                    setTimeout(() => {
                        btn.classList.remove('copied');
                        if (span) span.textContent = originalText;
                        if (icon) {
                            icon.className = originalIconClass.join(' ');
                        }
                    }, 1500);
                }).catch(err => {
                    console.error('Failed to copy text: ', err);
                });
            }
        });
    });

    // Initial load converter trigger
    updateConversion();

    // ==========================================================================
    // 7. Saudi GIS Universities Interactive Map (Leaflet.js)
    // ==========================================================================
    const mapElement = document.getElementById('leaflet-gis-map');
    if (mapElement && typeof L !== 'undefined') {
        // Initialize Map
        const map = L.map('leaflet-gis-map', {
            center: [23.8859, 45.0792],
            zoom: 5.5,
            zoomSnap: 0.5,
            zoomDelta: 0.5,
            minZoom: 4,
            maxZoom: 12,
            attributionControl: true
        });

        // Add CartoDB Dark Matter tile layer
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 20
        }).addTo(map);

        // Hide map loader once tiles start rendering/loading
        const mapLoader = document.getElementById('mapLoader');
        map.on('tileload', () => {
            if (mapLoader) {
                mapLoader.style.opacity = '0';
                setTimeout(() => {
                    mapLoader.style.display = 'none';
                }, 500);
            }
        });

        // Safe fallback for loader in case of slower connection
        setTimeout(() => {
            if (mapLoader && mapLoader.style.display !== 'none') {
                mapLoader.style.opacity = '0';
                setTimeout(() => {
                    mapLoader.style.display = 'none';
                }, 500);
            }
        }, 3000);

        // Custom Neon Green Pulsing Div Icon
        const customMarkerIcon = L.divIcon({
            className: 'neon-glow-marker',
            html: `
                <div class="marker-pulse-wrapper">
                    <div class="marker-glow-ring"></div>
                    <div class="marker-core"></div>
                </div>
            `,
            iconSize: [20, 20],
            iconAnchor: [10, 10],
            popupAnchor: [0, -10]
        });

        // Dataset of Saudi GIS / Geomatics departments
        const universities = [
            {
                name: "جامعة الملك سعود",
                city: "الرياض",
                coords: [24.7162, 46.6190],
                degrees: "بكالوريوس، ماجستير، دكتوراه",
                dept: "كلية الآداب - قسم الجغرافيا",
                desc: "برنامج رائد يركز على التطبيقات المكانية ونظم المعلومات الجغرافية، مع تغطية شاملة لنظم الاستشعار عن بعد ومسح الأراضي والتحليلات الجغرافية المتقدمة.",
                link: "https://dar.ksu.edu.sa/ar"
            },
            {
                name: "جامعة الملك عبدالعزيز",
                city: "جدة",
                coords: [21.4939, 39.2503],
                degrees: "بكالوريوس، ماجستير",
                dept: "كلية الآداب والعلوم الإنسانية - قسم الجغرافيا والجيوماتكس",
                desc: "يقدم قسماً متخصصاً يدمج بين الجغرافيا والجيوماتكس والمسح البحري والاستشعار عن بعد، لتخريج كوادر متمكنة في التحليل المكاني وإدارة الموارد الجغرافية.",
                link: "https://www.kau.edu.sa"
            },
            {
                name: "جامعة الإمام عبدالرحمن بن فيصل",
                city: "الدمام",
                coords: [26.3927, 50.1983],
                degrees: "بكالوريوس",
                dept: "كلية التصاميم - قسم الجيوماتكس",
                desc: "برنامج تقني وتطبيقي يركز على دراسة الجيوماتكس والمساحة الرقمية واستخدام أحدث التقنيات السحابية ونظم التموضع العالمي GPS لتخطيط وتصميم المدن الذكية.",
                link: "https://www.iau.edu.sa/ar/admissions"
            },
            {
                name: "جامعة طيبة",
                city: "المدينة المنورة",
                coords: [24.4812, 39.5442],
                degrees: "بكالوريوس",
                dept: "كلية الآداب والعلوم الإنسانية - قسم الجغرافيا ونظم المعلومات الجغرافية",
                desc: "يتميز البرنامج بدمج الجغرافيا الطبيعية والبشرية مع نظم التحليل المكاني الحديثة لخدمة التنمية الحضرية في منطقة المدينة المنورة والمشاعر المقدسة.",
                link: "https://www.taibahu.edu.sa/"
            }
        ];

        const panelEmptyState = document.getElementById('panelEmptyState');
        const panelDynamicContent = document.getElementById('panelDynamicContent');
        const panelUniCity = document.getElementById('panelUniCity');
        const panelUniName = document.getElementById('panelUniName');
        const panelUniDegree = document.getElementById('panelUniDegree');
        const panelUniDept = document.getElementById('panelUniDept');
        const panelUniDesc = document.getElementById('panelUniDesc');
        const panelUniLink = document.getElementById('panelUniLink');

        universities.forEach(uni => {
            const marker = L.marker(uni.coords, { icon: customMarkerIcon }).addTo(map);

            // Bind informative popup on hover / click
            const popupContent = `
                <div style="direction: rtl; text-align: right; font-family: system-ui, -apple-system, sans-serif; padding: 4px;">
                    <strong style="color: var(--color-primary); font-size: 0.95rem; display: block; margin-bottom: 2px;">${uni.name}</strong>
                    <span style="color: var(--color-text-muted); font-size: 0.8rem;"><i class="fa-solid fa-location-dot"></i> ${uni.city}</span>
                </div>
            `;
            marker.bindPopup(popupContent, {
                closeButton: false,
                offset: L.point(0, -5)
            });

            // Update details panel on click
            marker.on('click', () => {
                if (panelEmptyState && panelDynamicContent) {
                    panelEmptyState.classList.add('hidden');
                    panelDynamicContent.classList.remove('hidden');

                    if (panelUniCity) panelUniCity.textContent = uni.city;
                    if (panelUniName) panelUniName.textContent = uni.name;
                    if (panelUniDegree) panelUniDegree.textContent = uni.degrees;
                    if (panelUniDept) panelUniDept.textContent = uni.dept;
                    if (panelUniDesc) panelUniDesc.textContent = uni.desc;
                    if (panelUniLink) {
                        panelUniLink.href = uni.link;
                    }
                }
            });
        });
    }

    // ==========================================================================
    // 8. Rookie GIS Mistakes Accordion (Mutually Exclusive Polyfill)
    // ==========================================================================
    const detailsElements = document.querySelectorAll('.mistake-disclosure');
    detailsElements.forEach(targetDetail => {
        targetDetail.addEventListener('toggle', () => {
            if (targetDetail.open) {
                detailsElements.forEach(detail => {
                    if (detail !== targetDetail && detail.open) {
                        detail.open = false;
                    }
                });
            }
        });
    });

});
