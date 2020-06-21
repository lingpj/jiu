var CLASS$=Laya.class;
var STATICATTR$=Laya.static;
var View=laya.ui.View;
var Dialog=laya.ui.Dialog;
var alertViewUI=(function(_super){
		function alertViewUI(){
			
		    this.label=null;

			alertViewUI.__super.call(this);
		}

		CLASS$(alertViewUI,'ui.alertViewUI',_super);
		var __proto__=alertViewUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(alertViewUI.uiView);

		}

		alertViewUI.uiView={"type":"View","props":{"width":209,"height":65},"child":[{"type":"Image","props":{"y":0,"x":0,"width":209,"visible":false,"skin":"comp/shop/tip/chenggong.png","height":65}},{"type":"Image","props":{"x":0,"width":209,"visible":false,"skin":"comp/customBoard/waitbg-game.png","height":65}},{"type":"Label","props":{"y":0,"x":0,"wordWrap":true,"width":207,"var":"label","valign":"middle","text":"label","height":61,"fontSize":24,"color":"#fff","bold":true,"align":"center"}}]};
		return alertViewUI;
	})(View);
var clockUI=(function(_super){
		function clockUI(){
			
		    this.label=null;

			clockUI.__super.call(this);
		}

		CLASS$(clockUI,'ui.clockUI',_super);
		var __proto__=clockUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(clockUI.uiView);

		}

		clockUI.uiView={"type":"View","props":{"width":45,"height":45},"child":[{"type":"Image","props":{"width":45,"height":45}},{"type":"Label","props":{"width":45,"var":"label","valign":"middle","text":"21","height":45,"fontSize":26,"color":"#f63737","bold":true,"align":"center"}}]};
		return clockUI;
	})(View);
var customBoardUI=(function(_super){
		function customBoardUI(){
			
		    this.cardHistoryList=null;
		    this.roomNumList=null;
		    this.table1=null;
		    this.table2=null;
		    this.table3=null;
		    this.table4=null;
		    this.table5=null;
		    this.table6=null;
		    this.p1=null;
		    this.p2=null;
		    this.p3=null;
		    this.p4=null;
		    this.exitBtn=null;
		    this.setBtn=null;
		    this.moneyBagBtn=null;
		    this.chipBox=null;
		    this.throwBallBtn=null;
		    this.readyBtn=null;
		    this.allMoneySum=null;
		    this.userMoneySum=null;
		    this.paiBox=null;
		    this.ballBox=null;
		    this.safeBoxBtn=null;
		    this.xipaiBtn=null;
		    this.goOnMaster=null;
		    this.becomeMaster=null;
		    this.xiazhuFlag=null;
		    this.freeFlag=null;
		    this.bipaiFlag=null;

			customBoardUI.__super.call(this);
		}

		CLASS$(customBoardUI,'ui.customBoard.customBoardUI',_super);
		var __proto__=customBoardUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(customBoardUI.uiView);

		}

		customBoardUI.uiView={"type":"View","props":{"width":1136,"height":640},"child":[{"type":"Image","props":{"y":0,"x":0,"width":1136,"skin":"comp/customBoard/juxing.png","height":640}},{"type":"Image","props":{"y":165,"x":727,"width":57,"skin":"comp/customBoard/zhuang.png","height":57}},{"type":"List","props":{"y":160,"x":173,"width":320,"var":"cardHistoryList","height":320},"child":[{"type":"Box","props":{"width":40,"renderType":"render","height":80},"child":[{"type":"Image","props":{"y":0,"x":0,"width":40,"name":"img","height":80}}]}]},{"type":"Image","props":{"y":121,"x":385,"skin":"comp/customBoard/te.png"}},{"type":"List","props":{"y":124,"x":517,"width":210,"var":"roomNumList","height":32},"child":[{"type":"Box","props":{"width":22,"renderType":"render","height":32},"child":[{"type":"Image","props":{"y":0,"x":0,"width":22,"name":"img","height":32}}]}]},{"type":"Image","props":{"y":218,"x":671,"width":156,"var":"table1","skin":"comp/4renchang/tang-2.png","height":108}},{"type":"Image","props":{"y":219,"x":829,"width":173,"var":"table2","skin":"comp/customBoard/dao-1.png","height":137}},{"type":"Image","props":{"y":359,"x":830,"width":176,"var":"table3","skin":"comp/customBoard/daojiao-1.png","height":116}},{"type":"Image","props":{"y":363,"x":672,"width":159,"var":"table4","skin":"comp/4renchang/tianmen2.png","height":116}},{"type":"Image","props":{"y":358,"x":510,"width":160,"var":"table5","skin":"comp/customBoard/shunjiao-1.png","height":122}},{"type":"Image","props":{"y":222,"x":507,"width":164,"var":"table6","skin":"comp/customBoard/shun-1.png","pivotY":2,"pivotX":1,"height":142}},{"type":"Image","props":{"y":363,"x":672,"width":156,"skin":"comp/4renchang/recta.png","height":27}},{"type":"Image","props":{"y":513,"x":354,"width":91,"var":"p1","skin":"comp/customBoard/waitbg-game.png","height":91},"child":[{"type":"Image","props":{"y":-41,"x":-57,"width":184,"visible":false,"skin":"comp/4renchang/grab-frame.png","name":"ringFlag","height":159}},{"type":"Image","props":{"y":98,"x":-4,"skin":"comp/customBoard/goldbg-game.png"}},{"type":"Image","props":{"y":14,"x":-58,"visible":false,"skin":"comp/customBoard/ok-game.png","name":"readyFlag"}},{"type":"Image","props":{"y":-29,"x":65,"visible":false,"skin":"comp/customBoard/villageicon.png","name":"zhuangFlag"}},{"type":"Label","props":{"y":98,"x":17,"width":78,"valign":"middle","name":"money","height":32,"fontSize":16,"color":"#f8e7e7"}},{"type":"Box","props":{"y":59,"x":-303,"width":289,"visible":false,"name":"gradeBox","mouseThrough":true,"height":33}}]},{"type":"Image","props":{"y":284,"x":23,"width":91,"var":"p2","skin":"comp/customBoard/waitbg-game.png","height":91},"child":[{"type":"Image","props":{"y":-41,"x":-57,"width":184,"visible":false,"skin":"comp/4renchang/grab-frame.png","name":"ringFlag","height":159}},{"type":"Image","props":{"y":99,"x":-4,"skin":"comp/customBoard/goldbg-game.png"}},{"type":"Image","props":{"y":17,"x":103,"visible":false,"skin":"comp/customBoard/ok-game.png","name":"readyFlag"}},{"type":"Image","props":{"y":-33,"x":67,"visible":false,"skin":"comp/customBoard/villageicon.png","name":"zhuangFlag"}},{"type":"Label","props":{"y":99,"x":17,"width":78,"valign":"middle","name":"money","height":32,"fontSize":16,"color":"#f8e7e7"}},{"type":"Box","props":{"y":158,"x":-24,"width":289,"visible":false,"name":"gradeBox","mouseThrough":true,"height":29}}]},{"type":"Image","props":{"y":18,"x":748,"width":91,"var":"p3","skin":"comp/customBoard/waitbg-game.png","height":91},"child":[{"type":"Image","props":{"y":-41,"x":-57,"width":184,"visible":false,"skin":"comp/4renchang/grab-frame.png","name":"ringFlag","height":159}},{"type":"Image","props":{"y":97,"x":-4,"skin":"comp/customBoard/goldbg-game.png"}},{"type":"Image","props":{"y":23,"x":-63,"visible":false,"skin":"comp/customBoard/ok-game.png","name":"readyFlag"}},{"type":"Image","props":{"y":-13,"x":71,"visible":false,"skin":"comp/customBoard/villageicon.png","name":"zhuangFlag"}},{"type":"Label","props":{"y":97,"x":17,"width":78,"valign":"middle","name":"money","height":32,"fontSize":16,"color":"#f8e7e7"}},{"type":"Box","props":{"y":55,"x":100,"width":289,"visible":false,"name":"gradeBox","mouseThrough":true,"height":29}}]},{"type":"Image","props":{"y":284,"x":1038,"width":91,"var":"p4","skin":"comp/customBoard/waitbg-game.png","height":91},"child":[{"type":"Image","props":{"y":-41,"x":-57,"width":184,"visible":false,"skin":"comp/4renchang/grab-frame.png","name":"ringFlag","height":159}},{"type":"Image","props":{"y":102,"x":-4,"skin":"comp/customBoard/goldbg-game.png"}},{"type":"Image","props":{"y":17,"x":-60,"visible":false,"skin":"comp/customBoard/ok-game.png","name":"readyFlag"}},{"type":"Image","props":{"y":-37,"x":61,"visible":false,"skin":"comp/customBoard/villageicon.png","name":"zhuangFlag"}},{"type":"Label","props":{"y":102,"x":17,"width":78,"valign":"middle","name":"money","height":32,"fontSize":16,"color":"#f8e7e7"}},{"type":"Box","props":{"y":169,"x":-160,"width":289,"visible":false,"name":"gradeBox","mouseThrough":true,"height":29}}]},{"type":"Image","props":{"y":10,"x":10,"var":"exitBtn","skin":"comp/customBoard/drop-game.png"}},{"type":"Image","props":{"y":10,"x":1070,"var":"setBtn","skin":"comp/customBoard/set-game.png"}},{"type":"Image","props":{"y":10,"x":944,"var":"moneyBagBtn","skin":"comp/customBoard/recharge-game.png"}},{"type":"Image","props":{"y":513,"x":486,"width":372,"visible":false,"var":"chipBox","height":112},"child":[{"type":"Image","props":{"y":19,"x":23,"width":80,"skin":"comp/4renchang/1.png","height":80}},{"type":"Image","props":{"y":19,"x":113,"width":80,"skin":"comp/4renchang/10.png","height":80}},{"type":"Image","props":{"y":19,"x":203,"width":80,"skin":"comp/4renchang/100.png","height":80}},{"type":"Image","props":{"y":19,"x":293,"width":80,"skin":"comp/4renchang/1000.png","height":80}},{"type":"Image","props":{"y":11,"x":11,"width":104,"skin":"comp/4renchang/xuanzhong.png","height":97}}]},{"type":"Image","props":{"y":518,"x":506,"visible":false,"var":"throwBallBtn","skin":"comp/customBoard/throwingbutton.png"}},{"type":"Image","props":{"y":515,"x":507,"visible":false,"var":"readyBtn","skin":"comp/customBoard/readybutton-game.png"}},{"type":"Box","props":{"y":216,"x":522,"width":481,"visible":true,"var":"allMoneySum","mouseThrough":true,"height":245},"child":[{"type":"Label","props":{"y":5,"x":2,"width":148,"visible":false,"valign":"middle","text":"11111111","mouseThrough":true,"height":37,"fontSize":20,"color":"#fff","align":"center"}},{"type":"Label","props":{"y":7,"x":157,"width":138,"visible":false,"valign":"middle","text":"11111111","mouseThrough":true,"height":34,"fontSize":20,"color":"#fff","align":"center"}},{"type":"Label","props":{"y":8,"x":299,"width":143,"visible":false,"valign":"middle","text":"11111111","mouseThrough":true,"height":32,"fontSize":20,"color":"#fff","align":"center"}},{"type":"Label","props":{"y":143,"x":303,"width":171,"visible":false,"valign":"middle","text":"11111111","mouseThrough":true,"height":31,"fontSize":20,"color":"#fff","align":"center"}},{"type":"Label","props":{"y":148,"x":138,"width":173,"visible":false,"valign":"middle","text":"11111111","mouseThrough":true,"height":28,"fontSize":20,"color":"#fff","align":"center"}},{"type":"Label","props":{"y":142,"x":-6,"width":157,"visible":false,"valign":"middle","text":"11111111","mouseThrough":true,"height":34,"fontSize":20,"color":"#fff","align":"center"}}]},{"type":"Box","props":{"y":301,"x":532,"width":464,"var":"userMoneySum","mouseThrough":true,"height":154},"child":[{"type":"Image","props":{"y":23,"x":4,"width":98,"visible":false,"skin":"comp/4renchang/xiazhuangbg.png","mouseThrough":true,"height":33},"child":[{"type":"Label","props":{"y":0,"x":0,"width":99,"valign":"middle","mouseThrough":true,"height":33,"fontSize":20,"color":"#fff","align":"center"}}]},{"type":"Image","props":{"y":-11,"x":174,"width":102,"visible":false,"skin":"comp/4renchang/xiazhuangbg.png","mouseThrough":true,"height":31},"child":[{"type":"Label","props":{"y":0,"x":0,"width":105,"valign":"middle","mouseThrough":true,"height":32,"fontSize":20,"color":"#fff","align":"center"}}]},{"type":"Image","props":{"y":21,"x":335,"width":106,"visible":false,"skin":"comp/4renchang/xiazhuangbg.png","mouseThrough":true,"height":32},"child":[{"type":"Label","props":{"y":0,"x":0,"width":103,"valign":"middle","mouseThrough":true,"height":31,"fontSize":20,"color":"#fff","align":"center"}}]},{"type":"Image","props":{"y":142,"x":341,"width":96,"visible":false,"skin":"comp/4renchang/xiazhuangbg.png","mouseThrough":true,"height":33},"child":[{"type":"Label","props":{"y":0,"x":0,"width":101,"valign":"middle","mouseThrough":true,"height":36,"fontSize":20,"color":"#fff","align":"center"}}]},{"type":"Image","props":{"y":142,"x":176,"width":98,"visible":false,"skin":"comp/4renchang/xiazhuangbg.png","mouseThrough":true,"height":33},"child":[{"type":"Label","props":{"y":0,"x":0,"width":97,"valign":"middle","mouseThrough":true,"height":34,"fontSize":20,"color":"#fff","align":"center"}}]},{"type":"Image","props":{"y":141,"x":4,"width":101,"visible":false,"skin":"comp/4renchang/xiazhuangbg.png","mouseThrough":true,"height":35},"child":[{"type":"Label","props":{"y":0,"x":0,"width":103,"valign":"middle","mouseThrough":true,"height":39,"fontSize":20,"color":"#fff","align":"center"}}]}]},{"type":"Box","props":{"y":191,"x":508,"width":497,"visible":false,"var":"paiBox","height":330},"child":[{"type":"Box","props":{"y":-352,"x":212,"name":"4"},"child":[{"type":"Image","props":{"width":65,"skin":"comp/pai/H.png","height":100}},{"type":"Image","props":{"x":80,"width":65,"skin":"comp/pai/H.png","height":100}},{"type":"Image","props":{"y":13,"x":45,"width":54,"visible":false,"height":74}},{"type":"Label","props":{"y":98,"x":3,"width":136,"height":38,"fontSize":40,"font":"SimSun","color":"#eaea17","bold":true,"align":"center"}}]},{"type":"Box","props":{"y":-346,"x":209,"name":"3"},"child":[{"type":"Image","props":{"width":65,"skin":"comp/pai/H.png","height":100}},{"type":"Image","props":{"x":80,"width":65,"skin":"comp/pai/H.png","height":100}},{"type":"Image","props":{"y":-32,"x":45,"width":54,"visible":false,"height":74}},{"type":"Label","props":{"y":98,"x":8,"width":136,"height":38,"fontSize":40,"font":"SimSun","color":"#eaea17","bold":true,"align":"center"}}]},{"type":"Box","props":{"y":-350,"x":211,"name":"2"},"child":[{"type":"Image","props":{"width":65,"skin":"comp/pai/H.png","height":100}},{"type":"Image","props":{"x":80,"width":65,"skin":"comp/pai/H.png","height":100}},{"type":"Image","props":{"y":13,"x":45,"width":54,"visible":false,"height":74}},{"type":"Label","props":{"y":97,"x":7,"width":136,"height":38,"fontSize":40,"font":"SimSun","color":"#eaea17","bold":true,"align":"center"}}]},{"type":"Box","props":{"y":-354,"x":207,"name":"1"},"child":[{"type":"Image","props":{"width":65,"skin":"comp/pai/H.png","height":100}},{"type":"Image","props":{"x":80,"width":65,"skin":"comp/pai/H.png","height":100}},{"type":"Image","props":{"y":56,"x":45,"width":54,"visible":false,"height":74}},{"type":"Label","props":{"y":96,"x":7,"width":136,"height":38,"fontSize":40,"font":"SimSun","color":"#eaea17","bold":true,"align":"center"}}]}]},{"type":"Image","props":{"y":226,"x":585,"width":341,"visible":false,"var":"ballBox","height":249}},{"type":"Image","props":{"y":477,"x":2,"var":"safeBoxBtn","skin":"comp/customBoard/safe-game.png"}},{"type":"Image","props":{"y":537,"x":720,"width":179,"visible":false,"var":"xipaiBtn","skin":"comp/customBoard/xipai2.png","height":75}},{"type":"Box","props":{"y":529,"x":487,"visible":false,"var":"goOnMaster"},"child":[{"type":"Image","props":{"skin":"comp/customBoard/jixuzuozhuang.png"}},{"type":"Image","props":{"x":205,"skin":"comp/customBoard/lijixiazhuang.png"}}]},{"type":"Box","props":{"y":525,"x":486,"visible":false,"var":"becomeMaster"},"child":[{"type":"Image","props":{"y":1,"x":0,"skin":"comp/customBoard/lijishangzhuang.png"}},{"type":"Image","props":{"y":0,"x":208,"skin":"comp/customBoard/bushangzhuang.png"}}]},{"type":"Image","props":{"y":330,"x":715,"width":113,"visible":false,"var":"xiazhuFlag","skin":"comp/hundred/xiazhu.png","height":29}},{"type":"Image","props":{"y":330,"x":718,"width":113,"visible":false,"var":"freeFlag","skin":"comp/hundred/kongxian.png","height":29}},{"type":"Image","props":{"y":330,"x":717,"width":113,"visible":false,"var":"bipaiFlag","skin":"comp/hundred/bipai.png","height":29}}]};
		return customBoardUI;
	})(View);
