// OOP
var custom = {
  // variables
  trigger: false,
  width: window.innerWidth,
  height: window.innerHeight,
  isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ? true : false,

  // methods
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

  preloader: () => {
    const $preloader = $('.spinner-wrapper');
    const $overlay   = $('#preloader');

    $(window).load(function() {
      setTimeout(function() {
        $preloader.children().velocity({
          opacity: 0,
          translateY: '-80px'
        }, {
          duration: 400,
          complete: function() {
            $preloader.velocity({
              translateY: '-100%'
            },
            {
              duration: 1000,
              progress: function() {
                custom.typeAnimation();
              },
              complete: function() {
                $preloader.hide();
                $overlay.removeClass().addClass('loaded');
              }
            });
          }
        });
      }, 1000);
    });
  },

  dynamicHeader: function() {
    var $siteHeader = $('#site-header');

    if (this.height > 750) {
      $siteHeader.css({ 'height': custom.height + 5 + 'px' });
    }
  },

  navBackground: function() {
    var $nav = $('.navbar-main');

    $(window).on('scroll', function() {
      if ($(this).scrollTop() > 50) {
        $nav.addClass('scrolled');
      } else {
        $nav.removeClass('scrolled');
      }
    });
  },

  scrollToTop: function() {
    var $scrollButton = $('#scroll-top');
    var offset = 250;

    $(window).on('scroll', function() {
      if ($(this).scrollTop() > offset) {
        $scrollButton.fadeIn('slow');
      } else {
        $scrollButton.fadeOut('fast');
      }

      return false;
    });

    $scrollButton.on('click', 'a', function(e) {
      e.preventDefault();
      $('html, body').animate({ scrollTop: 0 }, 800);
      return false;
    });
  },

  navigation: function() {
    var $nav       = $('#navigation');
    var scrollable = $nav.find('.page-scroll');
    var mainNav    = $nav.find('#main-navbar');
    var mobileNav  = $nav.find('#mobile-navbar');
    var menuToggle = $nav.find('#toggle-navbar');

    $('body').on('click', '.page-scroll a', function(e) {
      e.preventDefault();
      var $anchor = $(this);
      var mobileChild = mobileNav.children('ul.expanded');

      $('html, body').stop().animate({
        scrollTop: $($anchor.attr('href')).offset().top - 73
      }, 1500, 'easeInOutExpo');

      if (mobileNav.children('ul').hasClass('expanded')) {
        mobileChild.slideUp('fast').removeClass('expanded');
        menuToggle.children('.bar').removeClass('animate');
      }
    });

    if (this.width <= 768) {
      mobileNav.html(mainNav.html());
    }

    menuToggle.on('click', '.bar', function(e) {
      if (mobileNav.children('ul').hasClass('expanded')) {
        mobileNav.children('ul.expanded').removeClass('expanded').slideUp(250);
        $(this).removeClass('animate');
      } else {
        mobileNav.children('ul').addClass('expanded').slideDown(250);
        $(this).addClass('animate');
      }

      e.preventDefault();
    });
  },

  animateSkill: function() {
    var animationTime  = 2000;
    var easing         = 'easeInOutExpo';
    var $skill         = '#' + $('#skills').attr('id');
    var $skillHeight   = $('#skills').outerHeight();
    var $progressbar   = $('.progress-bar');

    var controller     = new ScrollMagic.Controller();

    var skillProgress  = new ScrollMagic.Scene({
      triggerElement: $skill,
      duration: $skillHeight,
      offset: 100
    });
    if (!custom.trigger) {
      custom.trigger = true;
      skillProgress.on('enter', function() {
        $progressbar.each(function() {
          var $this             = $(this);
          var percent           = ($this.parent().data('progress-percent') / 100);
          var progressWrapWidth = $this.width();
          var progressTotal     = percent * progressWrapWidth;

          $this.stop().animate({ left: progressTotal }, animationTime, easing);
        });
      })
      // .addIndicators()
        .addTo(controller);
    }
  },

  linkHighlight: function() {
    var controller  = new ScrollMagic.Controller();
    var $sections   = $('section');
    var $nav        = $('.navbar-main');

    $sections.each(function() {
      var $this          = $(this);
      var $triggerID     = '#' + $this.attr('id');
      var $elementHeight = $this.outerHeight() + 40;

      var highlightNav = new ScrollMagic.Scene({
        triggerElement: $triggerID,
        duration: $elementHeight
      })
        .setClassToggle($triggerID, 'active')
        .on('enter leave', function(event) {
          if (event.type == 'enter') {
            $nav.find('a[href="#' + $this.attr('id') + '"]').addClass('active');
          } else {
            $nav.find('a[href="#' + $this.attr('id') + '"]').removeClass('active');
          }
        })
        // .addIndicators()
        .addTo(controller);
    });
  },

  scrollTrigger: function() {

  },

  init: function() {
    custom.preloader();
    custom.dynamicHeader();
    custom.navBackground();
    custom.scrollToTop();
    custom.navigation();
    custom.animateSkill();
    custom.linkHighlight();
  }
};

$(function() {
  custom.init();
});
