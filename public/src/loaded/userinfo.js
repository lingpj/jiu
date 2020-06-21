
var UserinfoView = (function (_super) {
    _super.uiView = Pai.filterImgAddVersion(_super.uiView)
    function Userinfo() {
        Userinfo.super(this);
        this.closeBtn.on(Laya.Event.CLICK, this, this.closeBtnClick)
        this.name.text = Pai.selfUserInfo.Nickname
        this.money.text = Pai.formatMoney(Pai.selfUserInfo.Coin)
        this.voucher.text = Pai.formatMoney(Pai.selfUserInfo.Voucher)
        this.number.text = 'ID：' + Pai.selfUserInfo.Id
        var coin = Pai.selfUserInfo.Coin
        var str = ''
        if (coin <1000000){
            str = '小兵'
        }else if(coin <100000000 && coin>=10000000){
            str = '先锋'
        }else if(coin <1000000000 && coin>=100000000){
            str = '将军'
        }else{
            str = '战神'
        }
        this.level.skin = '../bin/comp/loaded/userinfo/' +str+ '.png'

        var headImg = decodeURIComponent(Pai.selfUserInfo.AvatarUrl)
        if (Pai.selfUserInfo.AvatarUrl) {
            this.headImg.skin = headImg
        } else {
            this.headImg.skin = '../bin/comp/loaded/' + Pai.selfUserInfo.AvatarId + '.png'
        }
        // this.headImg.skin = '../bin/comp/loaded/' + Pai.selfUserInfo.AvatarId + '.png'
    }
    Laya.class(Userinfo, 'Userinfo', _super);
    var _prototype = Userinfo.prototype

    // 关闭窗口
    _prototype.closeBtnClick = function () {
        this.close()
    }
    return Userinfo;
})(ui.loaded.userinfoUI);
