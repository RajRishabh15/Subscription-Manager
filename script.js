// SubEasy Subscription Manager — Script

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

    // Check mock redirect (only used when Supabase is NOT configured)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('mock_login') === 'gmail') {
        const mockEmail = urlParams.get('mock_email') || 'mock.user@gmail.com';
        const mockName = urlParams.get('mock_name') || '';
        const newUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
        if (savedAuthMode === 'signup') {
            showRegisterSetup(mockName, mockEmail);
        } else {
            const registeredUsers = JSON.parse(localStorage.getItem('subsentry_registered_users') || '[]');
            const isRegistered = registeredUsers.some(u => u.email === mockEmail);
            if (isRegistered) {
                startScanning(null, mockEmail);
            } else {
                alert(`The account ${mockEmail} is not registered. Please switch to Sign Up mode to register first.`);
                initAppView();
            }
        }
        return;
    }

    // Check live Supabase session (returned from real Google OAuth redirect)
    if (isSupabaseConfigured) {
        try {
            const { data: { session } } = await supabaseClient.auth.getSession();
            if (session && session.user) {
                const email = session.user.email;
                // Pull name from Google's user_metadata if available
                const googleName = session.user.user_metadata?.full_name
                    || session.user.user_metadata?.name
                    || '';

                const registeredUsers = JSON.parse(localStorage.getItem('subsentry_registered_users') || '[]');
                if (!registeredUsers.some(u => u.email === email)) {
                    registeredUsers.push({ name: googleName || email.split('@')[0], email: email, phone: '' });
                    localStorage.setItem('subsentry_registered_users', JSON.stringify(registeredUsers));
                }
                startScanning(null, email);
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
    // Seed registered users list if empty, or ensure both mock users exist
    let registeredUsers = JSON.parse(localStorage.getItem('subsentry_registered_users') || '[]');
    const defaultUsers = [
        { name: 'Rishabh Raj', phone: '9876543210', email: 'rishabh.raj@gmail.com' },
        { name: 'John Doe', phone: '9876543211', email: 'john.doe@gmail.com' }
    ];
    let updated = false;
    defaultUsers.forEach(du => {
        if (!registeredUsers.find(u => u.email === du.email)) {
            registeredUsers.push(du);
            updated = true;
        }
    });
    if (updated) {
        localStorage.setItem('subsentry_registered_users', JSON.stringify(registeredUsers));
    }

    const savedState = sessionStorage.getItem('subsentry_state');
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
            console.error("Failed to parse stored SubEasy state:", e);
        }
    }
}

// Save state to local storage + trigger cloud sync
function saveStateToStorage() {
    sessionStorage.setItem('subsentry_state', JSON.stringify(state));
    // Immediately show "Syncing..." if on home tab
    if (typeof showSyncIndicator === 'function') showSyncIndicator(false, true);
    
    // Debounced cloud sync: waits 1.5s after last change before uploading
    clearTimeout(window._cloudSyncDebounce);
    window._cloudSyncDebounce = setTimeout(() => {
        syncToCloud();
    }, 1500);
}

// Initialize layout views based on login state
function initAppView() {
    const scanView = document.getElementById('scan-view');
    const dashboardView = document.getElementById('dashboard-view');
    
    // Apply theme variables immediately
    applyTheme(state.preferences.theme || 'cosmic');
    
    const isDashboardPage = window.location.pathname.includes('dashboard.html');
    const isIndexPage = window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/');
    const isLoginPage = window.location.pathname.includes('login.html');

    if (state.isLoggedIn) {
        if (isIndexPage || isLoginPage) {
            let basePath = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);
            if (basePath === '') basePath = '/';
            window.location.href = basePath + 'dashboard.html';
            return;
        }

        document.documentElement.classList.add('is-logged-in');
        if (scanView) scanView.classList.add('hidden');
        if (dashboardView) dashboardView.classList.remove('hidden');
        
        const loginBg = document.getElementById('login-glitch-bg');
        if (loginBg) loginBg.classList.add('hidden');
        
        const snowBg = document.getElementById('dashboard-snow-bg');
        if (snowBg) snowBg.classList.remove('hidden');
        
        // Update user avatar elements
        syncAvatarUI();
        
        switchTab('home');
    } else {
        if (isDashboardPage) {
            let basePath = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);
            if (basePath === '') basePath = '/';
            window.location.href = basePath + 'login.html';
            return;
        }

        document.documentElement.classList.remove('is-logged-in');
        if (scanView) scanView.classList.remove('hidden');
        if (dashboardView) dashboardView.classList.add('hidden');
        
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
            glitchSpeed: 40,
            centerVignette: true,
            outerVignette: false,
            smooth: true,
            glitchColors: ["#022c22", "#14b8a6", "#38bdf8"]
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
            glitchColors: ["#022c22", "#14b8a6", "#38bdf8"]
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
            if (tabName === 'scan') {
                // SubEasy site icon = re-scan mailbox for new subscriptions
                if (state.isLoggedIn && state.currentUser.email) {
                    startScanning(state.currentUser.phone || null, state.currentUser.email);
                } else {
                    switchTab('home');
                }
            } else {
                switchTab(tabName);
            }
        },
        initialLoadAnimation: false
    });

    // Style the left profile avatar button inside PillNav
    const avatarEl = document.getElementById('pillnav-logo-avatar');
    if (avatarEl) {
        const activeAvatarVibe = AVATAR_VIBES[avatarName] || AVATAR_VIBES.nebula;
        avatarEl.style.background = '';
        avatarEl.className = `w-full h-full rounded-full flex items-center justify-center text-xs font-black font-space select-none bg-gradient-to-tr ${activeAvatarVibe.gradient}`;
        if (state.currentUser.avatarBase64) {
            avatarEl.innerHTML = `<img src="${state.currentUser.avatarBase64}" class="w-full h-full object-cover rounded-full">`;
        } else if (state.currentUser.avatarIcon) {
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

    // Update mobile bottom nav pill highlighting
    document.querySelectorAll('.tab-btn-mobile').forEach(btn => {
        if (btn.getAttribute('data-tab') === tabName) {
            btn.classList.add('active-pill-mobile', 'text-white');
            btn.classList.remove('text-slate-400', 'text-textMuted');
        } else {
            btn.classList.remove('active-pill-mobile', 'text-white');
            btn.classList.add('text-slate-400');
        }
    });

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
    const statusEl = document.getElementById('login-progress-status');
    const barEl = document.getElementById('login-progress-bar');
    const pctEl = document.getElementById('login-progress-pct');
    const detailEl = document.getElementById('scan-terminal-detail');

    if (scanView) scanView.classList.add('hidden');
    if (progressView) {
        progressView.classList.remove('hidden');
        lucide.createIcons();
        
        // Reset status messages
        if (statusEl) statusEl.innerText = 'STABILIZING QUANTUM GRID VECTORS...';
        if (detailEl) detailEl.innerText = 'MATRIX SEQUENCE_0x4F8A // CALIBRATING SYSTEM CORE';

        // Setup dynamic telemetry loop
        if (progressView.telemetryInterval) clearInterval(progressView.telemetryInterval);
        progressView.telemetryInterval = setInterval(() => {
            const loadEl = document.getElementById('telemetry-load');
            const latencyEl = document.getElementById('telemetry-latency');
            const speedEl = document.getElementById('telemetry-speed');
            if (loadEl) loadEl.innerText = `${(70 + Math.random() * 25).toFixed(1)}%`;
            if (latencyEl) latencyEl.innerText = `${Math.floor(10 + Math.random() * 15)}ms`;
            if (speedEl) speedEl.innerText = `${(4.8 + Math.random() * 4).toFixed(1)} Gb/s`;
        }, 350);
    }

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
            if (progressView.telemetryInterval) clearInterval(progressView.telemetryInterval);
            setTimeout(async () => {
                // Default mock subscriptions (only used if no cloud data exists)
                const mockSubscriptions = [
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

                // Attempt to load existing cloud data for this user
                const userEmail = state.currentUser.email;
                const cloudData = await loadFromCloud(userEmail);

                // Only use mock subscriptions if user has no cloud-saved data
                if (!cloudData || !cloudData.subscriptions || cloudData.subscriptions.length === 0) {
                    state.subscriptions = mockSubscriptions;
                }
                
                saveStateToStorage();
                
                // Dramatic reveal transition
                revealDashboardFromScan(progressView);
            }, 250);
            return;
        }

        const step = scanSteps[currentStep];
        if (statusEl) statusEl.innerText = step.text;
        if (barEl) barEl.style.width = `${step.pct}%`;
        if (pctEl) pctEl.innerText = `${step.pct}%`;

        // Update holographic scan terminal logs dynamically
        updateScanTerminal(currentStep, step.text);

        currentStep++;
        
        const delay = 180 + Math.random() * 220;
        setTimeout(runNextStep, delay);
    }

    setTimeout(runNextStep, 200);
}

function appendTerminalLog(message, type = 'info') {
    const terminal = document.getElementById('scraper-terminal');
    if (!terminal) return;

    const line = document.createElement('div');
    const timeStr = new Date().toLocaleTimeString();
    
    let colorClass = 'text-slate-400';
    if (type === 'auth') colorClass = 'text-pink-400 font-bold';
    else if (type === 'success') colorClass = 'text-emerald-400 font-bold';
    else if (type === 'sys') colorClass = 'text-cyan-400 font-medium';
    else if (type === 'raw') colorClass = 'text-slate-600 text-[9px]';

    line.className = `${colorClass} font-mono leading-relaxed`;
    
    if (type !== 'raw') {
        line.innerHTML = `<span class="text-slate-600">[${timeStr}]</span> ${message}`;
    } else {
        line.innerText = `  ${message}`;
    }

    terminal.appendChild(line);
    terminal.scrollTop = terminal.scrollHeight;
}

function updateScanTerminal(stepIndex, stepText) {
    const statusEl = document.getElementById('login-progress-status');
    const detailEl = document.getElementById('scan-terminal-detail');

    const statusUpdates = [
        { status: 'INITIALIZING QUANTUM CORE GATEWAYS...', detail: 'MATRIX SEQUENCE_0x4F8A // CALIBRATING SYSTEM CORE' },
        { status: 'DECRYPTING SECURE MATRIX TUNNELS...', detail: 'CRYPT_PROT: SHA-512_GCM // INITIALIZING SHA Matrix' },
        { status: 'STABILIZING GRID DIMENSION VECTORS...', detail: 'REF_GRAVITY: 9.80665 m/s² // SYNC_VECTORS: ACTIVE' },
        { status: 'CALIBRATING SPACETIME COORDINATES...', detail: 'CORE_TEMP: 34.2°C // VOLTAGE: 1.25V STABLE' },
        { status: 'COMPILING NEURAL CONFIGURATIONS...', detail: 'THREAD_ALLOC: ID_0x8F9B // DUAL CORE PROCESSING' },
        { status: 'STABILIZING ELECTROMAGNETIC ENGINES...', detail: 'SHIELD_VOLT: 12.5kV // CALIBRATION: OK' },
        { status: 'COMPLETING SYSTEM DIAGNOSTICS...', detail: 'SYNC_PROGRESS: FINALIZING INTERFACES' },
        { status: 'SYSTEM CORES BALANCED AND SECURE.', detail: 'REDIRECTING SOCKETS // PIPELINE COMPLETED' }
    ];

    const currentUpdate = statusUpdates[stepIndex] || { status: stepText, detail: 'RUNNING DIAGNOSTICS...' };
    if (statusEl) statusEl.innerText = currentUpdate.status;
    if (detailEl) detailEl.innerText = currentUpdate.detail;
}

// ==========================================
// CINEMATIC SCAN → DASHBOARD REVEAL ANIMATION
function revealDashboardFromScan(progressView) {
    // Create full-screen overlay for the cinematic burst
    const burst = document.createElement('div');
    burst.style.cssText = 'position:fixed;inset:0;z-index:99999;pointer-events:none;display:flex;align-items:center;justify-content:center;background:transparent;';

    // Central glow orb
    const orb = document.createElement('div');
    orb.style.cssText = 'width:0px;height:0px;border-radius:50%;background:radial-gradient(circle,rgba(236,72,153,0.95) 0%,rgba(139,92,246,0.7) 40%,rgba(59,130,246,0.3) 70%,transparent 100%);box-shadow:0 0 120px 60px rgba(236,72,153,0.5),0 0 300px 150px rgba(139,92,246,0.3);flex-shrink:0;';
    burst.appendChild(orb);

    // Particle ring
    const particleCount = 16;
    const particles = [];
    const colors = ['#f472b6','#a78bfa','#60a5fa','#34d399','#fbbf24'];
    for (let i = 0; i < particleCount; i++) {
        const p = document.createElement('div');
        p.style.cssText = `position:absolute;width:${4 + Math.random()*6}px;height:${4 + Math.random()*6}px;border-radius:50%;background:${colors[i % colors.length]};box-shadow:0 0 8px 2px ${colors[i % colors.length]};top:50%;left:50%;transform:translate(-50%,-50%);opacity:0;`;
        burst.appendChild(p);
        particles.push(p);
    }

    document.body.appendChild(burst);

    const tl = gsap.timeline({
        onComplete: () => {
            if (progressView) progressView.classList.add('hidden');
            initAppView();

            requestAnimationFrame(() => {
                // Stagger-animate home cards up
                const cards = document.querySelectorAll('#tab-content-home > *, #tab-content-home .bg-glassBg');
                if (cards.length > 0) {
                    gsap.fromTo(cards,
                        { opacity: 0, y: 40, scale: 0.94 },
                        { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: 'power3.out', stagger: 0.07, clearProps: 'all' }
                    );
                }
                // Nav pill drops in from top
                const navContainer = document.getElementById('nav-container');
                if (navContainer) {
                    gsap.fromTo(navContainer,
                        { y: -70, opacity: 0 },
                        { y: 0, opacity: 1, duration: 0.65, ease: 'back.out(1.5)', delay: 0.08 }
                    );
                }
                // Clean up burst overlay
                gsap.to(burst, { opacity: 0, duration: 0.35, delay: 0.1, onComplete: () => burst.remove() });
            });
        }
    });

    // Orb blooms outward
    tl.to(orb, { width: '130vw', height: '130vw', opacity: 0.85, duration: 0.5, ease: 'expo.out' })
    // Particles explode out
    .to(particles, { opacity: 1, duration: 0.08, stagger: 0.015 }, '<0.1')
    .to(particles, {
        x: (i) => Math.cos((i / particleCount) * Math.PI * 2) * (200 + Math.random() * 160),
        y: (i) => Math.sin((i / particleCount) * Math.PI * 2) * (200 + Math.random() * 160),
        opacity: 0, scale: 0.2, duration: 0.75, ease: 'power2.out', stagger: 0.02
    }, '<')
    // Orb punches inward and vanishes
    .to(orb, { width: '0px', height: '0px', opacity: 0, duration: 0.38, ease: 'power3.in' }, '<0.12');
}

