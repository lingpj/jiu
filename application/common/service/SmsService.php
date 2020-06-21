<?php
/**
 * Created by PhpStorm.
 * Author: zjh
 * Date: 2017-6-4 004
 * Time: 9:49
 */

namespace app\common\service;


class SmsService extends CommonService
{

	static private $appKey = '2a6c09edbb4eaf1719a8dfd49c36f116';
	static private $appSecket = 'c0c0132d33d0';
	const RENEW_TEMPLATE = '3110047';//续费模板编号

	public static function test(){
		//网易云信分配的账号，请替换你在管理后台应用下申请的Appkey
		$AppKey = '2a6c09edbb4eaf1719a8dfd49c36f116';
//网易云信分配的账号，请替换你在管理后台应用下申请的appSecret
		$AppSecret = 'c0c0132d33d0';
		$p = new \app\common\service\ServerAPI($AppKey,$AppSecret,'fsockopen');     //fsockopen伪造请求

//发送模板短信
		print_r( $p->sendSMSTemplate('3054665','15036083625',array('0571')));
	}

	public static function send($phone){
		$AppKey = self::$appKey;
		$AppSecret = self::$appSecket;

		$p = new \app\common\service\ServerAPI($AppKey,$AppSecret,'fsockopen');
		$code = self::generateCode();
		$result = $p->sendSMSTemplate('3054665',$phone,['authCode' => $code]);
		if($result['code'] == '200'){
			return $result['obj'];
		}else{
			throw new \Exception("短信发送异常，错误代码{$result['code']}");
		}
	}

	public static function sendText($phone,$template_id,array $text){
		$p = new \app\common\service\ServerAPI(self::$appKey,self::$appSecket,'fsockopen');
		$result = $p->sendText($template_id,$phone,$text);
		if($result['code'] == '200'){
			return $result['obj'];
		}else{
			throw new \Exception("短信发送异常，错误代码{$result['code']}");
		}
	}

	public static function sendCode($phone){
		$code = self::generateCode(4);
		if(! session('?code_expire') || session('code_expire') >= time()){
			//send
			session('phone',$phone);
			session('code',$code);
			session('code_expire',time() + 60);
			return $code;
		}else{
			return '请在一分钟后重试';
		}
	}

	public static function verifyCode($phone,$code){
		$phone_str = session('phone');
		$code_str = session('code');
		if($phone == $phone_str && $code == $code_str){
			return true;
		}else{
			return false;
		}
	}

	public static function clearCode(){
		session('phone',null);
		session('code',null);
	}

	public static function generateCode($num = 4){
		$sms = random_integer($num);
		return $sms;
	}
}