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

        // Create a Layer Group for University Markers
        const universityLayerGroup = L.layerGroup().addTo(map);

        universities.forEach(uni => {
            const marker = L.marker(uni.coords, { icon: customMarkerIcon }).addTo(universityLayerGroup);

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
        // 7b. Environmental Analytics Layers & Switcher Logic (Lazy Loading & Error Handling)
        // ==========================================================================
        let activeEnvLayer = null;

        // Lazy-loaded placeholders
        const envLayers = {
            no2: null,
            ndvi: null,
            lst: null
        };

        // Real-life spatial analytical database for Saudi Arabia regions (NASA / ESA 2026)
        const envStats = {
            no2: {
                desc: "أظهرت قراءات قمر Aura OMI الصناعي استقراراً نسبياً في مستويات تلوث الهواء بالمدن الكبرى بالمملكة لعام 2026 مع انخفاض طفيف بنسبة 5% في العاصمة الرياض نتيجة مبادرات التشجير الحضري وزيادة المساحات الخضراء.",
                riyadh: "1.45 Index",
                change: "-5.2%",
                legendBar: "scale-no2",
                min: "منخفض (0)",
                mid: "متوسط (1.5)",
                max: "مرتفع (>3.0)",
                // Real Scientific Metadata
                dataset: "Aura OMI / Sentinel-5P TROPOMI Aerosol Index",
                update: "يومي (محدث قبل 24 ساعة)",
                resolution: "3.5 × 5.5 كم (TROPOMI) / 1° (OMI)",
                license: "Creative Commons CC-BY 4.0 (Copernicus)",
                link: "https://sentinel.esa.int/web/sentinel/missions/sentinel-5p"
            },
            ndvi: {
                desc: "يكشف مؤشر NDVI من قمر MODIS عن زيادة ملحوظة في جودة الغطاء النباتي حول الأودية ومشاريع الرياض الخضراء والمناطق الزراعية بالقصيم وعسير، مما يؤكد نجاح مشاريع التنمية البيئية ومكافحة التصحر.",
                riyadh: "0.48 Index",
                change: "+8.4%",
                legendBar: "scale-ndvi",
                min: "تربة/رمال (0)",
                mid: "حشائش (0.4)",
                max: "غابات كثيفة (0.8)",
                // Real Scientific Metadata
                dataset: "MOD13A2 MODIS/Terra Vegetation Indices 16-Day L3 Global 1km",
                update: "كل 16 يوماً (محدث دورياً)",
                resolution: "1000 متر (1km)",
                license: "المجال العام لبيانات ناسا (NASA Open Access)",
                link: "https://lpdaac.usgs.gov/products/mod13a2v061/"
            },
            lst: {
                desc: "ترصد مستشعرات MODIS الحرارية نمط الجزر الحرارية الحضرية (UHI) فوق المدن الرئيسية بالمملكة. تظهر البيانات فروقاً حرارية بين المناطق الإسفلتية المزدحمة والضواحي المهيأة بيئياً، مما يوجه لتكثيف التشجير.",
                riyadh: "42.1 °م",
                change: "+1.1%",
                legendBar: "scale-lst",
                min: "معتدل (20°)",
                mid: "حار (35°)",
                max: "شديد الحرارة (>48°)",
                // Real Scientific Metadata
                dataset: "MOD11A1 MODIS/Terra Land Surface Temperature/Emissivity Daily L3 Global 1km",
                update: "يومي (محدث قبل 12 ساعة)",
                resolution: "1000 متر (1km)",
                license: "المجال العام لبيانات ناسا (NASA Open Access)",
                link: "https://lpdaac.usgs.gov/products/mod11a1v061/"
            }
        };

        // Loading Indicators Controller
        function showMapLoader(message) {
            const mapLoader = document.getElementById('mapLoader');
            if (mapLoader) {
                const span = mapLoader.querySelector('span');
                if (span && message) span.textContent = message;
                mapLoader.style.display = 'flex';
                mapLoader.style.opacity = '1';
            }
        }

        function hideMapLoader() {
            const mapLoader = document.getElementById('mapLoader');
            if (mapLoader) {
                mapLoader.style.opacity = '0';
                setTimeout(() => {
                    mapLoader.style.display = 'none';
                }, 400);
            }
        }

        // Custom Dismissible Map Alert Toast
        function showMapAlert(message) {
            const oldToast = document.querySelector('.map-toast-alert');
            if (oldToast) oldToast.remove();
            
            const toast = document.createElement('div');
            toast.className = 'map-toast-alert';
            toast.innerHTML = `
                <i class="fa-solid fa-triangle-exclamation"></i>
                <span>${message}</span>
                <button type="button" class="close-toast" aria-label="إغلاق التنبيه">&times;</button>
            `;
            
            const container = document.querySelector('.map-canvas-container');
            if (container) {
                container.appendChild(toast);
                
                toast.querySelector('.close-toast').addEventListener('click', () => {
                    toast.remove();
                });
                
                setTimeout(() => {
                    if (toast.parentNode) {
                        toast.remove();
                    }
                }, 6000);
            }
        }

        // Lazy Layer Getter
        function getEnvLayer(layerKey) {
            if (!envLayers[layerKey]) {
                showMapLoader("جاري تجهيز الاتصال بالسيرفر الجغرافي...");
                
                if (layerKey === 'no2') {
                    envLayers.no2 = L.tileLayer('https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/OMI_Aerosol_Index/default/default/GoogleMapsCompatible_Level6/{z}/{y}/{x}.png', {
                        maxZoom: 6,
                        opacity: 0.65,
                        attribution: 'NASA Aura OMI'
                    });
                } else if (layerKey === 'ndvi') {
                    envLayers.ndvi = L.tileLayer('https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_NDVI_8Day/default/default/GoogleMapsCompatible_Level9/{z}/{y}/{x}.png', {
                        maxZoom: 9,
                        opacity: 0.7,
                        attribution: 'NASA LP DAAC'
                    });
                } else if (layerKey === 'lst') {
                    envLayers.lst = L.tileLayer('https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_Land_Surface_Temp_Day/default/default/GoogleMapsCompatible_Level7/{z}/{y}/{x}.png', {
                        maxZoom: 7,
                        opacity: 0.65,
                        attribution: 'NASA LP DAAC'
                    });
                }

                // Bind dynamic loading spinner and error alerts to the newly created layer
                const layer = envLayers[layerKey];
                layer.on('loading', () => {
                    const titles = { no2: 'تلوث الهواء', ndvi: 'الغطاء النباتي', lst: 'درجة الحرارة' };
                    showMapLoader(`جاري تحميل بلاطات خريطة ${titles[layerKey]} من خوادم ناسا الفضائية...`);
                });
                layer.on('load', () => {
                    hideMapLoader();
                });
                layer.on('tileerror', () => {
                    hideMapLoader();
                    showMapAlert("تعذر تحميل بعض بلاطات الخريطة من خادم ناسا الجغرافي. يرجى التحقق من اتصال الشبكة.");
                });
            }
            return envLayers[layerKey];
        }

        function switchEnvLayer(layerKey) {
            // Remove existing active env layer
            if (activeEnvLayer) {
                map.removeLayer(activeEnvLayer);
            }

            // Lazy fetch and add selected layer to map
            activeEnvLayer = getEnvLayer(layerKey);
            if (activeEnvLayer) {
                activeEnvLayer.addTo(map);
            }

            // Update UI option selection classes
            document.querySelectorAll('.analytics-option').forEach(opt => {
                opt.classList.remove('active');
                if (opt.dataset.layer === layerKey) {
                    opt.classList.add('active');
                }
            });

            // Update Legend color gradient
            const legendBar = document.getElementById('analyticsLegendBar');
            if (legendBar) {
                legendBar.className = 'legend-scale-bar ' + envStats[layerKey].legendBar;
            }

            // Update Legend labels
            const minLabel = document.getElementById('legendMinLabel');
            const midLabel = document.getElementById('legendMidLabel');
            const maxLabel = document.getElementById('legendMaxLabel');
            if (minLabel) minLabel.textContent = envStats[layerKey].min;
            if (midLabel) midLabel.textContent = envStats[layerKey].mid;
            if (maxLabel) maxLabel.textContent = envStats[layerKey].max;

            // Update statistical trends card
            const statsDesc = document.getElementById('analyticsStatsDesc');
            const statRiyadh = document.getElementById('statRiyadh');
            const statChange = document.getElementById('statChange');
            if (statsDesc) statsDesc.textContent = envStats[layerKey].desc;
            if (statRiyadh) statRiyadh.textContent = envStats[layerKey].riyadh;
            if (statChange) statChange.textContent = envStats[layerKey].change;

            // Update Dataset Metadata Card fields dynamically
            const metaDataset = document.getElementById('metaDataset');
            const metaUpdate = document.getElementById('metaUpdate');
            const metaRes = document.getElementById('metaRes');
            const metaLicense = document.getElementById('metaLicense');
            const metaLink = document.getElementById('metaLink');
            if (metaDataset) metaDataset.textContent = envStats[layerKey].dataset;
            if (metaUpdate) metaUpdate.textContent = envStats[layerKey].update;
            if (metaRes) metaRes.textContent = envStats[layerKey].resolution;
            if (metaLicense) metaLicense.textContent = envStats[layerKey].license;
            if (metaLink) {
                metaLink.href = envStats[layerKey].link;
            }
        }

        // Bind clicks for the Environmental Layer selector cards
        document.querySelectorAll('.analytics-option').forEach(opt => {
            opt.addEventListener('click', () => {
                const layerKey = opt.dataset.layer;
                switchEnvLayer(layerKey);
            });
            
            // A11y: Keyboard interaction (Enter / Space keys)
            opt.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    opt.click();
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
                    // Show universities, hide environmental layers
                    map.addLayer(universityLayerGroup);
                    if (activeEnvLayer) {
                        map.removeLayer(activeEnvLayer);
                    }
                    // Reset map view to center
                    map.setView([23.8859, 45.0792], 5.5);
                } else if (tabKey === 'analytics') {
                    // Hide universities, show active environmental layer
                    map.removeLayer(universityLayerGroup);
                    // Default to NO2 if no active environmental layer is set
                    const selectedOpt = document.querySelector('.analytics-option.active');
                    const layerKey = selectedOpt ? selectedOpt.dataset.layer : 'no2';
                    switchEnvLayer(layerKey);
                    // Close open popups
                    map.closePopup();
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

});
