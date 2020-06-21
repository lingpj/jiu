<?php
namespace app\common\controller;
use app\common\service\ActivityService;
use think\Controller;
use think\Request;
use think\Session;

/**
 * Created by PhpStorm.
 * Author: zjh
 * Date: 2017-5-29 029
 * Time: 15:50
 */
class CommonController extends Controller
{

	protected $notify_url;

	public function __construct(Request $request)
	{
		parent::__construct($request);

		$this->notify_url = config('weixin.notify_url');

		$module = strtolower($request->module());
		$controller = strtolower($request->controller());
		$action = strtolower($request->action());

		if($module == 'admin'){
			$this->buildMenu();
		}

		if($module == 'admin'){
			if($controller != 'index' && $action != 'login'){
				if( ! Session::has('admin')){
					$url = whole_url($request,url('index/index/notFound'));
					header("Location:{$url}");
				}
			}
		}

		if($module == 'member'){
			if($controller == 'make'){
				//action == index 是显示制作活动列表
				if($action != 'index'){
					if( ! Session::has('member')){
						$url = whole_url($request,url('index/index/login'));
						header("Location:$url");
						die;
					}
//					if(strpos($action,'make') !== false && $request->isPost()){
//						$expire = strtotime(session('member.expire_time'));
//						if(time() >= $expire){
//							$url = whole_url($request,url('member/profile/index'));
//							header("Location:{$url}");
//							die;
//						}
//					}
				}
			}else{
				if( ! Session::has('member')){
					$url = whole_url($request,url('index/index/login'));
					header("Location:$url");
					die;
				}
			}
		}
	}

	private function buildMenu(){
		$menu_list = config('menu_list');
		foreach($menu_list as &$list){
			$list['url'] = url($list['url']);
		}
		$this->assign('menu_list',$menu_list);
	}

	protected function memberHasActivity($member_id,$activity_id){
		$act = new ActivityService();
		$has = $act->memberHasActivity($member_id,$activity_id);

		return $has;
	}

	protected function microMessagePay($money,$ordernum,$body,$redirect = null){
		$money = abs($money);
		if($money == 0){
			$this->error('金额必须为正');
		}else{
			$money = 100 * $money;//元转化为分
		}

		require_once EXTEND_PATH.'wxpay'.DS.'example'.DS.'WxPay.JsApiPay.php';
		require_once EXTEND_PATH.'wxpay'.DS.'lib'.DS.'WxPay.Data.php';

		$out_trade_no = $ordernum;
		$totalAmount = $money;
		//①、获取用户openid
		$tools = new \JsApiPay();
		$openId = $this->getOpenId();
		//②、统一下单
		$input = new \WxPayUnifiedOrder();
		$input->SetBody($body);
		$input->SetAttach($body);
		$input->SetOut_trade_no($out_trade_no);
		$input->SetTotal_fee($totalAmount);
		$input->SetTime_start(date("YmdHis"));
		$input->SetTime_expire(date("YmdHis", time() + 600));
		$input->SetGoods_tag($body);
		$input->SetNotify_url($this->notify_url);
		$input->SetTrade_type("JSAPI");
		$input->SetOpenid($openId);
		$order = \WxPayApi::unifiedOrder($input);
		$jsApiParameters = $tools->GetJsApiParameters($order);

		$this->success([
			'msg'		=> '请支付',
			'pay_param' => $jsApiParameters,
			'redirect'	=> $redirect
		]);
	}

	protected function checkActivityTime($start_time,$end_time){
		if( ! is_numeric($start_time)){
			$start_time = strtotime($start_time);
		}
		if( ! is_numeric($end_time)){
			$end_time = strtotime($end_time);
		}

		$time = time();

		if($time <= $start_time){
			$this->error('活动未开始');
		}else if($time >= $end_time){
			$this->error('活动已结束');
		}

		return true;
	}

	public function protocol2(){
		$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
		return $protocol;
	}

