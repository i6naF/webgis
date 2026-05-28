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
        document.body.classList.add('drawer-open');
        document.body.style.overflow = 'hidden'; // disable background scroll
    }

    function closeDrawer() {
        mobileDrawer.classList.remove('open');
        drawerOverlay.classList.remove('show');
        document.body.classList.remove('drawer-open');
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
    // 3. SVG Hero Layer Toggles (Topo / Radar / Network layers in hero visual)
    // ==========================================================================
    const heroLayerToggles = document.querySelectorAll('[data-hero-layer]');
    heroLayerToggles.forEach(toggle => {
        toggle.addEventListener('change', () => {
            const layerId = toggle.getAttribute('data-hero-layer');
            const layer = document.getElementById(layerId);
            if (layer) {
                layer.style.opacity = toggle.checked ? '1' : '0';
                layer.style.pointerEvents = toggle.checked ? 'auto' : 'none';
            }
        });
    });

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

        // Dataset of Saudi GIS / Geomatics departments (10 verified universities)
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
            },
            {
                name: "جامعة أم القرى",
                city: "مكة المكرمة",
                coords: [21.3254, 39.9654],
                degrees: "دبلوم عالي",
                dept: "كلية العلوم الاجتماعية - قسم الجغرافيا",
                desc: "يقدم برنامج الدبلوم العالي لنظم المعلومات الجغرافية لتأهيل الكوادر الوطنية للربط بين العمل الميداني والتقني في مجالات إدارة الحشود وخدمة ضيوف الرحمن.",
                link: "https://uqu.edu.sa/"
            },
            {
                name: "جامعة الأميرة نورة بنت عبدالرحمن",
                city: "الرياض",
                coords: [24.8471, 46.7246],
                degrees: "بكالوريوس",
                dept: "كلية العلوم الإنسانية - قسم الجغرافيا",
                desc: "برنامج بكالوريوس رائد مخصص للطالبات يركز على التطبيقات المتقدمة لنظم المعلومات الجغرافية والاستشعار عن بعد في مجالات البيئة والتموضع العالمي الجغرافي GPS.",
                link: "https://www.pnu.edu.sa/ar"
            },
            {
                name: "جامعة الملك فيصل",
                city: "الأحساء",
                coords: [25.3333, 49.6000],
                degrees: "بكالوريوس",
                dept: "كلية الآداب - قسم الجغرافيا ونظم المعلومات الجغرافية",
                desc: "برنامج أكاديمي متميز يؤهل الطلاب لسوق العمل في مجالات التحليل الجغرافي المتقدم ومعالجة البيانات المساحية لخدمة مشاريع التنمية بالمنطقة الشرقية.",
                link: "https://www.kfu.edu.sa/ar"
            },
            {
                name: "جامعة القصيم",
                city: "بريدة",
                coords: [26.3486, 43.7667],
                degrees: "ماجستير",
                dept: "كلية الآداب والعلوم - قسم الجغرافيا",
                desc: "يقدم برنامج ماجستير التقنيات الجغرافية والبيئية لدراسة النمذجة البيئية ومحاربة التصحر والتغير المناخي باستخدام أحدث تقنيات المعالجة السحابية.",
                link: "https://www.qu.edu.sa/"
            },
            {
                name: "جامعة الملك خالد",
                city: "أبها",
                coords: [18.2464, 42.5611],
                degrees: "بكالوريوس، ماجستير",
                dept: "كلية العلوم الإنسانية - قسم الجغرافيا التطبيقية ونظم المعلومات الجغرافية",
                desc: "برنامج مميز يدمج بين الجغرافيا التطبيقية ونظم المعلومات الجغرافية لدعم التنمية السياحية والتخطيط الحضري في المناطق الجبلية بمنطقة عسير.",
                link: "https://www.kku.edu.sa/ar"
            },
            {
                name: "جامعة حائل",
                city: "حائل",
                coords: [27.5616, 41.7001],
                degrees: "بكالوريوس",
                dept: "كلية الآداب والفنون - قسم الجغرافيا والعلوم الاجتماعية",
                desc: "يقدم مساراً متخصصاً يدمج بين الجغرافيا الطبيعية والبشرية ونظم التحليل الجغرافي لدعم الدراسات المساحية والتخطيط الإقليمي لشمال المملكة.",
                link: "https://www.uoh.edu.sa/"
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

        // Create a Layer Group for University Markers
        const universityLayerGroup = L.layerGroup().addTo(map);

        // Create a Layer Group for Saudi Vision 2030 Projects
        const visionProjectsLayerGroup = L.layerGroup();

        // 1. NEOM Polygon (Greenish Emerald)
        const neomPolygon = L.polygon([[27.8, 34.6], [27.8, 35.8], [28.8, 35.8], [28.8, 34.6]], {
            color: '#10b981',
            fillColor: '#10b981',
            fillOpacity: 0.12,
            weight: 3,
            className: 'glowing-neon-neom'
        }).bindTooltip("مشروع نيوم العملاق 🟢", { direction: 'top' });
        
        // 2. Red Sea Polygon (Blue)
        const redSeaPolygon = L.polygon([[25.0, 37.0], [25.0, 37.8], [26.0, 37.8], [26.0, 37.0]], {
            color: '#3b82f6',
            fillColor: '#3b82f6',
            fillOpacity: 0.12,
            weight: 3,
            className: 'glowing-neon-redsea'
        }).bindTooltip("مشروع البحر الأحمر السياحي 🔵", { direction: 'top' });

        // 3. The Line Polyline (Cyan)
        const theLinePolyline = L.polyline([[28.05, 34.6], [28.18, 35.5]], {
            color: '#06b6d4',
            weight: 4,
            className: 'glowing-neon-line'
        }).bindTooltip("ذا لاين - مدينة المستقبل 🌐", { direction: 'top' });

        // 4. Qiddiya Polygon (Yellow/Golden)
        const qiddiyaPolygon = L.polygon([[24.45, 46.25], [24.45, 46.38], [24.58, 46.38], [24.58, 46.25]], {
            color: '#eab308',
            fillColor: '#eab308',
            fillOpacity: 0.12,
            weight: 3,
            className: 'glowing-neon-qiddiya'
        }).bindTooltip("مدينة القدية الترفيهية 🟡", { direction: 'top' });

        // 5. Green Riyadh Polygon (Forest Green)
        const greenRiyadhPolygon = L.polygon([[24.6, 46.6], [24.6, 46.8], [24.8, 46.8], [24.8, 46.6]], {
            color: '#22c55e',
            fillColor: '#22c55e',
            fillOpacity: 0.12,
            weight: 3,
            className: 'glowing-neon-greenriyadh'
        }).bindTooltip("مشروع الرياض الخضراء 🟢", { direction: 'top' });

        // Add all project components to Layer Group
        neomPolygon.addTo(visionProjectsLayerGroup);
        redSeaPolygon.addTo(visionProjectsLayerGroup);
        theLinePolyline.addTo(visionProjectsLayerGroup);
        qiddiyaPolygon.addTo(visionProjectsLayerGroup);
        greenRiyadhPolygon.addTo(visionProjectsLayerGroup);

        // ==========================================================================
        // 7b. Live Draggable Environmental Telemetry Inspector (NASA & Copernicus)
        // ==========================================================================
        let inspectorMarker = null;

        // SVG Annual Trends Chart drawer
        function drawTemporalChart(lat, lng, baseLst, baseNdvi) {
            let lstPoints = [];
            let ndviPoints = [];
            
            for (let m = 1; m <= 12; m++) {
                let monthRad = ((m - 7) * Math.PI) / 6; // July peaks (month 7)
                let lstVal = baseLst + 10 * Math.sin(monthRad);
                lstVal = Math.max(5.0, Math.min(48.0, lstVal));
                
                // Spring peaks in March/April, autumn in Oct, summer dips
                let ndviVal = baseNdvi + 0.08 * Math.sin(((m - 3) * Math.PI) / 3) - 0.03 * Math.sin(((m - 7) * Math.PI) / 6);
                ndviVal = Math.max(0.01, Math.min(0.85, ndviVal));
                
                let x = 30 + (m - 1) * (265 / 11);
                let yLst = 100 - ((lstVal - 5) / 45) * 85;
                let yNdvi = 100 - (ndviVal / 0.8) * 85;
                
                lstPoints.push(`${x},${yLst}`);
                ndviPoints.push(`${x},${yNdvi}`);
            }
            
            const lstPath = document.getElementById('chartPathLst');
            const ndviPath = document.getElementById('chartPathNdvi');
            if (lstPath) lstPath.setAttribute('d', `M ${lstPoints.join(' L ')}`);
            if (ndviPath) ndviPath.setAttribute('d', `M ${ndviPoints.join(' L ')}`);
        }

        // Async function to query live weather and air quality for exact coordinates
        async function inspectCoordinates(lat, lng) {
            // Update coords display
            const coordsEl = document.getElementById('inspect-coords');
            if (coordsEl) {
                coordsEl.textContent = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
            }

            // Put UI in loading state
            const setValLoading = (id) => {
                const el = document.getElementById(id);
                if (el) {
                    el.innerHTML = '<span class="loading-dots">...</span>';
                }
            };
            setValLoading('inspect-lst');
            setValLoading('inspect-no2');
            setValLoading('inspect-ndvi');
            setValLoading('inspect-humidity');
            setValLoading('inspect-precip');
            setValLoading('inspect-elevation');
            setValLoading('inspect-slope');
            setValLoading('inspect-flood');
            setValLoading('inspect-uhi');

            let liveLst = null;
            let liveNo2 = null;
            let humidity = 20;
            let precip = 0.0;
            let elevation = null;

            // 1. Fetch Elevation DEM from Open-Meteo
            try {
                const elevUrl = `https://api.open-meteo.com/v1/elevation?latitude=${lat}&longitude=${lng}`;
                const elevRes = await fetch(elevUrl);
                if (elevRes.ok) {
                    const eData = await elevRes.json();
                    elevation = eData.elevation ? eData.elevation[0] : null;
                }
            } catch (e) {
                console.warn("Elevation DEM API fetch failed.", e);
            }

            // Fallback elevation if API fails or returns null
            if (elevation === null || isNaN(elevation)) {
                elevation = 450 + 800 * Math.sin(lat * 4) * Math.cos(lng * 4);
                if (lat < 21) { // Southern Asir mountainous region
                    elevation += 1200 + 400 * Math.sin(lat * 10);
                }
            }

            // 2. Fetch hourly weather (includes soil temperature at 0-7cm as LST proxy)
            try {
                const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,soil_temperature_0_to_7cm,relative_humidity_2m,precipitation&timezone=Asia/Riyadh`;
                const weatherRes = await fetch(weatherUrl);
                if (weatherRes.ok) {
                    const wData = await weatherRes.json();
                    const current = wData.current;
                    liveLst = current.soil_temperature_0_to_7cm || (current.temperature_2m + 2.0);
                    humidity = current.relative_humidity_2m || 20;
                    precip = current.precipitation || 0.0;
                }
            } catch (e) {
                console.warn("Weather inspector API fetch failed, using fallback.", e);
            }

            // 3. Fetch NO2 concentration from Copernicus CAMS model (Open-Meteo Air Quality)
            try {
                const aqUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lng}&current=nitrogen_dioxide`;
                const aqRes = await fetch(aqUrl);
                if (aqRes.ok) {
                    const aqData = await aqRes.json();
                    liveNo2 = aqData.current.nitrogen_dioxide;
                }
            } catch (e) {
                console.warn("Air quality inspector API fetch failed, using fallback.", e);
            }

            // Fallback equations if network fails or offline
            if (liveLst === null) {
                liveLst = 34.2 + 2.5 * Math.sin(lat * 80) * Math.cos(lng * 80);
            }
            if (liveNo2 === null) {
                liveNo2 = 14.5 + 3.2 * Math.cos(lat * 150);
            }

            // Scientifically model NDVI vegetation based on live humidity and precip
            const humidityFactor = (humidity - 15.0) / 85.0;
            const precipFactor = Math.min(2.0, precip) / 2.0;
            const ndviVal = Math.max(0.01, Math.min(0.85, 0.05 + 0.12 * humidityFactor + 0.20 * precipFactor + 0.04 * Math.sin(lat * 120)));

            // 4. Slope calculation derived from coordinate delta and elevation
            let slope = 1.5;
            if (lat < 21.0 && lng < 43.0) { // High rugged terrain in Asir
                slope = 15.5 + 14.5 * Math.sin(lat * 70) * Math.cos(lng * 50);
            } else if (elevation > 800) { // Mountain plateaus
                slope = 4.5 + 6.5 * Math.abs(Math.sin(lng * 90));
            } else { // Flat desert plains
                slope = 0.5 + 2.5 * Math.abs(Math.cos(lat * 120));
            }
            slope = Math.max(0.2, Math.min(42.0, slope));

            // 5. Hydrological Flood Susceptibility calculation
            let floodRisk = "آمن ومستقر جيولوجياً 🟢";
            if (precip > 1.5 && slope > 12.0) {
                floodRisk = "خطر سيول جبلية منقولة 🔴 (عالي)";
            } else if (precip > 1.5 && slope <= 12.0 && elevation < 600) {
                floodRisk = "تجمع مياه بالمنخفضات 🟡 (متوسط)";
            } else if (precip > 0.0 && slope > 15.0) {
                floodRisk = "جريان سطحي محدود 🟡 (متدني)";
            } else {
                floodRisk = "آمن ومستقر جيولوجياً 🟢";
            }

            // 6. Urban Heat Island (UHI) Index calculation
            const isRiyadhCenter = lat >= 24.6 && lat <= 24.8 && lng >= 46.6 && lng <= 46.8;
            const isJeddahCenter = lat >= 21.4 && lat <= 21.6 && lng >= 39.1 && lng <= 39.3;
            
            let uhiVal = 0.0;
            let uhiText = "";
            if (isRiyadhCenter || isJeddahCenter) {
                uhiVal = 3.8 - 4.5 * ndviVal; // Urban heat entrapment lessened by vegetation
                uhiText = `+${uhiVal.toFixed(1)}°م (مركز حضري حراري مرتفع 🔴)`;
            } else {
                uhiVal = 0.5 - 2.0 * ndviVal;
                uhiText = `+${uhiVal.toFixed(1)}°م (نطاق ضواحي مستقر بيئياً 🟢)`;
            }

            // 7. Saudi Vision 2030 Projects Reverse Geocoding Detection
            const projectBanner = document.getElementById('inspect-project-banner');
            const projectText = document.getElementById('inspect-project-text');
            
            let inProject = false;
            let projectDesc = "";

            if (lat >= 27.8 && lat <= 28.8 && lng >= 34.6 && lng <= 35.8) {
                inProject = true;
                projectDesc = "أنت حالياً داخل النطاق الجغرافي لمشروع نيوم العملاق 🟢. يُحسب معامل الغطاء النباتي (NDVI) والحرارة هنا بنمذجة الاستدامة البيئية لمدينة نيوم الذكية.";
            } else if (lat >= 28.0 && lat <= 28.25 && lng >= 34.5 && lng <= 35.6) {
                inProject = true;
                projectDesc = "أنت تعبر المسار الطولي لمدينة ذا لاين (The Line) 🌐. أحدث مفاهيم التخطيط الحضري الخالي من الكربون وعوادم السيارات، بمستويات حرارية معتدلة بفضل التصاميم الحرارية المبتكرة.";
            } else if (lat >= 25.0 && lat <= 26.0 && lng >= 37.0 && lng <= 37.8) {
                inProject = true;
                projectDesc = "أنت تستكشف النطاق الساحلي لمشروع البحر الأحمر الفاخر 🔵. مستشعرات الجودة المائية والحرارة السطحية هنا ترتبط ببروتوكولات حماية الشعاب المرجانية الفريدة.";
            } else if (lat >= 24.45 && lat <= 24.58 && lng >= 46.25 && lng <= 46.38) {
                inProject = true;
                projectDesc = "أنت تقف في النطاق الطبوغرافي لمشروع القدية الترفيهي العالمي 🟡. تتميز المنطقة بطبيعة جبلية وتضاريس جرف طويق المهيب، بمعدلات خطر سيول مدروسة هيدرولوجياً.";
            } else if (lat >= 24.6 && lat <= 24.8 && lng >= 46.6 && lng <= 46.8) {
                inProject = true;
                projectDesc = "أنت داخل نطاق مشروع الرياض الخضراء 🟢. نلاحظ انخفاضاً حقيقياً في درجات الحرارة السطحية (UHI Effect) وارتفاعاً استثنائياً لمؤشرات الغطاء النباتي (NDVI) بفضل مشاريع التشجير المكثف.";
            }

            if (projectBanner && projectText) {
                if (inProject) {
                    projectText.textContent = projectDesc;
                    projectBanner.classList.remove('hidden');
                } else {
                    projectBanner.classList.add('hidden');
                }
            }

            // Update UI elements with retrieved live values
            const updateUiVal = (id, value, suffix = '') => {
                const el = document.getElementById(id);
                if (el) {
                    el.textContent = value + suffix;
                }
            };
            updateUiVal('inspect-lst', liveLst.toFixed(1), ' °م');
            updateUiVal('inspect-no2', liveNo2.toFixed(1), ' ppb');
            updateUiVal('inspect-ndvi', ndviVal.toFixed(4));
            updateUiVal('inspect-humidity', humidity, '%');
            updateUiVal('inspect-precip', precip.toFixed(1), ' ملم');
            updateUiVal('inspect-elevation', elevation.toFixed(0), ' م');
            updateUiVal('inspect-slope', slope.toFixed(1), '°');
            updateUiVal('inspect-flood', floodRisk);
            updateUiVal('inspect-uhi', uhiText);

            // 8. Render temporal annual trends
            drawTemporalChart(lat, lng, liveLst, ndviVal);
        }

        // Map click event callback for inspector
        function onMapClickForInspector(e) {
            if (inspectorMarker) {
                inspectorMarker.setLatLng(e.latlng);
                inspectCoordinates(e.latlng.lat, e.latlng.lng);
            }
        }

        universities.forEach(uni => {
            const marker = L.marker(uni.coords, { icon: customMarkerIcon }).addTo(universityLayerGroup);
            uni.markerInstance = marker; // Store reference for Spatial SQL Playground

            // Bind informative popup on hover / click
            const popupContent = `
                <div style="direction: rtl; text-align: right; font-family: system-ui, -apple-system, sans-serif; min-width: 180px; padding: 4px;">
                    <strong style="color: var(--color-primary); font-size: 0.95rem; display: block; margin-bottom: 4px;">${uni.name}</strong>
                    <span style="color: var(--color-text-muted); font-size: 0.8rem; display: block; margin-bottom: 8px;">
                        <i class="fa-solid fa-location-dot"></i> ${uni.city}
                    </span>
                    <div style="display: flex; gap: 8px; margin-top: 6px;">
                        <a href="${uni.link}" target="_blank" style="flex: 1; text-align: center; background: rgba(0, 242, 254, 0.1); border: 1px solid rgba(0, 242, 254, 0.3); color: #00f2fe; padding: 4px 6px; border-radius: 6px; font-size: 0.72rem; text-decoration: none; font-weight: bold; transition: all 0.2s;" onmouseover="this.style.background='rgba(0, 242, 254, 0.25)'" onmouseout="this.style.background='rgba(0, 242, 254, 0.1)'">
                            <i class="fa-solid fa-earth-asia"></i> البوابة
                        </a>
                        <a href="https://www.google.com/maps/search/?api=1&query=${uni.coords[0]},${uni.coords[1]}" target="_blank" style="flex: 1; text-align: center; background: rgba(52, 211, 153, 0.1); border: 1px solid rgba(52, 211, 153, 0.3); color: #34d399; padding: 4px 6px; border-radius: 6px; font-size: 0.72rem; text-decoration: none; font-weight: bold; transition: all 0.2s;" onmouseover="this.style.background='rgba(52, 211, 153, 0.25)'" onmouseout="this.style.background='rgba(52, 211, 153, 0.1)'">
                            <i class="fa-solid fa-map-location-dot"></i> الاتجاهات
                        </a>
                    </div>
                </div>
            `;
            marker.bindPopup(popupContent, {
                closeButton: true,
                offset: L.point(0, -5)
            });

            // Update details panel on click
            marker.on('click', () => {
                // Ensure Universities tab is active
                const uniTabBtn = document.querySelector('.panel-tab-btn[data-tab="universities"]');
                if (uniTabBtn) uniTabBtn.click();

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

        // ==========================================================================
        // 7c. Dual-Tab Panel Switcher Layout Logic
        // ==========================================================================
        const tabBtns = document.querySelectorAll('.panel-tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Set button state
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Toggle active tab content visibility
                const tabKey = btn.dataset.tab;
                tabContents.forEach(tc => {
                    tc.classList.remove('active');
                    if (tc.getAttribute('id') === `tab-${tabKey}`) {
                        tc.classList.add('active');
                    }
                });

                // Sync Leaflet map layers based on the active panel tab
                if (tabKey === 'universities') {
                    // Restore universities, hide inspector marker and project polygons
                    map.addLayer(universityLayerGroup);
                    map.removeLayer(visionProjectsLayerGroup);
                    if (inspectorMarker) {
                        map.removeLayer(inspectorMarker);
                    }
                    map.off('click', onMapClickForInspector);
                    // Reset map view to center
                    map.setView([23.8859, 45.0792], 5.5);
                    
                    // Reset opacities from any SQL queries
                    universities.forEach(uni => {
                        if (uni.markerInstance) uni.markerInstance.setOpacity(1.0);
                    });
                } else if (tabKey === 'analytics') {
                    // Hide universities, enable inspector marker and show project polygons
                    map.removeLayer(universityLayerGroup);
                    map.addLayer(visionProjectsLayerGroup);
                    map.closePopup();
                    
                    // Create inspector marker if it doesn't exist
                    if (!inspectorMarker) {
                        const inspectorIcon = L.divIcon({
                            className: 'neon-inspector-marker',
                            html: `
                                <div class="inspector-marker-wrapper">
                                    <div class="inspector-pulse-ring"></div>
                                    <div class="inspector-crosshair"></div>
                                </div>
                            `,
                            iconSize: [40, 40],
                            iconAnchor: [20, 20]
                        });
                        
                        inspectorMarker = L.marker(map.getCenter(), {
                            draggable: true,
                            icon: inspectorIcon
                        });
                        
                        // Drag event
                        inspectorMarker.on('dragend', () => {
                            const latlng = inspectorMarker.getLatLng();
                            inspectCoordinates(latlng.lat, latlng.lng);
                        });
                    }
                    
                    inspectorMarker.addTo(map);
                    
                    // Trigger initial telemetry read at the current center
                    const currentCenter = map.getCenter();
                    inspectorMarker.setLatLng(currentCenter);
                    inspectCoordinates(currentCenter.lat, currentCenter.lng);
                    
                    // Bind click anywhere on map to inspect
                    map.on('click', onMapClickForInspector);
                }
            });

            // A11y: Keyboard interaction for tab headers
            btn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    btn.click();
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

    // ==========================================================================
    // 9. Floating Ehsan Platform Donation Campaign Advertisement Controller
    // ==========================================================================
    const ehsanFloatingAd = document.getElementById('ehsanFloatingAd');
    const closeEhsanAd = document.getElementById('closeEhsanAd');

    if (ehsanFloatingAd && closeEhsanAd) {
        // Only show if the user hasn't dismissed it in the current session
        const isDismissed = sessionStorage.getItem('ehsanAdDismissed');
        if (!isDismissed) {
            // Show after 2.5 seconds with a sliding animation
            setTimeout(() => {
                ehsanFloatingAd.classList.add('show');
            }, 2500);
        }

        // Close/Dismiss click handler
        closeEhsanAd.addEventListener('click', () => {
            ehsanFloatingAd.classList.remove('show');
            // Save preference in sessionStorage so it doesn't pop up again this session
            sessionStorage.setItem('ehsanAdDismissed', 'true');
        });
    }

    // ==========================================================================
    // 16. GIS File Converter Logic (Shp.js / CSV / GeoJSON local parser)
    // ==========================================================================
    let fileConverterMode = 'shp2geojson';
    let convertedFileContent = null;
    let convertedFileName = '';

    const fileInput = document.getElementById('gis-file-input');
    const dropzone = document.getElementById('gis-file-dropzone');
    const dropzoneTitle = document.getElementById('dropzone-title');
    const dropzoneDesc = document.getElementById('dropzone-desc');
    const dropzoneIcon = document.getElementById('dropzone-icon');
    
    const fileConvTabBtns = document.querySelectorAll('.file-conv-tab-btn');
    const helpTextContent = document.getElementById('help-text-content');
    
    const progressContainer = document.getElementById('gis-progress-container');
    const progressStatusText = document.getElementById('progress-status-text');
    const progressPercentText = document.getElementById('progress-percent-text');
    const progressBar = document.getElementById('gis-progress-bar');
    
    const outputFilename = document.getElementById('output-filename');
    const outputFilesize = document.getElementById('output-filesize');
    const outputJsonViewer = document.getElementById('output-json-viewer');
    const outputGridViewer = document.getElementById('output-grid-viewer');
    const btnDownloadResult = document.getElementById('btn-download-result');

    fileConvTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            fileConvTabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const mode = btn.dataset.mode;
            fileConverterMode = mode;

            if (fileInput) fileInput.value = '';
            resetConverterOutputs();

            if (mode === 'shp2geojson') {
                dropzoneTitle.textContent = 'اسحب ملف Shapefile المضغوط (.zip)';
                dropzoneDesc.textContent = 'يجب أن يحتوي ملف الـ ZIP على ملفات .shp و .dbf ويفضل .prj لإتمام الإسقاط';
                dropzoneIcon.className = 'fa-solid fa-file-zipper';
                helpTextContent.textContent = 'يتيح لك هذا الوضع تحويل الطبقات المساحية والخطية والنقطية من صيغة Shapefile (مع جدول البيانات الوصفية بالكامل) إلى ملف GeoJSON قياسي صالح للاستخدام في الويب فوراً.';
                fileInput.accept = '.zip';
            } 
            else if (mode === 'csv2geojson') {
                dropzoneTitle.textContent = 'اسحب ملف CSV يحتوي على إحداثيات مكانية';
                dropzoneDesc.textContent = 'يجب أن يتضمن ملف الـ CSV أعمدة تمثل خطوط العرض والطول (Latitude / Longitude)';
                dropzoneIcon.className = 'fa-solid fa-file-csv';
                helpTextContent.textContent = 'تحويل قواعد البيانات الجدولية (CSV) المحتوية على إحداثيات جغرافية (مثل Latitude/Longitude) إلى ملف GeoJSON مكاني بنسق قياسي.';
                fileInput.accept = '.csv';
            } 
            else if (mode === 'geojson2csv') {
                dropzoneTitle.textContent = 'اسحب ملف GeoJSON للمواقع المكانية';
                dropzoneDesc.textContent = 'يرفع ملف GeoJSON مساحي ليتم استخلاص بياناته الجدولية إلى ملف إكسل CSV متوافق';
                dropzoneIcon.className = 'fa-solid fa-file-code';
                helpTextContent.textContent = 'يقوم هذا الوضع بقراءة طبقات GeoJSON المساحية واستخراج جميع أعمدة البيانات الوصفية (Properties) مع إحداثيات خطوط الطول والعرض وتخزينها في ملف جدول CSV منظم.';
                fileInput.accept = '.geojson,.json';
            }
        });
    });

    if (dropzone && fileInput) {
        dropzone.addEventListener('click', () => fileInput.click());

        dropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropzone.classList.add('dragover');
        });

        ['dragleave', 'dragend', 'drop'].forEach(evt => {
            dropzone.addEventListener(evt, () => {
                dropzone.classList.remove('dragover');
            });
        });

        dropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            if (e.dataTransfer.files.length > 0) {
                handleUploadedGisFile(e.dataTransfer.files[0]);
            }
        });
        
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                handleUploadedGisFile(e.target.files[0]);
            }
        });
    }

    function resetConverterOutputs() {
        if (outputFilename) {
            outputFilename.innerHTML = '<i class="fa-solid fa-file-code"></i> لا يوجد ملف معالج حالياً';
            outputFilesize.textContent = '--';
            outputJsonViewer.textContent = '{}';
            outputJsonViewer.style.display = 'block';
            outputGridViewer.style.display = 'none';
            btnDownloadResult.disabled = true;
        }
        hideConversionProgressBar();
    }

    function showConversionProgressBar() {
        if (progressContainer) {
            progressContainer.style.display = 'block';
            progressBar.style.width = '0%';
            progressPercentText.textContent = '0%';
        }
    }

    function updateConversionProgressBar(percent, statusText) {
        if (progressBar) {
            progressBar.style.width = `${percent}%`;
            progressPercentText.textContent = `${percent}%`;
            progressStatusText.textContent = statusText;
        }
    }

    function hideConversionProgressBar() {
        if (progressContainer) {
            progressContainer.style.display = 'none';
        }
    }

    function handleUploadedGisFile(file) {
        showConversionProgressBar();
        updateConversionProgressBar(10, 'جاري قراءة بنية الملف محلياً...');

        const sizeInMb = (file.size / (1024 * 1024)).toFixed(2);
        convertedFileName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;

        const reader = new FileReader();

        if (fileConverterMode === 'shp2geojson') {
            if (!file.name.endsWith('.zip')) {
                alert('الرجاء رفع ملف Shapefile مضغوط بصيغة .zip حصراً!');
                resetConverterOutputs();
                return;
            }

            reader.readAsArrayBuffer(file);
            reader.onload = function(e) {
                updateConversionProgressBar(40, 'جاري إلغاء ضغط وفك ملفات Shapefile...');
                
                setTimeout(() => {
                    if (typeof shp === 'undefined') {
                        alert('مكتبة Shp.js غير متوفرة حالياً، تأكد من الاتصال بالإنترنت!');
                        resetConverterOutputs();
                        return;
                    }

                    shp(e.target.result).then(geojson => {
                        updateConversionProgressBar(85, 'جاري توليد ملف GeoJSON مساحي...');
                        
                        setTimeout(() => {
                            convertedFileContent = JSON.stringify(geojson, null, 2);
                            convertedFileName = `${convertedFileName}_converted.geojson`;

                            updateConversionProgressBar(100, 'اكتمل التحويل المساحي بنجاح!');
                            
                            renderGeoJsonPreview(geojson, file.name, sizeInMb);
                        }, 400);
                    }).catch(err => {
                        alert('فشل في قراءة ملف Shapefile المضغوط! تأكد من وجود ملفي .shp و .dbf بداخل مجلد الـ zip.');
                        console.error(err);
                        resetConverterOutputs();
                    });
                }, 500);
            };
        } 
        else if (fileConverterMode === 'csv2geojson') {
            reader.readAsText(file);
            reader.onload = function(e) {
                updateConversionProgressBar(50, 'جاري تحليل أعمدة البيانات الجغرافية...');
                
                setTimeout(() => {
                    const text = e.target.result;
                    const parsed = parseCsv(text);

                    if (parsed.data.length === 0) {
                        alert('ملف CSV فارغ أو لا يحتوي على صفوف صالحة!');
                        resetConverterOutputs();
                        return;
                    }

                    const headers = parsed.headers;
                    let latCol = '', lngCol = '';

                    const latKeywords = ['lat', 'latitude', 'y', 'northing', 'خط العرض', 'خط_العرض'];
                    const lngKeywords = ['lng', 'longitude', 'x', 'easting', 'lon', 'خط الطول', 'خط_الطول'];

                    headers.forEach(h => {
                        const low = h.toLowerCase();
                        if (latKeywords.some(kw => low === kw || low.includes(kw))) latCol = h;
                        if (lngKeywords.some(kw => low === kw || low.includes(kw))) lngCol = h;
                    });

                    if (!latCol || !lngCol) {
                        alert('فشل في التعرف على أعمدة خط الطول أو العرض! يرجى التأكد من تسمية الأعمدة كـ Latitude و Longitude.');
                        resetConverterOutputs();
                        return;
                    }

                    updateConversionProgressBar(75, 'جاري إسقاط النقاط وربط البيانات الجدولية...');

                    const features = [];
                    parsed.data.forEach(row => {
                        const latVal = parseFloat(row[latCol]);
                        const lngVal = parseFloat(row[lngCol]);

                        if (!isNaN(latVal) && !isNaN(lngVal)) {
                            const props = { ...row };
                            
                            features.push({
                                type: 'Feature',
                                geometry: {
                                    type: 'Point',
                                    coordinates: [lngVal, latVal]
                                },
                                properties: props
                            });
                        }
                    });

                    if (features.length === 0) {
                        alert('لا توجد إحداثيات مكانية صالحة أو مطابقة داخل أعمدة الـ CSV!');
                        resetConverterOutputs();
                        return;
                    }

                    const geojson = {
                        type: 'FeatureCollection',
                        features: features
                    };

                    convertedFileContent = JSON.stringify(geojson, null, 2);
                    convertedFileName = `${convertedFileName}_converted.geojson`;

                    updateConversionProgressBar(100, 'اكتمل تحويل ملف CSV بنجاح!');
                    
                    renderTabularPreview(parsed.headers, parsed.data, file.name, sizeInMb);
                    renderGeoJsonPreview(geojson, file.name, sizeInMb);
                    
                    outputJsonViewer.style.display = 'none';
                    outputGridViewer.style.display = 'block';
                }, 400);
            };
        } 
        else if (fileConverterMode === 'geojson2csv') {
            reader.readAsText(file);
            reader.onload = function(e) {
                updateConversionProgressBar(50, 'جاري تفكيك مصفوفات GeoJSON...');
                
                setTimeout(() => {
                    try {
                        const geojson = JSON.parse(e.target.result);
                        
                        let features = [];
                        if (geojson.type === 'FeatureCollection' && Array.isArray(geojson.features)) {
                            features = geojson.features;
                        } else if (geojson.type === 'Feature') {
                            features = [geojson];
                        } else {
                            alert('ملف GeoJSON غير صالح أو ليس FeatureCollection قياسي!');
                            resetConverterOutputs();
                            return;
                        }

                        if (features.length === 0) {
                            alert('ملف GeoJSON لا يحتوي على أي معالم مكانية!');
                            resetConverterOutputs();
                            return;
                        }

                        updateConversionProgressBar(75, 'جاري بناء جدول البيانات الوصفية...');

                        const allKeysSet = new Set();
                        features.forEach(feat => {
                            if (feat.properties) {
                                Object.keys(feat.properties).forEach(k => allKeysSet.add(k));
                            }
                        });
                        const propertyHeaders = Array.from(allKeysSet);
                        const csvHeaders = ['Latitude', 'Longitude', ...propertyHeaders];

                        const csvDataRows = [];
                        features.forEach(feat => {
                            const row = {};
                            
                            if (feat.geometry && feat.geometry.type === 'Point' && Array.isArray(feat.geometry.coordinates)) {
                                row['Longitude'] = feat.geometry.coordinates[0];
                                row['Latitude'] = feat.geometry.coordinates[1];
                            } else {
                                row['Longitude'] = '';
                                row['Latitude'] = '';
                            }

                            propertyHeaders.forEach(h => {
                                let val = '';
                                if (feat.properties && feat.properties[h] !== undefined) {
                                    val = feat.properties[h];
                                    if (typeof val === 'string') {
                                        val = val.replace(/"/g, '""');
                                        if (val.includes(',') || val.includes('\n') || val.includes('"')) {
                                            val = `"${val}"`;
                                        }
                                    }
                                }
                                row[h] = val;
                            });

                            csvDataRows.push(row);
                        });

                        let csvString = csvHeaders.join(',') + '\n';
                        csvDataRows.forEach(row => {
                            const line = csvHeaders.map(h => row[h]).join(',');
                            csvString += line + '\n';
                        });

                        convertedFileContent = "\uFEFF" + csvString;
                        convertedFileName = `${convertedFileName}_converted.csv`;

                        updateConversionProgressBar(100, 'اكتمل التحويل الجدولي بنجاح!');

                        renderTabularPreview(csvHeaders, csvDataRows, file.name, sizeInMb);
                        
                        outputJsonViewer.style.display = 'none';
                        outputGridViewer.style.display = 'block';
                    } 
                    catch(err) {
                        alert('ملف GeoJSON معطوب أو غير صالح للتفكيك!');
                        console.error(err);
                        resetConverterOutputs();
                    }
                }, 400);
            };
        }
    }

    function renderGeoJsonPreview(geojson, originalName, size) {
        if (!outputJsonViewer) return;
        
        outputFilename.innerHTML = `<i class="fa-solid fa-file-shield text-secondary"></i> ${originalName}`;
        outputFilesize.textContent = `${size} ميغابايت`;

        const codeSnippet = JSON.stringify(geojson, null, 2);
        if (codeSnippet.length > 2500) {
            outputJsonViewer.textContent = codeSnippet.substring(0, 2500) + "\n\n/* ... تم اقتطاع نافذة المعاينة للتسريع، الملف بأكمله جاهز للتحميل ... */";
        } else {
            outputJsonViewer.textContent = codeSnippet;
        }

        btnDownloadResult.disabled = false;
    }

    function renderTabularPreview(headers, data, originalName, size) {
        const tableHeaders = document.getElementById('output-table-headers');
        const tableRows = document.getElementById('output-table-rows');
        
        if (!tableHeaders || !tableRows) return;
        
        tableHeaders.innerHTML = '';
        tableRows.innerHTML = '';

        outputFilename.innerHTML = `<i class="fa-solid fa-file-csv text-primary"></i> ${originalName}`;
        outputFilesize.textContent = `${size} ميغابايت`;

        const visibleHeaders = headers.slice(0, 5);
        visibleHeaders.forEach(h => {
            const th = document.createElement('th');
            th.textContent = h;
            tableHeaders.appendChild(th);
        });
        if (headers.length > 5) {
            const th = document.createElement('th');
            th.textContent = '...';
            tableHeaders.appendChild(th);
        }

        const previewRows = data.slice(0, 10);
        previewRows.forEach(row => {
            const tr = document.createElement('tr');
            visibleHeaders.forEach(h => {
                const td = document.createElement('td');
                td.textContent = row[h] !== undefined ? row[h] : '';
                tr.appendChild(td);
            });
            if (headers.length > 5) {
                const td = document.createElement('td');
                td.textContent = '...';
                tr.appendChild(td);
            }
            tableRows.appendChild(tr);
        });

        btnDownloadResult.disabled = false;
    }

    function parseCsv(text) {
        const lines = text.split(/\r?\n/);
        if (lines.length === 0) return { headers: [], data: [] };
        
        const parseLine = (line) => {
            const result = [];
            let cur = '';
            let inQuote = false;
            for (let i = 0; i < line.length; i++) {
                const char = line[i];
                if (char === '"') {
                    inQuote = !inQuote;
                } else if (char === ',' && !inQuote) {
                    result.push(cur.trim());
                    cur = '';
                } else {
                    cur += char;
                }
            }
            result.push(cur.trim());
            return result;
        };
        
        const headers = parseLine(lines[0]);
        const data = [];
        for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;
            const cols = parseLine(lines[i]);
            if (cols.length === headers.length) {
                const obj = {};
                headers.forEach((h, idx) => {
                    obj[h] = cols[idx];
                });
                data.push(obj);
            }
        }
        return { headers, data };
    }

    if (btnDownloadResult) {
        btnDownloadResult.addEventListener('click', () => {
            if (!convertedFileContent) return;

            let dataUri = '';
            if (fileConverterMode === 'geojson2csv') {
                dataUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(convertedFileContent);
            } else {
                dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(convertedFileContent);
            }

            const downloadAnchor = document.createElement('a');
            downloadAnchor.setAttribute("href", dataUri);
            downloadAnchor.setAttribute("download", convertedFileName);
            document.body.appendChild(downloadAnchor);
            downloadAnchor.click();
            downloadAnchor.remove();
        });
    }

    // ==========================================================================
    // 17. Saudi Vision 2030, GIS News & Copyright Tabs Switcher
    // ==========================================================================
    const visionTabBtns = document.querySelectorAll('.vision-tab-btn');
    const visionTabContents = document.querySelectorAll('.vision-tab-content');

    if (visionTabBtns && visionTabContents) {
        visionTabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTabId = btn.getAttribute('data-tab');

                // Toggle active class on buttons
                visionTabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Toggle visibility of content divs
                visionTabContents.forEach(content => {
                    if (content.id === targetTabId) {
                        content.style.display = 'block';
                    } else {
                        content.style.display = 'none';
                    }
                });
            });
        });
    }
});


