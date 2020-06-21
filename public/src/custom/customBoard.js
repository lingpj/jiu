var CustomBoardView = (function (_super) {
    _super.uiView = Pai.filterImgAddVersion(_super.uiView)
    function CustomBoard() {
        CustomBoard.super(this);

        this.ballArr = []
        this.zhuangID = -1
        this.currentChip = 1000000
        this.gamingPlayerArr = []
        this.sendPaiOrder = []
        this.tempArr = []
        this.animatePath = "../bin/res/ball/1.json";
        this.throwBallBtn.on(Laya.Event.CLICK, this, this.throwBallBtnClick)
        this.readyBtn.on(Laya.Event.CLICK, this, this.readyBtnClick)
        this.exitBtn.on(Laya.Event.CLICK, this, this.exitBtnClick)
        this.xipaiBtn.on(Laya.Event.CLICK, this, this.xipaiBtnClick)
        this.becomeMaster._childs[0].on(Laya.Event.CLICK, this, this.becomeMasterBtnClick)
        this.becomeMaster._childs[1].on(Laya.Event.CLICK, this, this.giveUpMasterBtnClick)
        this.goOnMaster._childs[0].on(Laya.Event.CLICK, this, this.becomeMasterBtnClick)
        this.goOnMaster._childs[1].on(Laya.Event.CLICK, this, this.giveUpMasterBtnClick)
        this.setBtn.on(Laya.Event.CLICK, this, this.setBtnClick)
        this.safeBoxBtn.on(Laya.Event.CLICK, this, this.safeBoxBtnClick)
        this.tableArr = [this.table1, this.table2, this.table3, this.table4, this.table5, this.table6]
        this.playerArr = [this.p1, this.p2, this.p3, this.p4]
        this.init()
    }
    Laya.class(CustomBoard, 'CustomBoard', _super);
    var _prototype = CustomBoard.prototype
    // 初始化
    _prototype.init = function () {
        var self = this
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
            c.skin = 'comp/4renchang/' + c.tag + '.png?v=' + Pai.version
            c.on(Laya.Event.CLICK, this, this.chipClick, [c])
        }
        self.currentChip = Pai.round.ChipLevels[0]
        self.showCardHistory()

        self.updateRoomNumber()

        var headImg = decodeURIComponent(Pai.selfUserInfo.AvatarUrl)
        if (Pai.selfUserInfo.AvatarUrl) {
            this.p1.skin = headImg
        } else {
            this.p1.skin = '../bin/comp/loaded/' + Pai.selfUserInfo.AvatarId + '.png?v=' + Pai.version
        }
        this.p1.getChildByName('money').text = Pai.formatMoney(Pai.selfUserInfo.Coin)
        this.registNotis()

        initShare(Pai.createRoomNumber)
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
            var res = msg[key]
            console.log('可以准备', res)
            if (res.Renew == true) self.showCardHistory()
            self.readyBtn.visible = true
            self.xipaiBtn.visible = false

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
            if (Pai.soundAllowPlay == 1) Laya.SoundManager.playSound('../bin/res/sound/开始下注.mp3', 1, new Laya.Handler(this, function () { }))
            Pai.alertView.show('开始下注')
            Pai.clockView.show(15, [670, 320])
            self.xiazhuFlag.visible = true
            self.freeFlag.visible = false
            if (self.p1.getChildByName('zhuangFlag').visible == false) {
                self.chipBox.visible = true
            }
            for (var i = 0; i < self.tableArr.length; i++) { self.tableArr[i].mouseEnabled = true }
        }))
        // 询问是否继续坐庄：
        Pai.addHandle(new Pai.Handler('GiveUpMasterBroadcast', function (msg, key) {
            var res = msg[key]
            console.log('是否坐庄', res)
            if (self.p1.getChildByName('zhuangFlag').visible == true) {
                self.goOnMaster.visible = true
            } else {
                self.becomeMaster.visible = true
            }
        }))
        // 房间解散
        Pai.addHandle(new Pai.Handler('DismissRoundBroadcast', function (msg, key) {
            var res = msg[key]
            Pai.alertView.show('房间解散')
            Pai.createRoomNumber = ''

            if (Pai.wxObjInfo.OpenId) {
                //initShare('')
            }
            self.destroyChildren()
            self.removeSelf()
            self = null
            Pai.clockView.removeSelf()
            if (!Pai.loadedView) Pai.loadedView = new LoadedView()
            Laya.stage.addChild(Pai.loadedView)
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
                    self.p1.getChildByName('money').text = Pai.formatMoney(res.RestCoin)
                    Pai.selfUserInfo.Coin = res.RestCoin
                    for (var j = 0; j < self.tableArr.length; j++) {
                        var t = self.tableArr[j]
                        if (res.Direction == t.tag) {
                            self.showAllTableMoney(res.AllPlayerCoinMap)
                            self.showUserTableMoney(res.CurrentPlayerCoinMap)
                            var chip = self.createChip(t, self.p1, res.Coin)
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
                    }
                }
            } else {
                layer.msg(res.Msg)
            }
        }))
        // 开始抢庄
        Pai.addHandle(new Pai.Handler('GrabMasterBroadcast', function (msg, key) {
            var res = msg[key]
            Pai.alertView.show('开始抢庄')
            if (Pai.soundAllowPlay == 1) Laya.SoundManager.playSound('../bin/res/sound/开始游戏.m4a', 1, new Laya.Handler(this, function () { }))
            self.freeFlag.visible = false
        }))
        // 抢庄结果
        Pai.addHandle(new Pai.Handler('GrabMasterResultBroadcast', function (msg, key) {
            var res = msg[key]
            console.log('抢庄结果', res)
            self.becomeMaster.visible = false
            self.goOnMaster.visible = false

            if (res.Status == 1) {
                self.zhuangID = res.PlayerId
                if (res.PlayerId == Pai.selfUserInfo.Id) {
                    self.p1.getChildByName('zhuangFlag').visible = true
                    self.p1.getChildByName('ringFlag').visible = true
                    return
                }
                var arr = Pai.round.PlayerInfo.filter(function (p) {
                    if (p.Id != Pai.selfUserInfo.Id) {
                        return p
                    }
                })
                for (var i = 0; i < arr.length; i++) {
                    var p = arr[i]
                    if (res.PlayerId == p.Id) {
                        var player = self.playerArr[i + 1]
                        player.getChildByName('zhuangFlag').visible = true
                        player.getChildByName('ringFlag').visible = true
                        break
                    }
                }
            }
        }))
        // 开始丢筛子
        Pai.addHandle(new Pai.Handler('ThrowDiceBroadcast', function (msg, key) {
            var res = msg[key]
            console.log('开始丢筛子', res)
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
        // 洗牌
        Pai.addHandle(new Pai.Handler('ShuffleBroadcast', function (msg, key) {
            var res = msg[key]
            Pai.alertView.show('洗牌')
            // setTimeout(function () {
            self.xipaiBtn.visible = true
            setTimeout(function () {
                self.xipaiBtn.visible = false
            }, 4000);
            // }, 00);
        }))
        // 洗牌成功
        Pai.addHandle(new Pai.Handler('ShuffleResultBroadcast', function (msg, key) {
            var res = msg[key]
            if (res.Status == 1) {
                Pai.alertView.show('洗牌成功')
                self.washSuccess = true
                self.showCardHistory()
            } else {
                Pai.alertView.show(res.Msg)
            }
        }))
        // 用户准备
        Pai.addHandle(new Pai.Handler('RoundReadyResultBroadcast', function (msg, key) {
            var res = msg[key]
            console.log('有人准备 ', res)
            if (res.PlayerId == Pai.selfUserInfo.Id) {

                self.p1.getChildByName('readyFlag').visible = true
                self.readyBtn.visible = false
                return
            }
            var arr = Pai.round.PlayerInfo.filter(function (p) {
                if (p.Id != Pai.selfUserInfo.Id) {
                    return p
                }
            })
            for (var i = 0; i < arr.length; i++) {
                var p = arr[i]
                if (p.Id == res.PlayerId) {
                    self.playerArr[i + 1].getChildByName('readyFlag').visible = true
                }
            }
        }))
        // 发牌
        Pai.addHandle(new Pai.Handler('DealCardBroadcast', function (msg, key) {
            var res = msg[key]
            console.log('开始发牌', res)


            self.showCardHistory(res.CardHistory.slice(8), 1)

            self.paiBox.visible = true
            var ss = setTimeout(function () {
                self.bipaiFlag.visible = false
                self.freeFlag.visible = true
                var ss2 = setTimeout(function () {
                    self.freeFlag.visible = false
                }, 5000);
                Pai.clockView.show(5, [670, 320])
                Pai.setTimeoutArr.push(ss2)
            }, 9000)
            Pai.setTimeoutArr.push(ss)
            Pai.clockView.show(9, [670, 320])
            self.bipaiFlag.visible = true
            // 先扣自己的coin
            var obj2 = res.CoinMap
            for (var key in obj2) {
                if (key == Pai.selfUserInfo.Id) {
                    if (Pai.loadedView) {
                        Pai.loadedView.money.text = Pai.formatMoney(obj2[key][1])
                    }
                    Pai.selfUserInfo.Coin = obj2[key][1]
                }
            }
            // 显示牌
            setTimeout(function () {
                for (var i = 0; i < 4; i++) {
                    (function (num) {
                        setTimeout(function () {
                            var arr = self.sendPaiOrder
                            var a = num == 3 ? 5 : num + 1
                            var r = res.CardMap[a + '']
                            for (q = 0; q < 2; q++) {
                                var ani = new Laya.Animation();
                                ani.loadAtlas('../bin/res/act/' + r.Cards[q].Id + '.json'); // 加载图集动画
                                ani.interval = 20;			// 设置播放间隔（单位：毫秒）
                                ani.index = 0; 				// 当前播放索引
                                ani.visible = false
                                ani.pos(-25, -15)
                                self.tempArr[arr[num]].getChildAt(q).addChild(ani)
                                Laya.loader.load('../bin/res/act/' + r.Cards[q].Id + '.json', Laya.Handler.create(self, self.test, [ani, r.Cards[q].Id]), null, Laya.Loader.ATLAS);
                            }
                        }, num * 100)
                    })(self.sendPaiOrder[i])
                }
                setTimeout(function () {
                    for (var i = 0; i < 4; i++) {
                        (function (num) {
                            var arr = self.sendPaiOrder
                            var a = num == 3 ? 5 : num + 1
                            var r = res.CardMap[a + '']
                            var result = res.PointMap[a + '']
                            var box = self.paiBox._childs[num]
                            box.getChildAt(2).skin = '../bin/comp/result/' + result + '.png'
                            box.getChildAt(3).text = res.FormMap[a + '']
                        })(self.sendPaiOrder[i])
                    }
                }, 4000);
                setTimeout(function () {
                    for (var i = 0; i < 4; i++) {
                        (function (num) {
                            setTimeout(function () {
                                var box = self.paiBox._childs[self.sendPaiOrder[num]]
                                for (q = 0; q < 2; q++) {
                                    (function (qq) {
                                        var img = box.getChildAt(qq)
                                        img.getChildAt(0).visible = true
                                        img.getChildAt(0).play()
                                        setTimeout(function () {
                                            img.getChildAt(0).gotoAndStop(18)
                                        }, 400);
                                    })(q)
                                }
                                // var a = num == 3 ? 5 : num + 1
                                // var r = res.CardMap[a + '']
                                // var result = res.PointMap[a + '']
                                // box.getChildAt(2).skin = '../bin/comp/result/' + result + '.png'
                                // box.getChildAt(3).text = res.FormMap[a + '']
                            }, num * 500)
                        })(i)
                    }
                }, 2000);
                // 扣积分
                var obj = res.CoinMap
                setTimeout(function () {
                    for (var key in obj) {
                        if (key == Pai.selfUserInfo.Id) {

                            self.p1.getChildByName('money').text = Pai.formatMoney(obj[key][1])
                            if (Pai.loadedView) {
                                Pai.loadedView.money.text = Pai.formatMoney(obj[key][1])
                            }
                            Pai.selfUserInfo.Coin = obj[key][1]
                            self.number2Img(obj[key][0], self.p1.getChildByName('gradeBox'))
                        }
                        var arr = Pai.round.PlayerInfo.filter(function (p) {
                            if (p.Id != Pai.selfUserInfo.Id) {
                                return p
                            }
                        })
                        for (var i = 0; i < arr.length; i++) {
                            var p = arr[i]
                            if (p.Id == key) {
                                var player = self.playerArr[i + 1]
                                var index2 = player.skin.indexOf('wait')
                                if (index2 > 0) {
                                    player.getChildByName('money').text = ''
                                } else {
                                    player.getChildByName('money').text = Pai.formatMoney(obj[key][1])
                                }
                                self.number2Img(obj[key][0], player.getChildByName('gradeBox'))
                            }
                        }
                    }
                }, 4000)
                // 显示历史记录

                setTimeout(function () {
                    self.showCardHistory(res.CardHistory, 0)
                }, 12000);

                setTimeout(function () {

                    // 隐藏牌
                    self.paiBox.visible = false
                    for (var i = 0; i < self.paiBox._childs.length; i++) {
                        self.paiBox._childs[i].getChildAt(0).skin = '../bin/comp/pai/H.png'
                        self.paiBox._childs[i].getChildAt(1).skin = '../bin/comp/pai/H.png'
                        self.paiBox._childs[i].getChildAt(2).skin = ''
                        self.paiBox._childs[i].getChildAt(3).text = ''
                        self.paiBox._childs[i].x = (self.paiBox.width - self.paiBox._childs[i].width) / 2
                        self.paiBox._childs[i].y = -400
                    }
                    // 扣积分
                    for (var i = 0; i < self.playerArr.length; i++) {
                        var box = self.playerArr[i].getChildByName('gradeBox')
                        box.destroyChildren()
                    }
                    self.resetView()
                }, 8500);
            }, 500);

        }))
        // 下注停止 
        Pai.addHandle(new Pai.Handler('BetStopBroadcast', function (msg, key) {
            var res = msg[key]
            Pai.alertView.show('下注停止')
            if (Pai.soundAllowPlay == 1) Laya.SoundManager.playSound('../bin/res/sound/停止下注.mp3', 1, new Laya.Handler(this, function () { }))
            self.xiazhuFlag.visible = false
            self.chipBox.visible = false
            for (var i = 0; i < self.tableArr.length; i++) { self.tableArr[i].mouseEnabled = false }
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
    // 成为庄家
    _prototype.becomeMasterBtnClick = function () {
        var self = this
        self.becomeMaster.visible = false
        self.goOnMaster.visible = false
        Pai.send({ GrabMasterRequest: {} })
    }
    // 放弃庄家
    _prototype.giveUpMasterBtnClick = function () {
        var self = this
        self.becomeMaster.visible = false
        self.goOnMaster.visible = false
        Pai.send({ GiveUpMasterRequest: {} })
    }
    // 保险箱
    _prototype.safeBoxBtnClick = function () {
        var self = this
        var st = new SafeView()
        st.popup()
    }
    // 更新房间号
    _prototype.updateRoomNumber = function () {

        Pai.createRoomNumber = Pai.round.RoundNumber
        var arr = (Pai.round.RoundNumber + '').split('')
        var tempArr = []
        for (var i = 0; i < arr.length; i++) {
            tempArr.push({
                img: { skin: '../bin/comp/customBoard/number/' + arr[i] + '.png' }
            })
        }
        this.roomNumList.dataSource = tempArr
        console.log(Pai.roomNumber)
    }
    // 洗牌
    _prototype.xipaiBtnClick = function () {
        var self = this
        self.xipaiBtn.visible = false

        Pai.send({ ShuffleRequest: {} })
    }
    // 显示发牌历史记录
    _prototype.showCardHistory = function (dataArr, cardCount) {

        var self = this
        var arr = []
        if (!dataArr) {
            for (var i = 0; i < 32; i++) {
                arr.push({
                    img: { skin: '../bin/comp/pai/H.png' }
                })
            }
        } else if (cardCount == 1) {

            for (var i = 0; i < dataArr.length; i++) {
                arr.push({
                    img: { skin: '../bin/comp/pai/H' + dataArr[i].Id + '.png' }
                })
            }
            for (var i = 0; i < (32 - dataArr.length - 8); i++) {
                arr.push({
                    img: { skin: '../bin/comp/pai/H.png' }
                })
            }
        } else {
            for (var i = 0; i < dataArr.length; i++) {
                arr.push({
                    img: { skin: '../bin/comp/pai/H' + dataArr[i].Id + '.png' }
                })
            }
            for (var i = 0; i < (32 - dataArr.length - (8 * cardCount)); i++) {
                arr.push({
                    img: { skin: '../bin/comp/pai/H.png' }
                })
            }
        }

        self.cardHistoryList.dataSource = arr
    }
    // 更新玩家状态
    _prototype.updatePlayerStatus = function () {
        var self = this
        console.log(self)
        var arr = Pai.round.PlayerInfo.filter(function (p) {
            if (p.Id != Pai.selfUserInfo.Id) {
                return p
            }
        })
        for (var j = 1; j < this.playerArr.length; j++) {
            var player = this.playerArr[j]
            player.skin = 'comp/customBoard/waitbg-game.png'
            player.getChildByName('money').text = ''
        }
        for (var j = 0; j < arr.length; j++) {
            var player = this.playerArr[j + 1]
            var headImg = decodeURIComponent(arr[j].AvatarUrl)
            if (arr[j].AvatarUrl) {
                player.skin = headImg
            } else {
                player.skin = '../bin/comp/loaded/' + arr[j].AvatarId + '.png?v=' + Pai.version
            }
            // player.skin = '../bin/comp/loaded/' + arr[j].AvatarId + '.png'
            player.getChildByName('money').text = Pai.formatMoney(arr[j].Coin)
        }
        self.updateRoomNumber()

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
        self.bipaiFlag.visible = false
        self.xiazhuFlag.visible = false
        self.stopPaiAnimate()
    }
    // 显示桌上总下注
    _prototype.showAllTableMoney = function (allPlayerCoinMap) {
        var self = this
        for (var key in allPlayerCoinMap) {
            var t = self.allMoneySum._childs[key * 1 - 1]
            t.visible = true
            // if (allPlayerCoinMap[key] >= 10000) {
            //     var str = '亿'
            //     allPlayerCoinMap[key] = allPlayerCoinMap[key] / 10000
            // } else {
            //     str = '万'
            // }
            // t.text = '总金额：' + allPlayerCoinMap[key] + str
            t.text = '总金额：' + Pai.formatMoney(allPlayerCoinMap[key])
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
    // 点击筹码
    _prototype.chipClick = function (obj, ev) {
        var ring = this.chipBox.getChildAt(4)
        ring.pos(obj.x - 12, obj.y - 10)
        this.currentChip = obj.tag
    }
    // 退出
    _prototype.exitBtnClick = function (obj, ev) {
        var self = this
        Pai.send({ LeaveRoundRequest: {} })

    }
    // 发牌动画 
    _prototype.sendPaiAnimate = function (random) {
        setTimeout(function () {
            if (Pai.soundAllowPlay == 1) Laya.SoundManager.playSound('../bin/res/sound/开始发牌.mp3', 1, new Laya.Handler(this, function () { }))
        }, 2500);
        var self = this
        self.tempArr = []
        if (random == 0) random = 4
        for (var i = 0; i < self.playerArr.length; i++) {
            if (self.playerArr[i].getChildByName('zhuangFlag').visible == true) {
                var zhuangIndex = i
            }
        }
        var posArr = [{ x: 0, y: 115 }, { x: 176, y: 0 }, { x: 352, y: 115 }, { x: 176, y: 226 }]
        // var p1Arr = [[3, 2, 1, 0], [2, 1, 0, 3], [1, 0, 3, 2], [0, 3, 2, 1]]
        // var p2Arr = [[0, 3, 2, 1], [3, 2, 1, 0], [2, 1, 0, 3], [1, 0, 3, 2]]
        var p3Arr = [[1, 0, 3, 2], [0, 3, 2, 1], [3, 2, 1, 0], [2, 1, 0, 3]]
        // var p4Arr = [[2, 1, 0, 3], [1, 0, 3, 2], [0, 3, 2, 1], [3, 2, 1, 0]]
        // var p5Arr = [[2, 3, 0, 1], [3, 0, 1, 2], [0, 1, 2, 3], [1, 2, 3, 0]]
        // var bigArr = [p1Arr, p2Arr, p3Arr, p4Arr]
        // var arr = bigArr[zhuangIndex]
        var arr = p3Arr[random - 1]
        self.sendPaiOrder = arr
        setTimeout(function () {
            for (var i = 0; i < 4; i++) {
                (function (num) {
                    self.tempArr.push(self.paiBox._childs[arr[num]])
                    Laya.Tween.to(self.paiBox._childs[arr[num]], { x: posArr[arr[num]].x, y: posArr[arr[num]].y }, (num + 1) * 100, Laya.Ease.linearIn, Laya.Handler.create
                        (self, null), num * 300);
                })(i)
            }
        }, 3000);
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
    // 设置按钮
    _prototype.setBtnClick = function () {
        var self = this
        var st = new SetView()
        st.popup()
        st.changeUserBtn.visible = false
    }
    // 有人离开
    _prototype.whoLeave = function (outID) {
        var self = this
        if (outID == Pai.selfUserInfo.Id) {
            Pai.selfUserInfo.RoundId = 0

            if (Pai.wxObjInfo.OpenId) {
                //initShare('')
            }
            Pai.createRoomNumber = ''
            Pai.clearTimeout()
            Pai.clearInterval()
            self.removeSelf()
            self.destroy()
            self = null
            Pai.clockView.removeSelf()
            if (!Pai.loadedView) Pai.loadedView = new LoadedView()
            Pai.loadedView.roundId = 0
            Pai.loadedView.money.text = Pai.formatMoney(Pai.selfUserInfo.Coin)
            Laya.stage.addChild(Pai.loadedView)
            return
        }
        var arr = Pai.round.PlayerInfo.filter(function (p) {
            if (p.Id != Pai.selfUserInfo.Id) {
                return p
            }
        })
        for (var i = 0; i < arr.length; i++) {
            var p = arr[i]
            if (outID == p.Id) {
                var player = self.playerArr[i + 1]
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
    }
    // 准备
    _prototype.readyBtnClick = function () {
        var self = this

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
        var url = "../bin/comp/4renchang/" + chip + '.png?v=' + Pai.version
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


    return CustomBoard;
})(ui.customBoard.customBoardUI);