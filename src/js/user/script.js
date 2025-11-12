/**
 * Global configuration for site animations and behavior
 * Centralized management of magic numbers, selectors, and feature flags
 *
 * @const {Object} CONFIG
 */
const CONFIG = {
  // Animation timings (milliseconds)
  ANIMATION: {
    PRELOADER_DELAY: 1000,
    PRELOADER_ANIMATE_DURATION: 400,
    PRELOADER_FADEOUT_DURATION: 1000,
    SKILL_ANIMATION_DURATION: 2000,
    SCROLL_ANIMATION_DURATION: 1500,
    NAVBAR_SCROLL_THRESHOLD: 50,
    SCROLL_BUTTON_OFFSET: 250,
    SCROLL_OFFSET: 73,
    EASING: 'easeInOutExpo',
    NAVBAR_TOGGLE_SPEED: 250,
  },

  // DOM selectors
  SELECTORS: {
    ROLE: '.role',
    PRELOADER_WRAPPER: '.spinner-wrapper',
    PRELOADER_OVERLAY: '#preloader',
    SITE_HEADER: '#site-header',
    NAVBAR_MAIN: '.navbar-main',
    NAVBAR_TOGGLE: '#toggle-navbar',
    NAVBAR_MOBILE: '#mobile-navbar',
    NAVBAR_MAIN_ID: '#main-navbar',
    SCROLL_BUTTON: '#scroll-top',
    SKILLS_SECTION: '#skills',
    PROGRESS_BAR: '.progress-bar',
    NAVIGATION: '#navigation',
    SECTIONS: 'section',
  },

  // Breakpoints
  BREAKPOINTS: {
    MOBILE: 768,
  },

  // ScrollMagic settings
  SCROLL_MAGIC: {
    SKILL_OFFSET: 100,
  },

  // Typed.js animation strings
  TYPING_STRINGS: [
    '^500 Dreamer ',
    '^500 Designer ',
    '^500 Developer ',
    '^500 Lifelong Learner ',
  ],

  // Header settings
  HEADER: {
    MIN_HEIGHT: 750,
    HEIGHT_PADDING: 5,
  },

  // Feature flags for debugging
  FEATURES: {
    ENABLE_DEBUG: false,
    ENABLE_SCROLL_INDICATORS: false,
  },
};

/**
 * Utility functions for common operations across modules
 *
 * @namespace Utils
 */
const Utils = {
  /**
   * Safely query DOM element with error handling
   *
   * @param {string} selector - CSS selector
   * @returns {jQuery|null} jQuery element or null if not found
   */
  querySelector(selector) {
    if (!selector) {
      console.warn('Utils.querySelector: Invalid selector provided', selector);
      return null;
    }
    const $element = $(selector);
    if ($element.length === 0) {
      console.warn(`Utils.querySelector: Element not found for selector "${selector}"`);
      return null;
    }
    return $element;
  },

  /**
   * Check if element exists in DOM
   *
   * @param {string} selector - CSS selector
   * @returns {boolean} True if element exists
   */
  elementExists(selector) {
    return $(selector).length > 0;
  },

  /**
   * Detect if device is mobile based on user agent
   *
   * @returns {boolean} True if mobile device
   */
  isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
  },

  /**
   * Debounce function to prevent function spam during rapid events
   * Useful for resize, scroll, input events
   *
   * @param {Function} func - Function to debounce
   * @param {number} wait - Debounce delay in milliseconds
   * @returns {Function} Debounced function
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * Throttle function to limit function call frequency
   * Useful for scroll events to maintain 60fps
   *
   * @param {Function} func - Function to throttle
   * @param {number} limit - Time limit in milliseconds
   * @returns {Function} Throttled function
   */
  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => {
          inThrottle = false;
        }, limit);
      }
    };
  },

  /**
   * Check if element is currently visible in viewport
   *
   * @param {jQuery} $element - jQuery element to check
   * @returns {boolean} True if element is in viewport
   */
  isInViewport($element) {
    if (!$element || $element.length === 0) return false;
    const rect = $element[0].getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  },
};

