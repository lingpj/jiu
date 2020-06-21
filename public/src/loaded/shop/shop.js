
var ShopView = (function (_super) {
    _super.uiView = Pai.filterImgAddVersion(_super.uiView)
    function Shop() {
        Shop.super(this);
        this.closeBtn.on(Laya.Event.CLICK, this, this.closeBtnClick)
        this.emailBox.getChildByName('backBtn').on(Laya.Event.CLICK, this, this.backBtnClick)
        this.emailBox.getChildByName('certainBtn').on(Laya.Event.CLICK, this, this.certainBtnClick)
        this.tabArr = [this.zxcz, this.kf, this.dhspj, this.dhsp]
        this.tabDetailArr = [this.zxczList, this.kefuList, this.dhspjList, this.dhspList]
        this.zxczList.vScrollBarSkin = ''
        this.dhspjList.vScrollBarSkin = ''
        this.dhspList.vScrollBarSkin = ''
        this.kefuList.vScrollBarSkin = ''
        this.kfwx = ''
    }
    Laya.class(Shop, 'Shop', _super);
    var _prototype = Shop.prototype
    // 关闭窗口
    _prototype.closeBtnClick = function () {
        this.close()
    }
    // tabbar点击
    _prototype.tabbarClick = function (ele) {

        for (var i = 0; i < this.tabArr.length; i++) {
            var obj = this.tabArr[i]
            obj.selected = false
        }
        ele.selected = true
        for (var i = 0; i < this.tabDetailArr.length; i++) {
            this.tabDetailArr[i].visible = false
        }
        this.tabDetailArr[ele.tag].visible = true
        this.emailBox.visible = false
    }
    // 初始化
    _prototype.init = function () {
        var self = this
        self.money.text = Pai.formatMoney(Pai.loadedView.money.text)
        self.voucher.text = Pai.loadedView.voucher.text
        for (var i = 0; i < this.tabArr.length; i++) {
            var obj = this.tabArr[i]
            obj.tag = i
            obj.on(Laya.Event.CLICK, this, this.tabbarClick, [obj])
        }
        // 客服微信
        Pai.addHandle(new Pai.Handler('ServerWeChatResponse', function (msg, key) {
            var res = msg[key]
            console.log(res)
            self.kfwx = res.WeChat[0].Number
            var arr = []
            for (var i = 0; i < res.WeChat.length; i++) {
                var obj = res.WeChat[i]
                arr.push({
                    pic: { skin: '../bin/comp/shop/客服' + (i + 1) + '.png' },
                    name: { text: obj.Name },
                    number: { text: obj.Number },
                });
            }
            self.kefuList.dataSource = arr;
        }))
        Pai.send({ ServerWeChatRequest: {} })
        // 在线充值
        var cost = [8, 18, 98]
        var zxczListArr = []
        for (var i = 0; i < cost.length; i++) {
            zxczListArr.push({
                name: { text: cost[i] * 1 + '金币' },
                cost: { text: cost[i] },
            });
        }
        // 兑换商品券
        var arrbox = []
        for (var i = 0; i < 30; i++) {
            arrbox.push({
                name: { text: (i + 1) },
                cost: { text: (101 + i) },
            });
        }
        // 兑换商品
        Pai.addHandle(new Pai.Handler('ProductListResponse', function (msg, key) {
            var res = msg[key]
            console.log(res)
            var dhspListArr = []
            
            for (var i = 0; i < res.Products.length; i++) {
                var pro = res.Products[i]
                dhspListArr.push({
                    name: { text: pro.Name },
                    cost: { text: pro.Price },
                    ID: { text: pro.ProductId },
                    // pic: { skin: Pai.baseUrl + pro.Img },
                });
            }
            self.dhspList.dataSource = dhspListArr;
        }))
        Pai.send({ ProductListRequest: {} })
        // 兑换商品券
        this.zxczList.dataSource = zxczListArr;
        this.dhspjList.dataSource = arrbox;
        this.zxczList.renderHandler = new Handler(this, this.onZxczListRender);
        this.dhspjList.renderHandler = new Handler(this, this.onZxczListRender);
        this.dhspList.renderHandler = new Handler(this, this.onZxczListRender);
    }
    // 绑定点击事件
    _prototype.onZxczListRender = function (cell, index) {
        cell.getChildByName('dhBtn').on(Laya.Event.CLICK, this, this.dhBtnClick, [cell, index])
    }
    // 邮寄-返回
    _prototype.backBtnClick = function () {
        this.emailBox.visible = false
    }
    // 确认兑换
    _prototype.certainBtnClick = function () {
        var self = this
        var productId = self.emailBox.getChildByName('ID').text * 1

        Pai.addHandle(new Pai.Handler('ExchangeProductResponse', function (msg, key) {
            var res = msg[key]
            console.log(res)
            if (res.Status == 1) {
                var st = new ShopTipResultView('兑换成功！')
                st.popup()
                self.voucher.text = res.RestVoucher
                Pai.selfUserInfo.Voucher = res.RestVoucher
                if (Pai.loadedView) {
                    Pai.loadedView.voucher.text = res.RestVoucher
                }
            } else {
                var st = new ShopTipResultView(res.Msg)
                st.popup()
            }
        }))
        Pai.send({
            ExchangeProductRequest: {
                ProductId: productId,
                Piece: 1,
                Phone: self.emailBox.getChildByName('phone').text,
                Address: self.emailBox.getChildByName('address').text,
                Name: self.emailBox.getChildByName('name').text
            }
        })
    }
    // 兑换
    _prototype.dhBtnClick = function (cell, index, ev) {
        var self = this
        var cost = cell.getChildByName('cost').text
        var name = cell.getChildByName('name').text
        // 在线充值
        if (cell._parent._parent == this.zxczList) {
            var v = new ShopTipView(function () {
                var st = new ShopTipResultView('联系客服：' +self.kfwx)
                st.popup()
            }, '确认是否充值？',{certainBtnSkin:'chongzhi.png'})
            v.popup()
        }
        // 兑换商品卷
        if (cell._parent._parent == this.dhspjList) {

            Pai.addHandle(new Pai.Handler('ExchangeVoucherResponse', function (msg, key) {
                var res = msg[key]
                console.log(res)
                // 更新劵
                if (res.Status == 1) {
                    var st = new ShopTipResultView('兑换成功！')
                    st.popup()
                    self.voucher.text = res.VoucherAfter
                    Pai.selfUserInfo.Voucher = res.VoucherAfter
                    if (Pai.loadedView) {
                        Pai.loadedView.voucher.text = res.VoucherAfter
                    }
                    // 更新金币
                    self.money.text = Pai.formatMoney(res.CoinAfter)
                    Pai.selfUserInfo.Coin = res.CoinAfter
                    if (Pai.loadedView) {
                        Pai.loadedView.money.text = Pai.formatMoney(res.CoinAfter)
                    }
                } else {
                    var st = new ShopTipResultView(res.Msg)
                    st.popup()
                }
            }))
            var v = new ShopTipView(function () {
                Pai.send({ ExchangeVoucherRequest: { Voucher: cost * 1 } })
            })
            v.popup()
        }
        // 兑换商品
        if (cell._parent._parent == this.dhspList) {
            var ID = cell.getChildByName('ID').text

            self.emailBox.visible = true
            self.emailBox.getChildByName('proName').text = name
            self.emailBox.getChildByName('proCost').text = cost
            self.emailBox.getChildByName('ID').text = ID
            // self.emailBox.getChildByName('proImg').skin = 

            Pai.addHandle(new Pai.Handler('DetailInfoResponse', function (msg, key) {
                var res = msg[key]
                console.log(res)
                self.emailBox.getChildByName('phone').text = res.Phone
                self.emailBox.getChildByName('address').text = res.Address
            }))
            Pai.send({ DetailInfoRequest: {} })
        }
    }

    return Shop;
})(ui.loaded.shop.shopUI);