	public function host(){
		return $_SERVER['HTTP_HOST'];
	}

	protected function requestUri(){
		return $_SERVER['REQUEST_URI'];
	}

	public function wholeUri(){
		return $this->protocol2().$this->host().$this->requestUri();
	}

	protected function returnCreateCode($success,$url = null){
		if($success){
			$this->success('添加成功',$url);
		}else{
			$this->error('添加失败',$url);
		}
	}

	protected function returnUpdateCode($success,$url = null){
		if($success){
			$this->success('更新成功',$url);
		}else{
			$this->error('更新失败',$url);
		}
	}

	protected function getOpenIdFromSession(){
		return session('open_id');
	}

	private function fetchAccessToken(){
		$uri = sprintf('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=%s&secret=%s',config('weixin.appid'),config('weixin.secret'));
		$json_str = file_get_contents($uri);
		$json = (array)json_decode($json_str);

		return isset($json['access_token']) ? $json['access_token'] : false;
	}

	//remember add visit Ip to white list
	public function fetchJsApiTicket($force = false){
		//fetch from cache file first
		$file = ROOT_PATH.'public/cache.conf';

		$fetch = function() use($file){
			$access_token = $this->fetchAccessToken();

			if($access_token){
				$uri = sprintf('https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=%s&type=jsapi',$access_token);
				$json_str = file_get_contents($uri);
				$json = (array)json_decode($json_str);

				if(isset($json['ticket'])){
					$cache = [
						'time' => time(),
						'token' => $access_token,
						'ticket' => $json['ticket']
					];
					//put ticket to cache file
					file_put_contents($file,serialize($cache));
					return $json['ticket'];
				}
			}else{
				return false;
			}
		};

		if($force){
			return $fetch();
		}

		if(file_exists($file)){
			$cache = file_get_contents($file);
			if($cache){
				$cache = unserialize($cache);
				if($cache['time'] < time() - 1.5 * 60 * 60){ //过期
					return $fetch();
				}else{
					return $cache['ticket'];
				}
			}else{
				return $fetch();
			}
		}else{
			return $fetch();
		}
	}

	public function getWeixinSign($force = false){
		$ticket = $this->fetchJsApiTicket($force);

		if($ticket){
			$nonceStr = uniqid();
			$timestamp = time();
			$url = $this->wholeUri();

			$string = "jsapi_ticket={$ticket}&noncestr={$nonceStr}&timestamp={$timestamp}&url={$url}";
			$signature = sha1($string);

			$sign_package = [
				'appId'		=> config('weixin.appid'),
				'nonceStr'	=> $nonceStr,
				'timestamp' => $timestamp,
				'url'		=> $url,
				'signature'	=> $signature
			];

			return $sign_package;
		}else{
			return false;
		}
	}

	protected function getOpenId(){
		if(config('online') == true){
			if(session('?open_id')){
				return session('open_id');
			}else{
				$request = $this->request;
				$weixin = config('weixin');

				if( ! $request->has('code')){
					$fetch_code_url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=%s&redirect_uri=%s&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect';
					$current_url = $_SERVER['REQUEST_SCHEME'].'://'.$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI'];
					$current_url = urlencode($current_url);
					$fetch_code_url = sprintf($fetch_code_url,$weixin['appid'],$current_url);
					header("Location:$fetch_code_url");
					exit();
				}else{
					$code = $request->param('code');
					$fetch_id_url  = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=%s&secret=%s&code=%s&grant_type=authorization_code';
					$fetch_id_url = sprintf($fetch_id_url,$weixin['appid'],$weixin['secret'],$code);
					$json_str = file_get_contents($fetch_id_url);
					$json = (array)json_decode($json_str);
					if(isset($json['errcode'])){
						throw new \Exception($json_str);
					}else{
						$open_id = $json['openid'];
					}

					session('open_id',$open_id);
					session('weixin',$json);
					return $open_id;
				}
			}
		}else{
			return 'test10';
		}
	}
}