var dajiuBoardUI=(function(_super){
		function dajiuBoardUI(){
			
		    this.chipClickBoard=null;
		    this.table6=null;
		    this.table1=null;
		    this.table2=null;
		    this.table3=null;
		    this.table5=null;
		    this.table4=null;
		    this.cardHistoryList=null;
		    this.p1=null;
		    this.p2=null;
		    this.p3=null;
		    this.p4=null;
		    this.exitBtn=null;
		    this.setBtn=null;
		    this.moneyBagBtn=null;
		    this.chipBox=null;
		    this.robZhuangBtn=null;
		    this.throwBallBtn=null;
		    this.readyBtn=null;
		    this.allMoneySum=null;
		    this.userMoneySum=null;
		    this.allTableSum=null;
		    this.ballBox=null;
		    this.paiBox=null;
		    this.zuheBtn=null;
		    this.paiBox2=null;
		    this.paiBoxxx=null;
		    this.paiBoxx=null;
		    this.paiBoxxxx=null;
		    this.freeFlag=null;
		    this.xiazhuFlag=null;
		    this.bipaiFlag=null;
		    this.peipaiFlag=null;

			dajiuBoardUI.__super.call(this);
		}

		CLASS$(dajiuBoardUI,'ui.dajiu.dajiuBoardUI',_super);
		var __proto__=dajiuBoardUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(dajiuBoardUI.uiView);

		}

		dajiuBoardUI.uiView={"type":"View","props":{"width":1136,"height":640},"child":[{"type":"Image","props":{"y":-2,"x":0,"width":1136,"skin":"comp/datianjiu2/datianjiu.png","height":640}},{"type":"Image","props":{"y":86,"x":62,"width":1027,"var":"chipClickBoard","skin":"comp/datianjiu2/zhong.png","mouseEnabled":false,"height":454,"alpha":0}},{"type":"Image","props":{"y":138,"x":347,"width":459,"var":"table6","skin":"comp/datianjiu2/zhong.png","height":77}},{"type":"Image","props":{"y":138,"x":352,"width":457,"var":"table1","skin":"comp/datianjiu2/zhong.png","height":77}},{"type":"Image","props":{"y":138,"x":358,"width":446,"var":"table2","skin":"comp/datianjiu2/zhong.png","height":77}},{"type":"Image","props":{"y":140,"x":354,"width":449,"var":"table3","skin":"comp/datianjiu2/zhong.png","height":77}},{"type":"Image","props":{"y":136,"x":349,"width":461,"var":"table5","skin":"comp/datianjiu2/zhong.png","height":77}},{"type":"Image","props":{"y":138,"x":350,"width":451,"var":"table4","skin":"comp/datianjiu2/zhong.png","height":77}},{"type":"List","props":{"y":212,"x":442,"width":320,"var":"cardHistoryList","mouseThrough":true,"height":320},"child":[{"type":"Box","props":{"width":40,"renderType":"render","height":80},"child":[{"type":"Image","props":{"y":0,"x":0,"width":40,"name":"img","height":80}}]}]},{"type":"Image","props":{"y":501,"x":344,"width":91,"var":"p1","skin":"comp/customBoard/waitbg-game.png","height":91},"child":[{"type":"Image","props":{"y":-41,"x":-57,"width":184,"visible":false,"skin":"comp/4renchang/grab-frame.png","name":"ringFlag","height":159}},{"type":"Image","props":{"y":98,"x":-4,"skin":"comp/customBoard/goldbg-game.png"}},{"type":"Image","props":{"y":14,"x":-58,"visible":false,"skin":"comp/customBoard/ok-game.png","name":"readyFlag"}},{"type":"Image","props":{"y":-29,"x":65,"visible":false,"skin":"comp/customBoard/villageicon.png","name":"zhuangFlag"}},{"type":"Label","props":{"y":98,"x":17,"width":78,"valign":"middle","name":"money","height":32,"fontSize":16,"color":"#f8e7e7"}},{"type":"Box","props":{"y":66,"x":-301,"width":289,"visible":false,"name":"gradeBox","mouseThrough":true,"height":29}}]},{"type":"Image","props":{"y":272,"x":13,"width":91,"var":"p2","skin":"comp/customBoard/waitbg-game.png","height":91},"child":[{"type":"Image","props":{"y":-41,"x":-57,"width":184,"visible":false,"skin":"comp/4renchang/grab-frame.png","name":"ringFlag","height":159}},{"type":"Image","props":{"y":99,"x":-4,"skin":"comp/customBoard/goldbg-game.png"}},{"type":"Image","props":{"y":17,"x":103,"visible":false,"skin":"comp/customBoard/ok-game.png","name":"readyFlag"}},{"type":"Image","props":{"y":-33,"x":67,"visible":false,"skin":"comp/customBoard/villageicon.png","name":"zhuangFlag"}},{"type":"Label","props":{"y":99,"x":17,"width":78,"valign":"middle","name":"money","height":32,"fontSize":16,"color":"#f8e7e7"}},{"type":"Box","props":{"y":128,"x":-13,"width":289,"visible":false,"name":"gradeBox","mouseThrough":true,"height":29}}]},{"type":"Image","props":{"y":6,"x":738,"width":91,"var":"p3","skin":"comp/customBoard/waitbg-game.png","height":91},"child":[{"type":"Image","props":{"y":-41,"x":-57,"width":184,"visible":false,"skin":"comp/4renchang/grab-frame.png","name":"ringFlag","height":159}},{"type":"Image","props":{"y":97,"x":-4,"skin":"comp/customBoard/goldbg-game.png"}},{"type":"Image","props":{"y":23,"x":-63,"visible":false,"skin":"comp/customBoard/ok-game.png","name":"readyFlag"}},{"type":"Image","props":{"y":-13,"x":71,"visible":false,"skin":"comp/customBoard/villageicon.png","name":"zhuangFlag"}},{"type":"Label","props":{"y":97,"x":17,"width":78,"valign":"middle","name":"money","height":32,"fontSize":16,"color":"#f8e7e7"}},{"type":"Box","props":{"y":60,"x":101,"width":289,"visible":false,"name":"gradeBox","mouseThrough":true,"height":29}}]},{"type":"Image","props":{"y":272,"x":1028,"width":91,"var":"p4","skin":"comp/customBoard/waitbg-game.png","height":91},"child":[{"type":"Image","props":{"y":-41,"x":-57,"width":184,"visible":false,"skin":"comp/4renchang/grab-frame.png","name":"ringFlag","height":159}},{"type":"Image","props":{"y":102,"x":-4,"skin":"comp/customBoard/goldbg-game.png"}},{"type":"Image","props":{"y":-76,"x":21,"visible":false,"skin":"comp/customBoard/ok-game.png","name":"readyFlag"}},{"type":"Image","props":{"y":-37,"x":61,"visible":false,"skin":"comp/customBoard/villageicon.png","name":"zhuangFlag"}},{"type":"Label","props":{"y":102,"x":17,"width":78,"valign":"middle","name":"money","height":32,"fontSize":16,"color":"#f8e7e7"}},{"type":"Box","props":{"y":136,"x":-175,"width":289,"visible":false,"name":"gradeBox","mouseThrough":true,"height":29}}]},{"type":"Image","props":{"y":-2,"x":0,"var":"exitBtn","skin":"comp/customBoard/drop-game.png"}},{"type":"Image","props":{"y":-2,"x":1060,"var":"setBtn","skin":"comp/customBoard/set-game.png"}},{"type":"Image","props":{"y":-2,"x":934,"var":"moneyBagBtn","skin":"comp/customBoard/recharge-game.png"}},{"type":"Image","props":{"y":501,"x":476,"width":458,"visible":false,"var":"chipBox","skin":"comp/4renchang/bg.png","height":112},"child":[{"type":"Image","props":{"y":19,"x":23,"width":80,"skin":"comp/4renchang/1000.png","height":80}},{"type":"Image","props":{"y":17,"x":111,"width":80,"skin":"comp/4renchang/10000.png","height":80}},{"type":"Image","props":{"y":17,"x":195,"width":80,"skin":"comp/4renchang/100000.png","height":80}},{"type":"Image","props":{"y":17,"x":279,"width":80,"skin":"comp/4renchang/1000000.png","height":80}},{"type":"Image","props":{"y":17,"x":364,"width":80,"skin":"comp/4renchang/10000000.png","height":80}},{"type":"Image","props":{"y":9,"x":12,"width":104,"skin":"comp/4renchang/xuanzhong.png","height":97}}]},{"type":"Image","props":{"y":503,"x":493,"visible":false,"var":"robZhuangBtn","skin":"comp/4renchang/grabbutton.png"}},{"type":"Image","props":{"y":506,"x":496,"visible":false,"var":"throwBallBtn","skin":"comp/customBoard/throwingbutton.png"}},{"type":"Image","props":{"y":503,"x":497,"visible":false,"var":"readyBtn","skin":"comp/customBoard/readybutton-game.png"}},{"type":"Box","props":{"y":224,"x":0,"width":154,"visible":true,"var":"allMoneySum","mouseThrough":true,"height":48},"child":[{"type":"Label","props":{"y":0,"x":0,"width":129,"visible":false,"valign":"middle","mouseThrough":true,"height":45,"fontSize":20,"color":"#fff","align":"center"}},{"type":"Label","props":{"y":0,"x":0,"width":154,"visible":false,"valign":"middle","mouseThrough":true,"height":45,"fontSize":20,"color":"#fff","align":"center"}},{"type":"Label","props":{"y":0,"x":0,"width":137,"visible":false,"valign":"middle","mouseThrough":true,"height":45,"fontSize":20,"color":"#fff","align":"center"}},{"type":"Label","props":{"y":0,"x":0,"width":157,"visible":false,"valign":"middle","mouseThrough":true,"height":45,"fontSize":20,"color":"#fff","align":"center"}},{"type":"Label","props":{"y":0,"x":0,"width":164,"visible":false,"valign":"middle","mouseThrough":true,"height":45,"fontSize":20,"color":"#fff","align":"center"}},{"type":"Label","props":{"y":0,"x":0,"width":160,"visible":false,"valign":"middle","mouseThrough":true,"height":45,"fontSize":20,"color":"#fff","align":"center"}}]},{"type":"Box","props":{"y":450,"x":328,"width":198,"var":"userMoneySum","mouseThrough":true,"height":42},"child":[{"type":"Image","props":{"y":3,"x":0,"width":122,"visible":false,"skin":"comp/4renchang/xiazhuangbg.png","mouseThrough":true,"height":39},"child":[{"type":"Label","props":{"width":122,"valign":"middle","mouseThrough":true,"height":39,"fontSize":20,"color":"#fff","align":"center"}}]},{"type":"Image","props":{"y":3,"x":0,"width":122,"visible":false,"skin":"comp/4renchang/xiazhuangbg.png","mouseThrough":true,"height":39},"child":[{"type":"Label","props":{"width":122,"valign":"middle","mouseThrough":true,"height":39,"fontSize":20,"color":"#fff","align":"center"}}]},{"type":"Image","props":{"y":3,"x":0,"width":122,"visible":false,"skin":"comp/4renchang/xiazhuangbg.png","mouseThrough":true,"height":39},"child":[{"type":"Label","props":{"width":122,"valign":"middle","mouseThrough":true,"height":39,"fontSize":20,"color":"#fff","align":"center"}}]},{"type":"Image","props":{"y":3,"x":0,"width":122,"visible":false,"skin":"comp/4renchang/xiazhuangbg.png","mouseThrough":true,"height":39},"child":[{"type":"Label","props":{"width":122,"valign":"middle","mouseThrough":true,"height":39,"fontSize":20,"color":"#fff","align":"center"}}]},{"type":"Image","props":{"y":3,"x":0,"width":122,"visible":false,"skin":"comp/4renchang/xiazhuangbg.png","mouseThrough":true,"height":39},"child":[{"type":"Label","props":{"width":122,"valign":"middle","mouseThrough":true,"height":39,"fontSize":20,"color":"#fff","align":"center"}}]},{"type":"Image","props":{"y":3,"x":0,"width":122,"visible":false,"skin":"comp/4renchang/xiazhuangbg.png","mouseThrough":true,"height":39},"child":[{"type":"Label","props":{"width":122,"valign":"middle","mouseThrough":true,"height":39,"fontSize":20,"color":"#fff","align":"center"}}]}]},{"type":"Image","props":{"y":154,"x":479,"width":213,"visible":false,"var":"allTableSum","skin":"comp/customBoard/waitbg-game.png","height":43},"child":[{"type":"Label","props":{"y":0,"x":0,"width":208,"valign":"middle","height":43,"fontSize":26,"color":"#fff","align":"center"}}]},{"type":"Image","props":{"y":154,"x":421,"width":316,"visible":false,"var":"ballBox","height":293}},{"type":"Box","props":{"y":-120,"x":428,"var":"paiBox"},"child":[{"type":"Image","props":{"y":0,"skin":"comp/pai/H.png"}},{"type":"Image","props":{"y":0,"x":68,"skin":"comp/pai/H.png"}},{"type":"Image","props":{"y":0,"x":135,"skin":"comp/pai/H.png"}},{"type":"Image","props":{"y":0,"x":202,"skin":"comp/pai/H.png"}}]},{"type":"Image","props":{"y":506,"x":779,"visible":false,"var":"zuheBtn","skin":"comp/queding.png"}},{"type":"Box","props":{"y":202,"x":587,"width":364,"visible":false,"var":"paiBox2","height":277},"child":[{"type":"Box","props":{"y":-95,"x":-600},"child":[{"type":"Image","props":{"skin":"comp/pai/H.png"}},{"type":"Image","props":{"x":68,"skin":"comp/pai/H.png"}},{"type":"Image","props":{"y":-8,"x":135,"width":95,"skin":"comp/pai/H.png","height":67}},{"type":"Image","props":{"y":52,"x":134,"width":95,"skin":"comp/pai/H.png","height":67}},{"type":"Image","props":{"y":101,"x":106,"width":54,"visible":false,"height":74}},{"type":"Label","props":{"y":115,"x":1,"width":237,"height":38,"fontSize":40,"font":"SimSun","color":"#eaea17","bold":true,"align":"center"}}]},{"type":"Box","props":{"y":-188,"x":-120},"child":[{"type":"Image","props":{"skin":"comp/pai/H.png"}},{"type":"Image","props":{"x":68,"skin":"comp/pai/H.png"}},{"type":"Image","props":{"y":-16,"x":133,"width":95,"skin":"comp/pai/H.png","height":67}},{"type":"Image","props":{"y":42,"x":133,"width":95,"skin":"comp/pai/H.png","height":67}},{"type":"Image","props":{"y":101,"x":106,"width":54,"visible":false,"height":74}},{"type":"Label","props":{"y":30,"x":-206,"width":247,"height":38,"fontSize":40,"font":"SimSun","color":"#eaea17","bold":true,"align":"center"}}]},{"type":"Box","props":{"y":-95,"x":316},"child":[{"type":"Image","props":{"skin":"comp/pai/H.png"}},{"type":"Image","props":{"x":68,"skin":"comp/pai/H.png"}},{"type":"Image","props":{"y":-15,"x":136,"width":95,"skin":"comp/pai/H.png","height":67}},{"type":"Image","props":{"y":44,"x":138,"width":95,"skin":"comp/pai/H.png","height":67}},{"type":"Image","props":{"y":101,"x":106,"width":54,"visible":false,"height":74}},{"type":"Label","props":{"y":101,"x":2,"width":232,"height":38,"fontSize":40,"font":"SimSun","color":"#eaea17","bold":true,"align":"center"}}]},{"type":"Box","props":{"y":256,"x":-133},"child":[{"type":"Image","props":{"skin":"comp/pai/H.png"}},{"type":"Image","props":{"x":68,"skin":"comp/pai/H.png"}},{"type":"Image","props":{"y":-15,"x":135,"width":95,"skin":"comp/pai/H.png","height":67}},{"type":"Image","props":{"y":47,"x":135,"width":95,"skin":"comp/pai/H.png","height":67}},{"type":"Image","props":{"y":101,"x":106,"width":54,"visible":false,"height":74}},{"type":"Label","props":{"y":123,"x":-3,"width":243,"height":38,"fontSize":40,"font":"SimSun","color":"#eaea17","bold":true,"align":"center"}}]}]},{"type":"Box","props":{"y":-117,"x":422,"var":"paiBoxxx"},"child":[{"type":"Image","props":{"y":0,"skin":"comp/pai/H.png"}},{"type":"Image","props":{"y":0,"x":68,"skin":"comp/pai/H.png"}},{"type":"Image","props":{"y":0,"x":135,"skin":"comp/pai/H.png"}},{"type":"Image","props":{"y":0,"x":202,"skin":"comp/pai/H.png"}}]},{"type":"Box","props":{"y":-304,"x":519,"var":"paiBoxx"},"child":[{"type":"Image","props":{"skin":"comp/pai/S.png"}},{"type":"Image","props":{"y":60,"skin":"comp/pai/S.png"}},{"type":"Image","props":{"y":126,"skin":"comp/pai/S.png"}},{"type":"Image","props":{"y":187,"skin":"comp/pai/S.png"}}]},{"type":"Box","props":{"y":-279,"x":520,"var":"paiBoxxxx"},"child":[{"type":"Image","props":{"skin":"comp/pai/S.png"}},{"type":"Image","props":{"y":60,"skin":"comp/pai/S.png"}},{"type":"Image","props":{"y":126,"skin":"comp/pai/S.png"}},{"type":"Image","props":{"y":187,"skin":"comp/pai/S.png"}}]},{"type":"Image","props":{"y":250,"x":302,"visible":false,"var":"freeFlag","skin":"comp/hundred/kongxian.png"}},{"type":"Image","props":{"y":250,"x":302,"visible":false,"var":"xiazhuFlag","skin":"comp/hundred/xiazhu.png"}},{"type":"Image","props":{"y":251,"x":302,"visible":false,"var":"bipaiFlag","skin":"comp/hundred/bipai.png"}},{"type":"Image","props":{"y":250,"x":302,"visible":false,"var":"peipaiFlag","skin":"comp/hundred/peipaishijian.png"}}]};
		return dajiuBoardUI;
	})(View);
