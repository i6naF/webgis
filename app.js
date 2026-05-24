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
    // 6. Upgraded Interactive Coordinate Converter & Geodesy Widget
    // ==========================================================================
    
    // Mathematical Geodesy Constants & Projections (WGS84 Ellipsoid)
    const WGS84_A = 6378137.0; // semi-major axis in meters
    const WGS84_F = 1 / 298.257223563; // flattening
    const WGS84_B = WGS84_A * (1 - WGS84_F); // semi-minor axis
    const WGS84_E_SQ = (WGS84_A * WGS84_A - WGS84_B * WGS84_B) / (WGS84_A * WGS84_A); // eccentricity squared
    const WGS84_E_PRIME_SQ = (WGS84_A * WGS84_A - WGS84_B * WGS84_B) / (WGS84_B * WGS84_B); // second eccentricity squared
    const UTM_K0 = 0.9996; // central meridian scale factor

    // Decimal Degrees (DD) to DMS conversion
    function ddToDms(val, isLat) {
        const abs = Math.abs(val);
        const d = Math.floor(abs);
        const m = Math.floor((abs - d) * 60);
        const s = ((abs - d - m / 60) * 3600).toFixed(2);
        
        let dir = "";
        if (isLat) {
            dir = val >= 0 ? "N" : "S";
        } else {
            dir = val >= 0 ? "E" : "W";
        }
        
        return {
            deg: d,
            min: m,
            sec: parseFloat(s),
            dir: dir,
            str: `${d}° ${m}' ${s}" ${dir === "N" ? "شمالاً" : dir === "S" ? "جنوباً" : dir === "E" ? "شرقاً" : "غرباً"} (${dir})`
        };
    }

    // DMS to DD
    function dmsToDd(deg, min, sec, dir) {
        let dd = deg + min / 60 + sec / 3600;
        if (dir === 'S' || dir === 'W' || dir === 's' || dir === 'w') {
            dd = -dd;
        }
        return dd;
    }

    // DD to Web Mercator (EPSG:3857) meters conversion
    function ddToWebMercator(lat, lng) {
        const r = 6378137;
        const maxMerc = 20037508.34;
        
        let x = lng * (Math.PI / 180) * r;
        const latClamped = Math.max(-85.05112878, Math.min(85.05112878, lat));
        let y = Math.log(Math.tan((90 + latClamped) * Math.PI / 360)) * r;
        
        if (x > maxMerc) x = maxMerc;
        if (x < -maxMerc) x = -maxMerc;
        if (y > maxMerc) y = maxMerc;
        if (y < -maxMerc) y = -maxMerc;
        
        return { x: x, y: y };
    }

    // Web Mercator (EPSG:3857) to DD conversion
    function webMercatorToDd(x, y) {
        const r = 6378137;
        let lng = (x / r) * (180 / Math.PI);
        let lat = (Math.atan(Math.exp(y / r)) * 2 - Math.PI / 2) * (180 / Math.PI);
        return { lat: lat, lng: lng };
    }

    // WGS84 (Lat, Lng) to UTM Projection Forward
    function wgs84ToUtm(lat, lng) {
        if (lat < -80 || lat > 84) {
            return null; // UTM is defined only between 80 degrees S and 84 degrees N
        }
        
        let zone = Math.floor((lng + 180) / 6) + 1;
        if (lat >= 56 && lat < 64 && lng >= 3 && lng < 12) zone = 32;
        if (lat >= 72 && lat < 84) {
            if (lng >= 0 && lng < 9) zone = 31;
            else if (lng >= 9 && lng < 21) zone = 33;
            else if (lng >= 21 && lng < 33) zone = 35;
            else if (lng >= 33 && lng < 42) zone = 37;
        }
        const zoneMeridian = (zone - 1) * 6 - 180 + 3;
        
        const latRad = lat * Math.PI / 180;
        const lngRad = lng * Math.PI / 180;
        const centralMeridianRad = zoneMeridian * Math.PI / 180;
        
        const dLng = lngRad - centralMeridianRad;
        const sinLat = Math.sin(latRad);
        const cosLat = Math.cos(latRad);
        const tanLat = Math.tan(latRad);
        
        const N = WGS84_A / Math.sqrt(1 - WGS84_E_SQ * sinLat * sinLat);
        const T = tanLat * tanLat;
        const C = WGS84_E_PRIME_SQ * cosLat * cosLat;
        const A = dLng * cosLat;
        
        const M = WGS84_A * (
            (1 - WGS84_E_SQ/4 - 3*WGS84_E_SQ*WGS84_E_SQ/64 - 5*WGS84_E_SQ*WGS84_E_SQ*WGS84_E_SQ/256) * latRad -
            (3*WGS84_E_SQ/8 + 3*WGS84_E_SQ*WGS84_E_SQ/32 + 45*WGS84_E_SQ*WGS84_E_SQ*WGS84_E_SQ/1024) * Math.sin(2*latRad) +
            (15*WGS84_E_SQ*WGS84_E_SQ/256 + 45*WGS84_E_SQ*WGS84_E_SQ*WGS84_E_SQ/1024) * Math.sin(4*latRad) -
            (35*WGS84_E_SQ*WGS84_E_SQ*WGS84_E_SQ/3072) * Math.sin(6*latRad)
        );
        
        let easting = UTM_K0 * N * (A + (1 - T + C) * A*A*A/6 + (5 - 18*T + T*T + 72*C - 58*WGS84_E_PRIME_SQ) * A*A*A*A*A/120) + 500000.0;
        let northing = UTM_K0 * (M + N * tanLat * (A*A/2 + (5 - T + 9*C + 4*C*C) * A*A*A*A/24 + (61 - 58*T + T*T + 600*C - 330*WGS84_E_PRIME_SQ) * A*A*A*A*A*A/720));
        
        if (lat < 0) {
            northing += 10000000.0; // False northing for southern hemisphere
        }
        
        return {
            easting: easting,
            northing: northing,
            zone: zone,
            hemisphere: lat >= 0 ? 'N' : 'S'
        };
    }

    // UTM Projection Backward to WGS84
    function utmToWgs84(easting, northing, zone, hemisphere) {
        const x = easting - 500000.0;
        let y = northing;
        if (hemisphere === 'S' || hemisphere === 's') {
            y -= 10000000.0;
        }
        
        const e1 = (1 - Math.sqrt(1 - WGS84_E_SQ)) / (1 + Math.sqrt(1 - WGS84_E_SQ));
        const M = y / UTM_K0;
        const mu = M / (WGS84_A * (1 - WGS84_E_SQ/4 - 3*WGS84_E_SQ*WGS84_E_SQ/64 - 5*WGS84_E_SQ*WGS84_E_SQ*WGS84_E_SQ/256));
        
        const phi1Rad = mu +
            (3*e1/2 - 27*e1*e1*e1/32) * Math.sin(2*mu) +
            (21*e1*e1/16 - 55*e1*e1*e1*e1/32) * Math.sin(4*mu) +
            (151*e1*e1*e1/96) * Math.sin(6*mu) +
            (1097*e1*e1*e1*e1/512) * Math.sin(8*mu);
            
        const sinPhi1 = Math.sin(phi1Rad);
        const cosPhi1 = Math.cos(phi1Rad);
        const tanPhi1 = Math.tan(phi1Rad);
        
        const N1 = WGS84_A / Math.sqrt(1 - WGS84_E_SQ * sinPhi1 * sinPhi1);
        const R1 = WGS84_A * (1 - WGS84_E_SQ) / Math.pow(1 - WGS84_E_SQ * sinPhi1 * sinPhi1, 1.5);
        const D = x / (N1 * UTM_K0);
        
        let lat = phi1Rad - (N1 * tanPhi1 / R1) * (
            D*D/2 -
            (5 + 3*tanPhi1*tanPhi1 + 10*WGS84_E_PRIME_SQ*cosPhi1*cosPhi1 - 4*WGS84_E_PRIME_SQ*WGS84_E_PRIME_SQ*cosPhi1*cosPhi1*cosPhi1*cosPhi1 - 9*WGS84_E_PRIME_SQ*tanPhi1*tanPhi1*cosPhi1*cosPhi1) * D*D*D*D/24 +
            (61 + 90*tanPhi1*tanPhi1 + 298*WGS84_E_PRIME_SQ*cosPhi1*cosPhi1 + 45*Math.pow(tanPhi1, 4) - 252*WGS84_E_PRIME_SQ*tanPhi1*tanPhi1*cosPhi1*cosPhi1 - 3*WGS84_E_PRIME_SQ*WGS84_E_PRIME_SQ*cosPhi1*cosPhi1*cosPhi1*cosPhi1) * Math.pow(D, 6)/720
        );
        
        let zoneMeridian = (zone - 1) * 6 - 180 + 3;
        let lng = (D - (1 + 2*tanPhi1*tanPhi1 + WGS84_E_PRIME_SQ*cosPhi1*cosPhi1) * D*D*D/6 +
            (5 - 2*WGS84_E_PRIME_SQ*cosPhi1*cosPhi1 + 28*tanPhi1*tanPhi1 - 3*WGS84_E_PRIME_SQ*WGS84_E_PRIME_SQ*cosPhi1*cosPhi1*cosPhi1*cosPhi1 + 8*WGS84_E_PRIME_SQ*tanPhi1*tanPhi1*cosPhi1*cosPhi1 + 24*Math.pow(tanPhi1, 4)) * Math.pow(D, 5)/120
        ) / cosPhi1;
        
        lat = lat * 180 / Math.PI;
        lng = zoneMeridian + lng * 180 / Math.PI;
        
        return { lat: lat, lng: lng };
    }

    // Haversine Geodetic Distance between two WGS84 points
    function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
        const R = 6371000; // meters
        const phi1 = lat1 * Math.PI / 180;
        const phi2 = lat2 * Math.PI / 180;
        const dPhi = (lat2 - lat1) * Math.PI / 180;
        const dLambda = (lon2 - lon1) * Math.PI / 180;
        
        const a = Math.sin(dPhi/2) * Math.sin(dPhi/2) +
                  Math.cos(phi1) * Math.cos(phi2) *
                  Math.sin(dLambda/2) * Math.sin(dLambda/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    // Geodetic Initial Azimuth (Bearing)
    function calculateBearing(lat1, lon1, lat2, lon2) {
        const phi1 = lat1 * Math.PI / 180;
        const phi2 = lat2 * Math.PI / 180;
        const lambda1 = lon1 * Math.PI / 180;
        const lambda2 = lon2 * Math.PI / 180;
        
        const y = Math.sin(lambda2 - lambda1) * Math.cos(phi2);
        const x = Math.cos(phi1) * Math.sin(phi2) -
                  Math.sin(phi1) * Math.cos(phi2) * Math.cos(lambda2 - lambda1);
        const theta = Math.atan2(y, x);
        return (theta * 180 / Math.PI + 360) % 360;
    }

    // Cardinal Direction translation in Arabic
    function getCardinalDirection(bearing) {
        const directions = [
            "شمال (N)", "شمال شرق (NNE)", "شمال شرقي (NE)", "شرق شمال شرق (ENE)",
            "شرق (E)", "شرق جنوب شرق (ESE)", "جنوب شرقي (SE)", "جنوب جنوب شرق (SSE)",
            "جنوب (S)", "جنوب جنوب غرب (SSW)", "جنوب غربي (SW)", "غرب جنوب غرب (WSW)",
            "غرب (W)", "غرب شمال غرب (WNW)", "شمال غربي (NW)", "شمال شمال غرب (NNW)"
        ];
        const index = Math.round(bearing / 22.5) % 16;
        return directions[index];
    }

    // UI elements binding for Converter
    const inputLat = document.getElementById('input-lat');
    const inputLng = document.getElementById('input-lng');
    const dmsLatDeg = document.getElementById('dms-lat-deg');
    const dmsLatMin = document.getElementById('dms-lat-min');
    const dmsLatSec = document.getElementById('dms-lat-sec');
    const dmsLatDir = document.getElementById('dms-lat-dir');
    const dmsLngDeg = document.getElementById('dms-lng-deg');
    const dmsLngMin = document.getElementById('dms-lng-min');
    const dmsLngSec = document.getElementById('dms-lng-sec');
    const dmsLngDir = document.getElementById('dms-lng-dir');
    const utmEasting = document.getElementById('utm-easting');
    const utmNorthing = document.getElementById('utm-northing');
    const utmZone = document.getElementById('utm-zone');
    const utmHemisphere = document.getElementById('utm-hemisphere');
    const inputMercX = document.getElementById('input-merc-x');
    const inputMercY = document.getElementById('input-merc-y');

    const outputWgs84 = document.getElementById('output-wgs84');
    const outputDms = document.getElementById('output-dms');
    const outputUtm = document.getElementById('output-utm');
    const outputMercator = document.getElementById('output-mercator');

    let currentInputMode = 'wgs84'; // 'wgs84', 'dms', 'utm', 'mercator'

    // Tab buttons event listeners
    const convTabBtns = document.querySelectorAll('.conv-tab-btn');
    const convInputPanels = document.querySelectorAll('.conv-input-panel');

    convTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            convTabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const targetTab = btn.dataset.tab;
            currentInputMode = targetTab;
            
            convInputPanels.forEach(panel => {
                panel.style.display = 'none';
            });
            const activePanel = document.getElementById(`panel-${targetTab}`);
            if (activePanel) activePanel.style.display = 'block';

            // Show/hide presets button only for WGS84
            const presetsWgs84 = document.getElementById('preset-buttons-wgs84');
            if (presetsWgs84) {
                presetsWgs84.style.display = targetTab === 'wgs84' ? 'block' : 'none';
            }

            // Sync values from previous calculated state
            pullActiveCoordinates();
        });
    });

    // Preset click bindings for the updated preset buttons
    const presetBtns = document.querySelectorAll('.preset-btn');
    presetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const lat = parseFloat(btn.dataset.lat);
            const lng = parseFloat(btn.dataset.lng);
            if (inputLat && inputLng) {
                inputLat.value = lat;
                inputLng.value = lng;
                triggerCoordinateConversion(lat, lng);
            }
        });
    });

    // Extract current display values and perform recalculations from selected input source
    function processActiveConversion() {
        let lat, lng;

        if (currentInputMode === 'wgs84') {
            if (!inputLat || !inputLng) return;
            lat = parseFloat(inputLat.value);
            lng = parseFloat(inputLng.value);
            if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
                renderConverterErrors("خطأ: الإحداثيات خارج الحدود");
                return;
            }
        } 
        else if (currentInputMode === 'dms') {
            if (!dmsLatDeg) return;
            const latD = parseInt(dmsLatDeg.value) || 0;
            const latM = parseInt(dmsLatMin.value) || 0;
            const latS = parseFloat(dmsLatSec.value) || 0;
            const latDir = dmsLatDir.value;
            const lngD = parseInt(dmsLngDeg.value) || 0;
            const lngM = parseInt(dmsLngMin.value) || 0;
            const lngS = parseFloat(dmsLngSec.value) || 0;
            const lngDir = dmsLngDir.value;

            lat = dmsToDd(latD, latM, latS, latDir);
            lng = dmsToDd(lngD, lngM, lngS, lngDir);

            if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
                renderConverterErrors("خطأ في قيم DMS");
                return;
            }
        } 
        else if (currentInputMode === 'utm') {
            if (!utmEasting) return;
            const easting = parseFloat(utmEasting.value);
            const northing = parseFloat(utmNorthing.value);
            const zone = parseInt(utmZone.value);
            const hemisphere = utmHemisphere.value;

            if (isNaN(easting) || isNaN(northing) || isNaN(zone)) {
                renderConverterErrors("خطأ في مدخلات UTM");
                return;
            }

            const wgs84 = utmToWgs84(easting, northing, zone, hemisphere);
            lat = wgs84.lat;
            lng = wgs84.lng;

            if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
                renderConverterErrors("إحداثيات UTM غير متوافقة");
                return;
            }
        } 
        else if (currentInputMode === 'mercator') {
            if (!inputMercX) return;
            const x = parseFloat(inputMercX.value);
            const y = parseFloat(inputMercY.value);

            if (isNaN(x) || isNaN(y)) {
                renderConverterErrors("خطأ في ويب ميركاتور");
                return;
            }

            const wgs84 = webMercatorToDd(x, y);
            lat = wgs84.lat;
            lng = wgs84.lng;

            if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
                renderConverterErrors("إحداثيات ويب ميركاتور غير صالحة");
                return;
            }
        }

        renderAllConverterOutputs(lat, lng);
    }

    // Pull values from current output text nodes to pre-populate inputs when shifting tabs
    function pullActiveCoordinates() {
        if (!outputWgs84) return;
        const text = outputWgs84.textContent;
        if (!text || text.includes('--') || text.includes('خطأ')) return;
        const matches = text.match(/Lat:\s*([-\d.]+)\s*°,\s*Lng:\s*([-\d.]+)/);
        if (matches && matches.length >= 3) {
            const lat = parseFloat(matches[1]);
            const lng = parseFloat(matches[2]);
            
            // Sync values to all inputs
            syncAllInputs(lat, lng);
        }
    }

    function syncAllInputs(lat, lng) {
        // WGS84 inputs
        if (inputLat && inputLng) {
            inputLat.value = lat.toFixed(6);
            inputLng.value = lng.toFixed(6);
        }

        // DMS inputs
        const dmsLat = ddToDms(lat, true);
        const dmsLng = ddToDms(lng, false);
        if (dmsLatDeg) {
            dmsLatDeg.value = dmsLat.deg;
            dmsLatMin.value = dmsLat.min;
            dmsLatSec.value = dmsLat.sec.toFixed(2);
            dmsLatDir.value = dmsLat.dir;
            
            dmsLngDeg.value = dmsLng.deg;
            dmsLngMin.value = dmsLng.min;
            dmsLngSec.value = dmsLng.sec.toFixed(2);
            dmsLngDir.value = dmsLng.dir;
        }

        // UTM inputs
        const utm = wgs84ToUtm(lat, lng);
        if (utm && utmEasting) {
            utmEasting.value = utm.easting.toFixed(2);
            utmNorthing.value = utm.northing.toFixed(2);
            utmZone.value = utm.zone;
            utmHemisphere.value = utm.hemisphere;
        }

        // Web Mercator inputs
        const merc = ddToWebMercator(lat, lng);
        if (inputMercX) {
            inputMercX.value = merc.x.toFixed(2);
            inputMercY.value = merc.y.toFixed(2);
        }
    }

    function triggerCoordinateConversion(lat, lng) {
        syncAllInputs(lat, lng);
        renderAllConverterOutputs(lat, lng);
    }

    function renderConverterErrors(errMsg) {
        if (outputWgs84) outputWgs84.textContent = errMsg;
        if (outputDms) outputDms.textContent = errMsg;
        if (outputUtm) outputUtm.textContent = errMsg;
        if (outputMercator) outputMercator.textContent = errMsg;
    }

    function renderAllConverterOutputs(lat, lng) {
        if (!outputWgs84) return;

        // 1. WGS84 Output
        outputWgs84.textContent = `Lat: ${lat.toFixed(8)}°, Lng: ${lng.toFixed(8)}°`;

        // 2. DMS Output
        const latDms = ddToDms(lat, true);
        const lngDms = ddToDms(lng, false);
        outputDms.textContent = `${latDms.str} | ${lngDms.str}`;

        // 3. UTM Output
        const utm = wgs84ToUtm(lat, lng);
        if (utm) {
            outputUtm.textContent = `Zone: ${utm.zone}${utm.hemisphere} | E: ${utm.easting.toFixed(2)} م | N: ${utm.northing.toFixed(2)} م`;
        } else {
            outputUtm.textContent = "خارج نطاق إسقاط UTM (-80 إلى 84)";
        }

        // 4. Web Mercator Output
        const merc = ddToWebMercator(lat, lng);
        outputMercator.textContent = `X: ${merc.x.toFixed(2)} م | Y: ${merc.y.toFixed(2)} م`;
    }

    // Attach listeners to all inputs for real-time calculations
    const allInputs = [
        inputLat, inputLng, 
        dmsLatDeg, dmsLatMin, dmsLatSec, dmsLatDir,
        dmsLngDeg, dmsLngMin, dmsLngSec, dmsLngDir,
        utmEasting, utmNorthing, utmZone, utmHemisphere,
        inputMercX, inputMercY
    ];

    allInputs.forEach(el => {
        if (el) {
            el.addEventListener('input', processActiveConversion);
            el.addEventListener('change', processActiveConversion);
        }
    });

    // Clipboard copy mechanism
    const copyBtns = document.querySelectorAll('.copy-btn');
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
                    if (icon) icon.className = 'fa-solid fa-check';
                    
                    setTimeout(() => {
                        btn.classList.remove('copied');
                        if (span) span.textContent = originalText;
                        if (icon) icon.className = originalIconClass.join(' ');
                    }, 1500);
                }).catch(err => {
                    console.error('Failed to copy text: ', err);
                });
            }
        });
    });

    // Geodesy calculations trigger
    const geoALat = document.getElementById('geo-a-lat');
    const geoALng = document.getElementById('geo-a-lng');
    const geoBLat = document.getElementById('geo-b-lat');
    const geoBLng = document.getElementById('geo-b-lng');
    const geoDistanceEl = document.getElementById('geo-distance');
    const geoBearingEl = document.getElementById('geo-bearing');
    const geoDirectionEl = document.getElementById('geo-direction');

    function processGeodesyCalculation() {
        if (!geoALat || !geoALng || !geoBLat || !geoBLng || !geoDistanceEl) return;

        const latA = parseFloat(geoALat.value);
        const lngA = parseFloat(geoALng.value);
        const latB = parseFloat(geoBLat.value);
        const lngB = parseFloat(geoBLng.value);

        if (isNaN(latA) || isNaN(lngA) || isNaN(latB) || isNaN(lngB)) {
            geoDistanceEl.textContent = "--";
            geoBearingEl.textContent = "--";
            geoDirectionEl.textContent = "--";
            return;
        }

        const distanceM = calculateHaversineDistance(latA, lngA, latB, lngB);
        const bearing = calculateBearing(latA, lngA, latB, lngB);
        const direction = getCardinalDirection(bearing);

        let distText = "";
        if (distanceM < 1000) {
            distText = `${distanceM.toFixed(1)} م`;
        } else {
            const distKm = distanceM / 1000;
            const distMiles = distKm * 0.621371;
            distText = `${distKm.toFixed(2)} كم (${distMiles.toFixed(2)} ميل)`;
        }

        geoDistanceEl.textContent = distText;
        geoBearingEl.textContent = `${bearing.toFixed(2)}°`;
        geoDirectionEl.textContent = direction;
    }

    [geoALat, geoALng, geoBLat, geoBLng].forEach(el => {
        if (el) {
            el.addEventListener('input', processGeodesyCalculation);
        }
    });

    // Initialize values on first load
    triggerCoordinateConversion(24.7136, 46.6753);
    processGeodesyCalculation();

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
    // 9. Python SDK Sandbox Interactive Logic (Phase 2)
    // ==========================================================================
    const sandboxRegion = document.getElementById('sandbox-region');
    const sandboxResolution = document.getElementById('sandbox-resolution');
    const varNdvi = document.getElementById('var-ndvi');
    const varLst = document.getElementById('var-lst');
    const varNo2 = document.getElementById('var-no2');
    const varPopulation = document.getElementById('var-population');
    const runPythonBtn = document.getElementById('runPythonBtn');
    const codeDisplay = document.getElementById('codeDisplay');
    const editorLineNumbers = document.getElementById('editorLineNumbers');
    const consoleBody = document.getElementById('consoleBody');
    const consoleStatus = document.getElementById('consoleStatus');
    const consoleFooter = document.getElementById('consoleFooter');
    const downloadJsonBtn = document.getElementById('downloadJsonBtn');
    const downloadCsvBtn = document.getElementById('downloadCsvBtn');

    // Saudi Arabia regional stats for fallback compiler (WGS84 Bounding Boxes)
    const SAUDI_REGIONS_JS = {
        riyadh: {
            name_ar: "منطقة الرياض (الوسطى)",
            bbox: [24.4, 46.4, 25.0, 47.0],
            base_pop: 250,
            base_lst: 38.5,
            base_ndvi: 0.12,
            base_no2: 45.2
        },
        western: {
            name_ar: "المنطقة الغربية (مكة وجدة)",
            bbox: [21.2, 39.0, 21.8, 39.8],
            base_pop: 320,
            base_lst: 36.2,
            base_ndvi: 0.15,
            base_no2: 38.7
        },
        eastern: {
            name_ar: "المنطقة الشرقية (الدمام والجبيل)",
            bbox: [26.0, 49.8, 26.6, 50.6],
            base_pop: 180,
            base_lst: 37.8,
            base_ndvi: 0.08,
            base_no2: 52.4
        },
        southern: {
            name_ar: "المنطقة الجنوبية (عسير وأبها)",
            bbox: [18.0, 42.2, 18.6, 42.8],
            base_pop: 90,
            base_lst: 24.5,
            base_ndvi: 0.48,
            base_no2: 12.1
        },
        northern: {
            name_ar: "المنطقة الشمالية (تبوك ونيوم)",
            bbox: [28.2, 36.2, 28.8, 37.0],
            base_pop: 45,
            base_lst: 32.1,
            base_ndvi: 0.10,
            base_no2: 15.6
        },
        hail: {
            name_ar: "منطقة حائل",
            bbox: [27.0, 41.0, 27.8, 42.0],
            base_pop: 60,
            base_lst: 33.5,
            base_ndvi: 0.14,
            base_no2: 11.5
        }
    };

    let generatedGeoJson = null;
    let generatedCsv = null;
    let selectedRegionKey = 'riyadh';
    let selectedRes = 100;
    let selectedVars = ['ndvi', 'lst'];

    // Update variables list from checkboxes
    function updateSelectedVariables() {
        selectedVars = [];
        if (varNdvi && varNdvi.checked) selectedVars.push('ndvi');
        if (varLst && varLst.checked) selectedVars.push('lst');
        if (varNo2 && varNo2.checked) selectedVars.push('no2');
        if (varPopulation && varPopulation.checked) selectedVars.push('population');
    }

    // High-fidelity syntax highlighter for editable preview code (Single-pass Bug-free)
    function highlightPythonCode(code) {
        // 1. Safe HTML escape
        let escaped = code
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

        // 2. Single-pass tokenization using Regex alternation to prevent recursive replacing of tags
        const tokenRegex = /(#.*)|("[^"\\]*(?:\\.[^"\\]*)*")|\b(from|import|print|class|def|return|if|else|for|in)\b|\b(GeoMesh)\b|\b(harmonize|to_geojson|to_csv)\b|\b(\d+)\b|([=\(\),\[\]:])/g;

        return escaped.replace(tokenRegex, (match, comment, string, keyword, className, func, number, operator) => {
            if (comment) return `<span class="comment">${comment}</span>`;
            if (string) return `<span class="string">${string}</span>`;
            if (keyword) return `<span class="keyword">${keyword}</span>`;
            if (className) return `<span class="class-name">${className}</span>`;
            if (func) return `<span class="function">${func}</span>`;
            if (number) return `<span class="number">${number}</span>`;
            if (operator) return `<span class="operator">${operator}</span>`;
            return match;
        });
    }

    // Refreshes the IDE window code text based on current controls
    function updatePythonPreview() {
        if (!codeDisplay || !editorLineNumbers) return;

        selectedRegionKey = sandboxRegion ? sandboxRegion.value : 'riyadh';
        selectedRes = sandboxResolution ? parseInt(sandboxResolution.value) : 100;
        updateSelectedVariables();

        const regionName = sandboxRegion ? sandboxRegion.options[sandboxRegion.selectedIndex].text.split(" - ")[0] : 'الرياض';
        const formattedVars = "[" + selectedVars.map(v => `"${v}"`).join(", ") + "]";

        const script = `# -*- coding: utf-8 -*-
# بوابة الطلاب الجغرافية - السعودية (Saudi GIS Sandbox)
from geomesh import GeoMesh

# 1. تهيئة محرك المعالجة ومواءمة البيانات لمنطقة ${regionName}
mesh = GeoMesh(
    region="${selectedRegionKey}",
    resolution_m=${selectedRes},
    variables=${formattedVars}
)

# 2. بدء التجميع الإحصائي الجيومكاني وإعادة العينات (Resampling)
points_count = mesh.harmonize()
print(f"تم مواءمة {points_count} عقدة جغرافية بنجاح!")

# 3. تصدير الحزم المساحية الموحدة بصيغ نظم المعلومات الجغرافية القياسية
geojson_data = mesh.to_geojson()
csv_data = mesh.to_csv()
`;

        codeDisplay.innerHTML = highlightPythonCode(script);

        // Update line numbers
        const lineCount = script.split('\n').length - 1;
        let lineNumbersHTML = '';
        for (let i = 1; i <= lineCount; i++) {
            lineNumbersHTML += `${i}<br>`;
        }
        editorLineNumbers.innerHTML = lineNumbersHTML;
    }

    // Bind event listeners to dropdowns and checkboxes
    if (sandboxRegion) sandboxRegion.addEventListener('change', updatePythonPreview);
    if (sandboxResolution) sandboxResolution.addEventListener('change', updatePythonPreview);
    [varNdvi, varLst, varNo2, varPopulation].forEach(chk => {
        if (chk) chk.addEventListener('change', updatePythonPreview);
    });

    // WGS84 to Web Mercator EPSG:3857 coordinates calculator
    function wgs84ToWebMercator(lat, lng) {
        const r = 6378137.0;
        const x = lng * (Math.PI / 180.0) * r;
        const latClamped = Math.max(-85.05112878, Math.min(85.05112878, lat));
        const y = Math.log(Math.tan((90.0 + latClamped) * Math.PI / 360.0)) * r;
        return [x, y];
    }

    // In-browser scientific spatial data compiler fallback (with live API fetching!)
    async function runClientSideCompilation() {
        const region = SAUDI_REGIONS_JS[selectedRegionKey];
        const [minLat, minLng, maxLat, maxLng] = region.bbox;
        const latCenter = (minLat + maxLat) / 2.0;
        const lngCenter = (minLng + maxLng) / 2.0;

        let liveLstBase = null;
        let liveNo2Base = null;
        let liveHumidityBase = null;
        let livePrecipBase = null;

        await logToTerminal(`[API] [BROWSER] Querying live database nodes for center point (${latCenter.toFixed(4)}, ${lngCenter.toFixed(4)})...`, 'info', 200);

        // 1. Fetch NO2 Air Quality from Open-Meteo (Copernicus CAMS Model)
        try {
            const aqRes = await fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latCenter}&longitude=${lngCenter}&current=nitrogen_dioxide`);
            if (aqRes.ok) {
                const aqData = await aqRes.json();
                liveNo2Base = parseFloat(aqData.current.nitrogen_dioxide);
                await logToTerminal(`[API] [SUCCESS] Retrieved live NO2 concentration: ${liveNo2Base} ppb (Copernicus CAMS Model)`, 'success', 200);
            } else {
                await logToTerminal(`[API] [WARN] Air Quality node returned status ${aqRes.status}. Using defaults.`, 'warn', 100);
            }
        } catch (e) {
            await logToTerminal(`[API] [WARN] Air Quality fetch failed: ${e.message}. Using offline default.`, 'warn', 100);
        }

        // 2. Fetch LST proxy, humidity and precip from Open-Meteo Weather API
        try {
            const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latCenter}&longitude=${lngCenter}&current=temperature_2m,soil_temperature_0_to_7cm,relative_humidity_2m,precipitation&timezone=Asia/Riyadh`);
            if (weatherRes.ok) {
                const wData = await weatherRes.json();
                const current = wData.current;
                
                liveLstBase = current.soil_temperature_0_to_7cm || (current.temperature_2m + 2.0);
                liveHumidityBase = current.relative_humidity_2m;
                livePrecipBase = current.precipitation;
                
                await logToTerminal(`[API] [SUCCESS] Synced live LST proxy: ${liveLstBase.toFixed(1)}°C (Soil/Air temp)`, 'success', 200);
                await logToTerminal(`[API] [SUCCESS] Synced live telemetry: Humidity ${liveHumidityBase}%, Rain ${livePrecipBase}mm`, 'success', 100);
            } else {
                await logToTerminal(`[API] [WARN] Weather node returned status ${weatherRes.status}. Using defaults.`, 'warn', 100);
            }
        } catch (e) {
            await logToTerminal(`[API] [WARN] Weather fetch failed: ${e.message}. Using offline default.`, 'warn', 100);
        }

        // 3. Try to fetch Earth Skin Temperature from NASA POWER API
        try {
            const today = new Date();
            const safeDateObj = new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000);
            const safeDateStr = safeDateObj.toISOString().split('T')[0].replace(/-/g, '');
            
            const nasaRes = await fetch(`https://power.larc.nasa.gov/api/temporal/daily/point?parameters=TS&community=AG&longitude=${lngCenter}&latitude=${latCenter}&start=${safeDateStr}&end=${safeDateStr}&format=JSON`);
            if (nasaRes.ok) {
                const nData = await nasaRes.json();
                const tsDict = nData.properties?.parameter?.TS;
                const tsVal = tsDict ? Object.values(tsDict)[0] : null;
                if (tsVal !== null && tsVal !== -999.0) {
                    liveLstBase = tsVal;
                    await logToTerminal(`[API] [SUCCESS] Overwrote LST baseline with live NASA POWER satellite data: ${liveLstBase.toFixed(1)}°C`, 'success', 200);
                }
            }
        } catch (e) {
            // Silently fallback to Open-Meteo LST proxy
        }

        // Space out points based on resolution
        const latStepDeg = selectedRes / 111320.0;
        const lngStepDeg = selectedRes / (111320.0 * Math.cos(latCenter * Math.PI / 180.0));

        // Generate grid nodes
        const points = [];
        for (let lat = minLat; lat <= maxLat; lat += latStepDeg) {
            for (let lng = minLng; lng <= maxLng; lng += lngStepDeg) {
                points.push({ lat, lng });
            }
        }

        // Apply cartographic generalization to avoid crash
        const maxLimit = 1000;
        let finalPoints = points;
        if (points.length > maxLimit) {
            const factor = Math.ceil(points.length / maxLimit);
            finalPoints = points.filter((_, idx) => idx % factor === 0);
        }

        const features = [];
        const csvRows = [];
        const csvHeaders = ['latitude', 'longitude', 'x_epsg3857', 'y_epsg3857', ...selectedVars];
        csvRows.push(csvHeaders.join(','));

        finalPoints.forEach(pt => {
            const [xMerc, yMerc] = wgs84ToWebMercator(pt.lat, pt.lng);
            const distCenter = Math.sqrt(Math.pow(pt.lat - latCenter, 2) + Math.pow(pt.lng - (minLng + maxLng) / 2.0, 2));

            const properties = {
                x_epsg3857: parseFloat(xMerc.toFixed(2)),
                y_epsg3857: parseFloat(yMerc.toFixed(2))
            };

            const csvValues = [
                pt.lat.toFixed(6),
                pt.lng.toFixed(6),
                xMerc.toFixed(2),
                yMerc.toFixed(2)
            ];

            // Scientific math simulation matching geomesh.py (incorporating live telemetries)
            if (selectedVars.includes('ndvi')) {
                let base = region.base_ndvi;
                if (liveHumidityBase !== null) {
                    const humidityFactor = (liveHumidityBase - 20.0) / 100.0;
                    const precipFactor = Math.min(2.0, livePrecipBase || 0.0) / 2.0;
                    base = Math.max(0.02, Math.min(0.90, base + 0.08 * humidityFactor + 0.12 * precipFactor));
                }
                const variation = 0.08 * Math.sin(pt.lat * 150) * Math.cos(pt.lng * 150);
                const urbanEffect = distCenter < 0.15 ? -0.04 : 0.02;
                const val = Math.max(0.01, Math.min(0.92, base + variation + urbanEffect));
                properties.ndvi = parseFloat(val.toFixed(4));
                csvValues.push(properties.ndvi);
            }
            
            if (selectedVars.includes('lst')) {
                const base = liveLstBase !== null ? liveLstBase : region.base_lst;
                const ndvi = properties.ndvi || region.base_ndvi;
                const uhi = 3.5 * (1.0 - Math.min(1.0, distCenter / 0.4));
                const cooling = -6.0 * ndvi;
                const val = base + uhi + cooling + 1.2 * Math.sin(pt.lat * 80);
                properties.lst = parseFloat(val.toFixed(1));
                csvValues.push(properties.lst);
            }
            
            if (selectedVars.includes('no2')) {
                const base = liveNo2Base !== null ? liveNo2Base : region.base_no2;
                const conc = 25.0 * Math.exp(-Math.pow(distCenter, 2) / 0.08);
                const val = base + conc + 3.0 * Math.cos(pt.lng * 200);
                properties.no2 = parseFloat(Math.max(0.5, val).toFixed(2));
                csvValues.push(properties.no2);
            }
            
            if (selectedVars.includes('population')) {
                const base = region.base_pop;
                const density = base * Math.exp(-distCenter / 0.12);
                const val = Math.round(density + Math.random() * 5);
                properties.population = Math.max(0, val);
                csvValues.push(properties.population);
            }

            features.push({
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: [parseFloat(pt.lng.toFixed(6)), parseFloat(pt.lat.toFixed(6))]
                },
                properties: properties
            });

            csvRows.push(csvValues.join(','));
        });

        generatedGeoJson = {
            type: "FeatureCollection",
            metadata: {
                region: selectedRegionKey,
                region_name_ar: region.name_ar,
                resolution_meters: selectedRes,
                variables: selectedVars,
                point_count: features.length,
                crs: "EPSG:4326 (WGS 84)",
                projected_crs_properties: "EPSG:3857 (Web Mercator)",
                license: "Creative Commons Attribution 4.0 International (CC-BY-4.0)",
                last_update: new Date().toISOString().replace('T', ' ').substring(0, 19),
                sources: {
                    ndvi: "NASA POWER / Open-Meteo Climate Grid (Dynamic Evapotranspirative greenness) - 250m Resolution [Source: https://power.larc.nasa.gov]",
                    lst: "NASA POWER Earth Skin Temperature (TS) / Open-Meteo downscaled - 30m Resolution [Source: https://power.larc.nasa.gov]",
                    no2: "Open-Meteo Atmospheric Copernicus CAMS (Nitrogen Dioxide) - 100m Resolution [Source: https://open-meteo.com]",
                    population: "Saudi census grid (Simulated spatial models) - 100m Resolution"
                }
            },
            features: features
        };

        generatedCsv = csvRows.join('\n');
        return features.length;
    }

    // Logger simulator for streaming high-tech geoprocessing feedback
    function logToTerminal(message, type = 'muted', delay = 0) {
        return new Promise(resolve => {
            setTimeout(() => {
                if (!consoleBody) {
                    resolve();
                    return;
                }
                const line = document.createElement('div');
                line.className = `console-line text-${type}`;
                line.textContent = message;
                consoleBody.appendChild(line);
                consoleBody.scrollTop = consoleBody.scrollHeight;
                resolve();
            }, delay);
        });
    }

    // Play button callback
    if (runPythonBtn) {
        runPythonBtn.addEventListener('click', async () => {
            // UI States Reset
            runPythonBtn.disabled = true;
            runPythonBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري تشغيل البرمجية...';
            if (consoleFooter) consoleFooter.style.display = 'none';
            if (consoleBody) consoleBody.innerHTML = '';
            
            if (consoleStatus) {
                consoleStatus.innerHTML = '<i class="fa-solid fa-circle text-warn animate-pulse"></i> Processing';
                consoleStatus.style.color = 'var(--color-accent)';
            }

            // Sync selections
            updateSelectedVariables();
            if (selectedVars.length === 0) {
                await logToTerminal("[ERROR] خطأ مساحي: لم يتم تحديد أي طبقات جغرافية للمواءمة! الرجاء اختيار متغير واحد على الأقل.", 'error', 0);
                runPythonBtn.disabled = false;
                runPythonBtn.innerHTML = '<i class="fa-solid fa-play"></i> تشغيل الكود البرمجي (Run SDK)';
                if (consoleStatus) {
                    consoleStatus.innerHTML = '<i class="fa-solid fa-circle text-error"></i> Error';
                    consoleStatus.style.color = '#f43f5e';
                }
                return;
            }

            // Stream compiler setup
            await logToTerminal("Connecting to Python Sandbox Kernel (127.0.0.1:8000)...", 'muted', 200);
            await logToTerminal("Loading local SDK environment module: geomesh.py...", 'info', 400);

            // Attempt FastAPI call
            let backendSuccess = false;
            let responseData = null;

            try {
                const response = await fetch('http://127.0.0.1:8000/api/geomesh', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        region: selectedRegionKey,
                        resolution: selectedRes,
                        variables: selectedVars,
                        format: "geojson"
                    })
                });

                if (response.ok) {
                    responseData = await response.json();
                    backendSuccess = responseData.success;
                }
            } catch (err) {
                // Backend not running, which is completely expected in web production
                backendSuccess = false;
            }

            if (backendSuccess && responseData) {
                // Stream backend-sourced logs to UI terminal
                for (const logLine of responseData.logs) {
                    let logType = 'info';
                    if (logLine.includes('[SUCCESS]')) logType = 'success';
                    if (logLine.includes('[WARN]')) logType = 'warn';
                    await logToTerminal(logLine, logType, 300);
                }

                generatedGeoJson = responseData.data;

                // Call backend again for CSV to support both downloads
                try {
                    const csvResponse = await fetch('http://127.0.0.1:8000/api/geomesh', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            region: selectedRegionKey,
                            resolution: selectedRes,
                            variables: selectedVars,
                            format: "csv"
                        })
                    });
                    if (csvResponse.ok) {
                        const csvData = await csvResponse.json();
                        generatedCsv = csvData.data;
                    }
                } catch (e) {
                    generatedCsv = "";
                }
                
                await logToTerminal("[FASTAPI BACKEND] Successfully retrieved live geoprocessing packet from uvicorn server.", 'success', 200);
            } else {
                // Execute Browser Fallback compiler
                await logToTerminal("[WARNING] Local FastAPI backend unreachable. Swapping to high-performance client-side fallback compiler...", 'warn', 300);
                await logToTerminal("[SDK] Running coordinate grid interpolation algorithm...", 'info', 400);
                
                const pointsCount = await runClientSideCompilation();
                
                await logToTerminal(`[SDK] Grid projected into EPSG:3857 successfully. Harmonized ${pointsCount} active coordinates.`, 'info', 500);
                await logToTerminal(`[SDK] Generalized multi-sensor grids to ${selectedRes}m spacing.`, 'info', 300);
                await logToTerminal(`[SUCCESS] Geoprocessing run complete. Compiled GeoJSON spatial vector package.`, 'success', 400);
            }

            // Reveal download links
            if (consoleFooter) {
                consoleFooter.style.display = 'block';
            }

            if (consoleStatus) {
                consoleStatus.innerHTML = '<i class="fa-solid fa-circle text-success"></i> Success';
                consoleStatus.style.color = 'var(--color-primary)';
            }

            runPythonBtn.disabled = false;
            runPythonBtn.innerHTML = '<i class="fa-solid fa-rotate-left"></i> إعادة تشغيل الكود البرمجي';
        });
    }

    // Download handlers using browser Object URLs
    if (downloadJsonBtn) {
        downloadJsonBtn.addEventListener('click', () => {
            if (!generatedGeoJson) return;
            const blob = new Blob([JSON.stringify(generatedGeoJson, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `geomesh_${selectedRegionKey}_${selectedRes}m.geojson`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    }

    if (downloadCsvBtn) {
        downloadCsvBtn.addEventListener('click', () => {
            if (!generatedCsv) return;
            const blob = new Blob([generatedCsv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `geomesh_${selectedRegionKey}_${selectedRes}m.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    }

    // Initial load preview render
    updatePythonPreview();

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
    // 10. Riyadh Spatial Analytics Dashboard Controller
    // ==========================================================================
    let riyadhMap = null;
    let riyadhPointsLayer = L.layerGroup();
    let riyadhHeatLayer = null;
    let riyadhRawData = [];
    let riyadhFilteredFeatures = [];
    
    let activeVar = 'lst'; // 'lst', 'ndvi', 'population'
    let activeMode = 'grid'; // 'grid', 'heatmap'
    
    // Default Filter Ranges
    const dashboardFilters = {
        lstMin: 20,
        lstMax: 60,
        ndviMin: -0.1,
        ndviMax: 0.6,
        popMin: 0,
        popMax: 1500
    };

    // Color Helpers
    function getLstColor(val) {
        if (val < 30) return '#3b82f6'; // Blue (Cool)
        if (val < 38) return '#10b981'; // Emerald (Moderate)
        if (val < 44) return '#fbbf24'; // Amber (Warm)
        if (val < 50) return '#f97316'; // Orange (Hot)
        return '#ef4444'; // Red (Extreme Hot)
    }

    function getNdviColor(val) {
        if (val < 0.05) return '#b45309'; // Brown (Barren/Sand)
        if (val < 0.15) return '#fbbf24'; // Yellow (Very sparse veg)
        if (val < 0.3) return '#a3e635'; // Lime (Sparse veg)
        if (val < 0.45) return '#4ade80'; // Light Green (Moderate veg)
        return '#16a34a'; // Green (Dense vegetation)
    }

    function getPopColor(val) {
        if (val < 10) return 'rgba(255, 255, 255, 0.06)'; // Empty/Very Low
        if (val < 150) return '#bae6fd'; // Light Blue
        if (val < 500) return '#7dd3fc'; // Sky Blue
        if (val < 1000) return '#0284c7'; // Medium Blue
        return '#0369a1'; // Deep Blue
    }

    function getColorForVariable(val, variable) {
        if (variable === 'lst') return getLstColor(val);
        if (variable === 'ndvi') return getNdviColor(val);
        return getPopColor(val);
    }

    // Initialize Riyadh Map
    function initRiyadhMap() {
        const mapContainer = document.getElementById('riyadhMap');
        if (!mapContainer || riyadhMap) return;

        // Create Map
        riyadhMap = L.map('riyadhMap', {
            center: [24.65, 46.72],
            zoom: 11,
            preferCanvas: true,
            zoomControl: true,
            scrollWheelZoom: false // disable scrolling by accident
        });

        // Add CartoDB Dark Base Layer
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            maxZoom: 20
        }).addTo(riyadhMap);

        riyadhPointsLayer.addTo(riyadhMap);
    }

    // Fetch GeoJSON Dataset
    function loadRiyadhDataset() {
        fetch('data/geomesh_riyadh_100m.geojson')
            .then(res => {
                if (!res.ok) throw new Error('Failed to load spatial dataset');
                return res.json();
            })
            .then(data => {
                riyadhRawData = data.features;
                riyadhFilteredFeatures = [...riyadhRawData];
                
                // Initialize Map & Render
                initRiyadhMap();
                updateDashboard();
            })
            .catch(err => {
                console.error('Error loading spatial data:', err);
                const mapContainer = document.getElementById('riyadhMap');
                if (mapContainer) {
                    mapContainer.innerHTML = `<div class="error-placeholder" style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--color-text-muted);"><i class="fa-solid fa-triangle-exclamation text-error" style="margin-left:8px;"></i> حدث خطأ أثناء تحميل بيانات المرصد الجغرافي.</div>`;
                }
            });
    }

    // Update KPI & Calculations
    function updateKPIs() {
        const count = riyadhFilteredFeatures.length;
        const totalRaw = riyadhRawData.length;
        
        // Calculate percentages
        const percent = totalRaw > 0 ? (count / totalRaw) * 100 : 0;
        
        // Compute averages
        let sumLst = 0;
        let sumNdvi = 0;
        let totalPop = 0;
        
        riyadhFilteredFeatures.forEach(f => {
            sumLst += f.properties.lst || 0;
            sumNdvi += f.properties.ndvi || 0;
            totalPop += f.properties.population || 0;
        });
        
        const avgLst = count > 0 ? (sumLst / count) : 0;
        const avgNdvi = count > 0 ? (sumNdvi / count) : 0;
        
        // Update DOM elements
        document.getElementById('kpi-active-points').textContent = count.toLocaleString('ar-EG');
        document.getElementById('kpi-active-percent').textContent = `${percent.toFixed(0)}% من إجمالي المرصد`;
        document.getElementById('kpi-progress-points').style.width = `${percent}%`;
        
        if (count > 0) {
            document.getElementById('kpi-avg-lst').textContent = `${avgLst.toFixed(1)} °م`;
            // Calculate a relative progress percentage for LST (20 to 60 scale)
            const lstProgress = Math.max(0, Math.min(100, ((avgLst - 20) / 40) * 100));
            document.getElementById('kpi-progress-lst').style.width = `${lstProgress}%`;
            
            document.getElementById('kpi-avg-ndvi').textContent = avgNdvi.toFixed(4);
            // Calculate relative progress for NDVI (-0.1 to 0.6 scale)
            const ndviProgress = Math.max(0, Math.min(100, ((avgNdvi + 0.1) / 0.7) * 100));
            document.getElementById('kpi-progress-ndvi').style.width = `${ndviProgress}%`;
            
            document.getElementById('kpi-total-pop').textContent = totalPop.toLocaleString('ar-EG');
            // Calculate relative population progress (max capped at 500,000 for visuals)
            const popProgress = Math.min(100, (totalPop / 500000) * 100);
            document.getElementById('kpi-progress-pop').style.width = `${popProgress}%`;
        } else {
            document.getElementById('kpi-avg-lst').textContent = '--.- °م';
            document.getElementById('kpi-progress-lst').style.width = '0%';
            document.getElementById('kpi-avg-ndvi').textContent = '-.----';
            document.getElementById('kpi-progress-ndvi').style.width = '0%';
            document.getElementById('kpi-total-pop').textContent = '٠';
            document.getElementById('kpi-progress-pop').style.width = '0%';
        }
    }

    // Render Point Circles
    function renderPointGrid() {
        riyadhPointsLayer.clearLayers();
        if (riyadhHeatLayer) {
            riyadhMap.removeLayer(riyadhHeatLayer);
            riyadhHeatLayer = null;
        }

        riyadhFilteredFeatures.forEach(feature => {
            const coords = feature.geometry.coordinates; // [lon, lat]
            const prop = feature.properties;
            const val = prop[activeVar];
            
            // Format popups
            const popupContent = `
                <div style="direction:rtl; text-align:right; font-family:'Cairo',sans-serif; font-size:0.82rem; min-width:180px;">
                    <h4 style="margin:0 0 6px 0; color:var(--color-secondary); font-size:0.9rem;">📍 تفاصيل الخلية المساحية</h4>
                    <hr style="border:0; border-top:1px solid rgba(255,255,255,0.08); margin:4px 0;">
                    <div>🌡️ <strong>درجة الحرارة (LST):</strong> ${prop.lst.toFixed(1)} °م</div>
                    <div>🌱 <strong>الغطاء النباتي (NDVI):</strong> ${prop.ndvi.toFixed(4)}</div>
                    <div>👥 <strong>السكان بالخلية:</strong> ${prop.population.toLocaleString('ar-EG')} نسمة</div>
                    <hr style="border:0; border-top:1px solid rgba(255,255,255,0.08); margin:4px 0;">
                    <div style="font-size:0.7rem; color:var(--color-text-muted); font-family:monospace; direction:ltr; text-align:left;">
                        Coords: ${coords[1].toFixed(5)}, ${coords[0].toFixed(5)}
                    </div>
                </div>
            `;

            const color = getColorForVariable(val, activeVar);
            
            const marker = L.circleMarker([coords[1], coords[0]], {
                radius: activeVar === 'population' && val > 0 ? Math.max(3.5, Math.min(8, val / 150)) : 4.5,
                fillColor: color,
                color: '#070b13',
                weight: 0.8,
                opacity: 0.9,
                fillOpacity: activeVar === 'population' && val === 0 ? 0.15 : 0.85
            }).bindPopup(popupContent);

            riyadhPointsLayer.addLayer(marker);
        });
    }

    // Render Heatmap Layer
    function renderHeatmap() {
        riyadhPointsLayer.clearLayers();
        if (riyadhHeatLayer) {
            riyadhMap.removeLayer(riyadhHeatLayer);
        }

        // Structure heat points: [lat, lon, intensity]
        const heatPoints = riyadhFilteredFeatures.map(feature => {
            const coords = feature.geometry.coordinates;
            const prop = feature.properties;
            let intensity = 0.5;

            if (activeVar === 'lst') {
                // scale temperature 20-60 to 0-1
                intensity = Math.max(0.1, (prop.lst - 20) / 40);
            } else if (activeVar === 'ndvi') {
                // scale ndvi -0.1 to 0.6 to 0-1
                intensity = Math.max(0.1, (prop.ndvi + 0.1) / 0.7) * 1.5;
            } else if (activeVar === 'population') {
                // scale population 0-1500 to 0-1
                intensity = Math.max(0.1, prop.population / 400);
            }

            return [coords[1], coords[0], intensity];
        });

        // Gradient options
        let grad = { 0.4: 'blue', 0.65: 'lime', 1.0: 'red' };
        if (activeVar === 'ndvi') {
            grad = { 0.4: '#d97706', 0.7: '#a3e635', 1.0: '#16a34a' };
        } else if (activeVar === 'population') {
            grad = { 0.4: '#bae6fd', 0.7: '#7dd3fc', 1.0: '#0369a1' };
        }

        riyadhHeatLayer = L.heatLayer(heatPoints, {
            radius: 26,
            blur: 18,
            maxZoom: 16,
            gradient: grad
        }).addTo(riyadhMap);
    }

    // Update Interactive Legend
    function updateLegend() {
        const titleText = document.getElementById('legend-title-text');
        const scaleBars = document.getElementById('legend-scale-bars');
        if (!titleText || !scaleBars) return;

        scaleBars.innerHTML = '';

        if (activeVar === 'lst') {
            titleText.innerHTML = `<i class="fa-solid fa-temperature-high text-orange"></i> درجات الحرارة السطحية LST`;
            const intervals = [
                { val: 'أقل من ٣٠ °م', color: '#3b82f6' },
                { val: '٣٠ - ٣٨ °م', color: '#10b981' },
                { val: '٣٨ - ٤٤ °م', color: '#fbbf24' },
                { val: '٤٤ - ٥٠ °م', color: '#f97316' },
                { val: 'أكثر من ٥٠ °م', color: '#ef4444' }
            ];
            intervals.forEach(item => {
                scaleBars.innerHTML += `
                    <div class="legend-row">
                        <span class="legend-val">${item.val}</span>
                        <div class="legend-color" style="background:${item.color};"></div>
                    </div>
                `;
            });
        } else if (activeVar === 'ndvi') {
            titleText.innerHTML = `<i class="fa-solid fa-seedling text-emerald"></i> مؤشر الغطاء النباتي NDVI`;
            const intervals = [
                { val: 'أقل من ٠.٠٥ (تربة رملية)', color: '#b45309' },
                { val: '٠.٠٥ - ٠.١٥ (جاف خفيف)', color: '#fbbf24' },
                { val: '٠.١٥ - ٠.٣٠ (غطاء خفيف)', color: '#a3e635' },
                { val: '٠.٣٠ - ٠.٤٥ (غطاء متوسط)', color: '#4ade80' },
                { val: 'أكثر من ٠.٤٥ (غطاء كثيف)', color: '#16a34a' }
            ];
            intervals.forEach(item => {
                scaleBars.innerHTML += `
                    <div class="legend-row">
                        <span class="legend-val">${item.val}</span>
                        <div class="legend-color" style="background:${item.color};"></div>
                    </div>
                `;
            });
        } else if (activeVar === 'population') {
            titleText.innerHTML = `<i class="fa-solid fa-users text-cyan"></i> الكثافة السكانية (الخلية)`;
            const intervals = [
                { val: 'شبه خالية (أقل من ١٠)', color: 'rgba(255,255,255,0.06)' },
                { val: 'منخفضة جداً (١٠ - ١٥٠)', color: '#bae6fd' },
                { val: 'منخفضة (١٥٠ - ٥٠٠)', color: '#7dd3fc' },
                { val: 'متوسطة (٥٠٠ - ١٠٠٠)', color: '#0284c7' },
                { val: 'كثيفة (أكثر من ١٠٠٠)', color: '#0369a1' }
            ];
            intervals.forEach(item => {
                scaleBars.innerHTML += `
                    <div class="legend-row">
                        <span class="legend-val">${item.val}</span>
                        <div class="legend-color" style="background:${item.color};"></div>
                    </div>
                `;
            });
        }
    }

    // Master Dashboard Render update
    function updateDashboard() {
        if (!riyadhMap || riyadhRawData.length === 0) return;

        updateKPIs();

        if (activeMode === 'grid') {
            renderPointGrid();
        } else {
            renderHeatmap();
        }

        updateLegend();
    }

    // Debounced Filtering logic
    let filterTimeout = null;
    function filterDashboardData() {
        if (filterTimeout) clearTimeout(filterTimeout);
        
        filterTimeout = setTimeout(() => {
            requestAnimationFrame(() => {
                riyadhFilteredFeatures = riyadhRawData.filter(feature => {
                    const prop = feature.properties;
                    const matchLst = prop.lst >= dashboardFilters.lstMin && prop.lst <= dashboardFilters.lstMax;
                    const matchNdvi = prop.ndvi >= dashboardFilters.ndviMin && prop.ndvi <= dashboardFilters.ndviMax;
                    const matchPop = prop.population >= dashboardFilters.popMin && prop.population <= dashboardFilters.popMax;
                    return matchLst && matchNdvi && matchPop;
                });
                
                updateDashboard();
            });
        }, 60);
    }

    // Sliders Dual Controls Sync
    function setupDualSliders(minId, maxId, valLabelId, filterMinKey, filterMaxKey, unit = '') {
        const minInput = document.getElementById(minId);
        const maxInput = document.getElementById(maxId);
        const label = document.getElementById(valLabelId);

        if (!minInput || !maxInput || !label) return;

        function updateLabels() {
            let minVal = parseFloat(minInput.value);
            let maxVal = parseFloat(maxInput.value);

            if (minVal > maxVal) {
                // Swap values to prevent handles crossing
                const temp = minVal;
                minVal = maxVal;
                maxInput.value = temp;
                minInput.value = maxVal;
            }

            dashboardFilters[filterMinKey] = minVal;
            dashboardFilters[filterMaxKey] = maxVal;

            label.textContent = `${minVal.toLocaleString('en-US')}${unit} - ${maxVal.toLocaleString('en-US')}${unit}`;
            filterDashboardData();
        }

        minInput.addEventListener('input', updateLabels);
        maxInput.addEventListener('input', updateLabels);
    }

    // Trigger Initial Fetch if the dashboard section exists in DOM
    const dashboardSection = document.getElementById('riyadh-dashboard');
    if (dashboardSection) {
        loadRiyadhDataset();

        // 1. Setup Dual Sliders
        setupDualSliders('lst-min', 'lst-max', 'slider-lst-val', 'lstMin', 'lstMax', '°م');
        setupDualSliders('ndvi-min', 'ndvi-max', 'slider-ndvi-val', 'ndviMin', 'ndviMax', '');
        setupDualSliders('pop-min', 'pop-max', 'slider-pop-val', 'popMin', 'popMax', ' نسمة');

        // 2. Variable Buttons Listeners
        const varButtons = document.querySelectorAll('.var-btn');
        varButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                varButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                activeVar = btn.getAttribute('data-var');
                updateDashboard();
            });
        });

        // 3. View Mode Toggles Listeners
        const viewToggles = document.querySelectorAll('.view-toggle-btn');
        viewToggles.forEach(toggle => {
            toggle.addEventListener('click', () => {
                viewToggles.forEach(t => t.classList.remove('active'));
                toggle.classList.add('active');
                
                activeMode = toggle.getAttribute('data-mode');
                updateDashboard();
            });
        });

        // 4. Reset Filters Button
        const resetBtn = document.getElementById('reset-dashboard-filters');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                document.getElementById('lst-min').value = 20;
                document.getElementById('lst-max').value = 60;
                document.getElementById('ndvi-min').value = -0.1;
                document.getElementById('ndvi-max').value = 0.6;
                document.getElementById('pop-min').value = 0;
                document.getElementById('pop-max').value = 1500;

                dashboardFilters.lstMin = 20;
                dashboardFilters.lstMax = 60;
                dashboardFilters.ndviMin = -0.1;
                dashboardFilters.ndviMax = 0.6;
                dashboardFilters.popMin = 0;
                dashboardFilters.popMax = 1500;

                document.getElementById('slider-lst-val').textContent = '20°م - 60°م';
                document.getElementById('slider-ndvi-val').textContent = '-0.1 - 0.6';
                document.getElementById('slider-pop-val').textContent = '0 - 1,500 نسمة';

                filterDashboardData();
            });
        }

        // 5. Exporter: GeoJSON
        const exportGeojsonBtn = document.getElementById('export-geojson');
        if (exportGeojsonBtn) {
            exportGeojsonBtn.addEventListener('click', () => {
                if (riyadhFilteredFeatures.length === 0) {
                    alert('لا توجد بيانات مفلترة لتصديرها!');
                    return;
                }

                const fc = {
                    type: "FeatureCollection",
                    metadata: {
                        region: "riyadh",
                        region_name_ar: "منطقة الرياض (تصفية مخصصة)",
                        filtered_count: riyadhFilteredFeatures.length,
                        export_time: new Date().toISOString()
                    },
                    features: riyadhFilteredFeatures
                };

                const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fc, null, 2));
                const downloadAnchor = document.createElement('a');
                downloadAnchor.setAttribute("href", dataStr);
                downloadAnchor.setAttribute("download", `riyadh_filtered_observatory_${activeVar}.geojson`);
                document.body.appendChild(downloadAnchor);
                downloadAnchor.click();
                downloadAnchor.remove();
            });
        }

        // 6. Exporter: CSV
        const exportCsvBtn = document.getElementById('export-csv');
        if (exportCsvBtn) {
            exportCsvBtn.addEventListener('click', () => {
                if (riyadhFilteredFeatures.length === 0) {
                    alert('لا توجد بيانات مفلترة لتصديرها!');
                    return;
                }

                // Write header
                let csvContent = "Longitude,Latitude,Projected_X_3857,Projected_Y_3857,LST_Celsius,NDVI,Population_Cell\n";
                
                riyadhFilteredFeatures.forEach(feature => {
                    const coords = feature.geometry.coordinates;
                    const prop = feature.properties;
                    csvContent += `${coords[0]},${coords[1]},${prop.x_epsg3857},${prop.y_epsg3857},${prop.lst},${prop.ndvi},${prop.population}\n`;
                });

                const dataStr = "data:text/csv;charset=utf-8,\uFEFF" + encodeURIComponent(csvContent); // prepend UTF-8 BOM for Excel Arabic layout
                const downloadAnchor = document.createElement('a');
                downloadAnchor.setAttribute("href", dataStr);
                downloadAnchor.setAttribute("download", `riyadh_filtered_observatory_${activeVar}.csv`);
                document.body.appendChild(downloadAnchor);
                downloadAnchor.click();
                downloadAnchor.remove();
            });
        }
    }

    // ==========================================================================
    // 15. Interactive Spatial Simulation Lab (Turf.js & Leaflet)
    // ==========================================================================
    let spatialLabMap = null;
    let labCenterPoint = [24.7136, 46.6753]; // Lat, Lng WGS84 for central Riyadh
    let activeLabTool = 'buffer'; // 'buffer', 'overlay', 'join'
    let bufferType = 'point'; // 'point', 'line'
    let activeOverlayAction = 'intersect'; // 'intersect', 'difference', 'union'
    
    // Leaflet Layers
    let labLayersGroup = L.layerGroup();
    let labCenterMarker = null;

    // Elements
    const spatialLabMapEl = document.getElementById('spatialLabMap');
    const bufferDistanceSlider = document.getElementById('buffer-distance-slider');
    const bufferValLabel = document.getElementById('buffer-val-label');
    const joinPointsSlider = document.getElementById('join-points-slider');
    const joinPointsLabel = document.getElementById('join-points-label');
    
    const bufferDrawPointBtn = document.getElementById('buffer-draw-point');
    const bufferDrawLineBtn = document.getElementById('buffer-draw-line');
    const btnRegenerateJoin = document.getElementById('btn-regenerate-join');
    
    const labToolBtns = document.querySelectorAll('.lab-tool-btn');
    const labParamGroups = document.querySelectorAll('.lab-param-group');
    const labOverlayActionBtns = document.querySelectorAll('.lab-overlay-action-btn');
    const labStatArea = document.getElementById('lab-stat-area');
    const labExtraStats = document.getElementById('lab-extra-stats');

    function initSpatialLabMap() {
        if (!spatialLabMapEl || spatialLabMap) return;

        spatialLabMap = L.map('spatialLabMap', {
            center: labCenterPoint,
            zoom: 13,
            preferCanvas: true,
            zoomControl: true,
            scrollWheelZoom: false
        });

        // Dark cartodb tiles to match dashboard layout
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            maxZoom: 20
        }).addTo(spatialLabMap);

        labLayersGroup.addTo(spatialLabMap);

        // Click on map: shift the analysis center point
        spatialLabMap.on('click', (e) => {
            labCenterPoint = [e.latlng.lat, e.latlng.lng];
            runLabAnalysis();
        });

        // Initial analysis trigger
        runLabAnalysis();
    }

    function runLabAnalysis() {
        if (!spatialLabMap || typeof turf === 'undefined') return;

        // Clear past visual layers
        labLayersGroup.clearLayers();

        // Custom neon glowing center icon
        const centerIcon = L.divIcon({
            className: 'custom-center-icon',
            html: `<div style="width: 14px; height: 14px; border-radius: 50%; background: #00f2fe; border: 2px solid #fff; box-shadow: 0 0 10px #00f2fe;"></div>`,
            iconSize: [14, 14],
            iconAnchor: [7, 7]
        });

        // Draw analysis center
        labCenterMarker = L.marker(labCenterPoint, { icon: centerIcon, zIndexOffset: 1000 }).addTo(labLayersGroup);

        if (activeLabTool === 'buffer') {
            const distance = parseInt(bufferDistanceSlider.value);
            bufferValLabel.textContent = `${distance} متر`;

            if (bufferType === 'point') {
                const pt = turf.point([labCenterPoint[1], labCenterPoint[0]]);
                const buffered = turf.buffer(pt, distance, { units: 'meters' });
                const area = turf.area(buffered);

                L.geoJSON(buffered, {
                    style: {
                        color: '#00f2fe',
                        fillColor: '#00f2fe',
                        fillOpacity: 0.12,
                        weight: 2,
                        dashArray: '4, 4'
                    }
                }).addTo(labLayersGroup);

                const areaSqKm = area / 1000000;
                labStatArea.textContent = `${areaSqKm.toFixed(3)} كم² (${(areaSqKm * 100).toFixed(1)} هكتار)`;
                labExtraStats.innerHTML = `<span style="color: var(--color-text-muted);">نصف القطر:</span> <span class="font-mono text-secondary">${distance} م</span>`;
            } 
            else if (bufferType === 'line') {
                const lng = labCenterPoint[1];
                const lat = labCenterPoint[0];
                const lineCoords = [
                    [lng - 0.015, lat - 0.005],
                    [lng, lat],
                    [lng + 0.015, lat + 0.01]
                ];
                const line = turf.lineString(lineCoords);
                const buffered = turf.buffer(line, distance, { units: 'meters' });
                const area = turf.area(buffered);

                L.geoJSON(line, { style: { color: '#eab308', weight: 4 } }).addTo(labLayersGroup);
                
                L.geoJSON(buffered, {
                    style: {
                        color: '#00f2fe',
                        fillColor: '#00f2fe',
                        fillOpacity: 0.12,
                        weight: 1.5,
                        dashArray: '3, 3'
                    }
                }).addTo(labLayersGroup);

                const areaSqKm = area / 1000000;
                labStatArea.textContent = `${areaSqKm.toFixed(3)} كم²`;
                labExtraStats.innerHTML = `<span style="color: var(--color-text-muted);">طول المسار:</span> <span class="font-mono text-secondary">${(turf.length(line, {units:'kilometers'})).toFixed(2)} كم</span>`;
            }
        } 
        else if (activeLabTool === 'overlay') {
            const lng = labCenterPoint[1];
            const lat = labCenterPoint[0];

            // Overlay of two circles
            const ptA = turf.point([lng - 0.006, lat]);
            const ptB = turf.point([lng + 0.006, lat]);
            
            const polyA = turf.buffer(ptA, 800, { units: 'meters' });
            const polyB = turf.buffer(ptB, 800, { units: 'meters' });

            L.geoJSON(polyA, { style: { color: '#00f2fe', fillColor: '#00f2fe', fillOpacity: 0.05, weight: 1, dashArray: '3, 3' } }).addTo(labLayersGroup);
            L.geoJSON(polyB, { style: { color: '#ec4899', fillColor: '#ec4899', fillOpacity: 0.05, weight: 1, dashArray: '3, 3' } }).addTo(labLayersGroup);

            let result = null;
            let resultColor = '#eab308';
            let resultName = '';

            try {
                if (activeOverlayAction === 'intersect') {
                    result = turf.intersect(polyA, polyB);
                    resultColor = '#eab308';
                    resultName = 'التقاطع المشترك (Intersection)';
                } else if (activeOverlayAction === 'difference') {
                    result = turf.difference(polyA, polyB);
                    resultColor = '#10b981';
                    resultName = 'القص والفرق (Polygon A - B)';
                } else if (activeOverlayAction === 'union') {
                    result = turf.union(polyA, polyB);
                    resultColor = '#a855f7';
                    resultName = 'الاتحاد المساحي الكلي (Union)';
                }
            } catch (err) {
                console.error("Overlay calculation error: ", err);
            }

            if (result) {
                L.geoJSON(result, {
                    style: {
                        color: resultColor,
                        fillColor: resultColor,
                        fillOpacity: 0.25,
                        weight: 2
                    }
                }).addTo(labLayersGroup);

                const area = turf.area(result);
                const areaSqKm = area / 1000000;
                labStatArea.textContent = `${areaSqKm.toFixed(3)} كم²`;
                labExtraStats.innerHTML = `<span style="color: var(--color-text-muted);">العملية الحالية:</span> <span style="color:${resultColor}; font-weight:700;">${resultName}</span>`;
            } else {
                labStatArea.textContent = "0 كم² (لا يوجد تداخل)";
                labExtraStats.innerHTML = `<span style="color: #ef4444; font-weight:700;"><i class="fa-solid fa-circle-exclamation"></i> لا يوجد تقاطع مساحي!</span>`;
            }
        } 
        else if (activeLabTool === 'join') {
            const pointCount = parseInt(joinPointsSlider.value);
            joinPointsLabel.textContent = `${pointCount} نقطة`;

            const lng = labCenterPoint[1];
            const lat = labCenterPoint[0];

            const centerPt = turf.point([lng, lat]);
            const boundaryPoly = turf.buffer(centerPt, 1100, { units: 'meters' });

            L.geoJSON(boundaryPoly, {
                style: {
                    color: '#ec4899',
                    fillColor: 'transparent',
                    weight: 2,
                    dashArray: '6, 6'
                }
            }).addTo(labLayersGroup);

            const bbox = turf.bbox(boundaryPoly);
            const randomPts = turf.randomPoint(pointCount, { bbox: bbox });
            const ptsWithin = turf.pointsWithinPolygon(randomPts, boundaryPoly);
            
            const insideCount = ptsWithin.features.length;

            randomPts.features.forEach(feat => {
                const isInside = turf.booleanPointInPolygon(feat.geometry.coordinates, boundaryPoly);
                
                L.circleMarker([feat.geometry.coordinates[1], feat.geometry.coordinates[0]], {
                    radius: 5,
                    fillColor: isInside ? '#10b981' : '#ef4444',
                    color: '#fff',
                    weight: 1,
                    fillOpacity: 0.95
                }).bindPopup(`إحداثيات: ${feat.geometry.coordinates[1].toFixed(4)}, ${feat.geometry.coordinates[0].toFixed(4)}<br>الحالة: ${isInside ? 'داخل النطاق (Joined)' : 'خارج النطاق'}`).addTo(labLayersGroup);
            });

            labStatArea.textContent = `${insideCount} من ${pointCount} نقطة داخل النطاق`;
            
            let listHtml = `
                <div style="margin-top: 8px; max-height: 80px; overflow-y:auto; border-top:1px solid rgba(255,255,255,0.05); padding-top:6px;">
                    <table style="width:100%; font-size:0.75rem; text-align:right; border-collapse:collapse;">
                        <thead>
                            <tr style="color:#10b981; font-weight:700; border-bottom: 1px solid rgba(255,255,255,0.05);">
                                <th style="padding: 4px;">معرف النقطة</th>
                                <th style="padding: 4px;">البعد عن المركز</th>
                            </tr>
                        </thead>
                        <tbody>`;
            
            const limit = Math.min(insideCount, 3);
            for (let i = 0; i < limit; i++) {
                const pt = ptsWithin.features[i];
                const dist = turf.distance(centerPt, pt, { units: 'meters' });
                listHtml += `
                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.03);">
                        <td style="color:var(--color-text-white); padding: 4px;">Pt_${i+1}</td>
                        <td class="font-mono text-secondary style="padding: 4px;">${dist.toFixed(1)} م</td>
                    </tr>`;
            }
            if (insideCount > limit) {
                listHtml += `<tr><td colspan="2" style="text-align:center; color:var(--color-text-muted); font-size:0.7rem; padding: 4px;">+ ${insideCount - limit} نقاط أخرى منضمة...</td></tr>`;
            }
            if (insideCount === 0) {
                listHtml += `<tr><td colspan="2" style="text-align:center; color:#ef4444; font-size:0.7rem; padding: 4px;">لا توجد نقاط منضمة</td></tr>`;
            }
            
            listHtml += `</tbody></table></div>`;
            labExtraStats.innerHTML = `<span style="color: var(--color-text-muted);">نسبة الانضمام:</span> <span class="font-mono text-secondary">${((insideCount / pointCount) * 100).toFixed(0)}%</span>` + listHtml;
        }
    }

    // Tools Toggling Event Listeners
    labToolBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            labToolBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const tool = btn.dataset.tool;
            activeLabTool = tool;

            labParamGroups.forEach(p => p.style.display = 'none');
            const activeGroup = document.getElementById(`param-group-${tool}`);
            if (activeGroup) activeGroup.style.display = 'block';

            if (labExtraStats) labExtraStats.innerHTML = '';

            runLabAnalysis();
        });
    });

    // Action overlay clicks
    labOverlayActionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            labOverlayActionBtns.forEach(b => {
                b.classList.remove('active');
                b.classList.add('btn-outline');
            });
            btn.classList.add('active');
            btn.classList.remove('btn-outline');

            activeOverlayAction = btn.dataset.action;
            runLabAnalysis();
        });
    });

    if (bufferDistanceSlider) {
        bufferDistanceSlider.addEventListener('input', runLabAnalysis);
    }
    if (joinPointsSlider) {
        joinPointsSlider.addEventListener('input', runLabAnalysis);
    }

    if (bufferDrawPointBtn && bufferDrawLineBtn) {
        bufferDrawPointBtn.addEventListener('click', () => {
            bufferType = 'point';
            bufferDrawPointBtn.classList.add('btn-secondary');
            bufferDrawPointBtn.classList.remove('btn-outline');
            bufferDrawLineBtn.classList.remove('btn-secondary');
            bufferDrawLineBtn.classList.add('btn-outline');
            runLabAnalysis();
        });
        
        bufferDrawLineBtn.addEventListener('click', () => {
            bufferType = 'line';
            bufferDrawLineBtn.classList.add('btn-secondary');
            bufferDrawLineBtn.classList.remove('btn-outline');
            bufferDrawPointBtn.classList.remove('btn-secondary');
            bufferDrawPointBtn.classList.add('btn-outline');
            runLabAnalysis();
        });
    }

    if (btnRegenerateJoin) {
        btnRegenerateJoin.addEventListener('click', runLabAnalysis);
    }

    // Lazy load the Leaflet canvas map when the element intersects
    const spatialLabObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                initSpatialLabMap();
                spatialLabObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    if (spatialLabMapEl) {
        spatialLabObserver.observe(spatialLabMapEl);
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
});


