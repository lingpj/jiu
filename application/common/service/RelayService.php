<?php
/**
 * Created by PhpStorm.
 * Author: zjh
 * Date: 2017-6-15 015
 * Time: 8:04
 */

namespace app\common\service;


use app\common\model\Activity;
use app\common\model\Relay;
use think\Db;
use think\Log;

class RelayService extends CommonService
{
	const IS_PAY = 1;
	const NOT_PAY = 0;
	const IS_SIGN = 1;//已标记
	const NOT_SIGN = 0;//未标记
	const IS_CLEAR = 1;//已清算
	const NOT_CLEAR = 0;//未清算
	const NOT_DELETE = 0;//未删除（退款）
	const IS_DELETE = 1;//已删除（退款）


	public function create($data){
		parent::create($data);
		$model = new Relay();
		return $model->insertGetId($data);
	}

	private function checkJoinAndActivity($member_id,$joiner_id){
		$model = new Relay();
		$joiner = $model->where('id',$joiner_id)
						->where('is_delete',self::NOT_DELETE)
						->find();
		if( ! $joiner){
			throw new \Exception('没有参与者');
		}else{
			$activity_id = $joiner['activity_id'];
			$act = new ActivityService();
			$action = $act->fetchByIdAndMember($activity_id,$member_id);
			if( ! $action){
				throw new \Exception('此活动不属于你');
			}
		}
	}

	public function updateLabel($member_id,$joiner_id,$label){
		$this->checkJoinAndActivity($member_id,$joiner_id);
		$model = new Relay();

		return $model->where('id',$joiner_id)
					->where('is_delete',self::NOT_DELETE)
					->update([
						'label'        => $label,
						'created_time' => date_normal()
					]);
	}

	public function countByActivity($activity_id){
		$count = Db::query('select count(r.id) as `count` from pay_record p,relay_record r where r.pay_id = p.id and r.activity_id = ? and p.pay_status = ? and r.is_delete = ?',
			[$activity_id,PayService::IS_PAY,self::NOT_DELETE]);

		return $count[0]['count'];
	}

	public function countJoinerPay($activity_id){
		$count = Db::query('select count(r.id) as `count` from pay_record p,relay_record r where r.pay_id = p.id and r.activity_id = ? and p.pay_status = ? and r.is_delete = ?',
			[$activity_id,PayService::IS_PAY,self::NOT_DELETE]);

		return $count[0]['count'];
	}

	public function fetchSumSubscription($activity_id){
		$sum = Db::query('select sum(p.money) as `sum` from pay_record p,relay_record r where r.pay_id = p.id and r.activity_id = ? and p.pay_status = ? and r.clear = ? and r.is_delete = ?',
			[$activity_id,PayService::IS_PAY,self::NOT_CLEAR,self::NOT_DELETE]);

		return $sum[0]['sum'];
	}

	public function fetchByActivity($activity_id,$pay_status){
		$records = Db::query('select r.* from pay_record p,relay_record r where r.pay_id = p.id and r.activity_id = ? and p.pay_status = ? and r.is_delete = ?',
			[$activity_id,$pay_status,self::NOT_DELETE]);

		return $records;
	}

	public function fetchPayNotClear($activity_id){
		$records = Db::name('relay_record')
			->alias('r')
			->join('pay_record p','p.id = r.pay_id')
			->where('p.pay_status',PayService::IS_PAY)
			->where('r.activity_id',$activity_id)
			->where('r.clear',self::NOT_CLEAR)
			->where('r.is_delete',self::NOT_DELETE)
			->field('r.*,p.money')
			->select();

		return $records;
	}

	public function fetchNotDelete($activity_id){
		$records = Db::name('relay_record')
			->alias('r')
			->join('pay_record p','p.id = r.pay_id')
			->where('p.pay_status',PayService::IS_PAY)
			->where('r.activity_id',$activity_id)
			->where('r.is_delete',self::NOT_DELETE)
			->field('r.*,p.money')
			->select();

		return $records;
	}

	public function updateClear($pay_record_id){
		$model = new Relay();

		$success = $model->where('id',$pay_record_id)
				->where('clear',self::NOT_CLEAR)
				->where('is_delete',self::NOT_DELETE)
				->update(['clear' => self::IS_CLEAR]);

		return $success;
	}

