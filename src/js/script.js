// Global Variables
var config = {
  width  : window.innerWidth,
  height : window.innerHeight,
  isMobile : /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ? true : false
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

// jQuery for page scrolling feature - requires jQuery Easing plugin
$(function pageScroll() {
  $('.page-scroll').on('click', 'a', function(event) {
    event.preventDefault();
    var $anchor      = $(this);
    var navbarMobile = $('.navbar-mobile ul.expanded');
    var menuToggle   = $('.bar');

    $('html, body').stop().animate({
      scrollTop: $($anchor.attr('href')).offset().top - 73
    }, 1500, 'easeInOutExpo');

    if(config.width < 769) {
      navbarMobile.slideUp('fast').removeClass('expanded');
      menuToggle.removeClass('animate');
    }
  });
});

// Active link on scroll
$(function onScroll() {
  var sections     = $('section'),
      nav          = $('.navbar-main'),
      navHeight   = nav.outerHeight() + 46;

  $(window).on('scroll', function() {
    var curPos = $(this).scrollTop();

    sections.each(function() {
      var top = $(this).offset().top - navHeight,
          bottom = top + $(this).outerHeight() + 30;

      if (curPos >= top && curPos <= bottom) {
        nav.find('a').removeClass('active');
        sections.removeClass('active');

        $(this).addClass('active');
        nav.find('a[href="#'+$(this).attr('id')+'"]').addClass('active');
      } else {
        nav.find('a[href="#'+$(this).attr('id')+'"]').removeClass('active');
      }
    });
  });
});

// sliding menu on mobile screen
$(function mobileNav() {
  var mobilenav = $('div.navbar-mobile'),
  mainnav   = $('div.navbar-main'),
  navToggle = $('.bar');

  if (config.width < 769) {
    mobilenav.html(mainnav.html());

    navToggle.on('click', function () {
      if (mobilenav.children('ul').hasClass('expanded')) {
        mobilenav.children('ul.expanded').removeClass('expanded').slideUp(250);
        $(this).removeClass('animate');
      } else {
        mobilenav.children('ul').addClass('expanded').slideDown(250);
        $(this).addClass('animate');
      }
    });
  }
});

// Navbar background opacity
$(function navOpacity() {
  var   nav     = $('.navbar-main');
  var   anchor  = nav.find('a');

  $(window).scroll(function() {
    if ($(this).scrollTop() > 370) {
      nav.css({'background-color': '#FFF'});
      anchor.css({'color': 'black'});
    } else {
      nav.css({'background': 'transparent'});
      anchor.css({'color': 'white'});
    }
  });
});

// Scroll to Top Button
$(function scrolltotop() {
  var offset = 250;
  var scrollButton = $('div#scroll-top');

  $(window).on('scroll', function() {
    if ($(this).scrollTop() > offset) {
      scrollButton.fadeIn('slow');
    } else {
      scrollButton.fadeOut('fast');
    }
  });


});

// Skills Progress
$(function moveProgressBar() {
  var animationTime = 1000;
  var easing        = 'easeInOutExpo';
  var skillTop      = $('#skills').offset().top + 500;
  var progressbar   = $('.progress-bar');

  $(window).on('scroll', function() {
    var windowTop     = $(window).scrollTop();
    var windowBottom  = config.height + windowTop;

    if (windowBottom > skillTop) {
      progressbar.each(function() {
        var percent           = ($(this).parent().data('progress-percent') / 100);
        var progressWrapWidth = $(this).width();
        var progressTotal     = percent * progressWrapWidth;

        $(this).stop().animate({left: progressTotal}, animationTime, easing);
      });
    }
    return false;
  });
});

// OOP
var custom = {
  // global variable
  width  : window.innerWidth,
  height : window.innerHeight,
  isMobile : /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ? true : false,

  // selectors | memebers


  // methods
  dynamicHeader : function () {
    if (this.height > 750) {
      $('#site-header').css({'height': config.height + 5 + 'px'});
    }
  },
  navBackground : function () {
    // change navbar background as user scroll
  },
  scrollToTop : function () {
    var scrollButton = $('#scroll-top');
    scrollButton.on('click', 'a', function(event) {
      event.preventDefault();
      $('html, body').animate({scrollTop: 0}, 800);
      return false;
    });
  }
};
$(function() {
    custom.dynamicHeader();
    custom.scrollToTop();
});
