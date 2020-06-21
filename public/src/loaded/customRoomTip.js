
var CustomRoomTipView = (function (_super) {
    _super.uiView = Pai.filterImgAddVersion(_super.uiView)
    function CustomRoomTip() {
        CustomRoomTip.super(this);
        this.back2game.on(Laya.Event.CLICK, this, this.closeBtnClick)
        this.go2charge.on(Laya.Event.CLICK, this, this.go2chargeBtnClick)
    }
    Laya.class(CustomRoomTip, 'CustomRoomTip', _super);
    var _prototype = CustomRoomTip.prototype
    // 关闭窗口
    _prototype.closeBtnClick = function () {
        this.close()
    }
    // 前往充值
    _prototype.go2chargeBtnClick = function () {
        this.close()
        var sp = new ShopView()
        sp.init()
        sp.popup()
    }

    return CustomRoomTip;
})(ui.loaded.customRoomTipUI);
