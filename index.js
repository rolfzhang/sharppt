var express = require('express'),
	sio = require('socket.io'),
	fs=require('fs'),
	path = require('path'),
	url = require('url'),
	parseCookie = require('connect').utils.parseCookie,
	MemoryStore = require('connect/middleware/session/memory');

var usersClient = {},
	codes = [];
	usersServer = {}
	storeMemory = new MemoryStore({
		reapInterval: 60000 * 10
	});

var app = module.export = express.createServer();

app.configure(function(){
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(express.session({
		secret: 'sharppt',
		store:storeMemory 
	}));
	app.use(express.methodOverride());
	app.use(app.router);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.static(__dirname + '/public'));
});

var io = sio.listen(app);
io.set('authorization', function(handshakeData, callback){
	handshakeData.cookie = parseCookie(handshakeData.headers.cookie)
	var connect_sid = handshakeData.cookie['connect.sid'];
	if (connect_sid) {
		storeMemory.get(connect_sid, function(error, session){
			if (error) {
				// if we cannot grab a session, turn down the connection
				callback(error.message, false);
			}
			else {
				// save the session data and accept the connection
				handshakeData.session = session;
				callback(null, true);
			}
		});
	}
	else {
		callback('nosession');
	}
});

app.get('/client',function(req,res){
	var name = "evan"+Math.ceil(Math.random()*10000);
	var method = "pptClient";
	if(name && name!==''){
		req.session.name = name;
		req.session.method = method;//设置session
		var realpath = __dirname + '/public/' + url.parse('mobile.html').pathname;
		var txt = fs.readFileSync(realpath);
		res.end(txt);
	}
});

app.get('/server',function(req,res){
	var name = "evan"+Math.ceil(Math.random()*10000);
	var method = "pptServer";
	if(name && name!==''){
		if (req.session.name && req.session.name !== ''){
			if(req.session.method == "pptServer"){
				var realpath = __dirname + '/public/' + url.parse('index.html').pathname;
				var txt = fs.readFileSync(realpath);
				res.end(txt);
			}
		}else{
			req.session.name = name;
			req.session.method = method;//设置session
			var realpath = __dirname + '/public/' + url.parse('index.html').pathname;
			var txt = fs.readFileSync(realpath);
			res.end(txt);
		}
	}
});

io.sockets.on('connection', function (socket){
	var session = socket.handshake.session;
	var name = session.name;
	var method = session.method;
	if(method == "pptClient"){
		usersClient[name] = {};
		usersClient[name].socket = socket;
	}
	if(method == "pptServer"){
		if(usersServer[name]){
			socket.emit('hadGetCode',usersServer[name].code);
			usersServer[name].socket = socket;
		}else{
			usersServer[name] = {};
			usersServer[name].socket = socket;
		}
	}

	socket.on('getCode',function(){
		var goodCode = 0;
		while(!goodCode){
			goodCode = Math.ceil(Math.random()*10000);
			for(var i in codes){
				if(codes[i] == goodCode){
					goodCode = false;
					break;
				}
			}
		}
		usersServer[name].code = goodCode;
		socket.emit('sendCode',goodCode);
	});

	socket.on('setCode',function(code,fn){
		for(var i in usersServer){
			if(usersServer[i].code == code){
				if(!usersClient[name].control){
					usersClient[name].control = usersServer[i];
					usersServer[i].beControl = usersClient[name];
				}
				fn(code);
				var message = "toPlay";
				name && usersClient[name].control.socket.emit('doPlay',message);
			}
		}
	});


	socket.on('toQuit',function(){
		var message = "doQuit";
		name && usersClient[name].control.socket.emit('doQuit',message);
	});

	socket.on('toPlay',function(){
		var message = "toPlay";
		name && usersClient[name].control.socket.emit('doPlay',message);
	});

	socket.on('toNavPage',function(page){
		var message = "toNavPage";
		name && usersClient[name].control.socket.emit('doNavPage',message,page);
	});

	socket.on('toNextPage',function(){
		var message = "toNextPage";
		name && usersClient[name].control.socket.emit('doNextPage',message);
	});

	socket.on('toPrevPage',function(){
		var message = "toPrevPage";
		name && usersClient[name].control.socket.emit('doPrevPage',message);
	});

	socket.on('setContent',function(data){
		data && usersServer[name].beControl.socket.emit('getContent',data);
	});

	socket.on('toDrawLine',function(x,y){
		name && usersClient[name].control.socket.emit('doDrawLine',x,y);
	});

	socket.on('zeroDraw',function(){
		name && usersClient[name].control.socket.emit('zeroDraw');
	});
	
	socket.on('clearDraw',function(){
		name && usersClient[name].control.socket.emit('clearDraw');
	});
	
});

app.listen(80, function(){
	var addr = app.address();
	console.log('app listening on ' + addr.port);
});
	