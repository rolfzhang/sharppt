!function(win, doc, io){
	var socket = io.connect();
	var canvasClient = document.getElementById("canvasClient");
	canvasClient.width = 380;
	canvasClient.height = 270;
	var contextClient = canvasClient.getContext("2d");
	var markerTpl = "<div id=\"marker\" class=\"theMarker\" style=\"display:none;height:966px;\"></div>";
	var marker;
	var mouseState;
	//匹配code
	var setCode = function(){
        marker.show();
		var code = $("input[name='setCode']").val();
		socket.emit('setCode', code, bindCtrl);
	};
	
	//显示操作界面，隐藏输入code界面
	var bindCtrl = function(code){
        marker.hide();
		$("#loginPanel").hide();
		$("#slideApp").show();
		if(code){
			myEvents.register('gesture',onGesture);
			myEvents.register('pageChange',setCurrentPage);
			$("#exitBtn").bind("click",toQuit);
			$("#draw").bind("click",draw);
		}else{
			$('.pptClientContent').html("连接失败");
		}
	};
	var setCurrentPage = function(num){
		toNavPage(num);
	}
	var onGesture = function(type){
		if(!slideCtrl.onCtrl){
            return;
        }
        if(type=='up'){
            toNextPage();
        }else if(type=='down'){
            toPrevPage();
        }
    };
	//播放
	var toPlay = function(){
		socket.emit('toPlay');
		socket.emit('clearDraw');
	};
	//播放
	var toQuit = function(){
        socket.emit('toQuit');
		window.location.reload();
	};
	//跳转
	var toNavPage = function(num){
		socket.emit('toNavPage',num);
		socket.emit('clearDraw');
	};
	//下一页
	var toNextPage = function(){
		socket.emit('toNextPage');
		socket.emit('clearDraw');
	};
	//上一页
	var toPrevPage = function(){
		socket.emit('toPrevPage');
		socket.emit('clearDraw');
	};
	var count = 1;
	var startDraw = function(e){
		mouseState =  true;
		if(e.originalEvent.touches){
			e = e.originalEvent.changedTouches[0];
			console.log(e.pageX);
		}
		for(var i in e){
			console.log(i);
		}
		
		var x=e.pageX-$("#slides").offset().left;
		var y=e.pageY-$("#slides").offset().top;
		contextClient.save();
		contextClient.strokeStyle="#FF0000";
		
		contextClient.moveTo(x,y);
		contextClient.beginPath();
	};
	var drawing = function(e){
		if(mouseState){
			if(e.originalEvent.touches){
				e = e.originalEvent.touches[0];
			}
		
			var x=e.pageX-$("#slides").offset().left;
			var y=e.pageY-$("#slides").offset().top;
			contextClient.lineTo(x,y);
			contextClient.stroke();
			
			if(count%5){
				socket.emit('toDrawLine',x,y);
				count = 0;
			}
			count++;
		}
	};
	var draw = function(){
		slideCtrl.onCtrl = false;
		$('#goBackCtrlBtn2').show();
    	$('#slideCtrlBtns').hide();
    	$('#goBackCtrlBtn2').unbind().bind("click",function(){
    		$('#goBackCtrlBtn2').hide();
    		$('#slideCtrlBtns').show();
    		slideCtrl.onCtrl = true;
    		clearDraw();
    	});
		window.scrollTo(0,-5);
		$("#canvasClient").show();
		$("#canvasClient").bind("touchstart",startDraw);
		$("#canvasClient").bind("touchmove",drawing);
		$("#canvasClient").bind("touchend", function(){
			mouseState = false;
    		socket.emit('zeroDraw');
    		contextClient.restore();
		});
	};
	var clearDraw = function(){
		contextClient.clearRect(0,0,canvasClient.width,canvasClient.height);
		socket.emit('clearDraw');
		$("#canvasClient").unbind();
		$("#canvasClient").hide();
	};
	var listener = function(){
		//握手，去掉准备页面，加载主界面
		socket.on('connect', function(){
			marker.hide();
			$('#loginPanel').show();
            $(".setCode").show();
		});
		socket.on('getContent',function(data){
			data && (pptData = data);
			slideCtrl.init();
			pageList.init();
		});
	};
	var init = function(){
		marker = $('#marker');
        marker && marker.length === 0 && (marker = $(markerTpl)) && ($("body").append(marker));
        marker && marker.height($(document).height()).show();
		listener();
		$('.setCodeBtn').bind("click",setCode);
	};
	init();
}(window,document,io);