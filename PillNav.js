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
      '--nav-h': '52px',
      '--logo': '44px',
      '--pill-pad-x': '24px',
      '--pill-gap': '4px'
    };

    // Apply styles to container
    Object.keys(cssVars).forEach(key => {
      this.container.style.setProperty(key, cssVars[key]);
    });

    // Create Navigation Elements
    const outerDiv = document.createElement('div');
    outerDiv.className = `absolute top-[1.2em] z-[1000] w-full left-0 md:w-auto md:left-auto flex justify-center md:block ${this.className}`;
    
    const nav = document.createElement('nav');
    nav.className = 'w-[90%] md:w-max flex items-center justify-between md:justify-start box-border p-[4px] rounded-full border border-glassBorder/10 backdrop-blur-md bg-black/10';
    nav.setAttribute('aria-label', 'Primary');

    // Logo Button (Left) - Switches to Account tab
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

    nav.appendChild(logoLink);

    // Nav Items (Middle)
    const navItems = document.createElement('div');
    navItems.className = 'relative items-center rounded-full hidden md:flex ml-2';
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
    nav.appendChild(navItems);

    // Hamburger button for mobile menu
    const hamburger = document.createElement('button');
    hamburger.className = 'md:hidden rounded-full border-0 flex flex-col items-center justify-center gap-1 cursor-pointer p-0 relative focus:outline-none';
    hamburger.style.width = 'var(--nav-h)';
    hamburger.style.height = 'var(--nav-h)';
    hamburger.style.background = 'var(--base, #000)';
    hamburger.setAttribute('aria-label', 'Toggle menu');
    hamburger.setAttribute('aria-expanded', 'false');

    const line1 = document.createElement('span');
    line1.className = 'hamburger-line w-4 h-0.5 rounded origin-center transition-all';
    line1.style.background = 'var(--pill-bg, #fff)';
    
    const line2 = document.createElement('span');
    line2.className = 'hamburger-line w-4 h-0.5 rounded origin-center transition-all';
    line2.style.background = 'var(--pill-bg, #fff)';

    hamburger.appendChild(line1);
    hamburger.appendChild(line2);
    nav.appendChild(hamburger);

    outerDiv.appendChild(nav);

    // Mobile Menu Dropdown
    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'md:hidden absolute top-[3.2em] left-4 right-4 rounded-[27px] shadow-[0_8px_32px_rgba(0,0,0,0.12)] z-[998] origin-top hidden';
    mobileMenu.style.background = 'var(--base, #f0f0f0)';

    const mobileUl = document.createElement('ul');
    mobileUl.className = 'list-none m-0 p-[3px] flex flex-col gap-[3px]';

    this.items.forEach(item => {
      const mobileLi = document.createElement('li');
      
      const mobileA = document.createElement('button');
      mobileA.className = 'w-full text-left border-0 block py-3 px-4 text-sm font-semibold rounded-[50px] transition-all duration-200 cursor-pointer focus:outline-none';
      mobileA.style.background = 'var(--pill-bg, #fff)';
      mobileA.style.color = 'var(--pill-text, #fff)';
      mobileA.innerText = item.label;

      mobileA.addEventListener('mouseenter', () => {
        mobileA.style.background = 'var(--base)';
        mobileA.style.color = 'var(--hover-text, #fff)';
      });
      mobileA.addEventListener('mouseleave', () => {
        mobileA.style.background = 'var(--pill-bg, #fff)';
        mobileA.style.color = 'var(--pill-text, #fff)';
      });
      mobileA.addEventListener('click', () => {
        this.toggleMobileMenu(hamburger, mobileMenu);
        if (this.onTabClick) this.onTabClick(item.href);
      });

      mobileLi.appendChild(mobileA);
      mobileUl.appendChild(mobileLi);
    });

    mobileMenu.appendChild(mobileUl);
    outerDiv.appendChild(mobileMenu);

    hamburger.addEventListener('click', () => {
      this.toggleMobileMenu(hamburger, mobileMenu);
    });

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

  toggleMobileMenu(hamburger, mobileMenu) {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    hamburger.setAttribute('aria-expanded', this.isMobileMenuOpen);

    const lines = hamburger.querySelectorAll('.hamburger-line');
    
    if (this.isMobileMenuOpen) {
      gsap.to(lines[0], { rotation: 45, y: 3, duration: 0.3, ease: this.ease });
      gsap.to(lines[1], { rotation: -45, y: -3, duration: 0.3, ease: this.ease });
      
      mobileMenu.classList.remove('hidden');
      gsap.fromTo(
        mobileMenu,
        { opacity: 0, y: 10, scaleY: 0.8 },
        {
          opacity: 1,
          y: 0,
          scaleY: 1,
          duration: 0.3,
          ease: this.ease,
          transformOrigin: 'top center'
        }
      );
    } else {
      gsap.to(lines[0], { rotation: 0, y: 0, duration: 0.3, ease: this.ease });
      gsap.to(lines[1], { rotation: 0, y: 0, duration: 0.3, ease: this.ease });
      
      gsap.to(mobileMenu, {
        opacity: 0,
        y: 10,
        scaleY: 0.8,
        duration: 0.2,
        ease: this.ease,
        transformOrigin: 'top center',
        onComplete: () => {
          mobileMenu.classList.add('hidden');
        }
      });
    }
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
