var Loader = laya.net.Loader;
var Handler = laya.utils.Handler;
Pai.connectSuccess = -1

Pai.musicAllowPlay = 1
Pai.soundAllowPlay = 1

//第一次打招呼
Pai.addHandle(new Pai.Handler('CheckInResponse', function (msg, key) {
    Pai.connectSuccess = 1
    // alert('Pai.wxObjInfo   ：'+Pai.wxObjInfo)
    // 


    // Pai.clearTimeout()
}));

//心跳
Pai.addHandle(new Pai.Handler('HeartBeatRequest', function (msg, key) {
    var _id = msg[key].HeartBeatId
    Pai.send({ HeartBeatResponse: { HeartBeatId: _id } })
}));

function backToLoginPage() {
    //todo: some ui action
    // var view = Laya.stage.getChildAt(0)

    // view.destroyChildren()
    // view.removeSelf()
    // view.destroy()

    // Pai.loginView = new LoginView()

    // Laya.stage.addChild(Pai.loginView)

    var uri = window.location.href;
    if(uri.indexOf("192.168.") > -1 || uri.indexOf("localhost") > -1){
        window.location.href = "http://" + window.location.host + "/bin/way.html";
    }else{
        window.location.href = 'http://www.qfozcx.net/bin/way.html'
    }

    setTimeout(function () {
        backToLoginPage();
    }, 1000);
}


//处理关闭和错误连接的回调
function handleCloseAndError() {
    Pai.meetError = true
    if (!Pai.handling) {
        console.info("reconnecting");
        backToLoginPage();
        Pai.handling = true;
        layer.msg('网络差，正在重连...', {
            time: 1E10
        });
        setTimeout(function () {
            globalConnect(2);
            Pai.handling = false;
        }, 5000);
    }
}

function globalConnect(times) {
    Pai.sender = Pai.connect({
        data: {
            CheckInRequest: {
                Timestamp: parseInt(new Date().getTime() / 1000),
                ClientVerId: 1
            }
        },
        open: function () {

            Pai.handling = false;
            if (times > 1) {
                layer.msg('已连接上，请重新登录', {
                    offset: 't',
                });
            }
        },
        err: function () {
            handleCloseAndError();
        },
        close: function () {
            handleCloseAndError();
        },
        debug: true
    });
}


//连接
globalConnect(1);



// 有人进入房间
Pai.addHandle(new Pai.Handler('EnterRoundBroadcast', function (msg, key) {
    var res = msg[key]
    console.log('有人进入：', res)
    if (res.Status == 1) {

        // 高级、至尊场
        if (res.Round.RoundType <= 2) {
            if (Pai.loadedView != undefined) {
                Pai.loadedView.removeSelf()
            }
            Pai.round = res.Round
            if (Pai.loadedView == undefined) {
                Pai.loadedView = new LoadedView()
            }
            if (Pai.fourBoard == undefined || !Pai.fourBoard._childs) {
                Pai.fourBoard = new FourBoardView()
            }
            Laya.stage.addChild(Pai.fourBoard)
            Pai.fourBoard.updatePlayerStatus()

        }
        // 自建场
        if (res.Round.RoundType == 3) {
            console.log('进入自建房了！')
            if (Pai.loadedView) {
                Pai.loadedView.destroyChildren()
                Pai.loadedView.removeSelf()
                Pai.loadedView = null
            }
            Pai.round = res.Round
            if (!Pai.customBoard || !Pai.customBoard._childs || Pai.customBoard._childs.length < 1) {
                Pai.customBoard = new CustomBoardView()
            }
            console.log(Pai.customBoard)
            Laya.stage.addChild(Pai.customBoard)
            Pai.customBoard.updatePlayerStatus()


        }
        // 百人场
        if (res.Round.RoundType == 4) {
            if (Pai.loadedView != undefined) {
                Pai.loadedView.removeSelf()
            }
            Pai.round = res.Round

            if (Pai.hundredBoard == undefined || !Pai.hundredBoard._childs) {
                Pai.hundredBoard = new HundredBoardView()
            }
            if (Pai.loadedView == undefined) {
                Pai.loadedView = new LoadedView()
            }
            Laya.stage.addChild(Pai.hundredBoard)
            Pai.hundredBoard.updatePlayerStatus()

        }
        // 大天九
        if (res.Round.RoundType == 5) {
            if (Pai.loadedView != undefined) {
                Pai.loadedView.removeSelf()
            }
            Pai.round = res.Round

            if (Pai.dajiuBoard == undefined || !Pai.dajiuBoard._childs) {
                Pai.dajiuBoard = new DajiuBoardView()
            }
            // if (Pai.loadedView == undefined) {
            //     Pai.loadedView = new LoadedView()
            // }
            Laya.stage.addChild(Pai.dajiuBoard)
            Pai.dajiuBoard.updatePlayerStatus()

        }
    } else {
        Pai.alertView.show(res.Msg)

    }
}))


