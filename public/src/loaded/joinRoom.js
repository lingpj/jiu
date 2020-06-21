
var JoinRoomView = (function (_super) {
    _super.uiView = Pai.filterImgAddVersion(_super.uiView)
    function JoinRoom() {
        JoinRoom.super(this);
        this.closeBtn.on(Laya.Event.CLICK, this, this.closeBtnClick)
        this.numInputArr = []
        this.password = ''
        this.init()
    }
    Laya.class(JoinRoom, 'JoinRoom', _super);
    var _prototype = JoinRoom.prototype
    // 关闭窗口
    _prototype.closeBtnClick = function () {
        this.close()
    }
    // 数字点击
    _prototype.numberClick = function (obj, ev) {
        var self = this
        var num = obj.tag
        // 删除
        if (num == 10) {
            this.deleteNum()
            return
        }
        // 确定
        if (num == 11) {
 
            // var v = new ShopTipResultView()
            // v.msg.text = '哈哈'
            // v.popup()
            if(self.password == 000000 || self.password ==''){
                return
            }
            
            self.close()
            Pai.send({
                EnterRoundRequest: {
                    RoundType: 3,
                    RoundNumber: self.password * 1
                }
            })
            return
        }
        if (this.password.length == 6) return

        var imgUrl = obj.getChildAt(0).skin
        var inputImg = this.getInput()
        inputImg.skin = imgUrl
        this.password += num
    }
    // init
    _prototype.init = function (obj, ev) {
        for (var i = 0; i < 12; i++) {
            var obj = this.getChildByName('numBox' + i)
            obj.tag = i
            obj.on(Laya.Event.CLICK, this, this.numberClick, [obj])
        }
        for (var i = 0; i < 6; i++) {
            var obj = this.getChildByName('numInput' + (i + 1))
            this.numInputArr.push(obj)
        }
    }
    // 找到一个输入框
    _prototype.getInput = function () {
        for (var i = 0; i < 6; i++) {
            var obj = this.numInputArr[i].getChildAt(0).skin
            if (obj == null || 　obj == '') {
                return this.numInputArr[i].getChildAt(0)
            }
        }
        return 'none'
    }
    // 删除数字
    _prototype.deleteNum = function () {
        for (var i = 5; i > -1; i--) {
            var obj = this.numInputArr[i].getChildAt(0).skin
            if (obj != null && obj != '') {
                this.numInputArr[i].getChildAt(0).skin = ''
                console.log(this.password)
                this.password = this.password.slice(0, this.password.length - 1)
                break
            }
        }
    }



    return JoinRoom;
})(ui.loaded.joinRoomUI);