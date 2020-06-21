
var LoginView = (function (_super) {
    _super.uiView = Pai.filterImgAddVersion(_super.uiView)
    function Login() {
        Login.super(this);
        this.certainBtn.on(Laya.Event.CLICK, this, this.certainBtnClick)
        this.forget.on(Laya.Event.CLICK, this, this.forgetClick)
        this.goToRegist.on(Laya.Event.CLICK, this, this.goToRegistClick)
        // this.loginFlag.on(Laya.Event.CLICK, this, this.loginFlagClick)
        this.rememberFlag.on(Laya.Event.CLICK, this, this.rememberFlagClick)
        this.registBox.getChildByName('backBtn').on(Laya.Event.CLICK, this, this.backBtnClick)
        this.registBox.getChildByName('certainRegistBtn').on(Laya.Event.CLICK, this, this.certainRegistBtnClick)
        this.init()
        this.rememberChecked = -1
        this.rememberFlag.skin = localStorage.getItem('rememberChecked') || ('comp/img/login/1.png?v=' + Pai.version)
        if (this.rememberFlag.skin == ('comp/img/login/1.png?v=' + Pai.version)) {
            this.username.text = ''
            this.password.text = ''

        } else {
            this.username.text = localStorage.getItem('username') || ''
            this.password.text = localStorage.getItem('password') || ''
        }

        if (Pai.wxObjInfo) {
            Pai.connectTimer = setInterval(function () {
                if (Pai.connectSuccess == 1) {
                    clearInterval(Pai.connectTimer)
                    Pai.sendWxLogin()
                }
            }, 0)
        }


    }
    Laya.class(Login, 'Login', _super);
    var _prototype = Login.prototype

    _prototype.init = function () {
        var self = this

        // Laya.SoundManager.playSound('../bin/res/sound/go.mp3', 1, new Laya.Handler(this, function () { }))

        // 登录回调
        Pai.addHandle(new Pai.Handler('LoginResponse', function (msg, key) {
            var res = msg[key]
            console.log(res)
            if (res.Status == 1) {
                Laya.stage.width = 1136
                Laya.stage.height = 640
                Laya.stage.screenMode = Laya.Stage.SCREEN_HORIZONTAL
                Laya.stage.scaleMode = "exactfit";

                if (Pai.friendShareNumber) {
                    Pai.sendWxEnterRoom()
                }

                if (Pai.loginView) {
                    if (Pai.loginView.rememberChecked == 1) {
                        localStorage.setItem('username', Pai.loginView.username.text)
                        localStorage.setItem('password', Pai.loginView.password.text)
                    }
                }

                if (Pai.loginView) {
                    localStorage.setItem('rememberChecked', Pai.loginView.rememberFlag.skin)
                }

                Pai.selfUserInfo = res.Player
                if (Pai.loginView) {

                    Pai.loginView.removeSelf()
                    Pai.loginView.removeChildren()
                    Pai.loginView.destroy()
                }

                initShare('',res.Player.Id);

                if (res.Player.RoundId != 0 && res.Player.RoundId) {
                    Pai.send({
                        EnterRoundRequest: {
                            RoundId: res.Player.RoundId
                        }
                    })
                    return
                }
                Pai.loadedView = new LoadedView(res.Player.RoundId)
                Laya.stage.addChild(Pai.loadedView)

            } else {
                Pai.alertView.show(res.Msg)
            }
        }))

    }
    // 忘记密码
    _prototype.forgetClick = function () {
        var st = new ShopTipResultView('联系客服')
        st.popup()
    }
    // 注册界面
    _prototype.goToRegistClick = function () {
        this.registBox.visible = true
        this.icon1.visible = false
        this.icon2.visible = false
    }
    // 返回
    _prototype.backBtnClick = function () {
        this.registBox.visible = false
        this.icon1.visible = true
        this.icon2.visible = true
    }
    // 确定注册
    _prototype.certainRegistBtnClick = function () {
        var self = this
        var username = this.registBox.getChildByName('registName').text
        var password = this.registBox.getChildByName('registPwd').text

        Pai.addHandle(new Pai.Handler('RegisterResponse', function (msg, key) {
            var res = msg[key]
            console.log(res)
            if (res.Status == 1) {
                alert(res.Msg)
                self.registBox.visible = false
            } else {
                alert(res.Msg)
            }
        }))
        var parentId = 0

        $.get('/index/index/getParentId', function (r) {
            parent_id = r.parent_id
            console.log(parent_id)
            Pai.send({
                RegisterRequest: {
                    Phone: username,
                    Password: password,
                    ParentId: parseInt(parent_id)
                }
            })
        })
    }
    // 记住密码
    _prototype.rememberFlagClick = function () {
        if (this.rememberFlag.skin == ('comp/img/login/1.png?v=' + Pai.version)) {
            this.rememberFlag.skin = 'comp/img/login/2.png?v=' + Pai.version
        } else {
            this.rememberFlag.skin = ('comp/img/login/1.png?v=' + Pai.version)
        }
        this.rememberChecked = -this.rememberChecked
    }
    // 自动登陆
    // _prototype.loginFlagClick = function () {
    //     if (this.loginFlag.skin == 'comp/login/1.png') {
    //         this.loginFlag.skin = 'comp/login/2.png'
    //     } else {
    //         this.loginFlag.skin = 'comp/login/1.png'
    //     }
    // }
    _prototype.certainBtnClick = function () {
        var username = this.username.text
        var password = this.password.text
        // if (!(/^1[3|5][0-9]\d{4,8}$/.test(username))) {
        //     alert('请输入正确的手机号！')
        //     return
        // }
        // password = hex_md5(password)
        Pai.send({
            LoginRequest: {
                Phone: username,
                Password: password
            }
        })
    }

    return Login;
})(ui.loginUI);