var fourBoardUI=(function(_super){
		function fourBoardUI(){
			
		    this.table1=null;
		    this.table2=null;
		    this.table3=null;
		    this.table4=null;
		    this.table5=null;
		    this.table6=null;
		    this.p1=null;
		    this.p2=null;
		    this.p3=null;
		    this.p4=null;
		    this.exitBtn=null;
		    this.setBtn=null;
		    this.moneyBagBtn=null;
		    this.chipBox=null;
		    this.robZhuangBtn=null;
		    this.throwBallBtn=null;
		    this.readyBtn=null;
		    this.allMoneySum=null;
		    this.userMoneySum=null;
		    this.paiBox=null;
		    this.ballBox=null;
		    this.freeFlag=null;
		    this.xiazhuFlag=null;
		    this.bipaiFlag=null;

			fourBoardUI.__super.call(this);
		}

		CLASS$(fourBoardUI,'ui.four.fourBoardUI',_super);
		var __proto__=fourBoardUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(fourBoardUI.uiView);

		}

		fourBoardUI.uiView={"type":"View","props":{"width":1136,"height":640},"child":[{"type":"Image","props":{"y":0,"x":0,"width":1136,"skin":"comp/4renchang/gamebg.png","height":640}},{"type":"Image","props":{"y":160,"x":485,"width":223,"var":"table1","skin":"comp/4renchang/tang-2.png","height":142}},{"type":"Image","props":{"y":160,"x":702,"width":243,"var":"table2","skin":"comp/4renchang/dao-2.png","height":181}},{"type":"Image","props":{"y":341,"x":702,"width":245,"var":"table3","skin":"comp/4renchang/daojiao-2.png","height":145}},{"type":"Image","props":{"y":345,"x":485,"width":222,"var":"table4","skin":"comp/4renchang/tianmen2.png","height":143}},{"type":"Image","props":{"y":343,"x":211,"width":275,"var":"table5","skin":"comp/4renchang/shunjiao-2.png","height":145}},{"type":"Image","props":{"y":164,"x":214,"width":275,"var":"table6","skin":"comp/4renchang/shun-2.png","pivotY":2,"pivotX":1,"height":185}},{"type":"Image","props":{"y":104,"x":558,"width":59,"skin":"comp/customBoard/zhuang.png","height":59}},{"type":"Image","props":{"y":347,"x":488,"width":216,"skin":"comp/4renchang/recta.png","height":42}},{"type":"Image","props":{"y":503,"x":344,"width":91,"var":"p1","skin":"comp/customBoard/waitbg-game.png","height":91},"child":[{"type":"Image","props":{"y":-41,"x":-57,"width":184,"visible":false,"skin":"comp/4renchang/grab-frame.png","name":"ringFlag","height":159}},{"type":"Image","props":{"y":98,"x":-4,"skin":"comp/customBoard/goldbg-game.png"}},{"type":"Image","props":{"y":14,"x":-58,"visible":false,"skin":"comp/customBoard/ok-game.png","name":"readyFlag"}},{"type":"Image","props":{"y":-29,"x":65,"visible":false,"skin":"comp/customBoard/villageicon.png","name":"zhuangFlag"}},{"type":"Label","props":{"y":98,"x":17,"width":78,"valign":"middle","name":"money","height":32,"fontSize":16,"color":"#f8e7e7"}},{"type":"Box","props":{"y":97,"x":-255,"width":289,"visible":false,"name":"gradeBox","mouseThrough":true,"height":29}}]},{"type":"Image","props":{"y":274,"x":13,"width":91,"var":"p2","skin":"comp/customBoard/waitbg-game.png","height":91},"child":[{"type":"Image","props":{"y":-41,"x":-57,"width":184,"visible":false,"skin":"comp/4renchang/grab-frame.png","name":"ringFlag","height":159}},{"type":"Image","props":{"y":99,"x":-4,"skin":"comp/customBoard/goldbg-game.png"}},{"type":"Image","props":{"y":17,"x":103,"visible":false,"skin":"comp/customBoard/ok-game.png","name":"readyFlag"}},{"type":"Image","props":{"y":-33,"x":67,"visible":false,"skin":"comp/customBoard/villageicon.png","name":"zhuangFlag"}},{"type":"Label","props":{"y":99,"x":17,"width":78,"valign":"middle","name":"money","height":32,"fontSize":16,"color":"#f8e7e7"}},{"type":"Box","props":{"y":126,"x":-6,"width":289,"name":"gradeBox","mouseThrough":true,"height":29}}]},{"type":"Image","props":{"y":8,"x":738,"width":91,"var":"p3","skin":"comp/customBoard/waitbg-game.png","height":91},"child":[{"type":"Image","props":{"y":-41,"x":-57,"width":184,"visible":false,"skin":"comp/4renchang/grab-frame.png","name":"ringFlag","height":159}},{"type":"Image","props":{"y":97,"x":-4,"skin":"comp/customBoard/goldbg-game.png"}},{"type":"Image","props":{"y":23,"x":-63,"visible":false,"skin":"comp/customBoard/ok-game.png","name":"readyFlag"}},{"type":"Image","props":{"y":-13,"x":71,"visible":false,"skin":"comp/customBoard/villageicon.png","name":"zhuangFlag"}},{"type":"Label","props":{"y":97,"x":17,"width":78,"valign":"middle","name":"money","height":32,"fontSize":16,"color":"#f8e7e7"}},{"type":"Box","props":{"y":43,"x":71,"width":289,"name":"gradeBox","mouseThrough":true,"height":29}}]},{"type":"Image","props":{"y":274,"x":1028,"width":91,"var":"p4","skin":"comp/customBoard/waitbg-game.png","height":91},"child":[{"type":"Image","props":{"y":-41,"x":-57,"width":184,"visible":false,"skin":"comp/4renchang/grab-frame.png","name":"ringFlag","height":159}},{"type":"Image","props":{"y":102,"x":-4,"skin":"comp/customBoard/goldbg-game.png"}},{"type":"Image","props":{"y":17,"x":-60,"visible":false,"skin":"comp/customBoard/ok-game.png","name":"readyFlag"}},{"type":"Image","props":{"y":-37,"x":61,"visible":false,"skin":"comp/customBoard/villageicon.png","name":"zhuangFlag"}},{"type":"Label","props":{"y":102,"x":17,"width":78,"valign":"middle","name":"money","height":32,"fontSize":16,"color":"#f8e7e7"}},{"type":"Box","props":{"y":129,"x":-151,"width":289,"name":"gradeBox","mouseThrough":true,"height":29}}]},{"type":"Image","props":{"y":0,"x":0,"var":"exitBtn","skin":"comp/customBoard/drop-game.png"}},{"type":"Image","props":{"y":0,"x":1060,"var":"setBtn","skin":"comp/customBoard/set-game.png"}},{"type":"Image","props":{"y":0,"x":934,"var":"moneyBagBtn","skin":"comp/customBoard/recharge-game.png"}},{"type":"Image","props":{"y":503,"x":476,"width":439,"visible":false,"var":"chipBox","height":112},"child":[{"type":"Image","props":{"y":18,"x":12,"width":80,"skin":"comp/4renchang/1.png","height":80}},{"type":"Image","props":{"y":18,"x":95,"width":80,"skin":"comp/4renchang/10.png","height":80}},{"type":"Image","props":{"y":18,"x":178,"width":80,"skin":"comp/4renchang/100.png","height":80}},{"type":"Image","props":{"y":18,"x":261,"width":80,"skin":"comp/4renchang/1000.png","height":80}},{"type":"Image","props":{"y":8,"width":104,"skin":"comp/4renchang/xuanzhong.png","height":97}}]},{"type":"Image","props":{"y":505,"x":493,"visible":false,"var":"robZhuangBtn","skin":"comp/4renchang/grabbutton.png"}},{"type":"Image","props":{"y":519,"x":496,"visible":false,"var":"throwBallBtn","skin":"comp/customBoard/throwingbutton.png"}},{"type":"Image","props":{"y":517,"x":495,"visible":false,"var":"readyBtn","skin":"comp/customBoard/readybutton-game.png"}},{"type":"Box","props":{"y":162,"x":216,"visible":true,"var":"allMoneySum","mouseThrough":true},"child":[{"type":"Label","props":{"x":54,"width":219,"visible":false,"valign":"middle","text":"11111111","mouseThrough":true,"height":45,"fontSize":20,"color":"#fff","align":"center"}},{"type":"Label","props":{"x":265,"width":219,"visible":false,"valign":"middle","text":"11111111","mouseThrough":true,"height":45,"fontSize":20,"color":"#fff","align":"center"}},{"type":"Label","props":{"x":483,"width":219,"visible":false,"valign":"middle","text":"11111111","mouseThrough":true,"height":45,"fontSize":20,"color":"#fff","align":"center"}},{"type":"Label","props":{"y":174,"x":496,"width":219,"visible":false,"valign":"middle","text":"11111111","mouseThrough":true,"height":45,"fontSize":20,"color":"#fff","align":"center"}},{"type":"Label","props":{"y":177,"x":268,"width":219,"visible":false,"valign":"middle","text":"11111111","mouseThrough":true,"height":43,"fontSize":20,"color":"#fff","align":"center"}},{"type":"Label","props":{"y":175,"width":272,"visible":false,"valign":"middle","text":"11111111","mouseThrough":true,"height":45,"fontSize":20,"color":"#fff","align":"center"}}]},{"type":"Box","props":{"y":248,"x":302,"var":"userMoneySum","mouseThrough":true},"child":[{"type":"Image","props":{"x":1,"width":122,"visible":false,"skin":"comp/4renchang/xiazhuangbg.png","mouseThrough":true,"height":39},"child":[{"type":"Label","props":{"width":122,"valign":"middle","mouseThrough":true,"height":39,"fontSize":20,"color":"#fff","align":"center"}}]},{"type":"Image","props":{"x":234,"width":122,"visible":false,"skin":"comp/4renchang/xiazhuangbg.png","mouseThrough":true,"height":39},"child":[{"type":"Label","props":{"width":122,"valign":"middle","mouseThrough":true,"height":39,"fontSize":20,"color":"#fff","align":"center"}}]},{"type":"Image","props":{"x":455,"width":122,"visible":false,"skin":"comp/4renchang/xiazhuangbg.png","mouseThrough":true,"height":39},"child":[{"type":"Label","props":{"width":122,"valign":"middle","mouseThrough":true,"height":39,"fontSize":20,"color":"#fff","align":"center"}}]},{"type":"Image","props":{"y":154,"x":461,"width":122,"visible":false,"skin":"comp/4renchang/xiazhuangbg.png","mouseThrough":true,"height":39},"child":[{"type":"Label","props":{"width":122,"valign":"middle","mouseThrough":true,"height":39,"fontSize":20,"color":"#fff","align":"center"}}]},{"type":"Image","props":{"y":154,"x":234,"width":122,"visible":false,"skin":"comp/4renchang/xiazhuangbg.png","mouseThrough":true,"height":39},"child":[{"type":"Label","props":{"width":122,"valign":"middle","mouseThrough":true,"height":39,"fontSize":20,"color":"#fff","align":"center"}}]},{"type":"Image","props":{"y":154,"width":122,"visible":false,"skin":"comp/4renchang/xiazhuangbg.png","mouseThrough":true,"height":39},"child":[{"type":"Label","props":{"width":122,"valign":"middle","mouseThrough":true,"height":39,"fontSize":20,"color":"#fff","align":"center"}}]}]},{"type":"Box","props":{"y":118,"x":298,"width":564,"visible":true,"var":"paiBox","height":364},"child":[{"type":"Box","props":{"y":-261,"x":217,"name":"4"},"child":[{"type":"Image","props":{"width":65,"skin":"comp/pai/H.png","height":100}},{"type":"Image","props":{"x":80,"width":65,"skin":"comp/pai/H.png","height":100}},{"type":"Image","props":{"y":13,"x":45,"width":54,"visible":false,"height":74}},{"type":"Label","props":{"y":98,"x":3,"width":136,"height":38,"fontSize":40,"font":"SimSun","color":"#eaea17","bold":true,"align":"center"}}]},{"type":"Box","props":{"y":-255,"x":214,"name":"3"},"child":[{"type":"Image","props":{"width":65,"skin":"comp/pai/H.png","height":100}},{"type":"Image","props":{"x":80,"width":65,"skin":"comp/pai/H.png","height":100}},{"type":"Image","props":{"y":-32,"x":45,"width":54,"visible":false,"height":74}},{"type":"Label","props":{"y":98,"x":8,"width":136,"height":38,"fontSize":40,"font":"SimSun","color":"#eaea17","bold":true,"align":"center"}}]},{"type":"Box","props":{"y":-259,"x":216,"name":"2"},"child":[{"type":"Image","props":{"width":65,"skin":"comp/pai/H.png","height":100}},{"type":"Image","props":{"x":80,"width":65,"skin":"comp/pai/H.png","height":100}},{"type":"Image","props":{"y":13,"x":45,"width":54,"visible":false,"height":74}},{"type":"Label","props":{"y":97,"x":7,"width":136,"height":38,"fontSize":40,"font":"SimSun","color":"#eaea17","bold":true,"align":"center"}}]},{"type":"Box","props":{"y":-263,"x":212,"name":"1"},"child":[{"type":"Image","props":{"width":65,"skin":"comp/pai/H.png","height":100}},{"type":"Image","props":{"x":80,"width":65,"skin":"comp/pai/H.png","height":100}},{"type":"Image","props":{"y":56,"x":45,"width":54,"visible":false,"height":74}},{"type":"Label","props":{"y":96,"x":7,"width":136,"height":38,"fontSize":40,"font":"SimSun","color":"#eaea17","bold":true,"align":"center"}}]}]},{"type":"Image","props":{"y":144,"x":414,"width":355,"visible":false,"var":"ballBox","height":355}},{"type":"Image","props":{"y":305,"x":561,"visible":false,"var":"freeFlag","skin":"comp/hundred/kongxian.png"}},{"type":"Image","props":{"y":304,"x":558,"visible":false,"var":"xiazhuFlag","skin":"comp/hundred/xiazhu.png"}},{"type":"Image","props":{"y":307,"x":561,"visible":false,"var":"bipaiFlag","skin":"comp/hundred/bipai.png"}}]};
		return fourBoardUI;
	})(View);
