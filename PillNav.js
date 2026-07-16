class PillNav {
  constructor(options = {}) {
    this.container = options.container;
    this.logo = options.logo || 'favicon.png';
    this.logoAlt = options.logoAlt || 'Logo';
    this.items = options.items || [];
    this.activeHref = options.activeHref || '';
    this.className = options.className || '';
    this.ease = options.ease || 'power3.easeOut';
    this.baseColor = options.baseColor || '#fff';
    this.pillColor = options.pillColor || '#120F17';
    this.hoveredPillTextColor = options.hoveredPillTextColor || '#120F17';
    this.pillTextColor = options.pillTextColor || this.baseColor;
    this.onTabClick = options.onTabClick || null;
    this.initialLoadAnimation = options.initialLoadAnimation !== undefined ? options.initialLoadAnimation : true;

    this.circleRefs = [];
    this.tlRefs = [];
    this.activeTweenRefs = [];
    this.isMobileMenuOpen = false;

    if (!this.container) {
      console.error("PillNav: Container element is required.");
      return;
    }

    this.init();
  }

  init() {
    // Clear container
    this.container.innerHTML = '';

    // Apply CSS Variables
    const cssVars = {
      '--base': this.baseColor,
      '--pill-bg': this.pillColor,
      '--hover-text': this.hoveredPillTextColor,
      '--pill-text': this.pillTextColor,
      '--nav-h': '60px',
      '--logo': '48px',
      '--pill-pad-x': '28px',
      '--pill-gap': '8px'
    };

    // Apply styles to container
    Object.keys(cssVars).forEach(key => {
      this.container.style.setProperty(key, cssVars[key]);
    });

    // Create Navigation Elements
    const outerDiv = document.createElement('div');
    outerDiv.className = `relative z-[1000] w-full flex justify-center md:inline-flex md:w-auto ${this.className}`;
    
    const nav = document.createElement('nav');
    nav.className = 'w-[90%] md:w-max flex items-center justify-between md:justify-start box-border p-[4px] rounded-full border border-glassBorder/10 backdrop-blur-md bg-black/10';
    nav.setAttribute('aria-label', 'Primary');

    // Website Logo & Text (Far Left)
    const siteLogo = document.createElement('button');
    siteLogo.className = 'rounded-full p-1 inline-flex items-center justify-center overflow-hidden cursor-pointer focus:outline-none transition-transform hover:scale-105 active:scale-95 border-0 md:mr-12 mr-auto flex-shrink-0';
    siteLogo.style.height = 'var(--nav-h)';
    siteLogo.style.background = 'var(--base, #000)';
    
    const siteLogoInner = document.createElement('div');
    siteLogoInner.className = 'flex items-center h-full rounded-full overflow-hidden bg-[#0b0a10] border border-[#222] select-none shadow-inner pr-3.5 md:pr-4'; 
    
    const imgWrapper = document.createElement('div');
    imgWrapper.className = 'h-full aspect-square p-0.5 flex-shrink-0';
    imgWrapper.innerHTML = `<img src="${this.logo}" class="w-full h-full object-cover rounded-full" style="filter: brightness(1.15) drop-shadow(0 0 6px rgba(255,255,255,0.15));" alt="${this.logoAlt}">`;
    
    const logoText = document.createElement('span');
    logoText.className = 'text-[#5C9EE5] font-display-lg font-bold text-sm md:text-base ml-1.5 md:ml-2 tracking-wide';
    logoText.innerText = 'SubEasy';

    siteLogoInner.appendChild(imgWrapper);
    siteLogoInner.appendChild(logoText);
    siteLogo.appendChild(siteLogoInner);

    siteLogo.addEventListener('click', () => {
        if (this.onTabClick) this.onTabClick('scan');
    });

    // Logo Button (Right) - Switches to Account tab
    const logoLink = document.createElement('button');
    logoLink.className = 'rounded-full p-1 inline-flex items-center justify-center overflow-hidden cursor-pointer focus:outline-none transition-transform hover:scale-105 active:scale-95 border-0';
    logoLink.style.width = 'var(--nav-h)';
    logoLink.style.height = 'var(--nav-h)';
    logoLink.style.background = 'var(--base, #000)';
    logoLink.setAttribute('aria-label', 'Account');

    const logoImg = document.createElement('div');
    logoImg.id = 'pillnav-logo-avatar';
    logoImg.className = 'w-full h-full rounded-full flex items-center justify-center text-sm font-black font-space select-none';
    logoImg.style.color = '#fff';
    logoImg.style.background = 'linear-gradient(135deg, var(--brand-600), var(--cosmicBlue-600))';
    logoImg.innerText = 'U'; // Loaded dynamically from user state
    logoLink.appendChild(logoImg);

    // Bind logo hover effect
    logoLink.addEventListener('mouseenter', () => {
      gsap.killTweensOf(logoImg);
      gsap.set(logoImg, { rotate: 0 });
      gsap.to(logoImg, {
        rotate: 360,
        duration: 0.3,
        ease: this.ease,
        overwrite: 'auto'
      });
    });

    logoLink.addEventListener('click', () => {
      if (this.onTabClick) this.onTabClick('account');
    });

    // Nav Items (Middle)
    const navItems = document.createElement('div');
    navItems.className = 'relative items-center rounded-full hidden md:flex mr-12';
    navItems.style.height = 'var(--nav-h)';
    navItems.style.background = 'var(--base, #000)';

    const ul = document.createElement('ul');
    ul.className = 'list-none flex items-stretch m-0 p-[3px] h-full';
    ul.style.gap = 'var(--pill-gap)';
    ul.setAttribute('role', 'menubar');

    this.items.forEach((item, i) => {
      const isActive = this.activeHref === item.href;

      const li = document.createElement('li');
      li.className = 'flex h-full';
      li.setAttribute('role', 'none');

      const a = document.createElement('button');
      a.className = 'relative overflow-hidden inline-flex items-center justify-center h-full no-underline rounded-full box-border font-bold text-sm uppercase tracking-wider whitespace-nowrap cursor-pointer px-6 border-0 focus:outline-none transition-all';
      a.style.background = 'var(--pill-bg, #fff)';
      a.style.color = 'var(--pill-text, var(--base, #000))';
      a.style.paddingLeft = 'var(--pill-pad-x)';
      a.style.paddingRight = 'var(--pill-pad-x)';
      a.setAttribute('role', 'menuitem');
      a.setAttribute('aria-label', item.label);

      // Circles for reveal animation
      const hoverCircle = document.createElement('span');
      hoverCircle.className = 'hover-circle absolute left-1/2 bottom-0 rounded-full z-[1] block pointer-events-none';
      hoverCircle.style.background = 'var(--base, #000)';
      hoverCircle.style.willChange = 'transform';
      this.circleRefs[i] = hoverCircle;
      a.appendChild(hoverCircle);

      // Label stack
      const labelStack = document.createElement('span');
      labelStack.className = 'label-stack relative inline-block leading-[1] z-[2]';
      
      const pillLabel = document.createElement('span');
      pillLabel.className = 'pill-label relative z-[2] inline-block leading-[1]';
      pillLabel.style.willChange = 'transform';
      pillLabel.innerText = item.label;

      const pillLabelHover = document.createElement('span');
      pillLabelHover.className = 'pill-label-hover absolute left-0 top-0 z-[3] inline-block';
      pillLabelHover.style.color = 'var(--hover-text, #fff)';
      pillLabelHover.style.willChange = 'transform, opacity';
      pillLabelHover.setAttribute('aria-hidden', 'true');
      pillLabelHover.innerText = item.label;

      labelStack.appendChild(pillLabel);
      labelStack.appendChild(pillLabelHover);
      a.appendChild(labelStack);

      // Active Indicator dot under active tab
      if (isActive) {
        const dot = document.createElement('span');
        dot.className = 'absolute left-1/2 -bottom-[3px] -translate-x-1/2 w-1.5 h-1.5 rounded-full z-[4]';
        dot.style.background = 'var(--base, #000)';
        a.appendChild(dot);
      }

      // Event handlers
      a.addEventListener('mouseenter', () => this.handleEnter(i));
      a.addEventListener('mouseleave', () => this.handleLeave(i));
      a.addEventListener('click', () => {
        if (this.onTabClick) this.onTabClick(item.href);
      });

      li.appendChild(a);
      ul.appendChild(li);
    });

    navItems.appendChild(ul);
    
    // Append in the new order: SiteLogo -> NavItems -> LogoLink
    nav.appendChild(siteLogo);
    nav.appendChild(navItems);
    nav.appendChild(logoLink);

    outerDiv.appendChild(nav);

    this.container.appendChild(outerDiv);

    // Initialize layout and GSAP timelines
    setTimeout(() => {
      this.layout(navItems);
      this.animateEntrance(logoLink, navItems);
    }, 50);

    this.resizeHandler = () => this.layout(navItems);
    window.addEventListener('resize', this.resizeHandler);
  }

  layout(navItems) {
    this.circleRefs.forEach((circle, i) => {
      if (!circle || !circle.parentElement) return;

      const pill = circle.parentElement;
      const rect = pill.getBoundingClientRect();
      const { width: w, height: h } = rect;

      // Circle radius math to cover the rectangular pill
      const R = ((w * w) / 4 + h * h) / (2 * h);
      const D = Math.ceil(2 * R) + 2;
      const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
      const originY = D - delta;

      circle.style.width = `${D}px`;
      circle.style.height = `${D}px`;
      circle.style.bottom = `-${delta}px`;

      gsap.set(circle, {
        xPercent: -50,
        scale: 0,
        transformOrigin: `50% ${originY}px`
      });

      const label = pill.querySelector('.pill-label');
      const white = pill.querySelector('.pill-label-hover');

      if (label) gsap.set(label, { y: 0 });
      if (white) gsap.set(white, { y: h + 12, opacity: 0 });

      this.tlRefs[i]?.kill();
      const tl = gsap.timeline({ paused: true });

      tl.to(circle, { scale: 1.25, xPercent: -50, duration: 0.6, ease: this.ease, overwrite: 'auto' }, 0);

      if (label) {
        tl.to(label, { y: -(h + 8), duration: 0.6, ease: this.ease, overwrite: 'auto' }, 0);
      }

      if (white) {
        gsap.set(white, { y: Math.ceil(h + 10), opacity: 0 });
        tl.to(white, { y: 0, opacity: 1, duration: 0.6, ease: this.ease, overwrite: 'auto' }, 0);
      }

      this.tlRefs[i] = tl;
    });
  }

  animateEntrance(logoLink, navItems) {
    if (!this.initialLoadAnimation) return;

    if (logoLink) {
      gsap.fromTo(logoLink, { scale: 0 }, { scale: 1, duration: 0.6, ease: this.ease });
    }

    if (navItems) {
      gsap.fromTo(navItems, { width: 0, overflow: 'hidden' }, { width: 'auto', duration: 0.6, ease: this.ease });
    }
  }

  handleEnter(i) {
    const tl = this.tlRefs[i];
    if (!tl) return;
    this.activeTweenRefs[i]?.kill();
    this.activeTweenRefs[i] = tl.tweenTo(tl.duration(), {
      duration: 0.35,
      ease: this.ease,
      overwrite: 'auto'
    });
  }

  handleLeave(i) {
    const tl = this.tlRefs[i];
    if (!tl) return;
    this.activeTweenRefs[i]?.kill();
    this.activeTweenRefs[i] = tl.tweenTo(0, {
      duration: 0.25,
      ease: this.ease,
      overwrite: 'auto'
    });
  }

  destroy() {
    window.removeEventListener('resize', this.resizeHandler);
    this.circleRefs = [];
    this.tlRefs.forEach(tl => tl?.kill());
    this.tlRefs = [];
    this.activeTweenRefs.forEach(tw => tw?.kill());
    this.activeTweenRefs = [];
  }
}
window.PillNav = PillNav;
