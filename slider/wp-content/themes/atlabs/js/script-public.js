/**
 * Public Script
 * 
 * Handles to all functional script for visitors
 *
 * @since Pixlogix 1.0
 **/
;(function($, window, document, undefined) {
	
	var $winW = function(){ return $(window).width() };
        var currhref = window.location.href;
        var pagetitle = $(document).prop('title'); //Page title tag
        /*-------------------------------------------------------------
        Loader Markup
        -------------------------------------------------------------*/
        var pixAjaxLoaderMarkup = function(){
            //loader markup
            var markup = '<div class="loader"><div class="loader-inner"><div class="loader-line-wrap"><div class="loader-line"></div></div><div class="loader-line-wrap"><div class="loader-line"></div></div><div class="loader-line-wrap"><div class="loader-line"></div></div><div class="loader-line-wrap"><div class="loader-line"></div></div><div class="loader-line-wrap"><div class="loader-line"></div></div></div></div>';
            //return markup
            return markup;
        };
        //add class when no record page
        if( $('.no-records').length ) {
            $('body').addClass('error404');
        }
        //check skype set or not
        if( $('a.skype').length && $('a.skype').attr('data-skype')){
            var skypeid = $('a.skype').attr('data-skype');
            $('a.skype').attr('href',skypeid);
        }
        /*-------------------------------------------------------------
        Lazyload Images
        -------------------------------------------------------------*/
        var pixLazyload = function(){
             //Lazyload for Images
            var bLazy = new Blazy({
                selector: '.blazy',
                loadInvisible: true
           });
        };
        //Lazyload
        pixLazyload();
        
        /*-------------------------------------------------------------
        Load More Work Script
        -------------------------------------------------------------*/
        $(document).on('click', 'a.load-work-data', function(){
            var $this = $(this);
            var paged = $this.attr('data-paged');
            var category = $this.attr('data-cat');
            $.ajax({
                url	: Pix_Obj.ajaxurl,
                method	: 'POST',
                data	: { action : 'pix_work_load_more', paged : paged, cat : category },
                beforeSend: function(xhr){
                    $('.work-loader').remove();
                    $('<div class="work-loader">'+pixAjaxLoaderMarkup()+'</div>').insertAfter($this);
                },
                success : function(response){
                    //alert(response);return;
                    $('.work-loader').remove();
                    //extract json data
                    var result = $.parseJSON(response);
                    //alert(result.query);
                    //check html is defined and not blank
                    if( typeof result.html !== 'undefined' && result.html !== '' ){
                        //insert response
                        $(result.html).insertAfter( $('ul.worklist li:last') ).hide().fadeIn('normal', function(){
                            //check page
                            if( typeof result.more_page != 'undefined' && result.more_page == 0 ){
                                //hide load more button
                                $this.fadeOut('fast');
                            }//endif
                        });
                        $('ul.worklist').find('li').each(function(){
                            if( !$(this).find('a figure span.overlay-shed').length ) {
                               $('<span class="overlay-shed"></span>').prependTo($(this).find('a > figure'));
                            }
                        });
                        //call lazyload for images
                        pixLazyload();
                        //equal height
                        $('.worklist li .work-info').matchHeight();
                        //change page number to button
                        $this.attr('data-paged', result.paged);
                    }//endif
                }
            });
            return false;
        });

        /*-------------------------------------------------------------
        Load Category Filter Data 
        -------------------------------------------------------------*/
        $(document).on('click','#work-filters li a', function(){
            var $this 	= $(this);
            var category = $this.attr('data-cat');
            var $morebtn = $('.view-more-row').find('a.load-work-data');
            //check has active class
            if( $this.hasClass('active') ){
                return false;
            }//endif
            $('#work-filters a').removeClass('active');
            $this.addClass('active');
            $.ajax({
                url	: Pix_Obj.ajaxurl,
                method	: 'POST',
                data	: { action : 'pix_work_load_cat', cat : category, pagetitle : pagetitle },
                beforeSend: function(xhr){
                    $('li.category-loader').remove();
                    //hide load more button
                    $morebtn.fadeOut('fast');
                    $('ul.worklist').html('<li class="category-loader">'+pixAjaxLoaderMarkup()+'</li>');
                },
                success : function(response){
                    //alert(response);return;
                    $('li.category-loader').remove();
                    if( $winW() < 479 ) {
                        //close filter nav
                        $('#filter-nav').trigger('click');
                    }
                    history.pushState(null, null, $this.attr('href'));
                    //extract json data
                    var result = $.parseJSON(response);
                    //check html is defined and not blank
                    if( typeof result.html != 'undefined' && result.html != '' ){
                        //insert html
                        $('ul.worklist').html(result.html).hide().fadeIn('normal', function(){
                            //change page number to button
                            $morebtn.attr('data-paged', result.paged);
                            $morebtn.attr('data-cat', category);
                            //check view more link
                            if( typeof result.viewmore != 'undefined' && result.viewmore !== '' ){
                                $('.view-more-row .wrap .load-work-data').remove();
                                $(result.viewmore).insertBefore($('.view-more-row .wrap').find('p'));
                            } //endif
                            if( typeof result.title != 'undefined' && result.title != '' ){
                                $(document).prop('title',result.title); //Page title tag
                            } //endif
                        });
                        $('<span class="overlay-shed"></span>').prependTo($('ul.worklist').find('a > figure'));
                        //Image LazyLoad
                        pixLazyload();
                        //equal height
                        $('.worklist li .work-info').matchHeight();
                    }//endif
                }
            });
            //return
            return false;
        });

        /*-------------------------------------------------------------
        Popup function
        ---------------------------------------------------------------*/
        var pixShowWorkDetailsInPopup = function(postid,category){
            //var postid = $(this).attr('data-id');
            var $popouterbox = $('.popouterbox');
            var detailsdata = { action : 'pix_work_single_details', postid : postid, pagetitle : pagetitle };
            //check category is set or not
            if( typeof category != 'undefined' && category !== '') {
                    detailsdata['cat'] = category;
            }//endif

            //AJAX call for Single Work Details
            $.ajax({
                    url		: Pix_Obj.ajaxurl,
                    method	: 'POST',
                    data	: detailsdata,
                    beforeSend: function(xhr){
                        $popouterbox.scrollTop(0);
                        $('body').addClass('overflowhidden');
                        //$popouterbox.find('.modal-backdrop').remove();
                        $popouterbox.contents(':not(".modal-backdrop")').remove();
                        if( ! $('.modal-backdrop').length ){
                                $popouterbox.append("<div class='modal-backdrop'></div>").fadeIn();
                        }//endif
                        $('<div class="work-popup-loader">'+pixAjaxLoaderMarkup()+'</div>').insertBefore( $popouterbox.find('.modal-backdrop') );
                        $popouterbox.find('.modal-backdrop').fadeTo(200, 0.84);
                    },
                    success : function(response){
                        //alert(response);return false;
                        var result = $.parseJSON(response);
                        $popouterbox.find('.work-popup-loader').remove();
                        if( typeof result.html != 'undefined' && result.html != '' ){
                            $(result.html).insertBefore( $popouterbox.find('.modal-backdrop') ).hide().fadeIn();
                            //Lazyload for Images
                            var bLazy = new Blazy({
                                container: '#work-popup',
                                selector: '.blazy',
                                loadInvisible: true,
                                breakpoints: [{ width: 320,src: 'data-mob-src' },
                                 { width: 768, src: 'data-tab-src'
                                }],
                                success: function(ele){
                                    $(ele).parents('figure').removeClass('loading').addClass('autoheight');
                                }
                            });
                            if( typeof result.title != 'undefined' && result.title != '' ){
                                $(document).prop('title',result.title); //Page title tag
                            }
                            $popouterbox.scrollTop(0);
                            $popouterbox.find('img').load( function(){
                                var popheight = $popouterbox.find('.popup-block').outerHeight(true);
                                $popouterbox.find('.modal-backdrop').height(popheight);
                                $popouterbox.addClass('taller');
                            });
                        }
                    }
            });
        };

        /*-------------------------------------------------------------
        Load Work Data
        -------------------------------------------------------------*/
        $(document).on('click', 'a.show-work-details', function(){
                var postid = $(this).attr('data-id');
                var workhref = $(this).attr('href');
                var category = $('#work-filters li a.active').attr('data-cat');
                //check current url and current href is not equal
                if( workhref !== currhref ) {
                    history.pushState(null, null, workhref);
                }//endif
                pixShowWorkDetailsInPopup(postid,category);
                return false;
        });

        /*-------------------------------------------------------------
        Load Category Filter Data 
        -------------------------------------------------------------*/
        if( typeof Pix_Obj.workspage !== 'undefined' && Pix_Obj.workspage !== '' ){
                //post id
                var postid = typeof Pix_Obj.postid !== 'undefined' && Pix_Obj.postid !== '' ? Pix_Obj.postid : false;
                //load work details
                pixShowWorkDetailsInPopup(postid);
        }//endif

        //Close popup
        $(document).on('click', '.close-dialogbox, .modal-backdrop', function(){
            var $parentpopouter = $(this).parents('.popouterbox');
            $parentpopouter.fadeOut(300, function(){
                //replace href to old where user last
                history.replaceState(null, null, currhref);
                //close overlay box
                //Change revert back page title
                if( typeof pagetitle != 'undefined' && pagetitle != '' ){
                        $(document).prop('title', pagetitle); //Page title tag
                } //Endif
                $(this).find('.modal-backdrop').fadeOut(250, function(){
                        $('body').removeClass('overflowhidden');
                        $parentpopouter.contents().remove();
                        //$(this).remove();
                });
            });
            return false;
        });
        //First Block Cycle
        setInterval(function(){
                var $active = $('#fadein-photos-1 .active');
                var $next = ($active.next().length > 0) ? $active.next() : $('#fadein-photos-1 img:first');
                $next.css('z-index',2);//move the next image up the pile
                $active.fadeOut(2500,function(){//fade out the top image
                $active.css('z-index',1).show().removeClass('active');//reset the z-index and unhide the image
                  $next.css('z-index',3).addClass('active');//make the next image the top one
                });
        }, Math.ceil( Math.random() * 10000 ));
        //Second Block Cycle
        setInterval(function(){
                var $active = $('#fadein-photos-2 .active');
                var $next = ($active.next().length > 0) ? $active.next() : $('#fadein-photos-2 img:first');
                $next.css('z-index',2);//move the next image up the pile
                $active.fadeOut(2500,function(){//fade out the top image
                $active.css('z-index',1).show().removeClass('active');//reset the z-index and unhide the image
                  $next.css('z-index',3).addClass('active');//make the next image the top one
                });
        }, Math.ceil( Math.random() * 8000 ));
        //Third Block Cycle
        setInterval(function(){
                var $active = $('#fadein-photos-3 .active');
                var $next = ($active.next().length > 0) ? $active.next() : $('#fadein-photos-3 img:first');
                $next.css('z-index',2);//move the next image up the pile
                $active.fadeOut(2500,function(){//fade out the top image
                $active.css('z-index',1).show().removeClass('active');//reset the z-index and unhide the image
                  $next.css('z-index',3).addClass('active');//make the next image the top one
                });
        }, Math.ceil( Math.random() * 12500 ));
        /* Go to next screen
        ---------------------------------------------------------------------*/
        if($('.clockbox').length){
            var flag = true;
            var timer = '';
            //Analog Clock Seconds
            setInterval( function() { 
                    if ( flag ) { timer = Pix_Obj.currenttime*1000; }
                    var seconds = new Date(timer).getSeconds();
                    var sdegree = seconds * 6;
                    var srotate = "rotate(" + sdegree + "deg)";
                $("#sec").css({"-moz-transform" : srotate, "-webkit-transform" : srotate, "transform" : srotate});
            }, 1000 );
            //Analog Clock Hours
            setInterval( function() {
                if ( flag ) { timer = Pix_Obj.currenttime*1000; }
                var hours = new Date(timer).getHours();
                var mins = new Date(timer).getMinutes();
                var hdegree = hours * 30 + (mins / 2);
                var hrotate = "rotate(" + hdegree + "deg)";
                $("#hour").css({"-moz-transform" : hrotate, "-webkit-transform" : hrotate, "transform" : hrotate});
                $("#hour-text").text(hours);
            }, 1000 );
            //Analog Clock Minute
            setInterval( function() {
                if ( flag ) { timer = Pix_Obj.currenttime*1000; }
                var mins = new Date(timer).getMinutes();
                var mdegree = mins * 6;
                var mrotate = "rotate(" + mdegree + "deg)";
                $("#min").css({"-moz-transform" : mrotate, "-webkit-transform" : mrotate, "transform" : mrotate});
                $("#min-text").text(mins);
            }, 1000 );
            //Digital Clock
            setInterval( function() {
                    if ( flag ) { timer = Pix_Obj.currenttime*1000; }
                    var currentTime = new Date(timer);
                    var currentHours = currentTime.getHours();
                    var currentMinutes = currentTime.getMinutes();
                    var currentSeconds = currentTime.getSeconds();
                    currentMinutes = ( currentMinutes < 10 ? "0" : "" ) + currentMinutes;
                    currentSeconds = ( currentSeconds < 10 ? "0" : "" ) + currentSeconds;
                    // Choose either "AM" or "PM" as appropriate
                    var timeOfDay = ( currentHours < 12 ) ? "AM" : "PM";
                    // Convert the hours component to 12-hour format if needed
                    currentHours = ( currentHours > 12 ) ? currentHours - 12 : currentHours;
                    // Convert an hours component of "0" to "12"
                    currentHours = ( currentHours == 0 ) ? 12 : currentHours;
                    // Compose the string for display
                    var currentTimeString = currentHours + ":" + currentMinutes + ' '+ /*":"  +currentSeconds + " " +*/ timeOfDay;
                    $('#digital-clock').text(currentTimeString+' (IST)');
                    flag = false;
                    timer = timer + 1000;
            }, 1000 );
        }

        /*Scroll To Object
        ---------------------------------------------------------------------*/
        if( window.location.hash == '#find-us' ){
            $(window).scrollTop(0);
            $('html, body').animate({
                scrollTop: $('.find-us-block').offset().top
                },1000, function(){
            });
        }//Endif
        //Click on view map
        if( $('a.view-map').length ) {
            $('a.view-map').on('click', function(){
                $('html, body').animate({
                    scrollTop: $('.find-us-block').offset().top
                    },1000, function(){
                });
                return false;
            });
        }
        /* dZUpload Function 
        --------------------------------------------------------------------------------------------------------------------------------------*/
        if( $("#rq_files").length ){
                Dropzone.autoDiscover = false;
                $("#rq_files").dropzone({
                        url: Pix_Obj.ajaxurl + '?action=rq_file_upload',
                        addRemoveLinks: true,
                        maxFilesize: 10,
                        acceptedFiles: 'image/*,application/pdf,.doc,.docx,.xls,.xlsx,.csv,.tsv,.ppt,.pptx,.pages,.odt,.rtf,.zip,.rar,.txt,.psd,.ai,.indd,.eps,.cdr',
                        hiddenInputContainer: 'form#rq_form',
                        success: function (file, response) {
                                var imgName = response;
                                file.previewElement.classList.add("dz-success");
                        },
                        error: function (file, response) {
                                file.previewElement.classList.add("dz-error");
                        },
                        init: function(){
                                //File Added
                                this.on('addedfile', function(e) {
                                    $('input[name="rq_quote_submit"]').attr("disabled", "disabled")
                                });
                                //Removed File
                                this.on('removedfile', function(e) {
                                    $.ajax({
                                        type: 'POST',
                                        url: Pix_Obj.ajaxurl + '?action=rq_file_remove',
                                        data: { filename : e.name }
                                    });
                                });

                                //Uploading complete
                                this.on('complete', function(e) {
                                        if ( this.getUploadingFiles().length === 0 && this.getQueuedFiles().length === 0 ) {
                                                $('input[name="rq_quote_submit"]').removeAttr('disabled');
                                        }
                                });
                                //Error while uploading file
                                this.on('error', function(e, t, n) {
                                        this.removeFile(e)
                                });
                        }
                });
        }

        /** Request form Validation
        ---------------------------------------------------------------------*/
        if( $('form#rq_form').length ) {
            //check field must be empty
            $.validator.addMethod('empty', function(value, element) {
                return (value === '');
            }, 'This field must remain empty!');
            $('form#rq_form').validate({
                rules: {
                    rq_first_name : { required: true },
                    rq_last_name : { required: true },
                    rq_further_details : { required : '#rq_further_details:visible' },
                    rq_email: { required: true, email : true },
                    rq_phone: { digits: true },
                    rq_timeframe: { required: true },
                    rq_description: { required: true },
                    rq_download_link:{ url: true },
                    rq_hear_about: { required: true },
                    pix_robotic: { empty : true }
                },
                messages : {
                    rq_first_name : { required : 'Please enter first name.' },
                    rq_last_name : { required : 'Please enter last name.' },
                    rq_email: { required : 'Please enter your email address.', email : 'Please enter valid email address.' },
                    rq_phone: { digits : 'Please enter valid phone number.' },
                    rq_further_details : { required : 'Please enter further details.' },
                    rq_timeframe: { required : 'Please enter required timeframe.' },
                    rq_description : { required : 'Please enter your description.' },
                },
                errorPlacement : function(error, element) { 
                    error.insertAfter( element );
                    //scroll body to error
                    $('html, body').animate({scrollTop: $('label.error:first').position().top }, 500);
                }
            });
            //Load google map location textbox
            google.maps.event.addDomListener(window, 'load', function () {
                var places = new google.maps.places.Autocomplete(document.getElementById('rq_location'));
            });
            //On click of other type of project
            $('#rq_type_other').on('click', function(){
                if( $(this).is(':checked') ) {
                    $('#rq_further_details').fadeIn('normal');
                } else {
                    $('#rq_further_details').fadeOut('fast');
                    $('#rq_further_details-error').remove();
                }
            });
        }//Endif
})(jQuery, window, document);