;(function($, window, document, undefined) {
$(document).ready(function() {
	if($('#star-box').length && !$('html').hasClass('ie9') && !$('html').hasClass('ie8') ){
		var canvas = document.getElementById('star-box'),
			ctx = canvas.getContext('2d'),
			$winW = function(){ return $(window).width() };
			if($winW() > 1024 ) {
				canvas.width = window.innerWidth;
			  	canvas.height = window.innerHeight;	
			} else {
				canvas.width = 1180;
			  	canvas.height = 968;	
			}
		  
		  //canvas.width = $('.star-section').width();
		  //canvas.height = $('.star-section').height();
		  ctx.lineWidth = .1;
		  
		  
		  //ctx.strokeStyle = new Color(150).style;
		
		  var mousePosition = {
			x: 10 * canvas.width / 50,
			y: 10 * canvas.height / 50
		  };
		
		  var dots = {
			nb: 150,
			distance: 100,
			d_radius: 50,
			array: []
		  };
		
		  function colorValue(min) {
			return Math.floor(Math.random() * 255 + min);
		  }
		  
		  function createColorStyle(r,g,b) {
			return 'rgba(' + r + ',' + g + ',' + b + ', 0.35)';
		  }
		  
		  function mixComponents(comp1, weight1, comp2, weight2) {
			return (comp1 * weight1 + comp2 * weight2) / (weight1 + weight2);
		  }
		  
		  function averageColorStyles(dot1, dot2) {
			var color1 = dot1.color,
				color2 = dot2.color;
			
			var r = mixComponents(color1.r, dot1.radius, color2.r, dot2.radius),
				g = mixComponents(color1.g, dot1.radius, color2.g, dot2.radius),
				b = mixComponents(color1.b, dot1.radius, color2.b, dot2.radius);
			return createColorStyle(Math.floor(r), Math.floor(g), Math.floor(b));
		  }
		  
		  function Color(min) {
			min = min || 0;
			this.r = colorValue(50);
			this.g = colorValue(230);
			this.b = colorValue(250);
			this.style = createColorStyle(this.r, this.g, this.b);
		  }
		
		  function Dot(){
			this.x = Math.random() * canvas.width;
			this.y = Math.random() * canvas.height;
		
			this.vx = -.5 + Math.random();
			this.vy = -.5 + Math.random();
		
			this.radius = Math.random() * 2;
		
			this.color = new Color();
			//console.log(this);
		  }
		
		  Dot.prototype = {
			draw: function(){
			  ctx.beginPath();
			  ctx.fillStyle = this.color.style;
			  ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
			  ctx.fill();
			}
		  };
		
		  function createDots(){
			for(i = 0; i < dots.nb; i++){
			  dots.array.push(new Dot());
			}
		  }
		
		  function moveDots() {
			for(i = 0; i < dots.nb; i++){
		
			  var dot = dots.array[i];
		
			  if(dot.y < 0 || dot.y > canvas.height){
				dot.vx = dot.vx;
				dot.vy = - dot.vy;
			  }
			  else if(dot.x < 0 || dot.x > canvas.width){
				dot.vx = - dot.vx;
				dot.vy = dot.vy;
			  }
			  dot.x += dot.vx;
			  dot.y += dot.vy;
			}
		  }
		
		  function connectDots() {
			for(i = 0; i < dots.nb; i++){
			  for(j = 0; j < dots.nb; j++){
				i_dot = dots.array[i];
				j_dot = dots.array[j];
		
				if((i_dot.x - j_dot.x) < dots.distance && (i_dot.y - j_dot.y) < dots.distance && (i_dot.x - j_dot.x) > - dots.distance && (i_dot.y - j_dot.y) > - dots.distance){
				  if((i_dot.x - mousePosition.x) < dots.d_radius && (i_dot.y - mousePosition.y) < dots.d_radius && (i_dot.x - mousePosition.x) > - dots.d_radius && (i_dot.y - mousePosition.y) > - dots.d_radius){
					ctx.beginPath();
					ctx.strokeStyle = averageColorStyles(i_dot, j_dot);
					ctx.moveTo(i_dot.x, i_dot.y);
					ctx.lineTo(j_dot.x, j_dot.y);
					ctx.stroke();
					ctx.closePath();
				  }
				}
			  }
			}
		  }
		
		  function drawDots() {
			for(i = 0; i < dots.nb; i++){
			  var dot = dots.array[i];
			  dot.draw();
			}
		  }
		
		  function animateDots() {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			moveDots();
			
			drawDots();
			
			var isMobile = {
				Android: function() {
					return navigator.userAgent.match(/Android/i);
				},
				BlackBerry: function() {
					return navigator.userAgent.match(/BlackBerry/i);
				},
				iOS: function() {
					return navigator.userAgent.match(/iPhone|iPad|iPod/i);
				},
				Opera: function() {
					return navigator.userAgent.match(/Opera Mini/i);
				},
				Windows: function() {
					return navigator.userAgent.match(/IEMobile/i);
				},
				any: function() {
					return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
				}
			};
			
			if( !isMobile.any() ) {
				connectDots();
				ctx.lineWidth = 0;
			}  
		 
			
			requestAnimationFrame(animateDots);	
		  }
		
		  $('canvas').on('mousemove', function(e){
			mousePosition.x = e.pageX;
			mousePosition.y = e.pageY;
		  });
		
		  $('canvas').on('mouseleave', function(e){
			mousePosition.x = canvas.width / 2;
			mousePosition.y = canvas.height / 2;
		  });
		
		  createDots();
		  requestAnimationFrame(animateDots);	
			$(window).on('resize', createDots);		
		}
});	
})(jQuery, window, document);   