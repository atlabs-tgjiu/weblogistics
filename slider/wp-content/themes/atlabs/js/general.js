/* Custom General jQuery
/*--------------------------------------------------------------------------------------------------------------------------------------*/
;(function($, window, document, undefined) {
	//Genaral Global variables
	var $win = $(window),
		$doc = $(document),
		$winW = function(){ return $(window).width() },
		$winH = function(){ return $(window).height() },
		$mainmenu = $('#mainmenu'),
		$screensize = function(element){  
			$(element).width($winW());
			if( $winH() > 620 ){
				$(element).height($winH());
			} else {
				$(element).height(620);
			}
		};
		
		var screencheck = function(mediasize){
			if (typeof window.matchMedia !== "undefined"){
				var screensize = window.matchMedia("(max-width:"+ mediasize+"px)");
				if( screensize.matches ) {
					return true;
				}else {
					
					return false;
				}
			} else { // for IE9 and lower browser
				if( $winW() <=  mediasize ) {
					return true;
				}else {
					return false;
				}
			}
		};

	$doc.ready(function() {
/*--------------------------------------------------------------------------------------------------------------------------------------*/		

		/* Remove No-js Class
		---------------------------------------------------------------------*/
		$("html").removeClass('no-js').addClass('js');
		
		
		/* Get Screen size box
		---------------------------------------------------------------------*/
		$win.load(function(){
			$win.on('resize', function(){
				$screensize('.hero-section'); 
				if (!screencheck(767)) {
					$screensize('.hero-section'); 
				} else {
					$('.hero-section').removeAttr('style'); 
				}
			}).resize(); 
		});
		
		/* Menu Icon Append prepend for responsive 
		---------------------------------------------------------------------*/
		$(window).on('resize', function(){
			if (screencheck(1023)) {
				if(!$('#menu').length){
					$('#mainmenu').prepend('<a href="#" id="menu" class="menulines-button"><svg viewbox="0 0 100 100"><polygon class="polygon" points="50 2 7 26 7 74 50 98 93 74 93 26" fill="transparent" stroke-width="2" stroke="#fff" stroke-dasharray="0,0,300"/></svg><span class="menulines"></span></a>');
				}
			} else {
				$("#menu").remove();
			}
		}).resize();
		
		/* placeholder support to browsers that wouldn't otherwise support it. 
		---------------------------------------------------------------------*/
		if(!Modernizr.input.placeholder){
			var active = document.activeElement;
			$(':text').focus(function () {
				if ($(this).attr('placeholder') != '' && $(this).val() == $(this).attr('placeholder')) {
					$(this).val('').removeClass('hasPlaceholder');
				}
			}).blur(function () {
				if ($(this).attr('placeholder') != '' && ($(this).val() == '' || $(this).val() == $(this).attr('placeholder'))) {
					$(this).val($(this).attr('placeholder')).addClass('hasPlaceholder');
				}
			});
			$(':text').blur();
			$(active).focus();
			$('form:eq(0)').submit(function () {
				$(':text.hasPlaceholder').val('');
			});
		} 
		
		
		/* Custom Radio and Checkbox
		---------------------------------------------------------------------*/
		if($('input[type="checkbox"], input[type="radio"]').length){
			$('input[type="checkbox"], input[type="radio"]').ezMark();
		}
		
		
		/* Tab Content box 
		---------------------------------------------------------------------*/
		var tabBlockElement = $('.tab-data');
			$(tabBlockElement).each(function(index, element) {
				var $this = $(this),
					tabTrigger = $this.find(".tabnav li"),
					tabContent = $this.find(".tabcontent");
					var textval = new Array();
					tabTrigger.each(function() {
						textval.push( $(this).text() );
					});	
				$this.find(tabTrigger).first().addClass("active");
				$this.find(tabContent).first().show();

				
				$(tabTrigger).on('click',function () {
					$(tabTrigger).removeClass("active");
					$(this).addClass("active");
					$(tabContent).hide().removeClass('visible');
					var activeTab = $(this).find("a").attr("data-rel");
					$this.find('#' + activeTab).fadeIn('normal').addClass('visible');
								
					return false;
				});
			
				var responsivetabActive =  function(){
				if (screencheck(800)){
					if( !$('.tabMobiletrigger').length ){
						$(tabContent).each(function(index, element) {
							$(this).before("<h2 class='tabMobiletrigger'>"+textval[index]+"</h2>");	
							$this.find('.tabMobiletrigger:first').addClass("rotate");
						});
						$('.tabMobiletrigger').click('click', function(){
							var tabAcoordianData = $(this).next('.tabcontent');
							if($(tabAcoordianData).is(':visible') ){
								$(this).removeClass('rotate');
								$(tabAcoordianData).slideUp('normal');
								//return false;
							} else {
								$this.find('.tabMobiletrigger').removeClass('rotate');
								$(tabContent).slideUp('normal');
								$(this).addClass('rotate');
								$(tabAcoordianData).not(':animated').slideToggle('normal');
							}
							return false;
						})
					}
						
				}
				if ( $winW() > 800 ){
					$('.tabMobiletrigger').remove();
					$this.find(tabTrigger).removeClass("active").first().addClass('active');
					$this.find(tabContent).hide().first().show();		
				}
			}
			$(window).on('resize', function(){
				if(!$this.hasClass('only-tab')){
					responsivetabActive();
				}
			}).resize();
		});
		
		/* Accordion box JS
		---------------------------------------------------------------------*/
		$('.accordion-databox').each(function(index, element) {
			var $accordion = $(this),
				$accordionTrigger = $accordion.find('.accordion-trigger'),
				$accordionDatabox = $accordion.find('.accordion-data');
				
				//$accordionTrigger.first().addClass('open');
				//$accordionDatabox.first().show();
				
				$accordionTrigger.on('click',function (e) {
					var $this = $(this);
					var $accordionData = $this.next('.accordion-data');
					if( $accordionData.is($accordionDatabox) &&  $accordionData.is(':visible') ){
						$this.removeClass('open');
						$accordionData.slideUp(400);
						e.preventDefault();
					} else {
						$accordionTrigger.removeClass('open');
						$this.addClass('open');
						$accordionDatabox.slideUp(400);
						$accordionData.slideDown(400);
					}
				})
		});	
		
		
		/* Floating objects JS
		---------------------------------------------------------------------*/
		if($('.parallax-objects').length  && !$('html').hasClass('ie8') ){
			$('.parallax-objects').parallax();
		}
		
		/* Floating objects JS
		---------------------------------------------------------------------*/
		if($('.hero-slider').length){
			$('.hero-slider').slick({
				dots: false,
				slidesToShow: 1,
				infinite: true,
				arrows:false,
				autoplay: true,
				autoplaySpeed: 5000,
				speed: 300,
				adaptiveHeight: false,
				fade: true,
				cssEase: 'linear',
			});
			
			//Handles the carousel thumbnails
			$('.hero-slider-nav li').click(function() {
				var id = $(this).index();
				$('.hero-slider-nav li a').removeClass('active');
				$(this).find('a').addClass('active');
				$('.hero-slider').slick('slickGoTo', id, false);
				return false;
			});
			
			$('.hero-slider').on('afterChange', function(event, slick, currentSlide) {
				$('.hero-slider-nav li a').removeClass('active');
				$('.hero-slider-nav li:eq('+currentSlide+') a').addClass('active');
			});

		}
		
	
		/* Make element floats
		-------------------------------------------------------------------------- */
		if($('.floating-object').length){
			var classes = [ 'jm-icon', 'mg-icon', 'id-icon', 'ps-icon', 'ai-icon', 'css3-icon', 'wp-icon', 'w3c-icon', 'jq-icon', 'ad-icon', 'ap-icon', 'php-icon', 'html5-icon' ];
			$(".floating-object li span").each(function () {
				var idx = ~~ (Math.random() * classes.length);
				$(this).addClass(classes[idx]);
				classes.splice(idx, 1)
			});
			
		}
		
		
		/* Our Work hover
		-------------------------------------------------------------------------- */
		if($('.worklist').length){
			if(!$('.worklist > li a > figure > span').length){
				
				$('<span class="overlay-shed"></span>').prependTo($('.worklist > li a > figure'));
			} 
		}
		
		
		/* Testimonials Slider
		---------------------------------------------------------------------*/
		if($('.testimonial-slider').length){
			//https://jsfiddle.net/aeesy0tb/
			//https://jsfiddle.net/aeesy0tb/2/
			
			var $testimonialSlider = $('.testimonial-slider');
			$testimonialSlider.slick({
				dots: true,
				slidesToShow: 1,
				infinite: true,
				arrows:true,
				autoplay: true,
				autoplaySpeed: 8000,
				speed: 500,
				//adaptiveHeight: true,
				fade: true,
				cssEase: 'linear',
				responsive: [
					{
					  breakpoint: 600,
					  settings: {
						adaptiveHeight: true
					  }
					}
				  ]
			});
			
			$testimonialSlider.on("beforeChange", function(event, slick, currentSlide) {
				var currentSlide, slideType, player, command;
				currentSlide = $(slick.$slider).find(".slick-current");
				slideType = currentSlide.attr("class").split(" ")[1];
				player = currentSlide.find("iframe").get(0);
				if (slideType == "youtube") {
					command = {
						"event": "command",
						"func": "pauseVideo"
					};
					
				} 	
				
				//check if the player exists.
				if (player != undefined) {
					player.contentWindow.postMessage(JSON.stringify(command), "*");
				}
			}); 
			
			$(".testimonial-slider .slick-dots li button, .testimonial-slider .slick-next").on('click', function(){
				$testimonialSlider.slick('slickPause'); 
			});

			function loadBannerPlayer() {
				$(".testimonial-yt-video").each(function(index, element) {
					//var $video = $(".testimonial-yt-video");
					var $video = $(this);
					player =$video.find("iframe").get(0);
					
					var $videoplayer = new YT.Player($video[0], {
						height: '360',
						width: '640',
						videoId: $video.data("video-id"),
						playerVars: {
							showinfo: 0,
							autohide: 1
						},
						events: {
							onStateChange: function (e) {
								if (e.data == YT.PlayerState.BUFFERING || e.data == YT.PlayerState.PLAYING) {
									$testimonialSlider.slick('slickPause'); 
								} else if (e.data == YT.PlayerState.ENDED) {
									$testimonialSlider.slick('slickPlay');
								}
							}
						}
					});
					
				});
				
				
				
			}
					
			if (typeof(YT) == 'undefined' || typeof(YT.Player) == 'undefined') {
				window.onYouTubeIframeAPIReady = function() {
					loadBannerPlayer();
				};
				jQuery.getScript('http://www.youtube.com/iframe_api');
			} else {
				loadBannerPlayer();
			}
		}
		
		/* Go to next screen
		---------------------------------------------------------------------*/
		$('.mouse').click(function(){
			var getOffset = $('.about-infoblock').offset().top;
			if (screencheck(1023)) {
				$("html:not(:animated),body:not(:animated)").animate({ scrollTop:getOffset-26},450);
			} else { 
				$("html:not(:animated),body:not(:animated)").animate({ scrollTop:getOffset},450);
			}
			
			return false;
		});
		
		/* Go to next screen
		---------------------------------------------------------------------*/
		/*if($('.clockbox').length){
			setInterval( function() {
				var seconds = new Date().getSeconds();
				var sdegree = seconds * 6;
				var srotate = "rotate(" + sdegree + "deg)";
              	$("#sec").css({"-moz-transform" : srotate, "-webkit-transform" : srotate, "transform" : srotate});
			}, 1000 );
              
			setInterval( function() {
				var hours = new Date().getHours();
				var mins = new Date().getMinutes();
				var hdegree = hours * 30 + (mins / 2);
				var hrotate = "rotate(" + hdegree + "deg)";
              	$("#hour").css({"-moz-transform" : hrotate, "-webkit-transform" : hrotate, "transform" : hrotate});
				$("#hour-text").text(hours);
              }, 1000 );
			setInterval( function() {
				var mins = new Date().getMinutes();
				var mdegree = mins * 6;
				var mrotate = "rotate(" + mdegree + "deg)";
				$("#min").css({"-moz-transform" : mrotate, "-webkit-transform" : mrotate, "transform" : mrotate});
				$("#min-text").text(mins);
        	}, 1000 );
			
			setInterval( function() {
				var currentTime = new Date ( );
				var currentHours = currentTime.getHours ( );
				var currentMinutes = currentTime.getMinutes ( );
				var currentSeconds = currentTime.getSeconds ( );
				currentMinutes = ( currentMinutes < 10 ? "0" : "" ) + currentMinutes;
				currentSeconds = ( currentSeconds < 10 ? "0" : "" ) + currentSeconds;
				// Choose either "AM" or "PM" as appropriate
				var timeOfDay = ( currentHours < 12 ) ? "AM" : "PM";
				// Convert the hours component to 12-hour format if needed
				currentHours = ( currentHours > 12 ) ? currentHours - 12 : currentHours;
				// Convert an hours component of "0" to "12"
				currentHours = ( currentHours == 0 ) ? 12 : currentHours;
				// Compose the string for display
				var currentTimeString = currentHours + ":" + currentMinutes + ' '+ timeOfDay;
				$('#digital-clock').text(currentTimeString+' (IST)');
			}, 1000 );

		}*/
		
		
		
		/* Header fixed class
		-----------------------------------------------------------------------------------*/
		$(window).scroll(function(){
			if($(this).scrollTop() > $('#main').offset().top ) {
				var logodark = $('#logo img').data('logodark-src');
				//var logolight = $('#logo img').data('logolight-src');
				if(!$('body').hasClass('work')){
					$('#header').addClass('scrolled');
				}
				$('#logo img').attr('src',logodark);
			} else {
				//var logodark = $('#logo img').data('logodark-src');
				var logolight = $('#logo img').data('logolight-src');
				if(!$('body').hasClass('work')){
					$('#header').removeClass('scrolled');
				}
				$('#logo img').attr('src',logolight);
			}
		});
		
		if( $(window).scrollTop() > 5 ){
			if(!$('body').hasClass('work')){
				$('#header').addClass('scrolled');
			}
			var logodark = $('#logo img').data('logodark-src');
			$('#logo img').attr('src',logodark);
		}
		
		if($('.page-title-block').length){
			$(window).scroll( function(){
				if($(this).scrollTop() > 150 ) {
					$('.page-title-block .title-block').removeClass('fadeInDown').addClass('fadeOutUp');
				} else {
					$('.page-title-block .title-block').removeClass('fadeOutUp').addClass('fadeInDown');
				}
			});
		}
		
		/* Scroll Up ad down direction script
		--------------------------------------------------------------------------------------------------------------------------------------*/
		var lastScrollTop = $('#main').offset().top-100;
		$(window).scroll(function(event){
			if(!$('body').hasClass('work')){
				$this = $(this);
				if (!screencheck(1024) && $this.scrollTop() > $('#header').height() ) {
					var st = $this.scrollTop();
					if (st > lastScrollTop){
						$('#header').addClass('is-hidden');
					} else {
						$('#header').removeClass('is-hidden');
					}
					lastScrollTop = st;
				} else if( $('#header').hasClass('is-hidden')) {
					$('#header').removeClass('is-hidden');
				}
			}
		});
		
		
		/* Findus video play
		-----------------------------------------------------------------------------------*/
		if($('#earth-zoom-video').length){
                    	var video = videojs('earth-zoom-video').ready(function(){
				var earthplayer = this;
				earthplayer.on('ended', function() {
					$('#earth-zoom-video').fadeOut(400);
					$('.our-location').addClass('darker');
					$('.map-videobox').addClass('video-ended');
				});
			});
	
			var map_options = {"map_style":"[{\"featureType\":\"all\",\"elementType\":\"all\",\"stylers\":[{\"invert_lightness\":false},{\"hue\":\"#044e66\"},{\"saturation\":-70},{\"lightness\":16},{\"gamma\":0.67}]}]"};

			var	mapOptions = {
				center: new google.maps.LatLng(23.052823, 72.532499),
				zoom:17,
				scrollwheel: false,
				panControl: false,
				mapTypeControl:false,
				streetViewControl: false,
				disableDefaultUI: false,
				zoomControl: false,
			};
			function initMap() {
				map = new google.maps.Map(document.getElementById("contact-map"), mapOptions);
					if (map_options.map_style!=='') {
					var styles = JSON.parse(map_options.map_style);
					map.setOptions( { styles: styles } );
				}
				bounds = new google.maps.LatLngBounds();
				var myIcon = new google.maps.MarkerImage(Pix_Genrs.imgurl + "/marker-pin.png", null, null, null, new google.maps.Size(43,58));
				var marker = new google.maps.Marker({
					position: new google.maps.LatLng(23.052823, 72.532499),
					map: map,
					title: 'Pixlogix infotech Pvt. Ltd.',
					icon: myIcon
				});
			}
			initMap();
			google.maps.event.addDomListener(window, 'load', initMap);
			//google.maps.event.addDomListener(window, 'resize', initMap);
			//$('#map-controls').fadeIn('normal');
			
			$("#zoom-in").on('click', function(){
				var zoomIn = map.getZoom();
				zoomIn++, zoomIn > 22 && (zoomIn = 22), map.setZoom(zoomIn);
				return false;
			});
			
			$("#zoom-out").on('click', function(){
				var zoomOut = map.getZoom();
				zoomOut--, 4 > zoomOut && (zoomOut = 4), map.setZoom(zoomOut)
				return false;
			});
		}
		
		
		/* Portfolio Filter
		-----------------------------------------------------------------------------------*/
		/*$('#work-filters li a').click(function() {
			$('#work-filters li a').removeClass('active');
			$(this).addClass('active');
			
			//var filterVal = $(this).text().toLowerCase().replace(' ','-');
			var filterVal = $(this).data('filter');
			if(filterVal == 'all') {
				$('.worklist li').fadeIn('slow').removeClass('hidden');
			} else {
				$('.worklist li').each(function() {
					if($(this).data('cat') == filterVal ) {
						$(this).fadeIn(300).removeClass('hidden');
					} else {
						$(this).hide().addClass('hidden');	
					}
				});
			}
			if (screencheck(479)) {
				$(this).parents('ul').fadeOut('normal');
				$('#filter-nav').removeClass('menuopen');
			}
			return false;
		});*/
		

		/* Popup function
		---------------------------------------------------------------------*/
		var $dialogTrigger = $('.poptrigger'),
		$pagebody =  $('body');
		$dialogTrigger.click( function(){
			var popID = $(this).attr('data-rel');
			$('body').addClass('overflowhidden');
			$('#' + popID).fadeIn();
			var popheight = $('#' + popID).find('.popup-block').outerHeight(true);
			$('#' + popID).append("<div class='modal-backdrop'></div>");
			$('.popouterbox .modal-backdrop').fadeTo(200, 0.84);
			if( popheight > $winW() ){
				$('.popouterbox .modal-backdrop').height(popheight);
				$('.popouterbox').addClass('taller');
			} 
			$('#' + popID).focus();
			return false;
		});
		
		$(window).on("resize", function () {
			if( $('.popouterbox').length && $('.popouterbox').is(':visible')){
				var popheighton = $('.popouterbox .popup-block').height();
				var winHeight = $(window).height();
				if( popheighton > winHeight ){
					$('.popouterbox .modal-backdrop').height(popheighton);
					$('.popouterbox').addClass('taller');
				} else {
					$('.popouterbox .modal-backdrop').height('100%');
					$('.popouterbox').removeClass('taller');
				}	
			}
		});
		
		//Close popup		
		$(document).on('click', '.close-dialogbox, .modal-backdrop', function(){
			$(this).parents('.popouterbox').fadeOut(300, function(){
				$(this).find('.modal-backdrop').fadeOut(250, function(){
					$('body').removeClass('overflowhidden');
					$(this).remove();
				});
			});
			return false;
		});
		
		
		/* Megamenu
		---------------------------------------------------------------------*/
		$('#mainmenu li .megamenubox').parents('li').addClass('hasnav');
		$('#mainmenu li.hasnav').hover( function(){
			if (!screencheck(1023)) {
				$(this).addClass('current');
				$(this).find('.megamenubox').show();
			}
		},function(){
			if (!screencheck(1023)) {
				$(this).removeClass('current');
				$(this).find('.megamenubox').hide();
			}	
		})
		
		
		/* MatchHeight Js
		-------------------------------------------------------------------------*/
		if($('.megamenubox').length){
			$('.megamenubox div.col').matchHeight();
		}
		if($('.services-listbox').length){
			$('.services-listbox div.col').matchHeight();
		}
		
		if($('.our-team-list, .work-processbox').length){
			$('.our-team-list li figcaption').matchHeight();
			$('.our-team-list li, .work-processbox .col .contentbox').matchHeight();
		} 
		
		if($('.about-ceo-box').length){
			$('.about-ceo-box .col').matchHeight();
		} 
		
		if($('.workwithus-list').length){
			$('.workwithus-list li').matchHeight();
		} 
		
		if($('.psd-to-htmlbox').length){
			$('.psd-to-htmlbox .col').matchHeight();
		} 
		
		if($('.worklist').length){
			$('.worklist li .work-info').matchHeight();
		} 
		
		/*Mobile menu click
		---------------------------------------------------------------------*/
		$(document).on('click',"#menu", function(){
			$(this).toggleClass('menuopen');
			$(this).next('ul').fadeToggle('normal').toggleClass('openmenu');
			return false;
		});
		
		
		/*Appned Prepend
		---------------------------------------------------------------------*/
		$(window).on('resize', function(){
			if (screencheck(1023)) {
				$('.footer-inforow .socialblock').appendTo($('.footer-inforow .wrap'));
			} else {
				$('.footer-inforow .socialblock').insertBefore($('.copyright'));
			}
			
			if (screencheck(567)) {
				$('.contact-frombox .gaurantee').appendTo($('.contact-frombox .formlist li.wider:last'));
			} else {
				$('.contact-frombox .gaurantee').prependTo($('.contact-frombox .formlist li.wider:last'));
			}
			
			if (screencheck(1300)) {
				$('.about-cols .col p').insertBefore($('.about-cols'));
			} else {
				$('.about-infoblock .wrap > p').prependTo($('.about-cols .col:first-child'));
			}
			
			if($('.working-mathod-inforow').length){
				$('.working-mathod-inforow').each(function(index, element) {
					var $this = $(this);
					if (screencheck(767)) {	
						$this.find('.listrow').appendTo($this);
					} else {
						$this.find('.listrow').prependTo($this);
					}
				});
			}
			
		}).resize();
		 
		 
 		
		/* Menu Icon Append prepend for responsive 
		---------------------------------------------------------------------*/
		$(window).on('resize', function(){
			if (screencheck(479)) {
				if(!$('#filter-nav').length){
					$('<a href="#" id="filter-nav" class="menulines-button"><span class="menulines"></span> Filter Portfolio</a>').insertBefore($('#work-filters'));
				}
			} else {
				$("#filter-nav").remove();
			}
		}).resize();
		
		/*Filter menu click
		---------------------------------------------------------------------*/
		$(document).on('click',"#filter-nav", function(){
			$(this).toggleClass('menuopen');
			$(this).next('ul').slideToggle('normal');
			return false;
		});
		
		
		/* image to BG 
		--------------------------------------------------------------------------------------------------------------------------------------*/
		$('.bg-picture, .team-member img').each(function(index, element) {
			//if( $(this).hasClass('bg-picture') ) {
				var imgSrc = $(this).attr('src'),
				    imgHeight = $(this).height();
			  		$(this).parents('figure').css('background-image', 'url('+imgSrc+')');
            //}
			$(this).hide(0);
		});
		
		/* dZUpload Function 
		--------------------------------------------------------------------------------------------------------------------------------------*/
		if($("#dZUpload").length){
			Dropzone.autoDiscover = false;
			$("#dZUpload").dropzone({
				url: "upload.php",
				addRemoveLinks: true,
				success: function (file, response) {
					var imgName = response;
					file.previewElement.classList.add("dz-success");
					//console.log("Successfully uploaded :" + imgName);
				},
				error: function (file, response) {
					file.previewElement.classList.add("dz-error");
				}
			}); 
		}
		
		/* RangeSlider Function 
		--------------------------------------------------------------------------------------------------------------------------------------*/
		if( $(".noUiSlider").length){
			$(".noUiSlider").noUiSlider({
				range: [100, 20000],
				start: [1000, 3000],
				connect: true,
				behaviour: "tap-drag",
				step: 100, 
				slide: function() {
					$("input.range").val("");
					var e = $(this).val();
					$("input.range").val("$" + e[0] + " - $" + e[1]+ " USD");
					if (e[1] == "20000") {
						$("input.range").val("$" + e[0] + "- $" + e[1] + " USD")
					}
				},
				behaviour: "extend-tap",
				serialization: {
					to: [
						[$(".value-one")],
						[$(".value-two")]
					],
					resolution: 1
				}
			});
		}
		
		/* Quote frombox
		--------------------------------------------------------------------------------------------------------------------------------------*/
		if( $('.quote-frombox').length) {
			$('.formlist li.devider-line').prepend($('<span class="line"></span>'));
			$('.formlist li.devider-line span.line').css({width:$winW(), left: -$winW()/2 + $('.quote-frombox ul.formlist').width()/2 });
			$(window).on('resize', function(){
				$('.formlist li.devider-line span.line').css({width:$winW(), left: -$winW()/2 + $('.quote-frombox ul.formlist').width()/2});
			}).resize();
		}
		
		
		/* RangeSlider Function 
		--------------------------------------------------------------------------------------------------------------------------------------*/
		if($('.lightgallery').length){
			$('.lightgallery').lightGallery({
				zoom:false,
				fullScreen:true,
				counter:false,
				showThumbByDefault: false,
				download:false,
				youtubePlayerParams: {
					rel: 0
				}
			});
		}
		
		if($('.infra-slider').length){
			$('.infra-slider').slick({
				dots: false,
				slidesToShow: 3,
				infinite: true,
				arrows:false,
				autoplay: true,
				autoplaySpeed: 6000,
				speed: 450,
				cssEase: 'linear',
				responsive: [
					{
						breakpoint: 1120,
						settings: {
							slidesToShow: 2
						}
					},
					{
						breakpoint: 568,
						settings: {
							slidesToShow: 1,
							fade: true,
						}
					}
				]
			});
		}
		
		/* Download Questionnaire Show hide 
		---------------------------------------------------------------------*/
		$('.down-que-triigerbox a').on('click', function(){
			$(this).parent('.down-que-triigerbox').next('.down-infobox').slideToggle('normal');
			return false;
		});
		
		
		/* Download Questionnaire Show hide 
		---------------------------------------------------------------------*/
		// scrollspy menu
		var lastId;
		topMenu = $(".faq-nav");
		topMenuHeight = topMenu.height();
		menuItems = topMenu.find("a");
		scrollItems = menuItems.map(function(){
		  var item = $($(this).attr("href"));
		  if (item.length) { return item; }
		});
	
		menuItems.click(function(e){
			var href = $(this).attr("href");
			offsetTop = href === "#" ? 0 : $(href).offset().top - 44;
			$('html, body').stop().animate({ 
				  scrollTop: offsetTop
			}, 'normal' );
			e.preventDefault();
		});
		
		$(window).scroll(function(){
		   var fromTop = $(this).scrollTop()+topMenuHeight;
		   var cur = scrollItems.map(function(){
			 if ($(this).offset().top < fromTop)
			   return this;
		   });
		   cur = cur[cur.length-1];
		   var id = cur && cur.length ? cur[0].id : "";
		   if (lastId !== id) {
			   lastId = id;
			   menuItems
				 .parent().removeClass("active")
				 .end().filter("[href='#"+id+"']").parent().addClass("active");
		   }                   
		});   
		
		/* Main menu fixed on scroll 
		---------------------------------------------------------------------*/
		$(window).scroll( function(){
			if( $('.faq-navblock').length){
				if ( $(window).scrollTop() > $('.faq-navblock').offset().top-100 && !$('.faq-navblock .faq-nav').hasClass("fixed") ){
					$('.faq-navblock  .faq-nav').addClass("fixed");
				} else if($(window).scrollTop() <= $('.faq-navblock').offset().top-100 ) {
					$('.faq-navblock .faq-nav').removeClass("fixed");
				}
			}
		});
		
		
		/* Team-tooltip Prevent Default for mobile
		---------------------------------------------------------------------*/
		$('.team-tooltip').on('click', function(e){
			e.preventDefault();
		});
		
		/* Map Button text update
		---------------------------------------------------------------------*/
		$('.map-videobox .video-js .vjs-big-play-button').addClass('findus').html('Our Global Presence');
		
		
		/* Filter Menu fixed position 
		---------------------------------------------------------------------*/
		$(window).scroll( function(){
			if( $('.filter-row-box').length ){
				if ( $(window).scrollTop() > $('.filter-row-box').offset().top && !$('.filter-row-box .filter-row').hasClass("fixed") ){
					$('.filter-row-box .filter-row').addClass("fixed");
				} else if($(window).scrollTop() <= $('.filter-row-box').offset().top ) {
					$('.filter-row-box .filter-row').removeClass("fixed");
				}
			}
		});
		
		
		
		/* Award Section Bubble 
		---------------------------------------------------------------------*/
		if($('.award-infoblock').length){
			function bubbleAnime() {
				var color = 'rgba(255,255,255,0.30)';
				var x = Math.floor(Math.random() * $(window).width());
				var y = Math.floor(Math.random() * $(window).height());
				bubble = document.createElement('span');
				bubble.className = 'bubble';
				bubble.style.top = y + 'px';
				bubble.style.left = x + 'px';
				bubble.style.backgroundColor = color;
				bubble.addEventListener("animationstart", function(e) {
					window.setTimeout(startBubble, 25);	
				}, false);
			  
				bubble.addEventListener("animationend", function(e) {
					$(this).remove();
				}, false);
			
				$(bubble).appendTo($('.award-infoblock'));
			}
			
			function startBubble(){
				window.requestAnimationFrame(bubbleAnime);
			}
			/*if (!screencheck(1023)) {
				
			}*/
			startBubble();
			/*$(window).on('resize', function(){
				if (screencheck(1023)) {
					$('.award-infoblock span.bubble').remove();
				}
			}).resize();*/
		}
/*--------------------------------------------------------------------------------------------------------------------------------------*/		
	});	
/*--------------------------------------------------------------------------------------------------------------------------------------*/
})(jQuery, window, document);                                                                                                