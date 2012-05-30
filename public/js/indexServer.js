!function(win, doc, $, io){
	var socket = io.connect();
	var canvasServer = document.getElementById("canvasServer");
	var contextServer = canvasServer.getContext("2d");
	var oldx = 0;
	var oldy = 0;
	var getCode = function(){
		$('.getCodeBtn').hide();
		$(".codeMessage").html("请稍候。。。");
		socket.emit('getCode');
	};
	var listener = function(){
		socket.on('connect', function(){
			$('.connecting').fadeOut();
			$('.pptServerMain').fadeIn();
		});
		socket.on('doPlay',function(message){
			player.play(window.data);
			setTimeout(function(){
				canvasServer.width = $("#player").width();
				canvasServer.height = $("#player").height();
				$("#canvasServer").css({
					top:$("#player").offset().top,
					left:$("#player").offset().left
				});
				yRate = $("#player").height()/270;
				xRate = $("#player").width()/300;
				$("#canvasServer").show();
			},500);
			socket.emit('setContent', window.data);
		});
		socket.on('doQuit',function(message){
			player.end();
		});
		socket.on('doNavPage',function(message,page){
			player.nav((+page)+1);
		});
		socket.on('doNextPage',function(message){
			player.nextPage();
		});
		socket.on('doPrevPage',function(message){
			player.prevPage();
		});
		socket.on('sendCode',function(code){
			$(".codeMessage").html("");
			$('.getCode').hide();
            $('.getCodeBtn').hide();
			$('.pptServerContent').html("识别码是"+code+",输入识别码后立即播放");
		});
		socket.on('hadGetCode',function(code){
			$('.getCodeBtn').hide();
            $(".codeMessage").html("");
			$('.pptServerContent').html("识别码是"+code+",输入识别码后立即播放");
		});
        socket.on('noGetCode',function(){
    		$('.getCodeBtn').show();
            $(".codeMessage").html("");
		});
		socket.on('doDrawLine',function(x,y){
			x = ~~(x*yRate); 
			y = ~~(y*yRate);
			oldx || (oldx = x);
			oldy || (oldy = y);
			contextServer.save();
			contextServer.strokeStyle="#FF0000";
			contextServer.beginPath();
			contextServer.moveTo(oldx,oldy);
			contextServer.lineTo(x,y);
			contextServer.stroke();
			contextServer.restore();
			oldx=x;
			oldy=y;
		});
		socket.on('zeroDraw',function(){
			oldx = 0;
			oldy = 0;
		});
		
		socket.on('clearDraw',function(){
			contextServer.clearRect(0,0,canvasServer.width,canvasServer.height);
		});
	};
	var init = function(){
		listener();
		$('.getCodeBtn').click(getCode);
	};
	
	init();
}(window,document,jQuery,io);