// OOP
var custom = {
  // variables
  trigger: false,
  width: window.innerWidth,
  height: window.innerHeight,
  isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ? true : false,
  // create a new ScrollMagic controller
  controller: new ScrollMagic.Controller(),

  // Initializes a typing animation using the Typed.js library on the ".role" element, with the specified strings and configuration options
  typeAnimation: () => {
    $('.role').typed({
      strings: ['^500 Dreamer ', '^500 Designer ', '^500 Developer ', '^500 Lifelong Learner '],
      startDelay: 200,
      typeSpeed: 70,
      backSpeed: 50,
      backDelay: 2000,
      loop: true
    });
  },

  // Displays a preloader animation before the page content is fully loaded, then fades it out and removes it from the DOM
  // Uses jQuery to animate the preloader elements
  preloader: () => {
    // Select the preloader elements.
    const $preloader = $('.spinner-wrapper');
    const $overlay   = $('#preloader');

    // Wait for the page to fully load before triggering the preloader animation
    $(window).on('load', () => {
      // Wait for 1 second before starting the animation
      setTimeout(() => {
        // Animate the preloader elements using Velocity.js
        $preloader.children().velocity({
          opacity: 0,
          translateY: '-80px'
        }, {
          duration: 400,
          complete: () => {
            // Hide the preloader elements
            $preloader.velocity({
              translateY: '-100%'
            },
            {
              duration: 1000,
              // Trigger the typeAnimation function while the preloader elements are fading out
              progress: custom.typeAnimation,
              complete: () => {
                // Removes the preloader elements from the DOM
                $preloader.hide();
                // Add the "loaded" class to the overlay element to trigger the fade out animation
                $overlay.removeClass().addClass('loaded');
              }
            });
          }
        });
      }, 1000);
    });
  },

  // This function dynamically adjusts the height of the site header based on the window height
  // If the window height is greater than 750 pixels, the custom height plus 5 pixels is used
  // Otherwise, the header height is set to the window height
  adjustHeaderHeight: () => {
    const MIN_HEIGHT = 750;
    const siteHeader = document.querySelector('#site-header');
    // Set the header height to the window height
    siteHeader.style.height = `${window.innerHeight}px`;

    // If the window height is greater than the minimum height, adjust the header height to the custom height plus 5 pixels
    if (window.innerHeight > MIN_HEIGHT) {
      siteHeader.style.height = `${custom.height + 5}px`;
    }
  },

  // Adds or removes "scrolled" class on ".navbar-main" based on the scroll position
  navBackground: () => {
    const $nav = $('.navbar-main');
    const threshold = 50;
    // Attaches a scroll event listener to the window object
    $(window).on('scroll', function() {
      // Checks if the current scroll position is greater than the threshold
      const isScrolled = $(this).scrollTop() > threshold;
      // Toggles the "scrolled" class on the $nav element depending on the value of isScrolled
      $nav.toggleClass('scrolled', isScrolled);
    });
  },


  // Shows or hides the "scroll to top" button based on scroll position, and animates to top of page when clicked
  scrollToTop: () => {
    // Select scroll to top button element and set initial offset
    const $scrollButton = $('#scroll-top');
    const offset = 250;

    // Attach scroll event listener to window object
    window.addEventListener('scroll', () => {
    // If the scroll position is greater than offset, fade in the scroll button
      if (window.scrollY > offset) {
        $scrollButton.fadeIn('slow');
      } else {
      // Otherwise, fade it out
        $scrollButton.fadeOut('fast');
      }
    });

    // Attach click event listener to the scroll button
    $scrollButton.on('click', 'a', (e) => {
    // Prevents default link behavior
      e.preventDefault();
      // Animates the scroll to the top of the page over 800 milliseconds
      $('html, body').animate({ scrollTop: 0 }, 800);
    });
  },

  // Defines the navigation function to handle the page scrolling and mobile menu toggle
  navigation: () => {
    // Define variables to store relevant elements of the navigation
    const $nav       = $('#navigation');
    const mainNav    = $nav.find('#main-navbar');
    const mobileNav  = $nav.find('#mobile-navbar');
    const menuToggle = $nav.find('#toggle-navbar');

    // If the screen width is less than or equal to 768px, copy the main nav HTML into the mobile nav
    if (custom.width <= 768) {
      mobileNav.html(mainNav.html());
    }

    // Scrolls to clicked page section and closes mobile menu if open
    document.body.addEventListener('click', (e) => {
      if (!e.target.parentNode.matches('.page-scroll a')) return;
      e.preventDefault();

      const $anchor = $(e.target.parentNode);
      const href = $anchor.attr('href');

      // Scroll to the clicked section using smooth animation
      $('html, body').stop().animate({
        scrollTop: $(href).offset().top - 38
      }, 1500, 'easeInOutExpo');

      // Collapse mobile navigation if expanded
      const mobileChild = mobileNav.children('ul.expanded');
      if (mobileNav.children('ul').hasClass('expanded')) {
        mobileChild.slideUp('fast').removeClass('expanded');
        menuToggle.children('.bar').removeClass('animate');
      }
    });

    // Toggles mobile menu on button click
    menuToggle.on('click', '.bar', (e) => {
      e.preventDefault();
      const $bar = menuToggle.find('.bar');
      // Collapse mobile navigation if expanded
      if (mobileNav.children('ul').hasClass('expanded')) {
        mobileNav.children('ul.expanded').removeClass('expanded').slideUp(250);
        $bar.removeClass('animate');
      } else {
        // Expand mobile navigation if collapsed
        mobileNav.children('ul').addClass('expanded').slideDown(250);
        $bar.addClass('animate');
      }
    });
  },

  animateSkill: () => {
    // Define variables to use in the function
    const animationTime = 2000;
    const easing = 'easeInOutExpo';
    const skillId = $('#skills').attr('id');
    const skillHeight = $('#skills').outerHeight();
    const progressBars = $('.progress-bar');
    // Create a new ScrollMagic scene for the skills section
    const skillProgress  = new ScrollMagic.Scene({
      triggerElement: `#${skillId}`,
      duration: skillHeight,
      offset: 100
    });

    // Check if the custom trigger exists and add the progress animation to the scene
    if (!custom.trigger) {
      custom.trigger = true;
      // Animate each progress bar inside the skill section
      skillProgress.on('enter', () => {
        progressBars.each((index, progressBar) => {
          const $progressBar = $(progressBar);
          const percent = ($progressBar.parent().data('progress-percent') / 100);
          const progressTotal = percent * $progressBar.width();
          // Animate the progress bar to the percentage of its data attribute
          $progressBar.stop().animate({ left: progressTotal }, animationTime, easing);
        });
      })
        // add indicators for debugging (optional)
        // .addIndicators()
        // Add the scene to the controller
        .addTo(custom.controller);
    }
  },

  linkHighlight: () => {
    // select all sections on the page
    const sections = $('section');
    // select the main navbar
    const nav = $('.navbar-main');

    // loop through each section
    sections.each(function() {
      const section = $(this);
      // get the ID of the section
      const triggerID = '#' + section.attr('id');
      // get the height of the section plus some extra padding
      const elementHeight = section.outerHeight() + 40;

      // create a new ScrollMagic scene for this section
      new ScrollMagic.Scene({
        triggerElement: triggerID,
        duration: elementHeight,
        controller: custom.controller
      })
        // add a class to the section when it enters the viewport
        .setClassToggle(triggerID, 'active')
        // add an event listener for when the section enters or leaves the viewport
        .on('enter leave', (event) => {
          // get the ID of the current section
          const sectionID = section.attr('id');

          // select the link in the main navbar that corresponds to the current section
          const link = nav.find('a[href="#' + sectionID + '"]');

          // add or remove the "active" class from the link depending on whether the section is entering or leaving the viewport
          if (event.type == 'enter') {
            link.addClass('active');
          } else {
            link.removeClass('active');
          }
        })
        // add indicators for debugging (optional)
        // .addIndicators()
        // add the scene to the controller
        .addTo(custom.controller);
    });
  },

  scrollTrigger: () => {

  },

  copyrightYear: () => {
    const currentYear = new Date().getFullYear();
    const footer = document.querySelector('footer');
    const footerText = footer.querySelector('h6');
    footerText.innerHTML = `Jobayer Arman &copy; 2015 - ${currentYear}`;
  },

  init: () => {
    custom.preloader();
    custom.adjustHeaderHeight();
    custom.navBackground();
    custom.scrollToTop();
    custom.navigation();
    // custom.animateSkill();
    // custom.linkHighlight();
    custom.copyrightYear();
  }
};

$(function() {
  custom.init();
});
