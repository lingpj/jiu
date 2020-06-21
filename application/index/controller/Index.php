<?php
/**
 * 获取session的方式：
 * session('member');
 */
namespace app\index\controller;

use app\common\controller\CommonController;
use app\common\model\Pay;
use app\common\service\AuthUserService;
use app\common\service\ManagerService;
use app\common\service\ManualService;
use app\common\service\MemberService;
use app\common\service\PayLogService;
use app\common\service\PayService;
use app\common\service\SmsService;
use think\Session;
use think\Db;

class Index extends CommonController
{
	const PAYWAY_WEIXIN = 1;
	const PAYWAY_ALI = 2;

	private function sign($force = false){
		$sign = $this->getWeixinSign($force);
		$sign['number'] = $this->request->param('number','');
		$sign['uri'] = $this->protocol2().$this->host().'/bin/way.html';
		$sign['img'] = config('domain').'static/img/logo.jpg';

		return $sign;
	}

	public function saveParentId(){
		$parent_id = $this->request->param('parent_id',0);
		session('game_parent_id',$parent_id);
	}

	public function getParentId(){
		$parent_id = session('?game_parent_id') ? session('game_parent_id') : 0;
		return json(['parent_id' => $parent_id]);
	}

	public function r(){
		$record = Db::name("robot")->where("id > 0")->find();
		if( ! $record){
			echo 0;die;
		}else{
			echo $record['open'];die;
		}
	}

	private function isWeixin(){
		return strpos($_SERVER['HTTP_USER_AGENT'], 'MicroMessenger') !== false;
	}

	public function index2()
	{
		if($this->request->isGet()){
			if($this->isWeixin()){
				if($this->request->param('from') == 'weixin'){
					try{
						$info = $this->weixinAvatar();
					}catch (\Exception $e){
						$this->redirect($this->protocol2().$this->host().'/bin/way.html?way=weixin');
						die;
					}

					if(is_array($info)){
						//获取到了微信登录的信息
						$sign = $this->sign();
						foreach($info as $k => $v){
							$sign[$k] = $v;
						}
					}
				}else{
					$sign = $this->sign();
					session('sign_package',$sign);
					$way = $this->request->param('way','weixin');
					$number = isset($sign['number']) ? $sign['number'] : '';
					if($way == 'weixin'){
						$redirect_url = urlencode(config('domain').'index/index/index2?from=weixin&number='.$number);
						$url = sprintf('https://open.weixin.qq.com/connect/oauth2/authorize?appid=%s&redirect_uri=%s&response_type=code&scope=snsapi_userinfo,snsapi_login&state=STATE#wechat_redirect',config('weixin.appid'),$redirect_url);
						header('Location:'.$url);
						die;
					}
				}
			}

			if(isset($sign)){
				$this->assign('sign_package',$sign);
			}

			return $this->fetch('index2');
		}else{
			if($this->isWeixin()){
				return json($this->sign(true));
			}
		}
	}

	public function weixinconfig(){
		$value = session('sign_package');
		$bak = $value;
		unset($bak['number']);

		session('sign_package',$bak);

		return json($value);
	}

	public function weixinLogin(){
		$redirect_url = urlencode(config('domain').'index/index/weixinAvatar');
		//https://open.weixin.qq.com/connect/qrconnect
		$url = sprintf('https://open.weixin.qq.com/connect/oauth2/authorize?appid=%s&redirect_uri=%s&response_type=code&scope=snsapi_userinfo,snsapi_login&state=STATE#wechat_redirect',config('weixin.appid'),$redirect_url);
		header('Location:'.$url);
		die;
	}

