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
        avatarIcon: null, // custom icon override (lucide icon name), null = use initials
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
    
    // Force dark theme
    document.documentElement.classList.remove('light');
    document.body.classList.remove('light');

    initGlitches();
    setupEventListeners();
    lucide.createIcons();
    applyCardTiltEffect();
    
    // Render custom GSAP pill nav
    renderPillNav();

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
        
        const loginBg = document.getElementById('login-glitch-bg');
        if (loginBg) loginBg.classList.add('hidden');
        
        const snowBg = document.getElementById('dashboard-snow-bg');
        if (snowBg) snowBg.classList.remove('hidden');
        
        // Update user avatar elements
        syncAvatarUI();
        
        switchTab('home');
    } else {
        scanView.classList.remove('hidden');
        dashboardView.classList.add('hidden');
        
        const loginBg = document.getElementById('login-glitch-bg');
        if (loginBg) loginBg.classList.remove('hidden');
        
        const snowBg = document.getElementById('dashboard-snow-bg');
        if (snowBg) snowBg.classList.add('hidden');
        
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
// ==========================================
// GLITCH CANVAS BACKGROUNDS DEFINITION
// ==========================================
let loginGlitchInstance = null;
let progressGlitchInstance = null;
let dashboardSnowInstance = null;

function initGlitches() {
    const loginBg = document.getElementById('login-glitch-bg');
    if (loginBg) {
        loginGlitchInstance = new LetterGlitch({
            container: loginBg,
            glitchSpeed: 50,
            centerVignette: true,
            outerVignette: false,
            smooth: true,
            glitchColors: ["#2b4539", "#61dca3", "#61b3dc"]
        });
    }
    
    const progressBg = document.getElementById('progress-glitch-bg');
    if (progressBg) {
        progressGlitchInstance = new LetterGlitch({
            container: progressBg,
            glitchSpeed: 50,
            centerVignette: true,
            outerVignette: false,
            smooth: true,
            glitchColors: ["#2b4539", "#61dca3", "#61b3dc"]
        });
    }
    
    const snowBg = document.getElementById('dashboard-snow-bg');
    if (snowBg && typeof PixelSnow !== 'undefined') {
        dashboardSnowInstance = new PixelSnow({
            container: snowBg,
            color: '#ffffff',
            flakeSize: 0.01,
            minFlakeSize: 1.25,
            pixelResolution: 200,
            speed: 1.25,
            density: 0.3,
            direction: 125,
            brightness: 1,
            depthFade: 8,
            farPlane: 20,
            gamma: 0.4545,
            variant: 'square'
        });
    }
}

// ==========================================
// CUSTOM FLOATING PILL NAVIGATION (GSAP)
// ==========================================
let pillNavInstance = null;

function renderPillNav() {
    const container = document.getElementById('nav-container');
    if (!container) return;

    if (pillNavInstance) {
        pillNavInstance.destroy();
    }

    const avatarName = state.currentUser.avatar || 'nebula';
    const firstChar = (state.currentUser.name || 'U')[0].toUpperCase();

    pillNavInstance = new PillNav({
        container: container,
        logo: '',
        logoAlt: 'Profile',
        items: [
            { label: 'Home', href: 'home' },
            { label: 'Manage', href: 'manage' }
        ],
        activeHref: state.activeTab,
        baseColor: '#000000',
        pillColor: '#ffffff',
        pillTextColor: '#000000',
        hoveredPillTextColor: '#ffffff',
        onTabClick: (tabName) => {
            switchTab(tabName);
        },
        initialLoadAnimation: false
    });

    // Style the left profile avatar button inside PillNav
    const avatarEl = document.getElementById('pillnav-logo-avatar');
    if (avatarEl) {
        const activeAvatarVibe = AVATAR_VIBES[avatarName] || AVATAR_VIBES.nebula;
        avatarEl.style.background = '';
        avatarEl.className = `w-full h-full rounded-full flex items-center justify-center text-xs font-black font-space select-none bg-gradient-to-tr ${activeAvatarVibe.gradient}`;
        if (state.currentUser.avatarIcon) {
            avatarEl.innerHTML = `<i data-lucide="${state.currentUser.avatarIcon}" class="w-4 h-4"></i>`;
            lucide.createIcons({ nodes: [avatarEl] });
        } else {
            avatarEl.innerText = firstChar;
        }
    }
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

    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.add('hidden');
    });

    const targetPane = document.getElementById(`tab-content-${tabName}`);
    if (targetPane) {
        targetPane.classList.remove('hidden');
    }

    if (tabName === 'home') {
        renderHomeTab();
    } else if (tabName === 'manage') {
        renderManageTab();
    } else if (tabName === 'account') {
        renderAccountTab();
    }

    renderPillNav();
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

    let currentStep = 0;

    function runNextStep() {
        if (currentStep >= scanSteps.length) {
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
        <!-- Hero Section -->
        <div class="flex flex-col items-center justify-center text-center space-y-6 pt-12 pb-16">
            <div class="inline-flex items-center space-x-2 bg-glassBg border border-glassBorder rounded-full px-4 py-1.5 mb-2 shadow-sm">
                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span class="text-[11px] font-medium text-textMuted font-sans">Live scanning • ${state.currentUser.linkedCredentials.length} sources connected</span>
            </div>
            
            <h1 class="text-5xl md:text-7xl font-extrabold text-cardTitle font-sans tracking-tight leading-[1.1]">
                Your subscription<br />
                <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">universe</span>
            </h1>
            
            <p class="text-textMuted text-sm md:text-base max-w-lg mx-auto font-sans leading-relaxed">
                Every service you pay for, detected and organized automatically from your email and phone.
            </p>
            
            <button onclick="switchTab('manage')" class="mt-4 bg-indigo-500 hover:bg-indigo-400 text-white font-medium py-3 px-8 rounded-xl transition-all shadow-[0_0_20px_rgba(99,102,241,0.4)] flex items-center space-x-2 font-sans">
                <i data-lucide="refresh-cw" class="w-4 h-4"></i>
                <span>Scan now</span>
            </button>
        </div>

        <!-- 4 Summary Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-2">
            
            <!-- Card 1: Monthly spend -->
            <div class="bg-glassBg border border-glassBorder rounded-3xl p-6 flex flex-col justify-between h-40 hover:bg-glassBorder/50 transition-colors group">
                <div class="flex justify-between items-start">
                    <span class="text-xs font-medium text-textMuted font-sans">Monthly spend</span>
                    <div class="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg group-hover:bg-indigo-500/20 transition-colors">
                        <i data-lucide="trending-up" class="w-4 h-4"></i>
                    </div>
                </div>
                <div>
                    <div class="text-3xl font-bold text-cardTitle font-sans tracking-tight">₹${monthlySpend.toLocaleString('en-IN')}</div>
                    <div class="text-[11px] text-textMuted mt-1 font-sans">Includes ${activeCount} active plans</div>
                </div>
            </div>

            <!-- Card 2: Active plans -->
            <div class="bg-glassBg border border-glassBorder rounded-3xl p-6 flex flex-col justify-between h-40 hover:bg-glassBorder/50 transition-colors group">
                <div class="flex justify-between items-start">
                    <span class="text-xs font-medium text-textMuted font-sans">Active plans</span>
                    <div class="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg group-hover:bg-emerald-500/20 transition-colors">
                        <i data-lucide="check-circle-2" class="w-4 h-4"></i>
                    </div>
                </div>
                <div>
                    <div class="text-3xl font-bold text-cardTitle font-sans tracking-tight">${activeCount}</div>
                    <div class="text-[11px] text-textMuted mt-1 font-sans">${criticalBills.length} renewing soon</div>
                </div>
            </div>

            <!-- Card 3: Detected via email -->
            <div class="bg-glassBg border border-glassBorder rounded-3xl p-6 flex flex-col justify-between h-40 hover:bg-glassBorder/50 transition-colors group">
                <div class="flex justify-between items-start">
                    <span class="text-xs font-medium text-textMuted font-sans">Detected via sources</span>
                    <div class="p-2 bg-cyan-500/10 text-cyan-400 rounded-lg group-hover:bg-cyan-500/20 transition-colors">
                        <i data-lucide="mail" class="w-4 h-4"></i>
                    </div>
                </div>
                <div>
                    <div class="text-3xl font-bold text-cardTitle font-sans tracking-tight">${activeCount}</div>
                    <div class="text-[11px] text-textMuted mt-1 font-sans">auto-synced</div>
                </div>
            </div>

            <!-- Card 4: Alerts -->
            <div class="bg-glassBg border border-glassBorder rounded-3xl p-6 flex flex-col justify-between h-40 hover:bg-glassBorder/50 transition-colors group">
                <div class="flex justify-between items-start">
                    <span class="text-xs font-medium text-textMuted font-sans">Alerts</span>
                    <div class="p-2 bg-amber-500/10 text-amber-400 rounded-lg group-hover:bg-amber-500/20 transition-colors">
                        <i data-lucide="alert-triangle" class="w-4 h-4"></i>
                    </div>
                </div>
                <div>
                    <div class="text-3xl font-bold text-cardTitle font-sans tracking-tight">${criticalBills.length}</div>
                    <div class="text-[11px] text-textMuted mt-1 font-sans">actions required</div>
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
        <!-- Header -->
        <div class="mb-8 flex justify-between items-start">
            <div>
                <h1 class="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 font-space tracking-wide mb-2">Manage</h1>
                <p class="text-sm text-textMuted font-sans">${state.subscriptions.length} subscriptions found</p>
            </div>
            <button class="bg-[#13111a] border border-glassBorder text-textMuted px-4 py-2 rounded-xl text-xs flex items-center space-x-2 font-sans hover:bg-[#1a1723]">
                <i data-lucide="sliders-horizontal" class="w-3.5 h-3.5"></i>
                <span>Name</span>
                <i data-lucide="chevron-down" class="w-3 h-3 ml-1"></i>
            </button>
        </div>

        <!-- Search bar -->
        <div class="relative w-full mb-6">
            <span class="absolute inset-y-0 left-0 pl-4 flex items-center text-textMuted">
                <i data-lucide="search" class="w-4 h-4"></i>
            </span>
            <input type="text" id="manage-search" placeholder="Search subscriptions..." value="${manageSearchQuery}"
                class="w-full bg-[#13111a] border border-glassBorder focus:border-brand-500 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-cardTitle focus:outline-none placeholder-slate-500 font-sans shadow-inner">
        </div>

        <!-- Category Pills Filter -->
        <div class="flex items-center space-x-2 overflow-x-auto w-full scrollbar-none mb-4 pb-1">
            ${categoriesList.map(cat => {
                const isSelected = cat === manageCategoryFilter;
                return `
                    <button onclick="setManageCategory('${cat}')" class="px-5 py-2 rounded-full text-[11px] font-medium whitespace-nowrap transition-all border font-sans ${
                        isSelected 
                        ? 'bg-brand-500/20 border-brand-500 text-cardTitle' 
                        : 'bg-[#13111a] border-glassBorder text-textMuted hover:text-cardTitle hover:bg-[#1a1723]'
                    }">
                        ${cat}
                    </button>
                `;
            }).join('')}
        </div>

        <!-- Status Filter -->
        <div class="flex items-center space-x-4 mb-8 text-[11px] font-medium font-sans">
            <button class="px-4 py-1.5 rounded-full bg-teal-500/20 text-teal-400">All</button>
            <button class="text-textMuted hover:text-cardTitle transition-colors px-2">Active</button>
            <button class="text-textMuted hover:text-cardTitle transition-colors px-2">Trial</button>
            <button class="text-textMuted hover:text-cardTitle transition-colors px-2">Cancelled</button>
        </div>

        <!-- Subscriptions Grid List -->
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            ${filteredSubs.length > 0 ? filteredSubs.map((sub, index) => {
                const template = MOCK_PROVIDER_DATA[sub.providerKey] || {
                    lucideIcon: 'credit-card',
                };
                
                // Mock statuses for visual variety based on index
                const isActive = index % 3 !== 2; 
                const statusColor = isActive ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-red-400 bg-red-500/10 border-red-500/20';
                const statusText = isActive ? 'ACTIVE' : 'CANCELLED';
                const gradLine = isActive ? 'from-purple-500 via-indigo-500 to-emerald-500' : 'from-orange-500 to-red-500';

                return `
                    <div onclick="openSubscriptionDetails('${sub.id}')" class="bg-[#0f0e13] border border-glassBorder rounded-[20px] p-6 relative group hover:border-glassBorder/80 hover:bg-[#15131a] transition-all cursor-pointer flex flex-col justify-between overflow-hidden min-h-[220px]">
                        
                        <!-- Top Row: Icon & Status -->
                        <div class="flex justify-between items-start mb-6">
                            <div class="w-10 h-10 rounded-[14px] bg-[#1a1723] flex items-center justify-center flex-shrink-0 shadow-inner">
                                <i data-lucide="${template.lucideIcon}" class="w-5 h-5 text-brand-400"></i>
                            </div>
                            <span class="px-3 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase border ${statusColor} font-sans">
                                ${statusText}
                            </span>
                        </div>

                        <!-- Middle Row: Name & Category -->
                        <div class="mb-8">
                            <h4 class="font-bold text-cardTitle text-lg font-sans tracking-tight mb-1">${sub.name}</h4>
                            <p class="text-[11px] text-slate-500 font-sans">${sub.category}</p>
                        </div>

                        <!-- Bottom Row: Price & Date -->
                        <div class="flex items-end justify-between mt-auto mb-4">
                            <div>
                                <div class="text-2xl font-bold text-cardTitle font-sans tracking-tight leading-none mb-1">₹${sub.cost}</div>
                                <div class="text-[10px] text-slate-500 font-sans">/ ${sub.cycle}</div>
                            </div>
                            <div class="text-right">
                                <div class="text-[10px] text-slate-500 font-sans mb-1">${sub.payment.toLowerCase().includes('card') ? 'via card' : 'via email'}</div>
                                <div class="text-xs text-slate-300 font-medium font-sans">${new Date(sub.nextRenewal).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                            </div>
                        </div>

                        <!-- Bottom Gradient Progress Line -->
                        <div class="absolute bottom-6 left-6 right-6 h-[3px] bg-[#1a1723] rounded-full overflow-hidden">
                            <div class="h-full w-2/3 bg-gradient-to-r ${gradLine} rounded-full"></div>
                        </div>
                    </div>
                `;
            }).join('') : `
                <div class="col-span-full bg-[#13111a] border border-dashed border-glassBorder rounded-3xl p-12 text-center">
                    <div class="p-4 bg-[#1a1723] border border-glassBorder text-textMuted rounded-full w-14 h-14 mx-auto mb-4 flex items-center justify-center">
                        <i data-lucide="credit-card" class="w-6 h-6"></i>
                    </div>
                    <h4 class="text-cardTitle font-bold text-base font-space">No Active Subscriptions</h4>
                    <p class="text-textMuted text-xs mt-1 mb-6 font-sans">No integrations match your search parameters.</p>
                </div>
            `}
        </div>
    `;

    container.innerHTML = html;

    const searchInput = document.getElementById('manage-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            manageSearchQuery = e.target.value;
            const start = e.target.selectionStart;
            const end = e.target.selectionEnd;
            renderManageTab();
            const newSearchInput = document.getElementById('manage-search');
            if (newSearchInput) {
                newSearchInput.focus();
                newSearchInput.setSelectionRange(start, end);
            }
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

// Open Subscription Details Modal
window.openSubscriptionDetails = function(subId) {
    const sub = state.subscriptions.find(s => s.id === subId);
    if (!sub) return;

    // Create modal overlay
    const modal = document.createElement('div');
    modal.id = 'sub-detail-modal';
    modal.className = 'fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md opacity-0 transition-opacity duration-300 p-4';
    
    const template = MOCK_PROVIDER_DATA[sub.providerKey] || { lucideIcon: 'credit-card', manualSteps: ['No detailed steps available.'] };

    modal.innerHTML = `
        <div class="bg-[#0a0a0f] border border-[#222] rounded-[32px] w-full max-w-lg shadow-[0_25px_60px_rgba(0,0,0,0.9)] relative overflow-hidden transform scale-95 transition-transform duration-300">
            <!-- Top Gradient Accent -->
            <div class="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-brand-500 to-indigo-500 opacity-60"></div>
            
            <div class="p-8">
                <!-- Header -->
                <div class="flex justify-between items-start mb-8">
                    <div class="flex items-center space-x-5">
                        <div class="w-16 h-16 rounded-[20px] bg-[#13111a] border border-[#222] flex items-center justify-center flex-shrink-0 shadow-inner">
                            <i data-lucide="${template.lucideIcon}" class="w-8 h-8 text-brand-400"></i>
                        </div>
                        <div>
                            <h2 class="text-3xl font-extrabold text-cardTitle font-sans tracking-tight mb-1">${sub.name}</h2>
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-space">${sub.category}</span>
                        </div>
                    </div>
                    <button onclick="closeSubscriptionDetails()" class="p-2 text-slate-500 hover:text-cardTitle transition-colors bg-[#13111a] border border-[#222] rounded-full hover:bg-[#1a1723]">
                        <i data-lucide="x" class="w-5 h-5"></i>
                    </button>
                </div>
                
                <!-- Details Grid -->
                <div class="grid grid-cols-2 gap-4 mb-8">
                    <div class="bg-[#13111a] p-4 rounded-2xl border border-[#222] shadow-inner">
                        <p class="text-[10px] text-slate-500 uppercase tracking-widest font-space font-bold mb-1.5">Billing Cycle</p>
                        <p class="text-cardTitle font-bold font-sans text-sm">${sub.cycle.charAt(0).toUpperCase() + sub.cycle.slice(1)}</p>
                    </div>
                    <div class="bg-[#13111a] p-4 rounded-2xl border border-[#222] shadow-inner">
                        <p class="text-[10px] text-slate-500 uppercase tracking-widest font-space font-bold mb-1.5">Cost</p>
                        <p class="text-cardTitle font-bold font-sans text-sm">₹${sub.cost}</p>
                    </div>
                    <div class="bg-[#13111a] p-4 rounded-2xl border border-[#222] shadow-inner">
                        <p class="text-[10px] text-slate-500 uppercase tracking-widest font-space font-bold mb-1.5">Next Renewal</p>
                        <p class="text-cardTitle font-bold font-sans text-sm">${new Date(sub.nextRenewal).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                    <div class="bg-[#13111a] p-4 rounded-2xl border border-[#222] shadow-inner">
                        <p class="text-[10px] text-slate-500 uppercase tracking-widest font-space font-bold mb-1.5">Payment Method</p>
                        <p class="text-cardTitle font-bold font-sans text-sm truncate">${sub.payment}</p>
                    </div>
                </div>
                
                <!-- Action Buttons -->
                <div class="flex space-x-4">
                    <button class="flex-1 bg-[#13111a] hover:bg-[#1a1723] text-cardTitle border border-[#222] font-semibold text-sm py-4 rounded-2xl transition-all shadow-inner font-sans">
                        Modify Plan
                    </button>
                    <button class="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-bold text-sm py-4 rounded-2xl transition-all shadow-inner font-sans">
                        Cancel Subscription
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    lucide.createIcons();
    
    // Animate in
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modal.firstElementChild.classList.remove('scale-95');
    }, 10);
};

