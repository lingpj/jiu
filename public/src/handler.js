Pai.Handler = (function(){
    function Handler(key,handleFunc){
        this.key = key;
        this.handleFunc = handleFunc ? handleFunc : function(){};
    }

    __proto = Handler.prototype;

    __proto.handle = function(msg,key){
        this.handleFunc(msg,key);
    };

    __proto.getKey = function(){
        return this.key;
    };

    return Handler;
})();