
var RuleView = (function (_super) {
    _super.uiView = Pai.filterImgAddVersion(_super.uiView)
    function Rule() {
        Rule.super(this);
        this.closeBtn.on(Laya.Event.CLICK, this, this.closeBtnClick)
        this.shuomingBtn.on(Laya.Event.CLICK, this, this.tabbarClick)
        this.daxiaoBtn.on(Laya.Event.CLICK, this, this.tabbarClick)
        this.changciBtn.on(Laya.Event.CLICK, this, this.tabbarClick)
        this.shuomingBtn.tag = 1
        this.daxiaoBtn.tag = 2
        this.changciBtn.tag = 3
        this.shuomingList.vScrollBarSkin = ''
        this.daxiaoList.vScrollBarSkin = ''
        this.changciList.vScrollBarSkin = ''
    }
    Laya.class(Rule, 'Rule', _super);
    var _prototype = Rule.prototype
    // 初始化
    _prototype.init = function () {
        var arr1 = []
        for (var i = 0; i < 21; i++) {
            arr1.push({
                img: { skin: 'comp/loaded/rule/shuoming/' + (i + 1) + '.png' }
            });
        }
        var arr2 = []
        for (var i = 0; i < 6; i++) {
            arr2.push({
                img: { skin: 'comp/loaded/rule/daxiao/' + (i + 1) + '.png' }
            });
        }
        var arr3 = []
        for (var i = 0; i < 4; i++) {
            arr3.push({
                img: { skin: 'comp/loaded/rule/' + (i + 1) + '.png' }
            });
        }
        this.shuomingList.dataSource = arr1;
        this.daxiaoList.dataSource = arr2;
        this.changciList.dataSource = arr3;
    }
    // list渲染
    _prototype.onRuleListRender = function (arr, cell, index) {

    }
    // tabbar点击
    _prototype.tabbarClick = function (ele) {
        var btn = ele.target
        btn.selected = true
        if (btn.tag == 1) {
            this.daxiaoBtn.selected = false
            this.shuomingList.visible = true
            this.daxiaoList.visible = false
            this.changciList.visible = false
            this.changciBtn.selected = false
        }
        if (btn.tag == 2) {
            this.shuomingBtn.selected = false
            this.shuomingList.visible = false
            this.changciBtn.selected = false
            this.changciList.visible = false
            this.daxiaoList.visible = true
        }
        if (btn.tag == 3) {
            this.shuomingBtn.selected = false
            this.shuomingList.visible = false
            this.daxiaoBtn.selected = false
            this.daxiaoList.visible = false
            this.changciList.visible = true
        }
    }
    // 关闭窗口
    _prototype.closeBtnClick = function () {
        this.close()
    }
    return Rule;
})(ui.loaded.ruleUI);
