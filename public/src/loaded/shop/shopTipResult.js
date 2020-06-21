
var ShopTipResultView = (function (_super) {
    _super.uiView = Pai.filterImgAddVersion(_super.uiView)
    function ShopTipResult(text) {
        ShopTipResult.super(this);
        this.msg.text = text
        this.closeBtn.on(Laya.Event.CLICK, this, this.closeBtnClick)
    }

    Laya.class(ShopTipResult, 'ShopTipResult', _super);
    var _prototype = ShopTipResult.prototype
    // 关闭窗口
    _prototype.closeBtnClick = function () {
        this.close()
    }
    return ShopTipResult;
})(ui.loaded.shop.shopTipResultUI);