var hundredBoardUI=(function(_super){
		function hundredBoardUI(){
			
		    this.my=null;
		    this.onlineBtn=null;
		    this.paiListBtn=null;
		    this.begZhuangBtn=null;
		    this.exitBtn=null;
		    this.setBtn=null;
		    this.master=null;
		    this.p1=null;
		    this.p2=null;
		    this.p3=null;
		    this.p4=null;
		    this.chipBox=null;
		    this.table6=null;
		    this.table1=null;
		    this.table2=null;
		    this.table3=null;
		    this.table4=null;
		    this.table5=null;
		    this.allMoneySum=null;
		    this.userMoneySum=null;
		    this.paiBox=null;
		    this.trendBox=null;
		    this.xiaZhuangBtn=null;
		    this.throwBallBtn=null;
		    this.roomStatus=null;
		    this.ballBox=null;
		    this.shangZhuangBtn=null;

			hundredBoardUI.__super.call(this);
		}

		CLASS$(hundredBoardUI,'ui.hundred.hundredBoardUI',_super);
		var __proto__=hundredBoardUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(hundredBoardUI.uiView);

		}

		hundredBoardUI.uiView={"type":"View","props":{"width":1136,"height":640},"child":[{"type":"Image","props":{"y":0,"x":0,"width":1136,"skin":"comp/hundred2/bg.png","height":640}},{"type":"Image","props":{"y":0,"x":171,"skin":"comp/hundred2/top.png"}},{"type":"Image","props":{"y":551,"x":0,"width":1118,"skin":"comp/hundred/xiabar.png","height":89}},{"type":"Image","props":{"y":566,"x":149,"width":182,"var":"my","skin":"comp/hundred/xinxibg.png","height":78},"child":[{"type":"Label","props":{"y":0,"x":0,"width":181,"valign":"middle","text":"label","overflow":"hidden","name":"name","height":31,"fontSize":20,"color":"#fff","bold":true,"align":"center"}},{"type":"Label","props":{"y":31,"x":5,"width":181,"valign":"middle","text":"6666","overflow":"hidden","name":"money","height":33,"fontSize":20,"color":"#fff","bold":false,"align":"center"}},{"type":"Box","props":{"y":-41,"x":85,"width":289,"visible":false,"name":"gradeBox","mouseThrough":true,"height":29}}]},{"type":"Image","props":{"y":13,"x":2,"var":"onlineBtn","skin":"comp/hundred/haoyou.png"},"child":[{"type":"Image","props":{"y":-6,"x":52,"width":36,"visible":false,"skin":"comp/hundred/renshubg.png","height":36}},{"type":"Label","props":{"y":-6,"x":52,"width":36,"visible":false,"valign":"middle","text":"66","height":36,"fontSize":16,"color":"#fff","align":"center"}}]},{"type":"Image","props":{"y":431,"x":1041,"var":"paiListBtn","skin":"comp/hundred/jilu.png"}},{"type":"Image","props":{"y":8,"x":693,"width":173,"visible":false,"var":"begZhuangBtn","skin":"comp/hundred/shangzhuang.png","height":71}},{"type":"Image","props":{"y":2,"x":127,"width":239,"visible":false,"skin":"comp/hundred/zoushi.png","height":85}},{"type":"Image","props":{"y":483,"x":-1,"var":"exitBtn","skin":"comp/customBoard/drop-game.png"}},{"type":"Image","props":{"y":5,"x":922,"skin":"comp/customBoard/recharge-game.png"}},{"type":"Image","props":{"y":6,"x":1024,"var":"setBtn","skin":"comp/customBoard/set-game.png"}},{"type":"Image","props":{"y":1,"x":376,"width":82,"var":"master","skin":"comp/hundred/touxiang.png","height":82},"child":[{"type":"Image","props":{"y":-1,"x":100,"width":184,"skin":"comp/hundred/xinxibg.png","height":90}},{"type":"Label","props":{"y":-1,"x":100,"width":181,"valign":"middle","text":"系统坐庄","overflow":"hidden","name":"name","height":41,"fontSize":20,"color":"#fff","bold":true,"align":"center"}},{"type":"Image","props":{"y":-2,"x":-25,"width":43,"skin":"comp/hundred/zhuang.png","height":42}},{"type":"Label","props":{"y":35,"x":138,"wordWrap":false,"width":143,"valign":"middle","text":"99","overflow":"hidden","name":"money","height":33,"fontSize":20,"color":"#fff","bold":false,"align":"center"}},{"type":"Box","props":{"y":46,"x":-231,"width":289,"visible":false,"name":"gradeBox","mouseThrough":true,"height":33}}]},{"type":"Image","props":{"y":284,"x":9,"width":100,"var":"p1","skin":"comp/customBoard/waitbg-game.png","height":100},"child":[{"type":"Image","props":{"y":93,"x":0,"skin":"comp/customBoard/goldbg-game.png"}},{"type":"Label","props":{"y":93,"x":20,"width":77,"valign":"middle","name":"money","height":32,"fontSize":16,"color":"#fff","align":"center"}},{"type":"Box","props":{"y":120,"x":-6,"width":289,"visible":false,"name":"gradeBox","mouseThrough":true,"height":29}}]},{"type":"Image","props":{"y":134,"x":9,"width":100,"var":"p2","skin":"comp/customBoard/waitbg-game.png","height":100},"child":[{"type":"Image","props":{"y":93,"x":0,"skin":"comp/customBoard/goldbg-game.png"}},{"type":"Label","props":{"y":93,"x":20,"width":77,"valign":"middle","name":"money","height":32,"fontSize":16,"color":"#fff","align":"center"}},{"type":"Box","props":{"y":-33,"x":-3,"width":289,"visible":false,"name":"gradeBox","mouseThrough":true,"height":29}}]},{"type":"Image","props":{"y":134,"x":1025,"width":100,"var":"p3","skin":"comp/customBoard/waitbg-game.png","height":100},"child":[{"type":"Image","props":{"y":93,"x":0,"skin":"comp/customBoard/goldbg-game.png"}},{"type":"Label","props":{"y":93,"x":20,"width":77,"valign":"middle","name":"money","height":32,"fontSize":16,"color":"#fff","align":"center"}},{"type":"Box","props":{"y":-29,"x":-176,"width":289,"visible":false,"name":"gradeBox","mouseThrough":true,"height":29}}]},{"type":"Image","props":{"y":284,"x":1025,"width":100,"var":"p4","skin":"comp/customBoard/waitbg-game.png","height":100},"child":[{"type":"Image","props":{"y":93,"x":0,"skin":"comp/customBoard/goldbg-game.png"}},{"type":"Label","props":{"y":93,"x":20,"width":77,"valign":"middle","name":"money","height":32,"fontSize":16,"color":"#fff","align":"center"}},{"type":"Box","props":{"y":119,"x":-160,"width":289,"visible":false,"name":"gradeBox","mouseThrough":true,"height":29}}]},{"type":"Box","props":{"y":564,"x":372,"width":637,"var":"chipBox","height":75},"child":[{"type":"Image","props":{"y":7,"x":-5,"width":70,"skin":"comp/4renchang/1.png","height":70},"child":[{"type":"Image","props":{"y":-9,"x":-8,"width":85,"skin":"comp/hundred/xuanzhong.png","height":83}}]},{"type":"Image","props":{"y":7,"x":183,"width":70,"skin":"comp/4renchang/10.png","height":70},"child":[{"type":"Image","props":{"y":-9,"x":-8,"width":85,"visible":false,"skin":"comp/hundred/xuanzhong.png","height":83}}]},{"type":"Image","props":{"y":7,"x":358,"width":70,"skin":"comp/4renchang/100.png","height":70},"child":[{"type":"Image","props":{"y":-9,"x":-8,"width":85,"visible":false,"skin":"comp/hundred/xuanzhong.png","height":83}}]},{"type":"Image","props":{"y":7,"x":537,"width":70,"skin":"comp/4renchang/1000.png","height":70},"child":[{"type":"Image","props":{"y":-9,"x":-8,"width":85,"visible":false,"skin":"comp/hundred/xuanzhong.png","height":83}}]}]},{"type":"Image","props":{"y":127,"x":150,"width":291,"var":"table6","skin":"comp/hundred2/shun1.png","height":214}},{"type":"Image","props":{"y":128,"x":439,"width":261,"var":"table1","skin":"comp/hundred2/tang.png","height":145}},{"type":"Image","props":{"y":127,"x":696,"width":267,"var":"table2","skin":"comp/hundred2/dao1.png","height":210}},{"type":"Image","props":{"y":334,"x":692,"width":271,"var":"table3","skin":"comp/hundred2/dao2.png","height":166}},{"type":"Image","props":{"y":338,"x":440,"width":253,"var":"table4","skin":"comp/hundred/矩形-6-拷贝.png","height":162}},{"type":"Image","props":{"y":339,"x":150,"width":291,"var":"table5","skin":"comp/hundred2/shun2.png","height":161}},{"type":"Image","props":{"y":337,"x":439,"width":254,"skin":"comp/hundred/矩形-6-拷贝_77.png","height":51}},{"type":"Image","props":{"y":404,"x":521,"skin":"comp/hundred/天门.png"}},{"type":"Box","props":{"y":172,"x":226,"visible":true,"var":"allMoneySum","mouseThrough":true},"child":[{"type":"Label","props":{"y":-42,"x":-1,"width":205,"visible":false,"valign":"middle","text":"11111111","mouseThrough":true,"height":48,"fontSize":20,"color":"#fff","align":"center"}},{"type":"Label","props":{"y":-44,"x":204,"width":262,"visible":false,"valign":"middle","text":"11111111","mouseThrough":true,"height":47,"fontSize":20,"color":"#fff","align":"center"}},{"type":"Label","props":{"y":-41,"x":469,"width":209,"visible":false,"valign":"middle","text":"11111111","mouseThrough":true,"height":47,"fontSize":20,"color":"#fff","align":"center"}},{"type":"Label","props":{"y":167,"x":473,"width":253,"visible":false,"valign":"middle","text":"11111111","mouseThrough":true,"height":49,"fontSize":20,"color":"#fff","align":"center"}},{"type":"Label","props":{"y":170,"x":207,"width":270,"visible":false,"valign":"middle","text":"11111111","mouseThrough":true,"height":43,"fontSize":20,"color":"#fff","align":"center"}},{"type":"Label","props":{"y":169,"x":-60,"width":272,"visible":false,"valign":"middle","text":"11111111","mouseThrough":true,"height":45,"fontSize":20,"color":"#fff","align":"center"}}]},{"type":"Box","props":{"y":222,"x":247,"width":650,"var":"userMoneySum","mouseThrough":true,"height":183},"child":[{"type":"Image","props":{"y":16,"x":-4,"width":122,"visible":false,"skin":"comp/hundred/xiazhubg.png","mouseThrough":true,"height":39},"child":[{"type":"Label","props":{"width":122,"valign":"middle","mouseThrough":true,"height":39,"fontSize":20,"color":"#ffcc00","align":"center"}}]},{"type":"Image","props":{"y":-12,"x":254,"width":122,"visible":false,"skin":"comp/hundred/xiazhubg.png","mouseThrough":true,"height":39},"child":[{"type":"Label","props":{"width":122,"valign":"middle","mouseThrough":true,"height":39,"fontSize":20,"color":"#ffcc00","align":"center"}}]},{"type":"Image","props":{"y":17,"x":520,"width":122,"visible":false,"skin":"comp/hundred/xiazhubg.png","mouseThrough":true,"height":39},"child":[{"type":"Label","props":{"width":122,"valign":"middle","mouseThrough":true,"height":39,"fontSize":20,"color":"#ffcc00","align":"center"}}]},{"type":"Image","props":{"y":219,"x":520,"width":122,"visible":false,"skin":"comp/hundred/xiazhubg.png","mouseThrough":true,"height":39},"child":[{"type":"Label","props":{"width":122,"valign":"middle","mouseThrough":true,"height":39,"fontSize":20,"color":"#ffcc00","align":"center"}}]},{"type":"Image","props":{"y":218,"x":254,"width":122,"visible":false,"skin":"comp/hundred/xiazhubg.png","mouseThrough":true,"height":39},"child":[{"type":"Label","props":{"width":122,"valign":"middle","mouseThrough":true,"height":39,"fontSize":20,"color":"#ffcc00","align":"center"}}]},{"type":"Image","props":{"y":218,"x":-4,"width":122,"visible":false,"skin":"comp/hundred/xiazhubg.png","mouseThrough":true,"height":39},"child":[{"type":"Label","props":{"width":122,"valign":"middle","mouseThrough":true,"height":39,"fontSize":20,"color":"#ffcc00","align":"center"}}]}]},{"type":"Box","props":{"y":153,"x":279,"width":577,"visible":true,"var":"paiBox","height":334},"child":[{"type":"Box","props":{"y":-250,"x":209},"child":[{"type":"Image","props":{"width":65,"skin":"comp/pai/H.png","height":100}},{"type":"Image","props":{"x":80,"width":65,"skin":"comp/pai/H.png","height":100}},{"type":"Image","props":{"y":-32,"x":45,"width":54,"visible":false,"height":74}},{"type":"Label","props":{"y":62,"x":-136,"width":136,"visible":false,"height":38,"fontSize":40,"font":"SimSun","color":"#f1f136","bold":true,"align":"center"}}]},{"type":"Box","props":{"y":-266,"x":210},"child":[{"type":"Image","props":{"width":65,"skin":"comp/pai/H.png","height":100}},{"type":"Image","props":{"x":80,"width":65,"skin":"comp/pai/H.png","height":100}},{"type":"Image","props":{"y":13,"x":45,"width":54,"visible":false,"height":74}},{"type":"Label","props":{"y":62,"x":-136,"width":136,"visible":false,"height":38,"fontSize":40,"font":"SimSun","color":"#f1f136","bold":true,"align":"center"}}]},{"type":"Box","props":{"y":-261,"x":208,"width":145,"height":112},"child":[{"type":"Image","props":{"width":65,"skin":"comp/pai/H.png","height":100}},{"type":"Image","props":{"x":80,"width":65,"skin":"comp/pai/H.png","height":100}},{"type":"Image","props":{"y":56,"x":45,"width":54,"visible":false,"height":74}},{"type":"Label","props":{"y":74,"x":-136,"width":136,"visible":false,"height":38,"fontSize":40,"font":"SimSun","color":"#f1f136","bold":true,"align":"center"}}]},{"type":"Box","props":{"y":-258,"x":206},"child":[{"type":"Image","props":{"width":65,"skin":"comp/pai/H.png","height":100}},{"type":"Image","props":{"x":80,"width":65,"skin":"comp/pai/H.png","height":100}},{"type":"Image","props":{"y":13,"x":45,"width":54,"visible":false,"height":74}},{"type":"Label","props":{"y":62,"x":-136,"width":136,"visible":false,"height":38,"fontSize":40,"font":"SimSun","color":"#f1f136","bold":true,"align":"center"}}]}]},{"type":"Box","props":{"y":6,"x":201,"visible":false,"var":"trendBox"},"child":[{"type":"Box","props":{"x":1,"width":159,"height":22}},{"type":"Box","props":{"y":24,"x":1,"width":159,"height":22}},{"type":"Box","props":{"y":47,"width":159,"height":22}}]},{"type":"Image","props":{"y":474,"x":498,"width":128,"visible":false,"var":"xiaZhuangBtn","skin":"comp/customBoard/lijixiazhuang.png","height":58}},{"type":"Image","props":{"y":487,"x":330,"width":146,"visible":false,"var":"throwBallBtn","skin":"comp/customBoard/throwingbutton.png","height":66}},{"type":"Box","props":{"y":285,"x":529,"var":"roomStatus"},"child":[{"type":"Image","props":{"x":1,"visible":false,"skin":"comp/hundred/kongxian.png","name":"freeFlag"}},{"type":"Image","props":{"y":2,"x":1,"visible":false,"skin":"comp/hundred/xiazhu.png","name":"xiazhuFlag"}},{"type":"Image","props":{"y":1,"x":1,"visible":false,"skin":"comp/hundred/bipai.png","name":"bipaiFlag"}},{"type":"Image","props":{"x":2,"visible":false,"skin":"comp/hundred/diushaiFlag.png","name":"diushaiFlag"}},{"type":"Image","props":{"x":1,"visible":false,"skin":"comp/hundred/qiangzhuangFlag.png","name":"qiangzhuangFlag"}},{"type":"Image","props":{"visible":false,"skin":"comp/hundred/zhunbeiFlag.png","name":"zhunbeiFlag"}}]},{"type":"Image","props":{"y":158,"x":406,"width":324,"visible":false,"var":"ballBox","height":324}},{"type":"Image","props":{"y":474,"x":673,"width":128,"visible":false,"var":"shangZhuangBtn","skin":"comp/customBoard/lijishangzhuang.png","height":58}}]};
		return hundredBoardUI;
	})(View);