// Laya.init(1136, 640);
Laya.init(402, 752);
Laya.loader.load("res/atlas/comp.json", Handler.create(this, onAssetLoaded), null, Loader.ATLAS);


function onAssetLoaded() {
    Pai.alertView = new AlertView()
    Pai.clockView = new ClockView()

    Laya.SoundManager.playMusic('../bin/res/sound/bg.mp3', 0, new Laya.Handler(this, function () { }))
    //设置适配模式
    // Laya.stage.scaleMode = "exactfit";
    //设置横竖屏
    // Laya.stage.screenMode = Laya.Stage.SCREEN_HORIZONTAL;
    // Laya.stage.screenMode = Laya.Stage.SCREEN_VERTICAL;
    // ["noscale", "exactfit", "showall", "noborder", "full", "fixedwidth", "fixedheight"];
    Laya.stage.scaleMode = "exactfit";
    // Laya.stage.screenMode = Laya.Stage.SCREEN_HORIZONTAL
    //设置水平对齐
    Laya.stage.alignH = "center";
    //设置垂直对齐
    Laya.stage.alignV = "middle";

    // if(Pai.wxObjInfo){
    //   return
    // }
    // Pai.loginView = new LoginView()
    // Laya.stage.addChild(Pai.loginView)



}

// 预加载
var list = [
    "./comp/4renchang/dao-2.png",
    "./comp/4renchang/daojiao-2.png",
    "./comp/4renchang/shun-2.png",
    "./comp/4renchang/shunjiao-2.png",
    "./comp/4renchang/tang-2.png",
    "./comp/4renchang/tianmen2.png",

    "./comp/4renchang/gamebg.png",
    "./comp/4renchang/gamebg2.png",
    "./comp/customBoard/juxing.png",
    "./comp/datianjiu2/beijing.png",
    "./comp/datianjiu2/datianjiu.png",
    "./comp/hundred/bg.png",
    "./comp/hundred/tishitanchuang.png",
    "./comp/hundred/playerList/wanjiatanchuang.png",
    "./comp/hundred2/bg.png",
    "./comp/hundred2/tishitanchuang.png",
    "./comp/hundred2/xinxibg.png",
    "./comp/loaded/homebg.png",
    "./comp/loaded/homebg2.png",
    "./comp/loaded/bignine.png",
    "./comp/loaded/hundreds.png",
    "./comp/loaded/high.png",
    "./comp/loaded/extreme.png",
    "./comp/loaded/qing.png",
    "./comp/loaded/safe-icon.png",
    "./comp/loaded/store-icon.png",
    "./comp/loaded/announcement-icon.png",
    "./comp/loaded/safe/safeframe.png",
    "./comp/loaded/set-icon.png",
    "./comp/loaded/share-icon.png",
    "./comp/loaded/userinfo/personalframe.png",
    "./comp/loaded/customRoom/popupbox.png",
    "./comp/loaded/customRoom/joinRoom/jionframe.png",
    "./comp/loaded/customRoom/createroom.png",
    "./comp/loaded/message/annframe.png",
    "./comp/login/tuceng.png",
    "./comp/login/tuceng2.png",
    "./comp/login/logo.png",
    "./comp/login/denglu.png",
    "./comp/shop/mallframe.png",
    "./comp/shop/bg.png",
    "./comp/shop/buttonbg.png",
    "./comp/shop/图层-25-拷贝-5.png",
    "./comp/shop/offlineframe.png",
    "./comp/shop/tip/kuang.png",
    "./comp/shop/tip/chenggong.png",
    "./comp/shop/duihuan/tishi.png",
    "./comp/loaded/c.png",

    "./comp/4renchang/1.png",
    "./comp/4renchang/10.png",
    "./comp/4renchang/100.png",
    "./comp/4renchang/1000.png",

    "./comp/hundred2/dao1.png",
    "./comp/hundred2/dao2.png",
    "./comp/hundred2/shun1.png",
    "./comp/hundred2/shun2.png",
    "./comp/hundred2/tang.png",
    "./comp/hundred2/tian.png",

    "./comp/4renchang/1.png",
    "./comp/4renchang/10.png",
    "./comp/4renchang/100.png",
    "./comp/4renchang/1000.png",

    "./comp/img/createRoom/fangjian--bg.png",
    "./comp/img/createRoom/Headline.png",
    "./comp/img/createRoom/Return to the hall-button.png",
    "./comp/img/createRoom/WeChat payment--button.png",
    "./comp/img/dating/bairen.png",
    "./comp/img/dating/dajiujiu.png",
    "./comp/img/dating/gaoji.png",
    "./comp/img/dating/kefu.png",
    "./comp/img/dating/zhizun.png",
    "./comp/img/dating/zijian.png",
    "./comp/img/dating/bg.png",
    "./comp/img/dating/bottom.png",
    "./comp/img/dating/mahjong.png",
    "./comp/img/dating/Platform.png",
    "./comp/img/dating/Safe Deposit Box.png",
    "./comp/img/dating/status bar--bg.png",
    "./comp/img/joinRoom/Button--bg.png",
    "./comp/img/joinRoom/delete.png",
    "./comp/img/joinRoom/jiarufangjian--bg.png",
    "./comp/img/joinRoom/litele.png",
    "./comp/img/userinfo/gerenzhong--bg.png",
    "./comp/img/userinfo/icon_frame_32.png",
    "./comp/img/userinfo/Title.png",
    "./comp/img/userinfo/Voucher.png",
    "./comp/img/userinfo/Voucher--bg.png",
    "./comp/img/zijianfang/Create a room.png",
    "./comp/img/zijianfang/Create a room--Platform.png",
    "./comp/img/zijianfang/Join the room.png",
    "./comp/img/zijianfang/Join the room--Platform.png",
    
    
]
for (var i = 0; i < 91; i++) {
    var str = './comp/loaded/' + (i + 1) + '.png'
    list.push(str)
}

for (var i = 0; i < list.length; i++) {
    list[i] = list[i] + '?v=' + Pai.version
    Laya.loader.load(list[i], Laya.Handler.create(this, finished))
}
function finished(e) {

    Pai.preLoadCount++
    document.querySelector('#loading-percent').innerHTML = ((Pai.preLoadCount / list.length) * 100).toFixed(2) + '%'
    console.log(((Pai.preLoadCount / list.length) * 100).toFixed(2) + '%')
    console.log('加载：', Pai.preLoadCount, list.length)
    if (Pai.preLoadCount == list.length) {
        Pai.alertView.show('完成')
        console.log('完成')
        document.body.removeChild(document.querySelector('#loading-percent-wrap'))
        Pai.loginView = new LoginView()
        Laya.stage.addChild(Pai.loginView)

    }
}