	public function weixinAvatar(){
		$request = $this->request;
		$code = $request->param('code');

		if($code){
			$appid = config('weixin.appid');
			$secret = config('weixin.secret');
			$access_token_str = file_get_contents("https://api.weixin.qq.com/sns/oauth2/access_token?appid={$appid}&secret={$secret}&code={$code}&grant_type=authorization_code");
			$access_token_json = json_decode($access_token_str,true);
			if($access_token_json){
				$access_token = $access_token_json['access_token'];
				$openid = $access_token_json['openid'];
				$avatar_url = "https://api.weixin.qq.com/sns/userinfo?access_token={$access_token}&openid={$openid}";
				$avatar_str = file_get_contents($avatar_url);
				$avatar_json = json_decode($avatar_str,true);

				if($avatar_json){
					$nickname = $avatar_json['nickname'];
					$sex = $avatar_json['sex'];
					$head_img_url = urlencode($avatar_json['headimgurl']);

					$data = [
						'open_id' => $openid,
						'nickname' => $nickname,
						'sex' => $sex,
						'head_img_url' => $head_img_url
					];

					return $data;
				}else{
					dump("获取用户信息失败");
				}
			}else{
				dump("获取access_token错误");
			}
		}else{
//			$this->redirect('/');
		}
	}

	public function weixinSession(){
		return json(Session::pull('weixin_avatar'));
	}

	public function manualDownload(){
		$round_record_id = $this->request->param('id');
		$manual_service = new ManualService();
		$record = $manual_service->manualByRound($round_record_id);
		if($record){
			$round = Db::name('auth_chess_record')->where('round_record_id',$round_record_id)->find();
			$player1 = Db::name('auth_user')->where('id',$round['user_id'])->find()['nickname'];
			$player2 = Db::name('auth_user')->where('id',$round['oppose_uid'])->find()['nickname'];
			$score = $round['score'];

			if($score > 0){
				$result = '胜';
			}else if($score < 0){
				$result = $score < -1 ? '负' : '和';
			}

			if($record['role_list'] != '{1,2}'){
				$tmp = $player1;
				$player1 = $player2;
				$player2 = $tmp;
				$result = ($result != '和' ? ($result == '胜' ? '负':'胜') : $result);
			}

			$filename = date('Y-m-d H:i')."_{$player1}{$result}{$player2}.txt";
			header('Content-Disposition: attachment; filename="'.$filename.'"');
			echo "对战时间:{$record['create_time']}，双方得分：{$record['score_list']},棋谱:\n";
			echo $record['round_str_list'];
		}else{
			header('Content-Disposition: attachment; filename=文件不存在');
		}
		die;
	}

	public function updateBrowser(){
		return $this->fetch('update_browser');
	}

	private function generateTradeNo($fee,$way,$user_id){
		$pay_service = new PayService();
		$trade_no = uuid();

		$last_id = $pay_service->create([
			'trade_no'       => $trade_no,
			'pay_status'     => PayService::NOT_PAY,
			'fee'            => $fee,
			'transaction_id' => '',
			'user_id'        => $user_id,
			'way' 			 => $way,
			'created_time'   => date_normal()
		]);

		if($last_id){
			return $trade_no;
		}else{
			$this->error("生成trade_no失败，请重试");
		}
	}

	private function weixinPay($fee,$user_id){
		require_once EXTEND_PATH.'wxpay'.DS.'lib'.DS.'WxPay.Api.php';
		require_once EXTEND_PATH.'wxpay'.DS.'example'.DS.'WxPay.NativePay.php';
		require_once EXTEND_PATH.'wxpay'.DS.'example'.DS.'log.php';

		$body = '中国象棋';

		$notify = new \NativePay();
		$input = new \WxPayUnifiedOrder();
		$input->SetBody($body);
		$input->SetAttach($body);

		$trade_no = $this->generateTradeNo($fee / 100,self::PAYWAY_WEIXIN,$user_id);

		$input->SetOut_trade_no($trade_no);
		$input->SetTotal_fee($fee);
		$input->SetTime_start(date("YmdHis"));
		$input->SetTime_expire(date("YmdHis", time() + 600));
		$input->SetGoods_tag($body);
		$input->SetNotify_url(config('weixin.notify_url'));
		$input->SetTrade_type("NATIVE");
		$input->SetProduct_id("1");
		$result = $notify->GetPayUrl($input);
		$url = 'http://paysdk.weixin.qq.com/example/qrcode.php?data='.urlencode($result["code_url"]);
		$key = uuid();
		$path = ROOT_PATH.'public'.DS.'upload'.DS;
		if( ! is_dir(ROOT_PATH.'public')){
			mkdir($path = ROOT_PATH.'public');
		}
		file_put_contents($path.$key.'.png',file_get_contents($url));

		return [$trade_no,$key];
	}

