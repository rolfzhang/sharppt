var gesture = {
    startY: 0,
    isStart: false,
    onGestureStart: function(y){
        y = parseInt(y);
        this.startY = y;
        this.isStart = true;
    },
    onGestureEnd: function(y){
        y = parseInt(y);
        if(y-this.startY>50){
            myEvents.trigger('gesture',['down']);
        }else if(this.startY - y > 50){
            myEvents.trigger('gesture',['up']);
        }
        this.startY = 0;
        this.isStart = false;
    }
    
}

window.addEventListener('mousedown', function(e){
    gesture.onGestureStart(e.pageY);
});
window.addEventListener('mouseup', function(e){
    gesture.onGestureEnd(e.pageY);
});
window.addEventListener('touchstart', function(e){
    var touch = e.changedTouches[0];
    gesture.onGestureStart(touch.pageY);
});
window.addEventListener('touchend', function(e){
    var touch = e.changedTouches[0];
    gesture.onGestureEnd(touch.pageY);
});
