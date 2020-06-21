
var ShareView = (function (_super) {
    _super.uiView = Pai.filterImgAddVersion(_super.uiView)
    function Share() {
        Share.super(this);
        this.closeBtn.on(Laya.Event.CLICK, this, this.closeBtnClick)
        this.friendBtn.on(Laya.Event.CLICK, this, this.friendBtnClick)
        this.weChat.on(Laya.Event.CLICK, this, this.weChatClick)
    }
    Laya.class(Share, 'Share', _super);
    var _prototype = Share.prototype
    // 关闭窗口
    _prototype.closeBtnClick = function () {
        this.close()
    }
    // 朋友圈
    _prototype.friendBtnClick = function () {
        Pai.alertView.show('朋友圈')
        this.close()
    }
    // 微信
    _prototype.weChatClick = function () {
        Pai.alertView.show('微信')
        this.close()
    }
    return Share;
})(ui.loaded.shareUI);
