
var LoadedView = (function (_super) {
    _super.uiView = Pai.filterImgAddVersion(_super.uiView)
    console.log('>>>>>>>>>>>>>>>>>>>>> ',_super.uiView)
    function Loaded() {
        Loaded.super(this);

        this.shop.on(Laya.Event.CLICK, this, this.shopClick)
        this.share.on(Laya.Event.CLICK, this, this.shareClick)
        this.rule.on(Laya.Event.CLICK, this, this.ruleClick)
        this.gonggao.on(Laya.Event.CLICK, this, this.gonggaoClick)
        this.headImg.on(Laya.Event.CLICK, this, this.headImgClick)
        this.safe.on(Laya.Event.CLICK, this, this.safeClick)
        this.set.on(Laya.Event.CLICK, this, this.setClick)
        this.zijian.on(Laya.Event.CLICK, this, this.zijianClick)
        this.backBtn.on(Laya.Event.CLICK, this, this.backBtnClick)
        this.createRoomBtn.on(Laya.Event.CLICK, this, this.createRoomBtnClick)
        this.roomArr = [this.gaoji, this.zhizun, this.zijian, this.bairen, this.dajiu]
        this.joinRoomBtn.on(Laya.Event.CLICK, this, this.joinRoomBtnClick)
        this.adviseList.vScrollBarSkin = ''
        this.adviseList.hScrollBarSkin = ''
        this.kefuBtn.on(Laya.Event.CLICK, this, this.kefuBtnClick)
        this.init()

    }
    Laya.class(Loaded, 'Loaded', _super);
    var _prototype = Loaded.prototype
    // 初始化
    _prototype.init = function () {
        
        var self = this
        this.nickname.text = Pai.selfUserInfo.Nickname
        this.idLab.text = 'ID：'+Pai.selfUserInfo.Id
        this.money.text = Pai.formatMoney(Pai.selfUserInfo.Coin)
        this.voucher.text = Pai.selfUserInfo.Voucher
        var headImg = decodeURIComponent(Pai.selfUserInfo.AvatarUrl)
        if (Pai.selfUserInfo.AvatarUrl) {
            this.headImg.skin = headImg
        } else {
            this.headImg.skin = '../bin/comp/loaded/' + Pai.selfUserInfo.AvatarId + '.png'
        }
        // 房间列表
        Pai.addHandle(new Pai.Handler('RoundCatalogResponse', function (msg, key) {
            var res = msg[key]
            console.log(res)
            for (var i = 0; i < self.roomArr.length; i++) {
                var room = self.roomArr[i]
                room.getChildAt(0).text = '人数：' + res.RoundList[i + 1 + ''].OnlineNumber
            }
            if (res.Status == 1) {
                // 绑定事件
                for (var i = 0; i < self.roomArr.length; i++) {
                    (function (num) {
                        self.roomArr[i].on(Laya.Event.CLICK, self, self.fourRoomBtnClick, [num])
                    })(i + 1)
                }
            }
        }))
        Pai.send({ RoundCatalogRequest: {} })
        // 滚动公告
        Pai.addHandle(new Pai.Handler('AnnouncementListResponse', function (msg, key) {
            var res = msg[key]
            console.log(res)
            // self.adviseList.getChildByName('msg').text = res.Announcement[0].Title + '：' + res.Announcement[0].Content
            var str = ''
            for (var i = 0; i < res.Announcement.length; i++) {
                str += res.Announcement[i].Title + '：' + res.Announcement[i].Content + '　　　　'
            }
            self.adviseList.getChildByName('msg').text = str
            self.adviseList.getChildByName('msg').width = 26 * (self.adviseList.getChildByName('msg').text.length)
            var end = self.adviseList.getChildByName('msg').width - 431
            var x = 0
            setInterval(function () {
                x += 1
                if (x > end) {
                    x = 0
                }
                self.adviseList.scrollTo(x, self.adviseList.y)
            }, 30)
        }))
        Pai.send({ AnnouncementListRequest: { Type: 1 } })
        // 被踢下线
        Pai.addHandle(new Pai.Handler('KickedOutMessage', function (msg, key) {
            var res = msg[key]
            Pai.alertView.show('被踢下线了')
            var view = Laya.stage.getChildAt(0)
            view.removeSelf()
            view.destroy()
            view = null
            if (!Pai.loadedView) Pai.loginView = new LoadedView()
            Laya.stage.addChild(Pai.loginView)
            Pai.send({
                CheckInRequest: {
                    Timestamp: parseInt(new Date().getTime() / 1000),
                    ClientVerId: 1
                }
            })
        }))
        Pai.addHandle(new Pai.Handler('EnterRoundResponse', function (msg, key) {
            var res = msg[key]
            console.log('进房间：', res)
            if (res.Status == 0) {
                // Pai.alertView.show(res.Msg)
                Pai.alertView.show(res.Msg)
            } else {

            }
        }))

    }
    // 客服
    _prototype.kefuBtnClick = function () {
        var sp = new ShopView()
        sp.init()
        sp.popup()
        sp.tabbarClick(sp.tabArr[1])
    }
    // 商店
    _prototype.shopClick = function () {
        var sp = new ShopView()
        sp.init()
        sp.popup()
        
    }
    // 分享
    _prototype.shareClick = function () {
        var sv = new ShareView()
        sv.popup()
    }
    // 规则
    _prototype.ruleClick = function () {
        var sv = new RuleView()
        sv.init()
        sv.popup()
    }
    // 公告
    _prototype.gonggaoClick = function () {
        var st = new NoticeView()
        st.init()
        st.popup()
    }
    // 个人中心
    _prototype.headImgClick = function () {
        var st = new UserinfoView()
        st.popup()
    }
    // 保险箱
    _prototype.safeClick = function () {
        var st = new SafeView()
        st.popup()
    }
    // 设置
    _prototype.setClick = function () {
        var st = new SetView()
        st.popup()
    }
    // 自建房
    _prototype.zijianClick = function () {
        this.mainBox.visible = false
        this.customBox.visible = true
        this.kefuBtn.visible = false
    }
    // 自建房返回
    _prototype.backBtnClick = function () {
        this.mainBox.visible = true
        this.customBox.visible = false
        this.kefuBtn.visible = true
    }
    // 创建房间
    _prototype.createRoomBtnClick = function () {
        if (Pai.selfUserInfo.Coin < 100) {
            var st = new CustomRoomTipView()
            st.popup()
        } else {
            Pai.send({
                EnterRoundRequest: {
                    RoundType: 3,
                    RoundNumber: 0
                }
            })
        }
    }
    // 加入房间
    _prototype.joinRoomBtnClick = function () {
        var st = new JoinRoomView()
        st.popup()
    }
    // 大九九、高级、至尊
    _prototype.fourRoomBtnClick = function (round, ev) {
        console.log(round)
        if (round == 3) return
        var self = this
        Pai.send({
            EnterRoundRequest: {
                RoundType: round
            }
        })
    }
    return Loaded;
})(ui.loaded.loadedUI); 