var paiListUI=(function(_super){
		function paiListUI(){
			
		    this.closeBtn=null;
		    this.list=null;

			paiListUI.__super.call(this);
		}

		CLASS$(paiListUI,'ui.hundred.paiListUI',_super);
		var __proto__=paiListUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(paiListUI.uiView);

		}

		paiListUI.uiView={"type":"Dialog","props":{"width":1136,"height":640},"child":[{"type":"Image","props":{"y":56,"x":180,"skin":"comp/hundred/playerList/wanjiatanchuang.png"}},{"type":"Image","props":{"y":99,"x":912,"var":"closeBtn","skin":"comp/hundred/playerList/shut.png"}},{"type":"List","props":{"y":230,"x":226,"width":703,"var":"list","height":323},"child":[{"type":"Box","props":{"y":15,"x":22,"width":167,"renderType":"render","height":100},"child":[{"type":"Image","props":{"y":0,"x":9,"width":64,"name":"one","height":100}},{"type":"Image","props":{"y":0,"x":87,"width":64,"name":"two","height":100}}]}]},{"type":"Label","props":{"y":168,"x":273,"width":115,"text":"庄","height":50,"fontSize":50,"color":"#f6ecec","align":"center"}},{"type":"Label","props":{"y":168,"x":438,"width":115,"text":"顺门","height":50,"fontSize":50,"color":"#f6ecec","align":"center"}},{"type":"Label","props":{"y":168,"x":604,"width":115,"text":"天门","height":50,"fontSize":50,"color":"#f6ecec","align":"center"}},{"type":"Label","props":{"y":168,"x":772,"width":115,"text":"倒门","height":50,"fontSize":50,"color":"#f6ecec","align":"center"}}]};
		return paiListUI;
	})(Dialog);
var playerListUI=(function(_super){
		function playerListUI(){
			
		    this.closeBtn=null;
		    this.list=null;

			playerListUI.__super.call(this);
		}

		CLASS$(playerListUI,'ui.hundred.playerListUI',_super);
		var __proto__=playerListUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(playerListUI.uiView);

		}

		playerListUI.uiView={"type":"Dialog","props":{"width":1136,"height":640},"child":[{"type":"Image","props":{"y":46,"x":170,"skin":"comp/hundred/playerList/wanjiatanchuang.png"}},{"type":"Image","props":{"y":64,"x":474,"skin":"comp/hundred/playerList/wanjiawanzi.png"}},{"type":"Image","props":{"y":89,"x":902,"var":"closeBtn","skin":"comp/hundred/playerList/shut.png"}},{"type":"List","props":{"y":149,"x":216,"width":703,"var":"list","height":394},"child":[{"type":"Box","props":{"y":7,"x":-2,"renderType":"render"},"child":[{"type":"Image","props":{"skin":"comp/hundred/playerList/wanjiabg.png"}},{"type":"Image","props":{"y":57,"x":97,"width":132,"skin":"comp/hundred/playerList/jinbibg.png","height":43}},{"type":"Image","props":{"y":3,"x":10,"width":88,"name":"headImg","height":88}},{"type":"Label","props":{"y":65,"x":129,"width":92,"valign":"middle","name":"money","height":31,"fontSize":16,"color":"#ecf6ef"}},{"type":"Label","props":{"y":4,"x":99,"width":126,"valign":"middle","name":"name","height":31,"fontSize":20,"color":"#0ce54d","bold":true}}]}]}]};
		return playerListUI;
	})(Dialog);
var customRoomTipUI=(function(_super){
		function customRoomTipUI(){
			
		    this.back2game=null;
		    this.go2charge=null;

			customRoomTipUI.__super.call(this);
		}

		CLASS$(customRoomTipUI,'ui.loaded.customRoomTipUI',_super);
		var __proto__=customRoomTipUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(customRoomTipUI.uiView);

		}

		customRoomTipUI.uiView={"type":"Dialog","props":{"width":1136,"height":640},"child":[{"type":"Image","props":{"y":-103,"x":224,"skin":"comp/img/createRoom/fangjian--bg.png"}},{"type":"Image","props":{"y":375,"x":306,"var":"back2game","skin":"comp/img/createRoom/Return to the hall-button.png"}},{"type":"Image","props":{"y":375,"x":618,"var":"go2charge","skin":"comp/img/createRoom/WeChat payment--button.png"}},{"type":"Label","props":{"y":234,"x":366,"wordWrap":true,"width":399,"text":"创建房间需要100金币，您的金币不足，是否前往充值？","height":123,"fontSize":30,"color":"#fff"}},{"type":"Image","props":{"y":29,"x":265,"skin":"comp/img/createRoom/Headline.png"}}]};
		return customRoomTipUI;
	})(Dialog);