/**
 * Manages all ScrollMagic scenes and controller
 * Provides centralized access to scroll-triggered animations
 *
 * @class ScrollController
 */
class ScrollController {
  /**
   * Initialize ScrollMagic controller
   */
  constructor() {
    this.controller = null;
    this.scenes = [];
    this.isInitialized = false;
    this.init();
  }

  /**
   * Initialize ScrollMagic controller with error handling
   *
   * @returns {void}
   */
  init() {
    try {
      if (typeof ScrollMagic === 'undefined') {
        throw new Error('ScrollMagic library not loaded');
      }
      this.controller = new ScrollMagic.Controller();
      this.isInitialized = true;
      console.log('ScrollController: Initialized successfully');
    } catch (error) {
      console.error('ScrollController: Failed to initialize', error);
      this.isInitialized = false;
    }
  }

  /**
   * Create and add new scene to controller
   *
   * @param {Object} config - ScrollMagic scene configuration
   * @returns {Object|null} Scene object or null if creation failed
   */
  createScene(config) {
    if (!this.isInitialized) {
      console.warn('ScrollController: Controller not initialized, cannot create scene');
      return null;
    }

    try {
      const scene = new ScrollMagic.Scene(config).addTo(this.controller);
      this.scenes.push(scene);
      return scene;
    } catch (error) {
      console.error('ScrollController: Failed to create scene', error, config);
      return null;
    }
  }

  /**
   * Destroy all scenes and controller
   * Called during page cleanup
   *
   * @returns {void}
   */
  destroy() {
    this.scenes.forEach(scene => {
      scene.destroy();
    });
    this.scenes = [];
    if (this.controller) {
      this.controller.destroy();
      this.controller = null;
      this.isInitialized = false;
    }
  }

  /**
   * Get all registered scenes
   *
   * @returns {Array} Array of scene objects
   */
  getScenes() {
    return this.scenes;
  }
}

/**
 * Manages page preloader animation and fade out sequence
 * Coordinates with Velocity.js for smooth animations
 *
 * @class Preloader
 */
class Preloader {
  /**
   * Initialize preloader elements
   */
  constructor() {
    this.$wrapper = null;
    this.$overlay = null;
    this.isInitialized = false;
    this.init();
  }

  /**
   * Find and cache preloader elements
   *
   * @returns {void}
   */
  init() {
    try {
      this.$wrapper = Utils.querySelector(CONFIG.SELECTORS.PRELOADER_WRAPPER);
      this.$overlay = Utils.querySelector(CONFIG.SELECTORS.PRELOADER_OVERLAY);

      if (!this.$wrapper || !this.$overlay) {
        throw new Error('Preloader elements not found in DOM');
      }

      this.isInitialized = true;
    } catch (error) {
      console.error('Preloader: Initialization failed', error);
      this.isInitialized = false;
    }
  }

  /**
   * Check if Velocity.js library is loaded
   *
   * @private
   * @returns {boolean}
   */
  isVelocityLoaded() {
    return typeof Velocity !== 'undefined';
  }

  /**
   * Run complete preloader animation sequence
   * Waits for page load, animates children, fades out, removes from DOM
   *
   * @param {Function} onComplete - Callback executed after animation completes
   * @returns {void}
   */
  animate(onComplete = () => {}) {
    if (!this.isInitialized || !this.isVelocityLoaded()) {
      console.warn('Preloader: Cannot animate - not initialized or Velocity not loaded');
      onComplete();
      return;
    }

    $(window).on('load', () => {
      setTimeout(() => {
        this.animateChildren(() => {
          this.fadeOut(() => {
            this.$wrapper.hide();
            this.$overlay.removeClass().addClass('loaded');
            onComplete();
          });
        });
      }, CONFIG.ANIMATION.PRELOADER_DELAY);
    });
  }

  /**
   * Animate preloader spinner children elements
   *
   * @private
   * @param {Function} callback - Completion callback
   * @returns {void}
   */
  animateChildren(callback) {
    this.$wrapper.children().velocity(
      {
        opacity: 0,
        translateY: '-80px',
      },
      {
        duration: CONFIG.ANIMATION.PRELOADER_ANIMATE_DURATION,
        complete: callback,
      }
    );
  }

