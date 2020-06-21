<?php
/**
 * Created by PhpStorm.
 * Author: zjh
 * Date: 2017-7-6 006
 * Time: 10:55
 */

namespace app\common\service;


use app\common\model\Pay;
use think\Db;

class PayService extends CommonService
{
	const IS_PAY = 1;
	const NOT_PAY = 0;

	public function create($data){
		$model = new Pay();
		return $model->insert($data);
	}

	public function addScore($trade_no,$score){
		$model = new Pay();
		$user_service = new AuthUserService();
		$pay_record = $model->where('trade_no',$trade_no)->find();
		$user_id = $pay_record['user_id'];
		Db::startTrans();

		try{
			$success = $model->where("trade_no",$trade_no)->where('pay_status',self::NOT_PAY)->update(['pay_status' => self::IS_PAY]);
			if($success){
				//add score action
				$success = $user_service->increaseScore($user_id,$score);
				if($success){
					//更新redis内score
					$record = $user_service->fetchById($user_id);
					$redis = RedisService::getInstance();
					$redis->hSet('auth:user:'.$user_id,'score',$record['score']);
					//插入一条公告消息
					$date = date('Y-m-d H:i:s',strtotime($pay_record['created_time']));
					Db::name('auth_message')->insert([
						'user_id' => $user_id,
						'title' => '充值成功',
						'content' => "您在{$date}充值{$pay_record['fee']}元",
						'create_time' => date_normal()
					]);
					Db::commit();
				}else{
					throw new \Exception('add score fail');
				}
			}else{
				throw new \Exception('update pay_status fail');
			}
		}catch(\Exception $e){
			Db::rollback();
			\think\Log::error('支付错误:'.$e->getMessage());
			return false;
		}

		return true;
	}

	public function updatePayStatus($ordernum,$pay_status){
		$model = new Pay();
		return $model->where('ordernum',$ordernum)
				->update(['pay_status' => $pay_status]);
	}

	public function updateByTradeNo($trade_no,$data){
		$model = new Pay();
		$model->where('trade_no',$trade_no)->update($data);
	}

	public function fetchByTradeNo($trade_no){
		$model = new Pay();
		return $model->where('trade_no',$trade_no)->find();
	}

	public function updateStatusByCondition($ordernum,$transaction_id,$money){
		$model = new Pay();

		return $model->where('ordernum',$ordernum)
					->where('pay_status',self::NOT_PAY)
					->where('money',$money)
					->update([
						'pay_status' 	=> self::IS_PAY,
						'transaction_id'=> $transaction_id,
						'updated_time' 	=> date_normal()
					]);
	}


	public function fetchById($pay_id){
		$model = new Pay();
		$record = $model->where('id',$pay_id)->find();
		if($record){
			return $record->toArray();
		}else{
			return [];
		}
	}

}