var joinRoomUI=(function(_super){
		function joinRoomUI(){
			
		    this.closeBtn=null;

			joinRoomUI.__super.call(this);
		}

		CLASS$(joinRoomUI,'ui.loaded.joinRoomUI',_super);
		var __proto__=joinRoomUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(joinRoomUI.uiView);

		}

		joinRoomUI.uiView={"type":"Dialog","props":{"width":1136,"height":640},"child":[{"type":"Image","props":{"y":29,"x":243,"skin":"comp/img/joinRoom/jiarufangjian--bg.png"}},{"type":"Image","props":{"y":5,"x":265,"skin":"comp/img/joinRoom/litele.png"}},{"type":"Image","props":{"y":128,"x":341,"skin":"comp/img/joinRoom/Input box--bg.png"}},{"type":"Image","props":{"y":54,"x":823,"var":"closeBtn","skin":"comp/img/joinRoom/delete.png"}},{"type":"Image","props":{"y":130,"x":504,"width":50,"name":"numInput3","height":65},"child":[{"type":"Image","props":{"y":11,"x":13,"width":23,"height":42}}]},{"type":"Image","props":{"y":130,"x":578,"width":50,"name":"numInput4","height":65},"child":[{"type":"Image","props":{"y":11,"x":13,"width":23,"height":42}}]},{"type":"Image","props":{"y":130,"x":428,"width":50,"name":"numInput2","height":65},"child":[{"type":"Image","props":{"y":11,"x":13,"width":23,"height":42}}]},{"type":"Image","props":{"y":130,"x":720,"width":50,"name":"numInput6","height":65},"child":[{"type":"Image","props":{"y":11,"x":13,"width":23,"height":42}}]},{"type":"Image","props":{"y":130,"x":355,"width":50,"name":"numInput1","height":65},"child":[{"type":"Image","props":{"y":11,"x":13,"width":23,"height":42}}]},{"type":"Image","props":{"y":130,"x":648,"width":50,"name":"numInput5","height":65},"child":[{"type":"Image","props":{"y":11,"x":13,"width":23,"height":42}}]},{"type":"Image","props":{"y":218,"x":288,"skin":"comp/img/joinRoom/Button--bg.png","name":"numBox1"},"child":[{"type":"Image","props":{"y":18,"x":58,"skin":"comp/img/joinRoom/1.png"}}]},{"type":"Image","props":{"y":218,"x":494,"skin":"comp/img/joinRoom/Button--bg.png","name":"numBox2"},"child":[{"type":"Image","props":{"y":18,"x":58,"skin":"comp/img/joinRoom/2.png"}}]},{"type":"Image","props":{"y":218,"x":691,"skin":"comp/img/joinRoom/Button--bg.png","name":"numBox3"},"child":[{"type":"Image","props":{"y":18,"x":58,"skin":"comp/img/joinRoom/3.png"}}]},{"type":"Image","props":{"y":318,"x":288,"skin":"comp/img/joinRoom/Button--bg.png","name":"numBox4"},"child":[{"type":"Image","props":{"y":18,"x":58,"skin":"comp/img/joinRoom/4.png"}}]},{"type":"Image","props":{"y":416,"x":288,"skin":"comp/img/joinRoom/Button--bg.png","name":"numBox7"},"child":[{"type":"Image","props":{"y":18,"x":58,"skin":"comp/img/joinRoom/7.png"}}]},{"type":"Image","props":{"y":513,"x":288,"skin":"comp/img/joinRoom/Button--bg.png","name":"numBox10"},"child":[{"type":"Image","props":{"y":16,"x":29,"skin":"comp/img/joinRoom/word--delete.png"}}]},{"type":"Image","props":{"y":318,"x":494,"skin":"comp/img/joinRoom/Button--bg.png","name":"numBox5"},"child":[{"type":"Image","props":{"y":18,"x":58,"skin":"comp/img/joinRoom/5.png"}}]},{"type":"Image","props":{"y":416,"x":494,"skin":"comp/img/joinRoom/Button--bg.png","name":"numBox8"},"child":[{"type":"Image","props":{"y":18,"x":58,"skin":"comp/img/joinRoom/8.png"}}]},{"type":"Image","props":{"y":513,"x":494,"skin":"comp/img/joinRoom/Button--bg.png","name":"numBox0"},"child":[{"type":"Image","props":{"y":18,"x":58,"skin":"comp/img/joinRoom/0.png"}}]},{"type":"Image","props":{"y":318,"x":691,"skin":"comp/img/joinRoom/Button--bg.png","name":"numBox6"},"child":[{"type":"Image","props":{"y":18,"x":58,"skin":"comp/img/joinRoom/6.png"}}]},{"type":"Image","props":{"y":416,"x":691,"skin":"comp/img/joinRoom/Button--bg.png","name":"numBox9"},"child":[{"type":"Image","props":{"y":18,"x":58,"skin":"comp/img/joinRoom/9.png"}}]},{"type":"Image","props":{"y":513,"x":691,"skin":"comp/img/joinRoom/Button--bg.png","name":"numBox11"},"child":[{"type":"Image","props":{"y":16,"x":31,"skin":"comp/img/joinRoom/word--Determine--.png"}}]},{"type":"Image","props":{"y":137,"x":416,"skin":"comp/img/joinRoom/Line1.png"}},{"type":"Image","props":{"y":137,"x":491,"skin":"comp/img/joinRoom/Line1.png"}},{"type":"Image","props":{"y":137,"x":566,"skin":"comp/img/joinRoom/Line1.png"}},{"type":"Image","props":{"y":137,"x":637,"skin":"comp/img/joinRoom/Line1.png"}},{"type":"Image","props":{"y":137,"x":710,"skin":"comp/img/joinRoom/Line1.png"}}]};
		return joinRoomUI;
	})(Dialog);
var loadedUI=(function(_super){
		function loadedUI(){
			
		    this.nav=null;
		    this.mainBox=null;
		    this.shop=null;
		    this.safe=null;
		    this.zhizun=null;
		    this.bairen=null;
		    this.zijian=null;
		    this.gaoji=null;
		    this.dajiu=null;
		    this.customBox=null;
		    this.createRoomBtn=null;
		    this.joinRoomBtn=null;
		    this.backBtn=null;
		    this.gonggao=null;
		    this.money=null;
		    this.nickname=null;
		    this.headImg=null;
		    this.rule=null;
		    this.set=null;
		    this.share=null;
		    this.voucher=null;
		    this.adviseList=null;
		    this.kefuBtn=null;
		    this.idLab=null;

			loadedUI.__super.call(this);
		}

		CLASS$(loadedUI,'ui.loaded.loadedUI',_super);
		var __proto__=loadedUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(loadedUI.uiView);

		}

		loadedUI.uiView={"type":"View","props":{"width":1136,"height":640},"child":[{"type":"Image","props":{"y":0,"x":0,"width":1136,"skin":"comp/img/dating/bg.png","height":640}},{"type":"Image","props":{"y":0,"x":0,"width":1134,"visible":true,"var":"nav","skin":"comp/img/dating/status bar--bg.png","height":90}},{"type":"Image","props":{"y":105,"x":327,"width":536,"skin":"comp/img/dating/Notice--bg.png","height":52},"child":[{"type":"Image","props":{"y":3,"x":9,"width":55,"skin":"comp/img/dating/horn.png","height":44}}]},{"type":"Box","props":{"y":3,"x":-2,"width":1144,"var":"mainBox","height":654},"child":[{"type":"Image","props":{"y":381,"x":447,"width":249,"skin":"comp/img/dating/Platform.png","height":170}},{"type":"Image","props":{"y":203,"x":471,"width":210,"skin":"comp/img/dating/mahjong.png","height":238}},{"type":"Image","props":{"y":574,"x":397,"width":350,"skin":"comp/img/dating/bottom.png","height":80},"child":[{"type":"Image","props":{"y":-40,"x":20,"width":118,"var":"shop","skin":"comp/img/dating/Shop.png","height":93}},{"type":"Image","props":{"y":-42,"x":220,"width":100,"var":"safe","skin":"comp/img/dating/Safe Deposit Box.png","height":97}}]},{"type":"Image","props":{"y":411,"x":123,"width":295,"var":"zhizun","skin":"comp/img/dating/zhizun.png","height":120},"child":[{"type":"Label","props":{"y":100,"x":76,"width":198,"visible":false,"valign":"middle","text":"label","name":"number","height":30,"fontSize":20,"color":"#0dd8f4"}}]},{"type":"Image","props":{"y":147,"x":1,"width":295,"var":"bairen","skin":"comp/img/dating/bairen.png","height":120},"child":[{"type":"Label","props":{"y":107,"x":77,"width":198,"visible":false,"valign":"middle","text":"label","height":30,"fontSize":20,"color":"#0dd8f4"}}]},{"type":"Image","props":{"y":278,"x":50,"width":295,"var":"zijian","skin":"comp/img/dating/zijian.png","height":120},"child":[{"type":"Label","props":{"y":105,"x":75,"width":198,"visible":false,"valign":"middle","text":"label","height":30,"fontSize":20,"color":"#0dd8f4"}}]},{"type":"Image","props":{"y":411,"x":721,"width":295,"var":"gaoji","skin":"comp/img/dating/gaoji.png","height":120},"child":[{"type":"Label","props":{"y":106,"x":81,"width":198,"visible":false,"valign":"middle","text":"label","height":30,"fontSize":20,"color":"#0dd8f4"}}]},{"type":"Image","props":{"y":278,"x":770,"width":295,"var":"dajiu","skin":"comp/img/dating/dajiujiu.png","height":120},"child":[{"type":"Label","props":{"y":110,"x":83,"width":198,"visible":false,"valign":"middle","text":"label","height":30,"fontSize":20,"color":"#0dd8f4"}}]}]},{"type":"Box","props":{"y":435,"x":549,"width":931,"visible":false,"var":"customBox","pivotY":278,"pivotX":447,"height":401},"child":[{"type":"Image","props":{"y":298,"x":539,"width":272,"skin":"comp/img/zijianfang/Join the room--Platform.png","height":179}},{"type":"Image","props":{"y":289,"x":184,"width":272,"skin":"comp/img/zijianfang/Create a room--Platform.png","height":179}},{"type":"Image","props":{"y":23,"x":182,"width":272,"var":"createRoomBtn","skin":"comp/img/zijianfang/Create a room.png","height":346}},{"type":"Image","props":{"y":23,"x":540,"width":272,"var":"joinRoomBtn","skin":"comp/img/zijianfang/Join the room.png","height":346}},{"type":"Image","props":{"y":0,"x":0,"var":"backBtn","skin":"comp/img/dating/public_btn_back.png"}}]},{"type":"Image","props":{"y":4,"x":899,"var":"gonggao","skin":"comp/img/dating/information.png"}},{"type":"Image","props":{"y":17,"x":280,"width":218,"skin":"comp/img/dating/currency--bg.png","height":56},"child":[{"type":"Image","props":{"y":-20,"x":-7,"width":101,"skin":"comp/img/dating/currency.png","height":94}}]},{"type":"Label","props":{"y":13,"x":358,"width":136,"var":"money","valign":"middle","text":"666","height":55,"fontSize":24,"font":"Microsoft YaHei","color":"#e9f507","bold":true}},{"type":"Label","props":{"y":13,"x":113,"width":154,"var":"nickname","valign":"middle","text":"张三","overflow":"hidden","height":32,"fontSize":24,"font":"Microsoft YaHei","color":"#fff","bold":true}},{"type":"Image","props":{"y":11,"x":26,"width":72,"var":"headImg","skin":"comp/loaded/avatar.png","height":68}},{"type":"Image","props":{"y":4,"x":803,"var":"rule","skin":"comp/img/dating/rule.png"}},{"type":"Image","props":{"y":4,"x":997,"var":"set","skin":"comp/img/dating/shezhi.png"}},{"type":"Image","props":{"y":6,"x":939,"visible":false,"var":"share","skin":"comp/loaded/share-icon.png"}},{"type":"Image","props":{"y":17,"x":527,"width":220,"skin":"comp/img/dating/Voucher--bg.png","height":56},"child":[{"type":"Image","props":{"y":0,"x":0,"width":48,"skin":"comp/img/dating/Voucher.png","height":51}}]},{"type":"Label","props":{"y":12,"x":575,"width":199,"var":"voucher","valign":"middle","text":"1111","height":58,"fontSize":24,"font":"Microsoft YaHei","color":"#e9f507","bold":true}},{"type":"Panel","props":{"y":107,"x":390,"width":431,"var":"adviseList","height":47},"child":[{"type":"Label","props":{"y":0,"x":0,"wordWrap":false,"width":884,"valign":"middle","text":"哈哈哈哈哈哈哈哈","name":"msg","height":47,"fontSize":26,"color":"#f6e7e7"}}]},{"type":"Image","props":{"y":147,"x":842,"width":295,"var":"kefuBtn","skin":"comp/img/dating/kefu.png","height":120}},{"type":"Label","props":{"y":44,"x":113,"width":125,"var":"idLab","valign":"middle","text":"ID：123456","height":32,"fontSize":18,"font":"Microsoft YaHei","color":"#fff","bold":true}},{"type":"Image","props":{"y":8,"x":23,"width":81,"skin":"comp/img/dating/icon_frame_32.png","height":74}}]};
		return loadedUI;
	})(View);
var noticeUI=(function(_super){
		function noticeUI(){
			
		    this.userOrderBtn=null;
		    this.systemMsgBtn=null;
		    this.none=null;
		    this.systemMsgList=null;
		    this.closeBtn=null;
		    this.userOrderList=null;
		    this.msgDetail=null;
		    this.backBtn=null;

			noticeUI.__super.call(this);
		}

		CLASS$(noticeUI,'ui.loaded.noticeUI',_super);
		var __proto__=noticeUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(noticeUI.uiView);

		}

		noticeUI.uiView={"type":"Dialog","props":{"width":1136,"height":640},"child":[{"type":"Image","props":{"y":6,"x":129,"skin":"comp/loaded/message/annframe.png"}},{"type":"Image","props":{"y":20,"x":532,"skin":"comp/loaded/message/anntext.png"}},{"type":"Image","props":{"y":92,"x":364,"skin":"comp/loaded/message/bg.png"},"child":[{"type":"Button","props":{"y":1,"x":199,"var":"userOrderBtn","skin":"comp/button_gerendingdan.png"}},{"type":"Button","props":{"y":1,"x":2,"var":"systemMsgBtn","skin":"comp/button_xitongxiaoxi.png","selected":true}}]},{"type":"Image","props":{"y":304,"x":399,"visible":false,"var":"none","skin":"comp/loaded/message/airtext.png"}},{"type":"List","props":{"y":156,"x":168,"width":819,"var":"systemMsgList","height":454},"child":[{"type":"Box","props":{"y":0,"x":0,"width":819,"renderType":"render","height":88},"child":[{"type":"Image","props":{"y":8,"x":125,"skin":"comp/loaded/message/mail.png"}},{"type":"Image","props":{"y":86,"x":77,"skin":"comp/loaded/message/sp.png"}},{"type":"Label","props":{"y":16,"x":211,"width":478,"valign":"middle","text":"哈哈哈哈","overflow":"hidden","name":"title","height":55,"fontSize":25,"color":"#81461a","bold":true,"align":"center"}},{"type":"Image","props":{"y":8,"x":179,"skin":"comp/loaded/message/biao.png","name":"tip"}}]}]},{"type":"Image","props":{"y":43,"x":961,"var":"closeBtn","skin":"comp/loaded/message/shut.png"}},{"type":"List","props":{"y":156,"x":168,"width":819,"visible":false,"var":"userOrderList","height":454},"child":[{"type":"Image","props":{"y":19,"x":69,"skin":"comp/loaded/message/ordertext.png"}},{"type":"Box","props":{"y":69,"x":0,"width":819,"renderType":"render","height":54},"child":[{"type":"Label","props":{"y":0,"x":0,"width":239,"valign":"middle","text":"哈哈","overflow":"hidden","name":"name","height":54,"fontSize":20,"color":"#81461a","bold":true,"align":"center"}},{"type":"Label","props":{"y":0,"x":308,"width":203,"valign":"middle","text":"哈哈","overflow":"hidden","name":"time","height":54,"fontSize":20,"color":"#81461a","bold":true,"align":"center"}},{"type":"Label","props":{"y":0,"x":590,"width":229,"valign":"middle","text":"哈哈","overflow":"hidden","name":"number","height":54,"fontSize":20,"color":"#81461a","bold":true,"align":"center"}}]}]},{"type":"Box","props":{"y":91,"x":158,"width":838,"visible":false,"var":"msgDetail","height":526},"child":[{"type":"Label","props":{"y":75,"x":61,"width":715,"valign":"middle","text":"哈哈","name":"content","height":74,"fontSize":26,"color":"#81461a","bold":true}},{"type":"Image","props":{"y":0,"x":0,"var":"backBtn","skin":"comp/loaded/message/return.png"}},{"type":"Label","props":{"y":446,"x":487,"width":325,"valign":"middle","text":"哈哈","name":"time","height":43,"fontSize":26,"color":"#81461a","bold":true}}]}]};
		return noticeUI;
	})(Dialog);