window.closeSubscriptionDetails = function() {
    const modal = document.getElementById('sub-detail-modal');
    if (modal) {
        modal.classList.add('opacity-0');
        modal.firstElementChild.classList.add('scale-95');
        setTimeout(() => modal.remove(), 300);
    }
};

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
    },
    crimson: {
        '--brand-500-rgb': '225 29 72',
        '--brand-600-rgb': '190 18 60',
        '--brand-700-rgb': '159 18 57',
        '--brand-900-rgb': '136 19 55',
        '--cosmic-400-rgb': '251 146 60',
        '--cosmic-500-rgb': '249 115 22',
        '--cosmic-600-rgb': '234 88 12',
        '--cosmic-900-rgb': '154 52 18',
        '--brand-rgb': '225, 29, 72',
        '--cosmic-rgb': '251, 146, 60',
        brandHex: '#e11d48',
        cosmicHex: '#fb923c'
    },
    luxury: {
        '--brand-500-rgb': '234 179 8',
        '--brand-600-rgb': '202 138 4',
        '--brand-700-rgb': '161 98 7',
        '--brand-900-rgb': '113 63 18',
        '--cosmic-400-rgb': '125 211 252',
        '--cosmic-500-rgb': '56 189 248',
        '--cosmic-600-rgb': '2 132 199',
        '--cosmic-900-rgb': '12 74 110',
        '--brand-rgb': '234, 179, 8',
        '--cosmic-rgb': '125, 211, 252',
        brandHex: '#eab308',
        cosmicHex: '#7dd3fc'
    }
};

