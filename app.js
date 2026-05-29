/**
 * GeoHub - Core Application Logic (app.js)
 * Implements interactivity, GIS layer simulation, data inspection, and dynamic filtering.
 * Bilingual zero-latency language switcher engine integrated.
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // 0. Bilingual Language Switcher Engine (Zero-Latency, Client-Side)
    // ==========================================================================
    let currentLang = localStorage.getItem('selectedLang') || 'ar';

    function switchLanguage(lang) {
        currentLang = lang;

        // 1. Update HTML root attributes for RTL/LTR and language
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

        // 2. Persist preference
        localStorage.setItem('selectedLang', lang);

        // 3. Translate all static [data-i18n] elements
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                el.innerHTML = translations[lang][key];
            }
        });

        // 4. Translate all [data-i18n-placeholder] elements
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (translations[lang] && translations[lang][key]) {
                el.placeholder = translations[lang][key];
            }
        });

        // 5. Swap language toggle button text
        const langText = document.querySelector('#langToggle .lang-text');
        if (langText) langText.textContent = lang === 'ar' ? 'EN' : 'العربية';

        // 6. Refresh the active converter tab dropzone labels
        refreshConverterDropzoneLabels();

        // 7. If a city is currently selected in the UTM Calculator, refresh its fields
        refreshUtmCalculatorFields();

        // 8. Translate UTM city selector options dynamically
        const citySelector = document.getElementById('citySelector');
        if (citySelector) {
            Array.from(citySelector.options).forEach(opt => {
                const val = opt.value;
                if (val && cityData[val] && cityData[val][lang]) {
                    opt.textContent = cityData[val][lang].name;
                }
            });
        }
    }

    // Bind the language toggle button
    const langToggleBtn = document.getElementById('langToggle');
    if (langToggleBtn) {
        langToggleBtn.addEventListener('click', () => {
            currentLang = currentLang === 'ar' ? 'en' : 'ar';
            switchLanguage(currentLang);
        });
    }

    // Helper: refresh converter dropzone labels for current language and active tab
    function refreshConverterDropzoneLabels() {
        const dropzoneTitleEl = document.getElementById('dropzone-title');
        const dropzoneDescEl = document.getElementById('dropzone-desc');
        const helpTextEl = document.getElementById('help-text-content');
        if (!dropzoneTitleEl) return;

        if (fileConverterMode === 'shp2geojson') {
            dropzoneTitleEl.textContent = translations[currentLang].dropzoneTitleShp;
            dropzoneDescEl.textContent = translations[currentLang].dropzoneDescShp;
            if (helpTextEl) helpTextEl.textContent = translations[currentLang].helpShp2GeoJson;
        } else if (fileConverterMode === 'csv2geojson') {
            dropzoneTitleEl.textContent = translations[currentLang].dropzoneTitleCsv;
            dropzoneDescEl.textContent = translations[currentLang].dropzoneDescCsv;
            if (helpTextEl) helpTextEl.textContent = translations[currentLang].helpCsv2GeoJson;
        } else if (fileConverterMode === 'geojson2csv') {
            dropzoneTitleEl.textContent = translations[currentLang].dropzoneTitleGeoJson;
            dropzoneDescEl.textContent = translations[currentLang].dropzoneDescGeoJson;
            if (helpTextEl) helpTextEl.textContent = translations[currentLang].helpGeoJson2Csv;
        }
    }

    // Helper: refresh UTM calculator fields when language changes
    function refreshUtmCalculatorFields() {
        const citySel = document.getElementById('citySelector');
        if (!citySel) return;
        const selectedKey = citySel.value;
        if (!selectedKey || !cityData[selectedKey]) return;

        const data = cityData[selectedKey][currentLang];
        if (!data) return;

        const resultCityEl = document.getElementById('resultCityName');
        const specMeridianEl = document.getElementById('specMeridian');
        const specUsageEl = document.getElementById('specUsage');
        const specNoteEl = document.getElementById('specNote');

        if (resultCityEl) resultCityEl.textContent = data.name;
        if (specMeridianEl) specMeridianEl.textContent = data.meridian;
        if (specUsageEl) specUsageEl.textContent = data.usage;
        if (specNoteEl) specNoteEl.textContent = data.note;
    }
    
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
                dropzoneTitle.textContent = translations[currentLang].dropzoneTitleShp;
                dropzoneDesc.textContent = translations[currentLang].dropzoneDescShp;
                dropzoneIcon.className = 'fa-solid fa-file-zipper';
                helpTextContent.textContent = translations[currentLang].helpShp2GeoJson;
                fileInput.accept = '.zip';
            } 
            else if (mode === 'csv2geojson') {
                dropzoneTitle.textContent = translations[currentLang].dropzoneTitleCsv;
                dropzoneDesc.textContent = translations[currentLang].dropzoneDescCsv;
                dropzoneIcon.className = 'fa-solid fa-file-csv';
                helpTextContent.textContent = translations[currentLang].helpCsv2GeoJson;
                fileInput.accept = '.csv';
            } 
            else if (mode === 'geojson2csv') {
                dropzoneTitle.textContent = translations[currentLang].dropzoneTitleGeoJson;
                dropzoneDesc.textContent = translations[currentLang].dropzoneDescGeoJson;
                dropzoneIcon.className = 'fa-solid fa-file-code';
                helpTextContent.textContent = translations[currentLang].helpGeoJson2Csv;
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
            outputFilename.innerHTML = '<i class="fa-solid fa-file-code"></i> ' + (translations[currentLang].noFileProcessed || 'لا يوجد ملف معالج حالياً');
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
        updateConversionProgressBar(10, translations[currentLang].progressReading || 'جاري قراءة بنية الملف محلياً...');

        const sizeInMb = (file.size / (1024 * 1024)).toFixed(2);
        convertedFileName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;

        const reader = new FileReader();

        if (fileConverterMode === 'shp2geojson') {
            if (!file.name.endsWith('.zip')) {
                alert(translations[currentLang].alertShpZipOnly);
                resetConverterOutputs();
                return;
            }

            reader.readAsArrayBuffer(file);
            reader.onload = function(e) {
                updateConversionProgressBar(40, translations[currentLang].progressDecompressing || 'جاري إلغاء ضغط وفك ملفات Shapefile...');
                
                setTimeout(() => {
                    if (typeof shp === 'undefined') {
                        alert(translations[currentLang].alertShpjsUnavailable);
                        resetConverterOutputs();
                        return;
                    }

                    shp(e.target.result).then(geojson => {
                        updateConversionProgressBar(85, translations[currentLang].progressGenerating || 'جاري توليد ملف GeoJSON مساحي...');
                        
                        setTimeout(() => {
                            convertedFileContent = JSON.stringify(geojson, null, 2);
                            convertedFileName = `${convertedFileName}_converted.geojson`;

                            updateConversionProgressBar(100, translations[currentLang].progressShpDone || 'اكتمل التحويل المساحي بنجاح!');
                            
                            renderGeoJsonPreview(geojson, file.name, sizeInMb);
                        }, 400);
                    }).catch(err => {
                        alert(translations[currentLang].alertShpReadFailed);
                        console.error(err);
                        resetConverterOutputs();
                    });
                }, 500);
            };
        } 
        else if (fileConverterMode === 'csv2geojson') {
            reader.readAsText(file);
            reader.onload = function(e) {
                updateConversionProgressBar(50, translations[currentLang].progressAnalyzing || 'جاري تحليل أعمدة البيانات الجغرافية...');
                
                setTimeout(() => {
                    const text = e.target.result;
                    const parsed = parseCsv(text);

                    if (parsed.data.length === 0) {
                        alert(translations[currentLang].alertCsvEmpty);
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
                        alert(translations[currentLang].alertCsvCoordsNotFound);
                        resetConverterOutputs();
                        return;
                    }

                    updateConversionProgressBar(75, translations[currentLang].progressProjecting || 'جاري إسقاط النقاط وربط البيانات الجدولية...');

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
                        alert(translations[currentLang].alertCsvNoValidCoords);
                        resetConverterOutputs();
                        return;
                    }

                    const geojson = {
                        type: 'FeatureCollection',
                        features: features
                    };

                    convertedFileContent = JSON.stringify(geojson, null, 2);
                    convertedFileName = `${convertedFileName}_converted.geojson`;

                    updateConversionProgressBar(100, translations[currentLang].progressCsvDone || 'اكتمل تحويل ملف CSV بنجاح!');
                    
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
                updateConversionProgressBar(50, translations[currentLang].progressParsing || 'جاري تفكيك مصفوفات GeoJSON...');
                
                setTimeout(() => {
                    try {
                        const geojson = JSON.parse(e.target.result);
                        
                        let features = [];
                        if (geojson.type === 'FeatureCollection' && Array.isArray(geojson.features)) {
                            features = geojson.features;
                        } else if (geojson.type === 'Feature') {
                            features = [geojson];
                        } else {
                            alert(translations[currentLang].alertGeojsonInvalid);
                            resetConverterOutputs();
                            return;
                        }

                        if (features.length === 0) {
                            alert(translations[currentLang].alertGeojsonNoFeatures);
                            resetConverterOutputs();
                            return;
                        }

                        updateConversionProgressBar(75, translations[currentLang].progressBuilding || 'جاري بناء جدول البيانات الوصفية...');

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

                        updateConversionProgressBar(100, translations[currentLang].progressGeojsonDone || 'اكتمل التحويل الجدولي بنجاح!');

                        renderTabularPreview(csvHeaders, csvDataRows, file.name, sizeInMb);
                        
                        outputJsonViewer.style.display = 'none';
                        outputGridViewer.style.display = 'block';
                    } 
                    catch(err) {
                        alert(translations[currentLang].alertGeojsonCorrupt);
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
        outputFilesize.textContent = `${size} ${currentLang === 'ar' ? 'ميغابايت' : 'MB'}`;

        const codeSnippet = JSON.stringify(geojson, null, 2);
        if (codeSnippet.length > 2500) {
            outputJsonViewer.textContent = codeSnippet.substring(0, 2500) + "\n\n/* ... " + (currentLang === 'ar' ? 'تم اقتطاع نافذة المعاينة للتسريع، الملف بأكمله جاهز للتحميل' : 'Preview truncated for performance, full file is ready for download') + " ... */";
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
        outputFilesize.textContent = `${size} ${currentLang === 'ar' ? 'ميغابايت' : 'MB'}`;

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

    // ==========================================================================
    // 18. Live News Hub Real-time Filter & Dynamic Draft Submission (Persisted)
    // ==========================================================================
    const newsSearch = document.getElementById('news-search');
    const newsFeedItems = document.getElementById('news-feed-items');

    // Function to dynamically build and animate a news card
    function createNewsCard(title, desc, date, tagText, tagClass) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'news-item';
        itemDiv.style.opacity = '0';
        itemDiv.style.transform = 'translateY(15px)';
        itemDiv.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
        itemDiv.setAttribute('data-search', `${title} ${desc} ${tagText}`);

        itemDiv.innerHTML = `
            <span class="news-tag ${tagClass}">${tagText}</span>
            <span class="news-date">${date}</span>
            <h4>${title}</h4>
            <p>${desc}</p>
        `;
        return itemDiv;
    }

    // Load custom contributed news from localStorage on startup
    if (newsFeedItems) {
        const savedNews = JSON.parse(localStorage.getItem('customGisNews') || '[]');
        // Reverse array to insert oldest first so that the absolute newest always ends up at the very top
        savedNews.reverse().forEach(item => {
            const card = createNewsCard(item.title, item.desc, item.date, item.tagText, item.tagClass);
            newsFeedItems.insertBefore(card, newsFeedItems.firstChild);
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 50);
        });
    }

    // Live search filter (queries elements dynamically on input to catch newly added items)
    if (newsSearch) {
        newsSearch.addEventListener('input', () => {
            const query = newsSearch.value.trim().toLowerCase();
            const currentItems = document.querySelectorAll('#news-feed-items .news-item');
            currentItems.forEach(item => {
                const searchText = item.getAttribute('data-search').toLowerCase();
                if (searchText.includes(query)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }

    // Handle dynamic local news submission
    const newsContribForm = document.getElementById('news-contrib-form');
    if (newsContribForm && newsFeedItems) {
        newsContribForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const titleInput = document.getElementById('news-contrib-title');
            const descInput = document.getElementById('news-contrib-desc');

            const title = titleInput.value.trim();
            const desc = descInput.value.trim();
            const dateStr = currentLang === 'ar' ? 'الآن مباشر' : 'Live Now';
            const tagText = currentLang === 'ar' ? 'مساهمة مجتمعية' : 'Community Post';
            const tagClass = 'tag-success';

            // Create card and insert at the top
            const newCard = createNewsCard(title, desc, dateStr, tagText, tagClass);
            newsFeedItems.insertBefore(newCard, newsFeedItems.firstChild);

            // Animate card prepending beautifully
            setTimeout(() => {
                newCard.style.opacity = '1';
                newCard.style.transform = 'translateY(0)';
                newCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);

            // Save to localStorage array
            const savedNews = JSON.parse(localStorage.getItem('customGisNews') || '[]');
            savedNews.unshift({
                title: title,
                desc: desc,
                date: dateStr,
                tagText: tagText,
                tagClass: tagClass
            });
            localStorage.setItem('customGisNews', JSON.stringify(savedNews));

            // Trigger translated alert
            const alertMsg = translations[currentLang].alertNewsDraftSuccess 
                ? translations[currentLang].alertNewsDraftSuccess.replace('{TITLE}', title)
                : (currentLang === 'ar' ? `تم نشر مسودة الخبر بعنوان '${title}' حياً ومباشرة على البوابة بنجاح!` : `News draft '${title}' posted live on the portal successfully!`);
            
            alert(alertMsg);

            // Clear inputs
            titleInput.value = '';
            descInput.value = '';
        });
    }

    // ==========================================================================
    // 21. Saudi Spatial Reference & City Telemetry (Calculator Dataset)
    // ==========================================================================
    const cityData = {
        riyadh: {
            zone: "UTM Zone 38N", epsg: "EPSG:32638", datum: "WGS 84 / GRS 80",
            ar: { name: "الرياض (Riyadh)", meridian: "45° شرقاً", usage: "نظام الإحداثيات المعتمد لأمانة منطقة الرياض، المشاريع الإنشائية، وتخطيط البنية التحتية.", note: "يغطي هذا النطاق كامل منطقة الرياض الكبرى ومحافظاتها الشرقية. احرص على استخدام مسقط EPSG:32638 لتفادي تشوهات حسابات المساحة الكبيرة." },
            en: { name: "Riyadh", meridian: "45° East", usage: "Approved coordinate system for Riyadh Municipality, construction projects, and infrastructure planning.", note: "This zone covers the entire Greater Riyadh region and its eastern provinces. Be sure to use EPSG:32638 to avoid distortion in large area calculations." }
        },
        jeddah: {
            zone: "UTM Zone 37N", epsg: "EPSG:32637", datum: "WGS 84 / GRS 80",
            ar: { name: "جدة (Jeddah)", meridian: "39° شرقاً", usage: "المشاريع البحرية، تخطيط السواحل، أعمال الرفع المساحي لبلدية جدة.", note: "تعد جدة في النصف الشرقي من نطاق Zone 37N. تأكد من تحديد EPSG:32637 في برامج QGIS/ArcGIS Pro عند القيام بالتحليلات الهيدرولوجية للسيول." },
            en: { name: "Jeddah", meridian: "39° East", usage: "Maritime projects, coastal planning, and surveying operations for Jeddah Municipality.", note: "Jeddah lies in the eastern half of Zone 37N. Be sure to set EPSG:32637 in QGIS/ArcGIS Pro for hydrological flood analysis." }
        },
        mecca: {
            zone: "UTM Zone 37N", epsg: "EPSG:32637", datum: "WGS 84 / GRS 80",
            ar: { name: "مكة المكرمة (Mecca)", meridian: "39° شرقاً", usage: "تخطيط المشاعر المقدسة، البنية التحتية للحرم، والمسوحات الطبوغرافية بمكة.", note: "نظراً للطبيعة الجبلية الوعرة بمكة المكرمة، يعتبر نظام UTM Zone 37N الأنسب لتقليل نسبة الخطأ في القياسات المساحية الميدانية وعمل النماذج الرقمية ثلاثية الأبعاد." },
            en: { name: "Mecca", meridian: "39° East", usage: "Holy sites planning, Grand Mosque infrastructure, and topographic surveys in Mecca.", note: "Given Mecca's rugged mountainous terrain, UTM Zone 37N is optimal for minimizing field survey measurement errors and creating 3D digital models." }
        },
        medina: {
            zone: "UTM Zone 37N", epsg: "EPSG:32637", datum: "WGS 84 / GRS 80",
            ar: { name: "المدينة المنورة (Medina)", meridian: "39° شرقاً", usage: "المشاريع العمرانية بالمنطقة المركزية، شبكات المياه والصرف الصحي لأمانة المدينة.", note: "المنطقة تقع بالكامل ضمن نطاق زون 37N. ينصح بالتحقق من مطابقة المرجع الوطني الجيوديسي للمخططات الهندسية قبل استيرادها لقواعد البيانات الجغرافية." },
            en: { name: "Medina", meridian: "39° East", usage: "Urban projects in the central area, water and sewage networks for Medina Municipality.", note: "The region falls entirely within Zone 37N. Verify the national geodetic reference for engineering plans before importing into geographic databases." }
        },
        dammam: {
            zone: "UTM Zone 39N", epsg: "EPSG:32639", datum: "WGS 84 / GRS 80",
            ar: { name: "الدمام والخبر (Dammam & Al-Khobar)", meridian: "51° شرقاً", usage: "مشاريع أرامكو السعودية، الموانئ البحرية، وأعمال المساحة بالمنطقة الشرقية.", note: "تقع المنطقة الشرقية بالكامل في النطاق 39N (EPSG:32639). انتبه جيداً لعدم خلطها بنطاق الرياض (38N) لكون الخط الفاصل يمر بين الدهناء والمنطقة الشرقية." },
            en: { name: "Dammam & Al-Khobar", meridian: "51° East", usage: "Saudi Aramco projects, maritime ports, and surveying in the Eastern Province.", note: "The Eastern Province falls entirely in Zone 39N (EPSG:32639). Be careful not to confuse it with Riyadh's zone (38N) as the boundary runs between Ad-Dahna and the Eastern Province." }
        },
        tabuk: {
            zone: "UTM Zone 37N", epsg: "EPSG:32637", datum: "WGS 84 / GRS 80",
            ar: { name: "تبوك (Tabuk)", meridian: "39° شرقاً", usage: "المشاريع الزراعية، مسوحات المياه الجوفية، والتنمية الحضرية بتبوك.", note: "تقع تبوك في أقصى الشمال الغربي وتعتمد النطاق 37N. يوصى بالتحقق المزدوج من المرجعية الإحداثية لتجنب الإزاحات المترية عند دمج بيانات المحطات المساحية الأرضية." },
            en: { name: "Tabuk", meridian: "39° East", usage: "Agricultural projects, groundwater surveys, and urban development in Tabuk.", note: "Tabuk lies in the far northwest and uses Zone 37N. Double-check the coordinate reference to avoid metric offsets when merging ground survey station data." }
        },
        abha: {
            zone: "UTM Zone 37N", epsg: "EPSG:32637", datum: "WGS 84 / GRS 80",
            ar: { name: "أبها وعسير (Abha & Asir)", meridian: "39° شرقاً", usage: "رصد الانهيارات الجبلية، السياحة البيئية، وتخطيط المدرجات الزراعية بعسير.", note: "نظراً للارتفاعات الشاهقة بجبال السروات (أبها)، يجب أخذ تأثير الارتفاع عن سطح البحر بعين الاعتبار عند مطابقة الرفع المساحي لـ UTM." },
            en: { name: "Abha & Asir", meridian: "39° East", usage: "Landslide monitoring, eco-tourism, and agricultural terrace planning in Asir.", note: "Given the high elevations of the Sarawat Mountains (Abha), the effect of altitude above sea level must be considered when matching survey data to UTM." }
        },
        hail: {
            zone: "UTM Zone 38N", epsg: "EPSG:32638", datum: "WGS 84 / GRS 80",
            ar: { name: "حائل (Hail)", meridian: "45° شرقاً", usage: "مشاريع التنمية الزراعية، رصد التصحر، والمخططات العمرانية لأمانة حائل.", note: "تقع حائل في وسط الشمال وتتبع نطاق 38N. يفضل التحقق من المرجع المساحي لبيانات المياه والآبار الجوفية التي قد تستخدم مرجع عين العبد القديم." },
            en: { name: "Hail", meridian: "45° East", usage: "Agricultural development, desertification monitoring, and urban planning for Hail Municipality.", note: "Hail lies in the north-central region and uses Zone 38N. Verify the survey reference for water and well data that may use the legacy Ain el-Abd datum." }
        },
        jazan: {
            zone: "UTM Zone 37N", epsg: "EPSG:32637", datum: "WGS 84 / GRS 80",
            ar: { name: "جازان (Jazan)", meridian: "39° شرقاً", usage: "مشاريع مدينة جازان للصناعات الأساسية، رصد الجزر (فرسان)، والتخطيط البيئي.", note: "تقع جازان في أقصى الجنوب الغربي ضمن زون 37N. تتميز المشاريع هنا بمتطلبات دقة عالية لتداخل التضاريس الجبلية والسهول الساحلية والجزر." },
            en: { name: "Jazan", meridian: "39° East", usage: "Jazan Industrial City projects, Farasan Islands monitoring, and environmental planning.", note: "Jazan is in the far southwest within Zone 37N. Projects here require high precision due to the overlap of mountainous terrain, coastal plains, and islands." }
        },
        najran: {
            zone: "UTM Zone 38N", epsg: "EPSG:32638", datum: "WGS 84 / GRS 80",
            ar: { name: "نجران (Najran)", meridian: "45° شرقاً", usage: "المخططات العمرانية لأمانة نجران، مسوحات المياه، وتوثيق المواقع التاريخية (حمى).", note: "تتبع نجران النطاق 38N. انتبه عند العمل بالقرب من الحدود الغربية للمنطقة حيث تتداخل مع زون 37N التابع لعسير." },
            en: { name: "Najran", meridian: "45° East", usage: "Urban planning for Najran Municipality, water surveys, and historical site documentation (Hima).", note: "Najran uses Zone 38N. Be careful when working near the western boundary where it overlaps with Asir's Zone 37N." }
        },
        aljouf: {
            zone: "UTM Zone 37N", epsg: "EPSG:32637", datum: "WGS 84 / GRS 80",
            ar: { name: "الجوف (Al-Jouf)", meridian: "39° شرقاً", usage: "مشاريع طاقة الرياح والطاقة الشمسية، التخطيط الزراعي بسكاكا ودومة الجندل.", note: "تقع منطقة الجوف في الشمال وتسقط بالكامل في UTM Zone 37N. مناسب جداً لمشاريع أبحاث الطاقة البديلة وتوزيع الحقول الزراعية الشاسعة." },
            en: { name: "Al-Jouf", meridian: "39° East", usage: "Wind and solar energy projects, agricultural planning in Sakaka and Dumat Al-Jandal.", note: "Al-Jouf region lies in the north and falls entirely within UTM Zone 37N. Ideal for renewable energy research and mapping vast agricultural fields." }
        },
        borders: {
            zone: "UTM Zone 38N", epsg: "EPSG:32638", datum: "WGS 84 / GRS 80",
            ar: { name: "الحدود الشمالية (Northern Borders)", meridian: "45° شرقاً", usage: "مشاريع التعدين (وعد الشمال)، خطوط أنابيب النفط والغاز، والتخطيط الإقليمي للشمال.", note: "تغطي المنطقة الشمالية مساحة شاسعة تتقاطع مع نطاق 38N. يفضل في الدراسات البيئية واسعة النطاق استخدام المرجع الجيوديسي الموحد لتقليل الإزاحة المكانية." },
            en: { name: "Northern Borders", meridian: "45° East", usage: "Mining projects (Wa'ad Al-Shamal), oil and gas pipelines, and regional planning.", note: "The Northern region covers a vast area intersecting Zone 38N. For large-scale environmental studies, use the unified geodetic reference to minimize spatial offset." }
        },
        albaha: {
            zone: "UTM Zone 37N", epsg: "EPSG:32637", datum: "WGS 84 / GRS 80",
            ar: { name: "الباحة (Al-Baha)", meridian: "39° شرقاً", usage: "مشاريع التخطيط الحضري والسياحي بالباحة، وإدارة الغابات والمدرجات.", note: "تقع الباحة في زون 37N. الطبيعة الطبوغرافية الجبلية تقتضي المعايرة المساحية الدقيقة واستخدام خطوط الكنتور عالية الدقة لسلامة المنشآت الهندسية." },
            en: { name: "Al-Baha", meridian: "39° East", usage: "Urban and tourism planning in Al-Baha, forest and terrace management.", note: "Al-Baha lies in Zone 37N. The mountainous topography requires precise survey calibration and high-resolution contour lines for structural engineering safety." }
        },
        neom: {
            zone: "UTM Zone 37N", epsg: "EPSG:32637", datum: "WGS 84 / GRS 80",
            ar: { name: "نيوم (NEOM)", meridian: "39° شرقاً", usage: "تخطيط المشاريع الضخمة (The Line, Oxagon, Trojena)، وتصميم الأنظمة الذكية المستدامة.", note: "تعد نيوم في أقصى الشمال الغربي وتسقط في UTM Zone 37N. يطبق فيها معايير جيوديسية فائقة الدقة والربط السحابي مع محطات CORS الدائمة للرفع اللحظي RTK." },
            en: { name: "NEOM", meridian: "39° East", usage: "Planning mega-projects (The Line, Oxagon, Trojena) and designing sustainable smart systems.", note: "NEOM is in the far northwest and falls within UTM Zone 37N. Ultra-precision geodetic standards and cloud-connected permanent CORS stations are used for real-time RTK surveying." }
        }
    };

    // ==========================================================================
    // 22. Saudi Spatial Data Hub Search & Filter Logic
    // ==========================================================================
    const datasetSearchInput = document.getElementById('datasetSearch');
    const datasetFilterBtns = document.querySelectorAll('#datasetFilters .filter-btn');
    const datasetCards = document.querySelectorAll('#datasetGrid .dataset-card');

    function filterDatasets() {
        const searchQuery = datasetSearchInput ? datasetSearchInput.value.toLowerCase().trim() : '';
        const activeFilterBtn = document.querySelector('#datasetFilters .filter-btn.active');
        const activeCategory = activeFilterBtn ? activeFilterBtn.dataset.filter : 'all';

        datasetCards.forEach(card => {
            const matchesCategory = activeCategory === 'all' || card.dataset.category === activeCategory;
            const textContent = card.innerText.toLowerCase();
            const matchesSearch = textContent.includes(searchQuery);

            if (matchesCategory && matchesSearch) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    }

    if (datasetSearchInput) {
        datasetSearchInput.addEventListener('input', filterDatasets);
    }

    datasetFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            datasetFilterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterDatasets();
        });
    });

    // ==========================================================================
    // 23. Saudi UTM & CRS Calculator Interactive Event Listener
    // ==========================================================================
    const citySelector = document.getElementById('citySelector');
    const utmResultCard = document.getElementById('utmResultCard');

    if (citySelector && utmResultCard) {
        const placeholderDiv = utmResultCard.querySelector('.result-placeholder');
        const contentDiv = utmResultCard.querySelector('.result-content');
        
        const resultCityName = document.getElementById('resultCityName');
        const resultZoneBadge = document.getElementById('resultZoneBadge');
        const specEPSG = document.getElementById('specEPSG');
        const specDatum = document.getElementById('specDatum');
        const specMeridian = document.getElementById('specMeridian');
        const specUsage = document.getElementById('specUsage');
        const specNote = document.getElementById('specNote');

        citySelector.addEventListener('change', () => {
            const selectedKey = citySelector.value;
            const cityEntry = cityData[selectedKey];

            if (cityEntry) {
                const data = cityEntry[currentLang];
                // Update text contents
                resultCityName.textContent = data.name;
                resultZoneBadge.textContent = cityEntry.zone;
                specEPSG.textContent = cityEntry.epsg;
                specDatum.textContent = cityEntry.datum;
                specMeridian.textContent = data.meridian;
                specUsage.textContent = data.usage;
                specNote.textContent = data.note;

                // Toggle views
                placeholderDiv.style.display = 'none';
                contentDiv.style.display = 'flex';

                // Add active-glow micro-animation
                utmResultCard.classList.remove('glow-active');
                void utmResultCard.offsetWidth; // Trigger reflow to restart CSS animation
                utmResultCard.classList.add('glow-active');
            } else {
                placeholderDiv.style.display = 'flex';
                contentDiv.style.display = 'none';
                utmResultCard.classList.remove('glow-active');
            }
        });
    }

    // ==========================================================================
    // 99. Initialize Language on Page Load (apply cached preference)
    // ==========================================================================
    switchLanguage(currentLang);

});