var ruleUI=(function(_super){
		function ruleUI(){
			
		    this.closeBtn=null;
		    this.shuomingBtn=null;
		    this.daxiaoBtn=null;
		    this.changciBtn=null;
		    this.shuomingList=null;
		    this.daxiaoList=null;
		    this.changciList=null;

			ruleUI.__super.call(this);
		}

		CLASS$(ruleUI,'ui.loaded.ruleUI',_super);
		var __proto__=ruleUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(ruleUI.uiView);

		}

		ruleUI.uiView={"type":"Dialog","props":{"width":1136,"height":640},"child":[{"type":"Image","props":{"y":-4,"x":89,"skin":"comp/loaded/rule/ruleframe.png"}},{"type":"Image","props":{"y":10,"x":523,"skin":"comp/loaded/rule/ruletext.png"}},{"type":"Image","props":{"y":27,"x":988,"var":"closeBtn","skin":"comp/loaded/rule/shut.png"}},{"type":"Button","props":{"y":109,"x":123,"var":"shuomingBtn","skin":"comp/button_duipai.png","selected":true}},{"type":"Button","props":{"y":243,"x":123,"var":"daxiaoBtn","skin":"comp/button_daxiao.png"}},{"type":"Button","props":{"y":377,"x":123,"var":"changciBtn","skin":"comp/button_changci.png"}},{"type":"List","props":{"y":96,"x":333,"width":651,"var":"shuomingList","spaceY":10,"height":481},"child":[{"type":"Box","props":{"y":0,"x":0,"width":651,"renderType":"render","height":100},"child":[{"type":"Image","props":{"skin":"comp/loaded/rule/shuoming/1.png","name":"img"}}]}]},{"type":"List","props":{"y":102,"x":323,"width":688,"visible":false,"var":"daxiaoList","spaceY":40,"height":482},"child":[{"type":"Box","props":{"y":0,"x":0,"width":688,"renderType":"render","height":100},"child":[{"type":"Image","props":{"width":688,"skin":"comp/loaded/rule/daxiao/1.png","name":"img"}}]}]},{"type":"List","props":{"y":112,"x":333,"width":672,"visible":false,"var":"changciList","height":490},"child":[{"type":"Box","props":{"y":0,"x":0,"width":670,"renderType":"render","height":321},"child":[{"type":"Image","props":{"y":0,"x":0,"width":668,"skin":"comp/loaded/rule/1.png","name":"img","height":321}}]}]}]};
		return ruleUI;
	})(Dialog);
var safeUI=(function(_super){
		function safeUI(){
			
		    this.closeBtn=null;
		    this.boxMoney=null;
		    this.saveAddBtn=null;
		    this.saveReduceBtn=null;
		    this.saveBtn=null;
		    this.saveInput=null;
		    this.getAddBtn=null;
		    this.getReduceBtn=null;
		    this.getBtn=null;
		    this.getInput=null;

			safeUI.__super.call(this);
		}

		CLASS$(safeUI,'ui.loaded.safeUI',_super);
		var __proto__=safeUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(safeUI.uiView);

		}

		safeUI.uiView={"type":"Dialog","props":{"width":1136,"height":640},"child":[{"type":"Image","props":{"y":81,"x":201,"skin":"comp/loaded/safe/safeframe.png"}},{"type":"Image","props":{"y":94,"x":501,"skin":"comp/loaded/safe/safetext.png"}},{"type":"Image","props":{"y":110,"x":874,"var":"closeBtn","skin":"comp/loaded/safe/shut.png"}},{"type":"Label","props":{"y":174,"x":371,"width":394,"var":"boxMoney","valign":"middle","text":"已存入：666","height":56,"fontSize":26,"color":"#81461a","bold":true,"align":"center"}},{"type":"Image","props":{"y":236,"x":243,"skin":"comp/loaded/safe/tiaobg.png"}},{"type":"Image","props":{"y":275,"x":272,"skin":"comp/loaded/safe/deposittext.png"}},{"type":"Image","props":{"y":262,"x":406,"width":56,"var":"saveAddBtn","skin":"comp/loaded/safe/plus-icon.png","height":62}},{"type":"Image","props":{"y":262,"x":685,"width":56,"var":"saveReduceBtn","skin":"comp/loaded/safe/less-icon.png","height":62}},{"type":"Image","props":{"y":249,"x":474,"skin":"comp/loaded/safe/glodbg.png"}},{"type":"Image","props":{"y":266,"x":753,"var":"saveBtn","skin":"comp/loaded/safe/depositbutton.png"}},{"type":"TextInput","props":{"y":269,"x":491,"width":166,"var":"saveInput","text":"100","mouseEnabled":false,"height":40,"fontSize":22,"color":"#e7d6d6","align":"center"}},{"type":"Image","props":{"y":358,"x":243,"skin":"comp/loaded/safe/tiaobg.png"}},{"type":"Image","props":{"y":397,"x":272,"skin":"comp/loaded/safe/taketext.png"}},{"type":"Image","props":{"y":390,"x":406,"width":56,"var":"getAddBtn","skin":"comp/loaded/safe/plus-icon.png","height":62}},{"type":"Image","props":{"y":391,"x":685,"width":56,"var":"getReduceBtn","skin":"comp/loaded/safe/less-icon.png","height":62}},{"type":"Image","props":{"y":371,"x":474,"skin":"comp/loaded/safe/glodbg.png"}},{"type":"Image","props":{"y":388,"x":753,"var":"getBtn","skin":"comp/loaded/safe/takebutton.png"}},{"type":"TextInput","props":{"y":393,"x":492,"width":166,"var":"getInput","text":"100","mouseEnabled":false,"height":40,"fontSize":22,"color":"#e7d6d6","align":"center"}},{"type":"Image","props":{"y":475,"x":414,"skin":"comp/loaded/safe/prompt-icon.png"}},{"type":"Label","props":{"y":464,"x":448,"width":397,"valign":"middle","text":"可存放一定金币，用来避免破产。","height":52,"fontSize":20,"color":"#81461a"}}]};
		return safeUI;
	})(Dialog);
var setUI=(function(_super){
		function setUI(){
			
		    this.closeBtn=null;
		    this.headImg=null;
		    this.userID=null;
		    this.soundBtn=null;
		    this.musicBtn=null;
		    this.changeUserBtn=null;

			setUI.__super.call(this);
		}

		CLASS$(setUI,'ui.loaded.setUI',_super);
		var __proto__=setUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(setUI.uiView);

		}

		setUI.uiView={"type":"Dialog","props":{"width":1136,"height":640},"child":[{"type":"Image","props":{"y":46,"x":193,"skin":"comp/loaded/set/setframe.png"}},{"type":"Image","props":{"y":60,"x":523,"skin":"comp/loaded/set/settext.png"}},{"type":"Image","props":{"y":81,"x":886,"var":"closeBtn","skin":"comp/loaded/set/shut.png"}},{"type":"Image","props":{"y":249,"x":690,"width":120,"var":"headImg","skin":"comp/loaded/set/avatar.png","height":120}},{"type":"Label","props":{"y":368,"x":613,"width":270,"var":"userID","valign":"middle","text":"ID：123456","height":50,"fontSize":20,"color":"#81461a","align":"center"}},{"type":"Label","props":{"y":241,"x":286,"width":108,"valign":"middle","text":"音效","height":60,"fontSize":20,"color":"#81461a"}},{"type":"Label","props":{"y":343,"x":286,"width":108,"valign":"middle","text":"音乐","height":60,"fontSize":20,"color":"#81461a"}},{"type":"Image","props":{"y":249,"x":376,"var":"soundBtn","skin":"comp/loaded/set/close.png"}},{"type":"Image","props":{"y":356,"x":376,"var":"musicBtn","skin":"comp/loaded/set/close.png"}},{"type":"Image","props":{"y":437,"x":673,"var":"changeUserBtn","skin":"comp/loaded/set/changeUser.png"}}]};
		return setUI;
	})(Dialog);
var shareUI=(function(_super){
		function shareUI(){
			
		    this.friendBtn=null;
		    this.closeBtn=null;
		    this.weChat=null;

			shareUI.__super.call(this);
		}

		CLASS$(shareUI,'ui.loaded.shareUI',_super);
		var __proto__=shareUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(shareUI.uiView);

		}

		shareUI.uiView={"type":"Dialog","props":{"width":1136,"height":640},"child":[{"type":"Image","props":{"y":96,"x":222,"skin":"comp/loaded/share/shareframe.png"},"child":[{"type":"Image","props":{"y":188,"x":213,"var":"friendBtn","skin":"comp/loaded/share/pengyouquan.png"}},{"type":"Image","props":{"y":12,"x":303,"skin":"comp/loaded/share/sharetext.png"}},{"type":"Image","props":{"y":19,"x":632,"var":"closeBtn","skin":"comp/loaded/share/shut.png"}},{"type":"Image","props":{"y":193,"x":442,"var":"weChat","skin":"comp/loaded/share/wechat.png"}}]}]};
		return shareUI;
	})(Dialog);
var shopUI=(function(_super){
		function shopUI(){
			
		    this.money=null;
		    this.voucher=null;
		    this.zxcz=null;
		    this.kf=null;
		    this.dhspj=null;
		    this.dhsp=null;
		    this.closeBtn=null;
		    this.zxczList=null;
		    this.kefuList=null;
		    this.dhspjList=null;
		    this.dhspList=null;
		    this.emailBox=null;

			shopUI.__super.call(this);
		}

		CLASS$(shopUI,'ui.loaded.shop.shopUI',_super);
		var __proto__=shopUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(shopUI.uiView);

		}

		shopUI.uiView={"type":"Dialog","props":{"width":1136,"height":640},"child":[{"type":"Image","props":{"y":0,"x":0,"width":1136,"skin":"comp/shop/mallframe.png","height":640}},{"type":"Image","props":{"y":23,"x":155,"skin":"comp/shop/goldbg.png"}},{"type":"Label","props":{"y":24,"x":210,"width":122,"var":"money","valign":"middle","text":"666","height":43,"fontSize":20,"color":"#f1d8d7"}},{"type":"Image","props":{"y":26,"x":162,"skin":"comp/shop/gold.png"}},{"type":"Image","props":{"y":23,"x":756,"skin":"comp/shop/goldbg.png"}},{"type":"Label","props":{"y":23,"x":822,"width":112,"var":"voucher","valign":"middle","text":"1111","height":43,"fontSize":20,"color":"#f3e7e7"}},{"type":"Image","props":{"y":26,"x":764,"skin":"comp/shop/coupons.png"}},{"type":"Image","props":{"y":15,"x":497,"skin":"comp/shop/malltext.png"}},{"type":"Image","props":{"y":100,"x":113,"skin":"comp/shop/buttonbg.png"},"child":[{"type":"Button","props":{"y":1,"x":0,"var":"zxcz","skin":"comp/button_zxcz.png","selected":true}},{"type":"Button","props":{"y":1,"x":229,"var":"kf","skin":"comp/button_kf.png"}},{"type":"Button","props":{"y":1,"x":456,"var":"dhspj","skin":"comp/button_dhspj.png"}},{"type":"Button","props":{"y":1,"x":683,"width":227,"var":"dhsp","skin":"comp/button_dhsp.png","height":61}}]},{"type":"Image","props":{"y":30,"x":1064,"var":"closeBtn","skin":"comp/shop/shut.png"}},{"type":"List","props":{"y":180,"x":78,"width":980,"visible":true,"var":"zxczList","spaceY":15,"spaceX":33,"height":412},"child":[{"type":"Box","props":{"width":220,"renderType":"render","height":300},"child":[{"type":"Image","props":{"y":0,"x":0,"width":220,"skin":"comp/shop/bg.png","height":300}},{"type":"Label","props":{"y":30,"x":6,"width":211,"valign":"middle","text":"asd ","name":"name","height":50,"fontSize":30,"color":"#81461a","align":"center"}},{"type":"Image","props":{"y":232,"x":32,"skin":"comp/shop/qwer.png","name":"dhBtn"}},{"type":"Label","props":{"y":233,"x":82,"width":100,"valign":"middle","text":"8888","name":"cost","height":44,"fontSize":20,"color":"#81461a","bold":true,"align":"center"}},{"type":"Image","props":{"y":104,"x":38,"skin":"comp/shop/icon_money_reward_01.png","name":"pic"}}]}]},{"type":"List","props":{"y":190,"x":78,"width":980,"visible":false,"var":"kefuList","spaceY":15,"spaceX":90,"height":412},"child":[{"type":"Box","props":{"y":60,"x":66,"width":220,"renderType":"render","height":300},"child":[{"type":"Image","props":{"y":0,"x":0,"width":220,"skin":"comp/shop/bg.png","height":300}},{"type":"Image","props":{"y":45,"x":68,"width":81,"skin":"comp/shop/客服1.png","name":"pic","height":41}},{"type":"Label","props":{"y":98,"x":3,"width":211,"valign":"middle","text":"asd ","overflow":"hidden","name":"name","height":41,"fontSize":30,"color":"#81461a","align":"center"}},{"type":"Label","props":{"y":142,"x":3,"width":211,"valign":"middle","text":"asd ","name":"number","height":41,"fontSize":30,"color":"#81461a","align":"center"}},{"type":"Image","props":{"y":207,"x":27,"visible":false,"skin":"comp/shop/复-制.png","name":"copyBtn"}}]}]},{"type":"List","props":{"y":180,"x":78,"width":980,"visible":false,"var":"dhspjList","spaceY":15,"spaceX":33,"height":412},"child":[{"type":"Box","props":{"width":220,"renderType":"render","height":300},"child":[{"type":"Image","props":{"y":0,"x":0,"width":220,"skin":"comp/shop/bg.png","height":300}},{"type":"Label","props":{"y":0,"x":0,"width":215,"valign":"middle","text":"商品劵","height":34,"fontSize":30,"color":"#81461a","bold":true,"align":"center"}},{"type":"Image","props":{"y":232,"x":32,"skin":"comp/shop/goldbutton.png","name":"dhBtn"}},{"type":"Label","props":{"y":233,"x":82,"width":100,"valign":"middle","text":"8888","name":"cost","height":44,"fontSize":20,"color":"#81461a","bold":true,"align":"center"}},{"type":"Image","props":{"y":65,"x":38,"skin":"comp/shop/icon_money_reward_01.png","name":"pic"}},{"type":"Label","props":{"y":174,"x":2,"width":215,"valign":"middle","text":"商品劵","name":"name","height":34,"fontSize":30,"color":"#81461a","bold":true,"align":"center"}}]}]},{"type":"List","props":{"y":180,"x":78,"width":980,"visible":false,"var":"dhspList","spaceY":15,"spaceX":33,"height":412},"child":[{"type":"Box","props":{"width":220,"renderType":"render","height":300},"child":[{"type":"Image","props":{"y":0,"x":0,"width":220,"skin":"comp/shop/bg.png","height":300}},{"type":"Label","props":{"y":0,"x":0,"width":215,"valign":"middle","text":"商品","height":34,"fontSize":30,"color":"#81461a","bold":true,"align":"center"}},{"type":"Image","props":{"y":233,"x":32,"skin":"comp/shop/couponsbutotn.png","name":"dhBtn"}},{"type":"Label","props":{"y":233,"x":82,"width":100,"valign":"middle","text":"8888","name":"cost","height":44,"fontSize":20,"color":"#81461a","bold":true,"align":"center"}},{"type":"Image","props":{"y":65,"x":38,"skin":"comp/shop/icon_money_reward_01.png","name":"pic"}},{"type":"Label","props":{"y":174,"x":2,"width":215,"valign":"middle","text":"苹果10","name":"name","height":34,"fontSize":30,"color":"#81461a","bold":true,"align":"center"}},{"type":"Label","props":{"visible":false,"name":"ID"}}]}]},{"type":"Box","props":{"y":175,"x":76,"visible":false,"var":"emailBox"},"child":[{"type":"Image","props":{"width":983,"skin":"comp/shop/duihuan/wqer.png","sizeGrid":"40,0,34,0","height":433}},{"type":"Image","props":{"y":79,"x":277,"width":281,"skin":"comp/shop/duihuan/box1.png","height":67}},{"type":"Image","props":{"y":10,"x":11,"skin":"comp/shop/duihuan/fanhui.png","name":"backBtn"}},{"type":"Image","props":{"y":257,"x":477,"skin":"comp/shop/duihuan/queren.png","name":"certainBtn"}},{"type":"Image","props":{"y":77,"x":575,"width":370,"skin":"comp/shop/duihuan/box1.png","height":70}},{"type":"Image","props":{"y":169,"x":277,"width":668,"skin":"comp/shop/duihuan/box1.png","height":70}},{"type":"Label","props":{"y":3,"x":286,"width":547,"valign":"middle","text":"请填写邮寄详情信息","height":67,"fontSize":40,"color":"#81461a","bold":true,"align":"center"}},{"type":"TextInput","props":{"y":81,"x":279,"width":279,"promptColor":"#999","prompt":"请填写收件人姓名","name":"name","height":64,"fontSize":30,"color":"#0f0e0e"}},{"type":"TextInput","props":{"y":81,"x":576,"width":367,"promptColor":"#999","prompt":"请填写收件人电话","name":"phone","height":62,"fontSize":30,"color":"#0f0e0e"}},{"type":"TextInput","props":{"y":169,"x":277,"width":667,"promptColor":"#999","prompt":"请填写收件人地址","name":"address","height":65,"fontSize":30,"color":"#0f0e0e"}},{"type":"Label","props":{"y":80,"x":18,"width":224,"valign":"middle","text":"兑换的物品","height":67,"fontSize":20,"color":"#81461a","bold":true,"align":"center"}},{"type":"Label","props":{"y":358,"x":66,"width":876,"valign":"middle","text":"奖品将在您提交后一周内邮寄发货，如有问题请联系微信客服。","height":59,"fontSize":20,"color":"#111","bold":true,"align":"center"}},{"type":"Image","props":{"y":148,"x":81,"width":106,"skin":"comp/shop/duihuan/box1.png","name":"proImg","height":108}},{"type":"Label","props":{"y":262,"x":22,"width":224,"valign":"middle","text":"兑换的物品","name":"proName","height":43,"fontSize":20,"color":"#81461a","bold":true,"align":"center"}},{"type":"Label","props":{"y":311,"x":117,"width":110,"valign":"middle","text":"6","name":"proCost","height":43,"fontSize":20,"color":"#81461a","bold":true}},{"type":"Image","props":{"y":308,"x":53,"skin":"comp/shop/coupons.png"}},{"type":"Label","props":{"y":367,"x":18,"width":110,"visible":false,"valign":"middle","text":"6","name":"ID","height":43,"fontSize":20,"color":"#81461a","bold":true}}]}]};
		return shopUI;
	})(Dialog);