	public function weixinPayQrCode(){
		$key = $this->request->param('key');
		header('Content-type:img/png');
		echo Session::get($key);
		die;
	}

	public function aliPay(){

		$request = $this->request;

		$trade_no = $request->param('trade_no',0);

		$pay_service = new PayService();
		$record = $pay_service->fetchByTradeNo($trade_no);

		if( ! $record){
			$this->error('trade_no not exists');
		}

		$sdk_path = EXTEND_PATH.'alipay'.DS;

		require_once $sdk_path.'config.php';
		require_once $sdk_path.'pagepay'.DS.'service'.DS.'AlipayTradeService.php';
		require_once $sdk_path.'pagepay'.DS.'buildermodel'.DS.'AlipayTradePagePayContentBuilder.php';

		//商户订单号，商户网站订单系统中唯一订单号，必填
		$out_trade_no = $trade_no;

		//订单名称，必填
		$subject = '中国象棋';

		//付款金额，必填
		$total_amount = $record['fee'];

		//商品描述，可空
		$body = '中国象棋积分充值';

		//构造参数
		$payRequestBuilder = new \AlipayTradePagePayContentBuilder();
		$payRequestBuilder->setBody($body);
		$payRequestBuilder->setSubject($subject);
		$payRequestBuilder->setTotalAmount($total_amount);
		$payRequestBuilder->setOutTradeNo($out_trade_no);

		$aop = new \AlipayTradeService($config);

		/**
		 * pagePay 电脑网站支付请求
		 * @param $builder 业务参数，使用buildmodel中的对象生成。
		 * @param $return_url 同步跳转地址，公网可以访问
		 * @param $notify_url 异步通知地址，公网可以访问
		 * @return $response 支付宝返回的信息
		 */
		$response = $aop->pagePay($payRequestBuilder,$config['return_url'],$config['notify_url']);

		//输出表单
		var_dump($response);

		die;
	}

	//支付，返回trade_no和二维码
	public function pay(){
		$request = $this->request;
		if($request->isPost()){
			$error = $this->validate($request->param(),[
				'user_id' => 'require|number',
				'fee'     => 'require|number',
				'way'     => 'require|number|in:1,2',//1 == weixin , 2 == alipay
			]);

			if($error !== true){
				$this->error($error);
			}

//			return json(['url' => 'http://sznews.com/photo/images/attachement/jpg/site3/20151015/4439c452e8ec1789371e26.jpg']);

			$way = $request->param('way');
			$fee = $request->param('fee');
			$user_id = $request->param('user_id');
			$user = (new AuthUserService())->fetchById($user_id);

			if( ! $user){
				$this->error('用户不存在');
			}

			if($way == 1){
				list($trade_no,$url) = $this->weixinPay($fee * 100,$user_id);
				return json(['url' => $url]);
				$this->success('image url',null,['url' => $url]);
			}else{
				$trade_no = $this->generateTradeNo($fee,self::PAYWAY_ALI,$user_id);
				$url = whole_url($request,url('index/index/aliPay'),['trade_no' => $trade_no]);
				$this->success('success',null,['redirect' => $url]);
			}
		}
	}

	private function logFileName(){
		return date('Ymd').'_pay.log';
	}

