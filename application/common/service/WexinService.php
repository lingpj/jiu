<?php
/**
 * Created by PhpStorm.
 * Author: zjh
 * Date: 2017-8-2 002
 * Time: 13:57
 */

namespace app\common\service;


class WexinService extends CommonService
{
	static public function getWeixinSign(){
		$redis = RedisService::getInstance();
		$jsapiTicket = $redis->get('ticket');

		$nonceStr = uniqid();
		$timestamp = time();

		$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
		$host = $_SERVER['HTTP_HOST'];
		$uri = $_SERVER['REQUEST_URI'];

		$url = join('',[$protocol,$host,$uri]);

		$string = "jsapi_ticket={$jsapiTicket}&noncestr={$nonceStr}&timestamp={$timestamp}&url={$url}";
		$signature = sha1($string);

		$sign_package = [
			'appId'		=> config('weixin.appid'),
			'nonceStr'	=> $nonceStr,
			'timestamp' => $timestamp,
			'url'		=> $url,
			'signature'	=> $signature
		];

		return $sign_package;
	}

}