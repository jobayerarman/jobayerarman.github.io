// Global Variables
var width  = $(window).width();
var height = $(window).height();
var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ? true : false;


// Typed.js designation
$(function(){
  $(".role").typed({
    strings: ["am a ^400 Dreamer ^650 | Coder ^650 | Developer ", "love ^400 Sublime^700, music^900 &amp;^400 spicy foods "],
    startDelay: 1000,
    typeSpeed: 70,
    backSpeed: 10,
    backDelay: 1500,
    loop: true
  });
});

// jQuery for page scrolling feature - requires jQuery Easing plugin
$(function pageScroll() {
  $('body').on('click', '.page-scroll a', function(event) {
    event.preventDefault();
    var $anchor      = $(this);
    var navbarMobile = $(".navbar-mobile ul.expanded");
    var menuToggle   = $(".bar");

    $('html, body').stop().animate({
      scrollTop: $($anchor.attr('href')).offset().top - 41
    }, 1500, 'easeInOutExpo');

    if(width < 769) {
      navbarMobile.slideUp('fast').removeClass("expanded");
      menuToggle.removeClass("animate");
    }
  });
});

// Active link on scroll
$(function onScroll() {
  var sections     = $('section'),
      nav          = $('.navbar-main'),
      nav_height   = nav.outerHeight();

  $(window).on('scroll', function() {
    var cur_pos = $(this).scrollTop();

    sections.each(function() {
      var top = $(this).offset().top - nav_height,
          bottom = top + $(this).outerHeight();

      if (cur_pos >= top && cur_pos <= bottom) {
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

  if (width < 769) {
    mobilenav.html(mainnav.html());

    navToggle.on('click', function () {
      if (mobilenav.children('ul').hasClass("expanded")) {
        mobilenav.children('ul.expanded').removeClass("expanded").slideUp(250);
        $(this).removeClass("animate");
      } else {
        mobilenav.children('ul').addClass("expanded").slideDown(250);
        $(this).addClass("animate");
      }
    });
  }
});

// dynamic header size
$(function dynamicHeader() {
  if(!isMobile && height > 750) {
    $('#site-header').css({'height': height + 5 + "px"});
  }
});

// Navbar background opacity
$(function navOpacity() {
  var   nav     = $(".navbar-main"),
        anchor  = $(".navbar-main a");

  $(window).scroll(function() {
    if ($(this).scrollTop() > 370) {
      nav.css({'background-color': '#FFF'});
      anchor.css({'color': 'black'});
    } else{
      nav.css({'background': 'transparent'});
      anchor.css({'color': 'white'});
    }
  });
});

// Scroll to Top Button
$(function scrolltotop() {
  var offset = 250,
  scrollbutton = $('div#scroll-top');

  $(window).scroll(function() {
    if ($(this).scrollTop() > offset) {
      scrollbutton.fadeIn('slow');
    } else{
      scrollbutton.fadeOut('fast');
    }
  });

  scrollbutton.children('a').on('click', function(event) {
    event.preventDefault();
    $('html, body').animate({scrollTop: 0}, 800);
    return false;
  });
});

// Skills Progress
$(function moveProgressBar() {
  $(window).scroll(function() {
    var animationTime = 2000,
        easing        = 'easeInOutExpo',
        skillTop      = $('#skills').offset().top + 600,
        windowTop     = $(window).scrollTop(),
        windowBottom  = height + windowTop,
        progressbar   = $('.progress-bar');

    if (windowBottom > skillTop) {
      progressbar.each(function() {
        var percent           = ($(this).parent().data('progress-percent') / 100),
            progressWrapWidth = $(this).width(),
            progressTotal     = percent * progressWrapWidth;

        $(this).stop().animate({left: progressTotal}, animationTime, easing);
      });
    }
  });
});