// Categorized icon options for avatar icon picker
const AVATAR_ICONS = {
    People: [
        { id: 'user', label: 'Person', icon: 'user' },
        { id: 'user-round', label: 'User', icon: 'user-round' },
        { id: 'baby', label: 'Baby', icon: 'baby' },
        { id: 'glasses', label: 'Glasses', icon: 'glasses' },
        { id: 'smile', label: 'Happy', icon: 'smile' },
        { id: 'laugh', label: 'Laugh', icon: 'laugh' },
        { id: 'meh', label: 'Chill', icon: 'meh' },
        { id: 'crown', label: 'Crown', icon: 'crown' },
    ],
    Nature: [
        { id: 'tree-pine', label: 'Pine', icon: 'tree-pine' },
        { id: 'flower', label: 'Flower', icon: 'flower' },
        { id: 'flower-2', label: 'Bloom', icon: 'flower-2' },
        { id: 'leaf', label: 'Leaf', icon: 'leaf' },
        { id: 'sun', label: 'Sun', icon: 'sun' },
        { id: 'moon', label: 'Moon', icon: 'moon' },
        { id: 'cloud', label: 'Cloud', icon: 'cloud' },
        { id: 'mountain', label: 'Mountain', icon: 'mountain' },
    ],
    Vehicles: [
        { id: 'car', label: 'Car', icon: 'car' },
        { id: 'rocket', label: 'Rocket', icon: 'rocket' },
        { id: 'plane', label: 'Plane', icon: 'plane' },
        { id: 'bike', label: 'Bike', icon: 'bike' },
        { id: 'ship', label: 'Ship', icon: 'ship' },
        { id: 'train', label: 'Train', icon: 'train' },
        { id: 'bus', label: 'Bus', icon: 'bus' },
        { id: 'sailboat', label: 'Sail', icon: 'sailboat' },
    ],
    Space: [
        { id: 'sparkles', label: 'Sparkles', icon: 'sparkles' },
        { id: 'star', label: 'Star', icon: 'star' },
        { id: 'orbit', label: 'Orbit', icon: 'orbit' },
        { id: 'zap', label: 'Zap', icon: 'zap' },
        { id: 'flame', label: 'Flame', icon: 'flame' },
        { id: 'aperture', label: 'Lens', icon: 'aperture' },
        { id: 'atom', label: 'Atom', icon: 'atom' },
        { id: 'telescope', label: 'Scope', icon: 'telescope' },
    ],
    Objects: [
        { id: 'music', label: 'Music', icon: 'music' },
        { id: 'gamepad-2', label: 'Gaming', icon: 'gamepad-2' },
        { id: 'camera', label: 'Camera', icon: 'camera' },
        { id: 'headphones', label: 'Audio', icon: 'headphones' },
        { id: 'coffee', label: 'Coffee', icon: 'coffee' },
        { id: 'pizza', label: 'Pizza', icon: 'pizza' },
        { id: 'gem', label: 'Gem', icon: 'gem' },
        { id: 'shield', label: 'Shield', icon: 'shield' },
    ]
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
    },
    crimson: {
        name: 'Crimson',
        gradient: 'from-rose-500 to-red-700 hover:from-rose-400 hover:to-red-600 border-rose-400/30',
        glow: 'rgba(225, 29, 72, 0.25)',
        shadow: 'shadow-[0_0_20px_rgba(225,29,72,0.3)]',
        colorClass: 'text-rose-400 border-rose-500/20 bg-rose-950/20',
        icon: 'flame'
    },
    sapphire: {
        name: 'Sapphire',
        gradient: 'from-blue-400 to-indigo-600 hover:from-blue-300 hover:to-indigo-500 border-blue-400/30',
        glow: 'rgba(59, 130, 246, 0.25)',
        shadow: 'shadow-[0_0_20px_rgba(59,130,246,0.3)]',
        colorClass: 'text-blue-400 border-blue-500/20 bg-blue-950/20',
        icon: 'gem'
    },
    nova: {
        name: 'Nova',
        gradient: 'from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 border-cyan-400/30',
        glow: 'rgba(34, 211, 238, 0.25)',
        shadow: 'shadow-[0_0_20px_rgba(34,211,238,0.3)]',
        colorClass: 'text-cyan-400 border-cyan-500/20 bg-cyan-950/20',
        icon: 'hexagon'
    },
    quasar: {
        name: 'Quasar',
        gradient: 'from-orange-500 to-rose-600 hover:from-orange-400 hover:to-rose-500 border-orange-400/30',
        glow: 'rgba(249, 115, 22, 0.25)',
        shadow: 'shadow-[0_0_20px_rgba(249,115,22,0.3)]',
        colorClass: 'text-orange-400 border-orange-500/20 bg-orange-950/20',
        icon: 'target'
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
    renderPillNav();
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
        <!-- Account Settings Header -->
        <div class="mb-6">
            <h2 class="text-4xl font-extrabold text-cardTitle font-sans tracking-tight mb-2">Account Settings</h2>
            <p class="text-sm text-textMuted font-sans max-w-xl">Manage your profile, connected sources, and preferences from a unified control panel.</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            <!-- LEFT COLUMN: Profile info & System diagnostics -->
            <div class="lg:col-span-4 space-y-6">
                
                <!-- Profile details & Avatar customizer -->
                <div class="bg-glassBg border border-glassBorder rounded-3xl p-6 flex flex-col justify-between">
                    
                    <div class="text-center pb-6 border-b border-glassBorder relative z-10">
                        <div class="relative w-20 h-20 mx-auto mb-4">
                            <div id="account-avatar-ring" class="w-20 h-20 rounded-full bg-gradient-to-tr ${activeAvatarVibe.gradient} flex items-center justify-center text-cardTitle shadow-2xl border-2 ${activeAvatarVibe.gradient.split(' ').pop()}">
                                ${state.currentUser.avatarIcon 
                                    ? `<i id="account-large-avatar-icon" data-lucide="${state.currentUser.avatarIcon}" class="w-9 h-9"></i>`
                                    : `<span id="account-large-avatar-char" class="text-3xl font-black font-space">${(state.currentUser.name || 'U')[0].toUpperCase()}</span>`
                                }
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

                    <div class="pt-6 relative z-10 space-y-3">
                        <!-- Customise Profile Button -->
                        <button id="btn-open-avatar-modal" class="w-full bg-gradient-to-r from-brand-500/20 to-purple-500/20 border border-brand-500/40 hover:border-brand-500/70 hover:from-brand-500/30 hover:to-purple-500/30 text-brand-400 font-semibold text-xs py-3 rounded-xl transition-all flex items-center justify-center space-x-2 font-space group">
                            <i data-lucide="palette" class="w-4 h-4 group-hover:rotate-12 transition-transform"></i>
                            <span>Customise Profile</span>
                        </button>
                        <button onclick="triggerAccountReset()" class="w-full bg-inputBg border border-glassBorder hover:border-glassBorder text-cardTitle hover:text-cardTitle font-semibold text-xs py-3 rounded-xl transition-all flex items-center justify-center space-x-2 font-sans">
                            <i data-lucide="log-out" class="w-4 h-4 text-textMuted"></i>
                            <span>Log Out</span>
                        </button>
                        <button onclick="triggerDeleteAccount()" class="w-full bg-red-500/10 border border-red-500/25 hover:bg-red-550 hover:text-cardTitle text-red-400 font-semibold text-xs py-3 rounded-xl transition-all flex items-center justify-center space-x-2 font-sans">
                            <i data-lucide="user-x" class="w-4 h-4"></i>
                            <span>Delete Account</span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- RIGHT COLUMN: Account settings forms & Card visualizer -->
            <div class="lg:col-span-8 space-y-6">
                
                <!-- Connected Sources -->
                <div class="bg-glassBg border border-glassBorder rounded-3xl p-6">
                    <div class="flex items-center space-x-3 mb-6">
                        <div class="p-3 bg-brand-500/10 text-brand-400 border border-brand-500/20 rounded-2xl flex-shrink-0">
                            <i data-lucide="link" class="w-6 h-6"></i>
                        </div>
                        <div>
                            <h3 class="text-lg font-bold text-cardTitle font-sans tracking-tight">Connected Sources</h3>
                            <p class="text-xs text-textMuted font-sans">Active phone numbers and email accounts used to aggregate billing notifications.</p>
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


                <!-- Theme Customizer & System Settings -->
                <div class="bg-glassBg/40 border border-glassBorder/60 backdrop-blur-3xl rounded-[32px] p-8 shadow-[0_15px_50px_rgba(0,0,0,0.4)] relative overflow-hidden group hover:border-brand-500/30 transition-all duration-500">
                    <!-- Subtle Glow -->
                    <div class="absolute -top-24 -right-24 w-48 h-48 bg-brand-500/10 blur-[60px] rounded-full pointer-events-none transition-all group-hover:bg-brand-500/20"></div>
                    
                    <div class="flex items-center space-x-4 mb-8 relative z-10">
                        <div class="p-3 bg-gradient-to-br from-brand-500/20 to-purple-500/20 border border-brand-500/30 text-brand-400 rounded-2xl shadow-[0_0_15px_rgba(236,72,153,0.15)] flex-shrink-0">
                            <i data-lucide="palette" class="w-6 h-6"></i>
                        </div>
                        <div>
                            <h3 class="text-xl font-bold text-cardTitle font-space tracking-tight">Aesthetic Customization & Core Settings</h3>
                            <p class="text-xs text-textMuted font-sans mt-1">Personalize visual themes, financial metrics, and intelligent alert protocols.</p>
                        </div>
                    </div>

                    <div class="space-y-8 relative z-10">
                        <!-- Theme custom swatch lists -->
                        <div>
                            <label class="block text-[10px] font-bold text-brand-400/80 uppercase tracking-widest mb-4 font-space">Neural Color Schemes</label>
                            <div class="grid grid-cols-3 gap-3">
                                ${Object.keys(THEMES).map(themeName => {
                                    const isSelected = state.preferences.theme === themeName;
                                    const colors = THEMES[themeName];
                                    const displayName = themeName.charAt(0).toUpperCase() + themeName.slice(1);
                                    return `
                                        <button class="theme-select-btn group relative flex flex-col items-center gap-2.5 p-3 rounded-2xl border ${
                                            isSelected 
                                            ? 'border-white/40 bg-white/5 shadow-[0_0_20px_rgba(255,255,255,0.08)]' 
                                            : 'border-glassBorder/40 bg-glassBg/30 hover:border-white/20 hover:bg-white/5'
                                        } transition-all duration-300 focus:outline-none overflow-hidden" data-theme="${themeName}">
                                            <!-- Animated gradient swatch -->
                                            <div class="relative w-12 h-12 rounded-full flex-shrink-0" style="background: conic-gradient(from 135deg, ${colors.brandHex}, ${colors.cosmicHex}, ${colors.brandHex})">
                                                <div class="absolute inset-0.5 rounded-full" style="background: conic-gradient(from 135deg, ${colors.brandHex}, ${colors.cosmicHex}); filter: blur(1px);"></div>
                                                ${isSelected ? `<div class="absolute inset-0 rounded-full flex items-center justify-center"><span class="w-3 h-3 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)]"></span></div>` : ''}
                                            </div>
                                            <!-- Color band preview -->
                                            <div class="flex gap-1">
                                                <div class="w-3 h-1.5 rounded-full" style="background:${colors.brandHex}"></div>
                                                <div class="w-3 h-1.5 rounded-full" style="background:${colors.cosmicHex}"></div>
                                            </div>
                                            <span class="text-[10px] ${ isSelected ? 'text-white font-bold' : 'text-textMuted group-hover:text-slate-300' } font-space transition-colors">${displayName}</span>
                                            <!-- Selected ring glow -->
                                            ${isSelected ? `<div class="absolute inset-0 rounded-2xl border border-white/20 shadow-[inset_0_0_20px_rgba(255,255,255,0.04)] pointer-events-none"></div>` : ''}
                                        </button>
                                    `;
                                }).join('')}
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-glassBorder/50">
                            <!-- Currency -->
                            <div class="space-y-3">
                                <label class="block text-[10px] font-bold text-brand-400/80 uppercase tracking-widest font-space">Global Currency Standard</label>
                                <div class="relative group/select">
                                    <select id="pref-currency-select" class="w-full bg-[#13111a]/80 border border-glassBorder hover:border-brand-500/50 focus:border-brand-500 focus:ring-1 focus:ring-brand-500/50 rounded-2xl py-3.5 px-4 text-sm text-cardTitle focus:outline-none transition-all appearance-none cursor-pointer">
                                        <option value="INR" ${state.preferences.currency === 'INR' ? 'selected' : ''}>INR (₹) - Indian Rupee</option>
                                        <option value="USD" ${state.preferences.currency === 'USD' ? 'selected' : ''}>USD ($) - US Dollar</option>
                                        <option value="EUR" ${state.preferences.currency === 'EUR' ? 'selected' : ''}>EUR (€) - Euro</option>
                                        <option value="GBP" ${state.preferences.currency === 'GBP' ? 'selected' : ''}>GBP (£) - British Pound</option>
                                    </select>
                                    <div class="absolute inset-y-0 right-4 flex items-center pointer-events-none text-textMuted group-hover/select:text-brand-400 transition-colors">
                                        <i data-lucide="chevron-down" class="w-4 h-4"></i>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Notifications checkboxes -->
                            <div class="space-y-5 font-sans">
                                <label class="block text-[10px] font-bold text-brand-400/80 uppercase tracking-widest font-space mb-2">Intelligent Alerts</label>
                                
                                <!-- Alert 1 -->
                                <label class="flex items-center cursor-pointer select-none group/toggle">
                                    <div class="relative flex-shrink-0">
                                        <input type="checkbox" id="chk-billing-alerts" ${state.preferences.billingAlerts ? 'checked' : ''} class="sr-only peer">
                                        <div class="w-11 h-6 bg-[#13111a] border border-glassBorder rounded-full transition-all duration-300 peer-checked:bg-gradient-to-r peer-checked:from-brand-500 peer-checked:to-purple-500 peer-checked:border-transparent peer-checked:shadow-[0_0_15px_rgba(236,72,153,0.4)] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-slate-300 after:rounded-full after:h-5 after:w-5 after:transition-all after:duration-300 peer-checked:after:translate-x-5 peer-checked:after:border-white"></div>
                                    </div>
                                    <span class="ml-4 text-textMuted group-hover/toggle:text-cardTitle transition-colors text-xs font-medium leading-tight">Priority Billing Renewal Warnings (5-Day Threshold)</span>
                                </label>

                                <!-- Alert 2 -->
                                <label class="flex items-center cursor-pointer select-none group/toggle">
                                    <div class="relative flex-shrink-0">
                                        <input type="checkbox" id="chk-sms-alerts" ${state.preferences.smsAlerts ? 'checked' : ''} class="sr-only peer">
                                        <div class="w-11 h-6 bg-[#13111a] border border-glassBorder rounded-full transition-all duration-300 peer-checked:bg-gradient-to-r peer-checked:from-brand-500 peer-checked:to-purple-500 peer-checked:border-transparent peer-checked:shadow-[0_0_15px_rgba(236,72,153,0.4)] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-slate-300 after:rounded-full after:h-5 after:w-5 after:transition-all after:duration-300 peer-checked:after:translate-x-5 peer-checked:after:border-white"></div>
                                    </div>
                                    <span class="ml-4 text-textMuted group-hover/toggle:text-cardTitle transition-colors text-xs font-medium leading-tight">Real-time SMS Pulse on Subscription Matches</span>
                                </label>

                                <!-- Alert 3 -->
                                <label class="flex items-center cursor-pointer select-none group/toggle">
                                    <div class="relative flex-shrink-0">
                                        <input type="checkbox" id="chk-monthly-reports" ${state.preferences.monthlyReports ? 'checked' : ''} class="sr-only peer">
                                        <div class="w-11 h-6 bg-[#13111a] border border-glassBorder rounded-full transition-all duration-300 peer-checked:bg-gradient-to-r peer-checked:from-brand-500 peer-checked:to-purple-500 peer-checked:border-transparent peer-checked:shadow-[0_0_15px_rgba(236,72,153,0.4)] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-slate-300 after:rounded-full after:h-5 after:w-5 after:transition-all after:duration-300 peer-checked:after:translate-x-5 peer-checked:after:border-white"></div>
                                    </div>
                                    <span class="ml-4 text-textMuted group-hover/toggle:text-cardTitle transition-colors text-xs font-medium leading-tight">Comprehensive Monthly Spend & Analytics Brief</span>
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

    // ---- AVATAR CUSTOMISE MODAL ----
    let pendingVibe = state.currentUser.avatar || 'nebula';
    let pendingIcon = state.currentUser.avatarIcon || null;

    const curAvatar = state.currentUser.avatar || 'nebula';
    const activeAvatarVibe = AVATAR_VIBES[curAvatar] || AVATAR_VIBES.nebula;

    // Build modal HTML and inject into body
    const buildModalHTML = () => {
        const av = AVATAR_VIBES[pendingVibe] || AVATAR_VIBES.nebula;
        const firstChar = (state.currentUser.name || 'U')[0].toUpperCase();
        const vibeKeys = Object.keys(AVATAR_VIBES);
        const iconCategories = Object.keys(AVATAR_ICONS);

        const vibeCards = vibeKeys.map(key => {
            const v = AVATAR_VIBES[key];
            const active = pendingVibe === key;
            const borderColor = active ? 'rgba(244,114,182,0.6)' : 'rgba(255,255,255,0.06)';
            const bg = active ? 'rgba(236,72,153,0.08)' : 'rgba(255,255,255,0.02)';
            const shadow = active ? '0 0 28px rgba(236,72,153,0.22),inset 0 0 30px rgba(236,72,153,0.04)' : 'none';
            const dot = active ? '<div style="position:absolute;top:8px;right:8px;width:7px;height:7px;border-radius:50%;background:#f472b6;box-shadow:0 0 8px #f472b6,0 0 20px rgba(244,114,182,0.6);"></div>' : '';
            const nameColor = active ? '#f472b6' : '#94a3b8';
            const nameWeight = active ? '700' : '500';
            return '<button class="modal-vibe-btn" data-vibe="' + key + '" style="position:relative;display:flex;flex-direction:column;align-items:center;gap:0;padding:0;border-radius:18px;border:1px solid ' + borderColor + ';background:' + bg + ';cursor:pointer;overflow:hidden;transition:all 0.25s;box-shadow:' + shadow + ';">' +
                '<div style="width:100%;height:76px;background:linear-gradient(150deg,rgba(255,255,255,0.04) 0%,rgba(0,0,0,0.3) 100%);display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;">' +
                    '<div class="w-12 h-12 rounded-full bg-gradient-to-tr ' + v.gradient + ' flex items-center justify-center" style="box-shadow:0 4px 16px rgba(0,0,0,0.5);z-index:1;">' +
                        '<i data-lucide="' + v.icon + '" class="w-5 h-5 text-white"></i>' +
                    '</div>' +
                    dot +
                '</div>' +
                '<div style="padding:9px 8px 11px;text-align:center;width:100%;border-top:1px solid rgba(255,255,255,0.04);">' +
                    '<span style="font-size:11px;font-weight:' + nameWeight + ';color:' + nameColor + ';font-family:Space Grotesk,sans-serif;">' + v.name + '</span>' +
                '</div>' +
            '</button>';
        }).join('');

        const iconGrid = iconCategories.map(category => {
            const btns = AVATAR_ICONS[category].map(opt => {
                const isActive = pendingIcon === opt.id;
                const borderColor = isActive ? 'rgba(244,114,182,0.6)' : 'rgba(255,255,255,0.06)';
                const bg = isActive ? 'linear-gradient(135deg,rgba(236,72,153,0.18),rgba(139,92,246,0.12))' : 'rgba(255,255,255,0.02)';
                const shadow = isActive ? '0 0 14px rgba(236,72,153,0.3),inset 0 1px 0 rgba(255,255,255,0.1)' : 'none';
                const transform = isActive ? 'scale(1.06)' : 'scale(1)';
                const iconColor = isActive ? '#f472b6' : '#475569';
                const labelColor = isActive ? '#f472b6' : '#475569';
                const labelWeight = isActive ? '700' : '500';
                return '<button class="modal-icon-btn" data-icon="' + opt.id + '" style="display:flex;flex-direction:column;align-items:center;gap:6px;padding:12px 4px;border-radius:14px;border:1px solid ' + borderColor + ';background:' + bg + ';cursor:pointer;transition:all 0.18s;box-shadow:' + shadow + ';transform:' + transform + ';">' +
                    '<i data-lucide="' + opt.icon + '" style="width:20px;height:20px;color:' + iconColor + ';"></i>' +
                    '<span style="font-size:8px;font-weight:' + labelWeight + ';color:' + labelColor + ';font-family:Space Grotesk,sans-serif;line-height:1;">' + opt.label + '</span>' +
                '</button>';
            }).join('');
            return '<div style="margin-bottom:20px;">' +
                '<div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;">' +
                    '<div style="height:1px;width:16px;background:linear-gradient(90deg,rgba(244,114,182,0.5),transparent);"></div>' +
                    '<p style="font-size:8px;font-weight:700;color:rgba(244,114,182,0.5);text-transform:uppercase;letter-spacing:0.15em;margin:0;">' + category + '</p>' +
                    '<div style="height:1px;flex:1;background:linear-gradient(90deg,rgba(244,114,182,0.1),transparent);"></div>' +
                '</div>' +
                '<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:7px;">' + btns + '</div>' +
            '</div>';
        }).join('');

        const previewInner = pendingIcon
            ? '<i data-lucide="' + pendingIcon + '" class="w-11 h-11"></i>'
            : '<span style="font-size:36px;font-weight:900;font-family:Space Grotesk,sans-serif;">' + firstChar + '</span>';

        return `
        <div id="avatar-modal" style="position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px;font-family:'Space Grotesk',sans-serif;">
            <div id="avatar-modal-backdrop" style="position:absolute;inset:0;background:rgba(2,1,10,0.94);backdrop-filter:blur(24px) saturate(160%);"></div>
            <div style="position:relative;z-index:1;width:100%;max-width:780px;background:linear-gradient(145deg,#0e0c1a 0%,#0b0917 50%,#0d0b1c 100%);border-radius:28px;box-shadow:0 40px 100px rgba(0,0,0,0.9),0 0 0 1px rgba(255,255,255,0.07),inset 0 1px 0 rgba(255,255,255,0.07);display:flex;flex-direction:column;max-height:90vh;overflow:hidden;">
                <div style="height:2px;background:linear-gradient(90deg,transparent 0%,rgba(236,72,153,0.7) 25%,rgba(139,92,246,0.9) 50%,rgba(59,130,246,0.7) 75%,transparent 100%);flex-shrink:0;"></div>
                <div style="display:flex;align-items:center;justify-content:space-between;padding:20px 28px 18px;flex-shrink:0;">
                    <div style="display:flex;align-items:center;gap:14px;">
                        <div style="width:44px;height:44px;border-radius:14px;background:linear-gradient(135deg,rgba(236,72,153,0.2),rgba(139,92,246,0.2));border:1px solid rgba(236,72,153,0.3);display:flex;align-items:center;justify-content:center;box-shadow:0 0 20px rgba(236,72,153,0.2),inset 0 1px 0 rgba(255,255,255,0.1);">
                            <i data-lucide="sparkles" style="width:20px;height:20px;color:#f472b6;"></i>
                        </div>
                        <div>
                            <div style="display:flex;align-items:center;gap:8px;">
                                <h3 style="font-size:18px;font-weight:800;color:#fff;margin:0;letter-spacing:-0.3px;">Customise Profile</h3>
                                <span style="font-size:9px;font-weight:700;color:#f472b6;background:rgba(236,72,153,0.15);border:1px solid rgba(236,72,153,0.3);padding:2px 7px;border-radius:20px;letter-spacing:0.05em;text-transform:uppercase;">LIVE</span>
                            </div>
                            <p style="font-size:11px;color:#64748b;margin:3px 0 0;letter-spacing:0.01em;">Shape your avatar with a colour vibe and personal icon</p>
                        </div>
                    </div>
                    <button id="avatar-modal-close" style="width:36px;height:36px;display:flex;align-items:center;justify-content:center;border-radius:12px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);color:#64748b;cursor:pointer;">
                        <i data-lucide="x" style="width:16px;height:16px;"></i>
                    </button>
                </div>
                <div style="height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.06),transparent);margin:0 28px;flex-shrink:0;"></div>
                <div style="display:flex;flex:1;overflow:hidden;min-height:0;">
                    <!-- Preview column -->
                    <div style="width:210px;flex-shrink:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;padding:28px 20px;border-right:1px solid rgba(255,255,255,0.05);background:rgba(4,3,14,0.6);position:relative;">
                        <div style="position:absolute;inset:0;background-image:radial-gradient(rgba(255,255,255,0.012) 1px,transparent 1px);background-size:22px 22px;pointer-events:none;"></div>
                        <div style="font-size:8px;color:#475569;text-transform:uppercase;letter-spacing:0.15em;font-weight:700;position:relative;">Live Preview</div>
                        <div style="position:relative;">
                            <div style="position:absolute;inset:-6px;border-radius:50%;background:conic-gradient(from 0deg,rgba(236,72,153,0.35),rgba(139,92,246,0.35),rgba(59,130,246,0.35),rgba(236,72,153,0.35));filter:blur(6px);opacity:0.7;"></div>
                            <div id="modal-avatar-ring" class="w-24 h-24 rounded-full bg-gradient-to-tr ${av.gradient} flex items-center justify-center text-white border-2 border-white/10" style="position:relative;box-shadow:0 0 40px rgba(236,72,153,0.2);">
                                ${previewInner}
                            </div>
                        </div>
                        <div style="text-align:center;position:relative;">
                            <p style="font-size:14px;font-weight:800;color:#fff;margin:0;">${state.currentUser.name || 'User'}</p>
                            <p id="modal-preview-vibe" style="font-size:9px;font-weight:700;color:#f472b6;text-transform:uppercase;letter-spacing:0.12em;margin:6px 0 0;background:rgba(236,72,153,0.1);border:1px solid rgba(236,72,153,0.2);padding:3px 10px;border-radius:20px;display:inline-block;">${av.name}</p>
                        </div>
                        <button id="avatar-modal-apply" style="width:100%;background:linear-gradient(135deg,#be185d,#7c3aed);color:#fff;font-weight:800;font-size:12px;padding:12px;border-radius:14px;border:none;cursor:pointer;font-family:'Space Grotesk',sans-serif;box-shadow:0 6px 24px rgba(190,24,93,0.4),inset 0 1px 0 rgba(255,255,255,0.15);letter-spacing:0.04em;">✦ Apply Changes</button>
                        <button id="avatar-modal-clear" style="width:100%;background:rgba(255,255,255,0.02);border:1px dashed rgba(255,255,255,0.1);color:#475569;font-size:10px;padding:9px;border-radius:12px;cursor:pointer;font-family:'Space Grotesk',sans-serif;">× Clear Icon</button>
                    </div>
                    <!-- Options panel -->
                    <div style="flex:1;overflow-y:auto;min-width:0;" class="scrollbar-thin">
                        <div style="position:sticky;top:0;z-index:10;padding:16px 24px 12px;background:linear-gradient(to bottom,#0e0c1a 60%,transparent);backdrop-filter:blur(10px);">
                            <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:14px;padding:4px;">
                                <button id="modal-tab-vibe" style="padding:9px 12px;border-radius:10px;background:linear-gradient(135deg,rgba(236,72,153,0.25),rgba(139,92,246,0.25));color:#f472b6;border:1px solid rgba(236,72,153,0.35);cursor:pointer;font-family:'Space Grotesk',sans-serif;font-size:11px;font-weight:700;letter-spacing:0.04em;">🎨 Colour Vibe</button>
                                <button id="modal-tab-icon" style="padding:9px 12px;border-radius:10px;background:none;color:#475569;border:none;cursor:pointer;font-family:'Space Grotesk',sans-serif;font-size:11px;font-weight:600;">🪄 Avatar Icon</button>
                            </div>
                        </div>
                        <div id="modal-panel-vibe" style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;padding:4px 24px 24px;">
                            ${vibeCards}
                        </div>
                        <div id="modal-panel-icon" style="display:none;padding:4px 24px 24px;">
                            ${iconGrid}
                        </div>
                    </div>
                </div>
                <div style="height:1px;background:linear-gradient(90deg,transparent,rgba(139,92,246,0.2),transparent);flex-shrink:0;"></div>
            </div>
        </div>`;
    };


    const openModal = () => {
        pendingVibe = state.currentUser.avatar || 'nebula';
        pendingIcon = state.currentUser.avatarIcon || null;
        // Remove any existing modal
        const existing = document.getElementById('avatar-modal');
        if (existing) existing.remove();
        // Inject into body
        const wrapper = document.createElement('div');
        wrapper.innerHTML = buildModalHTML();
        const modalEl = wrapper.firstElementChild;
        document.body.appendChild(modalEl);
        document.body.style.overflow = 'hidden';
        lucide.createIcons();
        bindModalEvents();
    };

    const closeModal = () => {
        const modalEl = document.getElementById('avatar-modal');
        if (modalEl) modalEl.remove();
        document.body.style.overflow = '';
    };

    const openBtn = document.getElementById('btn-open-avatar-modal');
    if (openBtn) openBtn.addEventListener('click', openModal);

    function bindModalEvents() {
        const closeBtn = document.getElementById('avatar-modal-close');
        const backdrop = document.getElementById('avatar-modal-backdrop');
        const applyBtn = document.getElementById('avatar-modal-apply');
        const clearBtn = document.getElementById('avatar-modal-clear');
        const modalTabVibe = document.getElementById('modal-tab-vibe');
        const modalTabIcon = document.getElementById('modal-tab-icon');
        const modalPanelVibe = document.getElementById('modal-panel-vibe');
        const modalPanelIcon = document.getElementById('modal-panel-icon');

        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        if (backdrop) backdrop.addEventListener('click', closeModal);

        // Tab switching
        if (modalTabVibe && modalTabIcon) {
            modalTabVibe.addEventListener('click', () => {
                modalPanelVibe.style.display = 'grid';
                modalPanelIcon.style.display = 'none';
                modalTabVibe.style.cssText = 'flex:1;font-size:10px;font-weight:700;padding:6px;border-radius:8px;background:rgba(236,72,153,0.2);color:#f472b6;border:1px solid rgba(236,72,153,0.3);cursor:pointer;font-family:Space Grotesk,sans-serif;';
                modalTabIcon.style.cssText = 'flex:1;font-size:10px;font-weight:700;padding:6px;border-radius:8px;background:none;color:#64748b;border:none;cursor:pointer;font-family:Space Grotesk,sans-serif;';
            });
            modalTabIcon.addEventListener('click', () => {
                modalPanelVibe.style.display = 'none';
                modalPanelIcon.style.display = 'block';
                modalTabIcon.style.cssText = 'flex:1;font-size:10px;font-weight:700;padding:6px;border-radius:8px;background:rgba(236,72,153,0.2);color:#f472b6;border:1px solid rgba(236,72,153,0.3);cursor:pointer;font-family:Space Grotesk,sans-serif;';
                modalTabVibe.style.cssText = 'flex:1;font-size:10px;font-weight:700;padding:6px;border-radius:8px;background:none;color:#64748b;border:none;cursor:pointer;font-family:Space Grotesk,sans-serif;';
            });
        }

        // Update preview
        const updatePreview = () => {
            const ring = document.getElementById('modal-avatar-ring');
            if (!ring) return;
            const vibe = AVATAR_VIBES[pendingVibe] || AVATAR_VIBES.nebula;
            ring.className = `w-24 h-24 rounded-full bg-gradient-to-tr ${vibe.gradient} flex items-center justify-center text-white shadow-[0_0_40px_rgba(236,72,153,0.3)] border-2 border-white/10`;
            ring.innerHTML = pendingIcon
                ? `<i data-lucide="${pendingIcon}" class="w-11 h-11"></i>`
                : `<span class="text-4xl font-black font-space">${(state.currentUser.name || 'U')[0].toUpperCase()}</span>`;
            lucide.createIcons({ nodes: [ring] });
            const vibeLabel = document.getElementById('modal-preview-vibe');
            if (vibeLabel) vibeLabel.textContent = vibe.name;
        };

        // Vibe buttons
        document.querySelectorAll('.modal-vibe-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                pendingVibe = btn.getAttribute('data-vibe');
                updatePreview();
                document.querySelectorAll('.modal-vibe-btn').forEach(b => {
                    const isNow = b.getAttribute('data-vibe') === pendingVibe;
                    b.style.border = `1px solid ${isNow ? 'rgba(236,72,153,0.6)' : 'rgba(255,255,255,0.08)'}`;
                    b.style.background = isNow ? 'rgba(236,72,153,0.1)' : 'rgba(255,255,255,0.02)';
                });
            });
        });

        // Icon buttons
        document.querySelectorAll('.modal-icon-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                pendingIcon = btn.getAttribute('data-icon');
                updatePreview();
                document.querySelectorAll('.modal-icon-btn').forEach(b => {
                    const isNow = b.getAttribute('data-icon') === pendingIcon;
                    b.style.border = `1px solid ${isNow ? 'rgba(236,72,153,0.7)' : 'rgba(255,255,255,0.08)'}`;
                    b.style.background = isNow ? 'rgba(236,72,153,0.18)' : 'rgba(255,255,255,0.02)';
                    b.style.boxShadow = isNow ? '0 0 12px rgba(236,72,153,0.35)' : 'none';
                    b.style.transform = isNow ? 'scale(1.06)' : 'scale(1)';
                    // Lucide replaces <i> with <svg> — target both
                    const iconEl = b.querySelector('svg') || b.querySelector('i');
                    if (iconEl) iconEl.style.color = isNow ? '#f472b6' : '#64748b';
                    const labelEl = b.querySelector('span');
                    if (labelEl) labelEl.style.color = isNow ? '#f472b6' : '#64748b';
                });
            });
        });

        // Clear icon
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                pendingIcon = null;
                updatePreview();
                document.querySelectorAll('.modal-icon-btn').forEach(b => {
                    b.style.border = '1px solid rgba(255,255,255,0.08)';
                    b.style.background = 'rgba(255,255,255,0.02)';
                });
            });
        }

        // Apply
        if (applyBtn) {
            applyBtn.addEventListener('click', () => {
                state.currentUser.avatar = pendingVibe;
                state.currentUser.avatarIcon = pendingIcon;
                saveStateToStorage();
                // Sync account avatar card
                const ring = document.getElementById('account-avatar-ring');
                if (ring) {
                    const vibe = AVATAR_VIBES[pendingVibe] || AVATAR_VIBES.nebula;
                    ring.className = `w-20 h-20 rounded-full bg-gradient-to-tr ${vibe.gradient} flex items-center justify-center text-cardTitle shadow-2xl border-2 border-white/10`;
                    ring.innerHTML = pendingIcon
                        ? `<i data-lucide="${pendingIcon}" class="w-9 h-9"></i>`
                        : `<span id="account-large-avatar-char" class="text-3xl font-black font-space">${(state.currentUser.name || 'U')[0].toUpperCase()}</span>`;
                    lucide.createIcons({ nodes: [ring] });
                }
                syncAvatarUI();
                closeModal();
            });
        }
    }


    if (inputProfileName) {
        inputProfileName.addEventListener('blur', saveProfile);
        inputProfileName.addEventListener('input', (e) => {
            const h3 = e.target.closest('.bg-glassBg').querySelector('h3');
            const newName = e.target.value.trim() || 'User';
            const firstChar = newName[0].toUpperCase();
            
            if (h3) h3.innerText = newName;
            
            // Sync user large avatar character in Account tab
            const avatarChar = document.getElementById('account-large-avatar-char');
            if (avatarChar) avatarChar.innerText = firstChar;
            
            // Sync PillNav small avatar character
            const pillnavAvatar = document.getElementById('pillnav-logo-avatar');
            if (pillnavAvatar) pillnavAvatar.innerText = firstChar;
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
            // Update highlight states in-place without full re-render
            document.querySelectorAll('.theme-select-btn').forEach(b => {
                const isNow = b.getAttribute('data-theme') === themeChoice;
                const colors = THEMES[themeChoice];
                if (isNow) {
                    b.className = b.className
                        .replace('border-glassBorder/40', 'border-white/40')
                        .replace('bg-glassBg/30', 'bg-white/5');
                    b.style.border = '1px solid rgba(255,255,255,0.4)';
                    b.style.background = 'rgba(255,255,255,0.06)';
                    b.style.boxShadow = `0 0 30px ${colors.brandHex}40, 0 0 0 1px rgba(255,255,255,0.15)`;
                } else {
                    b.style.border = '1px solid rgba(255,255,255,0.06)';
                    b.style.background = 'rgba(255,255,255,0.02)';
                    b.style.boxShadow = 'none';
                }
            });
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
        if (toggleLabel) toggleLabel.innerText = "New to AIOManager?";
        if (toggleBtn) toggleBtn.innerText = "Create Account";
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



// ==========================================
// EVENTS LISTENERS SETUP
// ==========================================
function setupEventListeners() {


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
