/* Parallax Scrolling */
$(function parallaxScrolling() {
	// Cache the Window object
	$window = $(window);
	var $bgobj = $('.parallax'); // assigning the object

	$window.scroll(function() {
		// Scroll the background at var speed
		// the yPos is a negative value because we're scrolling it UP!
		var yPos = -($window.scrollTop() / $bgobj.data('speed'));
		// Put together our final background position
		var coords = 'center '+ yPos + 'px';

		var limit = $(document).scrollTop();

		// Move the background
		if($window.width() > 768 && limit < 800) {
			$bgobj.css({ backgroundPosition: coords });
		}
	}); // window scroll Ends
});

// jQuery for page scrolling feature - requires jQuery Easing plugin
$(function pageScroll() {
	$('body').on('click', '.page-scroll a', function(event) {
		var $anchor = $(this);

		$('html, body').stop().animate({
			scrollTop: $($anchor.attr('href')).offset().top
		}, 1500, 'easeInOutExpo');
		event.preventDefault();

		if($(window).width() < 769) {
			$("#navbar-mobile ul.expanded").removeClass("expanded").slideUp('fast');
			$(this).removeClass("open");
		}
	});
});

// sliding menu on mobile screen
$(function mobileNav() {
	var mobilenav = $('div#navbar-mobile'),
			mainnav 	= $('div#navbar-main'),
			navToggle = $('div.navbar-toggle').children('a');
			width 		= $(window).width();

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
	var height = $(window).height();

	if(!isMobile && height > 750) {
		$('#site-header').css({'height': height + 10 + "px"});
	}
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
