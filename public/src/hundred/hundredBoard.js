
var HundredBoardView = (function (_super) {
    _super.uiView = Pai.filterImgAddVersion(_super.uiView)
    function HundredBoard() {
        HundredBoard.super(this);
        this.currentChip = -1
        this.ballArr = []
        this.animatePath = "../bin/res/ball/1.json";
        this.tempArr = []
        this.isGaming = false
        this.lastCoinMap = {}
        this.sendPaiOrderBox = []
        this.playerArr = [this.my, this.p1, this.p2, this.p3, this.p4]
        this.tableArr = [this.table1, this.table2, this.table3, this.table4, this.table5, this.table6]
        this.exitBtn.on(Laya.Event.CLICK, this, this.exitBtnClick)
        this.paiListBtn.on(Laya.Event.CLICK, this, this.paiListBtnClick)
        this.throwBallBtn.on(Laya.Event.CLICK, this, this.throwBallBtnClick)
        this.begZhuangBtn.on(Laya.Event.CLICK, this, this.begZhuangBtnClick)
        this.xiaZhuangBtn.on(Laya.Event.CLICK, this, this.xiaZhuangBtnClick)
        this.shangZhuangBtn.on(Laya.Event.CLICK, this, this.shangZhuangBtnClick)
        this.setBtn.on(Laya.Event.CLICK, this, this.setBtnClick)
        this.onlineBtn.on(Laya.Event.CLICK, this, this.onlineBtnClick)
        this.init()
    }
    Laya.class(HundredBoard, 'HundredBoard', _super);
    var _prototype = HundredBoard.prototype

    // 初始化
    _prototype.init = function () {
        var self = this
        for (var i = 1; i < 22; i++) {
            Laya.loader.load('../bin/res/act/' + i + '.json', Laya.Handler.create(self, null), null, Laya.Loader.ATLAS)
        }

        for (var i = 0; i < 6; i++) {
            var t = this.tableArr[i]
            t.tag = i + 2
            if (i == 5) t.tag = 1
            t.on(Laya.Event.CLICK, this, this.tableBtnClick, [t])
            t.mouseEnabled = false
        }
        for (var i = 0; i < 4; i++) {
            var c = this.chipBox.getChildAt(i)
            c.tag = Pai.round.ChipLevels[i]

            c.on(Laya.Event.CLICK, this, this.chipClick, [c])
        }
        this.currentChip = Pai.round.ChipLevels[0]
        this.my.getChildByName('name').text = Pai.selfUserInfo.Nickname
        this.my.getChildByName('money').text = Pai.formatMoney(Pai.selfUserInfo.Coin)
        console.log(Pai.selfUserInfo.Coin)
        this.registNotis()

        var str = ''
        if (Pai.round.NodeStatus == 0) {
            str = 'zhunbeiFlag'
        }
        if (Pai.round.NodeStatus == 1) {
            str = 'qiangzhuangFlag'
        }
        if (Pai.round.NodeStatus == 2) {
            str = 'diushaiFlag'
        }
        if (Pai.round.NodeStatus == 3) {
            str = 'xiazhuFlag'
        }
        if (Pai.round.NodeStatus == 4) {
            str = 'bipaiFlag'
        }
        if (Pai.round.NodeStatus == 5) {
            str = 'freeFlag'
        }
        
        this.showRoomStatus(str)
    }
    // 测试
    _prototype.test = function (ani, num) {
        // setTimeout(function () {
        //     ani.gotoAndStop(19)
        // }, 400);
    }
    // 设置按钮
    _prototype.setBtnClick = function () {
        var self = this
        var st = new SetView()
        st.popup()
        st.changeUserBtn.visible = false
    }
    // 注册通知
    _prototype.registNotis = function () {
        var self = this
        //玩家离开的广播
        Pai.addHandle(new Pai.Handler('LeaveRoundBroadcast', function (msg, key) {
            var res = msg[key]
            console.log('有人离开：', res)
            if (res.Status == 1) {
                var outID = res.PlayerId

                self.whoLeave(outID, res.PlayerInfo, res.OnlineNumber)
            } else {
                Pai.alertView.show('正在游戏，不能离开！')
            }
        }))
        // 开始抢庄
        Pai.addHandle(new Pai.Handler('GrabMasterBroadcast', function (msg, key) {
            var res = msg[key]
            Pai.alertView.show('开始抢庄')
            self.resetView()
            self.showRoomStatus('qiangzhuangFlag')
            setTimeout(function () {
                self.roomStatus.getChildByName('qiangzhuangFlag').visible = false
            }, 5000);
            self.begZhuangBtn.visible = true
            Pai.clockView.show(5, [470, 280])
        }))
        // 下庄通知
        Pai.addHandle(new Pai.Handler('GiveUpMasterBroadcast', function (msg, key) {
            var res = msg[key]
            console.log('可以下庄', res)
            self.xiaZhuangBtn.visible = true
            self.shangZhuangBtn.visible = true
        }))
        // 抢庄结果
        Pai.addHandle(new Pai.Handler('GrabMasterResultBroadcast', function (msg, key) {
            var res = msg[key]
            console.log('抢庄结果', res)

            self.begZhuangBtn.visible = false
            self.xiaZhuangBtn.visible = false
            self.shangZhuangBtn.visible = false
            // 系统
            if (res.PlayerId == 0) {
                self.master.getChildByName('name').text = '庄家'
                self.master.getChildByName('money').text = Pai.formatMoney(res.Coin)
                self.master.skin = '../bin/comp/loaded/touxiang.png'
                Pai.round.MasterInfo.Nickname = ''
                Pai.round.MasterInfo.Id = 0
                Pai.round.SystemCoin = res.Coin
                self.updatePlayerStatus()
                return
            }
            // 自己
            if (res.PlayerId == Pai.selfUserInfo.Id) {
                self.master.getChildByName('name').text = Pai.selfUserInfo.Nickname
                self.master.getChildByName('money').text = Pai.formatMoney(Pai.selfUserInfo.Coin)
                if (self.master.getChildByName('name').text == '庄家') {
                    self.master.getChildByName('money').text = '99亿'
                }
                var headImg = decodeURIComponent(Pai.selfUserInfo.AvatarUrl)
                if (Pai.selfUserInfo.AvatarUrl) {
                    self.master.skin = headImg
                } else {
                    self.master.skin = '../bin/comp/loaded/' + Pai.selfUserInfo.AvatarId + '.png?v='+Pai.version
                }
                // self.master.skin = '../bin/comp/loaded/' + Pai.selfUserInfo.AvatarId + '.png'
                return
            }
            self.updatePlayerStatus()
            // 其他人
            self.master.getChildByName('name').text = res.Name
            self.master.getChildByName('money').text = Pai.formatMoney(res.Coin)
            if (self.master.getChildByName('name').text == '庄家') {
                self.master.getChildByName('money').text = '99亿'
            }
            var headImg = decodeURIComponent(res.AvatarUrl)
            if (res.AvatarUrl) {
                self.master.skin = headImg
            } else {
                self.master.skin = '../bin/comp/loaded/' + res.AvatarId + '.png?v='+Pai.version
            }
            // self.master.skin = '../bin/comp/loaded/' + res.AvatarId + '.png'

            var arr = Pai.round.PlayerInfo.filter(function (p) {
                if (p.Id != Pai.selfUserInfo.Id) {
                    return p
                }
            })
            var n = arr.length
            if (n >= 4) {
                n = 4
            }
            for (var i = 0; i < n; i++) {
                var p = arr[i]
                if (p.Id == res.PlayerId) {
                    var player = self.playerArr[i + 1]
                    player.getChildByName('money').text = ''
                    player.skin = '../bin/comp/customBoard/waitbg-game.png'

                }
            }
        }))
        // 开始丢筛子
        Pai.addHandle(new Pai.Handler('ThrowDiceBroadcast', function (msg, key) {
            var res = msg[key]
            console.log('开始丢筛子', res)
            if (self.master.getChildByName('name') == Pai.selfUserInfo.Nickname) {
                self.throwBallBtn.visible = true
                Pai.clockView.show(4, [470, 280])
            }
        }))
        // 丢筛子结果  
        Pai.addHandle(new Pai.Handler('ThrowDiceResultBroadcast', function (msg, key) {
            var res = msg[key]
            console.log('丢筛子结果：', res)
            self.showRoomStatus()
            self.throwBallBtn.visible = false
            self.showRoomStatus('diushaiFlag')

            Laya.loader.load(self.animatePath, Laya.Handler.create(self, self.createAnimation, [res.Points[0], res.Points[1]]), null, Laya.Loader.ATLAS);
            var num = (res.Points[0] + res.Points[1]) % 4
            var s1 = setTimeout(function () {
                self.sendPaiAnimate(num)
                self.roomStatus.getChildByName('diushaiFlag').visible = false
            }, 3000);
            Pai.setIntervalArr.push(s1)
        }))
        //被踢出局广播
        Pai.addHandle(new Pai.Handler('KickOutRoundBroadcast', function (msg, key) {
            var res = msg[key]
            console.log('被踢出去：', res)
            var outID = res.PlayerId
            self.whoLeave(outID, res.RestPlayerInfo, res.OnlineNumber)
        }))
        // 破产保护   
        Pai.addHandle(new Pai.Handler('GiveCoinResponse', function (msg, key) {
            var res = msg[key]
            console.log('破产保护：', res)
            if (res.Status == 1) {
                Pai.alertView.show('系统破产保护，赠送你：' + res.GiveCoin + '金币', 3000)
                self.my.getChildByName('money').text = Pai.formatMoney(res.CoinAfterGive)
                Pai.selfUserInfo.Coin = res.CoinAfterGive
            } else {
                Pai.alertView.show(res.Msg, 2000)
            }
        }))
        // 开始下注
        Pai.addHandle(new Pai.Handler('BetBroadcast', function (msg, key) {
            var res = msg[key]
            self.showRoomStatus('xiazhuFlag')
            Pai.alertView.show('开始下注')
            if (Pai.soundAllowPlay == 1) Laya.SoundManager.playSound('../bin/res/sound/开始下注.mp3', 1, new Laya.Handler(this, function () { }))

            Pai.clockView.show(15, [470, 280])
            if (self.master.getChildByName('name').text == Pai.selfUserInfo.Nickname) return
            for (var i = 0; i < self.tableArr.length; i++) { self.tableArr[i].mouseEnabled = true }
        }))
        // 下注停止 
        Pai.addHandle(new Pai.Handler('BetStopBroadcast', function (msg, key) {
            var res = msg[key]
            Pai.alertView.show('下注停止')
            if (Pai.soundAllowPlay == 1) Laya.SoundManager.playSound('../bin/res/sound/停止下注.mp3', 1, new Laya.Handler(this, function () { }))
            self.showRoomStatus()
            for (var i = 0; i < self.tableArr.length; i++) { self.tableArr[i].mouseEnabled = false }
        }))
        // 有人下注
        Pai.addHandle(new Pai.Handler('BetResultBroadcast', function (msg, key) {
            var res = msg[key]
            console.log('有人下注', res)
            if (Pai.soundAllowPlay == 1) {
                Laya.SoundManager.playSound('../bin/res/sound/加注.m4a', 1, new Laya.Handler(this, function () { }))
            }
            if (res.Status == 1) {
                // 自己下注
                if (res.PlayerId == Pai.selfUserInfo.Id) {
                    self.my.getChildAt(1).text = Pai.formatMoney(res.RestCoin)
                    Pai.selfUserInfo.Coin = res.RestCoin
                    for (var j = 0; j < self.tableArr.length; j++) {
                        var t = self.tableArr[j]
                        if (res.Direction == t.tag) {
                            self.showAllTableMoney(res.AllPlayerCoinMap)
                            self.showUserTableMoney(res.CurrentPlayerCoinMap)
                            var chip = self.createChip(t, self.my, res.Coin)
                            t.addChild(chip)
                            break
                        }
                    }
                    return
                }
                // 其他人下注
                var arr = Pai.round.PlayerInfo.filter(function (p) {
                    if (p.Id != Pai.selfUserInfo.Id) {
                        return p
                    }
                })
                for (var i = 0; i < arr.length; i++) {
                    var p = arr[i]

                    if (res.PlayerId == p.Id) {
                        var player = self.playerArr[i + 1]
                        player.getChildByName('money').text = Pai.formatMoney(res.RestCoin)
                        // 桌子
                        for (var j = 0; j < self.tableArr.length; j++) {
                            var t = self.tableArr[j]
                            if (res.Direction == t.tag) {
                                self.showAllTableMoney(res.AllPlayerCoinMap)
                                var who = self.playerArr[i + 1]
                                var chip = self.createChip(t, who, res.Coin)
                                t.addChild(chip)

                                break
                            }
                        }
                        break
                    } else {
                        self.showAllTableMoney(res.AllPlayerCoinMap)
                        for (var j = 0; j < self.tableArr.length; j++) {
                            var t = self.tableArr[j]
                            if (res.Direction == t.tag) {
                                var chip = self.createChip(t, self.onlineBtn, res.Coin)
                                t.addChild(chip)

                                break
                            }
                        }
                        break
                    }
                }
            } else {
                // Pai.alertView.show(res.Msg)
                layer.msg(res.Msg)
            }
        }))
        Pai.addHandle(new Pai.Handler('DealCardBroadcast', function (msg, key) {
            var res = msg[key]
            console.log('开始发牌', res)

            self.isGaming = true
            self.showRoomStatus()
            var s1 = setTimeout(function () {
                self.roomStatus.getChildByName('freeFlag').visible = true
                Pai.clockView.show(5, [470, 280])
                var s2 = setTimeout(function () {
                    self.roomStatus.getChildByName('freeFlag').visible = false
                }, 5000);
                Pai.setTimeoutArr.push(s2)
            }, 10000)
            Pai.setTimeoutArr.push(s1)
            self.paiBox.visible = true

            //  先更新自己的coin
            var obj2 = res.CoinMap
            for (var key in obj2) {
                if (key == Pai.selfUserInfo.Id) {
                    Pai.selfUserInfo.Coin = obj2[key][1]
                    if (Pai.loadedView) {
                        Pai.loadedView.money.text = Pai.formatMoney(obj2[key][1])
                    }
                }
            }
            // 输赢走势
            // var s1 = setTimeout(function () {
            //     if (Laya.stage._childs[0] instanceof LoadedView) return
            //     // 删除走势
            //     for (var i = 0; i < self.trendBox._childs.length; i++) {
            //         var box = self.trendBox._childs[i]
            //         box.destroyChildren()
            //     }
            //     for (var key in res.ResultHistory) {
            //         var arr = res.ResultHistory[key]
            //         var box = self.trendBox._childs[(key * 1 + 1) / 2 - 1]
            //         for (var i = 0; i < arr.length; i++) {
            //             var flag = arr[i]
            //             var sp = new Laya.Sprite();
            //             var url = "../bin/comp/hundred/" + (flag > 0 ? 'b' : 'a') + '.png'
            //             sp.loadImage(url, i * 22.5, 0, 22.5, 22.5);
            //             box.addChild(sp)
            //         }
            //     }
            // }, 4000)
            Pai.setTimeoutArr.push(s1)
            var s2 = setTimeout(function () {
                if (Laya.stage._childs[0] instanceof LoadedView) return

                self.roomStatus.getChildByName('bipaiFlag').visible = true
                setTimeout(function () {
                    self.roomStatus.getChildByName('bipaiFlag').visible = false
                }, 8500);
                Pai.clockView.show(9, [470, 280])
                // 显示牌
                for (var i = 0; i < 4; i++) {
                    (function (num) {
                        var q = setTimeout(function () {
                            var arr = [1, 0, 3, 2]
                            var a = num == 3 ? 5 : num + 1
                            var r = res.CardMap[a + '']
                            for (q = 0; q < 2; q++) {
                                var ani = new Laya.Animation();
                                ani.loadAtlas('../bin/res/act/' + r.Cards[q].Id + '.json'); // 加载图集动画
                                ani.interval = 19;			// 设置播放间隔（单位：毫秒）
                                ani.index = 0; 				// 当前播放索引
                                ani.visible = false
                                ani.pos(-25, -15)
                                ani.width = 111
                                ani.height = 128
                                self.paiBox._childs[arr[num]].getChildAt(q).addChild(ani)
                                Laya.loader.load('../bin/res/act/' + r.Cards[q].Id + '.json', Laya.Handler.create(self, null), null, Laya.Loader.ATLAS);
                            }
                            var box = self.paiBox._childs[arr[num]]
                            var result = res.PointMap[a + '']
                            box.getChildAt(2).skin = '../bin/comp/result/' + result + '.png'
                            box.getChildAt(3).text = res.FormMap[a + '']
                        }, num * 200)
                        Pai.setTimeoutArr.push(q)
                    })(i)
                }

                var s11 = setTimeout(function () {
                    for (var i = 0; i < 4; i++) {
                        (function (num) {
                            var w = setTimeout(function () {
                                var box = self.sendPaiOrderBox[num]
                                if (self.tempArr.length < 1) return
                                for (q = 0; q < 2; q++) {
                                    (function (qq) {
                                        var img = box.getChildAt(qq)
                                        img.getChildAt(0).visible = true
                                        img.getChildAt(0).play()
                                        setTimeout(function () {
                                            img.getChildAt(0).gotoAndStop(19)
                                        }, 400);
                                    })(q)
                                }
                            }, num * 500)
                            Pai.setTimeoutArr.push(w)
                        })(i)
                    }
                    var ss = setTimeout(function () {
                        if (self.tempArr.length < 1) return
                        for (var i = 0; i < 4; i++) {
                            var w = self.tempArr[i]
                            var box = self.paiBox._childs[w - 1]
                            box.getChildAt(3).visible = true
                        }
                    }, 3000);
                    Pai.setTimeoutArr.push(ss)
                }, 2000);
                Pai.setTimeoutArr.push(s11)
                // 扣积分
                var obj = res.CoinMap
                var asd = setTimeout(function () {
                    var count = 1
                    for (var key in obj) {
                        if (key == Pai.selfUserInfo.Id) {
                            self.my.getChildByName('money').text = Pai.formatMoney(obj[key][1])
                            if (Pai.loadedView) {
                                Pai.loadedView.money.text = Pai.formatMoney(obj[key][1])
                                Pai.selfUserInfo.Coin = obj[key][1]
                            }
                            self.number2Img(obj[key][0], self.my.getChildByName('gradeBox'))
                            if (self.master.getChildByName('name').text == self.my.getChildByName('name').text && self.isGaming) {
                                self.master.getChildByName('money').text = Pai.formatMoney(obj[key][1])
                                if (self.master.getChildByName('name').text == '庄家') {
                                    self.master.getChildByName('money').text = Pai.formatMoney(res.Master.Coin)
                                }
                            }
                        }
                        var arr = Pai.round.PlayerInfo.filter(function (p) {
                            if (p.Id != Pai.selfUserInfo.Id) {
                                return p
                            }
                        })
                        var n = arr.length
                        if (n >= 4) {
                            n = 4
                        }
                        for (var i = 0; i < n; i++) {
                            var p = arr[i]
                            if (p.Id == key && p.Nickname != self.master.getChildByName('name').text) {
                                self.playerArr[i + 1].getChildByName('money').text = Pai.formatMoney(obj[key][1])
                                self.number2Img(obj[key][0], self.playerArr[i + 1].getChildByName('gradeBox'))
                            }
                        }
                        if (key == res.Master.Id) {
                            self.master.getChildByName('gradeBox').destroyChildren()
                            self.master.getChildByName('money').text = Pai.formatMoney(obj[key][1])
                            if (self.master.getChildByName('name').text == '庄家') {
                                self.master.getChildByName('money').text = Pai.formatMoney(res.Master.Coin)
                            }
                            self.number2Img(obj[key][0], self.master.getChildByName('gradeBox'))
                        }
                        if (self.master.getChildByName('name').text == '庄家') {
                            self.master.getChildByName('money').text = Pai.formatMoney(res.Master.Coin)
                        }
                    }
                }, 3000);
                Pai.setTimeoutArr.push(asd)
                var s3 = setTimeout(function () {
                    // 隐藏牌
                    for (var i = 0; i < self.paiBox._childs.length; i++) {
                        self.paiBox._childs[i].getChildAt(0).skin = '../bin/comp/pai/H.png'
                        self.paiBox._childs[i].getChildAt(1).skin = '../bin/comp/pai/H.png'
                        self.paiBox._childs[i].getChildAt(2).skin = ''
                        self.paiBox._childs[i].getChildAt(3).text = ''
                        self.paiBox._childs[i].getChildAt(3).visible = false
                        self.paiBox._childs[i].x = (self.paiBox.width - self.paiBox._childs[i].width) / 2
                        self.paiBox._childs[i].y = -500
                    }
                    // 扣积分
                    for (var i = 0; i < self.playerArr.length; i++) {
                        var box = self.playerArr[i].getChildByName('gradeBox')
                        box.destroyChildren()
                    }
                    self.resetView()
                }, 10000);
                Pai.setTimeoutArr.push(s3)
            }, 1000);
            Pai.setTimeoutArr.push(s2)
        }))
    }

    // 停止翻牌动画
    _prototype.stopPaiAnimate = function () {
        var self = this
        for (var s = 0; s < 4; s++) {
            self.paiBox._childs[s].getChildAt(0).destroyChildren()
            self.paiBox._childs[s].getChildAt(1).destroyChildren()
        }
    }
    // 丢筛子按钮点击
    _prototype.throwBallBtnClick = function () {
        var self = this
        self.throwBallBtn.visible = false
    }
    // 发牌动画
    _prototype.sendPaiAnimate = function (random) {
        if (Pai.soundAllowPlay == 1) Laya.SoundManager.playSound('../bin/res/sound/开始发牌.mp3', 1, new Laya.Handler(this, function () { }))
        var self = this
        self.sendPaiOrderBox = []
        if (random == 0) random = 4
        var arr = [[1, 2, 3, 4], [2, 3, 4, 1], [3, 4, 1, 2], [4, 1, 2, 3]]
        var posArr1 = [{ x: 224, y: -50 }, { x: 0, y: 116 }, { x: 224, y: 259 }, { x: 440, y: 116 }]
        var posArr2 = [{ x: 0, y: 116 }, { x: 224, y: 259 }, { x: 440, y: 116 }, { x: 224, y: -50 }]
        var posArr3 = [{ x: 224, y: 259 }, { x: 440, y: 116 }, { x: 224, y: -50 }, { x: 0, y: 116 }]
        var posArr4 = [{ x: 440, y: 116 }, { x: 224, y: -50 }, { x: 0, y: 116 }, { x: 224, y: 259 }]
        var bigArr = [posArr1, posArr2, posArr3, posArr4]
        bigArr = bigArr[random - 1]
        arr = arr[random - 1]
        self.tempArr = arr

        for (var i = 0; i < arr.length; i++) {
            var n = arr[i] - 1
            var pos = bigArr[i]
            var pai = self.paiBox._childs[n]
            self.sendPaiOrderBox.push(pai)
            Laya.Tween.to(pai, { x: pos.x, y: pos.y }, 300, Laya.Ease.linearIn, Laya.Handler.create
                (this, null), i * 400);
        }
    }
    // 开牌记录
    _prototype.paiListBtnClick = function () {
        var v = new PaiListView()
        v.popup()
    }
    // 玩家列表
    _prototype.onlineBtnClick = function () {
        var v = new PlayerListView()
        v.popup()
    }
    // 申请上庄
    _prototype.begZhuangBtnClick = function () {
        var self = this
        self.begZhuangBtn.visible = false
        console.log('申请上庄')
        Pai.addHandle(new Pai.Handler('GrabMasterResponse', function (msg, key) {
            var res = msg[key]
            console.log(res)
            if (res.Status == 1) {
            }
        }))
        Pai.send({ GrabMasterRequest: {} })
    }
    // 申请下庄
    _prototype.xiaZhuangBtnClick = function () {
        var self = this
        self.shangZhuangBtn.visible = false
        self.xiaZhuangBtn.visible = false
        console.log('申请下庄')
        Pai.addHandle(new Pai.Handler('GiveUpMasterResponse', function (msg, key) {
            var res = msg[key]
            console.log(res)
            if (res.Status == 1) {

            }
        }))
        Pai.send({ GiveUpMasterRequest: { Type: 2 } })
    }
    // 申请上庄
    _prototype.shangZhuangBtnClick = function () {
        var self = this
        self.shangZhuangBtn.visible = false
        self.xiaZhuangBtn.visible = false
        console.log('申请上庄')
        Pai.addHandle(new Pai.Handler('GiveUpMasterResponse', function (msg, key) {
            var res = msg[key]
            console.log(res)
            if (res.Status == 1) {

            }
        }))
        Pai.send({ GiveUpMasterRequest: { Type: 1 } })
    }
    // 点击筹码
    _prototype.chipClick = function (obj, ev) {
        var self = this
        for (var i = 0; i < self.chipBox._childs.length; i++) {
            self.chipBox._childs[i].getChildAt(0).visible = false
        }
        obj.getChildAt(0).visible = true
        this.currentChip = obj.tag
    }
    _prototype.resetView = function () {
        var self = this
        console.log('重置')
        // 删除筹码
        for (var i = 0; i < self.tableArr.length; i++) {
            var t = self.tableArr[i]
            t.destroyChildren()
        }
        // 隐藏投注总金额
        for (var i = 0; i < self.allMoneySum._childs.length; i++) {
            var t = self.allMoneySum._childs[i]
            t.visible = false
            t.text = ''
        }
        // 隐藏自己投注
        for (var i = 0; i < self.userMoneySum._childs.length; i++) {
            var t = self.userMoneySum._childs[i].getChildAt(0)
            self.userMoneySum._childs[i].visible = false
            t.text = ''
        }
        // 隐藏所有玩家输赢积分
        for (var i = 0; i < self.playerArr.length; i++) {
            var box = self.playerArr[i].getChildByName('gradeBox')
            box.destroyChildren()
        }
        self.master.getChildByName('gradeBox').destroyChildren()

        // 隐藏牌
        for (var i = 0; i < self.paiBox._childs.length; i++) {
            self.paiBox._childs[i].getChildAt(0).skin = '../bin/comp/pai/H.png'
            self.paiBox._childs[i].getChildAt(1).skin = '../bin/comp/pai/H.png'
            self.paiBox._childs[i].getChildAt(2).skin = ''
            self.paiBox._childs[i].getChildAt(3).text = ''
            self.paiBox._childs[i].getChildAt(3).visible = false
            self.paiBox._childs[i].x = (self.paiBox.width - self.paiBox._childs[i].width) / 2
            self.paiBox._childs[i].y = -500
        }
        // 扣积分
        for (var i = 0; i < self.playerArr.length; i++) {
            var box = self.playerArr[i].getChildByName('gradeBox')
            box.destroyChildren()
        }
        // self.showRoomStatus()
        // self.roomStatus.getChildByName('freeFlag').visible = false
        // self.roomStatus.getChildByName('freeFlag').visible = false
        self.stopPaiAnimate()
        self.isGaming = false
        self.lastCoinMap = {}
    }
    // 有人离开
    _prototype.whoLeave = function (outID, dataArr, onlineNumber) {
        var self = this
        // 自己
        if (outID == Pai.selfUserInfo.Id) {

            Pai.clearTimeout()
            Pai.clearInterval()
            self.removeSelf()
            self.destroy()
            Pai.clockView.removeSelf()
            Pai.hundredBoard = null
            Pai.loadedView.roundId = 0
            Pai.loadedView.money.text = Pai.formatMoney(Pai.selfUserInfo.Coin)
            Laya.stage.addChild(Pai.loadedView)
            return
        }

        // 其他人
        var arr = Pai.round.PlayerInfo.filter(function (p) {
            if (p.Id != Pai.selfUserInfo.Id) {
                return p
            }
        })

        for (var i = 0; i < this.playerArr.length - 1; i++) {
            var player = this.playerArr[i + 1]
            player.skin = '../bin/comp/customBoard/waitbg-game.png'
            player.getChildAt(1).text = ''
        }
        if (dataArr != undefined) {
            Pai.round.PlayerInfo = dataArr
            dataArr = dataArr.filter(function (p) {
                if (p.Id != Pai.selfUserInfo.Id) {
                    return p
                }
            })
            for (var j = 0; j < dataArr.length; j++) {
                var player = this.playerArr[j + 1]
                var headImg = decodeURIComponent(dataArr[j].AvatarUrl)
                if (dataArr[j].Nickname == self.master.getChildByName('name').text) {
                    continue
                }
                if (dataArr[j].AvatarUrl) {
                    player.skin = headImg
                } else {
                    player.skin = '../bin/comp/loaded/' + dataArr[j].AvatarId + '.png?v='+Pai.version
                }
                // player.skin = '../bin/comp/loaded/' + dataArr[j].AvatarId + '.png'
                player.getChildAt(1).text = Pai.formatMoney(dataArr[j].Coin)
            }
        }
        // if (!onlineNumber) onlineNumber = 1
        // this.onlineBtn.getChildAt(1).text = onlineNumber

        for (var i = 1; i < self.playerArr.length; i++) {
            var player = self.playerArr[i]
            var index = player.skin.indexOf('wait')
            if (index > 0) {
                player.getChildByName('money').text = ''
            }
        }
    }


    // 数字->图片
    _prototype.number2Img = function (num, view) {
        view.visible = true
        if (num > 0) {
            if (Pai.soundAllowPlay == 1) Laya.SoundManager.playSound('../bin/res/sound/胜.m4a', 1, new Laya.Handler(this, function () { }))
            var number = ''
            if (num >= 100000000) {
                number = (num / 100000000).toFixed(2) + ''
            } else if (num >= 10000) {
                number = (num / 10000).toFixed(2) + ''
            } else {
                number = num + ''
            }
            var flag = new Laya.Sprite()
            flag.loadImage('../bin/comp/result/jia.png', 0, 0, 30, 36);
            view.addChild(flag)
            for (var i = 0; i < number.length; i++) {
                var sp = new Laya.Sprite();
                var url = "../bin/comp/result/jia_" + number[i] + '.png'
                sp.loadImage(url, (i + 1) * 30, 0, 30, 36);
                view.addChild(sp)
            }
            var end = new Laya.Sprite()

            var str = ''
            if (num >= 100000000) {
                str = '../bin/comp/result/jia_yi.png'
            } else if (num >= 10000) {
                str = '../bin/comp/result/jia_wan.png'
            } else {
                return
            }
            end.loadImage(str, (number.length + 1) * 30, 0, 30, 36);
            view.addChild(end)
        } else if (num < 0) {
            if (Pai.soundAllowPlay == 1) Laya.SoundManager.playSound('../bin/res/sound/输.mp3', 1, new Laya.Handler(this, function () { }))
            var number = ''
            if (num <= -100000000) {
                number = (num / 100000000).toFixed(2) + ''
            } else if (num <= -10000) {
                number = (num / 10000).toFixed(2) + ''
            } else {
                number = num + ''
            }
            var flag = new Laya.Sprite()
            flag.loadImage('../bin/comp/result/less_jian.png', 0, 0, 30, 36);
            view.addChild(flag)
            for (var i = 1; i < number.length; i++) {
                var sp = new Laya.Sprite();
                var url = "../bin/comp/result/less_" + number[i] + '.png'
                sp.loadImage(url, i * 30, 0, 30, 36);
                view.addChild(sp)
            }
            var end = new Laya.Sprite()

            var str = ''
            if (num <= -100000000) {
                str = '../bin/comp/result/less_yi.png'
            } else if (num <= -10000) {
                str = '../bin/comp/result/less_wan.png'
            } else {
                return
            }
            end.loadImage(str, number.length * 30, 0, 30, 36);
            view.addChild(end)
        } else {
            var flag = new Laya.Sprite()
            flag.loadImage('../bin/comp/result/jia.png', 0, 0, 30, 36);
            view.addChild(flag)
            var end = new Laya.Sprite()
            end.loadImage('../bin/comp/result/jia_0.png', 30, 0, 30, 36);
            view.addChild(end)
        }
    }
    // 点击桌子
    _prototype.tableBtnClick = function (obj, ev) {
        var self = this
        Pai.addHandle(new Pai.Handler('BetResponse', function (msg, key) {
            var res = msg[key]
            if (res.Status == 1) {
                console.log('下注成功')
            } else {
                Pai.alertView.show(res.Msg)
            }
        }))
        Pai.send({
            BetRequest: {
                Coin: self.currentChip,
                Direction: obj.tag
            }
        })
    }
    // 显示房间状态
    _prototype.showRoomStatus = function (name) {
        console.log(name)
        var self = this
        for (var i = 0; i < self.roomStatus._childs.length; i++) {
            var child = self.roomStatus.getChildAt(i)
            child.visible = false
        }
        if (name) {
            self.roomStatus.getChildByName(name).visible = true
        }
    }
    // 显示桌上总下注
    _prototype.showAllTableMoney = function (allPlayerCoinMap) {

        var self = this
        for (var key in allPlayerCoinMap) {
            if (self.lastCoinMap[key]) {
                if (allPlayerCoinMap[key] > self.lastCoinMap[key]) {
                    self.lastCoinMap[key] = allPlayerCoinMap[key]
                }
            } else {
                self.lastCoinMap[key] = allPlayerCoinMap[key]
            }

            var value = self.lastCoinMap[key]

            var t = self.allMoneySum._childs[key * 1 - 1]
            t.visible = true
            // if (value >= 10000) {
            //     var str = '亿'
            //     value = value / 10000
            // } else {
            //     str = '万'
            // }
            // t.text = '总金额：' + value + str
            t.text = '总金额：' + Pai.formatMoney(value)
        }
    }
    // 显示自己总下注
    _prototype.showUserTableMoney = function (currentPlayerCoinMap) {
        var self = this
        for (var key in currentPlayerCoinMap) {
            var t = self.userMoneySum._childs[key * 1 - 1].getChildAt(0)
            self.userMoneySum._childs[key * 1 - 1].visible = true
            // if (currentPlayerCoinMap[key] >= 10000) {
            //     var str = '亿'
            //     currentPlayerCoinMap[key] = currentPlayerCoinMap[key] / 10000
            // } else {
            //     str = '万'
            // }
            // t.text = currentPlayerCoinMap[key] + str
            t.text = Pai.formatMoney(currentPlayerCoinMap[key])
        }
    }

    // 更新玩家状态
    _prototype.updatePlayerStatus = function () {
        var self = this
        var arr = Pai.round.PlayerInfo.filter(function (p) {
            if (p.Id != Pai.selfUserInfo.Id) {
                return p
            }
        })
        var n = arr.length
        if (n >= 4) {
            n = 4
        }
        for (var j = 0; j < n; j++) {
            var player = this.playerArr[j + 1]
            var headImg = decodeURIComponent(arr[j].AvatarUrl)
            if (arr[j].Nickname == Pai.round.MasterInfo.Nickname) {
                continue
            }

            if (arr[j].AvatarUrl) {
                player.skin = headImg
            } else {
                player.skin = '../bin/comp/loaded/' + arr[j].AvatarId + '.png?v='+Pai.version
            }
            player.getChildAt(1).text = Pai.formatMoney(arr[j].Coin)
        }

        // this.onlineBtn.getChildAt(1).text = Pai.round.OnlineNumber
        if (Pai.round.MasterInfo.Id != 0) {
            var headImg = decodeURIComponent(Pai.round.MasterInfo.AvatarUrl)
            if (Pai.round.MasterInfo.AvatarUrl) {
                this.master.skin = headImg
            } else {
                this.master.skin = '../bin/comp/loaded/' + Pai.round.MasterInfo.AvatarId + '.png?v='+Pai.version
            }
            // this.master.skin = '../bin/comp/loaded/' + Pai.round.MasterInfo.AvatarId + '.png'
            this.master.getChildByName('name').text = Pai.round.MasterInfo.Nickname
            this.master.getChildByName('money').text = Pai.formatMoney(Pai.round.MasterInfo.Coin)
            if (this.master.getChildByName('name').text == '庄家') {
                this.master.getChildByName('money').text = Pai.formatMoney(Pai.round.SystemCoin)
            }
        } else {
            this.master.skin = '../bin/comp/loaded/touxiang.png'
            this.master.getChildByName('name').text = '庄家'
            this.master.getChildByName('money').text = Pai.formatMoney(Pai.round.SystemCoin)
        }
    }
    // 退出
    _prototype.exitBtnClick = function (obj, ev) {
        var self = this
        Pai.send({ LeaveRoundRequest: {} })
    }
    // 筹码动画
    _prototype.createChip = function (obj, user, chip) {

        var self = this
        var sp = new Laya.Sprite();
        var url = "../bin/comp/4renchang/" + chip + '.png?v='+Pai.version
        sp.loadImage(url, 0, 0, 40, 40);
        sp.zOrder = 3
        sp.width = 40
        sp.height = 40
        sp.x = Math.random() * (obj.width - sp.width)
        sp.y = Math.random() * (obj.height - sp.height)
        var a = obj.x > user.x ? -1 : 1
        var b = obj.y > user.y ? -1 : 1

        var startX = Math.abs(obj.x - user.x) * a
        var startY = Math.abs(obj.y - user.y) * b

        Laya.Tween.from(sp, { x: startX, y: startY }, 200, Laya.Ease.linearIn, Laya.Handler.create
            (this, null));

        return sp
    }
    // 筛子动画
    _prototype.createAnimation = function (num1, num2) {
        if (Pai.soundAllowPlay == 1) Laya.SoundManager.playSound('../bin/res/sound/筛子声.m4a', 1, new Laya.Handler(this, function () { }))

        if (this.ballBox.visible == false) {
            this.ballBox.visible = true
        } else {
            return
        }
        var self = this
        this.ballArr = []
        for (var i = 0; i < 2; i++) {
            var ani = new Laya.Animation();
            ani.loadAtlas(this.animatePath); // 加载图集动画
            ani.interval = 20;			// 设置播放间隔（单位：毫秒）
            ani.index = 0; 				// 当前播放索引
            ani.play();
            var bounds = ani.getGraphicBounds();
            ani.pivot(bounds.width / 2, bounds.height / 2);
            ani.pos(this.ballBox.width - this.ballBox.width / (1.5 + (i * 1.5)), this.ballBox.height / 2);
            this.ballBox.addChild(ani);
            this.ballArr.push(ani)
        }
        setTimeout(function () {
            self.ballArr[0].gotoAndStop((num1) * 4 - 4)
            setTimeout(function () {
                self.ballArr[1].gotoAndStop((num2) * 4 - 4)
                setTimeout(function () {
                    self.ballBox.visible = false
                }, 1500)
            }, Math.random() * 500 + 500)
        }, Math.random() * 500 + 500)
    }
    return HundredBoard;
})(ui.hundred.hundredBoardUI);
