// Global Variables
var width = $(window).width();
var height = $(window).height();

// jQuery for page scrolling feature - requires jQuery Easing plugin
$(function pageScroll() {
  $('body').on('click', '.page-scroll a', function(event) {
    var $anchor = $(this);

    $('html, body').stop().animate({
      scrollTop: $($anchor.attr('href')).offset().top - 41
    }, 1500, 'easeInOutExpo');
    event.preventDefault();

    if(width < 769) {
      $(".navbar-mobile ul.expanded").removeClass("expanded").slideUp('fast');
      $(this).removeClass("open");
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
  navToggle = $('div.navbar-toggle').children('a');

  if (width < 769) {
    mobilenav.html(mainnav.html());

    navToggle.on('click', function (){
      if (mobilenav.children('ul').hasClass("expanded")) {
        mobilenav.children('ul.expanded').removeClass("expanded").slideUp(250);
        $(this).removeClass("open");
      } else {
        mobilenav.children('ul').addClass("expanded").slideDown(250);
        $(this).addClass("open");
      }
    });
  }
});

// dynamic header size
$(function dynamicHeader() {
  var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ? true : false;

  if(!isMobile && height > 750) {
    $('#site-header').css({'height': height + 10 + "px"});
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
    $('html, body').animate({scrollTop: 0}, 600);
    return false;
  });
});

// Skills Progress
$(function moveProgressBar() {
  var animationTime = 2500,
  skillFocus = $(document).scrollTop();
  progressbar = $('div.progress-bar');

  progressbar.each(function() {
    var percent = ($(this).parent().data('progress-percent') / 100),
    getProgressWrapWidth = $(this).width(),
    progressTotal = percent * getProgressWrapWidth;

    $(this).stop().animate({left: progressTotal}, animationTime);
  });
});