  /**
   * Fade out preloader wrapper from view
   *
   * @private
   * @param {Function} callback - Completion callback
   * @returns {void}
   */
  fadeOut(callback) {
    this.$wrapper.velocity(
      {
        translateY: '-100%',
      },
      {
        duration: CONFIG.ANIMATION.PRELOADER_FADEOUT_DURATION,
        complete: callback,
      }
    );
  }

  /**
   * Cleanup preloader resources
   *
   * @returns {void}
   */
  destroy() {
    this.$wrapper = null;
    this.$overlay = null;
    this.isInitialized = false;
  }
}

/**
 * Manages site header height adjustment based on window dimensions
 * Responds to window resize events
 *
 * @class Header
 */
class Header {
  /**
   * Initialize header element and setup resize listener
   */
  constructor() {
    this.$header = null;
    this.windowHeight = window.innerHeight;
    this.resizeHandler = null;
    this.init();
  }

  /**
   * Find header element and setup event listeners
   *
   * @returns {void}
   */
  init() {
    try {
      this.$header = $(CONFIG.SELECTORS.SITE_HEADER);
      if (this.$header.length === 0) {
        throw new Error('Site header element not found');
      }

      this.setHeight();
      this.setupResizeListener();
    } catch (error) {
      console.error('Header: Initialization failed', error);
    }
  }

  /**
   * Set header height based on current window height
   * Applies minimum height threshold if window is large enough
   *
   * @returns {void}
   */
  setHeight() {
    const height = this.windowHeight > CONFIG.HEADER.MIN_HEIGHT
      ? this.windowHeight + CONFIG.HEADER.HEIGHT_PADDING
      : this.windowHeight;

    this.$header.css('height', `${height}px`);
  }

  /**
   * Setup debounced window resize listener
   * Prevents excessive recalculations during resize events
   *
   * @private
   * @returns {void}
   */
  setupResizeListener() {
    this.resizeHandler = Utils.debounce(() => {
      this.windowHeight = window.innerHeight;
      this.setHeight();
    }, 250);

    window.addEventListener('resize', this.resizeHandler);
  }

  /**
   * Cleanup header resources
   *
   * @returns {void}
   */
  destroy() {
    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler);
      this.resizeHandler = null;
    }
    this.$header = null;
  }
}

/**
 * Manages navigation bar, mobile menu, and page scroll navigation
 * Handles both desktop and mobile navigation UI
 *
 * @class Navigation
 */
class Navigation {
  /**
   * Initialize navigation elements
   */
  constructor() {
    this.$nav = null;
    this.$mainNav = null;
    this.$mobileNav = null;
    this.$menuToggle = null;
    this.isInitialized = false;
    this.clickHandler = null;
    this.menuToggleHandler = null;
    this.init();
  }

  /**
   * Find navigation elements and setup event listeners
   *
   * @returns {void}
   */
  init() {
    try {
      this.$nav = $(CONFIG.SELECTORS.NAVIGATION);
      this.$mainNav = this.$nav.find(CONFIG.SELECTORS.NAVBAR_MAIN_ID);
      this.$mobileNav = this.$nav.find(CONFIG.SELECTORS.NAVBAR_MOBILE);
      this.$menuToggle = this.$nav.find(CONFIG.SELECTORS.NAVBAR_TOGGLE);

      if (!this.$nav.length || !this.$mainNav.length) {
        throw new Error('Navigation elements not found');
      }

      this.setupMobileNav();
      this.setupPageScrollLinks();
      this.setupMobileMenuToggle();
      this.isInitialized = true;
    } catch (error) {
      console.error('Navigation: Initialization failed', error);
    }
  }

  /**
   * Copy main navigation to mobile navigation on mobile devices
   *
   * @private
   * @returns {void}
   */
  setupMobileNav() {
    if (Utils.isMobile() && this.$mobileNav.length) {
      this.$mobileNav.html(this.$mainNav.html());
    }
  }

