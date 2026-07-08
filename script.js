// AIOManager Subscription Manager — Script

// ==========================================
// MOCK SUBSCRIPTION DATA TEMPLATES & CANCEL GUIDE
// ==========================================
const MOCK_PROVIDER_DATA = {
    netflix: {
        name: 'Netflix',
        cost: 199,
        category: 'Entertainment',
        color: 'border-red-500/20 bg-red-950/5 text-red-400',
        iconBg: 'bg-red-500/10 text-red-400 border-red-500/20',
        lucideIcon: 'tv',
        payment: 'Visa **** 4321',
        manualSteps: [
            'Go to Netflix.com and sign in to your account.',
            'Under your profile icon in the top right, select "Account".',
            'In the Membership & Billing section, click the "Cancel Membership" button.',
            'Confirm the cancellation to finish. You can continue streaming until the end of your billing cycle.'
        ]
    },
    jio: {
        name: 'Jio Fibre / Mobile',
        cost: 1179,
        category: 'Telecom & Fiber',
        color: 'border-cosmicBlue-500/20 bg-cyan-950/5 text-cosmicBlue-400',
        iconBg: 'bg-cosmicBlue-500/10 text-cosmicBlue-400 border-cosmicBlue-500/20',
        lucideIcon: 'wifi',
        payment: 'UPI: pay@okaxis',
        manualSteps: [
            'Open the MyJio app on your smartphone.',
            'Go to the "Fiber" or "Mobile" tab depending on your plan.',
            'Select "Manage Subscriptions" or tap your active plan settings.',
            'Toggle off "Auto-Renew" or select "Cancel Auto-Debit" link.',
            'Verify the cancellation with the OTP sent to your registered mobile number.'
        ]
    },
    hotstar: {
        name: 'Disney+ Hotstar',
        cost: 299,
        category: 'Entertainment',
        color: 'border-brand-500/20 bg-pink-950/5 text-brand-400',
        iconBg: 'bg-brand-500/10 text-brand-400 border-brand-500/20',
        lucideIcon: 'film',
        payment: 'Visa **** 4321',
        manualSteps: [
            'Visit hotstar.com and log in with your mobile number/email.',
            'Navigate to "My Account" settings.',
            'Under your membership summary details, click on the "Cancel Subscription" button.',
            'Choose a reason for leaving and submit confirmation.'
        ]
    },
    spotify: {
        name: 'Spotify Premium',
        cost: 119,
        category: 'Music',
        color: 'border-emerald-500/20 bg-emerald-950/5 text-emerald-400',
        iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        lucideIcon: 'music',
        payment: 'Google Play Services',
        manualSteps: [
            'Go to spotify.com/account and log in.',
            'Scroll down to the "Your Plan" card.',
            'Click on "Change Plan".',
            'Scroll down to "Spotify Free" and click "Cancel Premium".',
            'Select "Yes, Cancel" to confirm.'
        ]
    },
    youtube: {
        name: 'YouTube Premium',
        cost: 139,
        category: 'Entertainment',
        color: 'border-brand-500/20 bg-pink-950/5 text-brand-450',
        iconBg: 'bg-brand-500/10 text-brand-450 border-brand-500/20',
        lucideIcon: 'youtube',
        payment: 'Apple Pay / iTunes',
        manualSteps: [
            'Open the YouTube App on your phone/tablet.',
            'Tap your profile picture and select "Purchases and memberships".',
            'Tap on your Premium membership details.',
            'Tap "Deactivate" or "Cancel" and select the reason.',
            'Confirm to cancel membership auto-renew settings.'
        ]
    },
    amazon: {
        name: 'Amazon Prime',
        cost: 299,
        category: 'Shopping',
        color: 'border-pink-500/25 bg-pink-950/5 text-pink-400',
        iconBg: 'bg-brand-500/10 text-brand-400 border-brand-500/20',
        lucideIcon: 'shopping-bag',
        payment: 'UPI: pay@okaxis',
        manualSteps: [
            'Go to Amazon.in and hover over "Account & Lists", then click "Your Prime Membership".',
            'Click on "Manage Membership" settings in the top right menu bar.',
            'Select "Update, Cancel and More" and click "End Membership".',
            'Follow the prompt instructions through 3 screens to confirm cancellation.'
        ]
    },
    sony: {
        name: 'SonyLIV',
        cost: 299,
        category: 'Entertainment',
        color: 'border-purple-500/20 bg-purple-950/5 text-purple-400',
        iconBg: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
        lucideIcon: 'play-circle',
        payment: 'Visa **** 4321',
        manualSteps: [
            'Log in to SonyLIV app or website.',
            'Go to "My Account" under your profile icon.',
            'Choose "Active Plans" to view active subscriptions.',
            'Click "Cancel Subscription" and confirm options.'
        ]
    },
    wifi: {
        name: 'Local Broadband / WiFi',
        cost: 599,
        category: 'Telecom & Fiber',
        color: 'border-cosmicBlue-500/20 bg-cyan-950/5 text-cosmicBlue-400',
        iconBg: 'bg-cosmicBlue-500/10 text-cosmicBlue-450 border-cosmicBlue-500/20',
        lucideIcon: 'globe',
        payment: 'UPI: pay@okaxis',
        manualSteps: [
            'Call your local Broadband customer service or open their mobile portal/app.',
            'Request a cancellation or disconnect services.',
            'Settle any outstanding dues for the current cycle.',
            'Arrange a technician pickup for routers/modems.'
        ]
    }
};

const CATEGORY_COLORS = {
    'Entertainment': 'text-brand-400 bg-brand-500/10 border-brand-500/20',
    'Telecom & Fiber': 'text-cosmicBlue-400 bg-cosmicBlue-500/10 border-cosmicBlue-500/20',
    'Music': 'text-emerald-450 bg-emerald-500/10 border-emerald-500/20',
    'Utilities': 'text-teal-400 bg-teal-500/10 border-teal-500/20',
    'Shopping': 'text-pink-400 bg-pink-500/10 border-pink-500/20',
    'Other': 'text-purple-400 bg-purple-500/10 border-purple-500/20'
};

// ==========================================
// DYNAMIC DATES CALCULATOR UTILITY
// ==========================================
function getFutureDate(daysAhead) {
    const today = new Date();
    today.setDate(today.getDate() + daysAhead);
    return today.toISOString().split('T')[0];
}

// ==========================================
// APPLICATION GLOBAL STATE
// ==========================================
let state = {
    isLoggedIn: false,
    currentUser: {
        name: 'Rishabh Raj',
        phone: '',
        email: '',
        avatar: 'nebula', // default premium avatar (nebula, pulsar, supernova, stardust)
        linkedCredentials: []
    },
    subscriptions: [],
    activeTab: 'home',
    preferences: {
        theme: 'cosmic', // cosmic, emerald, supernova, abyssal
        currency: 'INR',
        billingAlerts: true,
        smsAlerts: false,
        monthlyReports: true
    },
    billingCard: {
        number: '4321 0000 0000 9876',
        name: 'RISHABH RAJ',
        expiry: '12/29',
        cvv: '***',
        provider: 'visa'
    },
    diagnostics: {
        scansRun: 14,
        apiConnected: 5,
        lastScanTime: new Date().toLocaleString()
    }
};

// ==========================================
// SYSTEM LOGIC AND EVENT LIFECYCLE
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
    loadStateFromStorage();
    
    // Initialize Dark/Light Mode Theme
    const savedThemeMode = localStorage.getItem('subsentry_theme_mode') || 'dark';
    if (savedThemeMode === 'light') {
        document.documentElement.classList.add('light');
        document.body.classList.add('light');
        const icon = document.getElementById('theme-toggle-icon');
        if (icon) icon.setAttribute('data-lucide', 'sun');
    } else {
        document.documentElement.classList.remove('light');
        document.body.classList.remove('light');
        const icon = document.getElementById('theme-toggle-icon');
        if (icon) icon.setAttribute('data-lucide', 'moon');
    }

    initStarfield();
    setupEventListeners();
    lucide.createIcons();
    applyCardTiltEffect();

    // Check saved auth mode redirect from localStorage
    const savedAuthMode = localStorage.getItem('auth_mode_redirect') || 'login';
    localStorage.removeItem('auth_mode_redirect');

    // Check query params for simulated mock Gmail redirect
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('mock_login') === 'gmail') {
        const newUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
        if (savedAuthMode === 'signup') {
            showRegisterSetup('', 'mock.user@gmail.com');
        } else {
            const registeredUsers = JSON.parse(localStorage.getItem('subsentry_registered_users') || '[]');
            const isRegistered = registeredUsers.some(u => u.email === 'mock.user@gmail.com');
            if (isRegistered) {
                startScanning(null, 'mock.user@gmail.com');
            } else {
                alert("This Gmail account is not registered. Please switch to Sign Up mode to register first.");
                initAppView();
            }
        }
        return;
    }

    // Check live Supabase session if configured and not logged in yet
    if (isSupabaseConfigured && !state.isLoggedIn) {
        try {
            const { data: { session } } = await supabaseClient.auth.getSession();
            if (session && session.user) {
                if (savedAuthMode === 'signup') {
                    showRegisterSetup('', session.user.email);
                } else {
                    const registeredUsers = JSON.parse(localStorage.getItem('subsentry_registered_users') || '[]');
                    const isRegistered = registeredUsers.some(u => u.email === session.user.email);
                    if (isRegistered) {
                        startScanning(null, session.user.email);
                    } else {
                        alert("This Gmail account is not registered. Please switch to Sign Up mode to register first.");
                        await supabaseClient.auth.signOut();
                        initAppView();
                    }
                }
                return;
            }
        } catch (e) {
            console.error("Error reading Supabase session on startup:", e);
        }
    }

    initAppView();
});

// Load state from local storage
function loadStateFromStorage() {
    // Seed registered users list if empty
    if (!localStorage.getItem('subsentry_registered_users')) {
        const defaultUsers = [
            { name: 'Rishabh Raj', phone: '9876543210', email: 'rishabh.raj@gmail.com' }
        ];
        localStorage.setItem('subsentry_registered_users', JSON.stringify(defaultUsers));
    }

    const savedState = localStorage.getItem('subsentry_state');
    if (savedState) {
        try {
            const parsed = JSON.parse(savedState);
            state = {
                ...state,
                ...parsed,
                currentUser: { ...state.currentUser, ...(parsed.currentUser || {}) },
                preferences: { ...state.preferences, ...(parsed.preferences || {}) },
                billingCard: { ...state.billingCard, ...(parsed.billingCard || {}) },
                diagnostics: { ...state.diagnostics, ...(parsed.diagnostics || {}) }
            };
        } catch (e) {
            console.error("Failed to parse stored AIOManager state:", e);
        }
    }
}

// Save state to local storage
function saveStateToStorage() {
    localStorage.setItem('subsentry_state', JSON.stringify(state));
}

// Initialize layout views based on login state
function initAppView() {
    const scanView = document.getElementById('scan-view');
    const dashboardView = document.getElementById('dashboard-view');
    
    // Apply theme variables immediately
    applyTheme(state.preferences.theme || 'cosmic');
    
    if (state.isLoggedIn) {
        scanView.classList.add('hidden');
        dashboardView.classList.remove('hidden');
        
        // Update user avatar elements
        syncAvatarUI();
        
        switchTab(state.activeTab || 'home');
    } else {
        scanView.classList.remove('hidden');
        dashboardView.classList.add('hidden');
        
        // Reset panels in scan view
        const formPanel = document.getElementById('scan-form-panel');
        if (formPanel) formPanel.classList.remove('hidden');
        
        const progressView = document.getElementById('login-progress-view');
        if (progressView) progressView.classList.add('hidden');
    }
}

