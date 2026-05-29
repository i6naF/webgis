/**
 * GeoHub - Bilingual Translation Dictionary (translations.js)
 * Contains all Arabic and English localized strings for static and dynamic elements.
 */

const translations = {
    ar: {
        // Page Title & Meta
        documentTitle: "بوابة نظم المعلومات الجغرافية والتحليل البيئي | GIS Portal",
        
        // Navigation Bar
        navHome: "الرئيسية",
        navAbout: "عن التخصص",
        navDevices: "الأجهزة الموصى بها",
        navConverter: "محول ملفات GIS",
        navSoftware: "البرمجيات",
        navData: "مستودع البيانات",
        navUtm: "حاسبة UTM",
        navCourses: "الدورات الموصى بها",
        navTips: "نصائح ذهبية",
        navMistakes: "أخطاء شائعة",
        navVision: "رؤية 2030 والمستقبل",
        navX: "مجتمع X",
        navDonate: "تبرع لإحسان",
        
        // Mobile Drawer Header
        drawerTitle: "القائمة الرئيسية",
        
        // Hero Section
        heroBadge: "مستقبل التقنية المكانية والتحليل الرقمي",
        heroTitle: "بوابة الـ GIS <br><span class=\"gradient-text\">التعليمية المبتكرة</span>",
        heroSubtitle: "دليلك المساحي والبرمجي المتكامل لتعلم نظم المعلومات الجغرافية والتحليل المكاني بأحدث التقنيات السحابية والخرائط التفاعلية.",
        btnExplore: "الأجهزة الموصى بها",
        btnAbout: "استكشف التخصص",
        coordinateLabel: "نظام الإحداثيات والمسقط",
        
        // About GIS Section
        aboutTitle: "ما هي نظم المعلومات الجغرافية؟",
        aboutSubtitle: "العلم والتقنية وراء الخرائط الذكية والتحليل المكاني الحديث",
        aboutCardTitle: "قوة المكان وعلم الـ \"أين؟\"",
        aboutText1: "<strong>نظم المعلومات الجغرافية (GIS - Geographic Information Systems)</strong> هي علم وتكنولوجيا تتيح لنا التقاط وتخزين ومعالجة وتحليل وعرض شتى أنواع البيانات الجغرافية المرتبطة بموقع محدد على سطح الأرض.",
        aboutText2: "عبر دمج الخرائط الرقمية بقواعد البيانات الذكية، لا يخبرنا الـ GIS بـ <em>\"ماذا يوجد؟\"</em> فحسب، بل يمكننا من فهم <em>\"لماذا يوجد هناك؟\"</em> و <em>\"ماذا سيحدث لو تغير؟\"</em>، مما يجعله المحرك الأساسي لاتخاذ القرارات وإدارة العالم من حولنا.",
        statNum1: "80%",
        statLabel1: "من بيانات العالم تحتوي على مكون مكاني (جغرافي).",
        statNum2: "3D",
        statLabel2: "تحليل البيانات بأبعاد متعددة للنمذجة الواقعية للمدن.",
        
        // The 5 Pillars
        pillarsTitle: "الركائز الخمس الأساسية للـ GIS",
        pillarTitle1: "1. البيانات (Data)",
        pillarDesc1: "عصب النظام والوقود المحرك له. تشمل البيانات الوصفية والبيانات المكانية بنوعيها: المتجهة (Vector) والشبكية (Raster).",
        pillarTitle2: "2. البرمجيات (Software)",
        pillarDesc2: "الأدوات المستخدمة لإدخال ومعالجة البيانات المكانية وعمل التحليلات وإنتاج الخرائط، مثل برامج ESRI و QGIS.",
        pillarTitle3: "3. الأجهزة (Hardware)",
        pillarDesc3: "الحواسيب فائقة الأداء، السيرفرات السحابية، أجهزة الـ GPS، وأجهزة الاستشعار عن بعد كالدرونز والأقمار الصناعية.",
        pillarTitle4: "4. الأساليب (Methods)",
        pillarDesc4: "خطط العمل المنهجية، القواعد الحسابية، والتحليلات الجغرافية والإحصائية المتبعة لحل المشكلات بدقة.",
        pillarTitle5: "5. الكوادر البشرية (People)",
        pillarDesc5: "المختصون والمطورون والمحللون الذين يقومون بتصميم وتشغيل الأنظمة وحل المشكلات المكانية المعقدة.",
        
        // Careers & Application Fields
        careersTitle: "مجالات العمل والتطبيق",
        careerTitle1: "التخطيط العمراني والمدن الذكية",
        careerDesc1: "تخطيط مسارات النقل، تحديد مواقع الخدمات والمدارس والمستشفيات، وتحليل نمو وتوسع المدن هندسياً.",
        careerTitle2: "البيئة وإدارة الموارد الطبيعية",
        careerDesc2: "مراقبة التصحر، الغطاء النباتي، تتبع التلوث، دراسة التغير المناخي وحماية الحياة الفطرية بدقة مكانية.",
        careerTitle3: "الخدمات اللوجستية والنقل",
        careerDesc3: "تحديد المسار الأقصر لسيارات الإسعاف أو التوصيل، إدارة أساطيل النقل، وتوزيع شبكات الإمداد والطاقة.",
        careerTitle4: "إدارة الكوارث والأزمات",
        careerDesc4: "النمذجة الطبوغرافية والتنبؤ بمسارات السيول والفيضانات، وتتبع الكوارث والحرائق للحد من مخاطرها وتقليل الخسائر.",
        
        // Recommended Hardware Section
        hardwareTitle: "الأجهزة والحواسيب الموصى بها لـ GIS",
        hardwareSubtitle: "دليل شامل لاختيار الحاسوب الأمثل لتشغيل برمجيات الخرائط والتحليل المكاني وسلاسل البيانات الجغرافية الضخمة",
        hardwareWarning: "<strong>تنبيه هام حول أنظمة التشغيل (OS):</strong> برنامج <strong>ArcGIS Pro</strong> (المعيار الصناعي) يعمل <strong>فقط على نظام التشغيل Windows</strong> بشكل رسمي. إذا اخترت جهاز Mac (بمعالجات Apple Silicon)، ستحتاج لتشغيل نظام Windows عبر برامج محاكاة مثل Parallels Desktop، بينما يعمل برنامج <strong>QGIS</strong> مفتوح المصدر على جميع الأنظمة (Windows, Mac, Linux) بسلاسة تامة وبدون أي مشاكل.",
        
        deviceBadge1: "المستوى الاقتصادي (المواصفات الدنيا)",
        deviceTitle1: "الحواسيب الأساسية للمبتدئين",
        deviceDesc1: "مثالي للطلاب المستجدين وأعمال الرسم والتحليل الخفيف",
        deviceBadge2: "الخيار الذهبي (الموصى به)",
        deviceTitle2: "الأجهزة المتوازنة للاحتراف",
        deviceDesc2: "الخيار الأفضل للمشاريع الجامعية والتحليل ثلاثي الأبعاد والرندرة",
        deviceBadge3: "الأداء العالي (محطات العمل)",
        deviceTitle3: "محطات العمل المحمولة الفائقة",
        deviceDesc3: "لتحليل الاستشعار عن بعد ومعالجة الصور الفضائية ونمذجة الـ AI",
        deviceBadge4: "الخيار المتكامل (تجميعة PC مكتبية)",
        deviceTitle4: "تجميعة حاسوب مكتبي مكاني",
        deviceDesc4: "للحصول على أقصى أداء ممكن وأطول عمر افتراضي مع تبريد جبار",
        
        specCpu: "المعالج",
        specRam: "الذاكرة (RAM)",
        specGpu: "كرت الشاشة",
        specStorage: "التخزين",
        specDisplay: "الشاشة",
        specCooling: "التبريد والطاقة",
        deviceNominees: "الأجهزة المقترحة:",
        deviceNoteTitle: "ملاحظة التجميعة:",
        
        entryCpu: "Intel Core Ultra 5 / AMD Ryzen 5 (أو معادل)",
        entryRam: "16 GB DDR5 (الحد الأدنى لـ GIS في 2026)",
        entryGpu: "NVIDIA RTX 3050 / AMD Radeon 780M (أو مدمج قوي)",
        entryStorage: "512 GB NVMe PCIe SSD (فائق السرعة)",
        entryDisplay: "15.6\" FHD IPS (ألوان مريحة ومقاومة للتوهج)",
        entryList: "Lenovo IdeaPad Slim 3 (2026) / ASUS VivoBook 15 / HP 15",
        
        midCpu: "Intel Core Ultra 7 / AMD Ryzen 7 (فئة HS/H القوية)",
        midRam: "32 GB DDR5 5600MHz (لسلاسة البرمجيات الحديثة)",
        midGpu: "NVIDIA RTX 4060 / RTX 4060 Ti Laptop (8GB VRAM)",
        midStorage: "1 TB NVMe M.2 SSD PCIe Gen 4",
        midDisplay: "16\" WQXGA (2.5K) 100% sRGB Accurate Colors",
        midDisplay: "16\" WQXGA (2.5K) 100% sRGB ألوان دقيقة",
        midList: "ASUS ROG Zephyrus G14 (2026) / HP Victus 16 / Dell Inspiron 16 Plus",
        
        proCpu: "Intel Core Ultra 9 / AMD Ryzen 9 / Apple M4 Pro (أحدث جيل)",
        proRam: "64 GB DDR5 6400MHz (سرعات فائقة للتحليلات الكبيرة)",
        proGpu: "NVIDIA RTX 4070 / RTX 4070 Super / Apple M4 Pro GPU",
        proStorage: "2 TB NVMe PCIe Gen4 SSD (قراءة وكتابة فائقة)",
        proDisplay: "16\" OLED 3K / Liquid Retina XDR (دقة متناهية)",
        proList: "Lenovo ThinkPad P1 Gen 8 / Dell Precision 5690 / MacBook Pro 16\" (M4 Pro)",
        
        pcCpu: "AMD Ryzen 9 9900X / Intel Core Ultra 9 285K (فئة القمة)",
        pcRam: "64 GB DDR5 6000MHz+ (Dual Channel 2x32GB)",
        pcGpu: "NVIDIA RTX 4070 Ti Super / RTX 4080 Super (16GB VRAM)",
        pcStorage: "2TB Samsung 990 Pro M.2 + 4TB HDD (أرشيف خرائط)",
        pcCooling: "مبرد مائي 360mm + مزود طاقة 850W Gold",
        pcNote: "الحل الأفضل والأرخص للرندرة ومحاكاة البيانات الكبيرة والذكاء الاصطناعي المكاني.",
        pcPriceLabel: "التكلفة التقريبية:",
        proPriceLabel: "السعر التقريبي:",
        currency: "ر.س",
        
        // GIS File Converter Section
        converterBadge: "تحويل محلي آمن 100% دون خوادم",
        converterTitle: "محول ملفات نظم المعلومات <span class=\"highlight\">الجغرافية (GIS)</span>",
        converterSubtitle: "قم بتحويل صيغ البيانات الجغرافية محلياً في جهازك لحماية خصوصية بياناتك: من Shapefile إلى GeoJSON، ومن CSV إلى GeoJSON والعكس تلقائياً",
        converterCardUpload: "مركز رفع ومعالجة الملفات",
        converterCardUploadDesc: "اختر نوع التحويل المطلوب ثم قم بسحب وإفلات الملف الجغرافي المعني في المساحة المخصصة بالأسفل للبدء بالتحويل التلقائي الفوري:",
        
        tabShpGeoJson: "Shapefile → GeoJSON",
        tabCsvGeoJson: "CSV → GeoJSON",
        tabGeoJsonCsv: "GeoJSON → CSV",
        dropzoneTitleShp: "اسحب ملف Shapefile المضغوط (.zip)",
        dropzoneDescShp: "يجب أن يحتوي ملف الـ ZIP على ملفات .shp و .dbf ويفضل .prj لإتمام الإسقاط",
        dropzoneTitleCsv: "اسحب ملف CSV يحتوي على إحداثيات مكانية",
        dropzoneDescCsv: "يجب أن يتضمن ملف الـ CSV أعمدة تمثل خطوط العرض والطول (Latitude / Longitude)",
        dropzoneTitleGeoJson: "اسحب ملف GeoJSON للمواقع المكانية",
        dropzoneDescGeoJson: "يرفع ملف GeoJSON مساحي ليتم استخلاص بياناته الجدولية إلى ملف إكسل CSV متوافق",
        dropzoneBrowse: "تصفح الملفات المحلية",
        
        helpShp2GeoJson: "يتيح لك هذا الوضع تحويل الطبقات المساحية والخطية والنقطية من صيغة Shapefile (مع جدول البيانات الوصفية بالكامل) إلى ملف GeoJSON قياسي صالح للاستخدام في الويب فوراً.",
        helpCsv2GeoJson: "تحويل قواعد البيانات الجدولية (CSV) المحتوية على إحداثيات جغرافية (مثل Latitude/Longitude) إلى ملف GeoJSON مكاني بنسق قياسي.",
        helpGeoJson2Csv: "يقوم هذا الوضع بقراءة طبقات GeoJSON المساحية واستخراج جميع أعمدة البيانات الوصفية (Properties) مع إحداثيات خطوط الطول والعرض وتخزينها في ملف جدول CSV منظم.",
        
        outputSectionTitle: "معاينة المخرجات المباشرة",
        outputPlaceholderDesc: "نافذة تفاعلية مبرمجة لعرض عينات المخرجات المكانية فور اكتمال التحويل:",
        outputMetaPlaceholder: "لا يوجد ملف معالج حالياً",
        btnDownloadResult: "تحميل الملف الجغرافي المعالج",
        
        // Software Guide Section
        softwareTitle: "مستودع البرمجيات والأدوات الجغرافية",
        softwareSubtitle: "صندوق أدواتك العملي للاحتراف في بيئات العمل والمشاريع",
        filterAll: "الكل",
        filterDesktop: "برمجيات مكتبية (Desktop)",
        filterFree: "برمجيات مفتوحة المصدر (مجانية)",
        filterCommercial: "برمجيات تجارية (مدفوعة)",
        filterCloud: "تحليل سحابي (Cloud)",
        filterDatabase: "قواعد بيانات مكانية",
        filterDev: "برمجة وتطوير (Development)",
        
        badgeCommercial: "تجاري (رخصة ESRI)",
        badgeFree: "مفتوح المصدر (مجاني بالكامل)",
        badgeAcademic: "مجاني للاستخدام الأكاديمي",
        badgeDb: "مفتوح المصدر (مجاني)",
        badgePy: "بيئة برمجية مجانية",
        badgeWeb: "مفتوح المصدر (مجاني)",
        btnLearnMore: "زيارة الموقع الرسمي",
        btnExplorePy: "استكشف GeoPandas",
        btnExploreWeb: "استكشف Leaflet.js",
        
        softwareTitle1: "ArcGIS Pro",
        softwareDesc1: "المعيار الذهبي والبرنامج الأكثر شهرة واستخداماً عالمياً في الشركات والجهات الحكومية. يتميز بقدرات تحليلية جبارة ثلاثية الأبعاد وعرض خرائط فائق الدقة.",
        softwareDev1: "ESRI Corp.",
        swFeatures1_1: "تحليلات مكانية ومتقدمة ومحاكاة ثلاثية الأبعاد.",
        swFeatures1_2: "تكامل ممتاز مع قواعد البيانات السحابية وبيئات الـ Enterprise.",
        swFeatures1_3: "متوفر للطلاب برخص تعليمية مخفضة.",
        
        softwareTitle2: "QGIS Desktop",
        softwareDesc2: "العملاق مفتوح المصدر الأقوى والمنافس الأبرز لبرمجيات إزري. مجاني بالكامل بدون أي قيود، مدعوم بمجتمع ضخم يوفر آلاف الإضافات البرمجية المجانية لكل استخدام.",
        softwareDev2: "OSGeo Foundation",
        swFeatures2_1: "مجاني 100% وخفيف الوزن للغاية ويعمل على نظام Mac و Windows.",
        swFeatures2_2: "آلاف الملحقات (Plugins) لحل المشكلات المعقدة.",
        swFeatures2_3: "سرعة معالجة وتكامل تام مع لغة بايثون.",
        
        softwareTitle3: "Google Earth Engine",
        softwareDesc3: "منصة سحابية ثورية لتحليل ومعالجة صور الأقمار الصناعية والبيانات البيئية الضخمة (Big Data) على نطاق كوكبي في ثوانٍ معدودة باستخدام سيرفرات غوغل الفائقة.",
        softwareDev3: "Google Cloud",
        swFeatures3_1: "معالجة صور الأقمار الصناعية على نطاق كوكبي بدون تنزيل ملفات.",
        swFeatures3_2: "برمجة باستخدام JavaScript أو Python بشكل سحابي كامل.",
        swFeatures3_3: "الوصول لمكتبة بيانات مجانية ضخمة تحوي بيانات لعقود ماضية.",
        
        softwareTitle4: "PostGIS / PostgreSQL",
        softwareDesc4: "إضافة لقواعد البيانات مفتوحة المصدر PostgreSQL تحولها إلى قاعدة بيانات جغرافية قوية قادرة على حفظ البيانات المكانية وتخزينها، وعمل استعلامات SQL مكانية متطورة وسريعة للغاية.",
        softwareDev4: "Refractions Research",
        swFeatures4_1: "المعيار المهني والفعلي لإدارة قواعد البيانات الجغرافية الكبيرة.",
        swFeatures4_2: "إجراء عمليات الهندسة المكانية المعقدة مباشرة عبر كود SQL.",
        swFeatures4_3: "تكامل تام وربط مباشر مع برامج ArcGIS و QGIS وسيرفرات الويب.",
        
        softwareTitle5: "Python for GIS",
        softwareDesc5: "لغة البرمجة الأهم على الإطلاق لعالم الـ GIS. باستخدام مكتبات مثل GeoPandas و Shapely، أو مكتبة ArcPy المدفوعة، يمكنك أتمتة كافة العمليات الحسابية وبناء نماذج أتمتة مذهلة.",
        softwareDev5: "Geo-Development",
        swFeatures5_1: "أتمتة المهام المتكررة <bdi>(Geoprocessing Automation)</bdi>.",
        swFeatures5_2: "معالجة البيانات الجغرافية الضخمة بذكاء وسرعة مدهشة.",
        swFeatures5_3: "المهارة رقم 1 المطلوبة حالياً في أسواق العمل الدولية للتميز.",
        
        softwareTitle6: "Leaflet & MapLibre JS",
        softwareDesc6: "مكتبات جافاسكريبت قوية وخفيفة الوزن لبناء خرائط تفاعلية حية على صفحات الويب وتطبيقات الهواتف المحمولة. تتيح للمطورين بناء تطبيقات مخصصة وتفاعلية بالكامل للعملاء.",
        softwareDev6: "Web Cartography",
        swFeatures6_1: "حجم مكتبات صغير جداً وسرعة تحميل فائقة على الهواتف.",
        swFeatures6_2: "بناء لوحات تحكم وخرائط تفاعلية للشركات.",
        swFeatures6_3: "متوافق مع كافة مصادر البيانات الجغرافية مثل GeoJSON و WMS.",
        
        // Spatial Data Hub Section
        dataHubTitle: "البيانات الجغرافية المفتوحة للمملكة",
        dataHubSubtitle: "دليل شامل ومنسق لأهم طبقات البيانات الجغرافية المجانية والنظيفة المتاحة للتحميل المباشر لمشاريع الطلاب والباحثين",
        filterDataAll: "جميع الملفات",
        filterDataBoundaries: "الحدود الإدارية",
        filterDataRoads: "الطرق والشبكات",
        filterDataTerrain: "الارتفاعات والتضاريس",
        filterDataEnvironment: "البيئة والغطاء النباتي",
        
        datasetTitle1: "الحدود الإدارية للمملكة",
        datasetSource1: "<i class=\"fa-solid fa-building\"></i> الهيئة العامة للإحصاء",
        datasetDesc1: "الحدود الرسمية لمناطق ومحافظات المملكة العربية السعودية الثلاث عشرة. مجهزة وجاهزة للاستخدام في التحليل الإحصائي وخرائط التوزيعات الجغرافية.",
        datasetSize1: "<i class=\"fa-solid fa-weight-hanging\"></i> 14.2 MB",
        datasetBtn1: "<i class=\"fa-solid fa-arrow-up-right-from-square\"></i> بوابة الإحصاء (GASTAT)",
        
        datasetTitle2: "شبكة الطرق الوطنية الكبرى",
        datasetSource2: "<i class=\"fa-solid fa-building\"></i> وزارة النقل والخدمات اللوجستية / OSM",
        datasetDesc2: "شبكة الطرق السريعة والرئيسية والفرعية التي تربط كافة مدن وقرى المملكة، مناسبة لتحليلات الشبكات (Network Analysis) وحساب أقصر مسار.",
        datasetSize2: "<i class=\"fa-solid fa-weight-hanging\"></i> 28.5 MB",
        datasetBtn2: "<i class=\"fa-solid fa-arrow-up-right-from-square\"></i> بوابة النقل (MOT)",
        
        datasetTitle3: "نموذج الارتفاعات الرقمي (DEM - 30m)",
        datasetSource3: "<i class=\"fa-solid fa-building\"></i> USGS / SRTM NASA",
        datasetDesc3: "بيانات ارتفاعات سطح الأرض بدقة 30 متراً للمملكة العربية السعودية، مثالية لتحليلات المنحدرات (Slope)، ومجاري السيول والأودية (Hydrology Analysis).",
        datasetSize3: "<i class=\"fa-solid fa-weight-hanging\"></i> 112 MB",
        datasetBtn3: "<i class=\"fa-solid fa-arrow-up-right-from-square\"></i> بوابة التحميل (USGS)",
        
        datasetTitle4: "خارطة الغطاء النباتي واستخدام الأراضي",
        datasetSource4: "<i class=\"fa-solid fa-building\"></i> وكالة الفضاء الأوروبية Copernicus",
        datasetDesc4: "بيانات مرصودة توضح توزيع الغطاء النباتي، المناطق الزراعية والمساحات العمرانية والصحاري في السعودية بدقة تمثيلية تبلغ 10 أمتار.",
        datasetSize5: "<i class=\"fa-solid fa-weight-hanging\"></i> 45.1 MB",
        datasetBtn4: "<i class=\"fa-solid fa-arrow-up-right-from-square\"></i> استكشاف Copernicus",
        
        // UTM & CRS Calculator Section
        utmBadge: "الأدوات الهندسية",
        utmTitle: "حاسبة النطاق الجغرافي ونظام الإحداثيات (UTM & CRS)",
        utmSubtitle: "حدد مدينتك أو منطقتك في المملكة للتعرف فوراً على مسقط الخريطة الأنسب، ورمز EPSG العالمي، والمرجع الجيوديسي المعتمد للمشاريع المساحية",
        calcCardTitle: "معطيات النطاق الجغرافي",
        cardHint: "اختر المنطقة الجغرافية أو المدينة في المملكة العربية السعودية لحساب بيانات الإحداثيات مباشرة:",
        labelSelectCity: "المدينة أو المنطقة المستهدفة:",
        placeholderSelectCity: "اختر المدينة / المنطقة...",
        resultPlaceholderTitle: "في انتظار اختيار المنطقة...",
        resultPlaceholderDesc: "يرجى اختيار مدينة من القائمة المجاورة لعرض بيانات مسقط الإحداثيات ونظام المرجع الوطني بدقة ميكروية.",
        
        labelUtmZone: "Universal Transverse Mercator (UTM) Zone",
        labelEpsgCode: "رمز النظام المرجعي (EPSG)",
        labelCentralMeridian: "خط الطول المركزي (Central Meridian)",
        labelDatum: "المرجع الجيوديسي (Datum)",
        labelUsage: "الاستخدام الميداني الشائع",
        noteTitle: "توجيه هندسي وتوصية مساحية:",
        
        // Golden Tips Section
        tipsTitle: "نصائح ذهبية للتميز في التخصص",
        tipsSubtitle: "إرشادات وتوجيهات عملية من خبراء المجال لتسريع نموك المهني",
        tipTitle1: "افهم الجغرافيا قبل الأزرار",
        tipDesc1: "لا تكن مجرد منفذ نقرات (Button Pusher). افهم الأساسيات العلمية أولاً؛ لماذا نختار مسقطاً معيناً؟ وما هو نموذج البيانات الأنسب للتحليل؟ استيعاب المفهوم النظري يضمن دقة وصحة مخرجاتك.",
        tipTitle2: "تعلم البرمجة (بايثون) مبكراً",
        tipDesc2: "بايثون هي المهارة الذهبية الأقوى حالياً. تعلم كيف تكتب سكربتات لتسريع المهام المتكررة (Geoprocessing) والتعامل مع قواعد البيانات الجغرافية الضخمة. ستختصر على نفسك مئات ساعات العمل اليدوي.",
        tipTitle3: "ابنِ محفظة أعمالك (Portfolio)",
        tipDesc3: "لا تنتظر التخرج لتبدأ في البحث عن عمل. صمم خرائط مميزة، واعرضها على منصة GitHub أو Behance أو LinkedIn. محفظة الأعمال التطبيقية الحية هي أسرع وسيلة لإثبات كفاءتك لأي جهة توظيف.",
        tipTitle4: "لا تحصر نفسك في برنامج واحد",
        tipDesc4: "كن مرناً دائماً. تعلم ArcGIS Pro كمعيار عالمي للشركات الكبرى، وتدرب أيضاً على QGIS كأداة قوية مفتوحة المصدر. هذه المرونة ستجعلك جاهزاً لأي بيئة عمل أو مشاريع برمجية حرة.",
        tipTitle5: "تابع وتفاعل مع مجتمع الـ GIS",
        tipDesc5: "تابع قادة التخصص والمطورين على شبكات التواصل الاحترافية مثل LinkedIn و X. انخرط في التحديات العالمية مثل (30DayMapChallenge#) لمواكبة أحدث الابتكارات والمشاريع والتقنيات.",
        
        // YouTube learning channels
        ytLibraryTitle: "مكتبة فيديوهات وقنوات يوتيوب الموصى بها",
        ytLibrarySubtitle: "شروحات مرئية وقنوات عربية وعالمية متميزة تقدم دروساً وتطبيقات عملية حية",
        ytDuration1: "دورات وورش عمل",
        ytTitle1: "قناة تدريب إزري السعودية الرسمية",
        ytDesc1: "القناة التدريبية الرسمية لشركة إزري السعودية، تقدم محاضرات علمية وورش عمل حية ومجانية لتطوير المهارات والاحتراف في نظم معلومات ArcGIS Pro والمنصات السحابية.",
        ytDuration2: "120+ فيديو",
        ytTitle2: "احترف برمجة الـ GIS ومكاتب QGIS",
        ytDesc2: "القناة العالمية الرائدة للتعلم والاحتراف البرمجي في نظم المعلومات الجغرافية، تركز على لغة بايثون للتحليل الجغرافي ومكاتب ArcPy و QGIS API المتقدمة باللغة الإنجليزية.",
        ytDuration3: "دروس تطبيقية",
        ytTitle3: "شروحات برمجيات الاستشعار والـ GIS العملية",
        ytDesc3: "قناة ممتازة تقدم شروحات حية وعملية باللغة العربية لبرمجيات الاستشعار عن بعد ونظم المعلومات الجغرافية، مع تغطية ممتازة لبرامج QGIS و ERDAS و ENVI.",
        ytDuration4: "150+ درس",
        ytTitle4: "شروحات نظم التحليل والمطابقة التضاريسية",
        ytDesc4: "دليل مرئي عالمي تفصيلي وسهل المتابعة باللغة الإنجليزية يغطي تحليلات ArcGIS Desktop و ArcGIS Pro و QGIS وتحليل التضاريس والارتفاعات الرقمية DEM بكفاءة.",
        ytBtn: "تصفح القناة",
        
        // Recommended Courses Section
        coursesTitle: "أفضل وأهم الدورات المطلوبة لنظم المعلومات الجغرافية",
        coursesSubtitle: "أهم المسارات والشهادات المهنية العالمية المعتمدة لبناء مسيرتك الجغرافية والبرمجية بنجاح",
        courseLevel1: "مبتدئ / متوسط",
        courseTitle1: "شهادات إزري الفنية المعتمدة (Esri Certification)",
        courseSource1: "شركة Esri العالمية لبرمجيات الـ GIS",
        courseDesc1: "الشهادة المهنية الفنية الأقوى عالمياً لإثبات الاحتراف والكفاءة في إدارة قواعد البيانات الجغرافية واستخدام برمجيات ArcGIS Pro و Enterprise بتميز واجتياز الاختبارات الفنية الرسمية.",
        coursePlatformName1: "المنصة: Esri Academy",
        
        courseLevel2: "متقدم (رخصة مهنية)",
        courseTitle2: "الرخصة المهنية العالمية (GISP Certification)",
        courseSource2: "معهد اعتماد نظم المعلومات الجغرافية الدولي (GISCI)",
        courseDesc2: "الرخصة المهنية الأكثر شهرة واعتماداً في القطاع الجغرافي عالمياً. تتطلب خبرة عملية موثقة لعدة سنوات، تحصيلاً أكاديمياً جيوماتكياً، واجتياز الامتحان المهني الدولي للمعهد.",
        coursePlatformName2: "المنصة: GISCI Institute",
        
        courseLevel3: "مبتدئ / أساسي",
        courseTitle3: "تخصص نظم المعلومات الجغرافية الاحترافي (UC Davis)",
        courseSource3: "جامعة كاليفورنيا ديفيس (UC Davis) عبر Coursera",
        courseDesc3: "أشهر سلسلة أكاديمية دولية معتمدة على منصة كورسيرا. تبدأ من الصفر لتغطية أساسيات الخرائط وعلم المساحة والتحليل التضاريسي المتقدم وإنتاج الحزم الجغرافية بشكل علمي ممتاز.",
        coursePlatformName3: "المنصة: Coursera",
        
        courseLevel4: "متوسط",
        courseTitle4: "تخصص الخرائط والتحليل المكاني الفني (U of Toronto)",
        courseSource4: "جامعة تورنتو الكندية عبر Coursera",
        courseDesc4: "تخصص احترافي متقدم يركز بالكامل على مهارات التحليل المكاني الفني، ومعالجة تباين البيانات، والتعديل الجغرافي، وإخراج ونمذجة البيانات الجغرافية بأساليب إبداعية مذهلة.",
        coursePlatformName4: "المنصة: Coursera",
        
        courseLevel5: "متوسط (استشعار)",
        courseTitle5: "مبادئ الاستشعار عن بعد ومعالجة الأطياف (Geneva)",
        courseSource5: "جامعة جنيف السويسرية عبر Coursera",
        courseDesc5: "دورة معتمدة وشهادة قوية من جامعة جنيف السويسرية المرموقة، تشرح أساسيات الاستشعار عن بعد، وتفاعلات الإشعاع مع الأرض، وتطبيقات المعالجة الطيفية للصور الفضائية.",
        coursePlatformName5: "المنصة: Coursera",
        
        courseLevel6: "متقدم (بيانات مكانية)",
        courseTitle6: "علوم البيانات المكانية وتطبيقاتها (Spatial Data Science)",
        courseSource6: "جامعة يونسي الكورية عبر Coursera",
        courseDesc6: "برنامج تخصصي رفيع المستوى يركز على علوم البيج داتا ونظم إدارة قواعد البيانات الجغرافية Spatial DBMS وخرائط الويب والتحليلات الإحصائية الجغرافية المتقدمة.",
        coursePlatformName6: "المنصة: Coursera",
        
        // Common Mistakes Section
        mistakesTitle: "أخطاء كارثية يقع فيها مبتدئو الـ GIS",
        mistakesSubtitle: "تجنب هذه الأخطاء الأربعة الشائعة التي تعطل عمل البرمجيات وتفسد الخرائط الجغرافية",
        
        mistakeLabel1: "الخطأ الشائع:",
        solutionLabel1: "الحل الصحيح والاحترافي:",
        
        mistakeTitle1: "1. تداخل ونزاع نظم الإحداثيات (CRS Mismatch)",
        mistakeDesc1: "إسقاط طبقات بنظم إحداثيات مرجعية مختلفة (مثلاً طبقة بنظام WGS84 الجغرافي وطبقة أخرى بنظام إسقاط ميركاتور UTM) في نفس المشروع دون التحقق من مطابقة نظام إحداثيات الخريطة، مما يتسبب في انحراف الخريطة بآلاف الأمتار أو ظهورها في منتصف المحيط الهندي!",
        solutionItem1_1: "قم بتوحيد نظام الإحداثيات (CRS) لجميع طبقات بياناتك المساحية قبل البدء بالتحليل.",
        solutionItem1_2: "استخدم خاصية \"التحويل الفوري أثناء العرض\" (On-the-Fly Projection) في برمجيات QGIS و ArcGIS Pro.",
        solutionItem1_3: "قم بتعيين نظام إحداثيات موحد للمشروع بأكمله يتوافق مع منطقتك (مثل استخدام EPSG:3857 لخرائط الويب، أو مساقط UTM Zone 37N إلى 39N للمشاريع المحلية بالمملكة العربية السعودية).",
        
        mistakeTitle2: "2. إرسال ملف Shapefile منفصل وفقدان بقية الملحقات (.shp only)",
        mistakeDesc2: "إرسال ملف بامتداد `.shp` فقط عبر الإيميل أو نقله لمجلد آخر ظناً منك أنه الطبقة الكاملة، مما يؤدي فوراً لتلف الطبقة تماماً وفشلها في الفتح على أي جهاز آخر لأنها فقدت الجداول والروابط والمساقط الملحقة بها.",
        solutionItem2_1: "تذكر دائماً أن ملف الـ Shapefile هو عبارة عن \"مجموعة عائلية\" من 3 إلى 8 ملفات مرتبطة ببعضها البعض ومحفوظة بنفس الاسم تماماً (مثل `.shp`, `.dbf`, `.shx`, `.prj`).",
        solutionItem2_2: "إذا رغبت بنقل الطبقة أو إرسالها لزميلك، فقم بضغط كامل المجلد أو كامل الملفات ذات الاسم المشترك في ملف مضغوط واحد `.zip`.",
        solutionItem2_3: "<strong>الخيار الأفضل حديثاً:</strong> انتقل كلياً لاستخدام صيغة **GeoPackage (`.gpkg`)** المتكاملة والموصى بها رسمياً من OGC؛ حيث تجمع الطبقات المتعددة وقواعد البيانات والجداول في ملف ذكي واحد وبأداء فائق السرعة!",
        
        mistakeTitle3: "3. استخدام الحروف العربية والمسافات في مسارات الحفظ (Arabic Paths)",
        mistakeDesc3: "تنظيم مجلداتك وحفظ ملفاتك في مسارات تحتوي على حروف عربية أو مسافات فارغة (مثال: `C:\\المستخدمين\\أحمد\\بيانات نظم المعلومات\\الرياض.shp`). هذا الأمر يتسبب في تعطل أدوات المعالجة الجغرافية (Geoprocessing Tools) كأدوات الكليب والرندرة، والسبب هو عدم دعم مكتبات بايثون و GDAL القديمة للمسارات غير اللاتينية بشكل مثالي.",
        solutionItem3_1: "احرص كل الحرص على استخدام الأحرف الإنجليزية فقط والأرقام في تسمية المجلدات وملفات الـ GIS.",
        solutionItem3_2: "تجنب استخدام المسافات الفارغة نهائياً؛ واستبدلها دائماً بالشرطة السفلية (Underscore `_`) (مثال: `C:/gis_workspace/riyadh_boundary/riyadh_suburbs.shp`).",
        solutionItem3_3: "هذه العادة الذهبية البسيطة ستمنع حدوث أكثر من 90% من أخطاء الـ Run Failure المبهمة والمفاجئة في بايثون ومكتبات الـ GIS.",
        
        mistakeTitle4: "4. إهمال كتابة البيانات الوصفية والتوثيق (Missing Metadata)",
        mistakeDesc4: "إنتاج طبقات مساحية وخرائط وتوزيعها دون إرفاق ملف توثيقي أو كتابة البيانات الوصفية (Metadata) لها؛ مما يجعل المستخدم اللاحق (أو أنت نفسك بعد بضعة أشهر) تجهل مصدر البيانات، تاريخ المسح، الدقة المكانية، أو نسبة الخطأ المسموح بها.",
        solutionItem4_1: "خصص 5 دقائق بنهاية كل مشروع لتعبئة نموذج البيانات الوصفية (Metadata Card) ببرمجيات الـ GIS.",
        solutionItem4_2: "دوّن بوضوح: الجهة المصنعة للبيانات، تاريخ المسح الفعلي، نظام الإسقاط، ودقة المسح بالأمتار، بالإضافة إلى شروط الاستخدام والملكيات الفكرية.",
        solutionItem4_3: "توثيق البيانات يرفع قيمتها الاحترافية ويضمن بقاءها صالحة للاستخدام وقابلة للدمج في قواعد البيانات الوطنية ومشاريع صناع القرار.",
        
        // Vision 2030 Section
        visionBadge: "<i class=\"fa-solid fa-gem text-accent animate-pulse\"></i> فضاء الابتكار الجيومكاني ورؤية الوطن",
        visionTitle: "رؤية 2030 <span class=\"highlight\">والمستقبل الجيومكاني</span>",
        visionSubtitle: "اكتشف كيف تقود التقنيات المساحية ونظم المعلومات الجغرافية مشاريع المملكة الكبرى، وتابع أحدث الأخبار وتعرف على سياسات حماية البيانات الوطنية",
        tabVision: "<i class=\"fa-solid fa-mountain-sun\"></i> رؤية السعودية 2030",
        tabNews: "<i class=\"fa-solid fa-newspaper\"></i> الأخبار المكانية",
        
        projectTitle1: "نيوم وذا لاين (NEOM & The Line)",
        projectDesc1: "تشكّل نظم المعلومات الجغرافية ثلاثية الأبعاد (3D GIS) والتكامل الجيومكاني مع نمذجة معلومات البناء (BIM) الأساس في التخطيط والتنفيذ لمدينة المستقبل الذكية. يتم استخدام نظم المعلومات الجغرافية لتحديد مسارات النقل الذاتي، ونمذجة الشبكات الخدمية التحتية، وتوليد التوائم الرقمية (Digital Twins) بالكامل لتشغيل المدينة وتتبع صيانتها لحظياً بخرائط حية.",
        projectSkill1: "<i class=\"fa-solid fa-cube\"></i> التوائم الرقمية 3D Digital Twins",
        
        projectTitle2: "مشروع البحر الأحمر (The Red Sea)",
        projectDesc2: "يعتمد المشروع على نظم معلومات جغرافية بحرية وبيئية دقيقة للغاية (Marine GIS). يتم توظيف الاستشعار عن بعد ومسح القيعان البحرية (Bathymetry) لرسم خرائط الشعاب المرجانية، والموائل الحساسة بيئياً لضمان عدم المساس بها أثناء التشييد، مع مراقبة التيارات المائية ودرجات الحرارة عبر الأقمار الصناعية لتحقيق تنمية مستدامة بنسبة 100%.",
        projectSkill2: "<i class=\"fa-solid fa-satellite\"></i> الاستشعار عن بعد Remote Sensing",
        
        projectTitle3: "الرياض الخضراء (Green Riyadh)",
        projectDesc3: "يتم تطبيق تحليلات الغطاء النباتي (NDVI) وتحديد الجزر الحرارية الحضرية (Urban Heat Islands) لتوجيه خطط التشجير وتوزيع غرس 7.5 مليون شجرة جغرافياً داخل العاصمة. تساعد أدوات ملاءمة المواقع في محاكاة الاحتياجات المائية والظلال والتربة لضمان أقصى كفاءة بيئية وخفض حرارة الرياض بمعدل 1.5 إلى 2 درجات مئوية.",
        projectSkill3: "<i class=\"fa-solid fa-chart-line\"></i> الملاءمة المكانية & NDVI analysis",
        
        projectTitle4: "القدية والدرعية (Qiddiya & Diriyah)",
        projectDesc4: "تمثل النمذجة ثلاثية الأبعاد للتضاريس وحساب المنحدرات (DEM / Slope Analysis) وحل المشكلات الجيوتقنية الأساس لتصميم المشاريع الجبلية والمنشآت الترفيهية الفاخرة. كما يتم إعداد تحليلات هيدرولوجية مساحية معقدة لمحاكاة مياه الأمطار وتأمين مجاري السيول والأودية الطبيعية لحماية المواقع التاريخية والمستقبلية.",
        projectSkill4: "<i class=\"fa-solid fa-droplet\"></i> التحليل الهيدرولوجي Hydrology",
        
        // Geospatial news Tab
        newsSearchPlaceholder: "ابحث في الأخبار والفعاليات الجيومكانية...",
        newsContribHeader: "مساهمة جغرافية سريعة",
        newsContribDesc: "هل لديك خبر جيو-مكاني أو تحديث تقني تود نشره ومشاركته مع زملائك؟ اكتب مسودة الخبر أدناه وأرسله فوراً للمراجعة والنشر:",
        newsContribTitlePlaceholder: "عنوان الخبر أو الحدث الجغرافي...",
        newsContribDescPlaceholder: "اكتب تفاصيل الخبر المساحي بإيجاز...",
        newsContribBtn: "إرسال مسودة الخبر للمراجعة",
        alertNewsDraftSuccess: "تم إرسال ونشر مسودة الخبر بعنوان '{TITLE}' بنجاح وهي تظهر حياً في الموقع الآن!",
        
        newsTagOfficial: "خبر رسمي",
        newsTagTechnical: "تحديث فني",
        newsTagEvent: "فعالية مكانية",
        newsTagAcademic: "طلاب وجامعات",
        
        newsTitle1: "الهيئة العامة للمساحة والمعلومات الجيومكانية تطلق المنصة الموحدة",
        newsBody1: "أطلقت الهيئة العامة للمساحة والمعلومات الجيومكانية (GASGI) رسمياً المنصة الجيومكانية الوطنية الموحدة لربط وتكامل البيانات الجغرافية الحيوية بين كافة القطاعات الخدمية والحكومية بالمملكة لضمان موثوقية وتدفق البيانات المكانية.",
        
        newsTitle2: "توسيع نطاق استخدام الذكاء الاصطناعي الجغرافي Geo-AI",
        newsBody2: "أعلنت وزارة البيئة والمياه والزراعة عن تعزيز استخدام تقنيات الذكاء الاصطناعي الجغرافي والاستشعار عن بعد لمراقبة الغطاء النباتي بدقة متناهية، وتحديد مناطق الزحف الرملي والتعديات على الأراضي الحكومية آلياً.",
        
        newsTitle3: "انطلاق فعاليات ملتقى التقنيات الجيومكانية بالرياض",
        newsBody3: "شهدت العاصمة الرياض انطلاق فعاليات الملتقى الجيومكاني السنوي بمشاركة خبراء وباحثين محليين وعالميين لمناقشة أحدث تقنيات الليدار (LiDAR)، والتوائم الرقمية، وأنظمة التموضع الفضائي لربط المشاريع المساحية.",
        
        newsTitle4: "اعتماد معايير الإطار الوطني للبيانات الجيومكانية بالأبحاث",
        newsBody4: "أوصت الجامعات السعودية الطلاب والباحثين بضرورة مطابقة كافة الأبحاث والمشاريع الأكاديمية لمعايير المرجع الجيوديسي الوطني السعودي (GRS80/WGS84) المعتمد رسمياً لدى الهيئة لضمان انسجام مخرجاتهم الأكاديمية.",
        
        newsTitle5: "المملكة تستضيف المؤتمر العالمي الثالث للمعلومات الجيومكانية للأمم المتحدة بجدة",
        newsBody5: "أعلنت الأمم المتحدة رسمياً عن اختيار المملكة العربية السعودية ممثلة بالهيئة العامة للمساحة والمعلومات الجيومكانية لاستضافة المؤتمر العالمي الثالث للمعلومات الجيومكانية للأمم المتحدة (3rd UNWGIC) بمدينة جدة في نوفمبر 2026، لترسيخ ريادة المملكة الرقمية عالمياً.",
        
        newsTitle6: "المعلومات الجيومكانية تعلن إصدار تراخيص المسح الجوي والبانورامي لدعم موسم الحج",
        newsBody6: "أصدرت الهيئة الجيومكانية تصاريح وتراخيص لأعمال المسح الجوي والبانورامي عالي الدقة لصالح الجهات والقطاعات الحكومية المساهمة في أعمال موسم الحج 1447هـ / 2026م لضمان سلامة وإدارة الحشود والخدمات اللوجستية بدقة مكانية استثنائية.",
        
        // Suggestions and feedback
        feedbackTitle: "💡 هل لديك اقتراحات أو أفكار لتطوير الموقع؟",
        feedbackDesc: "يسعدنا جداً الاستماع لأفكارك ومقترحاتك لتطوير هذه البوابة وإضافة المزيد من الأدوات والدورات المفيدة لطلاب تخصص نظم المعلومات الجغرافية!",
        feedbackBtn: "تواصل معي عبر X للاقتراحات والتحسينات",
        
        // Ehsan Donation Campaign Floating Ad
        ehsanTitle: "منصة إحسان الوطنية",
        ehsanSubtext: "تسهيل وتوطين العمل الخيري بالمملكة",
        ehsanBody: "نحن في بوابة نظم المعلومات الجغرافية، كمنصة طلابية غير ربحية تقدم العون المعرفي، نؤمن بأهمية دعم مبادرات وطننا المعطاء. ندعوكم للمساهمة والتبرع ومساندة الأعمال الإنسانية والتنموية الرسمية عبر **منصة إحسان الوطنية للعمل الخيري** الرسمية في المملكة العربية السعودية بكل موثوقية وسرعة وأمان.",
        donateSecBadge: "عمل خيري وطني مستدام",
        donateTitle: "المسؤولية المجتمعية والتمكين الخيري لبلدنا المعطاء",
        donateFeature1: "مظلة رسمية آمنة وتحت إشراف مباشر من عدة جهات وهيئات حكومية.",
        donateFeature2: "دعم حقيقي مباشر يصل للجهات المستحقة بكل شفافية وسرعة.",
        btnDonateNow: "تبرع الآن عبر منصة إحسان",
        
        floatingAdBadge: "🇸🇦 الحملة الوطنية للتبرع",
        floatingAdTitle: "منصة إحسان الخيرية",
        floatingAdBody: "ساهم معنا بتقديم الخير ودعم المحتاجين عبر منصة إحسان الوطنية بكل أمان وموثوقية.",
        floatingAdBtn: "تبرع الآن (إحسان)",
        
        // Footer
        footerBrand: "منصة طلابية عربية غير ربحية تهدف لتسهيل وتبسيط علوم ومبادئ وأدوات نظم المعلومات الجغرافية وتقنيات الاستشعار عن بعد لجيل واعد من الجغرافيين والمطورين.",
        footerCredits: "&copy; 2026 | المنصة الجغرافية السعودية - تطوير وإشراف Yazeed Alshammari",
        
        // Search Input Placeholders
        searchPlaceholder: "ابحث عن ملف جغرافي بالاسم، الصيغة، أو المصدر...",
        noResultsFound: "لم يتم العثور على أي نتائج تطابق بحثك الجغرافي حالياً.",

        // X (Twitter) Community Section
        xCommunityTitle: "مجتمع X للتقنيات المكانية",
        xCommunitySubtitle: "حسابات ومجتمعات رائدة على منصة X تُثري المحتوى الجغرافي العربي وتدعم الطلاب",
        xVisitProfile: "زيارة الملف الشخصي <i class=\"fa-solid fa-arrow-left\"></i>",
        xProfileBio1: "مختص وباحث في نظم المعلومات الجغرافية، ينشر شروحات وتقنيات وحلول مكانية حية ومفيدة لطلاب ومحترفي الجيوماتكس.",
        xProfileBio2: "شروحات ومقالات مميزة في الـ GIS والتحليل المكاني وتصميم الخرائط الجذابة، تقدم محتوى تفاعلي متميز لتبسيط العلوم الجغرافية.",
        xProfileBio3: "مجتمع تطوعي عربي يهتم بنشر ومشاركة المعرفة والفرص والندوات وورش العمل وكل ما يخص نظم المعلومات الجغرافية والتقنيات المكانية.",
        xProfileBio4: "مختص في الجيوماتكس ونظم المعلومات الجغرافية، ينشر نصائح مهنية وتوجيهات للطلاب لتطوير مهاراتهم والالتحاق بسوق العمل بنجاح.",
        xProfileBio5: "حساب تعليمي متميز يركز على تقديم شروحات مبسطة، كتب رقمية، ومصادر تعليمية غنية لطلاب تخصص نظم المعلومات الجغرافية لتمكينهم أكاديمياً وعملياً.",
        xProfileBio6: "مهتم بمشاركة حيل وأدوات احترافية في QGIS وتصميم الخرائط الجذابة (Cartography)، مع تقديم إرشادات برمجية ممتازة للمطورين الجغرافيين.",
        xProfileBio7: "محلل بيانات مكانية كارتوغرافي شهير، يشارك خرائط استثنائية وعالية الدقة مع تقديم شروحات ممتازة حول استخدام لغتي R وبايثون في التحليل المكاني.",
        xProfileBio8: "بروفيسور جامعي ومطور حزمتي geemap و leafmap المفتوحتين، يقدم دروساً احترافية في تحليل بيانات الاستشعار عن بعد ومحرك جوجل لعلوم الأرض (Google Earth Engine).",
        
        // GeoMesh Hub
        navGeomesh: "منشئ شبكات الـ GeoMesh",
        geomeshBadge: "محاكاة ومعالجة جيومكانية سحابية",
        geomeshTitle: "مستودع التحليلات والـ <span class=\"highlight\">GeoMesh</span>",
        geomeshSubtitle: "قم بتوليد شبكة بيانات متكاملة لمدن المملكة وربطها محلياً بخادم FastAPI أو محاكاتها بدقة سحابية متقدمة",
        geomeshCardControl: "لوحة التحكم بالمعالجة الجيومكانية",
        geomeshCardControlDesc: "اختر النطاق الجغرافي، الدقة المكانية، والمتغيرات لإنشاء وتكامل طبقة شبكية متكاملة محلياً أو افتراضياً:",
        labelSelectRegion: "المنطقة الجغرافية المستهدفة:",
        placeholderSelectRegion: "اختر المنطقة الجغرافية...",
        labelResolution: "الدقة المكانية (حجم الخلية):",
        labelVariables: "المتغيرات والطبقات المستهدفة:",
        labelOutputFormat: "صيغة المخرجات الجغرافية:",
        btnGenerateMesh: "<i class=\"fa-solid fa-gears\"></i> توليد وتكامل شبكة البيانات الجغرافية",
        btnGeneratingMesh: "<i class=\"fa-solid fa-spinner fa-spin\"></i> جاري تشغيل خوارزميات المعالجة الجغرافية...",
        
        telemetrySensorTitle: "حالة المستشعرات حياً",
        telemetryOnline: "متصل بالشبكة",
        telemetryOffline: "وضع المحاكاة النشط",
        telemetryLiveTemp: "الحرارة المباشرة",
        telemetryHumidity: "مستوى الرطوبة",
        telemetryAirQuality: "مستوى جودة الهواء",
        telemetryPrecipitation: "الأمطار الأخيرة",
        
        consoleHeader: "وحدة معالجة البيانات الجغرافية - bash@spatial_engine.sh",
        consolePlaceholder: "في انتظار إرسال معطيات التحليل... قم بالضغط على زر التوليد بالأعلى للبدء.",
        btnDownloadMesh: "<i class=\"fa-solid fa-cloud-arrow-down\"></i> تحميل البيانات الجغرافية المعالجة",
        
        // Region names
        regRiyadh: "منطقة الرياض (الوسطى)",
        regWestern: "المنطقة الغربية (مكة وجدة)",
        regEastern: "المنطقة الشرقية (الدمام والجبيل)",
        regSouthern: "المنطقة الجنوبية (عسير وأبها)",
        regNorthern: "المنطقة الشمالية (تبوك والحدود)",
        regHail: "منطقة حائل",
        
        // Variable names
        varNdvi: "مؤشر الغطاء النباتي (NDVI)",
        varLst: "حرارة سطح الأرض (LST)",
        varNo2: "ثاني أكسيد النيتروجين (NO2)",
        varPop: "الكثافة السكانية (Population Density)",
    },
    
    en: {
        // Page Title & Meta
        documentTitle: "Geographic Information Systems & Environmental Analysis | GIS Portal",
        
        // Navigation Bar
        navHome: "Home",
        navAbout: "About GIS",
        navDevices: "Hardware Specs",
        navConverter: "GIS File Converter",
        navSoftware: "Software",
        navData: "Data Hub",
        navUtm: "UTM Calculator",
        navCourses: "Recommended Courses",
        navTips: "Golden Tips",
        navMistakes: "Common Mistakes",
        navVision: "Vision 2030",
        navX: "X Community",
        navDonate: "Donate to Ehsan",
        
        // Mobile Drawer Header
        drawerTitle: "Main Menu",
        
        // Hero Section
        heroBadge: "The Future of Spatial Technology & Digital Analysis",
        heroTitle: "Innovative <br><span class=\"gradient-text\">GIS Portal</span>",
        heroSubtitle: "Your comprehensive surveying and programming guide to learning Geographic Information Systems (GIS) and spatial analysis using state-of-the-art cloud tools and interactive maps.",
        btnExplore: "Recommended Hardware",
        btnAbout: "Explore GIS",
        coordinateLabel: "Coordinate System & Projection",
        
        // About GIS Section
        aboutTitle: "What is GIS?",
        aboutSubtitle: "The science and technology behind smart maps and modern spatial analysis",
        aboutCardTitle: "The Power of Location & the Science of \"Where?\"",
        aboutText1: "<strong>Geographic Information Systems (GIS)</strong> is a framework and technology for gathering, storing, managing, analyzing, and displaying all types of spatial and geographical data linked to specific locations on Earth.",
        aboutText2: "By integrating digital mapping with robust databases, GIS doesn't just show us <em>\"what is there\"</em>, but enables us to understand <em>\"why it is there\"</em> and <em>\"what will happen if it changes\"</em>, making it the core engine for modern decision-making.",
        statNum1: "80%",
        statLabel1: "of the world's data contains a spatial (geographic) component.",
        statNum2: "3D",
        statLabel2: "Multi-dimensional data analysis for realistic 3D city modeling.",
        
        // The 5 Pillars
        pillarsTitle: "The 5 Pillars of GIS",
        pillarTitle1: "1. Data",
        pillarDesc1: "The fuel of the system. Includes tabular attributes and spatial data in both formats: Vector and Raster.",
        pillarTitle2: "2. Software",
        pillarDesc2: "The tools used to input, manipulate, analyze, and map spatial data, such as QGIS and ESRI suites.",
        pillarTitle3: "3. Hardware",
        pillarDesc3: "High-performance computers, cloud servers, GPS receivers, and remote sensors like drones and satellites.",
        pillarTitle4: "4. Methods",
        pillarDesc4: "Systematic workflows, analytical algorithms, and spatial statistics applied to solve complex problems.",
        pillarTitle5: "5. People",
        pillarDesc5: "The GIS professionals, developers, and analysts who design, build, and run the systems.",
        
        // Careers & Application Fields
        careersTitle: "Careers and Application Fields",
        careerTitle1: "Urban Planning & Smart Cities",
        careerDesc1: "Planning transportation routes, determining optimal service locations, and engineering smart city expansion.",
        careerTitle2: "Environment & Resource Management",
        careerDesc2: "Monitoring desertification, vegetation coverage, tracing pollution, climate change studies, and wildlife protection.",
        careerTitle3: "Logistics and Transportation",
        careerDesc3: "Routing emergency vehicles, managing transit fleets, and planning utilities and grid infrastructure.",
        careerTitle4: "Disaster and Crisis Management",
        careerDesc4: "Predicting flood paths via topographical modeling, and tracking forest fires and hazards for rapid mitigation.",
        
        // Recommended Hardware Section
        hardwareTitle: "Recommended Hardware & Computers for GIS",
        hardwareSubtitle: "Comprehensive guide for choosing the optimal PC to run map software, spatial analysis, and heavy datasets.",
        hardwareWarning: "<strong>Important OS Alert:</strong> <strong>ArcGIS Pro</strong> (industry standard) officially runs <strong>only on Windows</strong>. If using a Mac (Apple Silicon), you will need virtualization software like Parallels Desktop to run Windows. Meanwhile, the open-source <strong>QGIS</strong> runs natively on all platforms (Windows, Mac, Linux).",
        
        deviceBadge1: "Entry Level (Minimum Specifications)",
        deviceTitle1: "Basic Computers for Beginners",
        deviceDesc1: "Ideal for freshman students, simple mapping, and light analysis.",
        deviceBadge2: "Mid Level (Recommended for Students)",
        deviceTitle2: "Advanced PCs for Students & Engineers",
        deviceDesc2: "Excellent performance for 3D modeling and complex spatial analysis.",
        deviceBadge3: "High Performance (Workstations)",
        deviceTitle3: "Ultimate Mobile Workstations",
        deviceDesc3: "For remote sensing analysis, satellite imagery processing, and spatial AI modeling",
        deviceBadge4: "All-in-One Option (Desktop PC Build)",
        deviceTitle4: "Spatial Desktop PC Build",
        deviceDesc4: "Get maximum possible performance and longest lifespan with supreme cooling",
        
        specCpu: "Processor",
        specRam: "RAM",
        specGpu: "Graphics Card (GPU)",
        specStorage: "Storage (SSD)",
        specDisplay: "Display",
        specCooling: "Cooling & Power",
        deviceNominees: "Recommended Models:",
        deviceNoteTitle: "Build Note:",
        
        entryCpu: "Intel Core Ultra 5 / AMD Ryzen 5 (Recent Gen)",
        entryRam: "16 GB DDR5 (Minimum for GIS in 2026)",
        entryGpu: "NVIDIA RTX 3050 / AMD Radeon 780M (Or powerful integrated)",
        entryStorage: "512 GB NVMe PCIe SSD (Ultra-fast)",
        entryDisplay: "15.6\" FHD IPS (Comfortable anti-glare colors)",
        entryList: "Lenovo IdeaPad Slim 3 (2026) / ASUS VivoBook 15 / HP 15",
        
        midCpu: "Intel Core Ultra 7 / AMD Ryzen 7 (Powerful HS/H Series)",
        midRam: "32 GB DDR5 (For smooth performance)",
        midGpu: "NVIDIA RTX 4060 / RTX 4060 Ti Laptop (8GB VRAM)",
        midStorage: "1 TB NVMe M.2 SSD PCIe Gen 4",
        midList: "ASUS ROG Zephyrus G14 (2026) / HP Victus 16 / Dell Inspiron 16 Plus",
        
        proCpu: "Intel Core Ultra 9 / AMD Ryzen 9 / Apple M4 Pro (Latest Gen)",
        proRam: "64 GB DDR5 6400MHz (Ultra-fast speeds for large datasets)",
        proGpu: "NVIDIA RTX 4070 / RTX 4070 Super / Apple M4 Pro GPU",
        proStorage: "2 TB NVMe PCIe Gen4 SSD (Extreme read & write)",
        proDisplay: "16\" OLED 3K / Liquid Retina XDR (Extreme accuracy)",
        proList: "Lenovo ThinkPad P1 Gen 8 / Dell Precision 5690 / MacBook Pro 16\" (M4 Pro)",
        
        pcCpu: "AMD Ryzen 9 9900X / Intel Core Ultra 9 285K (Flagship)",
        pcRam: "64 GB DDR5 6000MHz+ (Dual Channel 2x32GB)",
        pcGpu: "NVIDIA RTX 4070 Ti Super / RTX 4080 Super (16GB VRAM)",
        pcStorage: "2TB Samsung 990 Pro M.2 + 4TB HDD (Map Archives)",
        pcCooling: "360mm Liquid Cooler + 850W Gold PSU",
        pcNote: "The best and most cost-effective solution for spatial AI rendering and heavy-duty simulation computations.",
        pcPriceLabel: "Approximate Cost:",
        proPriceLabel: "Approximate Price:",
        currency: "SAR",
        
        // GIS File Converter Section
        converterBadge: "100% Secure Local Conversion Without Servers",
        converterTitle: "Geographic Information Systems <span class=\"highlight\">File Converter (GIS)</span>",
        converterSubtitle: "Convert your geographic data formats locally on your device to protect data privacy: Shapefile to GeoJSON, CSV to GeoJSON, and vice-versa automatically.",
        converterCardUpload: "File Upload & Processing Center",
        converterCardUploadDesc: "Select your conversion mode and drag & drop the spatial file into the designated area below to begin instant automatic conversion:",
        
        tabShpGeoJson: "Shapefile → GeoJSON",
        tabCsvGeoJson: "CSV → GeoJSON",
        tabGeoJsonCsv: "GeoJSON → CSV",
        dropzoneTitleShp: "Drag & drop zipped Shapefile (.zip)",
        dropzoneDescShp: "ZIP file must contain .shp, .dbf, and preferably .prj files",
        dropzoneTitleCsv: "Drag & drop CSV containing coordinates",
        dropzoneDescCsv: "CSV must contain columns representing Latitude and Longitude",
        dropzoneTitleGeoJson: "Drag & drop spatial GeoJSON file",
        dropzoneDescGeoJson: "Upload GeoJSON layer to extract attribute table to an Excel-compatible CSV",
        dropzoneBrowse: "Browse Local Files",
        
        helpShp2GeoJson: "This mode allows converting polygons, polylines, and points from Shapefile format (including full attribute tables) to a standard GeoJSON file ready for web use.",
        helpCsv2GeoJson: "Convert tabular databases (CSV) containing geographical coordinates (like Latitude/Longitude) to a standard spatial GeoJSON format.",
        helpGeoJson2Csv: "This mode reads spatial GeoJSON layers and extracts all attribute table fields (Properties) with latitude and longitude coordinates into an organized CSV spreadsheet.",
        
        outputSectionTitle: "Live Output Preview",
        outputPlaceholderDesc: "Interactive window programmed to view spatial output samples upon conversion completion:",
        outputMetaPlaceholder: "No processed file currently",
        btnDownloadResult: "Download Processed Spatial File",
        
        // Software Guide Section
        softwareTitle: "Geospatial Software & Tools Repository",
        softwareSubtitle: "Your practical toolbox for professional environments and projects",
        filterAll: "All",
        filterDesktop: "Desktop Software",
        filterFree: "Open Source (Free)",
        filterCommercial: "Commercial (Paid)",
        filterCloud: "Cloud Analysis",
        filterDatabase: "Spatial Databases",
        filterDev: "Development & Programming",
        
        badgeCommercial: "Commercial (ESRI License)",
        badgeFree: "Open Source (100% Free)",
        badgeAcademic: "Free for Academic Use",
        badgeDb: "Open Source (Free)",
        badgePy: "Free Programming Environment",
        badgeWeb: "Open Source (Free)",
        btnLearnMore: "Visit Official Website",
        btnExplorePy: "Explore GeoPandas",
        btnExploreWeb: "Explore Leaflet.js",
        
        softwareTitle1: "ArcGIS Pro",
        softwareDesc1: "The gold standard and the most famous and widely used program globally in companies and government agencies. It features massive 3D analytical capabilities and high-resolution map display.",
        softwareDev1: "ESRI Corp.",
        swFeatures1_1: "Advanced spatial analysis and 3D simulation.",
        swFeatures1_2: "Excellent integration with cloud databases and Enterprise environments.",
        swFeatures1_3: "Available to students with discounted educational licenses.",
        
        softwareTitle2: "QGIS Desktop",
        softwareDesc2: "The most powerful open source giant and the most prominent competitor to Esri software. Completely free without any restrictions, backed by a huge community that provides thousands of free software plugins for every use.",
        softwareDev2: "OSGeo Foundation",
        swFeatures2_1: "100% free, extremely lightweight, and runs on Mac and Windows.",
        swFeatures2_2: "Thousands of plugins to solve complex problems.",
        swFeatures2_3: "Processing speed and complete integration with Python.",
        
        softwareTitle3: "Google Earth Engine",
        softwareDesc3: "A revolutionary cloud platform for analyzing and processing satellite imagery and environmental big data on a planetary scale in seconds using Google's super servers.",
        softwareDev3: "Google Cloud",
        swFeatures3_1: "Planetary-scale satellite imagery processing without downloading files.",
        swFeatures3_2: "Programming with JavaScript or Python in a fully cloud environment.",
        swFeatures3_3: "Access to a massive free data library containing decades of past observations.",
        
        softwareTitle4: "PostGIS / PostgreSQL",
        softwareDesc4: "An extension for PostgreSQL open source databases that turns it into a powerful spatial database capable of storing and querying spatial data, running advanced and fast SQL spatial queries.",
        softwareDev4: "Refractions Research",
        swFeatures4_1: "The professional and de facto standard for managing large spatial databases.",
        swFeatures4_2: "Run complex spatial geometry operations directly via SQL code.",
        swFeatures4_3: "Complete integration and direct connection with ArcGIS, QGIS, and web servers.",
        
        softwareTitle5: "Python for GIS",
        softwareDesc5: "The most important programming language of all for the GIS world. Using libraries like GeoPandas and Shapely, or the paid ArcPy library, you can automate all computational operations and build stunning automation workflows.",
        softwareDev5: "Geo-Development",
        swFeatures5_1: "Automating repetitive tasks (Geoprocessing Automation).",
        swFeatures5_2: "Processing massive geographic datasets intelligently and with amazing speed.",
        swFeatures5_3: "The number 1 skill currently in demand in international job markets to stand out.",
        
        softwareTitle6: "Leaflet & MapLibre JS",
        softwareDesc6: "Powerful, lightweight JavaScript libraries for building live interactive maps on web pages and mobile applications. It enables developers to build custom and fully interactive applications for clients.",
        softwareDev6: "Web Cartography",
        swFeatures6_1: "Very small library footprint and ultra-fast loading speed on mobile devices.",
        swFeatures6_2: "Building interactive dashboards and maps for enterprises.",
        swFeatures6_3: "Compatible with all spatial data sources such as GeoJSON and WMS.",
        
        // Spatial Data Hub Section
        dataHubTitle: "Open Saudi Spatial Data Hub",
        dataHubSubtitle: "Your quick directory to access official and open geospatial data repositories of Saudi Arabia, approved for graduation projects and environmental analysis.",
        filterDataAll: "All Datasets",
        filterDataBoundaries: "Boundaries",
        filterDataRoads: "Roads & Networks",
        filterDataTerrain: "Terrain & Elevation",
        filterDataEnvironment: "Environment & Land Cover",
        
        datasetTitle1: "Saudi Administrative Boundaries",
        datasetSource1: "<i class=\"fa-solid fa-building\"></i> GASTAT (General Authority for Statistics)",
        datasetDesc1: "Official administrative boundaries for the 13 regions and governorates of Saudi Arabia. Structured and ready for spatial statistics and choropleth mapping.",
        datasetSize1: "<i class=\"fa-solid fa-weight-hanging\"></i> 14.2 MB",
        datasetBtn1: "<i class=\"fa-solid fa-arrow-up-right-from-square\"></i> GASTAT Portal",
        
        datasetTitle2: "National Major Roads Network",
        datasetSource2: "<i class=\"fa-solid fa-building\"></i> Ministry of Transport / OSM",
        datasetDesc2: "Comprehensive highway, primary, and secondary road network connecting all regions of Saudi Arabia, ideal for routing and Network Analysis.",
        datasetSize2: "<i class=\"fa-solid fa-weight-hanging\"></i> 28.5 MB",
        datasetBtn2: "<i class=\"fa-solid fa-arrow-up-right-from-square\"></i> MOT Portal",
        
        datasetTitle3: "Digital Elevation Model (DEM - 30m)",
        datasetSource3: "<i class=\"fa-solid fa-building\"></i> USGS / SRTM NASA",
        datasetDesc3: "Topographical terrain elevation data at a resolution of 30 meters for Saudi Arabia. Perfect for slope analysis, hydrology modeling, and watersheds mapping.",
        datasetSize3: "<i class=\"fa-solid fa-weight-hanging\"></i> 112 MB",
        datasetBtn3: "<i class=\"fa-solid fa-arrow-up-right-from-square\"></i> USGS Explorer",
        
        datasetTitle4: "Land Cover & Land Use Map",
        datasetSource4: "<i class=\"fa-solid fa-building\"></i> ESA Copernicus Space Portal",
        datasetDesc4: "Classified spatial data indicating vegetation distribution, crops, urban structures, and deserts across Saudi Arabia at a high resolution of 10 meters.",
        datasetSize5: "<i class=\"fa-solid fa-weight-hanging\"></i> 45.1 MB",
        datasetBtn4: "<i class=\"fa-solid fa-arrow-up-right-from-square\"></i> Explore Copernicus",
        
        // UTM & CRS Calculator Section
        utmBadge: "Engineering Tools",
        utmTitle: "UTM Zone & Coordinate Reference System Calculator",
        utmSubtitle: "Select your Saudi city or region to instantly identify the optimal map projection, global EPSG code, and official geodetic datum for engineering surveys.",
        calcCardTitle: "Identify Regional Spatial Reference",
        cardHint: "Select your target Saudi city or region to calculate coordinate reference parameters immediately:",
        labelSelectCity: "Target Saudi City or Region:",
        placeholderSelectCity: "-- Select Saudi City --",
        resultPlaceholderTitle: "Awaiting region selection...",
        resultPlaceholderDesc: "Please select a city from the list to display its coordinate reference system and national geodetic reference parameters.",
        
        labelUtmZone: "Universal Transverse Mercator (UTM) Zone",
        labelEpsgCode: "Official EPSG Code",
        labelCentralMeridian: "Central Meridian",
        labelDatum: "Geodetic Datum",
        labelUsage: "Recommended Engineering Application Scope",
        noteTitle: "Geodetic Instruction & Surveying Tip:",
        
        // Golden Tips Section
        tipsTitle: "Golden Tips for Career Excellence",
        tipsSubtitle: "Practical instructions and directions from field experts to accelerate your professional growth",
        tipTitle1: "Understand Geography Before Buttons",
        tipDesc1: "Don't just be a button pusher. Understand the scientific fundamentals first; why do we choose a specific projection? And what is the most appropriate data model for analysis? Comprehending the theory guarantees accuracy and correctness of your outputs.",
        tipTitle2: "Learn Programming (Python) Early",
        tipDesc2: "Python is the most powerful golden skill today. Learn how to write scripts to speed up repetitive tasks (Geoprocessing) and handle massive spatial databases. You'll cut down hundreds of hours of manual work.",
        tipTitle3: "Build Your Portfolio",
        tipDesc3: "Don't wait for graduation to start looking for work. Design unique maps and display them on GitHub, Behance, or LinkedIn. A live practical portfolio is the fastest way to prove your competency to any hiring agency.",
        tipTitle4: "Don't Limit Yourself to One Program",
        tipDesc4: "Always remain flexible. Learn ArcGIS Pro as the global standard for large enterprises, and also train on QGIS as a powerful open-source tool. This flexibility will prepare you for any work environment or freelance coding project.",
        tipTitle5: "Follow and Interact with the GIS Community",
        tipDesc5: "Follow industry leaders and developers on professional networks like LinkedIn and X. Engage in global challenges like #30DayMapChallenge to keep up with the latest innovations, projects, and technologies.",
        
        // YouTube learning channels
        ytLibraryTitle: "Recommended YouTube Videos & Channels Library",
        ytLibrarySubtitle: "Visual tutorials and outstanding Arabic & global channels offering live practical lessons",
        ytDuration1: "Courses & Workshops",
        ytTitle1: "Official Esri Saudi Arabia Training Channel",
        ytDesc1: "The official training channel of Esri Saudi Arabia, offering live and free scientific lectures and workshops to develop skills and professionalism in ArcGIS Pro systems and cloud platforms.",
        ytDuration2: "120+ Videos",
        ytTitle2: "Master GIS Programming & QGIS Libraries",
        ytDesc2: "The leading global channel for learning and professional programming in GIS, focusing on Python for spatial analysis, ArcPy, and advanced QGIS API in English.",
        ytDuration3: "Practical Lessons",
        ytTitle3: "Remote Sensing & Practical GIS Tutorials",
        ytDesc3: "An excellent channel offering live, practical tutorials in Arabic for remote sensing and geographic information systems, with outstanding coverage of QGIS, ERDAS, and ENVI.",
        ytDuration4: "150+ Lessons",
        ytTitle4: "Terrain Analysis & Matching Tutorials",
        ytDesc4: "A detailed and easy-to-follow global visual guide in English covering ArcGIS Desktop, ArcGIS Pro, and QGIS spatial analyses, and digital elevation model (DEM) terrain modeling efficiently.",
        ytBtn: "Browse Channel",
        
        // Recommended Courses Section
        coursesTitle: "Top & Essential GIS Recommended Courses",
        coursesSubtitle: "The most important global professional courses and accredited certifications to build your GIS career successfully",
        courseLevel1: "Beg / Int",
        courseTitle1: "Esri Technical Certifications (Esri Certification)",
        courseSource1: "Esri Global GIS Software Corporation",
        courseDesc1: "The strongest technical professional certification globally to prove proficiency and competence in GIS database management and exceptional usage of ArcGIS Pro and Enterprise.",
        coursePlatformName1: "Platform: Esri Academy",
        
        courseLevel2: "Adv (Professional License)",
        courseTitle2: "Global Professional License (GISP Certification)",
        courseSource2: "GIS Certification Institute (GISCI)",
        courseDesc2: "The most renowned and accredited professional license in the geospatial sector globally. Requires documented years of experience, geomatics education, and passing the GISCI exam.",
        coursePlatformName2: "Platform: GISCI Institute",
        
        courseLevel3: "Beg / Essential",
        courseTitle3: "GIS Professional Specialization (UC Davis)",
        courseSource3: "University of California, Davis via Coursera",
        courseDesc3: "The most famous accredited international academic specialization on Coursera. Starts from scratch covering maps, surveying, terrain analysis, and GIS package creation.",
        coursePlatformName3: "Platform: Coursera",
        
        courseLevel4: "Intermediate",
        courseTitle4: "GIS Mapping & Spatial Analysis Specialization (U of Toronto)",
        courseSource4: "University of Toronto via Coursera",
        courseDesc4: "Advanced professional specialization focusing entirely on technical spatial analysis, resolving data variance, georeferencing, and creative geographic modeling.",
        coursePlatformName4: "Platform: Coursera",
        
        courseLevel5: "Int (Remote Sensing)",
        courseTitle5: "Principles of Remote Sensing & Spectral Analysis (Geneva)",
        courseSource5: "University of Geneva via Coursera",
        courseDesc5: "An accredited course and prestigious certificate from University of Geneva, explaining satellite imagery fundamentals, radiation interaction, and spectral image processing.",
        coursePlatformName5: "Platform: Coursera",
        
        courseLevel6: "Adv (Spatial Data Science)",
        courseTitle6: "Spatial Data Science and Applications (Yonsei University)",
        courseSource6: "Yonsei University via Coursera",
        courseDesc6: "A high-level specialization focusing on Big Data, Spatial DBMS, spatial analytics, web mapping, and advanced geostatistics using modern programmatic APIs.",
        coursePlatformName6: "Platform: Coursera",
        
        // Common Mistakes Section
        mistakesTitle: "Catastrophic Mistakes GIS Beginners Fall Into",
        mistakesSubtitle: "Avoid these four common mistakes that crash software and ruin geographic maps",
        
        mistakeLabel1: "Common Mistake:",
        solutionLabel1: "Correct & Professional Solution:",
        
        mistakeTitle1: "1. Coordinate Reference System Conflict (CRS Mismatch)",
        mistakeDesc1: "Projecting layers with different reference coordinate systems (e.g., one layer in WGS84 geographic system and another in UTM Mercator projection) in the same project without verifying coordinate mapping, causing the map to drift by thousands of meters or appear in the middle of the Indian Ocean!",
        solutionItem1_1: "Unify the coordinate reference system (CRS) for all spatial layers before starting your analysis.",
        solutionItem1_2: "Leverage the 'On-the-Fly Projection' functionality in QGIS and ArcGIS Pro.",
        solutionItem1_3: "Set a unified coordinate system for the entire project that suits your region (e.g., EPSG:3857 for web maps, or local UTM projections Zone 37N to 39N for local projects in KSA).",
        
        mistakeTitle2: "2. Sending a Single Shapefile and Losing Associated Extents (.shp only)",
        mistakeDesc2: "Sending only a `.shp` extension file via email or moving it to another folder thinking it is the entire spatial layer, leading immediately to complete layer corruption and failure to open on any other machine because it lost its attached tables, links, and projections.",
        solutionItem2_1: "Always remember that a Shapefile is a 'family set' of 3 to 8 associated files stored with the exact same name (such as `.shp`, `.dbf`, `.shx`, `.prj`).",
        solutionItem2_2: "If you wish to move the layer or send it to a colleague, compress the entire directory or all files sharing that exact base name into a single `.zip` file.",
        solutionItem2_3: "<strong>Modern Recommendation:</strong> Transition entirely to using the integrated **GeoPackage (`.gpkg`)** format recommended officially by the OGC, which aggregates multiple layers, databases, and attributes into a single smart file with blazing-fast performance!",
        
        mistakeTitle3: "3. Using Arabic Letters and Spaces in Save Paths (Arabic Paths)",
        mistakeDesc3: "Organizing your directories and saving files in paths that contain Arabic letters or spaces (e.g., `C:\\المستخدمين\\أحمد\\بيانات نظم المعلومات\\الرياض.shp`). This causes geoprocessing tools like clip and rendering to fail because older Python and GDAL libraries do not fully support non-Latin file paths.",
        solutionItem3_1: "Take extreme care to use only English letters and numbers when naming directories and GIS files.",
        solutionItem3_2: "Avoid empty spaces entirely; replace them with underscores (`_`) (e.g., `C:/gis_workspace/riyadh_boundary/riyadh_suburbs.shp`).",
        solutionItem3_3: "This simple golden habit will prevent over 90% of vague and sudden run failures in Python and GIS libraries.",
        
        mistakeTitle4: "4. Neglecting Metadata Writing and Documentation (Missing Metadata)",
        mistakeDesc4: "Producing spatial layers and maps and distributing them without attaching a documentation file or writing metadata for them, leaving subsequent users (or yourself in a few months) ignorant of the data source, survey date, spatial resolution, or error tolerance.",
        solutionItem4_1: "Allocate 5 minutes at the end of each project to fill out the metadata card inside GIS software.",
        solutionItem4_2: "Record clearly: the data producer, actual survey date, projection system, and survey accuracy in meters, in addition to terms of use and intellectual property.",
        solutionItem4_3: "Documenting data elevates its professional value and ensures it remains valid for use and integrable into national databases and decision-makers' projects.",
        
        // Vision 2030 Section
        visionBadge: "<i class=\"fa-solid fa-gem text-accent animate-pulse\"></i> Geospatial Innovation & National Vision",
        visionTitle: "Vision 2030 & <span class=\"highlight\">Geospatial Future</span>",
        visionSubtitle: "Discover how spatial technologies and GIS drive KSA's giga projects, track the latest news, and review national data protection standards.",
        tabVision: "<i class=\"fa-solid fa-mountain-sun\"></i> Saudi Vision 2030",
        tabNews: "<i class=\"fa-solid fa-newspaper\"></i> Geospatial News",
        
        projectTitle1: "NEOM & THE LINE Megacity districts",
        projectDesc1: "3D GIS and geospatial integration with Building Information Modeling (BIM) form the foundation for planning and executing the smart city of the future. GIS is leveraged to designate autonomous transport routes, model utility infrastructures, and generate comprehensive 3D Digital Twins to operate the city and track its maintenance in real time via live maps.",
        projectSkill1: "<i class=\"fa-solid fa-cube\"></i> 3D Digital Twins",
        
        projectTitle2: "The Red Sea Project & Sustainable Development",
        projectDesc2: "The Red Sea project relies on highly accurate marine and environmental GIS. Remote sensing and bathymetry are utilized to map coral reefs and ecologically sensitive habitats to ensure they remain untouched during construction, alongside monitoring water currents and temperatures via satellites to achieve 100% sustainable development.",
        projectSkill2: "<i class=\"fa-solid fa-satellite\"></i> Remote Sensing",
        
        projectTitle3: "King Salman Park & Urban Afforestation",
        projectDesc3: "Vegetation index (NDVI) analysis and Urban Heat Island mapping are applied to direct afforestation schemes and geographically allocate 7.5 million trees in the capital. Spatial suitability tools simulate water demands, shade, and soil conditions to guarantee maximum ecological efficiency, cooling Riyadh by 1.5°C to 2°C.",
        projectSkill3: "<i class=\"fa-solid fa-chart-line\"></i> Spatial Suitability & NDVI Analysis",
        
        projectTitle4: "Qiddiya & Diriyah Historic Sites",
        projectDesc4: "3D terrain modeling, slope analysis, and geotechnical engineering form the bedrock of designing mountainous projects and luxurious entertainment venues. Furthermore, complex hydrological spatial models simulate rainfall drainage and secure natural wadis to protect historical and futuristic sites.",
        projectSkill4: "<i class=\"fa-solid fa-droplet\"></i> Hydrology & Stormwater Simulation",
        
        // Geospatial news Tab
        newsSearchPlaceholder: "Search geospatial news, events, and tags...",
        newsContribHeader: "Quick Spatial Contribution",
        newsContribDesc: "Do you have geospatial news or a technical update to share with your peers? Draft it below and submit it immediately for review and publication:",
        newsContribTitlePlaceholder: "Geospatial news or event title...",
        newsContribDescPlaceholder: "Write a brief summary of the spatial news...",
        newsContribBtn: "Submit Draft for Review",
        alertNewsDraftSuccess: "News draft titled '{TITLE}' submitted successfully and is now posted live on the site!",
        
        newsTagOfficial: "Official News",
        newsTagTechnical: "Technical Update",
        newsTagEvent: "Geospatial Event",
        newsTagAcademic: "Students & Academics",
        
        newsTitle1: "GASGI Officially Launches Unified Geospatial Platform",
        newsBody1: "The General Authority for Statistics and Geospatial Information (GASGI) officially launched the Unified National Geospatial Platform to connect and integrate vital geographical data across service and governmental sectors, ensuring data reliability and spatial data flow.",
        
        newsTitle2: "Expanding the Scope of Geo-AI Applications",
        newsBody2: "The Ministry of Environment, Water and Agriculture announced scaling up Geo-AI and remote sensing technologies to monitor vegetation cover with extreme precision, automatically identifying sand encroachment and public land trespasses.",
        
        newsTitle3: "Launch of the Geospatial Technology Forum in Riyadh",
        newsBody3: "Riyadh witnessed the kickoff of the annual Geospatial Forum, with local and global experts participating to discuss the latest in LiDAR technology, 3D Digital Twins, and spatial positioning networks for surveying projects.",
        
        newsTitle4: "Adoption of National Geospatial Infrastructure Standards in Research",
        newsBody4: "Saudi universities urged students and researchers to align all academic research and projects with the official Saudi National Geodetic Datum (GRS80/WGS84) standard to guarantee academic output compliance.",
        
        newsTitle5: "Saudi Arabia to Host the 3rd United Nations World Geospatial Information Congress in Jeddah",
        newsBody5: "The United Nations officially announced Saudi Arabia, represented by GEOSA, as the host country for the 3rd United Nations World Geospatial Information Congress (3rd UNWGIC) in Jeddah in November 2026, solidifying the Kingdom's global digital leadership.",
        
        newsTitle6: "GEOSA Issues Aerial Survey and Panoramic Imaging Permits to Support Hajj Operations",
        newsBody6: "GEOSA has officially issued permits for high-precision aerial surveying and panoramic mapping to government sectors involved in Hajj 2026 operations to support secure crowd management and advanced logistics.",
        
        // Suggestions and feedback
        feedbackTitle: "💡 Do you have suggestions or ideas to develop the site?",
        feedbackDesc: "We are extremely pleased to hear your ideas and suggestions to develop this portal and add more useful tools and courses for GIS students!",
        feedbackBtn: "Contact me via X for suggestions & improvements",
        
        // Ehsan Donation Campaign Floating Ad
        ehsanTitle: "Ehsan National Platform",
        ehsanSubtext: "Facilitating and localizing charitable work in KSA",
        ehsanBody: "At the GIS Portal, as a non-profit student platform offering educational help, we believe in supporting our generous nation's initiatives. We invite you to contribute, donate, and support official humanitarian and developmental projects via the official **Ehsan National Platform** in Saudi Arabia with complete reliability, speed, and safety.",
        donateSecBadge: "Sustainable National Charity Work",
        donateTitle: "Social Responsibility & Charitable Empowerment",
        donateFeature1: "An official secure umbrella under the direct supervision of multiple governmental bodies.",
        donateFeature2: "Direct, real support reaching deserving beneficiaries with absolute transparency and speed.",
        btnDonateNow: "Donate Now via Ehsan",
        
        floatingAdBadge: "🇸🇦 National Donation Campaign",
        floatingAdTitle: "Ehsan Charity Platform",
        floatingAdBody: "Contribute to humanitarian and charitable projects in Saudi Arabia safely, securely, and officially.",
        floatingAdBtn: "Donate Now (Ehsan)",
        
        // Footer
        footerBrand: "A non-profit Arabic student platform aiming to facilitate and simplify the science, principles, and tools of GIS and remote sensing for a promising generation of geographers and developers.",
        footerCredits: "&copy; 2026 | Saudi GIS Platform - Developed & Supervised by Yazeed Alshammari",
        
        // Search Input Placeholders
        searchPlaceholder: "Search datasets by name, format, or source...",
        noResultsFound: "No spatial datasets found matching your criteria.",

        // X (Twitter) Community Section
        xCommunityTitle: "X Spatial Tech Community",
        xCommunitySubtitle: "Leading accounts and communities on X that enrich Arabic geospatial content and support students",
        xVisitProfile: "Visit Profile <i class=\"fa-solid fa-arrow-right\"></i>",
        xProfileBio1: "GIS specialist and researcher, publishing explanations, techniques, and spatial solutions for geomatics students and professionals.",
        xProfileBio2: "Specialized explanations and articles in GIS, spatial analysis, and attractive cartography, offering excellent interactive content to simplify geographic sciences.",
        xProfileBio3: "An Arabic volunteer community dedicated to sharing knowledge, opportunities, webinars, and workshops related to GIS and spatial technologies.",
        xProfileBio4: "Geomatics and GIS specialist, publishing career advice and guidelines for students to develop skills and successfully enter the job market.",
        xProfileBio5: "Distinguished educational account focusing on simplified explanations, e-books, and rich learning resources for GIS students to empower them academically and practically.",
        xProfileBio6: "Interested in sharing professional QGIS tips/tools and beautiful cartographic designs, providing excellent coding guidelines for geospatial developers.",
        xProfileBio7: "Renowned spatial data analyst and cartographer, sharing exceptional high-resolution maps and tutorials on using R and Python in spatial analysis.",
        xProfileBio8: "University Professor and developer of open-source geemap & leafmap packages, providing professional tutorials in remote sensing and Google Earth Engine.",
        
        // GeoMesh Hub
        navGeomesh: "GeoMesh Generator",
        geomeshBadge: "Cloud Spatial Simulation & Processing",
        geomeshTitle: "Saudi <span class=\"highlight\">GeoMesh</span> Geoprocessing Hub",
        geomeshSubtitle: "Generate harmonized environmental grid layers for Saudi regions. Connects to FastAPI backend locally or runs dynamic cloud simulations.",
        geomeshCardControl: "Geoprocessing Control Panel",
        geomeshCardControlDesc: "Select the spatial boundary, grid cell resolution, and variables to compile a multi-sensor harmonized mesh locally or virtually:",
        labelSelectRegion: "Target Spatial Region / Boundary:",
        placeholderSelectRegion: "Select geographic region...",
        labelResolution: "Spatial Grid Resolution (Cell Size):",
        labelVariables: "Target Variables & Multi-Sensor Layers:",
        labelOutputFormat: "Spatial Output Format:",
        btnGenerateMesh: "<i class=\"fa-solid fa-gears\"></i> Generate & Harmonize Spatial Mesh",
        btnGeneratingMesh: "<i class=\"fa-solid fa-spinner fa-spin\"></i> Running Geoprocessing Algorithms...",
        
        telemetrySensorTitle: "Sensor Telemetry Feed",
        telemetryOnline: "Live API Connected",
        telemetryOffline: "Active Simulation Mode",
        telemetryLiveTemp: "Live Surface Temp",
        telemetryHumidity: "Relative Humidity",
        telemetryAirQuality: "NO2 Air Quality",
        telemetryPrecipitation: "Recent Precipitation",
        
        consoleHeader: "Spatial Geoprocessing Console - bash@spatial_engine.sh",
        consolePlaceholder: "Awaiting geoprocessing request... Select parameters and click 'Generate' to initiate.",
        btnDownloadMesh: "<i class=\"fa-solid fa-cloud-arrow-down\"></i> Download Harmonized Spatial Dataset",
        
        // Region names
        regRiyadh: "Riyadh Region (Central KSA)",
        regWestern: "Western Region (Mecca & Jeddah)",
        regEastern: "Eastern Region (Dammam & Jubail)",
        regSouthern: "Southern Region (Asir & Abha)",
        regNorthern: "Northern Region (Tabuk & Border)",
        regHail: "Hail Region (Central-North)",
        
        // Variable names
        varNdvi: "Normalized Difference Vegetation Index (NDVI)",
        varLst: "Land Surface Temperature (LST)",
        varNo2: "Nitrogen Dioxide (NO2 Concentration)",
        varPop: "Gridded Population Density",
    }
};