// ==========================================
// HELPER: CURRENCY FORMATTER
// ==========================================
function formatCurrency(amountInINR) {
    const cur = state.preferences.currency || 'INR';
    let converted = parseFloat(amountInINR) || 0;
    
    // Exchange rates (approximate base: 1 USD = ~83 INR)
    switch (cur) {
        case 'USD': converted = converted / 83.5; break;
        case 'EUR': converted = converted / 90.2; break;
        case 'GBP': converted = converted / 105.8; break;
    }
    
    if (cur === 'INR') {
        return '₹' + Math.round(converted).toLocaleString('en-IN');
    } else {
        const symbols = { USD: '$', EUR: '€', GBP: '£' };
        return symbols[cur] + converted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
}

// ==========================================
// RENDERERS: TAB 1 - HOME OVERVIEW
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
            
            <!-- Permanent Cloud Sync Indicator -->
            ${window._lastSyncStatus === 'syncing' ? `
            <div id="home-sync-status" class="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-[11px] font-bold tracking-wide transition-all duration-500 shadow-[0_0_10px_rgba(234,179,8,0.2)] animate-pulse">
                <i data-lucide="cloud-upload" class="w-4 h-4"></i>
                <span>Syncing...</span>
            </div>
            ` : window._lastSyncStatus === 'error' ? `
            <div id="home-sync-status" class="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-[11px] font-bold tracking-wide transition-all duration-500">
                <i data-lucide="cloud-off" class="w-4 h-4"></i>
                <span>Sync Offline</span>
            </div>
            ` : `
            <div id="home-sync-status" class="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-[11px] font-bold tracking-wide shadow-[0_0_15px_rgba(var(--brand-rgb),0.3)] transition-all duration-500">
                <i data-lucide="cloud-check" class="w-4 h-4"></i>
                <span>Synced to Cloud</span>
            </div>
            `}
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
                    <div class="text-3xl font-bold text-cardTitle font-sans tracking-tight">${formatCurrency(monthlySpend)}</div>
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
                <span class="text-xl font-extrabold text-cardTitle font-space mt-1">${formatCurrency(total)}</span>
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

    // Ensure status filter var exists
    if (typeof window.manageStatusFilter === 'undefined') window.manageStatusFilter = 'All';
    if (typeof window.manageSortBy === 'undefined') window.manageSortBy = 'name';

    let filteredSubs = state.subscriptions.filter(sub => {
        const matchesSearch = sub.name.toLowerCase().includes(manageSearchQuery.toLowerCase());
        const matchesCategory = manageCategoryFilter === 'All' || sub.category === manageCategoryFilter;
        const subStatus = sub.status || 'active';
        const matchesStatus = window.manageStatusFilter === 'All'
            || (window.manageStatusFilter === 'Active' && subStatus === 'active')
            || (window.manageStatusFilter === 'Paused' && subStatus === 'paused')
            || (window.manageStatusFilter === 'Cancelled' && subStatus === 'cancelled')
            || (window.manageStatusFilter === 'Trial' && subStatus === 'trial');
        return matchesSearch && matchesCategory && matchesStatus;
    });

    // Sort
    filteredSubs = [...filteredSubs].sort((a, b) => {
        if (window.manageSortBy === 'name') return a.name.localeCompare(b.name);
        if (window.manageSortBy === 'cost_asc') return (parseFloat(a.cost)||0) - (parseFloat(b.cost)||0);
        if (window.manageSortBy === 'cost_desc') return (parseFloat(b.cost)||0) - (parseFloat(a.cost)||0);
        if (window.manageSortBy === 'renewal') return new Date(a.nextRenewal) - new Date(b.nextRenewal);
        return 0;
    });

    const categoriesList = ['All', 'Entertainment', 'Telecom & Fiber', 'Music', 'Utilities', 'Shopping', 'Other'];
    const statusTabs = ['All', 'Active', 'Paused', 'Trial', 'Cancelled'];
    const sortOptions = [
        { val: 'name', label: 'Name A–Z' },
        { val: 'cost_asc', label: 'Cost: Low → High' },
        { val: 'cost_desc', label: 'Cost: High → Low' },
        { val: 'renewal', label: 'Next Renewal' }
    ];

    const totalActive = state.subscriptions.filter(s => !s.status || s.status === 'active').length;
    const totalMonthly = state.subscriptions
        .filter(s => !s.status || s.status === 'active')
        .reduce((acc, s) => acc + (s.cycle === 'monthly' ? parseFloat(s.cost)||0 : (parseFloat(s.cost)||0)/12), 0);

    let html = `
        <!-- Header -->
        <div class="mb-6 flex justify-between items-start flex-wrap gap-4">
            <div>
                <h1 class="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 font-space tracking-wide mb-1">Manage</h1>
                <p class="text-sm text-textMuted font-sans">${totalActive} active &nbsp;·&nbsp; ${formatCurrency(totalMonthly)}<span class="text-xs">/mo</span></p>
            </div>
            <!-- Sort Dropdown -->
            <div class="relative">
                <button id="manage-sort-btn" onclick="toggleManageSortMenu()" class="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-3xl border border-white/20 text-white/80 px-5 py-3 rounded-[20px] text-[13px] font-medium flex items-center space-x-2 font-sans hover:-translate-y-0.5 hover:scale-[1.02] active:scale-95 shadow-[0_8px_20px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.1)] hover:border-white/40 transition-all duration-300 ease-out">
                    <i data-lucide="sliders-horizontal" class="w-4 h-4"></i>
                    <span id="manage-sort-label">${sortOptions.find(o=>o.val===window.manageSortBy)?.label || 'Name A–Z'}</span>
                    <i data-lucide="chevron-down" class="w-3.5 h-3.5 ml-1 transition-transform duration-300" id="manage-sort-chevron"></i>
                </button>
                <div id="manage-sort-menu" class="hidden absolute right-0 top-full mt-3 w-52 bg-gradient-to-br from-[#1a1a24]/95 to-[#0a0a0f]/95 backdrop-blur-3xl border border-white/15 rounded-[24px] shadow-[0_30px_60px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.1)] z-50 overflow-hidden py-2 scale-95 opacity-0 transition-all duration-300 ease-out" style="transform-origin: top right;">
                    ${sortOptions.map(o => `
                        <button onclick="setManageSort('${o.val}')" class="w-full text-left px-5 py-3 text-[13px] font-medium transition-colors ${window.manageSortBy===o.val ? 'text-brand-400 bg-brand-500/10' : 'text-white/60 hover:text-white hover:bg-white/5'} font-sans flex items-center gap-2">
                            ${window.manageSortBy===o.val ? '<i data-lucide="check" class="w-4 h-4"></i> ' : '<div class="w-4 h-4"></div>'}
                            ${o.label}
                        </button>
                    `).join('')}
                </div>
            </div>
        </div>

        <!-- Add Subscription Button -->
        <button onclick="openAddSubModal()" class="w-full mb-6 flex items-center justify-center space-x-2 bg-brand-500/10 border border-brand-500/20 hover:border-brand-500/40 text-brand-400 font-bold text-[15px] py-4 rounded-[24px] hover:bg-brand-500/15 active:scale-95 hover:scale-[1.01] hover:-translate-y-1 shadow-lg transition-all duration-300 ease-out group font-space">
            <i data-lucide="plus-circle" class="w-5 h-5 group-hover:scale-110 transition-transform duration-300"></i>
            <span>Add New Subscription</span>
        </button>

        <!-- Search bar -->
        <div class="relative w-full mb-6 group hover:scale-[1.01] hover:-translate-y-0.5 focus-within:scale-[1.02] focus-within:-translate-y-1 transition-all duration-300 ease-out">
            <span class="absolute inset-y-0 left-0 pl-5 flex items-center text-white/40 group-focus-within:text-brand-400 transition-colors duration-300 z-10">
                <i data-lucide="search" class="w-5 h-5"></i>
            </span>
            <input type="text" id="manage-search" placeholder="Search subscriptions..." value="${manageSearchQuery}"
                class="w-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-3xl border border-white/20 focus:border-brand-500/60 rounded-[28px] py-4 pl-12 pr-5 text-[15px] text-white focus:outline-none placeholder-white/40 font-sans shadow-[0_10px_30px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,0.1)] focus:shadow-[0_15px_40px_rgba(20,184,166,0.2),inset_0_1px_1px_rgba(255,255,255,0.2)] transition-all duration-300 ease-out relative">
        </div>

        <!-- Category Pills (Desktop) -->
        <div class="hidden md:flex items-center space-x-2.5 overflow-x-auto w-full scrollbar-none mb-6 pt-1 pb-3 px-1">
            ${categoriesList.map(cat => {
                const isSelected = cat === manageCategoryFilter;
                return `<button onclick="setManageCategory('${cat}')" class="px-5 py-2.5 rounded-[16px] text-[12px] font-bold whitespace-nowrap transition-all duration-300 ease-out font-sans active:scale-95 hover:-translate-y-0.5 ${isSelected ? 'bg-gradient-to-r from-brand-500 to-indigo-500 text-white shadow-lg shadow-brand-500/30' : 'bg-white/5 ring-1 ring-inset ring-white/10 text-white/60 hover:text-white hover:ring-white/30 hover:bg-white/10'}">${cat}</button>`;
            }).join('')}
        </div>
        
        <!-- Mobile Filter Buttons (Category + Status) - mobile only -->
        <div class="md:hidden w-full mb-6 flex gap-3 px-1">
            <button onclick="openMobileFilterModal()" class="flex-1 flex items-center justify-between bg-white/5 backdrop-blur-2xl ring-1 ring-inset ring-white/10 px-3 py-3 rounded-[24px] text-white/80 text-[13px] font-sans active:scale-95 shadow-lg transition-all duration-300 ease-out">
                <div class="flex items-center gap-2.5">
                    <div class="w-9 h-9 rounded-[14px] bg-white/10 flex items-center justify-center shadow-inner border border-white/5 flex-shrink-0">
                        <i data-lucide="tag" class="w-4 h-4 text-brand-400"></i>
                    </div>
                    <div class="flex flex-col items-start justify-center gap-0.5">
                        <span class="text-[9px] text-white/40 uppercase font-bold tracking-widest leading-none">Category</span>
                        <span class="text-[13px] font-extrabold text-white leading-none overflow-hidden text-ellipsis whitespace-nowrap max-w-[70px]">${manageCategoryFilter === 'All' ? 'All' : manageCategoryFilter}</span>
                    </div>
                </div>
                <i data-lucide="chevron-down" class="w-4 h-4 text-white/30 mr-1 flex-shrink-0"></i>
            </button>
            <button onclick="openMobileStatusFilter()" class="flex-1 flex items-center justify-between bg-white/5 backdrop-blur-2xl ring-1 ring-inset ring-white/10 px-3 py-3 rounded-[24px] text-white/80 text-[13px] font-sans active:scale-95 shadow-lg transition-all duration-300 ease-out">
                <div class="flex items-center gap-2.5">
                    <div class="w-9 h-9 rounded-[14px] bg-white/10 flex items-center justify-center shadow-inner border border-white/5 flex-shrink-0">
                        <i data-lucide="circle-dot" class="w-4 h-4 text-brand-400"></i>
                    </div>
                    <div class="flex flex-col items-start justify-center gap-0.5">
                        <span class="text-[9px] text-white/40 uppercase font-bold tracking-widest leading-none">Status</span>
                        <span class="text-[13px] font-extrabold text-white leading-none overflow-hidden text-ellipsis whitespace-nowrap max-w-[70px]">${window.manageStatusFilter || 'All'}</span>
                    </div>
                </div>
                <i data-lucide="chevron-down" class="w-4 h-4 text-white/30 mr-1 flex-shrink-0"></i>
            </button>
        </div>

        <!-- Status Filter Tabs (desktop only) -->
        <div class="hidden md:flex items-center space-x-1.5 mb-8 bg-[#0a0a0f]/80 backdrop-blur-3xl ring-1 ring-inset ring-white/10 rounded-[20px] p-1.5 w-fit shadow-lg">
            ${statusTabs.map(s => {
                const isActive = s === window.manageStatusFilter;
                const countForTab = s === 'All' ? state.subscriptions.length
                    : state.subscriptions.filter(sub => {
                        const st = sub.status || 'active';
                        return st === s.toLowerCase();
                    }).length;
                return `<button onclick="setManageStatus('${s}')" class="px-5 py-2.5 rounded-[16px] text-[12px] font-bold transition-all duration-300 ease-out font-sans ${isActive ? 'bg-white/10 text-white ring-1 ring-inset ring-white/10 shadow-sm' : 'text-white/50 hover:text-white hover:bg-white/5 active:scale-95'}">
                    ${s} ${countForTab > 0 ? `<span class="ml-1.5 opacity-60 text-[10px] bg-black/40 px-1.5 py-0.5 rounded-full">${countForTab}</span>` : ''}
                </button>`;
            }).join('')}
        </div>

        <!-- Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            ${filteredSubs.length > 0 ? filteredSubs.map((sub) => {
                const template = MOCK_PROVIDER_DATA[sub.providerKey] || { lucideIcon: 'credit-card' };
                const status = sub.status || 'active';
                const statusStyles = {
                    active:    { pill: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25', text: 'ACTIVE',    line: 'from-purple-500 via-indigo-500 to-emerald-500' },
                    paused:    { pill: 'text-amber-400 bg-amber-500/10 border-amber-500/25',       text: 'PAUSED',    line: 'from-amber-500 to-orange-500' },
                    trial:     { pill: 'text-sky-400 bg-sky-500/10 border-sky-500/25',             text: 'TRIAL',     line: 'from-sky-500 to-cyan-500' },
                    cancelled: { pill: 'text-red-400 bg-red-500/10 border-red-500/25',             text: 'CANCELLED', line: 'from-red-500 to-rose-700' }
                };
                const st = statusStyles[status] || statusStyles.active;

                const daysUntil = Math.ceil((new Date(sub.nextRenewal) - new Date()) / (1000*60*60*24));
                const urgentRenewal = daysUntil >= 0 && daysUntil <= 7;

                return `
                    <div class="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-3xl border border-white/20 rounded-[28px] p-6 relative group hover:scale-[1.03] hover:-translate-y-1.5 active:scale-[0.98] transition-all duration-400 ease-out cursor-pointer flex flex-col justify-between overflow-hidden min-h-[200px] manage-card shadow-[0_15px_40px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.2)] hover:shadow-[0_25px_50px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.4)] hover:border-white/40"
                        onclick="openSubscriptionDetails('${sub.id}')">
                        
                        <!-- Top Row -->
                        <div class="flex justify-between items-start mb-5">
                            <div class="w-12 h-12 rounded-[18px] bg-white/10 border border-white/10 flex items-center justify-center flex-shrink-0 shadow-[0_4px_15px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,0.1)]">
                                <i data-lucide="${template.lucideIcon}" class="w-6 h-6 text-brand-400"></i>
                            </div>
                            <span class="px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase border ${st.pill} font-sans shadow-sm">${st.text}</span>
                        </div>

                        <!-- Name & Category -->
                        <div class="mb-5 flex-1">
                            <h4 class="font-extrabold text-white text-[17px] font-sans tracking-tight mb-1">${sub.name}</h4>
                            <p class="text-[12px] text-white/50 font-sans font-medium">${sub.category}</p>
                        </div>

                        <!-- Price & Renewal -->
                        <div class="flex items-end justify-between">
                            <div>
                                <div class="text-[22px] font-bold text-white font-sans tracking-tight leading-none">${formatCurrency(sub.cost)}</div>
                                <div class="text-[11px] text-white/50 font-sans mt-0.5">/ ${sub.cycle}</div>
                            </div>
                            <div class="text-right">
                                <div class="text-[11px] ${urgentRenewal ? 'text-amber-400 font-bold drop-shadow-md' : 'text-white/60'} font-sans mb-1">
                                    ${urgentRenewal ? `⚠ ${daysUntil}d left` : `renews ${new Date(sub.nextRenewal).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
                                </div>
                                <div class="text-[11px] text-white/40 font-sans">${sub.payment.toLowerCase().includes('card') ? 'via card' : 'via email'}</div>
                            </div>
                        </div>

                        <!-- Action Buttons - In-flow pill, visible on hover -->
                        <div class="mt-5 flex opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-300 ease-out translate-y-2 group-hover:translate-y-0 rounded-[16px] overflow-hidden backdrop-blur-xl shadow-lg border border-white/15 bg-white/5" onclick="event.stopPropagation()">
                            ${status !== 'cancelled' ? `
                                <button onclick="editSubscription('${sub.id}')" title="Edit" class="flex-1 py-2.5 hover:bg-white/10 text-white/80 hover:text-white transition-colors text-[12px] font-bold font-sans flex items-center justify-center gap-1.5">
                                    <i data-lucide="pencil" class="w-3.5 h-3.5"></i> Edit
                                </button>
                                <div class="w-px bg-white/15"></div>
                                <button onclick="toggleSubPause('${sub.id}')" title="${status === 'paused' ? 'Resume' : 'Pause'}" class="flex-1 py-2.5 hover:bg-amber-500/20 text-white/80 hover:text-amber-300 transition-colors text-[12px] font-bold font-sans flex items-center justify-center gap-1.5">
                                    <i data-lucide="${status === 'paused' ? 'play' : 'pause'}" class="w-3.5 h-3.5"></i> ${status === 'paused' ? 'Resume' : 'Pause'}
                                </button>
                                <div class="w-px bg-white/15"></div>
                                <button onclick="cancelSubscription('${sub.id}')" title="Cancel" class="flex-1 py-2.5 hover:bg-red-500/20 text-white/80 hover:text-red-300 transition-colors text-[12px] font-bold font-sans flex items-center justify-center gap-1.5">
                                    <i data-lucide="x-circle" class="w-3.5 h-3.5"></i> Cancel
                                </button>
                            ` : `
                                <button onclick="reactivateSubscription('${sub.id}')" class="flex-1 py-2.5 hover:bg-emerald-500/20 text-white/80 hover:text-emerald-300 transition-colors text-[12px] font-bold font-sans flex items-center justify-center gap-1.5">
                                    <i data-lucide="refresh-cw" class="w-3.5 h-3.5"></i> Reactivate
                                </button>
                                <div class="w-px bg-white/15"></div>
                                <button onclick="deleteSubscription('${sub.id}')" class="flex-1 py-2.5 hover:bg-red-500/20 text-white/80 hover:text-red-300 transition-colors text-[12px] font-bold font-sans flex items-center justify-center gap-1.5">
                                    <i data-lucide="trash-2" class="w-3.5 h-3.5"></i> Delete
                                </button>
                            `}
                        </div>

                        <!-- Bottom Gradient Line -->
                        <div class="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r ${st.line} opacity-50 group-hover:opacity-100 transition-opacity duration-300 z-10 rounded-b-[28px]"></div>
                    </div>
                `;
            }).join('') : `
                <div class="col-span-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-3xl border border-white/20 rounded-[28px] p-12 text-center shadow-[0_15px_40px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,0.1)]">
                    <div class="p-5 bg-white/10 border border-white/10 text-white/60 rounded-[20px] w-16 h-16 mx-auto mb-5 flex items-center justify-center shadow-inner">
                        <i data-lucide="search-x" class="w-7 h-7"></i>
                    </div>
                    <h4 class="text-white font-extrabold text-[17px] font-sans tracking-tight">No Subscriptions Found</h4>
                    <p class="text-white/50 text-[13px] mt-1.5 mb-2 font-sans font-medium">Try adjusting your filters or search query.</p>
                </div>
            `}
        </div>
    `;

    container.innerHTML = html;
    lucide.createIcons();

    const searchInput = document.getElementById('manage-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            manageSearchQuery = e.target.value;
            const start = e.target.selectionStart;
            const end = e.target.selectionEnd;
            renderManageTab();
            const ni = document.getElementById('manage-search');
            if (ni) { ni.focus(); ni.setSelectionRange(start, end); }
        });
    }

    // Close sort menu on outside click
    document.addEventListener('click', function closeSortMenu(e) {
        const menu = document.getElementById('manage-sort-menu');
        const btn = document.getElementById('manage-sort-btn');
        if (menu && !menu.contains(e.target) && btn && !btn.contains(e.target)) {
            menu.classList.add('hidden');
            document.removeEventListener('click', closeSortMenu);
        }
    });
}

window.openMobileFilterModal = function() {
    const modal = document.getElementById('mobile-filter-modal');
    const backdrop = document.getElementById('mobile-filter-backdrop');
    const content = document.getElementById('mobile-filter-content');
    const list = document.getElementById('mobile-filter-list');
    
    if (!modal || !list) return;
    
    const categoriesList = ['All', 'Entertainment', 'Telecom & Fiber', 'Music', 'Utilities', 'Shopping', 'Other'];
    
    list.innerHTML = categoriesList.map(cat => {
        const isSelected = cat === manageCategoryFilter;
        // Count active subscriptions for this category
        const count = state.subscriptions.filter(sub => {
            const matchesCat = cat === 'All' || sub.category === cat;
            return matchesCat;
        }).length;
        
        return `
            <button onclick="selectMobileCategory('${cat}')" class="flex items-center justify-between w-full p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${isSelected ? 'bg-gradient-to-r from-brand-500/20 to-transparent border-brand-500/40' : 'bg-white/5 border-white/5 hover:bg-white/10'}">
                <div class="flex items-center gap-3">
                    <div class="w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-brand-400' : 'border-slate-600'}">
                        ${isSelected ? '<div class="w-2 h-2 bg-brand-400 rounded-full shadow-[0_0_8px_rgba(20,184,166,0.8)]"></div>' : ''}
                    </div>
                    <span class="font-sans text-sm font-semibold ${isSelected ? 'text-white' : 'text-slate-300'}">${cat === 'All' ? 'All Categories' : cat}</span>
                </div>
                <div class="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-slate-300">
                    ${count}
                </div>
            </button>
        `;
    }).join('');
    
    modal.classList.remove('hidden');
    // Allow DOM to update before animation
    setTimeout(() => {
        backdrop.classList.remove('opacity-0');
        backdrop.classList.add('opacity-100');
        content.classList.remove('translate-y-full');
        content.classList.add('translate-y-0');
    }, 10);
};

window.closeMobileFilterModal = function() {
    const modal = document.getElementById('mobile-filter-modal');
    const backdrop = document.getElementById('mobile-filter-backdrop');
    const content = document.getElementById('mobile-filter-content');
    if (!modal) return;
    
    backdrop.classList.remove('opacity-100');
    backdrop.classList.add('opacity-0');
    content.classList.remove('translate-y-0');
    content.classList.add('translate-y-full');
    
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
};

window.selectMobileCategory = function(cat) {
    setManageCategory(cat);
    closeMobileFilterModal();
};

// ── Mobile Status Filter Modal ────────────────────────────────────────────────

const STATUS_META = {
    All:       { icon: 'layers',        color: 'text-slate-300',  dot: 'bg-slate-400',    label: 'All Subscriptions' },
    Active:    { icon: 'check-circle',  color: 'text-emerald-400', dot: 'bg-emerald-400', label: 'Active' },
    Paused:    { icon: 'pause-circle',  color: 'text-amber-400',  dot: 'bg-amber-400',    label: 'Paused' },
    Trial:     { icon: 'clock',         color: 'text-sky-400',    dot: 'bg-sky-400',      label: 'Trial' },
    Cancelled: { icon: 'x-circle',      color: 'text-red-400',    dot: 'bg-red-400',      label: 'Cancelled' }
};

window.openMobileStatusFilter = function() {
    const modal    = document.getElementById('mobile-status-modal');
    const backdrop = document.getElementById('mobile-status-backdrop');
    const content  = document.getElementById('mobile-status-content');
    const list     = document.getElementById('mobile-status-list');
    if (!modal || !list) return;

    const statuses = ['All', 'Active', 'Paused', 'Trial', 'Cancelled'];

    list.innerHTML = statuses.map(s => {
        const meta      = STATUS_META[s];
        const isSelected = s === (window.manageStatusFilter || 'All');
        const count = s === 'All'
            ? state.subscriptions.length
            : state.subscriptions.filter(sub => (sub.status || 'active') === s.toLowerCase()).length;

        return `
            <button onclick="selectMobileStatus('${s}')"
                class="flex items-center justify-between w-full p-4 rounded-2xl border transition-all duration-200 cursor-pointer
                    ${isSelected ? 'bg-gradient-to-r from-brand-500/20 to-transparent border-brand-500/40' : 'bg-white/5 border-white/5 active:bg-white/10'}">
                <div class="flex items-center gap-3">
                    <div class="w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-brand-400' : 'border-slate-600'}">
                        ${isSelected ? '<div class="w-2 h-2 bg-brand-400 rounded-full shadow-[0_0_8px_rgba(20,184,166,0.8)]"></div>' : ''}
                    </div>
                    <div class="flex items-center gap-2">
                        <div class="w-2 h-2 rounded-full ${meta.dot} ${s === 'All' ? 'hidden' : ''}"></div>
                        <span class="font-sans text-sm font-semibold ${isSelected ? 'text-white' : 'text-slate-300'}">${meta.label}</span>
                    </div>
                </div>
                <div class="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-slate-300">
                    ${count}
                </div>
            </button>`;
    }).join('');

    lucide.createIcons({ nodes: [list] });

    modal.classList.remove('hidden');
    setTimeout(() => {
        backdrop.classList.remove('opacity-0');
        backdrop.classList.add('opacity-100');
        content.classList.remove('translate-y-full');
        content.classList.add('translate-y-0');
    }, 10);
};

window.closeMobileStatusFilter = function() {
    const modal    = document.getElementById('mobile-status-modal');
    const backdrop = document.getElementById('mobile-status-backdrop');
    const content  = document.getElementById('mobile-status-content');
    if (!modal) return;

    backdrop.classList.remove('opacity-100');
    backdrop.classList.add('opacity-0');
    content.classList.remove('translate-y-0');
    content.classList.add('translate-y-full');

    setTimeout(() => modal.classList.add('hidden'), 300);
};

window.selectMobileStatus = function(status) {
    window.setManageStatus(status);
    closeMobileStatusFilter();
};

// ── Mobile Account Filter Modal ────────────────────────────────────────────────

const ACCOUNT_TABS_META = [
    { id: 'identity',    icon: 'user',     label: 'Identity & Prefs', desc: 'Profile name, contact' },
    { id: 'sources',     icon: 'link',     label: 'Sources',          desc: 'Connected scan methods' },
    { id: 'appearance',  icon: 'palette',  label: 'Aesthetics',       desc: 'Themes & UI' },
    { id: 'diagnostics', icon: 'terminal', label: 'Diagnostics',      desc: 'System health' }
];

window.openMobileAccountFilter = function() {
    const modal    = document.getElementById('mobile-account-modal');
    const backdrop = document.getElementById('mobile-account-backdrop');
    const content  = document.getElementById('mobile-account-content');
    const list     = document.getElementById('mobile-account-list');
    if (!modal || !list) return;

    // Get current active tab (default to identity)
    const currentTabId = document.querySelector('.acct-tab-btn.bg-brand-500\\/25')?.getAttribute('data-acct-tab') || 'identity';

    list.innerHTML = ACCOUNT_TABS_META.map(tab => {
        const isSelected = tab.id === currentTabId;
        return `
            <button onclick="selectMobileAccountTab('${tab.id}', '${tab.label}')"
                class="flex items-center justify-between w-full p-4 rounded-2xl border transition-all duration-200 cursor-pointer
                    ${isSelected ? 'bg-gradient-to-r from-brand-500/20 to-transparent border-brand-500/40' : 'bg-white/5 border-white/5 active:bg-white/10'}">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-[14px] bg-[#1a1723] flex items-center justify-center flex-shrink-0 shadow-inner ${isSelected ? 'text-brand-400' : 'text-slate-400'}">
                        <i data-lucide="${tab.icon}" class="w-5 h-5"></i>
                    </div>
                    <div class="text-left">
                        <div class="font-sans text-sm font-semibold ${isSelected ? 'text-white' : 'text-slate-300'}">${tab.label}</div>
                        <div class="text-[10px] text-textMuted">${tab.desc}</div>
                    </div>
                </div>
                <div class="w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-brand-400' : 'border-slate-600'}">
                    ${isSelected ? '<div class="w-2 h-2 bg-brand-400 rounded-full shadow-[0_0_8px_rgba(20,184,166,0.8)]"></div>' : ''}
                </div>
            </button>`;
    }).join('');

    lucide.createIcons({ nodes: [list] });

    modal.classList.remove('hidden');
    setTimeout(() => {
        backdrop.classList.remove('opacity-0');
        backdrop.classList.add('opacity-100');
        content.classList.remove('translate-y-full');
        content.classList.add('translate-y-0');
    }, 10);
};

window.closeMobileAccountFilter = function() {
    const modal    = document.getElementById('mobile-account-modal');
    const backdrop = document.getElementById('mobile-account-backdrop');
    const content  = document.getElementById('mobile-account-content');
    if (!modal) return;

    backdrop.classList.remove('opacity-100');
    backdrop.classList.add('opacity-0');
    content.classList.remove('translate-y-0');
    content.classList.add('translate-y-full');

    setTimeout(() => modal.classList.add('hidden'), 300);
};

window.selectMobileAccountTab = function(tabId, tabLabel) {
    switchAccountTab(tabId);
    
    // Update the label on the button
    const labelSpan = document.getElementById('mobile-account-current-tab');
    if (labelSpan) labelSpan.textContent = tabLabel;
    
    closeMobileAccountFilter();
};

window.toggleManageSortMenu = function() {
    const menu = document.getElementById('manage-sort-menu');
    const chevron = document.getElementById('manage-sort-chevron');
    if (menu) {
        const isOpen = menu.classList.contains('opacity-100');
        
        if (isOpen) {
            menu.classList.remove('opacity-100', 'scale-100', 'pointer-events-auto');
            menu.classList.add('opacity-0', 'scale-95', 'pointer-events-none');
            setTimeout(() => { if (!menu.classList.contains('opacity-100')) menu.classList.add('hidden') }, 300);
            if (chevron) chevron.style.transform = '';
        } else {
            menu.classList.remove('hidden');
            requestAnimationFrame(() => {
                menu.classList.remove('opacity-0', 'scale-95', 'pointer-events-none');
                menu.classList.add('opacity-100', 'scale-100', 'pointer-events-auto');
                if (chevron) chevron.style.transform = 'rotate(180deg)';
            });
        }
    }
};

window.setManageSort = function(val) {
    window.manageSortBy = val;
    const menu = document.getElementById('manage-sort-menu');
    if (menu) menu.classList.add('hidden');
    renderManageTab();
    lucide.createIcons();
};

window.setManageStatus = function(status) {
    window.manageStatusFilter = status;
    renderManageTab();
    lucide.createIcons();
};

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

window.toggleSubPause = function(id) {
    const sub = state.subscriptions.find(s => s.id === id);
    if (!sub) return;
    sub.status = sub.status === 'paused' ? 'active' : 'paused';
    saveStateToStorage();
    renderManageTab();
    lucide.createIcons();
};

window.cancelSubscription = function(id) {
    const sub = state.subscriptions.find(s => s.id === id);
    if (!sub) return;
    if (!confirm(`Cancel "${sub.name}"? You can reactivate it later.`)) return;
    sub.status = 'cancelled';
    saveStateToStorage();
    renderManageTab();
    lucide.createIcons();
};

window.reactivateSubscription = function(id) {
    const sub = state.subscriptions.find(s => s.id === id);
    if (!sub) return;
    sub.status = 'active';
    saveStateToStorage();
    renderManageTab();
    lucide.createIcons();
};

window.deleteSubscription = function(id) {
    const sub = state.subscriptions.find(s => s.id === id);
    if (!sub) return;
    if (!confirm(`Permanently delete "${sub.name}"?`)) return;
    state.subscriptions = state.subscriptions.filter(s => s.id !== id);
    saveStateToStorage();
    renderManageTab();
    lucide.createIcons();
};

// Edit Subscription Modal
window.editSubscription = function(id) {
    const sub = state.subscriptions.find(s => s.id === id);
    if (!sub) return;

    const existing = document.getElementById('edit-sub-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'edit-sub-modal';
    modal.className = 'fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md p-4';
    modal.style.opacity = '0';
    modal.innerHTML = `
        <div id="edit-sub-card" style="transform:scale(0.9)" class="bg-[#0a0a0f] border border-[#222] rounded-[28px] w-full max-w-md shadow-[0_30px_80px_rgba(0,0,0,0.9)] relative overflow-hidden transition-all">
            <div class="h-[2px] bg-gradient-to-r from-brand-500 to-indigo-500"></div>
            <div class="p-7">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-xl font-extrabold text-cardTitle font-space">Edit Subscription</h2>
                    <button onclick="closeEditModal()" class="p-2 text-slate-500 hover:text-cardTitle bg-[#13111a] border border-[#222] rounded-full transition-colors">
                        <i data-lucide="x" class="w-4 h-4"></i>
                    </button>
                </div>

                <div class="space-y-4">
                    <div>
                        <label class="block text-[10px] font-bold text-textMuted uppercase tracking-widest mb-1.5 font-space">Name</label>
                        <input id="edit-sub-name" type="text" value="${sub.name}" class="w-full bg-[#13111a] border border-glassBorder focus:border-brand-500 rounded-xl py-3 px-4 text-sm text-cardTitle focus:outline-none font-sans">
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="block text-[10px] font-bold text-textMuted uppercase tracking-widest mb-1.5 font-space">Cost (₹)</label>
                            <input id="edit-sub-cost" type="number" value="${sub.cost}" class="w-full bg-[#13111a] border border-glassBorder focus:border-brand-500 rounded-xl py-3 px-4 text-sm text-cardTitle focus:outline-none font-sans">
                        </div>
                        <div>
                            <label class="block text-[10px] font-bold text-textMuted uppercase tracking-widest mb-1.5 font-space">Billing</label>
                            <select id="edit-sub-cycle" class="w-full bg-[#13111a] border border-glassBorder focus:border-brand-500 rounded-xl py-3 px-4 text-sm text-cardTitle focus:outline-none font-sans">
                                <option value="monthly" ${sub.cycle==='monthly'?'selected':''}>Monthly</option>
                                <option value="yearly" ${sub.cycle==='yearly'?'selected':''}>Yearly</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label class="block text-[10px] font-bold text-textMuted uppercase tracking-widest mb-1.5 font-space">Next Renewal</label>
                        <input id="edit-sub-renewal" type="date" value="${sub.nextRenewal}" class="w-full bg-[#13111a] border border-glassBorder focus:border-brand-500 rounded-xl py-3 px-4 text-sm text-cardTitle focus:outline-none font-sans">
                    </div>
                    <div>
                        <label class="block text-[10px] font-bold text-textMuted uppercase tracking-widest mb-1.5 font-space">Category</label>
                        <select id="edit-sub-category" class="w-full bg-[#13111a] border border-glassBorder focus:border-brand-500 rounded-xl py-3 px-4 text-sm text-cardTitle focus:outline-none font-sans">
                            ${['Entertainment','Telecom & Fiber','Music','Utilities','Shopping','Other'].map(c => `<option value="${c}" ${sub.category===c?'selected':''}>${c}</option>`).join('')}
                        </select>
                    </div>
                    <div>
                        <label class="block text-[10px] font-bold text-textMuted uppercase tracking-widest mb-1.5 font-space">Status</label>
                        <select id="edit-sub-status" class="w-full bg-[#13111a] border border-glassBorder focus:border-brand-500 rounded-xl py-3 px-4 text-sm text-cardTitle focus:outline-none font-sans">
                            <option value="active" ${(!sub.status||sub.status==='active')?'selected':''}>Active</option>
                            <option value="paused" ${sub.status==='paused'?'selected':''}>Paused</option>
                            <option value="trial" ${sub.status==='trial'?'selected':''}>Trial</option>
                            <option value="cancelled" ${sub.status==='cancelled'?'selected':''}>Cancelled</option>
                        </select>
                    </div>
                </div>

                <div class="flex space-x-3 mt-7">
                    <button onclick="closeEditModal()" class="flex-1 bg-[#13111a] hover:bg-[#1a1723] text-textMuted border border-[#222] font-semibold text-sm py-3.5 rounded-2xl transition-all font-sans">Cancel</button>
                    <button onclick="saveEditedSubscription('${sub.id}')" class="flex-1 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-sm py-3.5 rounded-2xl transition-all shadow-[0_4px_20px_rgba(236,72,153,0.3)] font-space">Save Changes</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    lucide.createIcons();

    gsap.to(modal, { opacity: 1, duration: 0.2, ease: 'power2.out' });
    gsap.to('#edit-sub-card', { scale: 1, duration: 0.35, ease: 'back.out(1.4)' });
};

