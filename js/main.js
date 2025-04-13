

$(document).ready(function() {

  (function($) {
   
      $.fn.parallax = function(options) {
   
          var windowHeight = $(window).height();
   
          var settings = $.extend({
              speed        : 0.15
          }, options);
   
          return this.each( function() {
   
            var $this = $(this);
   
            $(document).scroll(function(){
   
                  var scrollTop = $(window).scrollTop();
                        var offset = $this.offset().top;
                        var height = $this.outerHeight();
   
        if (offset + height <= scrollTop || offset >= scrollTop + windowHeight) {
          return;
        }
   
        var yBgPosition = Math.round((offset - scrollTop) * settings.speed);
   
                          // Apply the Y Background Position to Set the Parallax Effect
            $this.css('background-position', 'center ' + yBgPosition + 'px');
                  
            });
          });
      }
  }(jQuery));


$(window).load(function() {
	$(".loader-overlay").fadeOut("slow");
})


$('.counter').counterUp({
    delay: 4,
    time: 1500
});

$('a[data-rel^=lightcase]').lightcase();


  $('.portfolio-items').mixItUp({
       animation: {
          duration: 300
      }
  });


  $('.cl-logo-carousel').owlCarousel({

	  items : 3,
    autoPlay: 1000,

  });


// Header Changer on Scroll
$(function() {
    //caches a jQuery object containing the header element
    var header = $(".header-home");
    $(window).scroll(function() {
        var scroll = $(window).scrollTop();

        if (scroll >= 100) {
            header.removeClass('header-home').addClass("header-default");
        } else {
            header.removeClass("header-default").addClass('header-home');
        }
    });
});

// Navigation
  $('.nav-container').onePageNav({
    scrollSpeed: 5,
    currentClass: 'current',


  });

//Header Class Change on Resize
  var $window = $(window);

      // Function to handle changes to style classes based on window width
      function checkWidth() {
      if ($window.width() < 767) {
          $('#top-header').removeClass('header-home').addClass('header-default');
          };

      if ($window.width() >= 767) {
          $('#top-header').removeClass('header-default').addClass('header-home');
      }
  }

  // Execute on load
  	checkWidth();

	const spyEls = document.querySelectorAll('.scroll-spy')
	spyEls.forEach(function(spyEl){
  	new ScrollMagic
    .Scene({
      triggerElement: spyEl,
      triggerHook: .5
    })
    .setClassToggle(spyEl, 'show')
    .addTo(new ScrollMagic.Controller())
})

});

function SendMail() {

  //fs.writeFilev is not necessary 
 var htmlContent = '<html>Whatever</html>';

 fs.writeFile('/my-page.html', htmlContent, (error) => { /* handle error */ });

	var params = {
		from_name : document.getElementById("fullName").value,
		email_id : document.getElementById("email_id").value,
		message : document.getElementById("message").value
	}
  
  
    emailjs.send("sueunser", "template_wr4z6y3", params).then(function (res) {
		alert("Success!");	
	})
}

$(".que").click(function() {
	$(this).next(".anw").stop().slideToggle(300);
   $(this).toggleClass('on').siblings().removeClass('on');
   $(this).next(".anw").siblings(".anw").slideUp(300); // 1개씩 펼치기
 });


 function updateDiv()
 {
 $( "#show" ).load(window.location.href + " #show" );
 }

 function editedUpdateDiv()
 {
 $( "#edit" ).load(window.location.href + " #edit" );
 }

 function editedUpdateDiv1()
 {
 $( "#edit1" ).load(window.location.href + " #edit1" );
 }



 