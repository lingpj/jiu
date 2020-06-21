<?php
/**
 * Created by PhpStorm.
 * Author: zjh
 * Date: 2017-5-30 030
 * Time: 10:12
 */

namespace app\common\service;


use Credis\Credis;

class RedisService
{
	private static $instance = null;

	private function __construct()
	{

	}

	private function __clone()
	{
		// TODO: Implement __clone() method.
	}

	public static function getInstance(){
		$redis = new Credis(config('redis'));
		return $redis->getInstance();
	}
}