// ==========================================
// STARFIELD CANVAS BACKGROUND ANIMATION (PINK & CYAN GLITTER)
// ==========================================
function initStarfield() {
    const canvas = document.getElementById('starfield-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let stars = [];
    const numStars = 135;
    
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', resize);
    resize();
    
    // Spawn white, baby-pink, and light-blue/cyan stars
    for (let i = 0; i < numStars; i++) {
        const rand = Math.random();
        let starColorType = 'white';
        if (rand < 0.28) {
            starColorType = 'pink';
        } else if (rand < 0.58) {
            starColorType = 'cyan';
        }
        
        const isSparkle = Math.random() < 0.22;
        
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 1.5 + 0.4,
            alpha: Math.random(),
            twinkleSpeed: 0.005 + Math.random() * 0.015,
            speedX: (Math.random() - 0.5) * 0.06,
            speedY: (Math.random() - 0.5) * 0.06,
            type: isSparkle ? 'sparkle' : 'circle',
            colorType: starColorType,
            rot: Math.random() * Math.PI,
            rotSpeed: (Math.random() - 0.5) * 0.006
        });
    }

    // Helper to draw 4-pointed diamond star sparkles
    function drawDiamondSparkle(ctx, cx, cy, size, color, rotation) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rotation);
        ctx.fillStyle = color;
        
        ctx.beginPath();
        ctx.moveTo(0, -size * 3.5);
        ctx.quadraticCurveTo(0, 0, size * 3.5, 0);
        ctx.quadraticCurveTo(0, 0, 0, size * 3.5);
        ctx.quadraticCurveTo(0, 0, -size * 3.5, 0);
        ctx.quadraticCurveTo(0, 0, 0, -size * 3.5);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < numStars; i++) {
            const star = stars[i];
            
            star.alpha += star.twinkleSpeed;
            if (star.alpha > 1.0 || star.alpha < 0.1) {
                star.twinkleSpeed = -star.twinkleSpeed;
            }
            
            star.x += star.speedX;
            star.y += star.speedY;
            
            if (star.x < 0) star.x = canvas.width;
            if (star.x > canvas.width) star.x = 0;
            if (star.y < 0) star.y = canvas.height;
            if (star.y > canvas.height) star.y = 0;
            
            // Build rgba string based on star type
            let opacity = Math.max(0.1, Math.min(1.0, star.alpha));
            let colorString = document.documentElement.classList.contains('light')
                ? `rgba(99, 102, 241, ${opacity})` // Soft Indigo/Lavender in Light mode
                : `rgba(235, 235, 255, ${opacity})`; // white/silver in Dark mode
            
            if (star.colorType === 'pink') {
                colorString = `rgba(244, 114, 182, ${opacity})`; // Baby pink
            } else if (star.colorType === 'cyan') {
                colorString = `rgba(34, 211, 238, ${opacity})`; // Cyan / light blue
            }
            
            if (star.type === 'sparkle') {
                star.rot += star.rotSpeed;
                drawDiamondSparkle(ctx, star.x, star.y, star.size, colorString, star.rot);
            } else {
                ctx.fillStyle = colorString;
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// ==========================================
// TABS SWITCHING CONTROL (HOME & MANAGE)
// ==========================================
function switchTab(tabName) {
    if (tabName !== 'home' && tabName !== 'manage' && tabName !== 'account') {
        tabName = 'home';
    }
    state.activeTab = tabName;
    saveStateToStorage();

    // Toggle active classes on Navigation buttons (Desktop)
    document.querySelectorAll('nav [data-tab]').forEach(btn => {
        const isSelected = btn.getAttribute('data-tab') === tabName;
        if (isSelected) {
            btn.classList.add('active-pill');
            btn.classList.remove('text-textMuted');
        } else {
            btn.classList.remove('active-pill');
            btn.classList.add('text-textMuted');
        }
    });

    // Toggle active classes on Navigation buttons (Mobile)
    document.querySelectorAll('.tab-btn-mobile').forEach(btn => {
        const isSelected = btn.getAttribute('data-tab') === tabName;
        if (isSelected) {
            btn.classList.add('active-pill-mobile');
            btn.classList.remove('text-textMuted');
        } else {
            btn.classList.remove('active-pill-mobile');
            btn.classList.add('text-textMuted');
        }
    });

    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.add('hidden');
    });

    const targetPane = document.getElementById(`tab-content-${tabName}`);
    if (targetPane) {
        targetPane.classList.remove('hidden');
    }

    // Update avatar glowing outline state based on page
    syncAvatarActiveState();

    if (tabName === 'home') {
        renderHomeTab();
    } else if (tabName === 'manage') {
        renderManageTab();
    } else if (tabName === 'account') {
        renderAccountTab();
    }
    
    lucide.createIcons();
}

// ==========================================
// SIMULATED SCAN ENGINE
// ==========================================
function startScanning(phone, email) {
    state.currentUser.phone = phone || '';
    state.currentUser.email = email || '';
    state.currentUser.linkedCredentials = [];
    
    if (phone) {
        state.currentUser.linkedCredentials.push({
            type: 'Phone',
            value: `+91 ${phone}`,
            dateAdded: new Date().toLocaleDateString()
        });
    }
    if (email) {
        state.currentUser.linkedCredentials.push({
            type: 'Email',
            value: email,
            dateAdded: new Date().toLocaleDateString()
        });
    }

    const scanView = document.getElementById('scan-view');
    const progressView = document.getElementById('login-progress-view');
    
    if (scanView) scanView.classList.add('hidden');
    if (progressView) progressView.classList.remove('hidden');

    const statusEl = document.getElementById('login-progress-status');
    const barEl = document.getElementById('login-progress-bar');
    const pctEl = document.getElementById('login-progress-pct');

    if (barEl) barEl.style.width = '0%';
    if (pctEl) pctEl.innerText = '0%';

    const scanSteps = [
        { pct: 12, text: 'Opening secure connection to OTP servers...' },
        { pct: 25, text: 'Syncing Jio telecom integrations...' },
        { pct: 40, text: 'Searching active bills on linked email...' },
        { pct: 55, text: 'Mapping Netflix membership status...' },
        { pct: 70, text: 'Scanning transactional statements for Hotstar...' },
        { pct: 85, text: 'Searching billing agreements on Google Play...' },
        { pct: 95, text: 'Syncing upcoming bill dates and notifications...' },
        { pct: 100, text: 'Finalizing secure profile configuration...' }
    ];

    // Slideshow cycler
    let activeSlideIdx = 0;
    const descSlides = document.querySelectorAll('.discovery-slide');
    const graphicSlides = document.querySelectorAll('.discovery-slide-graphic');

    const slideshowInterval = setInterval(() => {
        if (!descSlides.length || !graphicSlides.length) return;
        
        // Fade out active
        descSlides[activeSlideIdx].classList.add('hidden');
        descSlides[activeSlideIdx].classList.add('opacity-0');
        graphicSlides[activeSlideIdx].classList.add('hidden');
        graphicSlides[activeSlideIdx].classList.add('opacity-0');

        activeSlideIdx = (activeSlideIdx + 1) % descSlides.length;

        // Fade in next
        descSlides[activeSlideIdx].classList.remove('hidden');
        graphicSlides[activeSlideIdx].classList.remove('hidden');
        setTimeout(() => {
            descSlides[activeSlideIdx].classList.remove('opacity-0');
            graphicSlides[activeSlideIdx].classList.remove('opacity-0');
        }, 50);
    }, 2200);

    let currentStep = 0;

    function runNextStep() {
        if (currentStep >= scanSteps.length) {
            clearInterval(slideshowInterval);
            setTimeout(() => {
                state.subscriptions = [
                    {
                        id: 'sub-' + Date.now() + '-1',
                        name: 'Netflix',
                        cost: 199,
                        cycle: 'monthly',
                        category: 'Entertainment',
                        nextRenewal: getFutureDate(3),
                        payment: 'Visa **** 4321',
                        providerKey: 'netflix',
                        alertEnabled: true
                    },
                    {
                        id: 'sub-' + Date.now() + '-2',
                        name: 'Jio Fibre / Mobile',
                        cost: 1179,
                        cycle: 'monthly',
                        category: 'Telecom & Fiber',
                        nextRenewal: getFutureDate(12),
                        payment: 'UPI: pay@okaxis',
                        providerKey: 'jio',
                        alertEnabled: true
                    },
                    {
                        id: 'sub-' + Date.now() + '-3',
                        name: 'Disney+ Hotstar',
                        cost: 299,
                        cycle: 'monthly',
                        category: 'Entertainment',
                        nextRenewal: getFutureDate(5),
                        payment: 'Visa **** 4321',
                        providerKey: 'hotstar',
                        alertEnabled: true
                    },
                    {
                        id: 'sub-' + Date.now() + '-4',
                        name: 'Spotify Premium',
                        cost: 119,
                        cycle: 'monthly',
                        category: 'Music',
                        nextRenewal: getFutureDate(22),
                        payment: 'Google Play Services',
                        providerKey: 'spotify',
                        alertEnabled: false
                    }
                ];
                
                state.isLoggedIn = true;
                state.activeTab = 'home';
                saveStateToStorage();
                
                if (progressView) progressView.classList.add('hidden');
                initAppView();
            }, 800);
            return;
        }

        const step = scanSteps[currentStep];
        if (statusEl) statusEl.innerText = step.text;
        if (barEl) barEl.style.width = `${step.pct}%`;
        if (pctEl) pctEl.innerText = `${step.pct}%`;

        currentStep++;
        
        const delay = 800 + Math.random() * 800;
        setTimeout(runNextStep, delay);
    }

    setTimeout(runNextStep, 500);
}