	public function weixin_pay_test(){
		return $this->fetch('weixin_pay_test');
	}

	//支付的回调处理
	public function weixin_notify(){
		//<xml><appid><![CDATA[wx22e28f824d34e57a]]></appid>
		//<attach><![CDATA[test]]></attach>
		//<bank_type><![CDATA[CFT]]></bank_type>
		//<cash_fee><![CDATA[1]]></cash_fee>
		//<fee_type><![CDATA[CNY]]></fee_type>
		//<is_subscribe><![CDATA[Y]]></is_subscribe>
		//<mch_id><![CDATA[1483654002]]></mch_id>
		//<nonce_str><![CDATA[7you09oymw2kwkbubs7s3cnzpuanx2gx]]></nonce_str>
		//<openid><![CDATA[omnaHwQ_QdJqZeQSl97S56yI_8WU]]></openid>
		//<out_trade_no><![CDATA[148365400220171019164456]]></out_trade_no>
		//<result_code><![CDATA[SUCCESS]]></result_code>
		//<return_code><![CDATA[SUCCESS]]></return_code>
		//<sign><![CDATA[1B90D4BD9FD1F2A6FABB4DD6735B1905]]></sign>
		//<time_end><![CDATA[20171019164511]]></time_end>
		//<total_fee>1</total_fee>
		//<trade_type><![CDATA[NATIVE]]></trade_type>
		//<transaction_id><![CDATA[4200000029201710199022060677]]></transaction_id>
		//</xml>

		require_once EXTEND_PATH.'wxpay'.DS.'WeixinpayNotify.php';
		require_once EXTEND_PATH.'wxpay'.DS.'lib'.DS.'WxPay.Api.php';
		require_once EXTEND_PATH.'wxpay'.DS.'lib'.DS.'WxPay.Data.php';

		$notify = new \pay\wxpay\WeixinpayNotify();
		$params = $notify->parseXml();
		$verifyResult = $this->weixinVerify($params);
		$pay_service = new PayService();
		//和数据库中的数据对比
		$record = $pay_service->fetchByTradeNo($params['out_trade_no']);
		$data_verify_result = $record && $record['fee'] == $params['total_fee'] / 100;

		PayLogService::write($this->logFileName(),$params);
		PayLogService::write($this->logFileName(),'查询订单验证结果:'.$verifyResult);
		PayLogService::write($this->logFileName(),'查询数据库验证结果:'.$data_verify_result);

		if($verifyResult && $data_verify_result){
			$score = $this->feeToScore($params['total_fee'] / 100);
			$add_score_success = $pay_service->addScore($params['out_trade_no'],$score);
			PayLogService::write($this->logFileName(),'inc积分验证结果:'.$add_score_success);
			if($add_score_success){
				echo 'success';
				die;
			}
		}
	}

	private function feeToScore($fee){
		$rule = config('recharge');//配置文件在index/config.php
		$score = isset($rule[$fee]) ? $rule[$fee] : 0.01;
		return $score;
	}

	private function weixinVerify($params){
		$input = new \WxPayOrderQuery();
		$input->SetTransaction_id($params['transaction_id']);
		$result = \WxPayApi::orderQuery($input);

		if (array_key_exists("return_code", $result)
			&& array_key_exists("result_code", $result)
			&& $result["return_code"] == "SUCCESS"
			&& $result["result_code"] == "SUCCESS") {

			return true;
		}

		return false;
	}

