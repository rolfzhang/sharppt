var eventProxy = function(){
    var events = {},
    registerEvent = function(eName, handler, scope){
        events[eName] = events[eName] || [];
        events[eName].push({
            scope: scope || this,
            handler: handler
        });
    },
    removeEvent = function(eName, handler, scope){
        scope = scope || this;
        if(!handler) return;
        events[eName] = events[eName].filter(function(fn){
            return fn.scope!=scope || fn.handler!=handler;
        });
    },
    triggerEvent = function(eventName,params){
        var fns = events[eventName],i,fn;
        if(!fns) return;
        for(i=0;fn=fns[i];i++){
            fn.handler.apply(fn.scope,params||[]);
        }
    };
    return {
        register: registerEvent,
        remove: removeEvent,
        trigger: triggerEvent
    }
}