<?php
/**
 * Created by PhpStorm.
 * Author: zjh
 * Date: 2017-6-13 013
 * Time: 21:45
 */

namespace app\common\service;

use app\common\model\Join;

class JoinService extends CommonService
{
	const IS_PAY = 1;
	const NOT_PAY = 0;
	const TYPE_OPEN = 'open';
	const TYPE_JOIN = 'join';

	public function searchNameOrPhone($activity_id,$key){
		if($key){
			$model = new Join();
			if(is_phone($key)){
				$records = $model->where('phone',$key)
							->where('activity_id',$activity_id)
							->field('member_info,phone,name,id,label,created_time')
							->select();
			}else{
				$records = $model->where('name','like',"{$key}%")
							->where('activity_id',$activity_id)
							->field('member_info,phone,name,id,label,created_time')
							->select();
			}
			if($records){
				$records = $records->toArray();
				$this->supplyMemberInfo($activity_id,$records);
				return $records;
			}else{
				return [];
			}
		}
		return [];
	}

	public function countHasJoinKinds($open_id,$father_id){
		$model = new Join();
		$number = $model->where('open_id',$open_id)
			->where('father_id',$father_id)
			->count();

		return $number;
	}

	public function activityByFatherAndOpen($open_id,$father_id){
		$model = new Join();
		$records = $model->where('father_id',$father_id)
						->where('open_id',$open_id)
						->field('activity_id,id,id as joiner_id')
						->select();
		if($records){
			return $records->toArray();
		}else{
			return [];
		}
	}

	public function fetchTotalJoinerByActivity($activity_id){
		$model = new Join();
		return $model->where('activity_id',$activity_id)->count();
	}

	public function fetchByActivity($activity_id){
		$model = new Join();
		$records = $model->where('activity_id',$activity_id)->select();
		if($records){
			$records = $records->toArray();
		}else{
			$records = [];
		}
		return $records;
	}

	public function fetchSumSubscription($activity_id){
		$model = new Join();
		return $model->where('activity_id',$activity_id)
					->where('is_pay',self::IS_PAY)
					->sum('subscription');
	}

	public function updateOpenId($join_id,$open_id){
		$model = new Join();
		$success = $model->where('id',$join_id)->update('open_id',$open_id);

		return $success;
	}

	public function fetchByIdAndOpenId($joiner_id,$open_id){
		$model = new Join();
		$one = $model->where('id',$joiner_id)
					->where('open_id',$open_id)
					->find();

		if($one){
			return $one->toArray();
		}else{
			return [];
		}
	}

	public function fetchByOpenId($open_id){
		$model = new Join();
		$one = $model->where('open_id',$open_id)->find();

		if($one){
			return $one->toArray();
		}else{
			return [];
		}
	}

	public function fetchByActivityAndOpenId($activity_id,$open_id){
		$model = new Join();
		$one = $model->where('activity_id',$activity_id)
					->where('open_id',$open_id)
					->find();

		if($one){
			return $one->toArray();
		}else{
			return [];
		}
	}

	public function fetchByFatherAndOpenId($father_id,$open_id){
		$model = new Join();
		$one = $model->where('father_id',$father_id)
			->where('open_id',$open_id)
			->find();

		if($one){
			return $one->toArray();
		}else{
			return [];
		}
	}

	public function isGroupLeader($joiner_id){
		$model = new Join();
		$count = $model->where('id',$joiner_id)
						->where('is_pay',self::IS_PAY)
						->where('parent_id',0)
						->where('tag','group')
						->count();

		return $count > 0;
	}

	public function fetchAGroup($leader_id){//leader_id is joiner_id,also table join's id
		$model = new Join();
		$records = $model->where('parent_id',$leader_id)
						->where('is_pay',self::IS_PAY)
						->where('tag','group')
						->order('created_time desc')
						->select();
		if($records){
			$records = $records->toArray();
		}else{
			$records = [];
		}

		$leader = $model->where('id',$leader_id)
			->where('is_pay',self::IS_PAY)
			->where('parent_id',0)
			->where('tag','group')
			->find();

		$leader = $leader->toArray();

		array_unshift($records,$leader);

		return $records;
	}

	public function fetchHasPayByActivity($activity_id){
		$model = new Join();
		$records = $model->where('activity_id',$activity_id)
					->where('is_pay',self::IS_PAY)
					->field('name,created_time')
					->order('created_time desc')
					->select();
		if($records){
			return $records->toArray();
		}else{
			return [];
		}
	}

	public function supplyNameForJoiner(&$array){
		$join = new JoinService();
		foreach($array as $index => &$item){
			$parent_id = $item['parent_id'];
			$joiner = $join->fetchById($parent_id);
			if($joiner){
				foreach(['phone','name','created_time','id','label'] as $key){
					$item[$key] = $joiner[$key];
				}
				$item['index'] = $index + 1;
			}
		}
	}

	public function hasJoinBeforeByPhone($activity_id,$phone){
		$model = new Join();
		return $model->where('activity_id',$activity_id)->where('phone',$phone)->count() > 0;
	}

	public function updateJoinerName($joiner_id,$name){
		//调用此方法前，应该检查是否是本人修改
		$model = new Join();
		$success = $model->where('id',$joiner_id)->update(['name' => $name]);
		return $success;
	}

	public function fetchTotalPrepayByActivity($activity_id){
		$model = new Join();
		return $model->where('activity_id',$activity_id)
					 ->where('is_pay',self::IS_PAY)
					->sum('subscription');
	}

