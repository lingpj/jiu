
var SafeView = (function (_super) {
    _super.uiView = Pai.filterImgAddVersion(_super.uiView)
    function Safe() {
        Safe.super(this);
        this.closeBtn.on(Laya.Event.CLICK, this, this.closeBtnClick)
        this.saveBtn.on(Laya.Event.CLICK, this, this.saveBtnClick)
        this.getBtn.on(Laya.Event.CLICK, this, this.getBtnClick)

        this.saveAddBtn.on(Laya.Event.CLICK, this, this.saveAddBtnClick)
        this.saveReduceBtn.on(Laya.Event.CLICK, this, this.saveReduceBtnClick)

        this.getAddBtn.on(Laya.Event.CLICK, this, this.getAddBtnClick)
        this.getReduceBtn.on(Laya.Event.CLICK, this, this.getReduceBtnClick)
        this.boxMoney.text = '已存入：' + Pai.formatMoney(Pai.selfUserInfo.BankCoin)

        this.addCount = 100
    }
    Laya.class(Safe, 'Safe', _super);
    var _prototype = Safe.prototype
    // 关闭窗口
    _prototype.closeBtnClick = function () {
        this.close()
    }
    // 存
    _prototype.saveBtnClick = function () {
        var self = this
        Pai.addHandle(new Pai.Handler('CoinToBankResponse', function (msg, key) {
            var res = msg[key]
            console.log(res)
            if (res.Status == 1) {
                Pai.selfUserInfo.BankCoin = res.BankCoinAfter
                Pai.selfUserInfo.Coin = res.CoinAfter
                self.boxMoney.text = '已存入：' + Pai.formatMoney(res.BankCoinAfter)
                if (Pai.loadedView) {
                    Pai.loadedView.money.text = Pai.formatMoney(res.CoinAfter)
                }
                if (Pai.customBoard) {
                    Pai.customBoard.p1.getChildByName('money').text = Pai.formatMoney(res.CoinAfter)
                }
            } else {
                Pai.alertView.show(res.Msg)
            }
        }))
        Pai.send({ CoinToBankRequest: { Coin: this.saveInput.text * 1 } })
    }
    // 存钱 +
    _prototype.saveAddBtnClick = function () {
        this.saveInput.text = this.saveInput.text * 1 + this.addCount
    }
    // 存钱 -
    _prototype.saveReduceBtnClick = function () {
        if (this.saveInput.text * 1 == 0) return
        this.saveInput.text = this.saveInput.text * 1 - this.addCount
    }
    // 取
    _prototype.getBtnClick = function () {
        var self = this
        Pai.addHandle(new Pai.Handler('BankToCoinResponse', function (msg, key) {
            var res = msg[key]
            console.log(res)
            if (res.Status == 1) {
                Pai.selfUserInfo.BankCoin = res.BankCoinAfter
                Pai.selfUserInfo.Coin = res.CoinAfter
                self.boxMoney.text = '已存入：' + Pai.formatMoney(res.BankCoinAfter)
                if (Pai.loadedView) {
                    Pai.loadedView.money.text = Pai.formatMoney(res.CoinAfter)
                }
                if (Pai.customBoard) {
                    Pai.customBoard.p1.getChildByName('money').text = Pai.formatMoney(res.CoinAfter)
                }
            } else {
                Pai.alertView.show(res.Msg)
            }
        }))
        Pai.send({ BankToCoinRequest: { Coin: this.getInput.text * 1 } })
    }
    // 取钱 +
    _prototype.getAddBtnClick = function () {
        this.getInput.text = this.getInput.text * 1 + this.addCount
    }
    // 取钱 -
    _prototype.getReduceBtnClick = function () {
        if (this.getInput.text * 1 == 100) return
        this.getInput.text = this.getInput.text * 1 - this.addCount
    }
    //金币放入银行
    // type CoinToBankRequest struct {
    //    Coin int32 //要存入银行的金币数量
    // }

    // type CoinToBankResponse struct {
    //    Status int32
    //    Msg string
    //    CoinAfter int64
    //    BankCoinAfter int64
    // }

    // //金币从银行取出
    // type BankToCoinRequest struct {
    //    Coin int32 //要从银行取出的金币数量
    // }

    // type BankToCoinResponse struct {
    //    Status int32
    //    Msg string
    //    CoinAfter int64
    //    BankCoinAfter int64
    // }

    return Safe;
})(ui.loaded.safeUI);
