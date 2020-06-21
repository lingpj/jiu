var DajiuBoardView = (function (_super) {
    _super.uiView = Pai.filterImgAddVersion(_super.uiView)
    function DajiuBoard() {
        DajiuBoard.super(this);
        this.ballArr = []
        this.zhuangID = -1
        this.currentChip = 1000
        this.controlRobAnimate = -1
        this.gamingPlayerArr = []
        this.sendPaiOrder = []
        // this.playerIdDirection = ''
        this.sendPaiResult = ''
        this.lastAllTableMoney = -1
        this.animatePath = "../bin/res/ball/1.json";
        this.throwBallBtn.on(Laya.Event.CLICK, this, this.throwBallBtnClick)
        this.readyBtn.on(Laya.Event.CLICK, this, this.readyBtnClick)
        this.exitBtn.on(Laya.Event.CLICK, this, this.exitBtnClick)
        this.robZhuangBtn.on(Laya.Event.CLICK, this, this.robZhuangBtnClick)
        this.zuheBtn.on(Laya.Event.CLICK, this, this.zuheBtnClick)
        this.setBtn.on(Laya.Event.CLICK, this, this.setBtnClick)
        this.chipClickBoard.on(Laya.Event.CLICK, this, this.tableBtnClick)
        this.tableArr = [this.table1, this.table2, this.table3, this.table4, this.table5, this.table6]
        this.playerArr = [this.p1, this.p4, this.p3, this.p2]
        this.paiAnimateArr = [this.paiBox, this.paiBoxx, this.paiBoxxx, this.paiBoxxxx]
        this.init()
        this.registNotis()
    }
    Laya.class(DajiuBoard, 'DajiuBoard', _super);
    var _prototype = DajiuBoard.prototype
    // 初始化
    _prototype.init = function () {
        var self = this
        for (var i = 1; i < 22; i++) {
            Laya.loader.load('../bin/comp/pai/S'+i+'.png', null)
            Laya.loader.load('../bin/comp/pai/H'+i+'.png', null)
        }
        for (var i = 0; i < 6; i++) {
            var t = this.tableArr[i]
            t.tag = i + 2
            if (i == 5) t.tag = 1
            // if (i == 2 || i == 4 || i == 0) continue
            // t.on(Laya.Event.CLICK, this, this.tableBtnClick, [t])
            // t.mouseEnabled = false
        }
        for (var i = 0; i < 5; i++) {
            var c = this.chipBox.getChildAt(i)
            c.tag = Pai.round.ChipLevels[i]

            c.on(Laya.Event.CLICK, this, this.chipClick, [c])
            if (Pai.round.RoundType == 5) {
                c.skin = '../bin/comp/4renchang/' + c.tag + '.png?v='+Pai.version
            }
        }
        self.currentChip = Pai.round.ChipLevels[0]
        var headImg = decodeURIComponent(Pai.selfUserInfo.AvatarUrl)
        if (Pai.selfUserInfo.AvatarUrl) {
            this.p1.skin = headImg
        } else {
            this.p1.skin = '../bin/comp/loaded/' + Pai.selfUserInfo.AvatarId + '.png?v='+Pai.version
        }
        // this.p1.skin = '../bin/comp/loaded/' + Pai.selfUserInfo.AvatarId + '.png'
        this.p1.getChildByName('money').text = Pai.formatMoney(Pai.selfUserInfo.Coin)

        for (var i = 0; i < 4; i++) {
            var p = this.paiBox._childs[i]
            p.zOrder = 1
            p.on(Laya.Event.CLICK, this, this.paiClick, [p])
        }
        self.showCardHistory()
    }
    // 设置按钮
    _prototype.setBtnClick = function () {
        var self = this
        var st = new SetView()
        st.popup()
        st.changeUserBtn.visible = false
    }
    // 点击牌
    _prototype.paiClick = function (p) {
        p.y += p.zOrder == 1 ? -10 : 10
        p.zOrder = p.zOrder == 1 ? 2 : 1
    }
    // 组合
    _prototype.zuheBtnClick = function () {
        var self = this
        var count = 0, arr = []
        for (var i = 0; i < this.paiBox._childs.length; i++) {
            if (this.paiBox._childs[i].zOrder == 2) {
                count++
                arr.push(this.paiBox._childs[i].tag)
            }
        }
        if (count != 2) return
        for (var i = 0; i < this.paiBox._childs.length; i++) this.paiBox._childs[i].mouseEnabled = false
        this.zuheBtn.visible = false
        Pai.addHandle(new Pai.Handler('MatchCardResponse', function (msg, key) {
            var res = msg[key]
            if (res.Status == 1) {
                Pai.alertView.show('组牌成功')
            } else {
                Pai.alertView.show(res.Msg)
            }
        }))
        Pai.send({ MatchCardRequest: { Id1: arr[0] * 1, Id2: arr[1] } })
    }

    // 发牌动画
    _prototype.sendPaiAnimate = function (random) {
        setTimeout(function () {
            if (Pai.soundAllowPlay == 1) Laya.SoundManager.playSound('../bin/res/sound/开始发牌.mp3', 1, new Laya.Handler(this, function () { }))
        }, 2500);
        var self = this
        self.paiBox.tag = 1
        self.paiBoxx.tag = 2
        self.paiBoxxx.tag = 3
        self.paiBoxxxx.tag = 4

        var numberArr = [
            { x: 470, y: 513 },
            { x: 910, y: 183 },
            { x: 470, y: 27 },
            { x: 200, y: 183 },
        ]
        // var dd = {
        //     1: 0,
        //     2: 1,
        //     3: 2,
        //     5: 3,
        // }
        // var playerIdDirection = self.playerIdDirection

        // for (var ID in playerIdDirection) {
        //     var direction = playerIdDirection[ID];
        //     if (ID == res.PlayerId) {
        //         var index = dd[direction]
        //         self.playerArr[index].getChildByName('readyFlag').visible = true
        //     }
        // }

        for (var i = 0; i < self.playerArr.length; i++) {
            if (self.playerArr[i].getChildByName('zhuangFlag').visible == true) {
                var zhuangIndex = i
            }
        }
        if (!zhuangIndex) zhuangIndex = 0
        // self.playerArr[zhuangIndex].getChildByName('zhuangFlag').visible = true
        var arr1 = [[1, 2, 3, 4], [2, 3, 4, 1], [3, 4, 1, 2], [4, 1, 2, 3]]
        var arr2 = [[2, 3, 4, 1], [3, 4, 1, 2], [4, 1, 2, 3], [1, 2, 3, 4]]
        var arr3 = [[3, 4, 1, 2], [4, 1, 2, 3], [1, 2, 3, 4], [2, 3, 4, 1]]
        var arr4 = [[4, 1, 2, 3], [1, 2, 3, 4], [2, 3, 4, 1], [3, 4, 1, 2]]
        var bigArr = [arr1, arr2, arr3, arr4]

        if (random == 0) random = 4
        console.log(random)

        console.log('庄：', zhuangIndex)
        var arr = bigArr[zhuangIndex]
        var temp = arr[random - 1]
        var tempPai = []
        var tempNum = []
        self.sendPaiOrder = temp
        console.log(self.sendPaiOrder)
        for (var i = 0; i < temp.length; i++) {
            var a = self.paiAnimateArr[temp[i] - 1]
            var b = numberArr[temp[i] - 1]
            tempPai.push(a)
            tempNum.push(b)
        }
        setTimeout(function () {
            for (var i = 0; i < 4; i++) {
                Laya.Tween.to(tempPai[i], { x: tempNum[i].x, y: tempNum[i].y }, (i + 1) * 100, Laya.Ease.linearIn, Laya.Handler.create
                    (self, null), i * 300);
            }
        }, 5000);
    }
    // 开始抢庄动画
    _prototype.startRobAnimate = function (tempArr) {
        this.controlRobAnimate = 1

        for (var i = 0; i < tempArr.length; i++) {
            tempArr[i].getChildByName('ringFlag').visible = true
            var flag = tempArr[i].getChildByName('ringFlag')
            Laya.Tween.from(flag, { alpha: 0 }, 200, Laya.Ease.linearIn, Laya.Handler.create
                (this, this.finishAnimate, [flag]), i * 200);
        }
    }
    // 显示历史记录
    _prototype.showCardHistory = function (dataArr) {
        var self = this
        var arr = []

        if (!dataArr) {
            for (var i = 0; i < 32; i++) {
                arr.push({
                    img: { skin: '../bin/comp/pai/H.png' }
                })
            }
        } else if (dataArr.length < 1) {
            for (var i = 0; i < 16; i++) {
                arr.push({
                    img: { skin: '../bin/comp/pai/H.png' }
                })
            }
        } else {
            for (var i = 0; i < 8; i++) {
                arr.push({
                    img: { skin: '' }
                })
            }
            for (var i = 0; i < dataArr.length; i++) {
                arr.push({
                    img: { skin: '../bin/comp/pai/H' + dataArr[i].Id + '.png' }
                })
            }
        }
        self.cardHistoryList.dataSource = arr
    }
    _prototype.finishAnimate = function (flag) {
        if (this.controlRobAnimate != 1) return
        Laya.Tween.from(flag, { alpha: 0 }, 200, Laya.Ease.linearIn, Laya.Handler.create
            (this, this.finishAnimate, [flag]), 200);
    }
    // 停止抢庄动画
    _prototype.stopRobAnimate = function () {
        this.controlRobAnimate = -1
        for (var i = 0; i < this.playerArr.length; i++) {
            this.playerArr[i].getChildByName('ringFlag').visible = false
        }
    }
    // 注册通知
    _prototype.registNotis = function () {
        var self = this
        // 破产保护   
        Pai.addHandle(new Pai.Handler('GiveCoinResponse', function (msg, key) {
            var res = msg[key]
            console.log('破产保护：', res)
            if (res.Status == 1) {
                Pai.alertView.show('系统破产保护，赠送你：' + res.GiveCoin + '金币')
                self.p1.getChildByName('money').text = Pai.formatMoney(res.CoinAfterGive)
                Pai.selfUserInfo.Coin = res.CoinAfterGive
            } else {
                Pai.alertView.show(res.Msg, 2000)
            }
        }))
        // 可以准备
        Pai.addHandle(new Pai.Handler('RoundReadyBroadcast', function (msg, key) {
            Pai.alertView.show('开始准备')
            self.resetView()
            self.readyBtn.visible = true
        }))
        //玩家离开的广播
        Pai.addHandle(new Pai.Handler('LeaveRoundBroadcast', function (msg, key) {
            var res = msg[key]
            console.log('有人离开：', res)
            if (res.Status == 1) {
                var outID = res.PlayerId
                self.whoLeave(outID)
            } else {
                Pai.alertView.show('正在游戏，不能离开！')
            }
        }))
        //被踢出局广播
        Pai.addHandle(new Pai.Handler('KickOutRoundBroadcast', function (msg, key) {
            var res = msg[key]
            console.log('被踢出去：', res)
            var outID = res.PlayerId
            self.whoLeave(outID)
        }))
        // 开始下注
        Pai.addHandle(new Pai.Handler('BetBroadcast', function (msg, key) {
            var res = msg[key]
            Pai.alertView.show('开始下注')
            self.allTableSum.visible = true
            if (Pai.soundAllowPlay == 1) Laya.SoundManager.playSound('../bin/res/sound/开始下注.mp3', 1, new Laya.Handler(this, function () { }))
            self.robZhuangBtn.visible = false
            Pai.clockView.show(10, [330, 290])
            self.xiazhuFlag.visible = true
            self.freeFlag.visible = false
            if (self.p1.getChildByName('zhuangFlag').visible == false) {
                self.chipBox.visible = true
                // for (var i = 0; i < self.tableArr.length; i++) { self.tableArr[i].mouseEnabled = true }
                self.chipClickBoard.mouseEnabled = true
            }
        }))

        // 发牌
        Pai.addHandle(new Pai.Handler('DealCardSingleBroadcast', function (msg, key) {
            var res = msg[key]
            console.log('发牌了', res)
            self.peipaiFlag.visible = true
            Pai.clockView.show(15, [330, 290])
            setTimeout(function () {
                self.zuheBtn.visible = true
            }, 3000);

            self.showCardHistory(res.RestCard)

            for (var i = 0; i < 4; i++) {
                self.paiBox._childs[i].skin = '../bin/comp/pai/H' + res.Cards[i].Id + '.png'
                self.paiBox._childs[i].tag = res.Cards[i].Id
            }
        }))
        // 开牌
        Pai.addHandle(new Pai.Handler('OpenCardBroadcast', function (msg, key) {
            var res = msg[key]
            self.peipaiFlag.visible = false
            console.log('开牌了：', res)
            self.sendPaiResult = res
            self.showCardHistory(res.RestCard)

            setTimeout(function () {
                self.bipaiFlag.visible = true
                Pai.clockView.show(10, [330, 290])
                setTimeout(function () {
                    self.bipaiFlag.visible = false
                }, 10000);
                self.resetPaiPosition()
                self.zuheBtn.visible = false
                self.paiBox2.visible = true
                var s22 = setTimeout(function () {
                    self.freeFlag.visible = true
                    Pai.clockView.show(5, [290, 290])
                    var s33 = setTimeout(function () {
                        self.freeFlag.visible = false
                    }, 5000);
                    Pai.setIntervalArr.push(s33)
                }, 10000)
                Pai.setIntervalArr.push(s22)
                // 显示牌

                self.updateSendPai(self.sendPaiResult)

                // 扣积分
                var obj = res.CoinMap
                var dd = {
                    1: 3,
                    2: 2,
                    3: 1,
                    5: 0,
                }
                var playerIdDirection = self.playerIdDirection
                for (var ID in obj) {
                    for (var id2 in playerIdDirection) {
                        if (ID == id2) {
                            var direction = playerIdDirection[id2];
                            var index = dd[direction]
                            var player = self.playerArr[index]
                            var index2 = player.skin.indexOf('wait')
                            if (index2 > 0) {
                                player.getChildByName('money').text = ''
                            } else {
                                player.getChildByName('money').text = Pai.formatMoney(obj[ID][1])
                            }
                            self.number2Img(obj[ID][0], player.getChildByName('gradeBox'))
                            if (ID == Pai.selfUserInfo.Id) {
                                Pai.selfUserInfo.Coin = obj[ID][1]
                                if (Pai.loadedView) {
                                    Pai.loadedView.money.text = Pai.formatMoney(obj[ID][1])
                                }
                            }
                        }
                    }
                }


                var s1 = setTimeout(function () {
                    // 隐藏牌
                    self.paiBox2.visible = false
                    for (var i = 0; i < self.paiBox2._childs.length; i++) {
                        self.paiBox2._childs[i].getChildAt(0).skin = '../bin/comp/pai/S.png'
                        self.paiBox2._childs[i].getChildAt(1).skin = '../bin/comp/pai/S.png'
                        self.paiBox2._childs[i].getChildAt(2).skin = ''
                    }
                    // 隐藏积分
                    for (var i = 0; i < self.playerArr.length; i++) {
                        var box = self.playerArr[i].getChildByName('gradeBox')
                        box.destroyChildren()
                    }
                    // 重置牌的位置
                    for (var i = 0; i < self.paiBox._childs.length; i++) {
                        self.paiBox._childs[i].zOrder = 1
                        self.paiBox._childs[i].y = 0
                        self.paiBox._childs[i].mouseEnabled = true
                    }
                    self.resetView()
                }, 10000);
                Pai.setTimeoutArr.push(s1)
            }, 50)
        }))
        // 有人下注
        Pai.addHandle(new Pai.Handler('BetResultBroadcast', function (msg, key) {
            var res = msg[key]
       
            if (Pai.soundAllowPlay == 1) {
                Laya.SoundManager.playSound('../bin/res/sound/加注.m4a', 1, new Laya.Handler(this, function () { }))
            }
            if (res.Status == 1) {

                var dd = {
                    1: 3,
                    2: 2,
                    3: 1,
                    5: 0,
                }
                var playerIdDirection = self.playerIdDirection
                for (var ID in playerIdDirection) {
                    var direction = playerIdDirection[ID];
                    if (ID == res.PlayerId) {
                        var index = dd[direction]
                        self.playerArr[index].getChildByName('money').text = Pai.formatMoney(res.RestCoin)
                        var chip = self.createChip(self.tableArr[5], self.playerArr[index], res.Coin)
                        self.tableArr[5].addChild(chip)
                        self.showAllTableMoney(res.AllPlayerCoinMap)
                        if (res.PlayerId == Pai.selfUserInfo.Id) {
                            Pai.selfUserInfo.Coin = res.RestCoin
                            self.showUserTableMoney(res.CurrentPlayerCoinMap)
                        }
                    }
                }

                // 自己下注
                // if (res.PlayerId == Pai.selfUserInfo.Id) {
                //     self.p1.getChildByName('money').text = Pai.formatMoney(res.RestCoin)
                //     for (var j = 0; j < self.tableArr.length; j++) {
                //         var t = self.tableArr[j]
                //         if (res.Direction == t.tag) {
                //             self.showAllTableMoney(res.AllPlayerCoinMap)
                //             self.showUserTableMoney(res.CurrentPlayerCoinMap)
                //             var chip = self.createChip(t, self.p1, res.Coin)
                //             t.addChild(chip)
                //             break
                //         }
                //     }
                //     return
                // }
                // // 其他人下注
                // var arr = Pai.round.PlayerInfo.filter(function (p) {
                //     if (p.Id != Pai.selfUserInfo.Id) {
                //         return p
                //     }
                // })
                // for (var i = 0; i < arr.length; i++) {
                //     var p = arr[i]
                //     if (res.PlayerId == p.Id) {
                //         var player = self.playerArr[i + 1]
                //         player.getChildByName('money').text = Pai.formatMoney(res.RestCoin)
                //         // 桌子
                //         for (var j = 0; j < self.tableArr.length; j++) {
                //             var t = self.tableArr[j]
                //             if (res.Direction == t.tag) {
                //                 self.showAllTableMoney(res.AllPlayerCoinMap)
                //                 self.showUserTableMoney(res.CurrentPlayerCoinMap)
                //                 var who = self.playerArr[i + 1]
                //                 var chip = self.createChip(t, who, res.Coin)
                //                 t.addChild(chip)
                //                 break
                //             }
                //         }
                //         break
                //     }
                // }

            } else {
                layer.msg(res.Msg)
            }
        }))
        // 开始抢庄
        Pai.addHandle(new Pai.Handler('GrabMasterBroadcast', function (msg, key) {
            var res = msg[key]
            console.log('开始抢庄：', res)
            Pai.alertView.show('开始抢庄')
            if (Pai.soundAllowPlay == 1) Laya.SoundManager.playSound('../bin/res/sound/开始游戏.m4a', 1, new Laya.Handler(this, function () { }))
            self.gamingPlayerArr = res.Players
            Pai.clockView.show(5, [330, 290])
            self.freeFlag.visible = false
            self.hideReadyFlag()
            self.robZhuangBtn.visible = true

            var dd = {
                1: 3,
                2: 2,
                3: 1,
                5: 0,
            }
            var playerIdDirection = self.playerIdDirection

            var tempArr = []
            for (var ID in playerIdDirection) {
                var direction = playerIdDirection[ID];
                for (var i = 0; i < res.Players.length; i++) {
                    var id2 = res.Players[i]
                    if (ID == id2) {
                        var index = dd[direction]
                        var player = self.playerArr[index]
                        tempArr.push(player)
                    }
                }
            }
            console.log(tempArr)

            // for (var i = 0; i < self.gamingPlayerArr.length; i++) {
            //     self.playerArr[i].getChildByName('ringFlag').visible = true
            // }
            self.startRobAnimate(tempArr)
        }))
        // 抢庄结果
        Pai.addHandle(new Pai.Handler('GrabMasterResultBroadcast', function (msg, key) {
            var res = msg[key]
            console.log('抢庄结果', res)
            self.stopRobAnimate()
            if (res.Status == 1) {
                self.robZhuangBtn.visible = false
                self.zhuangID = res.PlayerId

                var dd = {
                    1: 3,
                    2: 2,
                    3: 1,
                    5: 0,
                }
                var playerIdDirection = self.playerIdDirection
                // var count = 1
                // for (var ID in self.playerIdDirection) {
                //     if (count == 3 && ID == Pai.selfUserInfo.Id) {
                //         dd = {
                //             1: 1,
                //             2: 2,
                //             3: 3,
                //             5: 0,
                //         }
                //     }
                //     count++
                // }
                for (var ID in playerIdDirection) {
                    var direction = playerIdDirection[ID];
                    if (ID == res.PlayerId) {
                        var index = dd[direction]
                        var player = self.playerArr[index]
                        player.getChildByName('zhuangFlag').visible = true
                        player.getChildByName('ringFlag').visible = true
                    }
                }

            }
        }))
        // 开始丢筛子
        Pai.addHandle(new Pai.Handler('ThrowDiceBroadcast', function (msg, key) {
            var res = msg[key]
            console.log('开始丢筛子', res)
            self.robZhuangBtn.visible = false
            self.throwBallBtn.visible = true
        }))
        // 丢筛子结果  
        Pai.addHandle(new Pai.Handler('ThrowDiceResultBroadcast', function (msg, key) {
            var res = msg[key]
            console.log('丢筛子结果：', res)
            self.throwBallBtn.visible = false
            Laya.loader.load(self.animatePath, Laya.Handler.create(self, self.createAnimation, [res.Points[0], res.Points[1]]), null, Laya.Loader.ATLAS);
            var num = (res.Points[0] + res.Points[1]) % 4
            self.sendPaiAnimate(num)
        }))
        // 用户准备
        Pai.addHandle(new Pai.Handler('RoundReadyResultBroadcast', function (msg, key) {
            var res = msg[key]
            console.log('有人准备 ', res)
            // if (res.PlayerId == Pai.selfUserInfo.Id) {
            //     self.p1.getChildByName('readyFlag').visible = true
            //     return
            // }
            var dd = {
                1: 3,
                2: 2,
                3: 1,
                5: 0,
            }
            var playerIdDirection = self.playerIdDirection

            for (var ID in playerIdDirection) {
                var direction = playerIdDirection[ID];
                if (ID == res.PlayerId) {
                    var index = dd[direction]
                    self.playerArr[index].getChildByName('readyFlag').visible = true
                }
            }

            // var arr = Pai.round.PlayerInfo.filter(function (p) {
            //     if (p.Id != Pai.selfUserInfo.Id) {
            //         return p
            //     }
            // })
            // for (var i = 0; i < arr.length; i++) {
            //     var p = arr[i]
            //     if (p.Id == res.PlayerId) {
            //         self.playerArr[i + 1].getChildByName('readyFlag').visible = true
            //     }
            // }
        }))
        // 下注停止 
        Pai.addHandle(new Pai.Handler('BetStopBroadcast', function (msg, key) {
            var res = msg[key]
            console.log('下注停止：', res)
            if (Pai.soundAllowPlay == 1) Laya.SoundManager.playSound('../bin/res/sound/停止下注.mp3', 1, new Laya.Handler(this, function () { }))
            self.xiazhuFlag.visible = false
            self.chipBox.visible = false
            // for (var i = 0; i < self.tableArr.length; i++) { self.tableArr[i].mouseEnabled = false }
            self.chipClickBoard.mouseEnabled = false
        }))
    }
    // 有人进来，更新发牌
    _prototype.updateSendPai = function (res) {
        var self = this
        var dd = {
            1: 0,
            2: 1,
            3: 2,
            5: 3,
        }
        var restCard = {}
        var restDirection = {}
        var restDirectList = [];
        var playerCardMap = res.PlayerCardMap
        var inArray = function (list, target) {
            for (var i = 0, len = list.length; i < len; i++) {
                if (list[i] == target) {
                    return true
                }
            }
            return false;
        };

        for (var ID in playerCardMap) {
            if (ID > 0) {
                var playerIdDirection = self.playerIdDirection
                for (var id2 in playerIdDirection) {

                    if (ID == id2) {
                        var direction = playerIdDirection[id2]
                        var index = dd[direction]
                        var card = playerCardMap[ID]
                        self.paiBox2._childs[index].getChildAt(0).skin = '../bin/comp/pai/H' + card.Cards[0].Id + '.png'
                        self.paiBox2._childs[index].getChildAt(1).skin = '../bin/comp/pai/H' + card.Cards[1].Id + '.png'
                        self.paiBox2._childs[index].getChildAt(2).skin = '../bin/comp/pai/S' + card.Cards[2].Id + '.png'
                        self.paiBox2._childs[index].getChildAt(3).skin = '../bin/comp/pai/S' + card.Cards[3].Id + '.png'
                        var text = card.Form
                        self.paiBox2._childs[index].getChildAt(5).text = text;

                        if (!inArray(restDirectList, direction)) {
                            restDirectList.push(direction)
                        }
                        break;
                    }
                }
            } else {
                restCard[ID] = playerCardMap[ID]
            }
        }
        var newRestDirect = [];
        [1, 2, 3, 5].forEach(function (ele) {
            if (!inArray(restDirectList, ele)) {
                newRestDirect.push(ele)
            }
        });


        var zindex = 0

        for (var d in restCard) {
            var direction = newRestDirect[zindex]
            var index = dd[direction]
            var card = restCard[d]

            self.paiBox2._childs[index].getChildAt(0).skin = '../bin/comp/pai/H' + card.Cards[0].Id + '.png'
            self.paiBox2._childs[index].getChildAt(1).skin = '../bin/comp/pai/H' + card.Cards[1].Id + '.png'
            self.paiBox2._childs[index].getChildAt(2).skin = '../bin/comp/pai/S' + card.Cards[2].Id + '.png'
            self.paiBox2._childs[index].getChildAt(3).skin = '../bin/comp/pai/S' + card.Cards[3].Id + '.png'
            var text = card.Form
            self.paiBox2._childs[index].getChildAt(5).text = text;

            zindex++
        }
    }
    // 重置发牌动画的位置
    _prototype.resetPaiPosition = function () {
        for (var j = 0; j < this.paiAnimateArr.length; j++) {
            this.paiAnimateArr[j].x = 433
            this.paiAnimateArr[j].y = -291
        }
        for (var i = 0; i < 4; i++) {
            this.paiBox._childs[i].skin = '../bin/comp/pai/H.png'
        }
    }
    // 更新玩家状态
    _prototype.updatePlayerStatus = function () {
        
        var self = this
        console.log('庄：',self.zhuangID)
        var ID = Pai.selfUserInfo.Id
        var playerIdDirection = {}
        playerIdDirection[ID] = 5;

        for (var i = 0; i < self.playerArr.length; i++) {
            var p = self.playerArr[i]
            p.getChildByName('ringFlag').visible = false
            // p.getChildByName('readyFlag').visible = false
            p.getChildByName('zhuangFlag').visible = false
            // p.getChildByName('gradeBox').visible = false
        }
        for (var j = 1; j < this.playerArr.length; j++) {
            var player = this.playerArr[j]
            player.skin = 'comp/customBoard/waitbg-game.png'
            player.getChildByName('money').text = ''
        }
        var arr = Pai.round.PlayerInfo
        // 两个人
        if (Pai.round.PlayerInfo.length == 2) {
            if (Pai.round.PlayerInfo[0].Id == Pai.selfUserInfo.Id) {
                for (var j = 0; j < 2; j++) {
                    var player = this.playerArr[j]
                    var p = arr[j]
                    if (j == 1) {
                        playerIdDirection[p.Id] = 3;
                    }
                    var headImg = decodeURIComponent(p.AvatarUrl)
                    if (p.AvatarUrl) {
                        player.skin = headImg
                    } else {
                        player.skin = '../bin/comp/loaded/' + p.AvatarId + '.png?v='+Pai.version
                    }
                    // player.skin = '../bin/comp/loaded/' + p.AvatarId + '.png'
                    player.getChildByName('money').text = Pai.formatMoney(p.Coin)
                }
            } else {
                for (var j = 0; j < 2; j++) {
                    if (j == 0) {
                        var player = this.playerArr[3]
                    } else {
                        var player = this.playerArr[0]
                    }
                    var p = arr[j]
                    if (j == 0) playerIdDirection[p.Id] = 1;
                    var headImg = decodeURIComponent(p.AvatarUrl)
                    if (p.AvatarUrl) {
                        player.skin = headImg
                    } else {
                        player.skin = '../bin/comp/loaded/' + p.AvatarId +'.png?v='+Pai.version
                    }
                    // player.skin = '../bin/comp/loaded/' + p.AvatarId + '.png'
                    player.getChildByName('money').text = Pai.formatMoney(p.Coin)
                }
            }
        }
        // 三个人
        if (Pai.round.PlayerInfo.length == 3) {
            if (Pai.round.PlayerInfo[0].Id == Pai.selfUserInfo.Id) {
                var count = 1
                for (var j = 0; j < 3; j++) {
                    var player = this.playerArr[j]
                    var p = arr[j]
                    if (j == 1) playerIdDirection[p.Id] = 3;
                    if (j == 2) playerIdDirection[p.Id] = 2;
                    var headImg = decodeURIComponent(p.AvatarUrl)
                    if (p.AvatarUrl) {
                        player.skin = headImg
                    } else {
                        player.skin = '../bin/comp/loaded/' + p.AvatarId + '.png?v='+Pai.version
                    }
                    // if (count == 1) {
                    //     for (var q = 1; q < self.playerArr.length; q++) {
                    //         self.playerArr[q].getChildByName('ringFlag').visible = false
                    //         self.playerArr[q].getChildByName('zhuangFlag').visible = false
                    //     }
                    // }
                    if (self.zhuangID > -1) {
                        if (self.zhuangID == p.Id) {
                            player.getChildByName('ringFlag').visible = true
                            player.getChildByName('zhuangFlag').visible = true
                        }
                        count++
                    }
                    // player.skin = '../bin/comp/loaded/' + p.AvatarId + '.png'
                    player.getChildByName('money').text = Pai.formatMoney(p.Coin)
                }
            } else if (Pai.round.PlayerInfo[1].Id == Pai.selfUserInfo.Id) {
                var count = 1
                for (var j = 0; j < 3; j++) {
                    if (j == 0) {
                        var player = this.playerArr[3]
                    } else if (j == 1) {
                        var player = this.playerArr[0]
                    } else {
                        var player = this.playerArr[1]
                    }
                    var p = arr[j]
                    if (j == 0) playerIdDirection[p.Id] = 1;
                    if (j == 2) playerIdDirection[p.Id] = 3;
                    var headImg = decodeURIComponent(p.AvatarUrl)
                    if (p.AvatarUrl) {
                        player.skin = headImg
                    } else {
                        player.skin = '../bin/comp/loaded/' + p.AvatarId + '.png?v='+Pai.version
                    }
                    // if (count == 1) {
                    //     for (var q = 1; q < self.playerArr.length; q++) {
                    //         self.playerArr[q].getChildByName('ringFlag').visible = false
                    //         self.playerArr[q].getChildByName('zhuangFlag').visible = false
                    //     }
                    // }
                    if (self.zhuangID > -1) {
                        if (self.zhuangID == p.Id) {
                            player.getChildByName('ringFlag').visible = true
                            player.getChildByName('zhuangFlag').visible = true
                        }
                        count++
                    }
                    // player.skin = '../bin/comp/loaded/' + p.AvatarId + '.png'
                    player.getChildByName('money').text = Pai.formatMoney(p.Coin)
                }
            } else {
                var count = 1
                for (var j = 0; j < 3; j++) {
                    if (j == 0) {
                        var player = this.playerArr[2]
                    } else if (j == 1) {
                        var player = this.playerArr[3]
                    } else {
                        var player = this.playerArr[0]
                    }
                    var p = arr[j]
                    if (j == 0) playerIdDirection[p.Id] = 2;
                    if (j == 1) playerIdDirection[p.Id] = 1;
                    var headImg = decodeURIComponent(p.AvatarUrl)
                    if (p.AvatarUrl) {
                        player.skin = headImg
                    } else {
                        player.skin = '../bin/comp/loaded/' + p.AvatarId + '.png?v='+Pai.version
                    }
                    // if (count == 1) {
                    //     for (var q = 1; q < self.playerArr.length; q++) {
                    //         self.playerArr[q].getChildByName('ringFlag').visible = false
                    //         self.playerArr[q].getChildByName('zhuangFlag').visible = false
                    //     }
                    // }
                    if (self.zhuangID > -1) {
                        if (self.zhuangID == p.Id) {
                            player.getChildByName('ringFlag').visible = true
                            player.getChildByName('zhuangFlag').visible = true
                        }
                        count++
                    }
                    // player.skin = '../bin/comp/loaded/' + p.AvatarId + '.png'
                    player.getChildByName('money').text = Pai.formatMoney(p.Coin)
                }
            }
        }
        // 四个人
        if (Pai.round.PlayerInfo.length == 4) {
            if (Pai.round.PlayerInfo[0].Id == Pai.selfUserInfo.Id) {
                var count = 1
                for (var j = 0; j < 4; j++) {
                    var player = this.playerArr[j]
                    var p = arr[j]
                    if (j == 1) playerIdDirection[p.Id] = 3;
                    if (j == 2) playerIdDirection[p.Id] = 2;
                    if (j == 3) playerIdDirection[p.Id] = 1;
                    var headImg = decodeURIComponent(p.AvatarUrl)
                    if (p.AvatarUrl) {
                        player.skin = headImg
                    } else {
                        player.skin = '../bin/comp/loaded/' + p.AvatarId + '.png?v='+Pai.version
                    }
                    // if (count == 1) {
                    //     for (var q = 1; q < self.playerArr.length; q++) {
                    //         self.playerArr[q].getChildByName('ringFlag').visible = false
                    //         self.playerArr[q].getChildByName('zhuangFlag').visible = false
                    //     }
                    // }
                    if (self.zhuangID > -1) {
                        if (self.zhuangID == p.Id) {
                            player.getChildByName('ringFlag').visible = true
                            player.getChildByName('zhuangFlag').visible = true
                        }
                        count++
                    }
                    // player.skin = '../bin/comp/loaded/' + p.AvatarId + '.png'
                    player.getChildByName('money').text = Pai.formatMoney(p.Coin)
                }
            } else if (Pai.round.PlayerInfo[1].Id == Pai.selfUserInfo.Id) {
                var count = 1
                for (var j = 0; j < 4; j++) {
                    if (j == 0) {
                        var player = this.playerArr[3]
                    } else if (j == 1) {
                        var player = this.playerArr[0]
                    } else if (j == 2) {
                        var player = this.playerArr[1]
                    } else {
                        var player = this.playerArr[2]
                    }
                    var p = arr[j]
                    if (j == 0) playerIdDirection[p.Id] = 1;
                    if (j == 2) playerIdDirection[p.Id] = 3;
                    if (j == 3) playerIdDirection[p.Id] = 2;
                    var headImg = decodeURIComponent(p.AvatarUrl)
                    if (p.AvatarUrl) {
                        player.skin = headImg
                    } else {
                        player.skin = '../bin/comp/loaded/' + p.AvatarId +'.png?v='+Pai.version
                    }
                    // if (count == 1) {
                    //     for (var q = 1; q < self.playerArr.length; q++) {
                    //         self.playerArr[q].getChildByName('ringFlag').visible = false
                    //         self.playerArr[q].getChildByName('zhuangFlag').visible = false
                    //     }
                    // }
                    if (self.zhuangID > -1) {
                        if (self.zhuangID == p.Id) {
                            player.getChildByName('ringFlag').visible = true
                            player.getChildByName('zhuangFlag').visible = true
                        }
                        count++
                    }
                    // player.skin = '../bin/comp/loaded/' + p.AvatarId + '.png'
                    player.getChildByName('money').text = Pai.formatMoney(p.Coin)
                }
            } else if (Pai.round.PlayerInfo[2].Id == Pai.selfUserInfo.Id) {
                var count = 1
                for (var j = 0; j < 4; j++) {
                    if (j == 0) {
                        var player = this.playerArr[2]
                    } else if (j == 1) {
                        var player = this.playerArr[3]
                    } else if (j == 2) {
                        var player = this.playerArr[0]
                    } else {
                        var player = this.playerArr[1]
                    }
                    var p = arr[j]
                    if (j == 0) playerIdDirection[p.Id] = 2;
                    if (j == 1) playerIdDirection[p.Id] = 1;
                    if (j == 3) playerIdDirection[p.Id] = 3;
                    var headImg = decodeURIComponent(p.AvatarUrl)
                    if (p.AvatarUrl) {
                        player.skin = headImg
                    } else {
                        player.skin = '../bin/comp/loaded/' + p.AvatarId + '.png?v='+Pai.version
                    }
                    // if (count == 1) {
                    //     for (var q = 1; q < self.playerArr.length; q++) {
                    //         self.playerArr[q].getChildByName('ringFlag').visible = false
                    //         self.playerArr[q].getChildByName('zhuangFlag').visible = false
                    //     }
                    // }
                    if (self.zhuangID > -1) {
                        if (self.zhuangID == p.Id) {
                            player.getChildByName('ringFlag').visible = true
                            player.getChildByName('zhuangFlag').visible = true
                        }
                        count++
                    }
                    // player.skin = '../bin/comp/loaded/' + p.AvatarId + '.png'
                    player.getChildByName('money').text = Pai.formatMoney(p.Coin)
                }
            } else {
                var count = 1
                for (var j = 0; j < 4; j++) {
                    if (j == 0) {
                        var player = this.playerArr[1]
                    } else if (j == 1) {
                        var player = this.playerArr[2]
                    } else if (j == 2) {
                        var player = this.playerArr[3]
                    } else {
                        var player = this.playerArr[0]
                    }
                    var p = arr[j]
                    if (j == 0) playerIdDirection[p.Id] = 3;
                    if (j == 1) playerIdDirection[p.Id] = 2;
                    if (j == 2) playerIdDirection[p.Id] = 1;
                    var headImg = decodeURIComponent(p.AvatarUrl)
                    if (p.AvatarUrl) {
                        player.skin = headImg
                    } else {
                        player.skin = '../bin/comp/loaded/' + p.AvatarId + '.png?v='+Pai.version
                    }
                    // if (count == 1) {
                    //     for (var q = 1; q < self.playerArr.length; q++) {
                    //         self.playerArr[q].getChildByName('ringFlag').visible = false
                    //         self.playerArr[q].getChildByName('zhuangFlag').visible = false
                    //     }
                    // }
                    if (self.zhuangID > -1) {
                        if (self.zhuangID == p.Id) {
                            player.getChildByName('ringFlag').visible = true
                            player.getChildByName('zhuangFlag').visible = true
                        }
                        count++
                    }
                    // player.skin = '../bin/comp/loaded/' + p.AvatarId + '.png'
                    player.getChildByName('money').text = Pai.formatMoney(p.Coin)
                }
            }
        }


        // for (var j = 0; j < 4; j++) {
        //     var player = this.playerArr[j]
        //     var p = arr[j]
        //     playerIdDirection[p.Id] = j;
        //     player.skin = '../bin/comp/loaded/' + p.AvatarId + '.png'
        //     player.getChildByName('money').text = Pai.formatMoney(p.Coin)
        // }

        this.playerIdDirection = playerIdDirection;
        if (self.sendPaiResult) {
            self.updateSendPai(self.sendPaiResult)
        }
        console.log(this.playerIdDirection)
    }
    // 隐藏准备标志
    _prototype.hideReadyFlag = function () {
        var self = this
        for (var i = 0; i < self.playerArr.length; i++) {
            self.playerArr[i].getChildByName('readyFlag').visible = false
        }
    }
    // 数字->图片
    _prototype.number2Img = function (num, view) {
        view.destroyChildren()
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
    // 再来一局
    _prototype.resetView = function () {
        var self = this
        // 重置用户信息
        for (var i = 0; i < self.playerArr.length; i++) {
            var p = self.playerArr[i]
            p.getChildByName('ringFlag').visible = false
            p.getChildByName('readyFlag').visible = false
            p.getChildByName('zhuangFlag').visible = false
            p.getChildByName('gradeBox').visible = false
        }
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
        // 隐藏各个桌子总金额
        self.allTableSum.visible = false
        self.allTableSum.getChildAt(0).text = ''
        self.bipaiFlag.visible = false
        self.peipaiFlag.visible = false
        self.showCardHistory()
        self.sendPaiResult = ''
        self.zhuangID = -1
    }
    // 显示桌上总下注
    _prototype.showAllTableMoney = function (allPlayerCoinMap) {
        var self = this
        // if (self.p1.getChildByName('zhuangFlag').visible == true) {
        //     for (var key in allPlayerCoinMap) {
        //         var t = self.allMoneySum._childs[key * 1 - 1]
        //         t.visible = true
        //         var v = allPlayerCoinMap[key]
        //         if (allPlayerCoinMap[key] >= 10000) {
        //             var str = '亿'
        //             v = allPlayerCoinMap[key] / 10000
        //         } else {
        //             str = '万'
        //         }
        //         t.text = '下注金额：' + v + str
        //     }
        // }
        self.allTableSum.getChildAt(0).text = ''
        var sum = 0
        for (var key in allPlayerCoinMap) {
            var v = allPlayerCoinMap[key]
            console.log(v)
            sum += v
        }
        

        self.allTableSum.getChildAt(0).text = '总金额：' + Pai.formatMoney(sum)
    }
    // 显示自己总下注
    _prototype.showUserTableMoney = function (currentPlayerCoinMap) {
        var self = this
        if (self.p1.getChildByName('zhuangFlag').visible == false) {
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
    }
    // 点击筹码
    _prototype.chipClick = function (obj, ev) {
        var ring = this.chipBox.getChildAt(5)
        ring.pos(obj.x - 10, obj.y - 10)
        this.currentChip = obj.tag
    }
    // 退出
    _prototype.exitBtnClick = function (obj, ev) {
        var self = this
        Pai.send({ LeaveRoundRequest: {} })

    }
    // 点击桌子
    _prototype.tableBtnClick = function (obj, ev) {
        var self = this
        Pai.addHandle(new Pai.Handler('BetResponse', function (msg, key) {
            var res = msg[key]
            if (res.Status == 1) {
                console.log('下注成功')
            }
        }))
        Pai.send({
            BetRequest: {
                Coin: self.currentChip,
                Direction: 0
            }
        })
    }
    // 有人离开
    _prototype.whoLeave = function (outID) {
        var self = this

        if (outID == Pai.selfUserInfo.Id) {
            self.readyBtn.visible = false
            Pai.clearTimeout()
            Pai.clearInterval()
            self.removeSelf()
            self.destroy()
            Pai.dajiuBoard = null
            Pai.clockView.removeSelf()
            // Pai.dajiuBoard = new DajiuBoard()

            Pai.loadedView.money.text = Pai.formatMoney(Pai.selfUserInfo.Coin)
            Laya.stage.addChild(Pai.loadedView)
            return
        }

        var dd = {
            1: 3,
            2: 2,
            3: 1,
            5: 0,
        }
        var playerIdDirection = self.playerIdDirection

        for (var ID in playerIdDirection) {
            var direction = playerIdDirection[ID];
            if (ID == outID) {
                var index = dd[direction]
                var player = self.playerArr[index]
                player.skin = 'comp/customBoard/waitbg-game.png'
                player.getChildByName('money').text = ''
            }
        }
        for (var i = 1; i < self.playerArr.length; i++) {
            var player = self.playerArr[i]

            var index = player.skin.indexOf('wait')
            if (index > 0) {
                player.getChildByName('money').text = ''
            }
        }


        // var arr = Pai.round.PlayerInfo.filter(function (p) {
        //     if (p.Id != Pai.selfUserInfo.Id) {
        //         return p
        //     }
        // })
        // for (var i = 0; i < arr.length; i++) {
        //     var p = arr[i]
        //     if (outID == p.Id) {
        //         var player = self.playerArr[i + 1]
        //         player.skin = 'comp/customBoard/waitbg-game.png'
        //         player.getChildByName('money').text = ''
        //         break
        //     }
        // }

    }
    // 抢庄
    _prototype.robZhuangBtnClick = function (obj, ev) {
        var self = this
        Pai.addHandle(new Pai.Handler('GrabMasterResponse', function (msg, key) {
            var res = msg[key]
            if (res.Status == 1) {
                console.log('抢庄点击成功')
                self.robZhuangBtn.visible = false
            }
        }))
        Pai.send({ GrabMasterRequest: {} })
    }
    // 准备
    _prototype.readyBtnClick = function () {
        var self = this
        self.readyBtn.visible = false
        Pai.addHandle(new Pai.Handler('RoundReadyResponse ', function (msg, key) {
            var res = msg[key]
            if (res.Status == 1) {
                self.p1.getChildByName('readyFlag').visible = true
            }
        }))
        Pai.send({ RoundReadyRequest: {} })
    }

    // 丢筛子
    _prototype.throwBallBtnClick = function () {
        this.throwBallBtn.visible = false
        Pai.addHandle(new Pai.Handler('ThrowDiceResponse', function (msg, key) {
            var res = msg[key]
            if (res.Status == 1) {
                console.log('丢筛子成功')
            }
        }))
        Pai.send({ ThrowDiceRequest: {} })
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
                }, 1000)
            }, Math.random() * 500 + 500)
        }, Math.random() * 500 + 500)
    }

    return DajiuBoard;
})(ui.dajiu.dajiuBoardUI);