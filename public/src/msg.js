Pai.msg = function (msg) {
    if (Pai.msgView == undefined || !Pai.msgView) {
        Pai.msgView = new Laya.Label()
    }
    Pai.msgView.width = 200
    Pai.msgView.height = 70
    Pai.msgView.x = (Laya.stage.width - Pai.msgView.width) / 2
    Pai.msgView.y = (Laya.stage.height - Pai.msgView.height) / 2 + 180
    Pai.msgView.align = 'center'
    Pai.msgView.color = '#fff'
    Pai.msgView.fontSize = '22'
    Pai.msgView.text = msg
    Pai.msgView.bold = true
    Pai.msgView.zOrder = 99999
    Pai.msgView.skin = '../bin/comp/customBoard/waitbg-game.png'
    // Pai.msgView.valign = 'middle'
    Pai.msgView.name = 'msg'
    Pai.msgView.mouseEnabled = false
    Pai.msgView.wordWrap = true
    Laya.stage.addChild(Pai.msgView)
    Laya.Tween.from(Pai.msgView, { x: Pai.msgView.x, y: Pai.msgView.y * (-1) }, 100, Laya.Ease.linearIn, Laya.Handler.create
        (this, null));
    setTimeout(function () {
        Pai.msgView.removeSelf()
    }, 2000);
}