	public function sort_as_key(&$array,$key){
		$bucket = [];
		foreach($array as $value){
			$bucket[$value[$key]] = $value;
		}
		ksort($bucket);
		$array = array_values($bucket);
	}

	public function rsort_as_key(&$array,$key){
		$bucket = [];
		foreach($array as $value){
			$bucket[$value[$key]] = $value;
		}
		krsort($bucket);
		$array = array_values($bucket);
	}

	public function isPay($activity_id){
		$model = new Join();
		$records = $model->where('activity_id',$activity_id)
			->where('is_pay',self::IS_PAY)
			->select();

		return $records;
	}


	public function completeGroup($activity_id,$group_set){
		$model = new Join();
		$records = $model->where('activity_id',$activity_id)
						->where('is_pay',self::IS_PAY)
						->where('parent_id',0)
						->select();

		if($records){
			$records = $records->toArray();
		}else{
			$records = [];
		}
		$this->rsort_as_key($group_set,'person');
		$ret = [];
		foreach($records as $record){
			$total = $model->where('id',$record['id'])->count() + 1;
			$record['members'] = $total;
			foreach($group_set as $set){
				$person = $set['person'];
				if($total >= $person){
					$record['person_price'] = $set['person_price'];
					$ret[] = $record;
					continue;
				}
			}
		}

		$this->rsort_as_key($ret,'members');

		return $ret;
	}

	public function notCompleteGroup($activity_id,$group_set){
		$model = new Join();
		$records = $model->where('activity_id',$activity_id)
			->where('is_pay',self::IS_PAY)
			->where('parent_id',0)
			->select();

		if($records){
			$records = $records->toArray();
		}else{
			$records = [];
		}

		$this->rsort_as_key($group_set,'person');
		$ret = [];
		foreach($records as $record){
			$total = $model->where('id',$record['id'])->count();
			$record['members'] = $total;
			$tag = false;
			foreach($group_set as $set){
				$person = $set['person'];
				if($total >= $person){
					$ret[] = $record;
					$tag = true;
				}
			}
			if($tag == false){
				$ret[] = $record;
			}
		}

		$this->rsort_as_key($ret,'members');

		return $ret;
	}

	public function fetchRecordsByActivity($activity_id,$page,$query){
		$model = new Join();
		$records = $model->where('activity_id',$activity_id)
					->paginate(config('paginate.list_rows'),true,[
						'page'	=> $page,
						'query'	=> $query
					]);

		if($records){
			$data = $records->toArray()['data'];
			$pagination = $records->render();
		}else{
			$data = [];
			$pagination = '';
		}

		return [$data,$pagination];
	}

	private function checkJoinAndActivity($member_id,$joiner_id){
		$model = new Join();
		$joiner = $model->where('id',$joiner_id)->find();
		if( ! $joiner){
			throw new \Exception('没有参与者');
		}else{
			$activity_id = $joiner['activity_id'];
			$act = new ActivityService();
			if( ! $act->memberHasActivity($member_id,$activity_id)){
				throw new \Exception('此活动不属于你');
			}
		}
	}

	public function updateName($member_id,$joiner_id,$name){
		$this->checkJoinAndActivity($member_id,$joiner_id);
		$model = new Join();
		//返回值不是标准
		return $model->where('id',$joiner_id)->update(['name' => $name]);
	}

	public function updateLabel($member_id,$joiner_id,$label){
		$this->checkJoinAndActivity($member_id,$joiner_id);
		$model = new Join();
		//返回值不是标准
		return $model->where('id',$joiner_id)->update(['label' => $label]);
	}

	public function fetchCountByActivity($activity_id,$pay_status){
		$model = new Join();
		return $model->where('activity_id',$activity_id)
					->where('is_pay',$pay_status)
					->count();
	}

	public function fetchByJoiner($phone,$name,$activity_id){
		$model = new Join();
		$record = $model->where('phone',$phone)
					->where('name',$name)
					->where('activity_id',$activity_id)
					->find();

		return $record;
	}

	public function fetchByPhoneAndActivity($phone,$activity_id){
		$model = new Join();
		$record = $model->where('phone',$phone)
			->where('activity_id',$activity_id)
			->find();

		return $record;
	}

	public function insertPayOrder($join_id,$subscription){
		$pay_order = time().uuid();
		$model = new Join();
		$success = $model->where('id',$join_id)->update([
			'pay_order'	 	=> $pay_order,
			'subscription'	=> $subscription
		]);

		if($success){
			return $pay_order;
		}else{
			return false;
		}
	}

	public function hasJoinBefore($activity_id,$phone,$name){
		$model = new Join();
		$record = $model->where('activity_id',$activity_id)
				  ->where('phone',$phone)
				  ->where('name','<>',$name)
				  ->find();

		return $record;
	}

	public function create($data){
		parent::create($data);
		$model = new Join();
		return $model->insertGetId($data);
	}

	public function insert($data){
		$model = new Join();
		return $model->insertGetId($data);
	}

	public function fetchById($id){
		$model = new Join();
		$record = $model->where('id',$id)
			->find();

		return $record;
	}

	public function increaseCount($joiner_id){
		$model = new Join();
		return $model->where('id',$joiner_id)->inc('count');
	}

	public function fetchByPage($activity_id,$page,$query){
		$model = new Join();
		$records = $model->where('activity_id',$activity_id)
						->paginate(config('paginate.list_rows'),true,[
							'page'	=> $page,
							'query'	=> $query
						]);

		if($records){
			$data = $records->toArray()['data'];
			$pagination = $records->render();
		}else{
			$data = [];
			$pagination = '';
		}

		return [$data,$pagination];
	}
}