  /**
   * Setup click handler for page scroll navigation links
   *
   * @private
   * @returns {void}
   */
  setupPageScrollLinks() {
    this.clickHandler = (e) => {
      if (!e.target.matches('.page-scroll a')) return;

      e.preventDefault();
      this.scrollToSection(e.target);
      this.closeMobileMenu();
    };

    document.body.addEventListener('click', this.clickHandler);
  }

  /**
   * Setup click handler for mobile menu toggle button
   *
   * @private
   * @returns {void}
   */
  setupMobileMenuToggle() {
    if (!this.$menuToggle.length) return;

    this.menuToggleHandler = (e) => {
      if (!$(e.target).closest('.bar').length) return;
      e.preventDefault();
      this.toggleMobileMenu();
    };

    this.$menuToggle.on('click', this.menuToggleHandler);
  }

  /**
   * Scroll to specified section with smooth animation
   *
   * @param {HTMLElement} target - Clicked anchor element
   * @returns {void}
   */
  scrollToSection(target) {
    const $target = $(target);
    const href = $target.attr('href');

    if (!href) {
      console.warn('Navigation: No href found on target');
      return;
    }

    const $section = $(href);
    if ($section.length === 0) {
      console.warn(`Navigation: Section not found for href "${href}"`);
      return;
    }

    const offset = $section.offset().top - CONFIG.ANIMATION.SCROLL_OFFSET;

    $('html, body').stop().animate(
      { scrollTop: offset },
      CONFIG.ANIMATION.SCROLL_ANIMATION_DURATION,
      CONFIG.ANIMATION.EASING
    );
  }

  /**
   * Toggle mobile menu visibility with slide animation
   *
   * @private
   * @returns {void}
   */
  toggleMobileMenu() {
    const $ul = this.$mobileNav.children('ul');
    const $bar = this.$menuToggle.find('.bar');

    if ($ul.hasClass('expanded')) {
      $ul.removeClass('expanded').slideUp(CONFIG.ANIMATION.NAVBAR_TOGGLE_SPEED);
      $bar.removeClass('animate');
    } else {
      $ul.addClass('expanded').slideDown(CONFIG.ANIMATION.NAVBAR_TOGGLE_SPEED);
      $bar.addClass('animate');
    }
  }

  /**
   * Close mobile menu if open
   *
   * @private
   * @returns {void}
   */
  closeMobileMenu() {
    const $ul = this.$mobileNav.children('ul');
    const $bar = this.$menuToggle.find('.bar');

    if ($ul.hasClass('expanded')) {
      $ul.removeClass('expanded').slideUp(CONFIG.ANIMATION.NAVBAR_TOGGLE_SPEED);
      $bar.removeClass('animate');
    }
  }

  /**
   * Cleanup navigation resources
   *
   * @returns {void}
   */
  destroy() {
    if (this.clickHandler) {
      document.body.removeEventListener('click', this.clickHandler);
      this.clickHandler = null;
    }
    if (this.menuToggleHandler) {
      this.$menuToggle.off('click', this.menuToggleHandler);
      this.menuToggleHandler = null;
    }
    this.$nav = null;
    this.$mainNav = null;
    this.$mobileNav = null;
    this.$menuToggle = null;
  }
}

/**
 * Manages scroll-related page behavior
 * Includes navbar background changes and scroll-to-top button
 *
 * @class Scroller
 */
class Scroller {
  /**
   * Initialize scroll behavior
   */
  constructor() {
    this.$navbar = null;
    this.$scrollButton = null;
    this.isInitialized = false;
    this.navbarScrollHandler = null;
    this.scrollToTopHandler = null;
    this.scrollButtonClickHandler = null;
    this.init();
  }

  /**
   * Find scroller elements and setup event listeners
   *
   * @returns {void}
   */
  init() {
    try {
      this.$navbar = Utils.querySelector(CONFIG.SELECTORS.NAVBAR_MAIN);
      this.$scrollButton = Utils.querySelector(CONFIG.SELECTORS.SCROLL_BUTTON);

      if (!this.$navbar) {
        throw new Error('Navbar not found');
      }

      this.setupNavbarBackground();
      this.setupScrollToTop();
      this.isInitialized = true;
    } catch (error) {
      console.error('Scroller: Initialization failed', error);
    }
  }