var shopTipUI=(function(_super){
		function shopTipUI(){
			
		    this.certainBtn=null;
		    this.closeBtn=null;
		    this.msg=null;

			shopTipUI.__super.call(this);
		}

		CLASS$(shopTipUI,'ui.loaded.shop.shopTipUI',_super);
		var __proto__=shopTipUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(shopTipUI.uiView);

		}

		shopTipUI.uiView={"type":"Dialog","props":{"width":1136,"height":640},"child":[{"type":"Image","props":{"y":97,"x":254,"skin":"comp/shop/tip/kuang.png"}},{"type":"Image","props":{"y":113,"x":522,"skin":"comp/shop/tip/tishi.png"}},{"type":"Image","props":{"y":393,"x":646,"var":"certainBtn","skin":"comp/shop/tip/duihuan.png"}},{"type":"Image","props":{"y":393,"x":372,"var":"closeBtn","skin":"comp/shop/tip/fanhui.png"}},{"type":"Label","props":{"y":255,"x":362,"width":412,"var":"msg","text":"确认是否兑换？","height":56,"fontSize":30,"color":"#81461a","bold":true,"align":"center"}}]};
		return shopTipUI;
	})(Dialog);
var shopTipResultUI=(function(_super){
		function shopTipResultUI(){
			
		    this.closeBtn=null;
		    this.msg=null;

			shopTipResultUI.__super.call(this);
		}

		CLASS$(shopTipResultUI,'ui.loaded.shop.shopTipResultUI',_super);
		var __proto__=shopTipResultUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(shopTipResultUI.uiView);

		}

		shopTipResultUI.uiView={"type":"Dialog","props":{"width":1136,"height":640},"child":[{"type":"Label","props":{"y":0,"x":0,"width":1136,"var":"closeBtn","height":640}},{"type":"Image","props":{"y":228,"x":371,"skin":"comp/shop/tip/chenggong.png"}},{"type":"Label","props":{"y":265,"x":398,"wordWrap":true,"width":339,"var":"msg","valign":"middle","text":"打扫","height":109,"fontSize":30,"color":"#81461a","bold":true,"align":"center"}}]};
		return shopTipResultUI;
	})(Dialog);
var userinfoUI=(function(_super){
		function userinfoUI(){
			
		    this.closeBtn=null;
		    this.headImg=null;
		    this.name=null;
		    this.number=null;
		    this.money=null;
		    this.voucher=null;
		    this.level=null;

			userinfoUI.__super.call(this);
		}

		CLASS$(userinfoUI,'ui.loaded.userinfoUI',_super);
		var __proto__=userinfoUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(userinfoUI.uiView);

		}

		userinfoUI.uiView={"type":"Dialog","props":{"width":1136,"height":640},"child":[{"type":"Image","props":{"y":97,"x":228,"skin":"comp/img/userinfo/gerenzhong--bg.png"}},{"type":"Image","props":{"y":39,"x":265,"skin":"comp/img/userinfo/Title.png"}},{"type":"Image","props":{"y":123,"x":807,"var":"closeBtn","skin":"comp/img/joinRoom/delete.png"}},{"type":"Image","props":{"y":428,"x":347,"width":198,"skin":"comp/img/userinfo/Gold--bg.png","height":57},"child":[{"type":"Image","props":{"y":1,"x":-26,"width":72,"skin":"comp/img/userinfo/Gold.png","height":59}}]},{"type":"Image","props":{"y":237,"x":363,"width":120,"var":"headImg","skin":"comp/loaded/userinfo/avatar.png","height":120}},{"type":"Image","props":{"y":428,"x":619,"width":191,"skin":"comp/img/userinfo/Voucher--bg.png","height":57},"child":[{"type":"Image","props":{"y":-1,"x":-14,"skin":"comp/img/userinfo/Voucher.png"}}]},{"type":"Label","props":{"y":237,"x":535,"width":233,"var":"name","text":"张三","height":53,"fontSize":25,"font":"Microsoft YaHei","color":"#fff","bold":true}},{"type":"Label","props":{"y":299,"x":535,"width":233,"var":"number","height":53,"fontSize":25,"font":"Microsoft YaHei","color":"#fff","bold":true}},{"type":"Label","props":{"y":428,"x":407,"width":113,"var":"money","valign":"middle","text":"1111","height":53,"fontSize":25,"font":"Microsoft YaHei","color":"#fff","bold":true}},{"type":"Label","props":{"y":428,"x":666,"width":113,"var":"voucher","valign":"middle","text":"2222","height":53,"fontSize":25,"font":"Microsoft YaHei","color":"#fff","bold":true}},{"type":"Image","props":{"y":224,"x":376,"width":149,"visible":false,"var":"level","height":147}},{"type":"Image","props":{"y":227,"x":357,"skin":"comp/img/userinfo/icon_frame_32.png"}}]};
		return userinfoUI;
	})(Dialog);
var loginUI=(function(_super){
		function loginUI(){
			
		    this.certainBtn=null;
		    this.username=null;
		    this.password=null;
		    this.remember=null;
		    this.goToRegist=null;
		    this.forget=null;
		    this.rememberFlag=null;
		    this.registBox=null;
		    this.icon1=null;
		    this.icon2=null;

			loginUI.__super.call(this);
		}

		CLASS$(loginUI,'ui.loginUI',_super);
		var __proto__=loginUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(loginUI.uiView);

		}

		loginUI.uiView={"type":"View","props":{"width":500,"height":752},"child":[{"type":"Image","props":{"y":0,"x":0,"width":500,"skin":"comp/img/start/bg.png","height":752}},{"type":"Image","props":{"y":57,"x":60,"width":278,"skin":"comp/img/start/word.png","height":72}},{"type":"Image","props":{"y":164,"x":22,"width":360,"skin":"comp/img/login/Login--bg.png","height":388},"child":[{"type":"Image","props":{"y":5,"x":90,"width":181,"skin":"comp/img/login/Login title.png","height":67}}]},{"type":"Image","props":{"y":322,"x":66,"width":277,"skin":"comp/img/login/White background.png","height":44}},{"type":"Image","props":{"y":257,"x":64,"width":277,"skin":"comp/img/login/White background.png","height":44}},{"type":"Image","props":{"y":431,"x":102,"width":201,"var":"certainBtn","skin":"comp/img/login/loginBtn.png","height":50}},{"type":"TextInput","props":{"y":255,"x":102,"width":241,"var":"username","type":"number","promptColor":"#999","prompt":"账号：","height":43,"fontSize":22,"font":"Microsoft YaHei","color":"#282020"}},{"type":"TextInput","props":{"y":320,"x":102,"width":243,"var":"password","type":"password","promptColor":"#999","prompt":"密码：","height":44,"fontSize":22,"font":"Microsoft YaHei","color":"#282020"}},{"type":"Image","props":{"y":391,"x":107,"width":71,"var":"remember","skin":"comp/login/jizhumima.png","height":19}},{"type":"Image","props":{"y":498,"x":268,"width":69,"var":"goToRegist","skin":"comp/login/qianwangzhuce.png","height":19}},{"type":"Image","props":{"y":498,"x":68,"width":82,"var":"forget","skin":"comp/login/wangjimima.png","height":19}},{"type":"Image","props":{"y":390,"x":69,"width":23,"var":"rememberFlag","skin":"comp/img/login/1.png","height":21}},{"type":"Box","props":{"y":0,"x":0,"visible":false,"var":"registBox"},"child":[{"type":"Image","props":{"y":0,"x":0,"width":402,"skin":"comp/img/start/bg.png","height":752}},{"type":"Image","props":{"y":176,"x":39,"width":332,"skin":"comp/img/login/Registered -bg.png","height":436}},{"type":"Image","props":{"y":283,"x":51,"width":307,"skin":"comp/login/shurukuang1.png","height":51}},{"type":"Image","props":{"y":369,"x":52,"width":309,"skin":"comp/login/shurukuang1.png","height":51}},{"type":"TextInput","props":{"y":284,"x":97,"width":261,"prompt":"请输入注册的手机号","name":"registName","height":49,"fontSize":22}},{"type":"TextInput","props":{"y":369,"x":95,"width":265,"prompt":"请输入注册的密码","name":"registPwd","height":50,"fontSize":22}},{"type":"Image","props":{"y":465,"x":100,"width":201,"skin":"comp/img/login/Immediate registration--button.png","name":"certainRegistBtn","height":50}},{"type":"Image","props":{"y":53,"x":62,"width":277,"skin":"comp/img/start/word.png","height":71}},{"type":"Image","props":{"y":175,"x":110,"width":181,"skin":"comp/img/login/Registered title.png","height":67}},{"type":"Label","props":{"y":558,"x":118,"width":166,"text":"已有账号，去登陆","name":"backBtn","height":31,"fontSize":18,"font":"Microsoft YaHei","color":"#fff","align":"center"}},{"type":"Image","props":{"y":381,"x":62,"width":20,"skin":"comp/img/login/Cipher icons.png","height":25}},{"type":"Image","props":{"y":292,"x":64,"width":17,"skin":"comp/img/login/Mobile Icon.png","height":27}}]},{"type":"Image","props":{"y":269,"x":75,"width":16,"var":"icon1","skin":"comp/img/login/Mobile Icon.png","height":24}},{"type":"Image","props":{"y":335,"x":74,"width":19,"var":"icon2","skin":"comp/img/login/Cipher icons.png","height":21}}]};
		return loginUI;
	})(View);
var login1UI=(function(_super){
		function login1UI(){
			
		    this.bg=null;
		    this.certainBtn=null;
		    this.username=null;
		    this.password=null;

			login1UI.__super.call(this);
		}

		CLASS$(login1UI,'ui.login1UI',_super);
		var __proto__=login1UI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(login1UI.uiView);

		}

		login1UI.uiView={"type":"View","props":{"width":1136,"height":1131},"child":[{"type":"Image","props":{"y":0,"x":0,"width":540,"var":"bg","skin":"comp/login/tuceng.png","height":752}},{"type":"Image","props":{"y":445,"x":1,"width":365,"var":"certainBtn","skin":"comp/login/denglu.png","height":56}},{"type":"Image","props":{"y":61,"x":32,"width":316,"skin":"comp/login/logo.png","height":72}},{"type":"Image","props":{"y":170,"x":16,"width":366,"skin":"comp/login/shurukuang1.png","height":48}},{"type":"TextInput","props":{"y":184,"x":53,"width":639,"var":"username","type":"number","promptColor":"#999","prompt":"账号：","maxChars":2,"height":72,"fontSize":50,"font":"Helvetica","color":"#000","bold":true}},{"type":"Image","props":{"y":533,"x":5,"width":361,"skin":"comp/login/zhaohuimima.png","height":58}},{"type":"Image","props":{"y":309,"x":11,"width":373,"skin":"comp/login/shurukuang1.png","height":55}},{"type":"TextInput","props":{"y":315,"x":62,"width":649,"var":"password","type":"password","promptColor":"#999","prompt":"密码：","height":68,"fontSize":50,"color":"#000","bold":true}}]};
		return login1UI;
	})(View);