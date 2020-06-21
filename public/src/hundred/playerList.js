
var PlayerListView = (function (_super) {
    _super.uiView = Pai.filterImgAddVersion(_super.uiView)
    function PlayerList() {
        PlayerList.super(this);
        this.closeBtn.on(Laya.Event.CLICK, this, this.closeBtnClick)
        this.list.vScrollBarSkin = ''
        this.init()
    }
    Laya.class(PlayerList, 'PlayerList', _super);
    var _prototype = PlayerList.prototype
    // 关闭窗口
    _prototype.closeBtnClick = function () {
        this.close()
    }
    // 初始化
    _prototype.init = function () {
        var self = this
        Pai.addHandle(new Pai.Handler('AllPlayersResponse', function (msg, key) {
            var res = msg[key]
            console.log('成员列表', res)
            var arrbox = []
            for (var i = 0; i < res.Players.length; i++) {
                var p = res.Players[i]

                var head_Img = decodeURIComponent(p.AvatarUrl)
                var result = ''
                if(p.AvatarUrl){
                    result = head_Img
                }else{
                    result = '../bin/comp/loaded/' + p.AvatarId + '.png'
                }

                arrbox.push({
                    name: { text: p.Nickname },
                    money: { text: Pai.formatMoney(p.Coin)  },
                    headImg: { skin: result},
                });
            }
            self.list.dataSource = arrbox;

        }))
        Pai.send({ AllPlayersRequest: { RoundId: Pai.round.Id } })
    }
    return PlayerList;
})(ui.hundred.playerListUI);