window.closeEditModal = function() {
    const modal = document.getElementById('edit-sub-modal');
    if (!modal) return;
    gsap.to('#edit-sub-card', { scale: 0.9, opacity: 0, duration: 0.2, ease: 'power2.in' });
    gsap.to(modal, { opacity: 0, duration: 0.25, ease: 'power2.in', onComplete: () => modal.remove() });
};

window.saveEditedSubscription = function(id) {
    const sub = state.subscriptions.find(s => s.id === id);
    if (!sub) return;
    sub.name     = document.getElementById('edit-sub-name').value.trim() || sub.name;
    sub.cost     = parseFloat(document.getElementById('edit-sub-cost').value) || sub.cost;
    sub.cycle    = document.getElementById('edit-sub-cycle').value;
    sub.nextRenewal = document.getElementById('edit-sub-renewal').value || sub.nextRenewal;
    sub.category = document.getElementById('edit-sub-category').value;
    sub.status   = document.getElementById('edit-sub-status').value;
    saveStateToStorage();
    closeEditModal();
    setTimeout(() => { renderManageTab(); lucide.createIcons(); }, 280);
};

// Open Subscription Details (read-only expanded view)
window.openSubscriptionDetails = function(subId) {
    const sub = state.subscriptions.find(s => s.id === subId);
    if (!sub) return;
    const template = MOCK_PROVIDER_DATA[sub.providerKey] || { lucideIcon: 'credit-card', manualSteps: ['No steps available.'] };
    const status = sub.status || 'active';
    const statusStyles = {
        active:    'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
        paused:    'text-amber-400 bg-amber-500/10 border-amber-500/20',
        trial:     'text-sky-400 bg-sky-500/10 border-sky-500/20',
        cancelled: 'text-red-400 bg-red-500/10 border-red-500/20'
    };

    const existing = document.getElementById('sub-detail-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'sub-detail-modal';
    modal.className = 'fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md p-4';
    modal.style.opacity = '0';

    modal.innerHTML = `
        <div id="sub-detail-card" style="transform:scale(0.92)" class="bg-[#0a0a0f] border border-[#222] rounded-[32px] w-full max-w-lg shadow-[0_25px_60px_rgba(0,0,0,0.9)] relative overflow-hidden">
            <div class="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-brand-500 to-indigo-500 opacity-70"></div>
            <div class="p-8">
                <div class="flex justify-between items-start mb-7">
                    <div class="flex items-center space-x-5">
                        <div class="w-16 h-16 rounded-[20px] bg-[#13111a] border border-[#222] flex items-center justify-center flex-shrink-0 shadow-inner">
                            <i data-lucide="${template.lucideIcon}" class="w-8 h-8 text-brand-400"></i>
                        </div>
                        <div>
                            <h2 class="text-2xl font-extrabold text-cardTitle font-sans tracking-tight mb-1">${sub.name}</h2>
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase ${statusStyles[status]} border font-space">${status.toUpperCase()}</span>
                        </div>
                    </div>
                    <button onclick="closeSubscriptionDetails()" class="p-2 text-slate-500 hover:text-cardTitle transition-colors bg-[#13111a] border border-[#222] rounded-full hover:bg-[#1a1723]">
                        <i data-lucide="x" class="w-5 h-5"></i>
                    </button>
                </div>

                <div class="grid grid-cols-2 gap-3 mb-7">
                    <div class="bg-[#13111a] p-4 rounded-2xl border border-[#222]">
                        <p class="text-[10px] text-slate-500 uppercase tracking-widest font-space font-bold mb-1">Cost</p>
                        <p class="text-cardTitle font-bold font-sans">${formatCurrency(sub.cost)} <span class="text-[10px] text-slate-500">/ ${sub.cycle}</span></p>
                    </div>
                    <div class="bg-[#13111a] p-4 rounded-2xl border border-[#222]">
                        <p class="text-[10px] text-slate-500 uppercase tracking-widest font-space font-bold mb-1">Billing</p>
                        <p class="text-cardTitle font-bold font-sans text-sm capitalize">${sub.cycle}</p>
                    </div>
                    <div class="bg-[#13111a] p-4 rounded-2xl border border-[#222]">
                        <p class="text-[10px] text-slate-500 uppercase tracking-widest font-space font-bold mb-1">Next Renewal</p>
                        <p class="text-cardTitle font-bold font-sans text-sm">${new Date(sub.nextRenewal).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                    <div class="bg-[#13111a] p-4 rounded-2xl border border-[#222]">
                        <p class="text-[10px] text-slate-500 uppercase tracking-widest font-space font-bold mb-1">Payment</p>
                        <p class="text-cardTitle font-bold font-sans text-sm truncate">${sub.payment}</p>
                    </div>
                </div>

                <div class="flex space-x-3">
                    <button onclick="closeSubscriptionDetails(); editSubscription('${sub.id}')" class="flex-1 bg-[#13111a] hover:bg-brand-500/10 text-cardTitle border border-[#222] hover:border-brand-500/40 font-semibold text-sm py-3.5 rounded-2xl transition-all font-sans flex items-center justify-center gap-2">
                        <i data-lucide="pencil" class="w-4 h-4"></i> Edit
                    </button>
                    ${status !== 'cancelled' ? `
                    <button onclick="closeSubscriptionDetails(); cancelSubscription('${sub.id}')" class="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-bold text-sm py-3.5 rounded-2xl transition-all font-sans flex items-center justify-center gap-2">
                        <i data-lucide="x-circle" class="w-4 h-4"></i> Cancel Sub
                    </button>` : `
                    <button onclick="closeSubscriptionDetails(); reactivateSubscription('${sub.id}')" class="flex-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-sm py-3.5 rounded-2xl transition-all font-sans flex items-center justify-center gap-2">
                        <i data-lucide="refresh-cw" class="w-4 h-4"></i> Reactivate
                    </button>`}
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    lucide.createIcons();
    gsap.to(modal, { opacity: 1, duration: 0.2, ease: 'power2.out' });
    gsap.to('#sub-detail-card', { scale: 1, duration: 0.35, ease: 'back.out(1.4)' });
};

window.closeSubscriptionDetails = function() {
    const modal = document.getElementById('sub-detail-modal');
    if (!modal) return;
    gsap.to('#sub-detail-card', { scale: 0.9, opacity: 0, duration: 0.2, ease: 'power2.in' });
    gsap.to(modal, { opacity: 0, duration: 0.25, ease: 'power2.in', onComplete: () => modal.remove() });
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

    // 1. Update left profile card name
    const largeNameEl = document.getElementById('account-large-avatar-name');
    if (largeNameEl) {
        largeNameEl.innerText = state.currentUser.name || 'User';
    }

    // 2. Update left profile card email
    const largeEmailEl = document.getElementById('account-large-avatar-email');
    if (largeEmailEl) {
        largeEmailEl.innerText = state.currentUser.email || '—';
    }

    // 3. Update left profile card avatar ring inner content
    const ring = document.getElementById('account-avatar-ring');
    if (ring) {
        const vibe = AVATAR_VIBES[state.currentUser.avatar || 'nebula'] || AVATAR_VIBES.nebula;
        ring.className = `absolute inset-[3px] rounded-full bg-gradient-to-tr ${vibe.gradient} flex items-center justify-center text-cardTitle shadow-2xl`;
        if (state.currentUser.avatarBase64) {
            ring.innerHTML = `<img src="${state.currentUser.avatarBase64}" class="w-full h-full object-cover rounded-full">`;
        } else if (state.currentUser.avatarIcon) {
            ring.innerHTML = `<i id="account-large-avatar-icon" data-lucide="${state.currentUser.avatarIcon}" class="w-11 h-11"></i>`;
            lucide.createIcons({ nodes: [ring] });
        } else {
            ring.innerHTML = `<span id="account-large-avatar-char" class="text-4xl font-black font-space">${(state.currentUser.name || 'U')[0].toUpperCase()}</span>`;
        }
    }

    // 4. Update left profile card linked sources count
    const linkedCountEl = document.getElementById('account-stat-linked-count');
    if (linkedCountEl) {
        linkedCountEl.innerText = `${state.currentUser.linkedCredentials.length} Linked`;
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
    const firstChar = (state.currentUser.name || 'U')[0].toUpperCase();
    const totalSubs = state.subscriptions.length;
    const activeSubs = state.subscriptions.filter(s => !s.status || s.status === 'active').length;
    const monthlySpend = state.subscriptions
        .filter(s => !s.status || s.status === 'active')
        .reduce((a, s) => a + (s.cycle === 'monthly' ? parseFloat(s.cost)||0 : (parseFloat(s.cost)||0)/12), 0);

    // Generate initial diagnostics console log lines
    let logHtml = '';
    const now = new Date();
    for (let i = 0; i < 5; i++) {
        const timeStr = new Date(now.getTime() - (5 - i) * 60000).toLocaleTimeString();
        logHtml += `<div class="text-textMuted font-mono text-[10px] flex items-center space-x-1.5"><span class="text-emerald-500 font-extrabold select-none">❯</span> <span>[${timeStr}] ${DIAGNOSTIC_LOG_TEMPLATES[i]}</span></div>`;
    }

    const html = `
        <!-- Page Header -->
        <div class="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center justify-between gap-3 px-2 md:px-0">
            <div class="flex flex-col">
                <h1 class="text-[38px] md:text-[48px] font-extrabold tracking-tight leading-none" style="font-family: 'Plus Jakarta Sans', 'Outfit', 'Inter', 'SF Pro Display', -apple-system, sans-serif; background: linear-gradient(to right, #8b80f9, #cf7bfe, #20d2eb); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; color: transparent; padding-bottom: 2px;">Account</h1>
                <p class="text-[14px] md:text-[15px] font-medium text-white/50 mt-1" style="font-family: 'Plus Jakarta Sans', 'Outfit', 'Inter', 'SF Pro Text', -apple-system, sans-serif;">and other settings</p>
            </div>
            <div id="account-save-indicator" class="hidden self-start md:self-auto items-center gap-1.5 text-xs text-white font-medium bg-emerald-500/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg">
                <i data-lucide="check" class="w-4 h-4"></i> Saved
            </div>
        </div>

        <div class="flex flex-col lg:grid lg:grid-cols-12 gap-6 items-start px-2 md:px-0 max-w-6xl mx-auto">

            <!-- LEFT: Profile & Navigation Sidebar (macOS/iPadOS Style) -->
            <div class="lg:col-span-4 flex flex-col gap-4 w-full order-1 lg:order-none">

                <!-- Profile Card -->
                <div class="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-3xl border border-white/20 rounded-[24px] p-6 text-center relative overflow-hidden group shadow-[0_12px_40px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.2)]">
                    <div class="absolute inset-0 bg-gradient-to-br from-brand-500/20 to-purple-500/20 opacity-60 blur-3xl mix-blend-screen"></div>
                    
                    <div class="relative z-10 flex flex-col items-center">
                        <div class="relative w-20 h-20 mb-4 cursor-pointer group/avatar" id="account-avatar-click-zone">
                            <div class="absolute inset-0 rounded-full bg-gradient-to-tr from-brand-500 to-purple-500 p-[2px] shadow-lg">
                                <div class="w-full h-full rounded-full bg-[#1c1c1e] flex items-center justify-center text-white">
                                    ${state.currentUser.avatarIcon
                                        ? `<i id="account-large-avatar-icon" data-lucide="${state.currentUser.avatarIcon}" class="w-8 h-8"></i>`
                                        : `<span id="account-large-avatar-char" class="text-3xl font-medium font-sans">${firstChar}</span>`
                                    }
                                </div>
                            </div>
                            <div class="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                <i data-lucide="camera" class="w-6 h-6 text-white"></i>
                            </div>
                        </div>

                        <h3 id="account-large-avatar-name" class="text-xl font-semibold text-white tracking-tight mb-1" style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;">${state.currentUser.name || 'User'}</h3>
                        <p id="account-large-avatar-email" class="text-[13px] text-white/50 mb-5" style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;">${state.currentUser.email || 'Apple ID'}</p>
                        
                        <button id="btn-open-avatar-modal" class="bg-white/10 hover:bg-white/15 text-white font-medium text-[13px] px-4 py-1.5 rounded-full transition-colors font-sans">
                            Change Photo
                        </button>
                    </div>
                </div>

                <!-- Desktop Sidebar Navigation (Hidden on mobile, mobile uses dropdown or continuous) -->
                <div class="hidden lg:flex flex-col bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-3xl border border-white/20 rounded-[24px] overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.2)]" id="account-tab-bar">
                    ${[
                        { id: 'identity', icon: 'user', iconColor: 'bg-gray-500', label: 'Profile' },
                        { id: 'sources',  icon: 'link', iconColor: 'bg-blue-500', label: 'Linked Accounts' },
                        { id: 'appearance', icon: 'sun', iconColor: 'bg-indigo-500', label: 'Appearance' },
                        { id: 'diagnostics', icon: 'terminal', iconColor: 'bg-slate-600', label: 'Advanced' },
                    ].map((t, i, arr) => `
                        <button data-acct-tab="${t.id}" onclick="switchAccountTab('${t.id}')" class="acct-tab-btn flex items-center justify-between w-full px-4 py-3.5 transition-all group ${i === 0 ? 'bg-white/10' : 'hover:bg-white/5'} ${i !== arr.length - 1 ? 'border-b border-white/[0.06]' : ''}">
                            <div class="flex items-center gap-3.5">
                                <div class="w-7 h-7 rounded-lg ${t.iconColor} flex items-center justify-center text-white shadow-sm">
                                    <i data-lucide="${t.icon}" class="w-4 h-4"></i>
                                </div>
                                <span class="text-[15px] ${i === 0 ? 'font-medium text-white' : 'text-slate-300 group-hover:text-white'} transition-colors" style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;">${t.label}</span>
                            </div>
                            <i data-lucide="chevron-right" class="w-4 h-4 text-white/30"></i>
                        </button>
                    `).join('')}
                </div>
                
                <!-- Desktop Destructive Actions -->
                <div class="hidden lg:flex flex-col bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-3xl border border-white/20 rounded-[24px] overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.2)] mt-2">
                    <button onclick="triggerAccountReset()" class="flex items-center justify-center w-full px-4 py-3.5 border-b border-white/[0.06] hover:bg-white/[0.02] transition-colors active:bg-white/10 group">
                        <i data-lucide="log-out" class="w-4 h-4 text-red-500 mr-2 group-hover:scale-110 transition-transform"></i>
                        <span class="text-[15px] text-red-500" style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;">Log Out</span>
                    </button>
                    <button onclick="triggerDeleteAccount()" class="flex items-center justify-center w-full px-4 py-3.5 hover:bg-white/[0.02] transition-colors active:bg-white/10 group">
                        <i data-lucide="user-x" class="w-4 h-4 text-red-500 font-semibold mr-2 group-hover:scale-110 transition-transform"></i>
                        <span class="text-[15px] text-red-500 font-semibold" style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;">Delete Account</span>
                    </button>
                </div>
            </div>

            <!-- RIGHT: Content panel (iOS Grouped Lists) -->
            <div class="lg:col-span-8 space-y-6 w-full order-2 lg:order-none">

                <!-- Mobile Account Tab Button (macOS/iOS style dropdown for mobile) -->
                <div class="md:hidden w-full mb-2">
                    <button onclick="openMobileAccountFilter()" class="w-full flex items-center justify-between bg-white/[0.06] border border-white/[0.08] px-4 py-3.5 rounded-[16px] text-white/70 text-[15px] active:bg-white/[0.1] transition-colors shadow-sm" style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;">
                        <div class="flex items-center gap-3">
                            <div class="w-6 h-6 rounded-md bg-gray-500 flex items-center justify-center text-white shadow-sm">
                                <i data-lucide="user" class="w-3.5 h-3.5"></i>
                            </div>
                            <span><strong id="mobile-account-current-tab" class="font-medium text-white">Profile</strong></span>
                        </div>
                        <i data-lucide="chevron-down" class="w-4 h-4"></i>
                    </button>
                </div>

                <!-- IDENTITY TAB -->
                <div id="acct-panel-identity" class="acct-panel space-y-6">
                    
                    <!-- Profile Info Group -->
                    <div>
                        <div class="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-3xl border border-white/20 rounded-[24px] overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.2)]">
                            <div class="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.08] bg-white/[0.02]">
                                <h3 class="text-[13px] font-bold text-white/60 uppercase tracking-wide m-0" style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;">Profile Information</h3>
                                <button id="btn-edit-profile-modal" class="text-[12px] font-bold text-brand-400 bg-brand-500/10 hover:bg-brand-500/20 px-3.5 py-1.5 rounded-full transition-colors flex items-center gap-1.5 border border-brand-500/20 shadow-sm shadow-brand-500/5 active:bg-brand-500/30" style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;">
                                    <i data-lucide="edit-2" class="w-3.5 h-3.5"></i> Edit Info
                                </button>
                            </div>
                            
                            <!-- Display Name -->
                            <div class="flex items-center justify-between p-4 border-b border-white/[0.06]">
                                <span class="w-1/3 text-[15px] text-white" style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;">Name</span>
                                <span class="w-2/3 text-right text-[15px] text-white/70 truncate" style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;">${state.currentUser.name || 'Not set'}</span>
                            </div>
                            
                            <!-- Primary Mobile -->
                            <div class="flex items-center justify-between p-4 border-b border-white/[0.06]">
                                <span class="w-1/3 text-[15px] text-white" style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;">Phone</span>
                                <span class="w-2/3 text-right text-[15px] text-white/70 truncate" style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;">${state.currentUser.phone || 'Not set'}</span>
                            </div>
                            
                            <!-- Primary Email -->
                            <div class="flex items-center justify-between p-4">
                                <span class="w-1/3 text-[15px] text-white" style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;">Email</span>
                                <span class="w-2/3 text-right text-[15px] text-white/70 truncate" style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;">${state.currentUser.email || 'Not set'}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Currency & Alerts Row -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-0">
                        <!-- Currency Group -->
                        <div>
                            <div class="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-3xl border border-white/20 rounded-[24px] overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.2)] flex flex-col h-full">
                                <div class="px-5 py-4 border-b border-white/[0.08] bg-white/[0.02]">
                                    <h3 class="text-[13px] font-bold text-white/60 uppercase tracking-wide m-0" style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;">Currency</h3>
                                </div>
                                ${['INR', 'USD', 'EUR', 'GBP'].map((c, i, arr) => {
                                    const symbols = { INR: '₹', USD: '$', EUR: '€', GBP: '£' };
                                    const names = { INR: 'Indian Rupee', USD: 'US Dollar', EUR: 'Euro', GBP: 'Pound' };
                                    const isSel = state.preferences.currency === c;
                                    return `
                                        <button data-currency="${c}" class="currency-btn flex items-center justify-between p-4 transition-colors ${i !== arr.length - 1 ? 'border-b border-white/[0.06]' : ''} ${isSel ? 'bg-white/5' : 'hover:bg-white/[0.02]'}">
                                            <div class="text-left">
                                                <div class="font-medium text-[15px] text-white" style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;">${names[c]}</div>
                                            </div>
                                            <div class="flex items-center gap-3">
                                                <span class="text-[15px] text-white/50">${c}</span>
                                                ${isSel ? '<i data-lucide="check" class="w-4 h-4 text-brand-400"></i>' : '<div class="w-4 h-4"></div>'}
                                            </div>
                                        </button>
                                    `;
                                }).join('')}
                            </div>
                        </div>

                        <!-- Alerts Group -->
                        <div>
                            <div class="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-3xl border border-white/20 rounded-[24px] overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.2)] flex flex-col h-full">
                                <div class="px-5 py-4 border-b border-white/[0.08] bg-white/[0.02]">
                                    <h3 class="text-[13px] font-bold text-white/60 uppercase tracking-wide m-0" style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;">Notifications</h3>
                                </div>
                                ${[
                                    { id: 'chk-billing-alerts', pref: 'billingAlerts', label: 'Billing Warnings', icon: 'alert-circle', color: 'bg-orange-500' },
                                    { id: 'chk-sms-alerts', pref: 'smsAlerts', label: 'SMS Notifications', icon: 'message-square', color: 'bg-green-500' },
                                    { id: 'chk-monthly-reports', pref: 'monthlyReports', label: 'Monthly Report', icon: 'file-text', color: 'bg-blue-500' }
                                ].map((a, i, arr) => `
                                    <label class="flex items-center justify-between cursor-pointer select-none p-4 ${i !== arr.length - 1 ? 'border-b border-white/[0.06]' : ''} hover:bg-white/[0.02] transition-colors">
                                        <div class="flex items-center gap-3">
                                            <div class="w-7 h-7 rounded-lg ${a.color} flex items-center justify-center text-white shadow-sm">
                                                <i data-lucide="${a.icon}" class="w-4 h-4"></i>
                                            </div>
                                            <div class="text-[15px] text-white" style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;">${a.label}</div>
                                        </div>
                                        <div class="relative flex-shrink-0">
                                            <input type="checkbox" id="${a.id}" ${state.preferences[a.pref] ? 'checked' : ''} class="sr-only peer">
                                            <div class="w-12 h-7 bg-white/20 rounded-full transition-colors duration-300 peer-checked:bg-emerald-500 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all after:duration-300 peer-checked:after:translate-x-5 shadow-inner border border-white/10 peer-checked:border-emerald-400/50"></div>
                                        </div>
                                    </label>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- SOURCES TAB -->
                <div id="acct-panel-sources" class="acct-panel hidden space-y-6">
                    
                    <div>
                        <div class="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-3xl border border-white/20 rounded-[24px] overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.2)] mb-4 flex flex-col">
                            <div class="px-5 py-4 border-b border-white/[0.08] bg-white/[0.02]">
                                <h3 class="text-[13px] font-bold text-white/60 uppercase tracking-wide m-0" style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;">Linked Accounts</h3>
                            </div>
                            <div class="p-5">
                                <form id="connect-scan-directory-form" class="flex flex-col sm:flex-row gap-3">
                                    <div class="relative flex-1">
                                        <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-white/40 pointer-events-none">
                                            <i data-lucide="plus" class="w-4 h-4"></i>
                                        </span>
                                        <input type="text" id="scan-directory-input-field" required
                                            placeholder="Email or Phone Number"
                                            class="w-full bg-black/20 border border-white/10 rounded-[14px] py-3 pl-10 pr-4 text-[15px] text-white focus:outline-none focus:border-brand-500 transition-colors placeholder-white/30 shadow-inner"
                                            style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;">
                                    </div>
                                    <button type="submit" class="w-full sm:w-auto bg-brand-500 hover:bg-brand-400 text-white font-medium text-[15px] px-5 py-3 sm:py-0 rounded-[14px] transition-colors shadow-sm whitespace-nowrap" style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;">
                                        Link Account
                                    </button>
                                </form>
                            </div>
                        </div>

                        ${state.currentUser.linkedCredentials.length > 0 ? `
                        <div class="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-3xl border border-white/20 rounded-[24px] overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.2)]">
                            ${state.currentUser.linkedCredentials.map((cred, idx, arr) => {
                                const isEmail = cred.type === 'Email';
                                return `
                                    <div class="flex items-center justify-between p-4 ${idx !== arr.length - 1 ? 'border-b border-white/[0.06]' : ''}">
                                        <div class="flex items-center gap-4">
                                            <div class="w-9 h-9 rounded-[10px] ${isEmail ? 'bg-blue-500' : 'bg-green-500'} flex items-center justify-center flex-shrink-0 text-white shadow-sm">
                                                <i data-lucide="${isEmail ? 'mail' : 'smartphone'}" class="w-5 h-5"></i>
                                            </div>
                                            <div>
                                                <div class="font-medium text-[15px] text-white" style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;">${cred.value}</div>
                                                <div class="text-[13px] text-white/50" style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;">Linked ${cred.dateAdded}</div>
                                            </div>
                                        </div>
                                        <div class="flex items-center gap-3">
                                            <span class="text-[13px] text-white/50">Active</span>
                                            <button class="btn-delete-credential w-8 h-8 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-full flex items-center justify-center transition-colors" data-index="${idx}">
                                                <i data-lucide="minus-circle" class="w-5 h-5"></i>
                                            </button>
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                        ` : `
                        <div class="py-12 text-center border-2 border-dashed border-white/10 rounded-[24px]">
                            <p class="text-[15px] font-medium text-white mb-1" style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;">No linked accounts</p>
                            <p class="text-[13px] text-white/50" style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;">Add an email or phone number above</p>
                        </div>
                        `}
                    </div>
                </div>

                <!-- APPEARANCE TAB -->
                <div id="acct-panel-appearance" class="acct-panel hidden space-y-6">
                    <div>
                        <div class="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-3xl border border-white/20 rounded-[24px] overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.2)] flex flex-col">
                            <div class="px-5 py-4 border-b border-white/[0.08] bg-white/[0.02]">
                                <h3 class="text-[13px] font-bold text-white/60 uppercase tracking-wide m-0" style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;">App Theme</h3>
                            </div>
                            <div class="p-5 grid grid-cols-3 gap-4">
                                ${Object.keys(THEMES).map(themeName => {
                                    const isSelected = state.preferences.theme === themeName;
                                    const colors = THEMES[themeName];
                                    const displayName = themeName.charAt(0).toUpperCase() + themeName.slice(1);
                                    
                                    return `
                                        <button class="theme-select-btn flex flex-col items-center gap-3 p-4 rounded-[16px] transition-all focus:outline-none ${isSelected ? 'bg-white/10 ring-2 ring-brand-500 shadow-md' : 'hover:bg-white/5'}" data-theme="${themeName}">
                                            <div class="w-14 h-14 rounded-full flex items-center justify-center relative shadow-lg" style="background: conic-gradient(from 135deg, ${colors.brandHex}, ${colors.cosmicHex}, ${colors.brandHex});">
                                                <div class="absolute inset-[3px] rounded-full bg-[#1c1c1e]"></div>
                                                ${isSelected ? `<div class="absolute inset-0 flex items-center justify-center"><div class="w-4 h-4 rounded-full bg-white shadow-[0_0_10px_white]"></div></div>` : ''}
                                            </div>
                                            <span class="text-[13px] font-medium ${isSelected ? 'text-white' : 'text-white/60'}" style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;">${displayName}</span>
                                        </button>
                                    `;
                                }).join('')}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- DIAGNOSTICS TAB -->
                <div id="acct-panel-diagnostics" class="acct-panel hidden space-y-6">
                    <div>
                        <div class="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-3xl border border-white/20 rounded-[24px] overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.2)] flex flex-col h-full">
                            <div class="px-5 py-4 border-b border-white/[0.08] bg-white/[0.02]">
                                <h3 class="text-[13px] font-bold text-white/60 uppercase tracking-wide m-0" style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;">System Logs</h3>
                            </div>
                            <div class="p-5">
                                <div id="diagnostic-console" class="w-full h-48 bg-black/40 rounded-[14px] p-4 overflow-y-auto scrollbar-thin text-left flex flex-col gap-1.5 font-mono select-text shadow-inner border border-white/5">
                                ${logHtml}
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 class="text-[13px] font-semibold text-white/50 uppercase tracking-wide px-4 mb-2" style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;">System Info</h3>
                            <div class="bg-white/[0.04] border border-white/[0.08] rounded-[20px] overflow-hidden shadow-sm">
                                <div class="flex justify-between items-center p-4 border-b border-white/[0.06]">
                                    <span class="text-[15px] text-white" style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;">Sync Status</span>
                                    <span class="text-[15px] text-white/50">Complete</span>
                                </div>
                                <div class="flex justify-between items-center p-4 border-b border-white/[0.06]">
                                    <span class="text-[15px] text-white" style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;">Encryption</span>
                                    <span class="text-[15px] text-white/50">AES-256 GCM</span>
                                </div>
                                <div class="flex justify-between items-center p-4 border-b border-white/[0.06]">
                                    <span class="text-[15px] text-white" style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;">Scans</span>
                                    <span class="text-[15px] text-white/50" id="diag-scans-run">${state.diagnostics.scansRun || 0}</span>
                                </div>
                                <div class="flex justify-between items-center p-4">
                                    <span class="text-[15px] text-white" style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;">Gateways</span>
                                    <span class="text-[15px] text-white/50" id="diag-api-connected">${state.diagnostics.apiConnected || 0} / 8</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 class="text-[13px] font-semibold text-white/50 uppercase tracking-wide px-4 mb-2" style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;">Backup</h3>
                            <div class="bg-white/[0.04] border border-white/[0.08] rounded-[20px] overflow-hidden shadow-sm">
                                <button id="btn-export-backup" class="w-full flex items-center justify-between p-4 border-b border-white/[0.06] hover:bg-white/[0.02] transition-colors">
                                    <span class="text-[15px] text-white" style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;">Export Data</span>
                                    <i data-lucide="chevron-right" class="w-4 h-4 text-white/30"></i>
                                </button>
                                <button id="btn-trigger-import" type="button" onclick="document.getElementById('backup-import-file').click()" class="w-full flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors text-brand-400">
                                    <span class="text-[15px]" style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;">Import Data...</span>
                                </button>
                                <input type="file" id="backup-import-file" class="hidden" accept=".json" onchange="handleBackupImport(event)">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Mobile Action buttons (Hidden on desktop, styled like iOS destructive actions at bottom) -->
            <div class="lg:hidden w-full order-3 mt-6">
                <div class="bg-white/[0.04] border border-white/[0.08] rounded-[20px] overflow-hidden shadow-sm">
                    <button onclick="document.getElementById('btn-open-avatar-modal').click()" class="w-full flex items-center justify-center p-4 border-b border-white/[0.06] hover:bg-white/[0.02] transition-colors active:bg-white/10">
                        <span class="text-[15px] text-white" style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;">Edit Picture</span>
                    </button>
                    <button onclick="triggerAccountReset()" class="w-full flex items-center justify-center p-4 border-b border-white/[0.06] hover:bg-white/[0.02] transition-colors active:bg-white/10">
                        <span class="text-[15px] text-red-500" style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;">Log Out</span>
                    </button>
                    <button onclick="triggerDeleteAccount()" class="w-full flex items-center justify-center p-4 hover:bg-white/[0.02] transition-colors active:bg-white/10">
                        <span class="text-[15px] text-red-500 font-semibold" style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;">Delete Account</span>
                    </button>
                </div>
            </div>
            
        </div>
    `;

    container.innerHTML = html;
    bindAccountEventListeners();

    const editInfoBtn = document.getElementById('btn-edit-profile-modal');
    if (editInfoBtn) {
        editInfoBtn.addEventListener('click', () => {
            if(window.openProfileEditModal) window.openProfileEditModal();
        });
    }

    // Wire avatar click zone to open modal
    const avatarZone = document.getElementById('account-avatar-click-zone');
    if (avatarZone) avatarZone.addEventListener('click', () => {
        const btn = document.getElementById('btn-open-avatar-modal');
        if (btn) btn.click();
    });

    // GSAP entrance animations
    gsap.fromTo('.acct-panel > *', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out', stagger: 0.08, delay: 0.05 });

    startDiagnosticLogging();
    lucide.createIcons();
    applyCardTiltEffect();
}

window.switchAccountTab = function(tabId) {
    document.querySelectorAll('.acct-panel').forEach(p => p.classList.add('hidden'));
    
    document.querySelectorAll('.acct-tab-btn').forEach(b => {
        const active = b.getAttribute('data-acct-tab') === tabId;
        
        // Remove active styles
        b.classList.remove('bg-white/10');
        b.classList.add('hover:bg-white/5');
        
        const span = b.querySelector('span');
        if (span) {
            span.classList.remove('font-medium', 'text-white');
            span.classList.add('text-slate-300', 'group-hover:text-white');
        }
        
        if (active) {
            b.classList.add('bg-white/10');
            b.classList.remove('hover:bg-white/5');
            if (span) {
                span.classList.add('font-medium', 'text-white');
                span.classList.remove('text-slate-300', 'group-hover:text-white');
            }
        }
    });

    const panel = document.getElementById(`acct-panel-${tabId}`);
    if (panel) {
        panel.classList.remove('hidden');
        gsap.fromTo(panel.children, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power3.out', stagger: 0.07 });
    }
    
    // Update mobile dropdown text
    const mobileTxt = document.getElementById('mobile-account-current-tab');
    if (mobileTxt) {
        const labels = { identity: 'Profile', sources: 'Linked Accounts', appearance: 'Appearance', diagnostics: 'Advanced' };
        mobileTxt.textContent = labels[tabId] || 'Profile';
    }
    
    lucide.createIcons();
};

window.openProfileEditModal = function() {
    const existing = document.getElementById('profile-edit-modal');
    if (existing) existing.remove();

    const html = `
        <div id="profile-edit-modal" class="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-5">
            <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" id="profile-edit-backdrop"></div>
            <div class="relative z-10 w-full max-w-[400px] bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-3xl rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.2)] flex flex-col overflow-hidden border border-white/20" style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;">
                <div class="flex items-center justify-between p-5 sm:p-6 border-b border-white/[0.08]">
                    <h2 class="text-[20px] font-semibold text-white tracking-tight m-0">Edit Profile</h2>
                    <button id="btn-close-profile-modal" class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors border border-white/10 shadow-sm shrink-0">
                        <i data-lucide="x" class="w-4 h-4"></i>
                    </button>
                </div>
                <div class="p-5 sm:p-6 space-y-5">
                    <div>
                        <label class="block text-[13px] text-white/50 uppercase tracking-wide font-semibold mb-2">Name</label>
                        <input type="text" id="modal-input-name" value="${state.currentUser.name || ''}"
                            class="w-full bg-black/20 border border-white/10 rounded-[14px] px-4 py-3.5 text-[15px] text-white focus:outline-none focus:border-brand-500 focus:bg-black/40 transition-all shadow-inner"
                            placeholder="Your name">
                    </div>
                    <div>
                        <label class="block text-[13px] text-white/50 uppercase tracking-wide font-semibold mb-2">Phone</label>
                        <input type="tel" id="modal-input-phone" value="${state.currentUser.phone || ''}"
                            class="w-full bg-black/20 border border-white/10 rounded-[14px] px-4 py-3.5 text-[15px] text-white focus:outline-none focus:border-brand-500 focus:bg-black/40 transition-all shadow-inner"
                            placeholder="Phone number">
                    </div>
                    <div>
                        <label class="block text-[13px] text-white/50 uppercase tracking-wide font-semibold mb-2">Email</label>
                        <input type="email" id="modal-input-email" value="${state.currentUser.email || ''}"
                            class="w-full bg-black/20 border border-white/10 rounded-[14px] px-4 py-3.5 text-[15px] text-white focus:outline-none focus:border-brand-500 focus:bg-black/40 transition-all shadow-inner"
                            placeholder="Email address">
                    </div>
                </div>
                <div class="p-5 sm:p-6 pt-0 mt-2">
                    <button id="btn-save-modal-profile" class="w-full bg-brand-500 hover:bg-brand-400 text-white font-semibold text-[15px] py-3.5 rounded-[14px] transition-all shadow-sm">
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', html);
    lucide.createIcons();

    const modal = document.getElementById('profile-edit-modal');
    const content = modal.querySelector('.relative.z-10');
    
    gsap.fromTo(modal.querySelector('.absolute'), { opacity: 0 }, { opacity: 1, duration: 0.3 });
    gsap.fromTo(content, { opacity: 0, scale: 0.95, y: 10 }, { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'back.out(1.5)' });

    const closeModal = () => {
        gsap.to(modal.querySelector('.absolute'), { opacity: 0, duration: 0.25 });
        gsap.to(content, { opacity: 0, scale: 0.95, y: 10, duration: 0.25, ease: 'power2.in', onComplete: () => modal.remove() });
    };

    document.getElementById('btn-close-profile-modal').addEventListener('click', closeModal);
    document.getElementById('profile-edit-backdrop').addEventListener('click', closeModal);

    document.getElementById('btn-save-modal-profile').addEventListener('click', () => {
        const name = document.getElementById('modal-input-name').value.trim();
        const phone = document.getElementById('modal-input-phone').value.trim();
        const email = document.getElementById('modal-input-email').value.trim();
        
        if (name) state.currentUser.name = name;
        state.currentUser.phone = phone;
        state.currentUser.email = email;
        
        saveStateToStorage();
        syncAvatarUI();
        closeModal();
        
        // Re-render account tab to show changes, and ensure we stay on identity tab
        renderAccountTab();
        switchAccountTab('identity');
        
        // Show indicator
        const ind = document.getElementById('account-save-indicator');
        if (ind) {
            ind.classList.remove('hidden');
            ind.classList.add('flex');
            gsap.fromTo(ind, { opacity: 0, y: -8 }, { opacity: 1, y: 0, duration: 0.3, ease: 'back.out(2)' });
            setTimeout(() => {
                gsap.to(ind, { opacity: 0, y: -8, duration: 0.25, onComplete: () => {
                    ind.classList.add('hidden');
                    ind.classList.remove('flex');
                }});
            }, 2200);
        }
    });
};

    let pendingVibe = state.currentUser.avatar || 'nebula';
    let pendingIcon = state.currentUser.avatarIcon || null;
    let pendingCustomImage = state.currentUser.avatarBase64 || null;

    const curAvatar = state.currentUser.avatar || 'nebula';
    const activeAvatarVibe = AVATAR_VIBES[curAvatar] || AVATAR_VIBES.nebula;

    // Build modal HTML and inject into body
    const buildModalHTML = () => {
        const av = AVATAR_VIBES[pendingVibe] || AVATAR_VIBES.nebula;
        const firstChar = (state.currentUser.name || 'U')[0].toUpperCase();
        const iconCategories = Object.keys(AVATAR_ICONS);

        const vibeCards = Object.entries(AVATAR_VIBES).map(([id, v]) => {
            const active = pendingVibe === id;
            const borderClass = active ? 'border-brand-500 bg-brand-500/10' : 'border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08]';
            const shadowClass = active ? 'shadow-sm shadow-brand-500/20' : 'shadow-none';
            return `<button class="modal-vibe-btn flex flex-col items-center p-4 rounded-[20px] border ${borderClass} transition-all duration-300 ${shadowClass}" data-vibe="${id}" style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;">
                <div class="w-14 h-14 rounded-full bg-gradient-to-tr ${v.gradient} flex items-center justify-center shadow-md mb-3 ${active ? 'scale-110' : 'scale-100'} transition-transform">
                    <i data-lucide="${v.icon}" class="w-6 h-6 text-white"></i>
                </div>
                <span class="text-[13px] font-semibold ${active ? 'text-brand-400' : 'text-white/70'}">${v.name}</span>
            </button>`;
        }).join('');

        const iconGrid = iconCategories.map(category => {
            const btns = AVATAR_ICONS[category].map(opt => {
                const isActive = pendingIcon === opt.id;
                const borderClass = isActive ? 'border-brand-500 bg-brand-500/10' : 'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.06]';
                const shadowClass = isActive ? 'shadow-sm shadow-brand-500/10' : 'shadow-none';
                return `<button class="modal-icon-btn flex flex-col items-center p-3 rounded-[16px] border ${borderClass} transition-all duration-200 ${shadowClass}" data-icon="${opt.id}" style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;">
                    <i data-lucide="${opt.icon}" class="w-5 h-5 ${isActive ? 'text-brand-400' : 'text-white/50'} mb-1.5"></i>
                    <span class="text-[11px] font-medium ${isActive ? 'text-brand-400' : 'text-white/40'}">${opt.label}</span>
                </button>`;
            }).join('');
            return `<div class="mb-6">
                <div class="flex items-center gap-3 mb-4">
                    <h4 class="text-[12px] font-semibold text-white/40 uppercase tracking-widest" style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;">${category}</h4>
                    <div class="h-px flex-1 bg-white/[0.06]"></div>
                </div>
                <div class="grid grid-cols-4 sm:grid-cols-5 gap-2 sm:gap-3">${btns}</div>
            </div>`;
        }).join('');

        const previewInner = pendingCustomImage
            ? `<img src="${pendingCustomImage}" class="w-full h-full object-cover rounded-full">`
            : (pendingIcon
                ? `<i data-lucide="${pendingIcon}" class="w-12 h-12"></i>`
                : `<span style="font-size:42px;font-weight:700;font-family:-apple-system,BlinkMacSystemFont,sans-serif;">${firstChar}</span>`);

        return `
        <div id="avatar-modal" class="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-5">
            <style>
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            </style>
            <div id="avatar-modal-backdrop" class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
            <div id="avatar-modal-card" class="relative z-10 w-full max-w-[800px] bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-3xl rounded-[32px] border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.2)] flex flex-col sm:flex-row max-h-[90vh] overflow-hidden" style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;">
                <!-- Left Sidebar (Live Preview) -->
                <div class="w-full sm:w-[280px] bg-white/[0.03] border-b sm:border-b-0 sm:border-r border-white/20 p-4 sm:p-6 flex flex-col relative shrink-0">
                    
                    <!-- Header Row with Close Button (Mobile Only) -->
                    <div class="flex sm:hidden justify-between items-center mb-4">
                        <h3 class="text-[20px] font-semibold text-white tracking-tight m-0">Edit Avatar</h3>
                        <button class="avatar-modal-close-btn w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/70 transition-colors z-20 shadow-sm border border-white/10 shrink-0">
                            <i data-lucide="x" class="w-4 h-4"></i>
                        </button>
                    </div>
                    
                    <h3 class="hidden sm:block text-[20px] font-semibold text-white tracking-tight mb-8">Edit Avatar</h3>
                    
                    <div class="flex-1 flex flex-col items-center justify-center">
                        <div class="relative mb-3 sm:mb-6">
                            <div id="modal-avatar-ring" class="w-20 h-20 sm:w-32 sm:h-32 rounded-full bg-gradient-to-tr ${av.gradient} flex items-center justify-center text-white shadow-xl relative z-10">
                                ${previewInner}
                            </div>
                        </div>
                        <h4 class="text-[17px] font-semibold text-white tracking-tight mb-1">${state.currentUser.name || 'User'}</h4>
                        <span id="modal-preview-vibe" class="text-[11px] font-semibold text-brand-400 bg-brand-500/10 px-3 py-1 rounded-full uppercase tracking-wider">${av.name}</span>
                    </div>

                    <div class="mt-4 sm:mt-8 flex flex-col gap-2 sm:gap-3">
                        <div class="flex gap-2">
                            <button id="avatar-modal-upload-btn" onclick="document.getElementById('avatar-modal-upload').click()" class="flex-1 bg-white/[0.06] hover:bg-white/[0.1] text-white/80 text-[13px] font-semibold py-2.5 rounded-[12px] transition-colors flex justify-center items-center gap-1.5"><i data-lucide="image" class="w-4 h-4"></i> Upload</button>
                            <button id="avatar-modal-clear" class="flex-1 bg-white/[0.06] hover:bg-white/[0.1] text-white/80 text-[13px] font-semibold py-2.5 rounded-[12px] transition-colors flex justify-center items-center gap-1.5"><i data-lucide="x" class="w-4 h-4"></i> Clear</button>
                        </div>
                        <button id="avatar-modal-apply" class="w-full bg-brand-500 hover:bg-brand-400 text-white font-semibold text-[15px] py-3 rounded-[12px] transition-colors shadow-sm">Save Changes</button>
                        <input type="file" id="avatar-modal-upload" accept="image/*" class="hidden">
                    </div>
                </div>

                <!-- Right Content Area -->
                <div class="flex-1 flex flex-col min-w-0 min-h-0 bg-transparent relative">
                    <!-- Close Button (Absolute to right area, hidden on mobile) -->
                    <button class="avatar-modal-close-btn hidden sm:flex absolute top-5 right-5 w-8 h-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/70 transition-colors z-20 shadow-sm border border-white/10 shrink-0">
                        <i data-lucide="x" class="w-4 h-4"></i>
                    </button>

                    <div class="p-4 sm:p-6 sm:pt-16 pb-2 shrink-0 relative">
                        <!-- iOS Segmented Control -->
                        <div class="flex bg-white/5 p-1 rounded-[14px] border border-white/[0.06]">
                            <button id="modal-tab-vibe" class="flex-1 py-2 rounded-[10px] bg-white/10 text-white text-[13px] font-semibold shadow-sm border border-white/[0.08] transition-all">Colour Vibe</button>
                            <button id="modal-tab-icon" class="flex-1 py-2 rounded-[10px] bg-transparent text-white/50 hover:text-white/80 text-[13px] font-semibold transition-all">Avatar Icon</button>
                        </div>
                        
                        <!-- Top Progressive Bar -->
                        <div id="modal-scroll-track" class="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5 opacity-0 transition-opacity duration-300">
                            <div id="modal-scroll-progress" class="h-full bg-gradient-to-r from-brand-400 to-purple-400 w-0 rounded-r-full"></div>
                        </div>
                    </div>
                    
                    <div id="modal-scroll-container" class="flex-1 overflow-y-auto px-4 sm:px-6 pb-6 sm:pb-8 no-scrollbar min-h-0">
                        <div id="modal-panel-vibe" class="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                            ${vibeCards}
                        </div>
                        <div id="modal-panel-icon" class="hidden">
                            ${iconGrid}
                        </div>
                    </div>
                </div>

            </div>
        </div>`;
    };


    const openModal = () => {
        pendingVibe = state.currentUser.avatar || 'nebula';
        pendingIcon = state.currentUser.avatarIcon || null;
        pendingCustomImage = state.currentUser.avatarBase64 || null;
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

        // --- Open animation ---
        const backdrop = modalEl.querySelector('#avatar-modal-backdrop');
        const card = modalEl.querySelector('#avatar-modal-card');

        // Start states
        gsap.set(modalEl, { opacity: 0 });
        if (backdrop) gsap.set(backdrop, { opacity: 0 });
        if (card) gsap.set(card, { scale: 0.88, y: 24, opacity: 0 });

        const tl = gsap.timeline();
        tl.to(modalEl, { opacity: 1, duration: 0.2, ease: 'power2.out' })
          .to(backdrop, { opacity: 1, duration: 0.3, ease: 'power2.out' }, '<')
          .to(card, { scale: 1, y: 0, opacity: 1, duration: 0.4, ease: 'back.out(1.4)' }, '<0.05');
    };

    const closeModal = () => {
        const modalEl = document.getElementById('avatar-modal');
        if (!modalEl) return;
        const backdrop = modalEl.querySelector('#avatar-modal-backdrop');
        const card = modalEl.querySelector('#avatar-modal-card');

        // --- Close animation ---
        const tl = gsap.timeline({
            onComplete: () => {
                modalEl.remove();
                document.body.style.overflow = '';
            }
        });
        if (card) tl.to(card, { scale: 0.9, y: 20, opacity: 0, duration: 0.25, ease: 'power2.in' });
        if (backdrop) tl.to(backdrop, { opacity: 0, duration: 0.2, ease: 'power2.in' }, '<0.05');
        tl.to(modalEl, { opacity: 0, duration: 0.2, ease: 'power2.in' }, '<');
    };

    document.addEventListener('click', (e) => {
        if (e.target.closest('#btn-open-avatar-modal') || e.target.closest('#btn-open-register-avatar-modal')) {
            openModal();
        }
    });

    function bindModalEvents() {
        // Bind Close buttons
        document.querySelectorAll('.avatar-modal-close-btn').forEach(btn => {
            btn.addEventListener('click', closeModal);
        });
        const backdrop = document.getElementById('avatar-modal-backdrop');
        const applyBtn = document.getElementById('avatar-modal-apply');
        const clearBtn = document.getElementById('avatar-modal-clear');
        const modalTabVibe = document.getElementById('modal-tab-vibe');
        const modalTabIcon = document.getElementById('modal-tab-icon');
        const modalPanelVibe = document.getElementById('modal-panel-vibe');
        const modalPanelIcon = document.getElementById('modal-panel-icon');

        if (backdrop) backdrop.addEventListener('click', closeModal);

        // Scroll Progress Bar Logic
        const scrollContainer = document.getElementById('modal-scroll-container');
        const scrollProgress = document.getElementById('modal-scroll-progress');
        const scrollTrack = document.getElementById('modal-scroll-track');
        
        const updateScrollProgress = () => {
            if (!scrollContainer || !scrollProgress || !scrollTrack) return;
            const scrollHeight = scrollContainer.scrollHeight - scrollContainer.clientHeight;
            if (scrollHeight > 0) {
                const scrollPercentage = (scrollContainer.scrollTop / scrollHeight) * 100;
                scrollProgress.style.width = `${scrollPercentage}%`;
                scrollTrack.classList.remove('opacity-0');
            } else {
                scrollTrack.classList.add('opacity-0');
                scrollProgress.style.width = '0%';
            }
        };

        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', updateScrollProgress, { passive: true });
            // Initial check
            setTimeout(updateScrollProgress, 100);
        }

        // Tab switching
        if (modalTabVibe && modalTabIcon) {
            modalTabVibe.addEventListener('click', () => {
                modalPanelVibe.style.display = 'grid';
                modalPanelIcon.style.display = 'none';
                modalTabVibe.className = 'flex-1 py-2 rounded-[10px] bg-white/10 text-white text-[13px] font-semibold shadow-sm border border-white/[0.08] transition-all';
                modalTabIcon.className = 'flex-1 py-2 rounded-[10px] bg-transparent text-white/50 hover:text-white/80 text-[13px] font-semibold transition-all';
                if (scrollContainer) scrollContainer.scrollTop = 0;
                updateScrollProgress();
            });
            modalTabIcon.addEventListener('click', () => {
                modalPanelVibe.style.display = 'none';
                modalPanelIcon.style.display = 'block';
                modalTabIcon.className = 'flex-1 py-2 rounded-[10px] bg-white/10 text-white text-[13px] font-semibold shadow-sm border border-white/[0.08] transition-all';
                modalTabVibe.className = 'flex-1 py-2 rounded-[10px] bg-transparent text-white/50 hover:text-white/80 text-[13px] font-semibold transition-all';
                if (scrollContainer) scrollContainer.scrollTop = 0;
                updateScrollProgress();
            });
        }

        // Update preview
        const updatePreview = () => {
            const ring = document.getElementById('modal-avatar-ring');
            if (!ring) return;
            const vibe = AVATAR_VIBES[pendingVibe] || AVATAR_VIBES.nebula;
            ring.className = `w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr ${vibe.gradient} flex items-center justify-center text-white border-2 border-white/10 relative shadow-[0_0_40px_rgba(236,72,153,0.2)]`;
            
            if (pendingCustomImage) {
                ring.innerHTML = `<img src="${pendingCustomImage}" class="w-full h-full object-cover rounded-full">`;
            } else if (pendingIcon) {
                ring.innerHTML = `<i data-lucide="${pendingIcon}" class="w-11 h-11"></i>`;
                lucide.createIcons({ nodes: [ring] });
            } else {
                ring.innerHTML = `<span class="text-4xl font-black font-space">${(state.currentUser.name || 'U')[0].toUpperCase()}</span>`;
            }
            
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
                    
                    const borderClass = isNow ? 'border-brand-500 bg-brand-500/10' : 'border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08]';
                    const shadowClass = isNow ? 'shadow-sm shadow-brand-500/20' : 'shadow-none';
                    
                    b.className = `modal-vibe-btn flex flex-col items-center p-4 rounded-[20px] border ${borderClass} transition-all duration-300 ${shadowClass}`;
                    b.style.fontFamily = "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif";
                    
                    const ring = b.querySelector('.rounded-full.bg-gradient-to-tr');
                    if (ring) ring.className = ring.className.replace(/scale-\d+/, isNow ? 'scale-110' : 'scale-100');
                    const text = b.querySelector('span');
                    if (text) text.className = `text-[13px] font-semibold ${isNow ? 'text-brand-400' : 'text-white/70'}`;
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
                    
                    const borderClass = isNow ? 'border-brand-500 bg-brand-500/10' : 'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.06]';
                    const shadowClass = isNow ? 'shadow-sm shadow-brand-500/10' : 'shadow-none';

                    b.className = `modal-icon-btn flex flex-col items-center p-3 rounded-[16px] border ${borderClass} transition-all duration-200 ${shadowClass}`;
                    b.style.fontFamily = "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif";
                    
                    const iconEl = b.querySelector('svg') || b.querySelector('i');
                    if (iconEl) iconEl.className = `w-5 h-5 ${isNow ? 'text-brand-400' : 'text-white/50'} mb-1.5`;
                    const labelEl = b.querySelector('span');
                    if (labelEl) labelEl.className = `text-[11px] font-medium ${isNow ? 'text-brand-400' : 'text-white/40'}`;
                });
            });
        });

        // Clear icon
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                pendingIcon = null;
                pendingCustomImage = null;
                updatePreview();
                document.querySelectorAll('.modal-icon-btn').forEach(b => {
                    b.className = 'modal-icon-btn flex flex-col items-center p-3 rounded-[16px] border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.06] shadow-none transition-all duration-200';
                    const iconEl = b.querySelector('svg') || b.querySelector('i');
                    if (iconEl) iconEl.className = 'w-5 h-5 text-white/50 mb-1.5';
                    const labelEl = b.querySelector('span');
                    if (labelEl) labelEl.className = 'text-[11px] font-medium text-white/40';
                });
            });
        }
        
        // Upload Custom Image
        const uploadInput = document.getElementById('avatar-modal-upload');
        if (uploadInput) {
            uploadInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(evt) {
                        pendingCustomImage = evt.target.result;
                        pendingIcon = null;
                        updatePreview();
                    };
                    reader.readAsDataURL(file);
                }
            });
        }

        // Apply
        if (applyBtn) {
            applyBtn.addEventListener('click', () => {
                state.currentUser.avatar = pendingVibe;
                state.currentUser.avatarIcon = pendingIcon;
                state.currentUser.avatarBase64 = pendingCustomImage;
                saveStateToStorage();
                
                syncAvatarUI();
                
                // Sync register avatar preview
                const regRing = document.getElementById('register-avatar-preview');
                if (regRing) {
                    const vibe = AVATAR_VIBES[pendingVibe] || AVATAR_VIBES.nebula;
                    regRing.className = `w-14 h-14 rounded-full bg-gradient-to-tr ${vibe.gradient} border border-white/10 flex items-center justify-center text-white shadow-lg flex-shrink-0 relative overflow-hidden`;
                    if (pendingCustomImage) {
                        regRing.innerHTML = `<img src="${pendingCustomImage}" class="w-full h-full object-cover">`;
                    } else if (pendingIcon) {
                        regRing.innerHTML = `<i data-lucide="${pendingIcon}" class="w-7 h-7 text-white"></i>`;
                        lucide.createIcons({ nodes: [regRing] });
                    } else {
                        regRing.innerHTML = `<span class="text-xl font-black font-space">${(state.currentUser.name || 'U')[0].toUpperCase()}</span>`;
                    }
                    if (typeof selectedRegisterAvatar !== 'undefined') {
                        selectedRegisterAvatar = pendingVibe;
                    }
                    if (typeof selectedRegisterIcon !== 'undefined') {
                        selectedRegisterIcon = pendingIcon;
                    }
                }

                closeModal();
            });
        }
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
            
            // Sudden choose implementation - NO full re-render!
            document.querySelectorAll('.theme-select-btn').forEach(b => {
                const bTheme = b.getAttribute('data-theme');
                const isNow = bTheme === themeChoice;
                
                // Update container classes
                if (isNow) {
                    b.classList.add('bg-white/10', 'ring-2', 'ring-brand-500', 'shadow-md');
                    b.classList.remove('hover:bg-white/5');
                } else {
                    b.classList.remove('bg-white/10', 'ring-2', 'ring-brand-500', 'shadow-md');
                    b.classList.add('hover:bg-white/5');
                }
                
                // Update inner circle indicator
                const circleContainer = b.querySelector('.w-14.h-14');
                if (circleContainer) {
                    const existingIndicator = circleContainer.querySelector('.absolute.inset-0');
                    if (isNow && !existingIndicator) {
                        circleContainer.insertAdjacentHTML('beforeend', `<div class="absolute inset-0 flex items-center justify-center"><div class="w-4 h-4 rounded-full bg-white shadow-[0_0_10px_white]"></div></div>`);
                    } else if (!isNow && existingIndicator) {
                        existingIndicator.remove();
                    }
                }
                
                // Update text color
                const textEl = b.querySelector('span');
                if (textEl) {
                    if (isNow) {
                        textEl.classList.add('text-white');
                        textEl.classList.remove('text-white/60');
                    } else {
                        textEl.classList.remove('text-white');
                        textEl.classList.add('text-white/60');
                    }
                }
            });
        });
    });

    // 7. Preferences currency change
    const currencyBtns = document.querySelectorAll('.currency-btn');
    currencyBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const newCur = e.currentTarget.getAttribute('data-currency');
            if (newCur !== state.preferences.currency) {
                state.preferences.currency = newCur;
                saveStateToStorage();
                
                // Sudden choose implementation - NO full re-render!
                // Just update the buttons directly for zero latency and no layout bounce
                currencyBtns.forEach(b => {
                    const c = b.getAttribute('data-currency');
                    const isNow = c === newCur;
                    
                    if (isNow) {
                        b.classList.add('bg-white/5');
                        b.classList.remove('hover:bg-white/[0.02]');
                    } else {
                        b.classList.remove('bg-white/5');
                        b.classList.add('hover:bg-white/[0.02]');
                    }
                    
                    const rightArea = b.querySelector('.flex.items-center.gap-3');
                    if (rightArea) {
                        rightArea.innerHTML = isNow 
                            ? `<span class="text-[15px] text-white/50">${c}</span><i data-lucide="check" class="w-4 h-4 text-brand-400"></i>`
                            : `<span class="text-[15px] text-white/50">${c}</span><div class="w-4 h-4"></div>`;
                    }
                });
                
                lucide.createIcons();
            }
        });
    });

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
            downloadAnchor.setAttribute("download", `SubEasy_backup_${Date.now()}.json`);
            document.body.appendChild(downloadAnchor);
            downloadAnchor.click();
            downloadAnchor.remove();
        });
    }
}