	private function aliVerify(){
		PayLogService::write($this->logFileName(),$_POST);

		$sdk_path = EXTEND_PATH.'alipay'.DS;

		require_once $sdk_path.'config.php';
		require_once $sdk_path.'pagepay'.DS.'service'.DS.'AlipayTradeService.php';
		require_once $sdk_path.'pagepay'.DS.'buildermodel'.DS.'AlipayTradePagePayContentBuilder.php';

		$out_trade_no = trim($_POST['WIDTQout_trade_no']);

		//支付宝交易号
		$trade_no = trim($_POST['WIDTQtrade_no']);

		//二选一设置

		$RequestBuilder = new \AlipayTradeQueryContentBuilder();
		$RequestBuilder->setOutTradeNo($out_trade_no);
		$RequestBuilder->setTradeNo($trade_no);

		$aop = new \AlipayTradeService($config);

		$response = $aop->Query($RequestBuilder);

		//解析response 如果结果为,"trade_status":"TRADE_SUCCESS",证明交易成功
		var_dump($response);
		//提取trade_no和fee
		return [1,1,0];
	}

	public function aliSuccess(){
		return $this->fetch('ali_success');
	}

	public function aliNotify(){
		list($trade_no,$fee) = $this->aliVerify();

		if($trade_no){
			$pay_record = (new PayService())->fetchByTradeNo($trade_no);
			$data_verify_success = $pay_record && $pay_record['fee'] == $fee;

			PayLogService::write($this->logFileName(),"ali订单验证trade_no：".$trade_no);
			PayLogService::write($this->logFileName(),"ali数据库验证：".$data_verify_success);

			if($data_verify_success){
				$pay_service = new PayService();
				$score = $this->feeToScore($fee);
				$success = $pay_service->addScore($trade_no,$score);
				PayLogService::write($this->logFileName(),"ali增加积分结果：".$success);
			}
		}else{
			PayLogService::write($this->logFileName(),"ali订单验证trade_no失败");
		}
	}

	//检查某个trade_no是否已经付款完毕
	public function checkPay(){
		$request = $this->request;
		$error = $this->validate($request->param(),[
			'trade_no' => 'require'
		]);
		if($error !== true){
			$this->error($error);
		}

		$pay_service = new PayService();
		$result = $pay_service->fetchByTradeNo($request->param('trade_no'));

		if($result){
			$this->success('success',null,['pay_status' => $result['pay_status']]);
		}else{
			$this->error('error');
		}
	}

	public function score(){
		$request = $this->request;
		$error = $this->validate($request->param(),[
			'user_id' => 'require|number'
		]);
		if($error !== true){
			$this->error($error);
		}

		$user_service = new AuthUserService();
		$user = $user_service->fetchById($request->param('user_id'));

		if($user){
			return json(['score' => $user['score']]);
			$this->success('success',null,['score' => $user['score']]);
		}else{
			$this->error('用户不存在');
		}
	}

	public function notFound(){
		return '404';
	}

	public function forget(){
		$request = $this->request;
		if($request->isGet()){
			$this->assign('seo_title','忘记密码');
		}else{
			$validation = $this->validate($request->param(),[
				'phone|手机号' => 'require|number|length:11',
				'code|验证码'  => 'require|number|length:4',
				'password|密码' => 'require|length:6,20'
			]);
			if($validation !== true){
				$this->error($validation);
			}
			$phone = $request->param('phone');
			$code = $request->param('code');
			$password = $request->param('password');
			if( ! SmsService::verifyCode($phone,$code)){
				$this->error('不能通过验证');
			}
			$member_service = new MemberService();
			$has = $member_service->hasPhone($request->param('phone'));
			if( ! $has){
				$this->error('此手机号没有注册');
			}
			$password = str_encode($password);
			$member_service->updatePasswordByPhone($phone,$password);
			//可以直接判断成功，因为用户输入密码可能与原始密码相同
			$this->success('重置密码成功',url('index/index/login'));
		}

		return $this->fetch();
	}

	public function protocol(){
		return $this->fetch();
	}

	public function makeNotice(){
		return $this->fetch('make_notice');
	}

	private function setSession($value){
		Session::set('member',$value);
	}

	private function isWeChat(){
		$agent = $this->request->server('http_user_agent');
		return strpos($agent,'MicroMessenger') !== false;
	}
}