  /**
   * Setup throttled scroll listener for navbar background change
   * Changes navbar appearance after scrolling past threshold
   *
   * @private
   * @returns {void}
   */
  setupNavbarBackground() {
    this.navbarScrollHandler = Utils.throttle(() => {
      const isScrolled = $(window).scrollTop() > CONFIG.ANIMATION.NAVBAR_SCROLL_THRESHOLD;
      this.$navbar.toggleClass('scrolled', isScrolled);
    }, 16); // ~60fps

    window.addEventListener('scroll', this.navbarScrollHandler);
  }

  /**
   * Setup scroll-to-top button visibility and click handler
   *
   * @private
   * @returns {void}
   */
  setupScrollToTop() {
    if (!this.$scrollButton) return;

    this.scrollToTopHandler = Utils.throttle(() => {
      const shouldShow = window.scrollY > CONFIG.ANIMATION.SCROLL_BUTTON_OFFSET;

      if (shouldShow) {
        this.$scrollButton.fadeIn('slow');
      } else {
        this.$scrollButton.fadeOut('fast');
      }
    }, 16); // ~60fps

    window.addEventListener('scroll', this.scrollToTopHandler);

    this.scrollButtonClickHandler = (e) => {
      e.preventDefault();
      $('html, body').animate(
        { scrollTop: 0 },
        CONFIG.ANIMATION.SCROLL_ANIMATION_DURATION
      );
    };

    this.$scrollButton.on('click', 'a', this.scrollButtonClickHandler);
  }

  /**
   * Cleanup scroller resources
   *
   * @returns {void}
   */
  destroy() {
    if (this.navbarScrollHandler) {
      window.removeEventListener('scroll', this.navbarScrollHandler);
      this.navbarScrollHandler = null;
    }
    if (this.scrollToTopHandler) {
      window.removeEventListener('scroll', this.scrollToTopHandler);
      this.scrollToTopHandler = null;
    }
    if (this.scrollButtonClickHandler) {
      this.$scrollButton.off('click', 'a', this.scrollButtonClickHandler);
      this.scrollButtonClickHandler = null;
    }
    this.$navbar = null;
    this.$scrollButton = null;
  }
}

/**
 * Manages skill bar animations triggered on scroll
 * Animates progress bars when skills section comes into view
 *
 * @class SkillsAnimator
 */
class SkillsAnimator {
  /**
   * Initialize skills animator with ScrollMagic controller
   *
   * @param {ScrollController} scrollController - ScrollMagic controller instance
   */
  constructor(scrollController) {
    this.scrollController = scrollController;
    this.$skillsSection = null;
    this.$progressBars = null;
    this.hasAnimated = false;
    this.scene = null;
    this.init();
  }

  /**
   * Find skills elements and setup animation scene
   *
   * @returns {void}
   */
  init() {
    try {
      this.$skillsSection = $(CONFIG.SELECTORS.SKILLS_SECTION);
      this.$progressBars = $(CONFIG.SELECTORS.PROGRESS_BAR);

      if (!this.$skillsSection.length || !this.$progressBars.length) {
        throw new Error('Skills section or progress bars not found');
      }

      this.setupScene();
    } catch (error) {
      console.error('SkillsAnimator: Initialization failed', error);
    }
  }

  /**
   * Setup ScrollMagic scene for skills section
   * Scene triggers animation when section enters viewport
   *
   * @private
   * @returns {void}
   */
  setupScene() {
    const skillId = this.$skillsSection.attr('id');
    const skillHeight = this.$skillsSection.outerHeight();

    this.scene = this.scrollController.createScene({
      triggerElement: `#${skillId}`,
      duration: skillHeight,
      offset: CONFIG.SCROLL_MAGIC.SKILL_OFFSET,
      controller: this.scrollController.controller,
    });

    if (!this.scene) {
      console.warn('SkillsAnimator: Failed to create scene');
      return;
    }

    this.scene.on('enter', () => {
      if (!this.hasAnimated) {
        this.animateProgressBars();
        this.hasAnimated = true;
      }
    });
  }

