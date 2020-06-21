
var ClockView = (function (_super) {
    _super.uiView = Pai.filterImgAddVersion(_super.uiView)
    function Clock() {
        Clock.super(this);
        this.init()
    }
    Laya.class(Clock, 'Clock', _super);
    var _prototype = Clock.prototype

    _prototype.init = function () {
        var self = this
        self.x = 120
        self.y = 470
        self.zOrder = 10
        self.getChildAt(1).zOrder = 9

        Laya.loader.load('../bin/res/act/5.json', Laya.Handler.create(self, null), null, Laya.Loader.ATLAS);
    }

    _prototype.show = function (time,posotion) {
        console.log('闹钟')
        var self = this
        Pai.clearInterval()
        self.x = posotion[0]
        self.y = posotion[1]
        Laya.stage.addChild(self)
        self.label.text = time
        var s1 = setInterval(function () {
            time = time * 1
            if (time == 1) {
                // Pai.clearInterval()
                self.removeSelf()
                return
            }
            time--
            self.label.text = time
        }, 1000);
        Pai.setIntervalArr.push(s1)
        this.initAnimation(time)
    }
    _prototype.initAnimation = function (time) {
        // 添加进度条动画
        var sp = this.getChildByName('clock')
        if (sp) {
            sp.stop();
            sp.removeSelf()
        }
        var ani = new Laya.Animation();
        ani.loadAtlas("../bin/res/progress2/5.json");
        ani.interval = (time * 1000) / 30;
        ani.index = 0;
        ani.play()
        ani.pos(0, 1);
        ani.scaleX = 1.2
        ani.scaleY = 1.2
        ani.name = 'clock'
        this.addChild(ani);
    }
    return Clock;
})(ui.clockUI);
