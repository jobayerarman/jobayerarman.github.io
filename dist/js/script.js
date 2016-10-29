// Global Variables
var width  = $(window).width();
var height = $(window).height();
var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ? true : false;


// Typed.js designation
$(function(){
  $(".role").typed({
    strings: ["am a ^400 Dreamer ^650 | Coder ^650 | Developer ", "love ^400 Sublime^700, music^900 &amp;^400 spicy food "],
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
  if( height > 750) {
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
    var animationTime = 1000,
        easing        = 'easeInOutExpo',
        skillTop      = $('#skills').offset().top + 500,
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

// The MIT License (MIT)

// Typed.js | Copyright (c) 2014 Matt Boldt | www.mattboldt.com

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.




! function($) {

  "use strict";

  var Typed = function(el, options) {

    // chosen element to manipulate text
    this.el = $(el);

    // options
    this.options = $.extend({}, $.fn.typed.defaults, options);

    // attribute to type into
    this.isInput = this.el.is('input');
    this.attr = this.options.attr;

    // show cursor
    this.showCursor = this.isInput ? false : this.options.showCursor;

    // text content of element
    this.elContent = this.attr ? this.el.attr(this.attr) : this.el.text();

    // html or plain text
    this.contentType = this.options.contentType;

    // typing speed
    this.typeSpeed = this.options.typeSpeed;

    // add a delay before typing starts
    this.startDelay = this.options.startDelay;

    // backspacing speed
    this.backSpeed = this.options.backSpeed;

    // amount of time to wait before backspacing
    this.backDelay = this.options.backDelay;

    // div containing strings
    this.stringsElement = this.options.stringsElement;

    // input strings of text
    this.strings = this.options.strings;

    // character number position of current string
    this.strPos = 0;

    // current array position
    this.arrayPos = 0;

    // number to stop backspacing on.
    // default 0, can change depending on how many chars
    // you want to remove at the time
    this.stopNum = 0;

    // Looping logic
    this.loop = this.options.loop;
    this.loopCount = this.options.loopCount;
    this.curLoop = 0;

    // for stopping
    this.stop = false;

    // custom cursor
    this.cursorChar = this.options.cursorChar;

    // shuffle the strings
    this.shuffle = this.options.shuffle;
    // the order of strings
    this.sequence = [];

    // All systems go!
    this.build();
  };

  Typed.prototype = {

    constructor: Typed,

    init: function() {
      // begin the loop w/ first current string (global self.strings)
      // current string will be passed as an argument each time after this
      var self = this;
      self.timeout = setTimeout(function() {
        for (var i=0;i<self.strings.length;++i) self.sequence[i]=i;

        // shuffle the array if true
      if(self.shuffle) self.sequence = self.shuffleArray(self.sequence);

        // Start typing
        self.typewrite(self.strings[self.sequence[self.arrayPos]], self.strPos);
      }, self.startDelay);
    },

    build: function() {
      var self = this;
      // Insert cursor
      if (this.showCursor === true) {
        this.cursor = $("<span class=\"typed-cursor\">" + this.cursorChar + "</span>");
        this.el.after(this.cursor);
      }
      if (this.stringsElement) {
        this.strings = [];
        this.stringsElement.hide();
        console.log(this.stringsElement.children());
        var strings = this.stringsElement.children();
        $.each(strings, function(key, value){
          self.strings.push($(value).html());
        });
      }
      this.init();
    },

    // pass current string state to each function, types 1 char per call
    typewrite: function(curString, curStrPos) {
      // exit when stopped
      if (this.stop === true) {
        return;
      }

      // varying values for setTimeout during typing
      // can't be global since number changes each time loop is executed
      var humanize = Math.round(Math.random() * (100 - 30)) + this.typeSpeed;
      var self = this;

      // ------------- optional ------------- //
      // backpaces a certain string faster
      // ------------------------------------ //
      // if (self.arrayPos == 1){
      //  self.backDelay = 50;
      // }
      // else{ self.backDelay = 500; }

      // contain typing function in a timeout humanize'd delay
      self.timeout = setTimeout(function() {
        // check for an escape character before a pause value
        // format: \^\d+ .. eg: ^1000 .. should be able to print the ^ too using ^^
        // single ^ are removed from string
        var charPause = 0;
        var substr = curString.substr(curStrPos);
        if (substr.charAt(0) === '^') {
          var skip = 1; // skip atleast 1
          if (/^\^\d+/.test(substr)) {
            substr = /\d+/.exec(substr)[0];
            skip += substr.length;
            charPause = parseInt(substr);
          }

          // strip out the escape character and pause value so they're not printed
          curString = curString.substring(0, curStrPos) + curString.substring(curStrPos + skip);
        }

        if (self.contentType === 'html') {
          // skip over html tags while typing
          var curChar = curString.substr(curStrPos).charAt(0);
          if (curChar === '<' || curChar === '&') {
            var tag = '';
            var endTag = '';
            if (curChar === '<') {
              endTag = '>';
            }
            else {
              endTag = ';';
            }
            while (curString.substr(curStrPos + 1).charAt(0) !== endTag) {
              tag += curString.substr(curStrPos).charAt(0);
              curStrPos++;
              if (curStrPos + 1 > curString.length) { break; }
            }
            curStrPos++;
            tag += endTag;
          }
        }

        // timeout for any pause after a character
        self.timeout = setTimeout(function() {
          if (curStrPos === curString.length) {
            // fires callback function
            self.options.onStringTyped(self.arrayPos);

            // is this the final string
            if (self.arrayPos === self.strings.length - 1) {
              // animation that occurs on the last typed string
              self.options.callback();

              self.curLoop++;

              // quit if we wont loop back
              if (self.loop === false || self.curLoop === self.loopCount)
                return;
            }

            self.timeout = setTimeout(function() {
              self.backspace(curString, curStrPos);
            }, self.backDelay);

          } else {

            /* call before functions if applicable */
            if (curStrPos === 0) {
              self.options.preStringTyped(self.arrayPos);
            }

            // start typing each new char into existing string
            // curString: arg, self.el.html: original text inside element
            var nextString = curString.substr(0, curStrPos + 1);
            if (self.attr) {
              self.el.attr(self.attr, nextString);
            } else {
              if (self.isInput) {
                self.el.val(nextString);
              } else if (self.contentType === 'html') {
                self.el.html(nextString);
              } else {
                self.el.text(nextString);
              }
            }

            // add characters one by one
            curStrPos++;
            // loop the function
            self.typewrite(curString, curStrPos);
          }
          // end of character pause
        }, charPause);

        // humanized value for typing
      }, humanize);

},

backspace: function(curString, curStrPos) {
      // exit when stopped
      if (this.stop === true) {
        return;
      }

      // varying values for setTimeout during typing
      // can't be global since number changes each time loop is executed
      var humanize = Math.round(Math.random() * (100 - 30)) + this.backSpeed;
      var self = this;

      self.timeout = setTimeout(function() {

        // ----- this part is optional ----- //
        // check string array position
        // on the first string, only delete one word
        // the stopNum actually represents the amount of chars to
        // keep in the current string. In my case it's 14.
        // if (self.arrayPos == 1){
        //  self.stopNum = 14;
        // }
        //every other time, delete the whole typed string
        // else{
        //  self.stopNum = 0;
        // }

        if (self.contentType === 'html') {
          // skip over html tags while backspacing
          if (curString.substr(curStrPos).charAt(0) === '>') {
            var tag = '';
            while (curString.substr(curStrPos - 1).charAt(0) !== '<') {
              tag -= curString.substr(curStrPos).charAt(0);
              curStrPos--;
              if (curStrPos < 0) { break; }
            }
            curStrPos--;
            tag += '<';
          }
        }

        // ----- continue important stuff ----- //
        // replace text with base text + typed characters
        var nextString = curString.substr(0, curStrPos);
        if (self.attr) {
          self.el.attr(self.attr, nextString);
        } else {
          if (self.isInput) {
            self.el.val(nextString);
          } else if (self.contentType === 'html') {
            self.el.html(nextString);
          } else {
            self.el.text(nextString);
          }
        }

        // if the number (id of character in current string) is
        // less than the stop number, keep going
        if (curStrPos > self.stopNum) {
          // subtract characters one by one
          curStrPos--;
          // loop the function
          self.backspace(curString, curStrPos);
        }
        // if the stop number has been reached, increase
        // array position to next string
        else if (curStrPos <= self.stopNum) {
          self.arrayPos++;

          if (self.arrayPos === self.strings.length) {
            self.arrayPos = 0;

            // Shuffle sequence again
            if(self.shuffle) self.sequence = self.shuffleArray(self.sequence);

            self.init();
          } else
          self.typewrite(self.strings[self.sequence[self.arrayPos]], curStrPos);
        }

        // humanized value for typing
      }, humanize);

},
    /**
     * Shuffles the numbers in the given array.
     * @param {Array} array
     * @returns {Array}
     */
     shuffleArray: function(array) {
      var tmp, current, top = array.length;
      if(top) while(--top) {
        current = Math.floor(Math.random() * (top + 1));
        tmp = array[current];
        array[current] = array[top];
        array[top] = tmp;
      }
      return array;
    },

    // Start & Stop currently not working

    // , stop: function() {
    //     var self = this;

    //     self.stop = true;
    //     clearInterval(self.timeout);
    // }

    // , start: function() {
    //     var self = this;
    //     if(self.stop === false)
    //        return;

    //     this.stop = false;
    //     this.init();
    // }

    // Reset and rebuild the element
    reset: function() {
      var self = this;
      clearInterval(self.timeout);
      var id = this.el.attr('id');
      this.el.empty();
      if (typeof this.cursor !== 'undefined') {
        this.cursor.remove();
      }
      this.strPos = 0;
      this.arrayPos = 0;
      this.curLoop = 0;
      // Send the callback
      this.options.resetCallback();
    }

  };

  $.fn.typed = function(option) {
    return this.each(function() {
      var $this = $(this),
      data = $this.data('typed'),
      options = typeof option == 'object' && option;
      if (data) { data.reset(); }
      $this.data('typed', (data = new Typed(this, options)));
      if (typeof option == 'string') data[option]();
    });
  };

  $.fn.typed.defaults = {
    strings: ["These are the default values...", "You know what you should do?", "Use your own!", "Have a great day!"],
    stringsElement: null,
    // typing speed
    typeSpeed: 0,
    // time before typing starts
    startDelay: 0,
    // backspacing speed
    backSpeed: 0,
    // shuffle the strings
    shuffle: false,
    // time before backspacing
    backDelay: 500,
    // loop
    loop: false,
    // false = infinite
    loopCount: false,
    // show cursor
    showCursor: true,
    // character for cursor
    cursorChar: "|",
    // attribute to type (null == text)
    attr: null,
    // either html or text
    contentType: 'html',
    // call when done callback function
    callback: function() {},
    // starting callback function before each string
    preStringTyped: function() {},
    //callback for every typed string
    onStringTyped: function() {},
    // callback for reset
    resetCallback: function() {}
  };


}(window.jQuery);
