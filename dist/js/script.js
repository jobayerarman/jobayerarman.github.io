
$(document).ready(function(){
	/* Parallax Scrolling */
	// Cache the Window object
	$window = $(window);

	$('.parallax').each(function(){
		var $bgobj = $(this); // assigning the object

		$(window).scroll(function() {

			// Scroll the background at var speed
			// the yPos is a negative value because we're scrolling it UP!
			var yPos = -($window.scrollTop() / $bgobj.data('speed'));

			// Put together our final background position
			var coords = 'center '+ yPos + 'px';

			// Move the background
			if($(window).width() > 768) {
				$bgobj.css({ backgroundPosition: coords });
			}

		}); // window scroll Ends
	});

	// jQuery for page scrolling feature - requires jQuery Easing plugin
	$(function() {
		$('body').on('click', '.page-scroll a', function(event) {
			var $anchor = $(this);
			$('html, body').stop().animate({
				scrollTop: $($anchor.attr('href')).offset().top
			}, 1500, 'easeInOutExpo');
			event.preventDefault();
			if($(window).width() < 769) {
				$("#navbar-mobile ul.expanded").removeClass("expanded").slideUp('fast');
				$(this).removeClass("open");}
		});
	});

	// slide up and down menu on mobile screen
	$(function() {
		$("#navbar-mobile").html($("#navbar-main").html());
		$("#navbar-toggle").click(function (){
			if ($("#navbar-mobile ul").hasClass("expanded")) {
				$("#navbar-mobile ul.expanded").removeClass("expanded").slideUp(250);
				$(this).removeClass("open");
			} else {
				$("#navbar-mobile ul").addClass("expanded").slideDown(250);
				$(this).addClass("open");
			}
		});
	});

	// dynamic header size
	$(function () {
		var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ? true : false;
			var height = $(window).height();
		if(!isMobile && height > 750) {
			$('#site-header').css({'height': height + 20 + "px"});
		}
	});

});
