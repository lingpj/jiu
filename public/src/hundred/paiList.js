
var PaiListView = (function (_super) {
    _super.uiView = Pai.filterImgAddVersion(_super.uiView)
    function PaiList() {
        PaiList.super(this);
        this.closeBtn.on(Laya.Event.CLICK, this, this.closeBtnClick)
        this.list.vScrollBarSkin = ''
        this.init()
    }
    Laya.class(PaiList, 'PaiList', _super);
    var _prototype = PaiList.prototype
    // 关闭窗口
    _prototype.closeBtnClick = function () {
        this.close()
    }
    // 初始化
    _prototype.init = function () {
        var self = this
        Pai.addHandle(new Pai.Handler('CardHistoryResponse', function (msg, key) {
            var res = msg[key]
            console.log('开牌记录：', res)

            var arrbox = []
            for (var i = 0; i < res.Cards.length; i += 2) {
                arrbox.push({
                    one: { skin: '../bin/comp/pai/H' + res.Cards[i].Id + '.png' },
                    two: { skin: '../bin/comp/pai/H' + res.Cards[i + 1].Id + '.png' },
                });
            }
            self.list.dataSource = arrbox;

        }))
        Pai.send({ CardHistoryRequest: { RoundId: Pai.round.Id } })
    }
    return PaiList;
})(ui.hundred.paiListUI);