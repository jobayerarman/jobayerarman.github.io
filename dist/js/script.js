
$(document).ready(function(){
	/* Parallax Scrolling */

	// Cache the Window object
	$window = $(window);

	$('.parallax').each(function(){
		var $bgobj = $(this); // assigning the object

		$(window).scroll(function() {

			// Scroll the background at var speed
			// the yPos is a negative value because we're scrolling it UP!
			var yPos = -($window.scrollTop() * $bgobj.data('speed'));

			// Put together our final background position
			var coords = 'center '+ yPos + 'px';

			// Move the background
			$bgobj.css({ backgroundPosition: coords });

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
		});
	});

});
