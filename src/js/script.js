// Global Variables
var config = {
  width: window.innerWidth,
  height: window.innerHeight,
  isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ? true : false
};

// Typed.js designation
$(function() {
  $('.role').typed({
    strings: ['am a ^400 Dreamer ^650 | Coder ^650 | Developer ', 'love ^400 Reading^700, music^900 &amp;^400 spicy food '],
    startDelay: 1000,
    typeSpeed: 70,
    backSpeed: 10,
    backDelay: 1500,
    loop: true
  });
});

// Active link on scroll
$(function onScroll() {
  var $sections   = $('section');
  var $nav        = $('.navbar-main');
  var navHeight   = $nav.outerHeight() + 46;

  $(window).on('scroll', function()  {
    var curPos = $(this).scrollTop();

    $sections.each(function() {
      var top = $(this).offset().top - navHeight;
      var bottom = top + $(this).outerHeight() + 30;

      if (curPos >= top && curPos <= bottom) {
        $nav.find('a').removeClass('active');
        $sections.removeClass('active');

        $(this).addClass('active');
        $nav.find('a[href="#' + $(this).attr('id') + '"]').addClass('active');
      } else {
        $nav.find('a[href="#' + $(this).attr('id') + '"]').removeClass('active');
      }
    });
  });
});

// Skills Progress
$(function moveProgressBar() {
  var animationTime = 1000;
  var easing        = 'easeInOutExpo';
  var $skillTop      = $('#skills').offset().top + 500;
  var $progressbar   = $('.progress-bar');

  $(window).on('scroll', function() {
    var windowTop     = $(window).scrollTop();
    var windowBottom  = config.height + windowTop;

    if (windowBottom > $skillTop) {
      progressbar.each(function() {
        var percent           = ($(this).parent().data('progress-percent') / 100);
        var progressWrapWidth = $(this).width();
        var progressTotal     = percent * progressWrapWidth;

        $(this).stop().animate({ left: progressTotal }, animationTime, easing);
      });
    }

    return false;
  });
});

// OOP
var custom = {
  // global variable
  width: window.innerWidth,
  height: window.innerHeight,
  isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ? true : false,

  // methods
  dynamicHeader: function() {
    if (this.height > 750) {
      $('#site-header').css({ 'height': config.height + 5 + 'px' });
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

    $scrollButton.on('click', 'a', function(event) {
      event.preventDefault();
      $('html, body').animate({ scrollTop: 0 }, 800);
      return false;
    });
  },

  navigation: function() {
    var $nav = $('#navigation');
    var scrollable = $nav.find('.page-scroll');
    var mainNav   = $nav.find('#main-navbar');
    var mobileNav = $nav.find('#mobile-navbar');
    var menuToggle   = $nav.find('#toggle-navbar');

    $('body').on('click', '.page-scroll a', function(event) {
      event.preventDefault();
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
      e.preventDefault();
      if (mobileNav.children('ul').hasClass('expanded')) {
        mobileNav.children('ul.expanded').removeClass('expanded').slideUp(250);
        $(this).removeClass('animate');
      } else {
        mobileNav.children('ul').addClass('expanded').slideDown(250);
        $(this).addClass('animate');
      }
    });
  },

  animateSkill: function() {
    // body...
  },

  linkHighlight: function() {
    // body...
  }
};

$(function() {
  custom.dynamicHeader();
  custom.navBackground();
  custom.navigation();
  custom.scrollToTop();
});
