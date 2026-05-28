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

    // ==========================================================================
    // 18. Live News Hub Real-time Filter & Draft Submission
    // ==========================================================================
    const newsSearch = document.getElementById('news-search');
    const newsItems = document.querySelectorAll('#news-feed-items .news-item');

    if (newsSearch && newsItems) {
        newsSearch.addEventListener('input', () => {
            const query = newsSearch.value.trim().toLowerCase();
            newsItems.forEach(item => {
                const searchText = item.getAttribute('data-search').toLowerCase();
                if (searchText.includes(query)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }

    const newsContribForm = document.getElementById('news-contrib-form');
    if (newsContribForm) {
        newsContribForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const titleInput = document.getElementById('news-contrib-title');
            const descInput = document.getElementById('news-contrib-desc');
            
            alert(`✓ تم إرسال مسودة الخبر بنجاح! \nعنوان الخبر: "${titleInput.value}" \nسيتم مراجعة الخبر وتدقيقه مساحياً ونشره تحت إشراف Yazeed Alshammari في شريط الأخبار قريباً.`);
            titleInput.value = '';
            descInput.value = '';
        });
    }

    // ==========================================================================
    // 19. Gamified Geospatial Ethics Pledge & Confetti Certificate Engine
    // ==========================================================================
    const btnSignPledge = document.getElementById('btn-sign-pledge');
    const pledgeCheck1 = document.getElementById('pledge-check-1');
    const pledgeCheck2 = document.getElementById('pledge-check-2');
    const pledgeCheck3 = document.getElementById('pledge-check-3');
    const pledgeStudentNameInput = document.getElementById('pledge-student-input-name');
    const pledgeCertOverlay = document.getElementById('pledge-cert-overlay');
    const btnCloseCert = document.getElementById('btn-close-cert');

    const certStudentName = document.getElementById('cert-student-name');
    const certSerialId = document.getElementById('cert-serial-id');
    const certDateSigned = document.getElementById('cert-date-signed');

    if (btnSignPledge && pledgeCertOverlay) {
        btnSignPledge.addEventListener('click', () => {
            // 1. Validation check
            if (!pledgeCheck1.checked || !pledgeCheck2.checked || !pledgeCheck3.checked) {
                alert("✗ يرجى تحديد وقراءة جميع بنود الميثاق الأخلاقي الثلاثة للتعهد والالتزام بأمن البيانات الوطنية الجغرافية!");
                return;
            }

            const inputName = pledgeStudentNameInput.value.trim();
            if (!inputName) {
                alert("✗ يرجى كتابة اسمك الثلاثي بالكامل لتوقيع الميثاق وإصدار وثيقة العهد الأخلاقي الجيومكاني!");
                return;
            }

            // 2. Set certificate values
            if (certStudentName) certStudentName.textContent = inputName;
            if (certSerialId) {
                const randHex = Math.floor(Math.random() * 0xFFFFFF).toString(16).toUpperCase().padStart(6, '0');
                certSerialId.textContent = `#KSA-ETH-${randHex}`;
            }
            if (certDateSigned) {
                const today = new Date();
                const dd = String(today.getDate()).padStart(2, '0');
                const mm = String(today.getMonth() + 1).padStart(2, '0');
                const yyyy = today.getFullYear();
                certDateSigned.textContent = `${yyyy}-${mm}-${dd}`;
            }

            // 3. Show certificate modal
            pledgeCertOverlay.style.display = 'flex';
            setTimeout(() => {
                pledgeCertOverlay.classList.add('show');
            }, 50);

            // 4. Fire beautiful client-side confetti sparkles
            triggerConfettiAnimation();
        });
    }

    if (btnCloseCert && pledgeCertOverlay) {
        btnCloseCert.addEventListener('click', () => {
            pledgeCertOverlay.classList.remove('show');
            setTimeout(() => {
                pledgeCertOverlay.style.display = 'none';
            }, 400);
        });
        pledgeCertOverlay.addEventListener('click', (e) => {
            if (e.target === pledgeCertOverlay) {
                pledgeCertOverlay.classList.remove('show');
                setTimeout(() => {
                    pledgeCertOverlay.style.display = 'none';
                }, 400);
            }
        });
    }

    // Canvas Confetti Particles Calculator
    function triggerConfettiAnimation() {
        const canvas = document.getElementById('confetti-canvas');
        if (!canvas) return;

        canvas.style.display = 'block';
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        const colors = ['#10b981', '#00f2fe', '#eab308', '#3b82f6', '#f43f5e'];
        const particles = [];

        for (let i = 0; i < 150; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height - height,
                r: Math.random() * 6 + 4,
                d: Math.random() * width,
                color: colors[Math.floor(Math.random() * colors.length)],
                tilt: Math.random() * 10 - 5,
                tiltAngleIncremental: Math.random() * 0.07 + 0.02,
                tiltAngle: 0
            });
        }

        let animationFrameId;
        let elapsedFrames = 0;

        function draw() {
            ctx.clearRect(0, 0, width, height);

            particles.forEach((p, idx) => {
                p.tiltAngle += p.tiltAngleIncremental;
                p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
                p.x += Math.sin(p.tiltAngle);
                p.tilt = Math.sin(p.tiltAngle - idx / 3) * 15;

                ctx.beginPath();
                ctx.lineWidth = p.r / 2;
                ctx.strokeStyle = p.color;
                ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
                ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
                ctx.stroke();
            });

            elapsedFrames++;

            if (elapsedFrames < 180) {
                animationFrameId = requestAnimationFrame(draw);
            } else {
                ctx.clearRect(0, 0, width, height);
                canvas.style.display = 'none';
                cancelAnimationFrame(animationFrameId);
            }
        }

        draw();
    }

    // ==========================================================================
    // 21. Saudi Spatial Reference & City Telemetry (Calculator Dataset)
    // ==========================================================================
    const cityData = {
        riyadh: {
            name: "الرياض (Riyadh)",
            zone: "UTM Zone 38N",
            epsg: "EPSG:32638",
            datum: "WGS 84 / GRS 80",
            meridian: "45° East",
            usage: "نظام الإحداثيات المعتمد لأمانة منطقة الرياض، المشاريع الإنشائية، وتخطيط البنية التحتية.",
            note: "يغطي هذا النطاق كامل منطقة الرياض الكبرى ومحافظاتها الشرقية. احرص على استخدام مسقط EPSG:32638 لتفادي تشوهات حسابات المساحة الكبيرة."
        },
        jeddah: {
            name: "جدة (Jeddah)",
            zone: "UTM Zone 37N",
            epsg: "EPSG:32637",
            datum: "WGS 84 / GRS 80",
            meridian: "39° East",
            usage: "المشاريع البحرية، تخطيط السواحل، أعمال الرفع المساحي لبلدية جدة.",
            note: "تعد جدة في النصف الشرقي من نطاق Zone 37N. تأكد من تحديد EPSG:32637 في برامج QGIS/ArcGIS Pro عند القيام بالتحليلات الهيدرولوجية للسيول."
        },
        mecca: {
            name: "مكة المكرمة (Mecca)",
            zone: "UTM Zone 37N",
            epsg: "EPSG:32637",
            datum: "WGS 84 / GRS 80",
            meridian: "39° East",
            usage: "تخطيط المشاعر المقدسة، البنية التحتية للحرم، والمسوحات الطبوغرافية بمكة.",
            note: "نظراً للطبيعة الجبلية الوعرة بمكة المكرمة، يعتبر نظام UTM Zone 37N الأنسب لتقليل نسبة الخطأ في القياسات المساحية الميدانية وعمل النماذج الرقمية ثلاثية الأبعاد."
        },
        medina: {
            name: "المدينة المنورة (Medina)",
            zone: "UTM Zone 37N",
            epsg: "EPSG:32637",
            datum: "WGS 84 / GRS 80",
            meridian: "39° East",
            usage: "المشاريع العمرانية بالمنطقة المركزية، شبكات المياه والصرف الصحي لأمانة المدينة.",
            note: "المنطقة تقع بالكامل ضمن نطاق زون 37N. ينصح بالتحقق من مطابقة المرجع الوطني الجيوديسي للمخططات الهندسية قبل استيرادها لقواعد البيانات الجغرافية."
        },
        dammam: {
            name: "الدمام والخبر (Dammam & Al-Khobar)",
            zone: "UTM Zone 39N",
            epsg: "EPSG:32639",
            datum: "WGS 84 / GRS 80",
            meridian: "51° East",
            usage: "مشاريع أرامكو السعودية، الموانئ البحرية، وأعمال المساحة بالمنطقة الشرقية.",
            note: "تقع المنطقة الشرقية بالكامل في النطاق 39N (EPSG:32639). انتبه جيداً لعدم خلطها بنطاق الرياض (38N) لكون الخط الفاصل يمر بين الدهناء والمنطقة الشرقية."
        },
        tabuk: {
            name: "تبوك (Tabuk)",
            zone: "UTM Zone 37N",
            epsg: "EPSG:32637",
            datum: "WGS 84 / GRS 80",
            meridian: "39° East",
            usage: "المشاريع الزراعية، مسوحات المياه الجوفية، والتنمية الحضرية بتبوك.",
            note: "تقع تبوك في أقصى الشمال الغربي وتعتمد النطاق 37N. يوصى بالتحقق المزدوج من المرجعية الإحداثية لتجنب الإزاحات المترية عند دمج بيانات المحطات المساحية الأرضية."
        },
        abha: {
            name: "أبها وعسير (Abha & Asir)",
            zone: "UTM Zone 37N",
            epsg: "EPSG:32637",
            datum: "WGS 84 / GRS 80",
            meridian: "39° East",
            usage: "رصد الانهيارات الجبلية، السياحة البيئية، وتخطيط المدرجات الزراعية بعسير.",
            note: "نظراً للارتفاعات الشاهقة بجبال السروات (أبها)، يجب أخذ تأثير الارتفاع عن سطح البحر بعين الاعتبار عند مطابقة الرفع المساحي لـ UTM."
        },
        hail: {
            name: "حائل (Hail)",
            zone: "UTM Zone 38N",
            epsg: "EPSG:32638",
            datum: "WGS 84 / GRS 80",
            meridian: "45° East",
            usage: "مشاريع التنمية الزراعية، رصد التصحر، والمخططات العمرانية لأمانة حائل.",
            note: "تقع حائل في وسط الشمال وتتبع نطاق 38N. يفضل التحقق من المرجع المساحي لبيانات المياه والآبار الجوفية التي قد تستخدم مرجع عين العبد القديم."
        },
        jazan: {
            name: "جازان (Jazan)",
            zone: "UTM Zone 37N",
            epsg: "EPSG:32637",
            datum: "WGS 84 / GRS 80",
            meridian: "39° East",
            usage: "مشاريع مدينة جازان للصناعات الأساسية، رصد الجزر (فرسان)، والتخطيط البيئي.",
            note: "تقع جازان في أقصى الجنوب الغربي ضمن زون 37N. تتميز المشاريع هنا بمتطلبات دقة عالية لتداخل التضاريس الجبلية والسهول الساحلية والجزر."
        },
        najran: {
            name: "نجران (Najran)",
            zone: "UTM Zone 38N",
            epsg: "EPSG:32638",
            datum: "WGS 84 / GRS 80",
            meridian: "45° East",
            usage: "المخططات العمرانية لأمانة نجران، مسوحات المياه، وتوثيق المواقع التاريخية (حمى).",
            note: "تتبع نجران النطاق 38N. انتبه عند العمل بالقرب من الحدود الغربية للمنطقة حيث تتداخل مع زون 37N التابع لعسير."
        },
        aljouf: {
            name: "الجوف (Al-Jouf)",
            zone: "UTM Zone 37N",
            epsg: "EPSG:32637",
            datum: "WGS 84 / GRS 80",
            meridian: "39° East",
            usage: "مشاريع طاقة الرياح والطاقة الشمسية، التخطيط الزراعي بسكاكا ودومة الجندل.",
            note: "تقع منطقة الجوف في الشمال وتسقط بالكامل في UTM Zone 37N. مناسب جداً لمشاريع أبحاث الطاقة البديلة وتوزيع الحقول الزراعية الشاسعة."
        },
        borders: {
            name: "الحدود الشمالية (Northern Borders)",
            zone: "UTM Zone 38N",
            epsg: "EPSG:32638",
            datum: "WGS 84 / GRS 80",
            meridian: "45° East",
            usage: "مشاريع التعدين (وعد الشمال)، خطوط أنابيب النفط والغاز، والتخطيط الإقليمي للشمال.",
            note: "تغطي المنطقة الشمالية مساحة شاسعة تتقاطع مع نطاق 38N. يفضل في الدراسات البيئية واسعة النطاق استخدام المرجع الجيوديسي الموحد لتقليل الإزاحة المكانية."
        },
        albaha: {
            name: "الباحة (Al-Baha)",
            zone: "UTM Zone 37N",
            epsg: "EPSG:32637",
            datum: "WGS 84 / GRS 80",
            meridian: "39° East",
            usage: "مشاريع التخطيط الحضري والسياحي بالباحة، وإدارة الغابات والمدرجات.",
            note: "تقع الباحة في زون 37N. الطبيعة الطبوغرافية الجبلية تقتضي المعايرة المساحية الدقيقة واستخدام خطوط الكنتور عالية الدقة لسلامة المنشآت الهندسية."
        },
        neom: {
            name: "نيوم (NEOM)",
            zone: "UTM Zone 37N",
            epsg: "EPSG:32637",
            datum: "WGS 84 / GRS 80",
            meridian: "39° East",
            usage: "تخطيط المشاريع الضخمة (The Line, Oxagon, Trojena)، وتصميم الأنظمة الذكية المستدامة.",
            note: "تعد نيوم في أقصى الشمال الغربي وتسقط في UTM Zone 37N. يطبق فيها معايير جيوديسية فائقة الدقة والربط السحابي مع محطات CORS الدائمة للرفع اللحظي RTK."
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
            const data = cityData[selectedKey];

            if (data) {
                // Update text contents
                resultCityName.textContent = data.name;
                resultZoneBadge.textContent = data.zone;
                specEPSG.textContent = data.epsg;
                specDatum.textContent = data.datum;
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
});