// ==========================================
// RENDERERS: TAB 1 - HOME VIEW (PINK-BLUE THEME)
// ==========================================
function renderHomeTab() {
    const container = document.getElementById('tab-content-home');
    if (!container) return;

    // Calculate Statistics
    let monthlySpend = 0;
    let yearlySpend = 0;
    let activeCount = state.subscriptions.length;

    state.subscriptions.forEach(sub => {
        const cost = parseFloat(sub.cost) || 0;
        if (sub.cycle === 'monthly') {
            monthlySpend += cost;
            yearlySpend += (cost * 12);
        } else {
            monthlySpend += (cost / 12);
            yearlySpend += cost;
        }
    });

    monthlySpend = Math.round(monthlySpend);
    yearlySpend = Math.round(yearlySpend);

    const upcomingBills = [];
    const today = new Date();
    
    state.subscriptions.forEach(sub => {
        const renewalDate = new Date(sub.nextRenewal);
        const diffTime = renewalDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        upcomingBills.push({
            ...sub,
            daysRemaining: diffDays
        });
    });

    upcomingBills.sort((a, b) => a.daysRemaining - b.daysRemaining);
    const criticalBills = upcomingBills.filter(bill => bill.daysRemaining >= 0 && bill.daysRemaining <= 5);
    const nextBill = upcomingBills[0] || null;

    // Calculate Optimization / Health Index Score
    let healthScore = 100;
    let optimizationTips = "All active subscription structures optimized.";
    
    if (criticalBills.length > 0) {
        healthScore -= 10;
        optimizationTips = "Fund next critical billing renewal.";
    }
    const noAlertSubs = state.subscriptions.filter(s => !s.alertEnabled).length;
    if (noAlertSubs > 0) {
        healthScore -= (noAlertSubs * 5);
        optimizationTips = "Activate billing warnings to prevent unexpected renewals.";
    }
    const spotifySub = state.subscriptions.find(s => s.providerKey === 'spotify');
    if (spotifySub && !spotifySub.alertEnabled) {
        healthScore -= 5;
        optimizationTips = "Under-utilization alert active: Spotify Premium.";
    }
    healthScore = Math.max(40, healthScore);

    // Category Spending Breakdown
    const categoriesData = {};
    let totalCategorized = 0;
    
    state.subscriptions.forEach(sub => {
        const monthlyEq = sub.cycle === 'monthly' ? sub.cost : sub.cost / 12;
        categoriesData[sub.category] = (categoriesData[sub.category] || 0) + monthlyEq;
        totalCategorized += monthlyEq;
    });

    let html = `
        <!-- Top Summary Cards Grid (Premium Rich Vitals) -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <!-- 1. Sync Directory Vitals Card -->
            <div class="galactic-card rounded-[28px] p-6 relative overflow-hidden group">
                <div class="absolute top-0 right-0 p-8 opacity-[0.03] -mr-4 -mt-4 text-emerald-500 pointer-events-none group-hover:scale-110 transition-transform duration-300">
                    <i data-lucide="wifi" class="w-24 h-24"></i>
                </div>
                <div class="flex justify-between items-center mb-4">
                    <span class="text-[10px] font-bold text-textMuted uppercase tracking-widest font-space">Sync Directory Vitals</span>
                    <span class="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] font-bold tracking-widest font-space flex items-center space-x-1.5 shadow-[0_0_10px_rgba(16,185,129,0.15)]">
                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span>SECURE SYNC</span>
                    </span>
                </div>
                <div class="space-y-3 mt-2.5">
                    <div class="flex justify-between items-center border-b border-glassBorder pb-2">
                        <span class="text-[11px] text-textMuted font-sans">Active Channels:</span>
                        <span class="text-[11px] font-bold text-cardTitle font-space">${state.currentUser.linkedCredentials.length} Scanners</span>
                    </div>
                    <div class="flex justify-between items-center border-b border-glassBorder pb-2">
                        <span class="text-[11px] text-textMuted font-sans">Sync Frequency:</span>
                        <span class="text-[11px] font-bold text-cardTitle font-space">Automated (12h)</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-[11px] text-textMuted font-sans">Last Scan:</span>
                        <span class="text-[11px] font-bold text-emerald-400 font-space">${state.diagnostics.lastScanTime ? state.diagnostics.lastScanTime.split(',')[1] || state.diagnostics.lastScanTime : 'Just now'}</span>
                    </div>
                </div>
            </div>

            <!-- 2. Subscription Vitals Index Card -->
            <div class="galactic-card rounded-[28px] p-6 relative overflow-hidden group">
                <div class="absolute top-0 right-0 p-8 opacity-[0.03] -mr-4 -mt-4 text-brand-500 pointer-events-none group-hover:scale-110 transition-transform duration-300">
                    <i data-lucide="cpu" class="w-24 h-24"></i>
                </div>
                <div class="flex justify-between items-center mb-4">
                    <span class="text-[10px] font-bold text-textMuted uppercase tracking-widest font-space">Subscription Health Index</span>
                    <span class="p-2 bg-brand-500/10 border border-brand-500/20 text-brand-400 rounded-full shadow-[0_0_10px_rgba(236,72,153,0.15)]">
                        <i data-lucide="cpu" class="w-4 h-4"></i>
                    </span>
                </div>
                <div class="flex items-center space-x-4 mt-2">
                    <div class="relative w-14 h-14 flex items-center justify-center flex-shrink-0">
                        <svg class="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                            <path class="text-cardTitle" stroke-width="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                            <path class="text-brand-500" stroke-dasharray="${healthScore}, 100" stroke-width="3.2" stroke-linecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        </svg>
                        <span class="absolute text-xs font-extrabold text-cardTitle font-space">${healthScore}</span>
                    </div>
                    <div class="text-left space-y-0.5">
                        <div class="text-[9px] font-bold text-textMuted tracking-wide font-space uppercase">Vitals score</div>
                        <p class="text-[10px] text-textMuted leading-normal font-sans font-medium">${optimizationTips}</p>
                    </div>
                </div>
            </div>

            <!-- 3. Next Billings Sentinel Card -->
            <div class="galactic-card rounded-[28px] p-6 relative overflow-hidden group">
                <div class="absolute top-0 right-0 p-8 opacity-[0.03] -mr-4 -mt-4 text-cosmicBlue-400 pointer-events-none group-hover:scale-110 transition-transform duration-300">
                    <i data-lucide="clock" class="w-24 h-24"></i>
                </div>
                <div class="flex justify-between items-center mb-4">
                    <span class="text-[10px] font-bold text-textMuted uppercase tracking-widest font-space">impending charge sentinel</span>
                    <span class="p-2 bg-cosmicBlue-500/10 border border-cosmicBlue-500/20 text-cosmicBlue-400 rounded-full">
                        <i data-lucide="clock" class="w-4 h-4"></i>
                    </span>
                </div>
                ${nextBill ? `
                <div class="space-y-3 mt-2.5">
                    <div class="flex justify-between items-center border-b border-glassBorder pb-2">
                        <span class="text-[11px] text-textMuted font-sans">Impending:</span>
                        <span class="text-[11px] font-bold text-cardTitle font-space">${nextBill.name} (${nextBill.cycle === 'monthly' ? 'Monthly' : 'Annual'})</span>
                    </div>
                    <div class="flex justify-between items-center border-b border-glassBorder pb-2">
                        <span class="text-[11px] text-textMuted font-sans">Payment Amount:</span>
                        <span class="text-[11px] font-bold text-brand-400 font-space">₹${nextBill.cost}</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-[11px] text-textMuted font-sans">Due In:</span>
                        <span class="text-[11px] font-bold ${nextBill.daysRemaining <= 5 ? 'text-red-400 animate-pulse' : 'text-cosmicBlue-400'} font-space">${nextBill.daysRemaining === 0 ? 'Today' : nextBill.daysRemaining === 1 ? 'Tomorrow' : `${nextBill.daysRemaining} days`}</span>
                    </div>
                </div>
                ` : `
                <div class="py-4 text-center">
                    <p class="text-xs text-textMuted font-sans">No impending billing intervals active.</p>
                </div>
                `}
            </div>
        </div>
    `;

    // Alert Banner if critical bills exist
    if (criticalBills.length > 0) {
        html += `
        <!-- Critical Renewal Warning Notification Banner -->
        <div class="bg-brand-500/5 border border-brand-500/25 rounded-[24px] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 alert-ring-pulse">
            <div class="flex items-start space-x-4">
                <div class="p-2.5 bg-brand-500/10 text-brand-400 border border-brand-500/20 rounded-xl flex-shrink-0">
                    <i data-lucide="bell-ring" class="w-5.5 h-5.5 animate-bounce"></i>
                </div>
                <div>
                    <h4 class="font-bold text-cardTitle font-space text-base">Critical Subscription Renewals Pending</h4>
                    <p class="text-xs text-textMuted mt-1 font-sans">
                        You have ${criticalBills.length} billing renewals coming up in the next 5 days. Ensure funding is available to prevent interruptions.
                    </p>
                </div>
            </div>
            <button onclick="switchTab('manage')" class="bg-brand-600/20 border border-brand-500/35 hover:bg-brand-500 hover:text-cardTitle text-brand-400 font-semibold text-xs px-5 py-3 rounded-xl transition-all self-start sm:self-center font-space">
                Review Renewals
            </button>
        </div>
        `;
    }

    // Chart and Upcoming Bills Layout Row
    html += `
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <!-- Left Side: Interactive SVG Spend Category Chart -->
            <div class="lg:col-span-5 galactic-card rounded-[28px] p-6 flex flex-col justify-between">
                <div>
                    <h3 class="text-base font-bold text-cardTitle font-space mb-1">Spend Category Share</h3>
                    <p class="text-xs text-textMuted mb-6 font-sans font-medium">Monthly: <span class="text-brand-400 font-bold font-space">₹${monthlySpend.toLocaleString('en-IN')}</span> • Annual: <span class="text-cosmicBlue-400 font-bold font-space">₹${yearlySpend.toLocaleString('en-IN')}</span></p>
                </div>

                <!-- SVG Donut Chart -->
                <div class="flex flex-col items-center justify-center py-4">
                    ${totalCategorized > 0 ? generateSVGDonutChart(categoriesData, totalCategorized) : `
                        <div class="text-center py-12">
                            <i data-lucide="pie-chart" class="w-12 h-12 text-textMuted mx-auto mb-2"></i>
                            <p class="text-xs text-textMuted font-sans">No data to display. Add subscriptions.</p>
                        </div>
                    `}
                </div>
                
                <!-- Category Legend List -->
                <div class="space-y-2 mt-4 border-t border-glassBorder pt-4">
                    ${Object.keys(categoriesData).map(cat => {
                        const amt = Math.round(categoriesData[cat]);
                        const pct = Math.round((amt / totalCategorized) * 100);
                        const labelBg = CATEGORY_COLORS[cat] || CATEGORY_COLORS['Other'];
                        return `
                            <div class="flex justify-between items-center text-xs">
                                <div class="flex items-center space-x-2">
                                    <span class="w-2 h-2 rounded-full inline-block ${labelBg.split(' ')[0]} bg-current"></span>
                                    <span class="text-textMuted font-medium font-sans">${cat}</span>
                                </div>
                                <div class="text-right">
                                    <span class="text-cardTitle font-semibold font-space">₹${amt}</span>
                                    <span class="text-textMuted ml-1 font-sans">(${pct}%)</span>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>

            <!-- Right Side: Chronological Billing Calendar Timeline -->
            <div class="lg:col-span-7 galactic-card rounded-[28px] p-6 flex flex-col justify-between">
                <div>
                    <div class="flex justify-between items-center mb-1">
                        <h3 class="text-base font-bold text-cardTitle font-space">Upcoming Billing Renewal Schedule</h3>
                        <button onclick="switchTab('manage')" class="text-xs text-brand-400 hover:text-brand-300 font-semibold font-space">See All</button>
                    </div>
                    <p class="text-xs text-textMuted mb-6 font-sans">Upcoming payments sorted chronologically.</p>
                </div>

                <div class="space-y-4 max-h-[360px] overflow-y-auto scrollbar-thin pr-1 flex-grow">
                    ${upcomingBills.length > 0 ? upcomingBills.map(bill => {
                        const template = MOCK_PROVIDER_DATA[bill.providerKey] || {
                            iconBg: 'bg-cardSubBg text-textMuted border-glassBorder',
                            lucideIcon: 'credit-card'
                        };
                        
                        let remainingBadge = '';
                        if (bill.daysRemaining === 0) {
                            remainingBadge = `<span class="px-2 py-0.5 rounded-md text-[9px] font-bold bg-red-500/20 border border-red-500/30 text-red-400 font-space tracking-wide">RENEWING TODAY</span>`;
                        } else if (bill.daysRemaining === 1) {
                            remainingBadge = `<span class="px-2 py-0.5 rounded-md text-[9px] font-bold bg-amber-500/20 border border-amber-500/30 text-amber-400 font-space tracking-wide">TOMORROW</span>`;
                        } else if (bill.daysRemaining < 0) {
                            remainingBadge = `<span class="px-2 py-0.5 rounded-md text-[9px] font-bold bg-cardSubBg border border-glassBorder text-textMuted font-space tracking-wide">PAST DUE</span>`;
                        } else {
                            remainingBadge = `<span class="px-2 py-0.5 rounded-md text-[9px] font-semibold bg-cardSubBg border border-glassBorder text-textMuted font-sans">${bill.daysRemaining} days left</span>`;
                        }

                        return `
                            <div class="flex items-center justify-between p-3.5 bg-glassBg border border-glassBorder hover:border-brand-500/20 rounded-2xl transition-all">
                                <div class="flex items-center space-x-3.5">
                                    <div class="p-2.5 rounded-xl border ${template.iconBg} flex-shrink-0">
                                        <i data-lucide="${template.lucideIcon}" class="w-5 h-5"></i>
                                    </div>
                                    <div>
                                        <h4 class="text-sm font-semibold text-cardTitle font-space">${bill.name}</h4>
                                        <div class="text-[10px] text-textMuted mt-0.5 flex items-center space-x-2 font-sans">
                                            <span>${bill.payment}</span>
                                            <span>•</span>
                                            <span>Next: ${new Date(bill.nextRenewal).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <div class="text-sm font-bold text-cardTitle font-space">₹${bill.cost} <span class="text-[10px] text-textMuted font-normal">/${bill.cycle === 'monthly' ? 'mo' : 'yr'}</span></div>
                                    <div class="mt-1.5">${remainingBadge}</div>
                                </div>
                            </div>
                        `;
                    }).join('') : `
                        <div class="text-center py-16">
                            <i data-lucide="check-circle" class="w-12 h-12 text-textMuted mx-auto mb-2"></i>
                            <p class="text-xs text-textMuted font-sans">All set! No upcoming subscription bills active.</p>
                        </div>
                    `}
                </div>
            </div>
        </div>
    `;

    container.innerHTML = html;
}

// Generate Pie/Donut SVG dynamically based on categories percentage
function generateSVGDonutChart(categoriesData, total) {
    const sortedCats = Object.keys(categoriesData);
    let cumulativePercent = 0;
    
    // Pink and Cyan category mappings
    const colors = {
        'Entertainment': '#f472b6', /* Pink */
        'Telecom & Fiber': '#22d3ee', /* Cyan */
        'Music': '#a78bfa', /* Purple */
        'Utilities': '#34d399', /* Mint */
        'Shopping': '#fb7185', /* Rose */
        'Other': '#cbd5e1' /* Silver/Slate */
    };

    let svgPaths = [];
    
    sortedCats.forEach(cat => {
        const value = categoriesData[cat];
        const pct = value / total;
        
        if (pct === 0) return;
        
        if (pct >= 0.999) {
            svgPaths.push(`<circle cx="100" cy="100" r="70" fill="transparent" stroke="${colors[cat] || '#cbd5e1'}" stroke-width="20"></circle>`);
            return;
        }

        const startAngle = cumulativePercent * 360;
        cumulativePercent += pct;
        const endAngle = cumulativePercent * 360;
        
        const startRad = (startAngle - 90) * Math.PI / 180;
        const endRad = (endAngle - 90) * Math.PI / 180;
        
        const r = 70;
        const cx = 100;
        const cy = 100;
        const x1 = cx + r * Math.cos(startRad);
        const y1 = cy + r * Math.sin(startRad);
        const x2 = cx + r * Math.cos(endRad);
        const y2 = cy + r * Math.sin(endRad);
        
        const largeArcFlag = pct > 0.5 ? 1 : 0;
        
        const d = `M ${x1} ${y1} A ${r} ${r} 0 ${largeArcFlag} 1 ${x2} ${y2}`;
        svgPaths.push(`<path d="${d}" fill="transparent" stroke="${colors[cat] || '#cbd5e1'}" stroke-width="20" stroke-linecap="round"></path>`);
    });

    return `
        <div class="relative w-48 h-48">
            <svg class="w-full h-full transform -rotate-3" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="70" fill="transparent" stroke="rgba(255,255,255,0.03)" stroke-width="20"></circle>
                ${svgPaths.join('')}
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span class="text-textMuted text-[9px] font-bold uppercase tracking-widest font-space">Monthly Spend</span>
                <span class="text-xl font-extrabold text-cardTitle font-space mt-1">₹${Math.round(total).toLocaleString('en-IN')}</span>
            </div>
        </div>
    `;
}

// ==========================================
// RENDERERS: TAB 2 - MANAGE DETAILS VIEW
// ==========================================
let manageSearchQuery = '';
let manageCategoryFilter = 'All';

function renderManageTab() {
    const container = document.getElementById('tab-content-manage');
    if (!container) return;

    let filteredSubs = state.subscriptions.filter(sub => {
        const matchesSearch = sub.name.toLowerCase().includes(manageSearchQuery.toLowerCase());
        const matchesCategory = manageCategoryFilter === 'All' || sub.category === manageCategoryFilter;
        return matchesSearch && matchesCategory;
    });

    const categoriesList = ['All', 'Entertainment', 'Telecom & Fiber', 'Music', 'Utilities', 'Shopping', 'Other'];

    let html = `
        <!-- Filter Header Section -->
        <div class="flex flex-col md:flex-row items-center justify-between gap-4 bg-glassBg border border-glassBorder backdrop-blur-xl p-5 rounded-[24px] shadow-lg">
            <!-- Search bar -->
            <div class="relative w-full md:max-w-xs">
                <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-textMuted">
                    <i data-lucide="search" class="w-4 h-4"></i>
                </span>
                <input type="text" id="manage-search" placeholder="Search subscriptions..." value="${manageSearchQuery}"
                    class="w-full bg-inputBg border border-glassBorder focus:border-brand-500 rounded-xl py-2.5 pl-10 pr-4 text-xs text-cardTitle focus:outline-none focus:ring-1 focus:ring-brand-500/20 placeholder-slate-600">
            </div>

            <!-- Category Pills Filter -->
            <div class="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto scrollbar-none py-1">
                ${categoriesList.map(cat => {
                    const isSelected = cat === manageCategoryFilter;
                    return `
                        <button onclick="setManageCategory('${cat}')" class="px-4 py-2 rounded-full text-[10px] font-bold whitespace-nowrap transition-all border font-space ${
                            isSelected 
                            ? 'bg-brand-500 border-brand-500 text-cardTitle shadow-md shadow-brand-500/10' 
                            : 'bg-cardSubBg border-glassBorder text-textMuted hover:text-cardTitle hover:bg-inputBg'
                        }">
                            ${cat}
                        </button>
                    `;
                }).join('')}
            </div>

            <!-- Add Sub Trigger -->
            <button onclick="openAddSubModal()" class="w-full md:w-auto bg-gradient-to-r from-brand-500 to-cosmicBlue-500 text-cardTitle font-bold text-xs px-5 py-2.5 rounded-full transition-all shadow-[0_4px_15px_rgba(236,72,153,0.2)] flex items-center justify-center space-x-2 font-space">
                <i data-lucide="plus-circle" class="w-4 h-4"></i>
                <span>Add Subscription</span>
            </button>
        </div>

        <!-- Subscriptions Grid List -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${filteredSubs.length > 0 ? filteredSubs.map(sub => {
                const template = MOCK_PROVIDER_DATA[sub.providerKey] || {
                    lucideIcon: 'credit-card',
                    color: 'border-glassBorder bg-glassBg text-cardTitle',
                    iconBg: 'bg-inputBg text-textMuted border-glassBorder',
                    manualSteps: ['Open the dashboard/portal of provider.', 'Navigate to Account billing settings.', 'Submit cancellation membership request.']
                };

                const catBadge = CATEGORY_COLORS[sub.category] || CATEGORY_COLORS['Other'];

                return `
                    <div class="galactic-card glitter-card-bg ${template.color.split(' ')[0]} rounded-[28px] p-5 flex flex-col justify-between relative group">
                        
                        <!-- Card Header -->
                        <div class="flex justify-between items-start mb-6">
                            <div class="flex items-center space-x-3.5">
                                <div class="p-3 rounded-2xl border ${template.iconBg}">
                                    <i data-lucide="${template.lucideIcon}" class="w-6 h-6"></i>
                                </div>
                                <div>
                                    <h4 class="font-bold text-cardTitle text-base leading-tight font-space">${sub.name}</h4>
                                    <span class="inline-block px-2 py-0.5 rounded-md text-[8px] font-bold uppercase tracking-wider border ${catBadge} mt-1.5 font-space">
                                        ${sub.category}
                                    </span>
                                </div>
                            </div>
                            
                            <!-- Toggle alert bell -->
                            <button onclick="toggleSubscriptionAlert('${sub.id}')" class="p-2 rounded-full border ${sub.alertEnabled ? 'bg-brand-500/10 border-brand-500/25 text-brand-400' : 'bg-cardSubBg border-glassBorder text-textMuted hover:text-cardTitle'} transition-all" title="Toggle warnings">
                                <i data-lucide="${sub.alertEnabled ? 'bell' : 'bell-off'}" class="w-3.5 h-3.5"></i>
                            </button>
                        </div>

                        <!-- Card Detail Table -->
                        <div class="space-y-2.5 text-xxs border-b border-glassBorder pb-5 mb-5 font-sans">
                            <div class="flex justify-between">
                                <span class="text-textMuted">Monthly Cost</span>
                                <span class="text-cardTitle font-semibold">₹${sub.cycle === 'monthly' ? sub.cost : Math.round(sub.cost / 12)}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-textMuted">Billing Cycle</span>
                                <span class="text-cardTitle capitalize">${sub.cycle}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-textMuted">Next Renewal</span>
                                <span class="text-cardTitle">${new Date(sub.nextRenewal).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-textMuted">Payment Channel</span>
                                <span class="text-cardTitle truncate max-w-[140px]">${sub.payment}</span>
                            </div>
                        </div>

                        <!-- Card Footer actions -->
                        <div class="flex items-center justify-between gap-3">
                            <div class="text-lg font-black text-cardTitle font-space">₹${sub.cost}<span class="text-[10px] text-textMuted font-normal">/${sub.cycle === 'monthly' ? 'mo' : 'yr'}</span></div>
                            <button onclick="openCancellationWizard('${sub.id}')" class="bg-red-500/10 border border-red-500/25 text-red-400 hover:bg-red-550 hover:text-cardTitle font-semibold text-xxs px-4 py-2.5 rounded-xl transition-all flex items-center space-x-1.5 font-space">
                                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                                <span>Cancel Plan</span>
                            </button>
                        </div>
                    </div>
                `;
            }).join('') : `
                <div class="col-span-full bg-glassBg border border-dashed border-glassBorder rounded-3xl p-12 text-center">
                    <div class="p-4 bg-cardSubBg border border-glassBorder text-textMuted rounded-full w-14 h-14 mx-auto mb-4 flex items-center justify-center">
                        <i data-lucide="credit-card" class="w-6 h-6"></i>
                    </div>
                    <h4 class="text-cardTitle font-bold text-base font-space">No Active Subscriptions</h4>
                    <p class="text-textMuted text-xs mt-1 mb-6 font-sans">No integrations match your search parameters.</p>
                    <button onclick="openAddSubModal()" class="bg-brand-650 hover:bg-brand-500 text-slate-950 font-bold text-xs px-5 py-3 rounded-full transition-all shadow-[0_4px_15px_rgba(245,158,11,0.2)] font-space">
                        Add New Subscription
                    </button>
                </div>
            `}
        </div>
    `;

    container.innerHTML = html;

    const searchInput = document.getElementById('manage-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            manageSearchQuery = e.target.value;
            renderManageTab();
            document.getElementById('manage-search').focus();
        });
    }
}

function setManageCategory(cat) {
    manageCategoryFilter = cat;
    renderManageTab();
    lucide.createIcons();
}

function toggleSubscriptionAlert(id) {
    const subIndex = state.subscriptions.findIndex(s => s.id === id);
    if (subIndex > -1) {
        state.subscriptions[subIndex].alertEnabled = !state.subscriptions[subIndex].alertEnabled;
        saveStateToStorage();
        renderManageTab();
        lucide.createIcons();
    }
}

// ==========================================
// THEMES & AVATAR VIBES preset configurations
// ==========================================
const THEMES = {
    cosmic: {
        '--brand-500-rgb': '236 72 153',
        '--brand-600-rgb': '219 39 119',
        '--brand-700-rgb': '190 24 93',
        '--brand-900-rgb': '131 24 67',
        '--cosmic-400-rgb': '34 211 238',
        '--cosmic-500-rgb': '6 182 212',
        '--cosmic-600-rgb': '8 145 178',
        '--cosmic-900-rgb': '8 51 68',
        '--brand-rgb': '236, 72, 153',
        '--cosmic-rgb': '34, 211, 238',
        brandHex: '#ec4899',
        cosmicHex: '#22d3ee'
    },
    emerald: {
        '--brand-500-rgb': '16 185 129',
        '--brand-600-rgb': '5 150 105',
        '--brand-700-rgb': '4 120 87',
        '--brand-900-rgb': '6 78 59',
        '--cosmic-400-rgb': '45 212 191',
        '--cosmic-500-rgb': '20 184 166',
        '--cosmic-600-rgb': '13 148 136',
        '--cosmic-900-rgb': '17 94 89',
        '--brand-rgb': '16, 185, 129',
        '--cosmic-rgb': '45, 212, 191',
        brandHex: '#10b981',
        cosmicHex: '#2dd4bf'
    },
    supernova: {
        '--brand-500-rgb': '245 158 11',
        '--brand-600-rgb': '217 119 6',
        '--brand-700-rgb': '180 83 9',
        '--brand-900-rgb': '120 53 15',
        '--cosmic-400-rgb': '192 132 252',
        '--cosmic-500-rgb': '168 85 247',
        '--cosmic-600-rgb': '147 51 234',
        '--cosmic-900-rgb': '88 28 135',
        '--brand-rgb': '245, 158, 11',
        '--cosmic-rgb': '192, 132, 252',
        brandHex: '#f59e0b',
        cosmicHex: '#c084fc'
    },
    abyssal: {
        '--brand-500-rgb': '139 92 246',
        '--brand-600-rgb': '124 58 237',
        '--brand-700-rgb': '109 40 217',
        '--brand-900-rgb': '76 29 149',
        '--cosmic-400-rgb': '236 72 153',
        '--cosmic-500-rgb': '217 70 239',
        '--cosmic-600-rgb': '192 38 211',
        '--cosmic-900-rgb': '112 26 117',
        '--brand-rgb': '139, 92, 246',
        '--cosmic-rgb': '217, 70, 239',
        brandHex: '#8b5cf6',
        cosmicHex: '#ec4899'
    }
};

const AVATAR_VIBES = {
    nebula: {
        name: 'Nebula',
        gradient: 'from-pink-500 to-cyan-400 hover:from-pink-400 hover:to-cyan-300 border-pink-400/30',
        glow: 'rgba(236, 72, 153, 0.25)',
        shadow: 'shadow-[0_0_20px_rgba(236,72,153,0.3)]',
        colorClass: 'text-pink-450 border-pink-500/20 bg-pink-950/20',
        icon: 'aperture'
    },
    pulsar: {
        name: 'Pulsar',
        gradient: 'from-fuchsia-500 to-violet-600 hover:from-fuchsia-400 hover:to-violet-500 border-fuchsia-400/30',
        glow: 'rgba(139, 92, 246, 0.25)',
        shadow: 'shadow-[0_0_20px_rgba(139,92,246,0.3)]',
        colorClass: 'text-fuchsia-450 border-fuchsia-500/20 bg-fuchsia-950/20',
        icon: 'zap'
    },
    supernova: {
        name: 'Supernova',
        gradient: 'from-amber-400 to-orange-600 hover:from-amber-300 hover:to-orange-500 border-amber-400/30',
        glow: 'rgba(245, 158, 11, 0.25)',
        shadow: 'shadow-[0_0_20px_rgba(245,158,11,0.3)]',
        colorClass: 'text-amber-400 border-amber-500/20 bg-amber-950/20',
        icon: 'sun'
    },
    stardust: {
        name: 'Stardust',
        gradient: 'from-emerald-400 to-teal-600 hover:from-emerald-300 hover:to-teal-500 border-emerald-400/30',
        glow: 'rgba(16, 185, 129, 0.25)',
        shadow: 'shadow-[0_0_20px_rgba(16,185,129,0.3)]',
        colorClass: 'text-emerald-400 border-emerald-500/20 bg-emerald-950/20',
        icon: 'sparkles'
    }
};

const DIAGNOSTIC_LOG_TEMPLATES = [
    "SYS: Sync cycle initialized.",
    "SCAN: Checked Jio Broadband statements.",
    "SCAN: Checked Netflix billing hook.",
    "SYS: OTP token credentials valid.",
    "SYS: DB integrity check: 100% OK",
    "CONN: Secure tunnel open to SMS gateway.",
    "SYNC: 0 changes detected in Spotify.",
    "SCAN: Gmail statement pull completed.",
    "SYS: Cache flushed. 2.4 MB freed.",
    "CONN: API Webhook handshake successful.",
    "SYS: Local session configuration synchronized."
];

let diagnosticInterval = null;

// Apply theme CSS variables to :root
function applyTheme(themeName) {
    const theme = THEMES[themeName] || THEMES.cosmic;
    const root = document.documentElement;
    Object.keys(theme).forEach(key => {
        root.style.setProperty(key, theme[key]);
    });
}

// Interactive 3D tilt effect for premium cards
function applyCardTiltEffect() {
    const cards = document.querySelectorAll('.interactive-tilt');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = -(y - centerY) / 8;
            const rotateY = (x - centerX) / 8;
            
            card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
        });
    });
}

// Sync Avatar pill in floating header
function syncAvatarUI() {
    const btn = document.getElementById('btn-profile-trigger');
    if (!btn) return;
    const avatar = state.currentUser.avatar || 'nebula';
    const vibe = AVATAR_VIBES[avatar] || AVATAR_VIBES.nebula;
    
    // Remove existing gradient and border classes
    btn.className = btn.className.replace(/from-\S+/g, '')
                                 .replace(/to-\S+/g, '')
                                 .replace(/hover:from-\S+/g, '')
                                 .replace(/hover:to-\S+/g, '')
                                 .replace(/border-\S+/g, '')
                                 .replace(/shadow-\S+/g, '');
                                 
    // Add new ones
    btn.classList.add(...vibe.gradient.split(' '));
    btn.classList.add(vibe.shadow);
    
    const avatarText = document.getElementById('user-avatar');
    if (avatarText) {
        avatarText.innerText = (state.currentUser.name || state.currentUser.email || 'U')[0].toUpperCase();
    }

    // Update active highlight border
    syncAvatarActiveState();
}

// Update avatar active glow border depending on activeTab
function syncAvatarActiveState() {
    const btn = document.getElementById('btn-profile-trigger');
    if (!btn) return;
    if (state.activeTab === 'account') {
        btn.classList.add('avatar-active-glow');
    } else {
        btn.classList.remove('avatar-active-glow');
    }
}

// ==========================================
// RENDERERS: TAB 3 - FULL PAGE ACCOUNT TAB
// ==========================================
function renderAccountTab() {
    const container = document.getElementById('tab-content-account');
    if (!container) return;

    const curAvatar = state.currentUser.avatar || 'nebula';
    const activeAvatarVibe = AVATAR_VIBES[curAvatar] || AVATAR_VIBES.nebula;
    
    // Generate initial diagnostics console log lines
    let logHtml = '';
    const now = new Date();
    for (let i = 0; i < 5; i++) {
        const timeStr = new Date(now.getTime() - (5 - i) * 60000).toLocaleTimeString();
        logHtml += `<div class="text-textMuted font-mono">[${timeStr}] ${DIAGNOSTIC_LOG_TEMPLATES[i]}</div>`;
    }

    let html = `
        <!-- Account Vitals Header -->
        <div class="mb-2">
            <h2 class="text-4xl font-normal text-cardTitle serif-title italic mb-2 tracking-tight">Account Control Deck</h2>
            <p class="text-xs text-textMuted font-sans max-w-xl">Configure directories, adjust billing cards, toggle notification rules, and customize cosmic accent presets from a unified control panel.</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            <!-- LEFT COLUMN: Profile info & System diagnostics -->
            <div class="lg:col-span-4 space-y-6">
                
                <!-- Profile details & Avatar customizer -->
                <div class="liquid-glass-card p-6 flex flex-col justify-between">
                    <!-- Spot Light glow in background -->
                    <div class="liquid-glow-spot top-0 right-0 w-32 h-32" style="background: ${activeAvatarVibe.glow}"></div>
                    
                    <div class="text-center pb-6 border-b border-glassBorder relative z-10">
                        <div class="relative w-20 h-20 mx-auto mb-4">
                            <div class="w-20 h-20 rounded-full bg-gradient-to-tr ${activeAvatarVibe.gradient} flex items-center justify-center text-cardTitle text-3xl font-black font-space shadow-2xl border-2 ${activeAvatarVibe.gradient.split(' ').pop()}">
                                <span>${(state.currentUser.name || 'U')[0].toUpperCase()}</span>
                            </div>
                            <div class="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-cardSubBg border border-glassBorder flex items-center justify-center text-brand-400">
                                <i data-lucide="${activeAvatarVibe.icon}" class="w-3.5 h-3.5 animate-pulse"></i>
                            </div>
                        </div>
                        
                        <h3 class="text-lg font-bold text-cardTitle font-space">${state.currentUser.name}</h3>
                        <p class="text-[9px] text-brand-400 mt-1 uppercase tracking-widest font-space font-semibold">${activeAvatarVibe.name} Secured</p>
                        
                        <!-- Profile editable fields input -->
                        <div class="space-y-3 text-left mt-6">
                            <div>
                                <label class="block text-[8px] font-bold text-textMuted uppercase tracking-widest mb-1 font-space">Display Name</label>
                                <input type="text" id="profile-input-name" value="${state.currentUser.name}" class="w-full bg-inputBg border border-glassBorder focus:border-brand-500 rounded-xl py-2 px-3 text-xs text-cardTitle placeholder-slate-650 focus:outline-none">
                            </div>
                            <div>
                                <label class="block text-[8px] font-bold text-textMuted uppercase tracking-widest mb-1 font-space">Primary Mobile</label>
                                <input type="text" id="profile-input-phone" value="${state.currentUser.phone}" placeholder="98765 43210" class="w-full bg-inputBg border border-glassBorder focus:border-brand-500 rounded-xl py-2 px-3 text-xs text-cardTitle placeholder-slate-650 focus:outline-none">
                            </div>
                            <div>
                                <label class="block text-[8px] font-bold text-textMuted uppercase tracking-widest mb-1 font-space">Primary Email</label>
                                <input type="email" id="profile-input-email" value="${state.currentUser.email}" placeholder="name@domain.com" class="w-full bg-inputBg border border-glassBorder focus:border-brand-500 rounded-xl py-2 px-3 text-xs text-cardTitle placeholder-slate-650 focus:outline-none">
                            </div>
                        </div>
                    </div>

                    <!-- Avatar Vibe selector -->
                    <div class="py-4 border-b border-glassBorder relative z-10">
                        <label class="block text-[8px] font-bold text-textMuted uppercase tracking-widest mb-3 font-space text-center">Select Profile Vibe</label>
                        <div class="grid grid-cols-4 gap-2">
                            ${Object.keys(AVATAR_VIBES).map(key => {
                                const active = curAvatar === key;
                                const v = AVATAR_VIBES[key];
                                return `
                                    <button class="avatar-opt-btn flex flex-col items-center p-1.5 rounded-xl border ${active ? 'border-brand-500 bg-brand-500/10' : 'border-glassBorder bg-glassBg'} hover:border-brand-500/30 transition-all focus:outline-none" data-avatar="${key}">
                                        <div class="w-7 h-7 rounded-lg bg-gradient-to-tr ${v.gradient} flex items-center justify-center text-cardTitle">
                                            <i data-lucide="${v.icon}" class="w-3.5 h-3.5"></i>
                                        </div>
                                        <span class="text-[7px] text-textMuted mt-1 font-space">${v.name}</span>
                                    </button>
                                `;
                            }).join('')}
                        </div>
                    </div>

                    <div class="pt-4 relative z-10 space-y-2">
                        <button onclick="triggerAccountReset()" class="w-full bg-inputBg border border-glassBorder hover:border-glassBorder text-cardTitle hover:text-cardTitle font-semibold text-xxs py-3 rounded-xl transition-all flex items-center justify-center space-x-2 font-space">
                            <i data-lucide="log-out" class="w-3.5 h-3.5 text-textMuted"></i>
                            <span>Disconnect Session (Log Out)</span>
                        </button>
                        <button onclick="triggerDeleteAccount()" class="w-full bg-red-500/10 border border-red-500/25 hover:bg-red-550 hover:text-cardTitle text-red-400 font-semibold text-xxs py-3 rounded-xl transition-all flex items-center justify-center space-x-2 font-space">
                            <i data-lucide="user-x" class="w-3.5 h-3.5"></i>
                            <span>Delete Account & Wipe Data</span>
                        </button>
                    </div>
                </div>

                <!-- Sync stats diagnostics console -->
                <div class="liquid-glass-card p-5 relative overflow-hidden">
                    <h3 class="text-xs font-bold text-cardTitle font-space uppercase tracking-wider mb-2 flex items-center space-x-2">
                        <i data-lucide="terminal" class="w-4 h-4 text-brand-400"></i>
                        <span>System Sync Logs</span>
                    </h3>
                    <div id="diagnostic-console" class="glass-console rounded-xl p-3.5 text-[9px] text-emerald-450 h-32 overflow-y-auto scrollbar-thin space-y-1.5">
                        ${logHtml}
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-glassBorder text-xxs font-sans text-textMuted">
                        <div>
                            <span class="block text-textMuted text-[8px] uppercase tracking-widest font-space mb-0.5">Scans Performed</span>
                            <span class="text-cardTitle font-bold font-space text-sm">${state.diagnostics.scansRun}</span>
                        </div>
                        <div>
                            <span class="block text-textMuted text-[8px] uppercase tracking-widest font-space mb-0.5">Linked APIs</span>
                            <span class="text-cardTitle font-bold font-space text-sm">${state.diagnostics.apiConnected} / 8</span>
                        </div>
                    </div>

                    <button id="btn-export-backup" class="w-full mt-4 bg-cardSubBg border border-glassBorder hover:border-brand-500/30 text-cardTitle font-bold text-[10px] py-2.5 rounded-xl transition-all flex items-center justify-center space-x-2 font-space">
                        <i data-lucide="download" class="w-3.5 h-3.5 text-cosmicBlue-400"></i>
                        <span>Download Settings Backup (JSON)</span>
                    </button>
                </div>
            </div>

            <!-- RIGHT COLUMN: Account settings forms & Card visualizer -->
            <div class="lg:col-span-8 space-y-6">
                
                <!-- Linked Accounts Scanner Directories -->
                <div class="liquid-glass-card p-6">
                    <div class="flex items-center space-x-3 mb-4">
                        <div class="p-2 bg-brand-500/10 border border-brand-500/20 text-brand-400 rounded-xl">
                            <i data-lucide="scan" class="w-5 h-5"></i>
                        </div>
                        <div>
                            <h3 class="text-sm font-bold text-cardTitle font-space">Linked Scanning Directories</h3>
                            <p class="text-[10px] text-textMuted font-sans">Active phone/email accounts AIOManager syncs to scrape billing notifications.</p>
                        </div>
                    </div>

                    <!-- Input form -->
                    <form id="connect-scan-directory-form" class="flex gap-3 pb-5 border-b border-glassBorder mb-5">
                        <div class="relative flex-grow">
                            <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-textMuted">
                                <i data-lucide="plus-circle" class="w-4 h-4"></i>
                            </span>
                            <input type="text" required id="scan-directory-input-field" placeholder="Enter secondary email or 10-digit mobile number"
                                class="w-full bg-inputBg border border-glassBorder rounded-xl py-3 pl-9 pr-4 text-xs text-cardTitle focus:outline-none focus:border-brand-500 placeholder-slate-650 font-sans">
                        </div>
                        <button type="submit" class="bg-gradient-to-r from-brand-600 to-cosmicBlue-600 hover:from-brand-500 hover:to-cosmicBlue-500 text-cardTitle font-bold text-xs px-5 py-3 rounded-xl transition-all shadow-[0_4px_12px_rgba(236,72,153,0.15)] whitespace-nowrap font-space">
                            Link & Scan
                        </button>
                    </form>

                    <!-- Directories list -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[190px] overflow-y-auto pr-1 scrollbar-thin">
                        ${state.currentUser.linkedCredentials.length > 0 ? state.currentUser.linkedCredentials.map((cred, idx) => {
                            const isEmail = cred.type === 'Email';
                            return `
                                <div class="flex items-center justify-between p-3.5 bg-glassBg border border-glassBorder rounded-2xl text-xs hover:border-brand-500/15 transition-all">
                                    <div class="flex items-center space-x-3.5">
                                        <div class="p-2.5 bg-inputBg border border-glassBorder text-textMuted rounded-xl flex-shrink-0">
                                            <i data-lucide="${isEmail ? 'mail' : 'smartphone'}" class="w-4.5 h-4.5"></i>
                                        </div>
                                        <div>
                                            <div class="font-semibold text-cardTitle font-space truncate max-w-[130px]">${cred.value}</div>
                                            <div class="text-[9px] text-textMuted">Connected: ${cred.dateAdded}</div>
                                        </div>
                                    </div>
                                    <button class="btn-delete-credential p-2 bg-red-500/10 border border-red-500/25 text-red-400 hover:bg-red-500 hover:text-cardTitle rounded-xl transition-all flex-shrink-0" data-index="${idx}" title="Unlink Directory">
                                        <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                                    </button>
                                </div>
                            `;
                        }).join('') : `
                            <div class="col-span-full py-8 text-center text-textMuted text-xs font-sans">No directories linked. Enter one above to scan for bills.</div>
                        `}
                    </div>
                </div>

                <!-- Billing Card Manager with visual credit card -->
                <div class="liquid-glass-card p-6">
                    <div class="flex items-center space-x-3 mb-6">
                        <div class="p-2 bg-brand-500/10 border border-brand-500/20 text-brand-400 rounded-xl">
                            <i data-lucide="credit-card" class="w-5 h-5"></i>
                        </div>
                        <div>
                            <h3 class="text-sm font-bold text-cardTitle font-space">Primary Billing Card</h3>
                            <p class="text-[10px] text-textMuted font-sans">Emulated credit card details parsed for subscription auto-debit payments.</p>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                        <!-- Glass Credit Card Render -->
                        <div class="glass-credit-card interactive-tilt relative p-6 flex flex-col justify-between overflow-hidden">
                            <!-- Inset spot glows -->
                            <div class="glass-card-bg-gradient"></div>
                            <div class="glass-card-bg-gradient-secondary"></div>
                            
                            <!-- Card Brand header -->
                            <div class="flex justify-between items-start z-10">
                                <div class="glass-card-chip"></div>
                                <div id="card-vendor-icon" class="text-cardTitle opacity-85">
                                    <span class="font-space text-[10px] font-black tracking-widest bg-white/10 px-2 py-0.5 rounded border border-glassBorder">${state.billingCard.provider.toUpperCase()}</span>
                                </div>
                            </div>
                            
                            <!-- Card Number -->
                            <div class="z-10 mt-6">
                                <div id="card-preview-number" class="embossed-text text-sm sm:text-base md:text-sm lg:text-base font-mono text-center tracking-widest text-cardTitle/95">
                                    ${state.billingCard.number}
                                </div>
                            </div>
                            
                            <!-- Card Name and Expiry -->
                            <div class="flex justify-between items-end z-10 mt-6 font-sans">
                                <div>
                                    <div class="text-[7px] text-textMuted font-bold uppercase tracking-widest font-space mb-0.5">Card Holder</div>
                                    <div id="card-preview-name" class="text-[10px] font-semibold text-cardTitle/90 uppercase tracking-wider font-space truncate max-w-[130px]">
                                        ${state.billingCard.name}
                                    </div>
                                </div>
                                <div class="text-right">
                                    <div class="text-[7px] text-textMuted font-bold uppercase tracking-widest font-space mb-0.5">Expires</div>
                                    <div id="card-preview-expiry" class="text-[10px] font-semibold text-cardTitle/90 font-mono">
                                        ${state.billingCard.expiry}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Card form settings -->
                        <form id="billing-card-edit-form" class="space-y-3.5">
                            <div>
                                <label class="block text-[8px] font-bold text-textMuted uppercase tracking-widest mb-1.5 font-space">Card Holder</label>
                                <input type="text" id="card-input-name" value="${state.billingCard.name}" class="w-full bg-inputBg border border-glassBorder focus:border-brand-500 rounded-xl py-2 px-3 text-xs text-cardTitle focus:outline-none">
                            </div>
                            <div>
                                <label class="block text-[8px] font-bold text-textMuted uppercase tracking-widest mb-1.5 font-space">Card Number</label>
                                <input type="text" id="card-input-number" value="${state.billingCard.number}" placeholder="4321 0000 0000 9876" class="w-full bg-inputBg border border-glassBorder focus:border-brand-500 rounded-xl py-2 px-3 text-xs text-cardTitle focus:outline-none">
                            </div>
                            <div class="grid grid-cols-2 gap-3.5">
                                <div>
                                    <label class="block text-[8px] font-bold text-textMuted uppercase tracking-widest mb-1.5 font-space">Expiry Date</label>
                                    <input type="text" id="card-input-expiry" value="${state.billingCard.expiry}" placeholder="MM/YY" class="w-full bg-inputBg border border-glassBorder focus:border-brand-500 rounded-xl py-2 px-3 text-xs text-cardTitle focus:outline-none">
                                </div>
                                <div>
                                    <label class="block text-[8px] font-bold text-textMuted uppercase tracking-widest mb-1.5 font-space">CVV</label>
                                    <input type="password" id="card-input-cvv" value="${state.billingCard.cvv}" placeholder="123" class="w-full bg-inputBg border border-glassBorder focus:border-brand-500 rounded-xl py-2 px-3 text-xs text-cardTitle focus:outline-none">
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                <!-- Theme Customizer & System Settings -->
                <div class="liquid-glass-card p-6">
                    <div class="flex items-center space-x-3 mb-6">
                        <div class="p-2 bg-brand-500/10 border border-brand-500/20 text-brand-400 rounded-xl">
                            <i data-lucide="palette" class="w-5 h-5"></i>
                        </div>
                        <div>
                            <h3 class="text-sm font-bold text-cardTitle font-space">Accent Vibe & Preferences</h3>
                            <p class="text-[10px] text-textMuted font-sans">Modify cosmic colors, currencies, and notifications alerts protocols.</p>
                        </div>
                    </div>

                    <div class="space-y-6">
                        <!-- Theme custom swatch lists -->
                        <div>
                            <label class="block text-[8px] font-bold text-textMuted uppercase tracking-widest mb-3.5 font-space">Cosmic Color Presets</label>
                            <div class="flex flex-wrap gap-4 items-center">
                                ${Object.keys(THEMES).map(themeName => {
                                    const isSelected = state.preferences.theme === themeName;
                                    const colors = THEMES[themeName];
                                    let displayName = themeName.charAt(0).toUpperCase() + themeName.slice(1);
                                    if (themeName === 'cosmic') displayName = 'Cosmic Presets';
                                    
                                    return `
                                        <button class="theme-select-btn flex flex-col items-center gap-1.5 focus:outline-none" data-theme="${themeName}">
                                            <div style="background: linear-gradient(135deg, ${colors.brandHex}, ${colors.cosmicHex});" class="w-10 h-10 rounded-full border-2 ${isSelected ? 'border-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.4)]' : 'border-glassBorder opacity-70 hover:opacity-100'} transition-all flex items-center justify-center relative">
                                                ${isSelected ? '<span class="absolute w-2.5 h-2.5 rounded-full bg-white"></span>' : ''}
                                            </div>
                                            <span class="text-[9px] ${isSelected ? 'text-cardTitle font-semibold' : 'text-textMuted'} font-space">${displayName}</span>
                                        </button>
                                    `;
                                }).join('')}
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-glassBorder">
                            <!-- Currency -->
                            <div>
                                <label class="block text-[8px] font-bold text-textMuted uppercase tracking-widest mb-2 font-space">Currency Unit</label>
                                <select id="pref-currency-select" class="w-full bg-inputBg border border-glassBorder focus:border-brand-500 rounded-xl py-2.5 px-3 text-xs text-cardTitle focus:outline-none">
                                    <option value="INR" ${state.preferences.currency === 'INR' ? 'selected' : ''}>INR (₹) - Indian Rupee</option>
                                    <option value="USD" ${state.preferences.currency === 'USD' ? 'selected' : ''}>USD ($) - US Dollar</option>
                                    <option value="EUR" ${state.preferences.currency === 'EUR' ? 'selected' : ''}>EUR (€) - Euro</option>
                                    <option value="GBP" ${state.preferences.currency === 'GBP' ? 'selected' : ''}>GBP (£) - British Pound</option>
                                </select>
                            </div>
                            <!-- Notifications checkboxes -->
                            <div class="space-y-4 font-sans text-xs">
                                <label class="block text-[8px] font-bold text-textMuted uppercase tracking-widest mb-1 font-space">Notifications</label>
                                
                                <!-- Alert 1 -->
                                <label class="flex items-center cursor-pointer select-none group">
                                    <div class="relative flex-shrink-0">
                                        <input type="checkbox" id="chk-billing-alerts" ${state.preferences.billingAlerts ? 'checked' : ''} class="sr-only peer">
                                        <div class="w-9 h-5 bg-inputBg border border-glassBorder rounded-full transition-all peer-checked:bg-gradient-to-r peer-checked:from-brand-600 peer-checked:to-cosmicBlue-600 peer-checked:border-transparent after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:after:translate-x-4"></div>
                                    </div>
                                    <span class="ml-3 text-cardTitle hover:text-cardTitle transition-all text-xxs font-space leading-tight">Critical billing renewal alerts (5 days warning)</span>
                                </label>

                                <!-- Alert 2 -->
                                <label class="flex items-center cursor-pointer select-none group">
                                    <div class="relative flex-shrink-0">
                                        <input type="checkbox" id="chk-sms-alerts" ${state.preferences.smsAlerts ? 'checked' : ''} class="sr-only peer">
                                        <div class="w-9 h-5 bg-inputBg border border-glassBorder rounded-full transition-all peer-checked:bg-gradient-to-r peer-checked:from-brand-600 peer-checked:to-cosmicBlue-600 peer-checked:border-transparent after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:after:translate-x-4"></div>
                                    </div>
                                    <span class="ml-3 text-cardTitle hover:text-cardTitle transition-all text-xxs font-space leading-tight">Mobile SMS notifications on scan matching</span>
                                </label>

                                <!-- Alert 3 -->
                                <label class="flex items-center cursor-pointer select-none group">
                                    <div class="relative flex-shrink-0">
                                        <input type="checkbox" id="chk-monthly-reports" ${state.preferences.monthlyReports ? 'checked' : ''} class="sr-only peer">
                                        <div class="w-9 h-5 bg-inputBg border border-glassBorder rounded-full transition-all peer-checked:bg-gradient-to-r peer-checked:from-brand-600 peer-checked:to-cosmicBlue-600 peer-checked:border-transparent after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:after:translate-x-4"></div>
                                    </div>
                                    <span class="ml-3 text-cardTitle hover:text-cardTitle transition-all text-xxs font-space leading-tight">Monthly spending and subscription summary reports</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    `;

    container.innerHTML = html;
    
    // Bind all event listeners inside account tab
    bindAccountEventListeners();
    
    // Start diagnostics interval
    startDiagnosticLogging();
    
    lucide.createIcons();
    applyCardTiltEffect();
}

function bindAccountEventListeners() {
    // 1. Profile editable fields real-time sync
    const inputProfileName = document.getElementById('profile-input-name');
    const inputProfilePhone = document.getElementById('profile-input-phone');
    const inputProfileEmail = document.getElementById('profile-input-email');
    
    const saveProfile = () => {
        state.currentUser.name = inputProfileName.value.trim() || 'Rishabh Raj';
        state.currentUser.phone = inputProfilePhone.value.trim();
        state.currentUser.email = inputProfileEmail.value.trim();
        saveStateToStorage();
        syncAvatarUI();
    };

    if (inputProfileName) {
        inputProfileName.addEventListener('blur', saveProfile);
        inputProfileName.addEventListener('input', (e) => {
            const h3 = e.target.closest('.liquid-glass-card').querySelector('h3');
            if (h3) h3.innerText = e.target.value.trim() || 'Rishabh Raj';
            // Sync user avatar indicator character
            const avatarChar = document.getElementById('user-avatar');
            if (avatarChar) avatarChar.innerText = (e.target.value.trim() || 'U')[0].toUpperCase();
        });
    }
    if (inputProfilePhone) inputProfilePhone.addEventListener('blur', saveProfile);
    if (inputProfileEmail) inputProfileEmail.addEventListener('blur', saveProfile);

    // 2. Avatar Selection swatches
    document.querySelectorAll('.avatar-opt-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const choice = btn.getAttribute('data-avatar');
            state.currentUser.avatar = choice;
            saveStateToStorage();
            renderAccountTab();
        });
    });

    // 3. Sync Scanner Directory Linker Form
    const scanLinkerForm = document.getElementById('connect-scan-directory-form');
    if (scanLinkerForm) {
        scanLinkerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const inputVal = document.getElementById('scan-directory-input-field').value.trim();
            if (inputVal) {
                const type = inputVal.includes('@') ? 'Email' : 'Phone';
                state.currentUser.linkedCredentials.push({
                    type: type,
                    value: type === 'Phone' && !inputVal.startsWith('+91') ? `+91 ${inputVal}` : inputVal,
                    dateAdded: new Date().toLocaleDateString()
                });
                
                state.diagnostics.scansRun++;
                state.diagnostics.apiConnected = Math.min(8, state.diagnostics.apiConnected + 1);
                state.diagnostics.lastScanTime = new Date().toLocaleString();
                
                alert(`Linked ${inputVal} to scanning gateway. System diagnostics: scan run successful!`);
                saveStateToStorage();
                renderAccountTab();
            }
        });
    }

    // 4. Delete Scanning Credentials buttons
    document.querySelectorAll('.btn-delete-credential').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = parseInt(btn.getAttribute('data-index'));
            if (confirm(`Are you sure you want to unlink this scanning directory?`)) {
                state.currentUser.linkedCredentials.splice(idx, 1);
                state.diagnostics.apiConnected = Math.max(0, state.diagnostics.apiConnected - 1);
                saveStateToStorage();
                renderAccountTab();
            }
        });
    });

    // 5. Live Card Preview Forms Syncing
    const inputCardName = document.getElementById('card-input-name');
    const inputCardNumber = document.getElementById('card-input-number');
    const inputCardExpiry = document.getElementById('card-input-expiry');
    const inputCardCvv = document.getElementById('card-input-cvv');

    const updateCardState = () => {
        state.billingCard.name = inputCardName.value.trim().toUpperCase() || 'RISHABH RAJ';
        state.billingCard.number = inputCardNumber.value.trim() || '4321 0000 0000 9876';
        state.billingCard.expiry = inputCardExpiry.value.trim() || '12/29';
        state.billingCard.cvv = inputCardCvv.value.trim() || '***';
        saveStateToStorage();
    };

    if (inputCardName) {
        inputCardName.addEventListener('input', (e) => {
            const el = document.getElementById('card-preview-name');
            if (el) el.innerText = e.target.value.trim().toUpperCase() || 'RISHABH RAJ';
        });
        inputCardName.addEventListener('blur', updateCardState);
    }

    if (inputCardNumber) {
        inputCardNumber.addEventListener('input', (e) => {
            let val = e.target.value.replace(/\s+/g, '').replace(/[^0-9•]/gi, '');
            // Format into 4-digit groups
            let formatted = '';
            for (let i = 0; i < val.length; i++) {
                if (i > 0 && i % 4 === 0) formatted += ' ';
                formatted += val[i];
            }
            e.target.value = formatted;
            
            const el = document.getElementById('card-preview-number');
            if (el) el.innerText = formatted || '4321 0000 0000 9876';
            
            // Detect Vendor Logo dynamically
            updateCardVendorIcon(formatted);
        });
        inputCardNumber.addEventListener('blur', updateCardState);
    }

    if (inputCardExpiry) {
        inputCardExpiry.addEventListener('input', (e) => {
            let val = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
            if (val.length >= 2 && !e.target.value.includes('/')) {
                val = val.substring(0,2) + '/' + val.substring(2, 4);
            }
            e.target.value = val;
            
            const el = document.getElementById('card-preview-expiry');
            if (el) el.innerText = val || '12/29';
        });
        inputCardExpiry.addEventListener('blur', updateCardState);
    }
    
    if (inputCardCvv) {
        inputCardCvv.addEventListener('blur', updateCardState);
    }

    // 6. Accent Theme switcher selector buttons
    document.querySelectorAll('.theme-select-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const themeChoice = btn.getAttribute('data-theme');
            state.preferences.theme = themeChoice;
            applyTheme(themeChoice);
            saveStateToStorage();
            renderAccountTab();
        });
    });

    // 7. Preferences currency change
    const selectCurrency = document.getElementById('pref-currency-select');
    if (selectCurrency) {
        selectCurrency.addEventListener('change', (e) => {
            state.preferences.currency = e.target.value;
            saveStateToStorage();
        });
    }

    // 8. Preference alerts checkboxes
    const chkBilling = document.getElementById('chk-billing-alerts');
    const chkSms = document.getElementById('chk-sms-alerts');
    const chkMonthly = document.getElementById('chk-monthly-reports');

    const updateCheckboxes = () => {
        state.preferences.billingAlerts = chkBilling ? chkBilling.checked : true;
        state.preferences.smsAlerts = chkSms ? chkSms.checked : false;
        state.preferences.monthlyReports = chkMonthly ? chkMonthly.checked : true;
        saveStateToStorage();
    };

    if (chkBilling) chkBilling.addEventListener('change', updateCheckboxes);
    if (chkSms) chkSms.addEventListener('change', updateCheckboxes);
    if (chkMonthly) chkMonthly.addEventListener('change', updateCheckboxes);

    // 9. Config JSON backup download
    const exportBtn = document.getElementById('btn-export-backup');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
            const downloadAnchor = document.createElement('a');
            downloadAnchor.setAttribute("href", dataStr);
            downloadAnchor.setAttribute("download", `aiomanager_backup_${Date.now()}.json`);
            document.body.appendChild(downloadAnchor);
            downloadAnchor.click();
            downloadAnchor.remove();
        });
    }
}

function updateCardVendorIcon(number) {
    const iconContainer = document.getElementById('card-vendor-icon');
    if (!iconContainer) return;
    const cleanNum = number.replace(/\s+/g, '');
    let vendorText = 'CARD';
    if (cleanNum.startsWith('4')) vendorText = 'VISA';
    else if (cleanNum.startsWith('5')) vendorText = 'MASTERCARD';
    else if (cleanNum.startsWith('6')) vendorText = 'RUPAY';
    else if (cleanNum.startsWith('3')) vendorText = 'AMEX';
    
    state.billingCard.provider = vendorText.toLowerCase();
    iconContainer.innerHTML = `<span class="font-space text-[9px] font-black tracking-widest bg-white/10 px-2 py-0.5 rounded border border-glassBorder">${vendorText}</span>`;
}

function startDiagnosticLogging() {
    if (diagnosticInterval) clearInterval(diagnosticInterval);
    diagnosticInterval = setInterval(() => {
        if (state.activeTab !== 'account') {
            clearInterval(diagnosticInterval);
            diagnosticInterval = null;
            return;
        }
        const consoleEl = document.getElementById('diagnostic-console');
        if (!consoleEl) return;
        const randomLog = DIAGNOSTIC_LOG_TEMPLATES[Math.floor(Math.random() * DIAGNOSTIC_LOG_TEMPLATES.length)];
        const timeStr = new Date().toLocaleTimeString();
        const line = document.createElement('div');
        line.className = 'text-emerald-450/90 font-mono log-line text-[10px] flex items-center space-x-1.5';
        line.innerHTML = `<span class="text-emerald-500 font-extrabold select-none">❯</span> <span>[${timeStr}] ${randomLog}</span>`;
        consoleEl.appendChild(line);
        consoleEl.scrollTop = consoleEl.scrollHeight;
        
        // Keep logs within 20 items
        if (consoleEl.children.length > 20) {
            consoleEl.removeChild(consoleEl.firstChild);
        }
    }, 4500);
}

function triggerAccountReset() {
    if (confirm("Are you sure you want to disconnect? This will clear local configuration logs.")) {
        // Reset intervals
        if (diagnosticInterval) {
            clearInterval(diagnosticInterval);
            diagnosticInterval = null;
        }
        if (isSupabaseConfigured) {
            supabaseClient.auth.signOut().catch(e => console.error("Sign out error:", e));
        }
        localStorage.removeItem('subsentry_state');
        state = {
            isLoggedIn: false,
            currentUser: {
                name: 'Rishabh Raj',
                phone: '',
                email: '',
                avatar: 'nebula',
                linkedCredentials: []
            },
            subscriptions: [],
            activeTab: 'home',
            preferences: {
                theme: 'cosmic',
                currency: 'INR',
                billingAlerts: true,
                smsAlerts: false,
                monthlyReports: true
            },
            billingCard: {
                number: '4321 0000 0000 9876',
                name: 'RISHABH RAJ',
                expiry: '12/29',
                cvv: '***',
                provider: 'visa'
            },
            diagnostics: {
                scansRun: 14,
                apiConnected: 5,
                lastScanTime: new Date().toLocaleString()
            }
        };
        initAppView();
        lucide.createIcons();
    }
}

function triggerDeleteAccount() {
    if (confirm("⚠️ WARNING: Are you sure you want to permanently delete your account? This will wipe all subscription settings, billing cards, and linked scanner directories from this browser. This action cannot be undone.")) {
        // Reset intervals
        if (diagnosticInterval) {
            clearInterval(diagnosticInterval);
            diagnosticInterval = null;
        }
        if (isSupabaseConfigured) {
            supabaseClient.auth.signOut().catch(e => console.error("Sign out error:", e));
        }
        // Wipe user registration from system lists
        const registeredUsers = JSON.parse(localStorage.getItem('subsentry_registered_users') || '[]');
        const phoneToWipe = state.currentUser.phone;
        const emailToWipe = state.currentUser.email;
        const updatedUsers = registeredUsers.filter(u => {
            const cleanUPhone = u.phone ? u.phone.replace(/[^0-9]/g, '') : '';
            const cleanStatePhone = phoneToWipe ? phoneToWipe.replace(/[^0-9]/g, '') : '';
            const matchPhone = cleanStatePhone && cleanUPhone === cleanStatePhone;
            const matchEmail = emailToWipe && u.email === emailToWipe;
            return !(matchPhone || matchEmail);
        });
        localStorage.setItem('subsentry_registered_users', JSON.stringify(updatedUsers));

        localStorage.removeItem('subsentry_state');
        state = {
            isLoggedIn: false,
            currentUser: {
                name: 'Rishabh Raj',
                phone: '',
                email: '',
                avatar: 'nebula',
                linkedCredentials: []
            },
            subscriptions: [],
            activeTab: 'home',
            preferences: {
                theme: 'cosmic',
                currency: 'INR',
                billingAlerts: true,
                smsAlerts: false,
                monthlyReports: true
            },
            billingCard: {
                number: '4321 0000 0000 9876',
                name: 'RISHABH RAJ',
                expiry: '12/29',
                cvv: '***',
                provider: 'visa'
            },
            diagnostics: {
                scansRun: 14,
                apiConnected: 5,
                lastScanTime: new Date().toLocaleString()
            }
        };
        alert("Your account has been deleted and all local data has been wiped.");
        initAppView();
        lucide.createIcons();
    }
}

// ==========================================
// FORM SUBMISSIONS & MODALS CONTROLLER
// ==========================================

function openAddSubModal() {
    const modal = document.getElementById('add-sub-modal');
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modal.querySelector('.transform').classList.remove('scale-95');
    }, 10);
}

function closeAddSubModal() {
    const modal = document.getElementById('add-sub-modal');
    modal.classList.add('opacity-0');
    modal.querySelector('.transform').classList.add('scale-95');
    setTimeout(() => {
        modal.classList.add('hidden');
        document.getElementById('add-sub-form').reset();
        document.getElementById('custom-name-container').classList.remove('hidden');
    }, 300);
}

let cancellationActiveSubId = null;

function openCancellationWizard(id) {
    cancellationActiveSubId = id;
    const sub = state.subscriptions.find(s => s.id === id);
    if (!sub) return;

    const template = MOCK_PROVIDER_DATA[sub.providerKey] || {
        name: sub.name,
        cost: sub.cost,
        iconBg: 'bg-inputBg text-textMuted border-glassBorder',
        lucideIcon: 'credit-card',
        manualSteps: ['Open provider account page.', 'Select cancel billing.']
    };

    document.getElementById('cancel-target-name').innerText = sub.name;
    document.getElementById('cancel-target-savings').innerText = sub.cost;
    document.getElementById('manual-cancel-name').innerText = sub.name;
    document.getElementById('success-cancel-name').innerText = sub.name;
    document.getElementById('manual-cancel-steps').innerHTML = template.manualSteps.map(step => `<li>${step}</li>`).join('');

    const logoContainer = document.getElementById('cancel-logo-container');
    logoContainer.className = `w-14 h-14 rounded-2xl mx-auto flex items-center justify-center text-cardTitle font-bold text-xl font-space mb-4 border ${template.iconBg}`;
    logoContainer.innerHTML = `<i data-lucide="${template.lucideIcon}" class="w-7 h-7"></i>`;

    document.getElementById('cancel-step-intro').classList.remove('hidden');
    document.getElementById('cancel-step-loader').classList.add('hidden');
    document.getElementById('cancel-step-manual').classList.add('hidden');
    document.getElementById('cancel-step-success').classList.add('hidden');

    const modal = document.getElementById('cancel-sub-modal');
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modal.querySelector('.transform').classList.remove('scale-95');
    }, 10);

    lucide.createIcons();
}

function closeCancellationWizard() {
    const modal = document.getElementById('cancel-sub-modal');
    modal.classList.add('opacity-0');
    modal.querySelector('.transform').classList.add('scale-95');
    setTimeout(() => {
        modal.classList.add('hidden');
        cancellationActiveSubId = null;
    }, 300);
}

function runAutoCancellationAnimation() {
    const introStep = document.getElementById('cancel-step-intro');
    const loaderStep = document.getElementById('cancel-step-loader');
    const progressText = document.getElementById('cancel-progress-text');
    const progressBar = document.getElementById('cancel-progress-bar');

    introStep.classList.add('hidden');
    loaderStep.classList.remove('hidden');
    
    progressBar.style.width = '0%';
    progressText.innerText = 'Connecting to vendor API gateway...';

    const cancelSteps = [
        { pct: 25, text: 'Verifying subscriber authorization token...' },
        { pct: 50, text: 'Submitting cancellation request parameters...' },
        { pct: 80, text: 'Awaiting confirmation hook from provider...' },
        { pct: 100, text: 'Subscription cancelled successfully!' }
    ];

    let current = 0;

    function nextCancelProgress() {
        if (current >= cancelSteps.length) {
            setTimeout(completeCancellationState, 500);
            return;
        }

        const step = cancelSteps[current];
        progressBar.style.width = `${step.pct}%`;
        progressText.innerText = step.text;

        current++;
        setTimeout(nextCancelProgress, 800 + Math.random() * 500);
    }

    setTimeout(nextCancelProgress, 300);
}

function completeCancellationState() {
    const subId = cancellationActiveSubId;
    const sub = state.subscriptions.find(s => s.id === subId);
    if (!sub) return;

    state.subscriptions = state.subscriptions.filter(s => s.id !== subId);
    saveStateToStorage();

    document.getElementById('cancel-step-loader').classList.add('hidden');
    document.getElementById('cancel-step-manual').classList.add('hidden');
    
    let newMonthlyTotal = 0;
    state.subscriptions.forEach(s => {
        const cost = parseFloat(s.cost) || 0;
        newMonthlyTotal += s.cycle === 'monthly' ? cost : cost / 12;
    });
    
    document.getElementById('success-new-cost').innerText = `₹${Math.round(newMonthlyTotal).toLocaleString('en-IN')}/mo`;
    document.getElementById('cancel-step-success').classList.remove('hidden');
    
    lucide.createIcons();
}

// ==========================================
// SUPABASE CLIENT INITIALIZATION & CONFIG
// ==========================================
// Replace these with your actual Supabase credentials to enable genuine SMS/Email OTP.
// When unconfigured, the system automatically falls back to Developer Mock Mode.
const SUPABASE_URL = 'https://abecitvproprkxhbtwtt.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_qheQzXmPF2pHJHOhBH34Yw_OIAPdNDn';

let supabaseClient = null;
let isSupabaseConfigured = false;

if (SUPABASE_URL && SUPABASE_URL !== 'YOUR_SUPABASE_PROJECT_URL' && SUPABASE_ANON_KEY && SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY') {
    try {
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        isSupabaseConfigured = true;
        console.log("⚡ Supabase Client initialized successfully.");
    } catch (e) {
        console.error("❌ Failed to initialize Supabase client:", e);
    }
} else {
    console.log("ℹ️ Supabase URL/AnonKey not configured. Running in simulated Developer Mock Mode.");
}

// ==========================================
// GOOGLE AUTH STATE & LOGIC
// ==========================================
let authMode = 'login'; // 'login' or 'signup'
let selectedRegisterAvatar = 'nebula';

// Switch between Log In and Sign Up modes
function switchAuthMode(mode) {
    if (mode === authMode) return;
    authMode = mode;

    const toggleLabel = document.getElementById('auth-toggle-label');
    const toggleBtn = document.getElementById('btn-toggle-auth-mode');
    const gmailBtnText = document.querySelector('#btn-gmail-login span');

    if (mode === 'signup') {
        if (toggleLabel) toggleLabel.innerText = "Already have an account?";
        if (toggleBtn) toggleBtn.innerText = "Log In";
        if (gmailBtnText) gmailBtnText.innerText = "Sign Up with Google";
    } else {
        if (toggleLabel) toggleLabel.innerText = "Don't have an account?";
        if (toggleBtn) toggleBtn.innerText = "Sign Up";
        if (gmailBtnText) gmailBtnText.innerText = "Continue with Google";
    }
}

// Google OAuth Redirect Sign In
async function signInWithGmail() {
    localStorage.setItem('auth_mode_redirect', authMode);
    if (isSupabaseConfigured) {
        try {
            const { error } = await supabaseClient.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin + window.location.pathname
                }
            });
            if (error) {
                alert(`Google Login Error: ${error.message}`);
            }
        } catch (err) {
            alert(`Failed to contact Supabase for Google OAuth: ${err.message}`);
        }
    } else {
        // Simulated mock redirect
        window.location.href = window.location.origin + window.location.pathname + '?mock_login=gmail';
    }
}

// Show Profile Registration Setup screen
function showRegisterSetup(phone, email) {
    // Hide scan form panel
    const formPanel = document.getElementById('scan-form-panel');
    if (formPanel) formPanel.classList.add('hidden');
    
    // Show register setup panel
    const regPanel = document.getElementById('register-setup-panel');
    if (regPanel) regPanel.classList.remove('hidden');

    // Reset name field
    const nameInput = document.getElementById('register-name');
    if (nameInput) nameInput.value = '';

    // Save target email in state
    state.currentUser.email = email || 'mock.user@gmail.com';
}

// Complete profile registration and trigger scan
function completeRegistration() {
    const nameInput = document.getElementById('register-name');
    const name = nameInput ? nameInput.value.trim() : '';
    if (!name) {
        alert("Please enter your name to complete registration.");
        return;
    }

    const email = state.currentUser.email || 'mock.user@gmail.com';

    // Save in user profile state
    state.currentUser.name = name;
    state.currentUser.avatar = selectedRegisterAvatar;
    state.currentUser.phone = '';

    // Append to registered users list in localStorage
    const registeredUsers = JSON.parse(localStorage.getItem('subsentry_registered_users') || '[]');
    if (!registeredUsers.some(u => u.email === email)) {
        registeredUsers.push({ name, phone: '', email });
    }
    localStorage.setItem('subsentry_registered_users', JSON.stringify(registeredUsers));

    // Hide panel and start scanning
    const regPanel = document.getElementById('register-setup-panel');
    if (regPanel) regPanel.classList.add('hidden');

    startScanning(null, email);
}

// Toggle Dark/Light mode theme
function toggleThemeMode() {
    const isLight = document.documentElement.classList.contains('light');
    if (isLight) {
        document.documentElement.classList.remove('light');
        document.body.classList.remove('light');
        localStorage.setItem('subsentry_theme_mode', 'dark');
        const icon = document.getElementById('theme-toggle-icon');
        if (icon) {
            icon.setAttribute('data-lucide', 'moon');
            lucide.createIcons();
        }
    } else {
        document.documentElement.classList.add('light');
        document.body.classList.add('light');
        localStorage.setItem('subsentry_theme_mode', 'light');
        const icon = document.getElementById('theme-toggle-icon');
        if (icon) {
            icon.setAttribute('data-lucide', 'sun');
            lucide.createIcons();
        }
    }
}

// ==========================================
// EVENTS LISTENERS SETUP
// ==========================================
function setupEventListeners() {
    // Theme Toggle Button
    const btnThemeToggle = document.getElementById('btn-theme-toggle');
    if (btnThemeToggle) {
        btnThemeToggle.addEventListener('click', () => {
            toggleThemeMode();
        });
    }

    // Gmail Login Button
    const btnGmailLogin = document.getElementById('btn-gmail-login');
    if (btnGmailLogin) {
        btnGmailLogin.addEventListener('click', () => {
            signInWithGmail();
        });
    }

    // Toggle Auth Mode Button
    const btnToggleAuth = document.getElementById('btn-toggle-auth-mode');
    if (btnToggleAuth) {
        btnToggleAuth.addEventListener('click', () => {
            const nextMode = authMode === 'login' ? 'signup' : 'login';
            switchAuthMode(nextMode);
        });
    }

    // Register setup panel back button
    const btnRegBack = document.getElementById('btn-register-back');
    if (btnRegBack) {
        btnRegBack.addEventListener('click', () => {
            const regPanel = document.getElementById('register-setup-panel');
            if (regPanel) regPanel.classList.add('hidden');
            document.getElementById('scan-form-panel').classList.remove('hidden');
        });
    }

    // Complete registration button
    const btnCompleteReg = document.getElementById('btn-complete-register');
    if (btnCompleteReg) {
        btnCompleteReg.addEventListener('click', () => {
            completeRegistration();
        });
    }

    // Avatar selection in registration
    const registerAvatarBtns = document.querySelectorAll('.register-avatar-btn');
    registerAvatarBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            registerAvatarBtns.forEach(b => {
                b.className = "register-avatar-btn w-10 h-10 rounded-full border border-glassBorder flex items-center justify-center text-cardTitle opacity-70 hover:opacity-100";
            });
            btn.className = "register-avatar-btn w-10 h-10 rounded-full border border-brand-500 flex items-center justify-center text-cardTitle scale-110 shadow-[0_0_10px_rgba(236,72,153,0.4)] animate-pulse";
            selectedRegisterAvatar = btn.getAttribute('data-avatar');
        });
    });

    document.querySelectorAll('[data-tab]').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.getAttribute('data-tab');
            if (tabName) switchTab(tabName);
        });
    });

    const logoRefresh = document.getElementById('logo-refresh');
    if (logoRefresh) {
        logoRefresh.addEventListener('click', () => {
            if (state.isLoggedIn) switchTab('home');
        });
    }

    // Avatar profile click - redirect to full page account tab
    const profileTrigger = document.getElementById('btn-profile-trigger');
    if (profileTrigger) {
        profileTrigger.addEventListener('click', () => {
            switchTab('account');
        });
    }

    // Close Modals
    const btnCloseAdd = document.getElementById('btn-close-add-modal');
    if (btnCloseAdd) btnCloseAdd.addEventListener('click', closeAddSubModal);

    const btnCloseCancel = document.getElementById('btn-close-cancel-modal');
    if (btnCloseCancel) btnCloseCancel.addEventListener('click', closeCancellationWizard);

    const btnCancelFinish = document.getElementById('btn-cancel-finish');
    if (btnCancelFinish) btnCancelFinish.addEventListener('click', () => {
        closeCancellationWizard();
        switchTab(state.activeTab);
    });

    const btnTriggerAuto = document.getElementById('btn-trigger-autosub');
    if (btnTriggerAuto) btnTriggerAuto.addEventListener('click', runAutoCancellationAnimation);

    const btnTriggerManual = document.getElementById('btn-trigger-manualsub');
    if (btnTriggerManual) {
        btnTriggerManual.addEventListener('click', () => {
            document.getElementById('cancel-step-intro').classList.add('hidden');
            document.getElementById('cancel-step-manual').classList.remove('hidden');
        });
    }

    const btnManualBack = document.getElementById('btn-manual-back');
    if (btnManualBack) {
        btnManualBack.addEventListener('click', () => {
            document.getElementById('cancel-step-manual').classList.add('hidden');
            document.getElementById('cancel-step-intro').classList.remove('hidden');
        });
    }

    const btnManualConfirm = document.getElementById('btn-manual-confirm');
    if (btnManualConfirm) {
        btnManualConfirm.addEventListener('click', () => {
            completeCancellationState();
        });
    }

    const selectService = document.getElementById('modal-sub-service');
    const customNameContainer = document.getElementById('custom-name-container');
    const inputCustomName = document.getElementById('modal-sub-custom-name');
    const inputCost = document.getElementById('modal-sub-cost');
    const selectCategory = document.getElementById('modal-sub-category');

    if (selectService) {
        selectService.addEventListener('change', (e) => {
            const val = e.target.value;
            if (val === '') {
                customNameContainer.classList.remove('hidden');
                inputCustomName.required = true;
                inputCost.value = '';
            } else {
                customNameContainer.classList.add('hidden');
                inputCustomName.required = false;
                inputCustomName.value = '';
                
                const data = MOCK_PROVIDER_DATA[val];
                if (data) {
                    inputCost.value = data.cost;
                    selectCategory.value = data.category;
                }
            }
        });
    }

    const addSubForm = document.getElementById('add-sub-form');
    if (addSubForm) {
        addSubForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const serviceSelect = document.getElementById('modal-sub-service').value;
            const customName = document.getElementById('modal-sub-custom-name').value.trim();
            const cost = parseInt(document.getElementById('modal-sub-cost').value);
            const cycle = document.getElementById('modal-sub-cycle').value;
            const renewalDate = document.getElementById('modal-sub-date').value;
            const category = document.getElementById('modal-sub-category').value;
            const payment = document.getElementById('modal-sub-payment').value;

            let finalName = '';
            let providerKey = '';

            if (serviceSelect === '') {
                finalName = customName;
                providerKey = 'custom-' + Date.now();
            } else {
                finalName = MOCK_PROVIDER_DATA[serviceSelect].name;
                providerKey = serviceSelect;
            }

            const newSubscription = {
                id: 'sub-' + Date.now(),
                name: finalName,
                cost: cost,
                cycle: cycle,
                category: category,
                nextRenewal: renewalDate,
                payment: payment,
                providerKey: providerKey,
                alertEnabled: true
            };

            state.subscriptions.push(newSubscription);
            saveStateToStorage();
            closeAddSubModal();
            
            switchTab('manage');
            alert(`Successfully added ${finalName} plan!`);
        });
    }
}