  /**
   * Animate all progress bars to their target percentages
   *
   * @private
   * @returns {void}
   */
  animateProgressBars() {
    this.$progressBars.each((index, progressBar) => {
      const $progressBar = $(progressBar);
      const $parent = $progressBar.parent();
      const progressPercent = $parent.data('progress-percent');

      if (typeof progressPercent !== 'number') {
        console.warn('SkillsAnimator: Progress percent data not found', $progressBar);
        return;
      }

      const percent = progressPercent / 100;
      const progressTotal = percent * $progressBar.width();

      $progressBar.stop().animate(
        { left: progressTotal },
        CONFIG.ANIMATION.SKILL_ANIMATION_DURATION,
        CONFIG.ANIMATION.EASING
      );
    });
  }

  /**
   * Cleanup skills animator resources
   *
   * @returns {void}
   */
  destroy() {
    if (this.scene) {
      this.scene.destroy();
      this.scene = null;
    }
    this.$skillsSection = null;
    this.$progressBars = null;
  }
}

/**
 * Manages active link highlighting based on scroll position
 * Updates navbar links to show which section is currently in view
 *
 * @class LinkHighlighter
 */
class LinkHighlighter {
  /**
   * Initialize link highlighter with ScrollMagic controller
   *
   * @param {ScrollController} scrollController - ScrollMagic controller instance
   */
  constructor(scrollController) {
    this.scrollController = scrollController;
    this.$sections = null;
    this.$navbar = null;
    this.scenes = [];
    this.init();
  }

  /**
   * Find page sections and navbar, setup scenes for each
   *
   * @returns {void}
   */
  init() {
    try {
      this.$sections = $(CONFIG.SELECTORS.SECTIONS);
      this.$navbar = $(CONFIG.SELECTORS.NAVBAR_MAIN);

      if (!this.$sections.length || !this.$navbar.length) {
        throw new Error('Sections or navbar not found');
      }

      this.setupScenes();
    } catch (error) {
      console.error('LinkHighlighter: Initialization failed', error);
    }
  }

  /**
   * Setup ScrollMagic scene for each page section
   * Scenes add/remove active class on navbar links during scroll
   *
   * @private
   * @returns {void}
   */
  setupScenes() {
    this.$sections.each((index, section) => {
      const $section = $(section);
      const sectionId = $section.attr('id');
      const sectionHeight = $section.outerHeight() + 40;

      if (!sectionId) {
        console.warn('LinkHighlighter: Section without ID found at index', index);
        return;
      }

      const scene = this.scrollController.createScene({
        triggerElement: `#${sectionId}`,
        duration: sectionHeight,
        controller: this.scrollController.controller,
      });

      if (!scene) return;

      scene.setClassToggle(`#${sectionId}`, 'active');
      scene.on('enter leave', (event) => {
        this.handleSectionChange($section, event);
      });

      this.scenes.push(scene);
    });
  }

  /**
   * Handle section enter/leave events from ScrollMagic
   * Updates active link in navbar
   *
   * @private
   * @param {jQuery} $section - Section element
   * @param {Object} event - ScrollMagic event object
   * @returns {void}
   */
  handleSectionChange($section, event) {
    const sectionId = $section.attr('id');
    const $link = this.$navbar.find(`a[href="#${sectionId}"]`);

    if (event.type === 'enter') {
      // Remove active class from all navbar links
      this.$navbar.find('a').removeClass('active');
      // Add active class to current section link
      $link.addClass('active');
    }
  }

  /**
   * Cleanup link highlighter resources
   *
   * @returns {void}
   */
  destroy() {
    this.scenes.forEach(scene => scene.destroy());
    this.scenes = [];
    this.$sections = null;
    this.$navbar = null;
  }
}

/**
 * Manages Typed.js text animation for hero section
 * Animates role/title text with typing effect
 *
 * @class TypedAnimation
 */
class TypedAnimation {
  /**
   * Initialize typed animation
   */
  constructor() {
    this.$roleElement = null;
    this.init();
  }

