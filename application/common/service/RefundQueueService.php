<?php
/**
 * Created by PhpStorm.
 * Author: zjh
 * Date: 2017-8-28 028
 * Time: 13:34
 */

namespace app\common\service;

class RefundQueueService extends CommonService
{
	private $key = 'refund_list_we_chat';
	//连续运行多久,这取决于定时任务(ctrontab)多久执行一次
	//运行时间的设置应该较多小于定时任务的执行时间间隔
	private $time = 40;

	public function inQueue($activity_id){
		$redis = RedisService::getInstance();
		$length = $redis->lLen($this->key);
		if($length > 1000){
			throw new \Exception('队列忙，请稍后再试');
		}else{
			$records = $redis->lRange($this->key,0,-1);
			foreach($records as $record){
				$record = unserialize($record);
				if($record['activity_id'] == $activity_id){
					return true;
				}
			}
			return false;
		}
	}

	public function push(array $array){
		$redis = RedisService::getInstance();
		foreach($array as $arr){
			$redis->lPush($this->key,serialize($arr));
		}
	}

	public function handle(){
		$redis = RedisService::getInstance();
		$time = time() + $this->time;

		while(time() < $time){
			$value = $redis->rPop($this->key);
			if($value){
				$value = unserialize($value);
				(new RelayService())->refund(
					$value['transaction_id'],
					$value['total_fee'],
					$value['refund_fee'],
					$value['id'],
					$value['name'],
					$value['money'],
					$value['open_id'],
					$value['activity_id'],
					$value['member_id'],
					array_get($value,'out_fund_no',null)
				);
			}
		}
	}
}