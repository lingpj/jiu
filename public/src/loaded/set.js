
var SetView = (function (_super) {
    _super.uiView = Pai.filterImgAddVersion(_super.uiView)
    function Set() {
        Set.super(this);
        this.closeBtn.on(Laya.Event.CLICK, this, this.closeBtnClick)
        this.soundBtn.on(Laya.Event.CLICK, this, this.soundBtnClick)
        this.musicBtn.on(Laya.Event.CLICK, this, this.musicBtnClick)
        this.changeUserBtn.on(Laya.Event.CLICK, this, this.changeUserBtnClick)
        var headImg = decodeURIComponent(Pai.selfUserInfo.AvatarUrl)
        if(Pai.selfUserInfo.AvatarUrl){
            this.headImg.skin = headImg
        }else{
            this.headImg.skin = '../bin/comp/loaded/' + Pai.selfUserInfo.AvatarId + '.png'
        }
        this.userID.text = 'ID：'+Pai.selfUserInfo.Id
        if (Pai.soundAllowPlay == 1) {
            this.soundBtn.skin = 'comp/loaded/set/open.png'
        } else {
            this.soundBtn.skin = 'comp/loaded/set/close.png'
        }
        if (Pai.musicAllowPlay == 1) {
            this.musicBtn.skin = 'comp/loaded/set/open.png'
        } else {
            this.musicBtn.skin = 'comp/loaded/set/close.png'
        }
    }
    Laya.class(Set, 'Set', _super);
    var _prototype = Set.prototype
    // 关闭窗口
    _prototype.closeBtnClick = function () {
        this.close()
    }
    // 音效
    _prototype.soundBtnClick = function () {
        if (Pai.soundAllowPlay == 1) {
            this.soundBtn.skin = 'comp/loaded/set/close.png'
        } else {
            this.soundBtn.skin = 'comp/loaded/set/open.png'
        }
        Pai.soundAllowPlay = Pai.soundAllowPlay * -1
    }
    // 音乐
    _prototype.musicBtnClick = function () {
        if (Pai.musicAllowPlay == 1) {
            this.musicBtn.skin = 'comp/loaded/set/close.png'
            Laya.SoundManager.stopMusic()
        } else {
            this.musicBtn.skin = 'comp/loaded/set/open.png'
            Laya.SoundManager.playMusic('../bin/res/sound/bg.mp3', 0, new Laya.Handler(this, function () { }))
        }
        Pai.musicAllowPlay = Pai.musicAllowPlay * -1
    }
    // 切换账号
    _prototype.changeUserBtnClick = function () {
        this.close()
        // Pai.alertView.show('切换')

        Pai.addHandle(new Pai.Handler('LogoutResponse', function (msg, key) {
            var res = msg[key]
            if (res.Status == 1) {
                // globalConnect(1);   
                // var view = Laya.stage.getChildAt(0)
                // view.removeSelf()

                // if (Pai.loginView == undefined) {
                //     Pai.loginView = new LoginView()
                // }
                // Laya.stage.addChild(Pai.loginView)
                location.reload()

            }else{
                Pai.alertView.show(res.Msg)
            }
        }))
        Pai.send({
            LogoutRequest: {}
        })

    }

    return Set;
})(ui.loaded.setUI);