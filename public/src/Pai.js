String.prototype.endWith = function (str) {
    var reg = new RegExp(str + '$')
    return reg.test(this)
}
var Pai = {
    // url:"ws://www.jskjjsql.cn:4565",
    // url:'ws://127.0.0.1:3653',
    url: 'ws://192.168.1.138:4566',
    baseUrl: '192.168.1.138/upload/',
    friendShareNumber: '',
    setTimeoutArr: [],
    setIntervalArr: [],
    alertTimeoutArr: [],
    wxObjInfo: '',
    meetError: false,
    preLoadCount: 0,
    createRoomNumber: '',
    version: 20,
    filterImgAddVersion: function (obj) {
        var viewArr = obj.child
        for (var i = 0; i < viewArr.length; i++) {
            var v = viewArr[i]
            if (v.type == 'Image' && v.props.skin) {
                var str = v.props.skin
                if (str.endWith('.png')) {
                    v.props.skin = str + '?v=' + Pai.version
                } else if (str.indexOf('?v=') > 0) {
                    var end = str.indexOf('?v=')
                    v.props.skin = str.slice(0, end) + '?v=' + Pai.version
                }
            }
            if (v.child) {
                Pai.filterImgAddVersion({
                    child: v.child
                })
            }
        }
        return obj
    },
    sendWxLogin: function () {
        if (typeof Pai.wxObjInfo != 'undefined') {

            $.get('/index/index/getParentId', function (r) {
                parent_id = r.parent_id
                Pai.wxObjInfo.ParentId = parseInt(parent_id)
                Pai.send({
                    LoginRequest: Pai.wxObjInfo
                })
            })
        }
    },
    sendWxEnterRoom: function () {
        Pai.send({
            EnterRoundRequest: {
                RoundType: 3,
                RoundNumber: parseInt(Pai.friendShareNumber)
            }
        })
    },
    clearTimeout: function () {
        for (var i = 0; i < Pai.setTimeoutArr.length; i++) {
            clearTimeout(Pai.setTimeoutArr[i])
        }
    },
    clearAlertTimeout: function () {
        for (var i = 0; i < Pai.alertTimeoutArr.length; i++) {
            clearTimeout(Pai.alertTimeoutArr[i])
        }
        Pai.alertView.x = (Laya.stage.width - Pai.alertView.width) / 2
        Pai.alertView.y = (Laya.stage.height - Pai.alertView.height) / 4 + 50
    },
    clearInterval: function () {
        for (var i = 0; i < Pai.setIntervalArr.length; i++) {
            clearInterval(Pai.setIntervalArr[i])
        }
        Pai.clockView.removeSelf()
    },
    formatMoney: function (money) {
        if (money >= 100000000) {
            money = (money * 1 / 100000000).toFixed(2) + '亿'
        }
        if (money >= 10000) {
            money = (money * 1 / 10000).toFixed(2) + '万'
        }
        return money
    },
    interface: function () { },
    sender: null,
    send: function (data) {
        if (data['HeartBeatResponse'] == null) {
            console.log('发送的数据：', data)
        }
        Pai.sender.send(data);
    },
    handlers: [],
    addHandle: function (handler) {
        if (handler instanceof Pai.Handler) {
            //过滤相同的key，不能重复添加
            for (var i = 0, len = Pai.handlers.length; i < len; i++) {

                if (Pai.handlers[i] != undefined) {
                    if (Pai.handlers[i].key == handler.key) {
                        Pai.handlers.splice(i, 1)
                        // console.log(Pai.handlers[i].key)
                        // console.log(Pai.handlers)
                    }
                }
            }
            Pai.handlers.push(handler)
            return Pai.handlers;
        } else {
            throw 'Argument hander must be instance of Pai.Handler !';
        }
    },
    //兼容开发者的书写错误
    addHandler: function (handler) {
        Pai.addHandle(handler);
    },
    deepCopy: function (p, c) {
        var c = c || {};
        for (var i in p) {
            if (typeof p[i] === 'object') {
                c[i] = (p[i].constructor === Array) ? [] : {};
                deepCopy(p[i], c[i]);
            } else {
                c[i] = p[i];
            }
        }
        return c;
    }
}