window.handleBackupImport = function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const parsed = JSON.parse(e.target.result);
            if (parsed && typeof parsed === 'object' && parsed.currentUser && Array.isArray(parsed.subscriptions)) {
                state.currentUser = { ...state.currentUser, ...parsed.currentUser };
                state.subscriptions = parsed.subscriptions;
                if (parsed.preferences) state.preferences = { ...state.preferences, ...parsed.preferences };
                if (parsed.diagnostics) state.diagnostics = { ...state.diagnostics, ...parsed.diagnostics };
                if (parsed.billingCard) state.billingCard = { ...state.billingCard, ...parsed.billingCard };
                
                saveStateToStorage();
                alert("System state successfully restored from backup!");
                
                initAppView();
                if (state.activeTab === 'account') {
                    renderAccountTab();
                    switchAccountTab('diagnostics');
                }
            } else {
                alert("Invalid backup file format. Must contain valid user identity and subscriptions data.");
            }
        } catch (err) {
            console.error("Error parsing backup JSON:", err);
            alert("Failed to parse the backup file. Please ensure it is a valid JSON file exported from Subscription Manager.");
        }
    };
    reader.readAsText(file);
};

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

// ==========================================
// MODERN LOGOUT / DELETE SCREEN OVERLAY
// ==========================================
function showModernLogoutOverlay(type) {
    const isDelete = type === 'delete';
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 z-[10000] flex items-center justify-center bg-[#04020a]/90 backdrop-blur-xl transition-opacity duration-300 opacity-0';
    
    const title = isDelete ? 'Delete Account' : 'Disconnect Session';
    const msg = isDelete ? 'This will permanently wipe all your subscription settings, billing cards, and linked scanner directories from this browser. This action cannot be undone.' : 'Are you sure you want to disconnect? This will securely clear your local configuration logs and end your session.';
    const btnText = isDelete ? 'Yes, Purge Data' : 'Yes, Disconnect';
    
    const bgClass = isDelete ? 'bg-red-500 hover:bg-red-600 shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'bg-purple-500 hover:bg-purple-600 shadow-[0_0_20px_rgba(168,85,247,0.3)]';
    const textClass = isDelete ? 'text-red-500' : 'text-purple-400';
    const borderClass = isDelete ? 'border-red-500/20' : 'border-purple-500/20';
    const iconBgClass = isDelete ? 'bg-red-500/10' : 'bg-purple-500/10';
    const spinnerClass = isDelete ? 'border-red-500' : 'border-purple-500';
    
    overlay.innerHTML = `
        <div class="bg-[#0b0a10] border border-[#222] rounded-[32px] p-8 max-w-sm w-full mx-4 shadow-[0_30px_80px_rgba(0,0,0,0.8)] transform scale-95 transition-transform duration-300" id="logout-modal-box">
            <div class="w-16 h-16 rounded-full ${iconBgClass} flex items-center justify-center border ${borderClass} mb-6 mx-auto">
                <i data-lucide="${isDelete ? 'user-x' : 'log-out'}" class="w-8 h-8 ${textClass}"></i>
            </div>
            <h3 class="text-2xl font-bold text-white text-center font-space mb-3">${title}</h3>
            <p class="text-sm text-slate-400 text-center font-sans mb-8 leading-relaxed">${msg}</p>
            <div class="space-y-3">
                <button id="btn-confirm-action" class="w-full ${bgClass} text-white font-bold font-sans py-3.5 rounded-xl transition-all">${btnText}</button>
                <button id="btn-cancel-action" class="w-full bg-transparent border border-[#333] hover:border-slate-500 text-slate-300 font-bold font-sans py-3.5 rounded-xl transition-all">Cancel</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    lucide.createIcons({ nodes: [overlay] });
    
    setTimeout(() => {
        overlay.classList.remove('opacity-0');
        document.getElementById('logout-modal-box').classList.remove('scale-95');
    }, 10);
    
    const closeOverlay = () => {
        overlay.classList.add('opacity-0');
        document.getElementById('logout-modal-box').classList.add('scale-95');
        setTimeout(() => overlay.remove(), 300);
    };
    
    document.getElementById('btn-cancel-action').addEventListener('click', closeOverlay);
    
    document.getElementById('btn-confirm-action').addEventListener('click', () => {
        const box = document.getElementById('logout-modal-box');
        box.innerHTML = `
            <div class="flex flex-col items-center justify-center py-6">
                <div class="relative w-20 h-20 mb-6 flex items-center justify-center">
                    <div class="absolute inset-0 rounded-full border-t-2 border-b-2 ${spinnerClass} animate-spin"></div>
                    <div class="absolute inset-2 rounded-full border-l-2 border-r-2 border-white/20 animate-[spin_1.5s_reverse_infinite]"></div>
                    <i data-lucide="${isDelete ? 'trash-2' : 'shield-check'}" class="w-8 h-8 ${textClass}"></i>
                </div>
                <h3 class="text-lg font-bold ${textClass} uppercase tracking-widest font-space mb-2">${isDelete ? 'Purging Data...' : 'Disconnecting...'}</h3>
                <div class="h-5 overflow-hidden w-full relative text-center">
                    <div id="action-logs" class="text-[10px] text-slate-500 font-mono tracking-wider absolute w-full transition-transform duration-300"></div>
                </div>
            </div>
        `;
        lucide.createIcons({ nodes: [box] });
        
        const logs = isDelete ? [
            "Erasing local credentials...",
            "Destroying session tokens...",
            "Wiping subscription cache...",
            "Account permanently deleted."
        ] : [
            "Terminating secure session...",
            "Clearing memory state...",
            "Revoking access keys...",
            "Successfully disconnected."
        ];
        
        const logsContainer = document.getElementById('action-logs');
        let logIndex = 0;
        const logInterval = setInterval(() => {
            if (logIndex < logs.length) {
                logsContainer.innerHTML += `<div>> ${logs[logIndex]}</div>`;
                logsContainer.style.transform = `translateY(-${logIndex * 20}px)`;
                logIndex++;
            }
        }, 500);
        
        setTimeout(() => {
            clearInterval(logInterval);
            closeOverlay();
            setTimeout(async () => {
                if (diagnosticInterval) {
                    clearInterval(diagnosticInterval);
                    diagnosticInterval = null;
                }
                if (isSupabaseConfigured) {
                    try {
                        await supabaseClient.auth.signOut();
                    } catch (e) {
                        console.error("Sign out error:", e);
                    }
                }
                
                if (isDelete) {
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
                }
                
                sessionStorage.clear();
                document.documentElement.classList.remove('is-logged-in'); 
                
                state = {
                    isLoggedIn: false,
                    currentUser: { name: 'User', phone: '', email: '', avatar: 'nebula', linkedCredentials: [] },
                    subscriptions: [],
                    activeTab: 'home',
                    preferences: { theme: 'cosmic', currency: 'INR', billingAlerts: true, smsAlerts: false, monthlyReports: true },
                    billingCard: { number: '', name: '', expiry: '', cvv: '', provider: 'visa' },
                    diagnostics: { scansRun: 0, apiConnected: 0, lastScanTime: '' }
                };
                
                initAppView();
                lucide.createIcons();
            }, 300);
        }, 2200);
    });
}

function triggerAccountReset() {
    showModernLogoutOverlay('logout');
}

function triggerDeleteAccount() {
    showModernLogoutOverlay('delete');
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
    
    document.getElementById('success-new-cost').innerText = `${formatCurrency(newMonthlyTotal)}/mo`;
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
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
            auth: {
                storage: window.sessionStorage
            }
        });
        isSupabaseConfigured = true;
        console.log("⚡ Supabase Client initialized successfully.");
    } catch (e) {
        console.error("❌ Failed to initialize Supabase client:", e);
    }
} else {
    console.log("ℹ️ Supabase URL/AnonKey not configured. Running in simulated Developer Mock Mode.");
}

// ==========================================
// CLOUD SYNC FUNCTIONS (Supabase user_profiles)
// ==========================================

// Build a lean payload of state for cloud storage
function getCloudSyncPayload() {
    const userCopy = { ...state.currentUser };
    // Skip very large base64 images (>150KB) to stay within Supabase row limits
    if (userCopy.avatarBase64 && userCopy.avatarBase64.length > 150000) {
        userCopy.avatarBase64 = null;
    }
    return {
        currentUser: userCopy,
        subscriptions: state.subscriptions,
        preferences: state.preferences,
        billingCard: state.billingCard,
        diagnostics: state.diagnostics,
        activeTab: state.activeTab,
        syncedAt: new Date().toISOString()
    };
}

// Show a permanent sync indicator on Home tab
function showSyncIndicator(success = true, isSyncing = false) {
    // Keep track of the last status so renderHomeTab can render it correctly on tab switch
    window._lastSyncStatus = isSyncing ? 'syncing' : (success ? 'success' : 'error');
    
    const badge = document.getElementById('home-sync-status');
    
    // Clean up old toast if it exists (for backward compatibility during session)
    const oldToast = document.getElementById('cloud-sync-indicator');
    if (oldToast) oldToast.remove();
    
    if (!badge) return; // Only updates if the user is currently looking at the Home tab
    
    if (isSyncing) {
        badge.innerHTML = `
            <i data-lucide="cloud-upload" class="w-4 h-4"></i>
            <span>Syncing...</span>
        `;
        badge.className = 'mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-[11px] font-bold tracking-wide transition-all duration-500 shadow-[0_0_10px_rgba(234,179,8,0.2)] animate-pulse';
    } else if (success) {
        badge.innerHTML = `
            <i data-lucide="cloud-check" class="w-4 h-4"></i>
            <span>Synced to Cloud</span>
        `;
        badge.className = 'mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-[11px] font-bold tracking-wide shadow-[0_0_15px_rgba(var(--brand-rgb),0.3)] transition-all duration-500';
    } else {
        badge.innerHTML = `
            <i data-lucide="cloud-off" class="w-4 h-4"></i>
            <span>Sync Offline</span>
        `;
        badge.className = 'mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-[11px] font-bold tracking-wide transition-all duration-500';
    }
    
    lucide.createIcons({ nodes: [badge] });
}

// Push current state to Supabase cloud
async function syncToCloud() {
    if (!isSupabaseConfigured || !state.isLoggedIn || !state.currentUser.email) return;
    try {
        const payload = getCloudSyncPayload();
        const { error } = await supabaseClient
            .from('user_profiles')
            .upsert(
                { email: state.currentUser.email, profile_data: payload, updated_at: new Date().toISOString() },
                { onConflict: 'email' }
            );
        if (error) {
            console.warn('⚠ Cloud sync failed:', error.message);
            showSyncIndicator(false);
        } else {
            console.log('✅ Synced to cloud');
            showSyncIndicator(true);
        }
    } catch (e) {
        console.warn('⚠ Cloud sync exception:', e);
        showSyncIndicator(false);
    }
}

// Fetch saved state from Supabase cloud for this email
async function loadFromCloud(email) {
    if (!isSupabaseConfigured || !email) return null;
    try {
        const { data, error } = await supabaseClient
            .from('user_profiles')
            .select('profile_data')
            .eq('email', email)
            .maybeSingle();

        if (error || !data || !data.profile_data) {
            console.log('ℹ️ No cloud profile found for:', email);
            return null;
        }

        const cloud = data.profile_data;

        // Merge cloud data into live state
        if (cloud.subscriptions) state.subscriptions = cloud.subscriptions;
        if (cloud.preferences)   state.preferences   = { ...state.preferences,   ...cloud.preferences };
        if (cloud.billingCard)   state.billingCard   = { ...state.billingCard,   ...cloud.billingCard };
        if (cloud.diagnostics)   state.diagnostics   = { ...state.diagnostics,   ...cloud.diagnostics };
        if (cloud.currentUser) {
            state.currentUser = {
                ...state.currentUser,
                ...cloud.currentUser,
                // Always keep freshly-entered email/phone from this login
                email: state.currentUser.email || cloud.currentUser.email,
                phone: state.currentUser.phone || cloud.currentUser.phone,
                linkedCredentials: state.currentUser.linkedCredentials.length
                    ? state.currentUser.linkedCredentials
                    : (cloud.currentUser.linkedCredentials || [])
            };
        }

        console.log('✅ Loaded cloud profile for:', email);
        return cloud;
    } catch (e) {
        console.warn('⚠ loadFromCloud exception:', e);
        return null;
    }
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
        if (toggleLabel) toggleLabel.innerText = "New to SubEasy?";
        if (toggleBtn) toggleBtn.innerText = "Create Account";
        if (gmailBtnText) gmailBtnText.innerText = "Continue with Google";
    }
}

// Google OAuth Redirect Sign In
async function signInWithGmail() {
    localStorage.setItem('auth_mode_redirect', authMode);
    if (isSupabaseConfigured) {
        try {
            let basePath = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);
            if (basePath === '') basePath = '/';
            const { error } = await supabaseClient.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin + basePath + 'dashboard.html',
                    queryParams: {
                        prompt: 'select_account' // Always show account chooser
                    }
                }
            });
            if (error) {
                alert(`Google Login Error: ${error.message}`);
            }
        } catch (err) {
            alert(`Failed to contact Supabase for Google OAuth: ${err.message}`);
        }
    } else {
        // Simulated mock redirect to our Google Auth mock page
        let basePath = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);
        if (basePath === '') basePath = '/';
        window.location.href = window.location.origin + basePath + 'google-auth.html?redirect_uri=' + encodeURIComponent(basePath + 'dashboard.html') + '&auth_mode=' + encodeURIComponent(authMode);
    }
}

// Show Profile Registration Setup screen
function showRegisterSetup(name, email) {
    // Hide scan form panel
    const formPanel = document.getElementById('scan-form-panel');
    if (formPanel) formPanel.classList.add('hidden');
    
    // Show register setup panel
    const regPanel = document.getElementById('register-setup-panel');
    if (regPanel) regPanel.classList.remove('hidden');

    // Reset name field
    const nameInput = document.getElementById('register-name');
    if (nameInput) nameInput.value = name || '';

    // Save target email in state
    state.currentUser.email = email || 'mock.user@gmail.com';

    // Hide main hero content on mobile during registration
    const heroContent = document.getElementById('login-hero-content');
    if (heroContent) {
        heroContent.classList.remove('flex');
        heroContent.classList.add('hidden', 'lg:flex');
    }
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

            // Restore hero content on mobile
            const heroContent = document.getElementById('login-hero-content');
            if (heroContent) {
                heroContent.classList.remove('hidden', 'lg:flex');
                heroContent.classList.add('flex');
            }
        });
    }

    // Complete registration button
    const btnCompleteReg = document.getElementById('btn-complete-register');
    if (btnCompleteReg) {
        btnCompleteReg.addEventListener('click', () => {
            completeRegistration();
        });
    }

    // Legacy registerAvatarRow removed

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

    // Initialize Global Scroll Progressive Bar
    const globalScrollContainer = document.createElement('div');
    globalScrollContainer.id = 'global-scroll-progress-container';
    const globalProgressBar = document.createElement('div');
    globalProgressBar.id = 'global-scroll-progress-bar';
    globalScrollContainer.appendChild(globalProgressBar);
    document.body.appendChild(globalScrollContainer);

    const updateGlobalScroll = () => {
        // Calculate scroll progress for the whole window
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        
        if (scrollHeight > 0) {
            const scrollPercentage = (scrollTop / scrollHeight) * 100;
            globalProgressBar.style.width = `${scrollPercentage}%`;
            globalScrollContainer.style.opacity = '1';
        } else {
            globalScrollContainer.style.opacity = '0';
            globalProgressBar.style.width = '0%';
        }
    };

    window.addEventListener('scroll', updateGlobalScroll, { passive: true });
    window.addEventListener('resize', updateGlobalScroll, { passive: true });
    // Initial check
    setTimeout(updateGlobalScroll, 100);

    // Make sure it updates when switching tabs or changing content
    const observer = new MutationObserver(() => updateGlobalScroll());
    observer.observe(document.body, { childList: true, subtree: true });
}

