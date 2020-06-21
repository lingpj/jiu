
var NoticeView = (function (_super) {
    _super.uiView = Pai.filterImgAddVersion(_super.uiView)
    function Notice() {
        Notice.super(this);
        this.closeBtn.on(Laya.Event.CLICK, this, this.closeBtnClick)
        this.backBtn.on(Laya.Event.CLICK, this, this.backBtnClick)
        this.systemMsgBtn.on(Laya.Event.CLICK, this, this.tabBtnClick)
        this.userOrderBtn.on(Laya.Event.CLICK, this, this.tabBtnClick)
        this.systemMsgBtn.tag = 1
        this.userOrderBtn.tag = 2
        this.userOrderList.vScrollBarSkin = ''
        this.systemMsgList.vScrollBarSkin = ''
        this.contentChangeArr = [this.userOrderList, this.systemMsgList, this.none, this.msgDetail]
        this.systemMsgDataArr = []
    }
    Laya.class(Notice, 'Notice', _super);
    var _prototype = Notice.prototype
    // 关闭窗口
    _prototype.closeBtnClick = function () {
        this.close()
    }
    // 初始化
    _prototype.init = function () {
        var self = this
        // 消息
        Pai.addHandle(new Pai.Handler('AnnouncementListResponse', function (msg, key) {
            var res = msg[key]
            console.log(res)
            if (!res.Announcement || res.Announcement.length < 1) {
                self.systemMsgList.visible = false
                self.none.visible = true
                return
            }
            var arr = []
            for (var i = 0; i < res.Announcement.length; i++) {
                var obj = res.Announcement[i]
                arr.push({
                    title: { text: obj.Title }
                })
            }
            self.systemMsgList.dataSource = arr
            self.systemMsgDataArr = res.Announcement
            self.systemMsgList.renderHandler = new Handler(self, self.onSystemMsgListRender);
        }))
        Pai.send({ AnnouncementListRequest: { Type: 2, Page: 1 } })
        // 订单
        Pai.addHandle(new Pai.Handler('OrderListResponse', function (msg, key) {
            var res = msg[key]
            console.log(res)
            var arr = []
            for (var i = 0; i < res.Orders.length; i++) {
                var obj = res.Orders[i]
                arr.push({
                    name: { text: obj.Product },
                    time: { text: obj.Date },
                    number: { text: obj.Id }
                })
            }
            self.userOrderList.dataSource = arr;
        }))
        Pai.send({ OrderListRequest: {} })
    }
    // 系统消息渲染
    _prototype.onSystemMsgListRender = function (ele, index) {
        ele.getChildByName('tip').visible = this.systemMsgDataArr[index].Status == 0 ? true : false
        ele.on(Laya.Event.CLICK, this, this.systemMsgItemClick, [index])
    }
    // 消息点击
    _prototype.systemMsgItemClick = function (index, ev) {
        var txt = ev.target.getChildByName('title').text
        ev.target.getChildByName('tip').visible = false
        this.msgDetail.getChildByName('content').text = this.systemMsgDataArr[index].Content
        this.msgDetail.getChildByName('time').text = this.systemMsgDataArr[index].Date
        this.showSomeOne(this.msgDetail)
    }
    // 返回
    _prototype.backBtnClick = function (ev) {
        this.showSomeOne(this.systemMsgList)
    }
    // 选项卡
    _prototype.tabBtnClick = function (ev) {
        var btn = ev.target
        btn.zOrder = 2
        btn.selected = true

        if (btn.tag == 1) {
            this.userOrderBtn.selected = false
            this.userOrderBtn.zOrder = 1
            this.showSomeOne(this.systemMsgList)
        } else {
            this.systemMsgBtn.selected = false
            this.systemMsgBtn.zOrder = 1
            this.showSomeOne(this.userOrderList)
        }
    }
    _prototype.showSomeOne = function (ele) {
        for (var i = 0; i < this.contentChangeArr.length; i++) {
            this.contentChangeArr[i].visible = false
        }

        if (ele == this.systemMsgList) {
            if (this.systemMsgDataArr.length < 1) {
                this.none.visible = true
                return
            }
        }
        if (ele) ele.visible = true
    }
    return Notice;
})(ui.loaded.noticeUI);
