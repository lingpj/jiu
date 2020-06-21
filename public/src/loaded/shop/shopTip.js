
var ShopTipView = (function (_super) {
    _super.uiView = Pai.filterImgAddVersion(_super.uiView)
    function ShopTip(callback, msg, params) {

        ShopTip.super(this);
        this.closeBtn.on(Laya.Event.CLICK, this, this.closeBtnClick)
        this.certainBtn.on(Laya.Event.CLICK, this, this.certainBtnClick)
        this.callback = callback
        this.msg.text = msg || '确认是否兑换？'
        if (params) {
            this.certainBtn.skin = '../bin/comp/shop/tip/' + params.certainBtnSkin
        }
    }
    Laya.class(ShopTip, 'ShopTip', _super);
    var _prototype = ShopTip.prototype
    // 关闭窗口
    _prototype.closeBtnClick = function () {
        this.close()
    }
    // 确定
    _prototype.certainBtnClick = function () {
        this.close()
        this.callback()
    }
    return ShopTip;
})(ui.loaded.shop.shopTipUI);