	public function fetchGameSet($activity_id){
		$model = new Activity();
		$one = $model->where('id',$activity_id)->find();
		if($one){
			return json_decode($one['game_set'],1);
		}else{
			return [];
		}
	}

	public function computeLevel($activity_id,$list){
		$game_set = $this->fetchGameSet($activity_id);
		rsort_by_key($game_set,'person');
		$count = count($list);
		$price = -1;
		foreach($game_set as $set){
			if($count >= $set['person']){
				$price = $set['person_price'];
			}
		}
		foreach($list as &$li){
			if($price < 0){
				$li['person_price'] = '无';
			}else{
				$li['person_price'] = $price;
			}
		}

		return $list;
	}

	public function searchByNameOrPhone($activity_id,$key){
		if($key){
			$records = Db::name('relay_record')
				->alias('r')
				->join('pay_record p','r.pay_id = p.id')
				->where('r.activity_id',$activity_id)
				->where('p.pay_status',self::IS_PAY)
				->where('r.name|r.phone','like',"{$key}%")
				->where('r.is_delete',self::NOT_DELETE)
				->field('r.*')
				->select();

			return $records;
		}else{
			return [];
		}
	}

	public function fetchByActivityAndOpenId($activity_id,$open_id){
		$model = new Relay();
		$record = $model->where('activity_id',$activity_id)
						->where('is_delete',self::NOT_DELETE)
						->where('open_id',$open_id)
						->find();

		if($record){
			return $record->toArray();
		}else{
			return [];
		}
	}

	//查询符合退款条件的用户
	public function fetchRefund($activity_id,$game_set){
		$records = Db::name('relay_record')
					->alias('r')
					->join('pay_record p','p.id = r.pay_id')
					->where('p.pay_status',PayService::IS_PAY)
					->where('r.activity_id',$activity_id)
					->where('r.clear',self::NOT_CLEAR)
					->where('r.is_delete',self::NOT_DELETE)
					->field('r.*,p.money,p.transaction_id')
					->select();

		$person_array = array_column($game_set,'person');
		sort($person_array);
		$person = array_get($person_array,0,false);

		if($person === false){
			return [];
		}else{
			if(count($records) < $person){
				return $records;
			}else{
				return [];
			}
		}
	}

	public function refund($transaction_id,$total_fee,$refund_fee,$id,$name,$money,$open_id,$activity_id,$member_id,$out_refund_no = null){
		$refund_service = new RefundService();

		list($out_refund_no,$exception) = $refund_service->refund($transaction_id,$total_fee,$refund_fee,$id,$out_refund_no);

		if($exception === null){
			$refund_data = [
				'name'           => $name,
				'money'          => $money,
				'open_id'        => $open_id,
				'transaction_id' => $transaction_id,
				'activity_id'    => $activity_id,
				'member_id'      => $member_id,
				'updated_time'   => date_normal(),
				'created_time'   => date_normal()
			];

			Db::startTrans();
			try{
				$success = $this->update($id,['is_delete' => self::IS_DELETE,'updated_time' => date_normal()]);
				if( ! $success){
					throw new \Exception('更新删除删除状态失败');
				}
				$success = DB::name('refund_record')->insertGetId($refund_data);
				if( !$success){
					throw new \Exception('保存退款日志失败');
				}
				Db::commit();
			}catch(\Exception $e){
				Db::rollback();
				Log::error($e->getMessage());
			}
		}else{
			$this->update($id,$out_refund_no);
			$message = $exception->getMessage();
			Log::error("微信退款失败：{$message}");
		}
	}

	public function update($id,$data){
		$data['updated_time'] = date_normal();
		$model = new Relay();
		$success = $model->where('id',$id)->update($data);

		return $success;
	}

	public function fetchByActivityAndOpenIdAndPay($activity_id,$open_id){
		$record = Db::name('relay_record')
			->alias('r')
			->join('pay_record p','r.pay_id = p.id')
			->where('r.open_id',$open_id)
			->where('r.activity_id',$activity_id)
			->where('p.pay_status',self::IS_PAY)
			->field('r.*')
			->find();

		return $record;
	}
}