  /**
   * Find role element for typing animation
   *
   * @returns {void}
   */
  init() {
    try {
      this.$roleElement = Utils.querySelector(CONFIG.SELECTORS.ROLE);
      if (!this.$roleElement) {
        throw new Error('Role element not found');
      }
    } catch (error) {
      console.error('TypedAnimation: Initialization failed', error);
    }
  }

  /**
   * Check if Typed.js jQuery plugin is loaded
   *
   * @private
   * @returns {boolean}
   */
  isTypedLoaded() {
    return typeof $.fn.typed !== 'undefined';
  }

  /**
   * Start typing animation with configured strings
   *
   * @returns {void}
   */
  animate() {
    if (!this.$roleElement || !this.isTypedLoaded()) {
      console.warn('TypedAnimation: Cannot start - not initialized or Typed.js not loaded');
      return;
    }

    try {
      this.$roleElement.typed({
        strings: CONFIG.TYPING_STRINGS,
        startDelay: 200,
        typeSpeed: 70,
        backSpeed: 50,
        backDelay: 2000,
        loop: true,
      });
    } catch (error) {
      console.error('TypedAnimation: Animation failed', error);
    }
  }

  /**
   * Stop typing animation
   *
   * @returns {void}
   */
  stop() {
    if (this.$roleElement && $.fn.typed) {
      try {
        this.$roleElement.typed('destroy');
      } catch (error) {
        console.warn('TypedAnimation: Error stopping animation', error);
      }
    }
  }

  /**
   * Cleanup typed animation resources
   *
   * @returns {void}
   */
  destroy() {
    this.stop();
    this.$roleElement = null;
  }
}

/**
 * Main page initializer - orchestrates all page features
 * Manages initialization and cleanup of all modules
 *
 * @class PageInit
 */
class PageInit {
  /**
   * Initialize PageInit orchestrator
   */
  constructor() {
    this.features = {};
    this.isInitialized = false;
  }

  /**
   * Initialize all page features in proper order
   * Sets up scroll controller first, then all dependent features
   *
   * @returns {void}
   */
  init() {
    try {
      console.log('PageInit: Starting initialization...');

      // Initialize scroll controller first (dependency for other modules)
      this.features.scrollController = new ScrollController();

      // Initialize all page features
      this.features.preloader = new Preloader();
      this.features.header = new Header();
      this.features.navigation = new Navigation();
      this.features.scroller = new Scroller();
      this.features.skillsAnimator = new SkillsAnimator(this.features.scrollController);
      this.features.linkHighlighter = new LinkHighlighter(this.features.scrollController);
      this.features.typedAnimation = new TypedAnimation();

      // Start preloader and type animation
      this.features.preloader.animate(() => {
        this.features.typedAnimation.animate();
      });

      this.isInitialized = true;
      console.log('PageInit: Initialization complete', this.features);

      // Expose for debugging if enabled
      if (CONFIG.FEATURES.ENABLE_DEBUG) {
        window.pageInit = this;
        console.log('PageInit: Debug mode enabled - access via window.pageInit');
      }
    } catch (error) {
      console.error('PageInit: Initialization failed', error);
      this.isInitialized = false;
    }
  }

  /**
   * Cleanup all page features
   * Called on page unload to prevent memory leaks
   *
   * @returns {void}
   */
  destroy() {
    Object.values(this.features).forEach(feature => {
      if (feature && typeof feature.destroy === 'function') {
        try {
          feature.destroy();
        } catch (error) {
          console.warn('PageInit: Error destroying feature', error);
        }
      }
    });
    this.features = {};
    this.isInitialized = false;
    console.log('PageInit: Cleanup complete');
  }

  /**
   * Get initialization status
   *
   * @returns {boolean} True if all features initialized successfully
   */
  getStatus() {
    return this.isInitialized;
  }
}

/**
 * Initialize page when DOM is ready
 * Handles both jQuery ready and direct DOMContentLoaded
 */
$(document).ready(() => {
  const pageInit = new PageInit();
  pageInit.init();

  /**
   * Cleanup on page unload to prevent memory leaks
   */
  $(window).on('beforeunload', () => {
    pageInit.destroy();
  });

  /**
   * Additional cleanup for edge cases
   */
  window.addEventListener('unload', () => {
    pageInit.destroy();
  });
});
