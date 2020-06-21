Pai.buffer2Object = function (msg) {
    if (typeof msg == 'string') {
        return msg;
    } else {
        var b = new Laya.Byte();
        b.clear();
        b.writeArrayBuffer(msg);//把接收到的二进制数据读进byte数组便于解析。
        b.pos = 0;//设置偏移指针；
        var str = b.getUTFBytes();
        var obj = JSON.parse(str)
        return obj;
    }
};

/**
 * data:要发送的数据,可以是任何数据类型，不需要做JSON.stringfy处理
 * receive:接收到数据后的回调函数
 * err:出错时的回调函数
 * close:连接关闭时的回调函数
 * debug:开启debug，将在控制打印连接每一步骤
 * @example:
 * Pai.connect({
    data:{Hello:{Name:'Pai'}},
    debug:false,
    receive:function(msg){
        console.log(msg)
    }
});
 */
Pai.connect = function (option) {
    var url = Pai.url;
    var interface = Pai.interface;
    var receive = option.receive || interface;
    var err = option.err || interface;
    var close = option.close || interface;
    var open = option.open || interface;
    var data = option.data || '';
    var debug = option.debug || false;
 
    function __debug() {
        if (debug) {
            for (var i = 0, len = arguments.length; i < len; i++) {
                if (arguments[i]['HeartBeatRequest'] == null) {
                    console.log(arguments[i]);
                }
            }
        }
    }

    if (typeof data != 'string' && isNaN(new Number(data))) {
        data = JSON.stringify(data);
    }

    var b = this.byte = new Laya.Byte();
    this.byte.endian = Laya.Byte.BIG_ENDIAN;
    var s = this.socket = new Laya.Socket();
    this.socket.endian = Laya.Byte.BIG_ENDIAN;
    //建立连接
    console.log('尝试连接')
    this.socket.connectByUrl(url);
    this.socket.on(Laya.Event.OPEN, this, openHandler);
    this.socket.on(Laya.Event.MESSAGE, this, receiveHandler);
    this.socket.on(Laya.Event.CLOSE, this, closeHandler);
    this.socket.on(Laya.Event.ERROR, this, errorHandler);

    function openHandler(event) {
        __debug("open:", event);
        __debug("send:", data);
        open();
        s.send(data);
    }
    function receiveHandler(msg) {
        ///接收到数据触发函数
        // __debug('receive raw data:', msg);
        if (typeof msg != 'string') {
            msg = Pai.buffer2Object(msg);
        }
        receive(msg);
        Pai.handlers.forEach(function (ele) {
            var key = ele.getKey();
            if (msg[key]) {
                ele.handle(msg, key);
            }
        });
    }
    function closeHandler(e) {
        //关闭事件
        __debug('close:', e);
        close(e);
    }
    function errorHandler(e) {
        //连接出错
       
        __debug('error:', e);
        err(e);
    }

    return new function () {
        this.send = function (data) {
            if (typeof data != 'string' && isNaN(new Number(data))) {
                data = JSON.stringify(data);
            }
            s.send(data);
        };
    };
};
