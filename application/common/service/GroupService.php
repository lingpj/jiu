<?php
/**
 * Created by PhpStorm.
 * Author: zjh
 * Date: 2017-7-1 001
 * Time: 18:02
 */

namespace app\common\service;


use app\common\model\Group;
use Symfony\Component\Yaml\Tests\DumperTest;
use think\Db;

class GroupService extends CommonService
{
	const IS_PAY = 1;
	const NOT_PAY = 0;
	const IS_CLEAR = 1;
	const NOT_CLEAR = 0;
	const NOT_DELETE = 0;//没有删除
	const IS_DELETE = 1;//已经删除

	public function searchNameOrPhone($activity_id,$key){
		if($key){
			$model = new Group();
			if(is_phone($key)){
				$records = $model->where('phone',$key)
								->where('is_delete',self::NOT_DELETE)
								->where('activity_id',$activity_id)->select();
			}else{
				$records = $model->where('name','like',"{$key}%")
								->where('is_delete',self::NOT_DELETE)
								->where('activity_id',$activity_id)->select();
			}
			if($records){
				return $records->toArray();
			}else{
				return [];
			}
		}else{
			return [];
		}
	}
	//查询指定member和id的已经支付且没有被删除的参与者
	public function fetchNotDelete($id,$member_id){
		$record = Db::name('group_record')
				->alias('g')
				->join('pay_record p','g.pay_id = p.id')
				->join('activity a','a.id = g.activity_id')
				->where('a.member_id',$member_id)
				->where('g.is_delete',self::NOT_DELETE)
				->where('g.id',$id)
				->field('a.group_set,
				p.transaction_id,
				g.name,
				p.money,
				p.open_id,
				p.ordernum,
				a.id as activity_id,
				a.member_id,
				g.id,
				a.start_time,
				a.end_time,
				p.created_time,
				g.parent_id')
				->find();

		return $record;
	}

	//将指定成员升级为团长,并且指定其他成员的新团长
	//请注意升级前应检查此人是否符和条件，此函数并不负责判断
	public function promoteLeader($old_id,$new_id){
		$model = new Group();
		$date = date_normal();

		//注意2个操作数据库的顺序
		$change_leader_success = $model->where('parent_id',$old_id)->update([
			'parent_id' => $new_id,
			'updated_time' => $date
		]);

		$make_leader_success = $model->where('id',$new_id)->update([
			'parent_id'	=> 0,
			'updated_time' => $date
		]);

		return $change_leader_success && $make_leader_success;
	}

	public function softDelete($id){
		$model = new Group();

		return $model->where('id',$id)->update([
			'is_delete'    => self::IS_DELETE,
			'updated_time' => date_normal()
		]);
	}

	private function checkJoinAndActivity($member_id,$joiner_id){
		$model = new Group();
		$joiner = $model->where('id',$joiner_id)->where('is_delete',self::NOT_DELETE)->find();
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
		$model = new Group();

		return $model->where('id',$joiner_id)
					->where('is_delete',self::NOT_DELETE)
					 ->update([
						 'label'        => $label,
						 'updated_time' => date_normal()
					 ]);
	}

	public function updateName($member_id,$joiner_id,$name){
		$this->checkJoinAndActivity($member_id,$joiner_id);
		$model = new Group();
		return $model->where('id',$joiner_id)
			 		->where('is_delete',self::NOT_DELETE)
					->update([
						'name'         => $name,
						'updated_time' => date_normal()
					]);
	}

	public function fetchMembers($id,$activity_id){
		//只查询已经付过款的成员,包括团长
		$id = intval($id);
		$records = Db::table('group_record')
			->alias('g')
			->join('pay_record p','g.pay_id = p.id')
			->where('g.activity_id',$activity_id)
			->where('p.pay_status',PayService::IS_PAY)
			->where("g.parent_id = {$id} or g.id = {$id}")
			->where('g.is_delete',self::NOT_DELETE)
			->field('g.*')
			->select();

		$this->supplyMemberInfo($activity_id,$records);

		return $records;
	}

	public function create($data){
		parent::create($data);
		$model = new Group();
		return $model->insertGetId($data);
	}

	public function has($activity_id){
		$model = new Group();
		$record = $model->where('activity_id',$activity_id)
						->where('is_delete',self::NOT_DELETE)
						->find();

		return ! empty($record);
	}

	public function fetchByActivityAndOpenId($activity_id,$open_id){
		$model = new Group();
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

	public function fetchByActivityAndOpenIdAndPay($activity_id,$open_id,$pay_status){
		$record = Db::table('group_record')
			->alias('g')
			->join('pay_record p','g.pay_id = p.id')
			->where('g.open_id',$open_id)
			->where('g.activity_id',$activity_id)
			->where('p.pay_status',$pay_status)
			->where('g.is_delete',self::NOT_DELETE)
			->field('g.*')
			->find();

		return $record;
	}

//	public function fetchGroup($leader_id,$activity_id){
//		$leader = Db::query('select g.*,p.pay_status from group_record g,pay_record p where p.id = g.pay_id and g.activity_id = ? and g.parent_id = 0 and p.pay_status = ? and g.id = ? and g.is_delete = ? limit 1',
//			[$activity_id,PayService::IS_PAY,$leader_id,self::NOT_DELETE]);
//
//		if($leader){
//			$leader = $leader[0];
//		}else{
//			return [];
//		}
//
//		$records = Db::query('select g.*,p.pay_status from group_record g,pay_record p where p.id = g.pay_id and g.activity_id = ? and g.parent_id <> 0 and p.pay_status = ? and g.is_delete = ? order by time desc',
//			[$activity_id,PayService::IS_PAY,self::NOT_DELETE]);
//
//
//		if( ! $records){
//			$records = [];
//		}
//
//		array_unshift($records,$leader);
//
//		return $records;
//	}

	/**
	 * 判断是会否是团员
	 * @param $activity_id
	 * @param $open_id
	 */
	public function isMember($activity_id,$open_id,$pay_status = null)
	{
		$model = new Group();

		if(is_null($pay_status)){
			$record = $model->where('activity_id',$activity_id)
				->where('open_id',$open_id)
				->where('parent_id','<>',0)
				->find();
		}else{
			$record = Db::query('select g.*,p.pay_status from group_record g,pay_record p where p.id = g.pay_id and g.activity_id = ? and g.parent_id <> 0 and g.open_id = ? and p.pay_status = ? and g.is_delete = ? limit 1',
				[$activity_id,$open_id,$pay_status,self::NOT_DELETE]);
			if($record){
				return $record[0];
			}else{
				return [];
			}
		}

		if($record){
			return $record->toArray();
		}else{
			return false;
		}
	}

	public function isLeader($activity_id,$open_id,$pay_status = null){
		$model = new Group();

		if(is_null($pay_status)){
			$record = $model->where('activity_id',$activity_id)
				->where('open_id',$open_id)
				->where('parent_id',0)
				->find();
		}else{
			$record = Db::query('select g.*,p.pay_status from group_record g,pay_record p where p.id = g.pay_id and g.activity_id = ? and g.parent_id = 0 and g.open_id = ? and p.pay_status = ? and g.is_delete = ? limit 1',
				[$activity_id,$open_id,$pay_status,self::NOT_DELETE]);

			if($record){
				return $record[0];
			}else{
				return [];
			}
		}


		if($record){
			return $record->toArray();
		}else{
			return false;
		}
	}

	public function fetchById($id){
		$model = new Group();
		$record = $model->where('id',$id)
						->where('is_delete',self::NOT_DELETE)
						->find();
		if($record){
			return $record->toArray();
		}else{
			return [];
		}
	}

	public function hasPay($activity_id,$page = null,$query){
		if(is_null($page)){
			$records = Db::table('group_record')
				->alias('g')
				->join('pay_record p','g.pay_id = p.id')
				->where('g.activity_id',$activity_id)
				->field('g.*')
				->where('g.is_delete',self::NOT_DELETE)
				->select();

			return $records;
		}else{
			$records = Db::table('group_record')
				->alias('g')
				->join('pay_record p','g.pay_id = p.id')
				->where('g.activity_id',$activity_id)
				->where('p.pay_status',PayService::IS_PAY)
				->field('g.*')
				->where('g.is_delete',self::NOT_DELETE)
				->paginate(config('paginate.list_rows'),false,[
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

	public function completeGroupByLeaders($activity_id,$records){
		$group_set = (new ActivityService())->fetchGroupSet($activity_id);
		rsort_by_key($group_set,'person');

		$ret = [];
		$model = new Group();
		foreach($records as $record){
			$total = $model->where('parent_id',$record['id'])
							->where('is_delete',self::NOT_DELETE)
							->count();

			$total = $total + 1;

			$record['members'] = $total;
			foreach($group_set as $set){
				$person = $set['person'];
				if($total >= $person){
					$record['person_price'] = $set['person_price'];
					$ret[] = $record;
					break;
				}
			}
		}

		rsort_by_key($ret,'members');

		return $ret;
	}

	public function completeGroup($activity_id,$group_set){
		$records = Db::table('group_record')
						->alias('g')
						->join('pay_record p','p.id = g.pay_id')
						->where('g.activity_id',$activity_id)
						->where('p.pay_status',PayService::IS_PAY)
						->where('g.parent_id',0)
						->where('g.is_delete',self::NOT_DELETE)
						->field('g.*,p.money')
						->select();

		rsort_by_key($group_set,'person');
		$ret = [];
		$model = new Group();
		foreach($records as $record){
			$total = $model->where('parent_id',$record['id'])
							->where('is_delete',self::NOT_DELETE)
							->count();

			$total = $total + 1;

			$record['members'] = $total;
			foreach($group_set as $set){
				$person = $set['person'];
				if($total >= $person){
					$record['person_price'] = $set['person_price'];
					$ret[] = $record;
					break;
				}
			}
		}

		rsort_by_key($ret,'members');

		return $ret;
	}

	public function notCompleteGroup($activity_id,$group_set){
		$model = new Group();

		$records = Db::table('group_record')
			->alias('g')
			->join('pay_record p','p.id = g.pay_id')
			->where('g.activity_id',$activity_id)
			->where('p.pay_status',PayService::IS_PAY)
			->where('g.parent_id',0)
			->where('g.is_delete',self::NOT_DELETE)
			->field('g.*,p.money')
			->select();

		rsort_by_key($group_set,'person');
		$ret = [];

		foreach($records as $record){
			$total = $model->where('parent_id',$record['id'])
							->where('is_delete',self::NOT_DELETE)
							->count();

			$total = $total + 1;

			$record['members'] = $total;
			$tag = false;
			foreach($group_set as $set){
				$person = $set['person'];
				if($total >= $person){
					$tag = true;
				}
			}
			if($tag == false){
				$ret[] = $record;
			}
		}

		rsort_by_key($ret,'members');

		return $ret;
	}



	public function leaders($activity_id,$group_set){
		$leaders = $this->completeGroup($activity_id,$group_set);
		$leaders2 = $this->notCompleteGroup($activity_id,$group_set);

		return array_merge($leaders,$leaders2);
	}

	public function computePersonPrice($list,$group_set,$original_price){
		foreach($list as &$li){
			foreach($group_set as $set){
				if($li['member_number'] >= $set['person']){
					$li['person_price'] = $set['person_price'];
					break;
				}
			}
			if( ! isset($li['person_price'])){
				$li['person_price'] = $original_price;
			}
		}

		return $list;
	}

	public function leadersPage($activity_id,$page){
		$records = Db::table('group_record')
			->alias('g')
			->join('pay_record p','p.id = g.pay_id')
			->where('g.activity_id',$activity_id)
			->where('p.pay_status',PayService::IS_PAY)
			->where('g.parent_id',0)
			->where('g.is_delete',self::NOT_DELETE)
			->field('g.id,g.name,g.created_time')
			->page($page,config('paginate.list_rows'))->select();

		foreach($records as &$record){
			$count = Db::table('group_record')
				->alias('g')
				->join('pay_record p','p.id = g.pay_id')
				->where('g.activity_id',$activity_id)
				->where('p.pay_status',PayService::IS_PAY)
				->where('g.parent_id',$record['id'])
				->where('g.is_delete',self::NOT_DELETE)
				->field('g.id,g.name,g.created_time')
				->count();

			$count ++;//加上自己
			$record['member_number'] = $count;
		}

		return $records;
	}

	//查询parent_id或id为指定id，未清算过的记录
	public function fetchNotClear($id){
		$records = Db::table('group_record')
			->alias('g')
			->join('pay_record p', 'p.id = g.pay_id')
			->where("g.parent_id = {$id} or g.id = {$id}")
			->where('g.clear', self::NOT_CLEAR)
			->where('p.pay_status', PayService::IS_PAY)
			->where('g.is_delete', self::NOT_DELETE)
			->field('g.*,p.money')
			->select();

		return $records;
	}

	public function updateClear($group_record_id){
		$model = new Group();
		return $model->where('id',$group_record_id)
					->where('is_delete',self::NOT_DELETE)
					->where('clear',self::NOT_CLEAR)
					->update(['clear' => self::IS_CLEAR]);
	}

	public function fetchTotalPrepayByType($activity_id,$group_set,$type){

		if($type == 1){
			$joiners = $this->completeGroup($activity_id,$group_set);
		}else if($type == 2){
			$joiners = $this->notCompleteGroup($activity_id,$group_set);
		}else if($type == 3){
			$joiners = $this->fetchJoinerByActivity($activity_id);
			$joiner_number = count($joiners);
			$total_prepay = array_sum(array_column($joiners,'money'));
			return [$joiner_number,$total_prepay];
		}else{
			return [-1,-1];
		}

		$joiner_number = 0;
		$total_prepay = 0;

		foreach($joiners as $j){
			$parent_id = intval($j['id']);
			$record = Db::table('group_record')
				->alias('g')
				->join('pay_record p','p.id = g.pay_id')
				->where("g.parent_id = {$parent_id} or g.id = {$parent_id}")
				->where('p.pay_status',PayService::IS_PAY)
				->where('g.is_delete',self::NOT_DELETE)
				->field('count(g.id) as count,sum(p.money) as sum')
				->find();

			$joiner_number += $record['count'];
			$total_prepay += $record['sum'];
		}

		return [$joiner_number,$total_prepay];
	}

	public function fetchTotalPrepayByActivity($activity_id){

		$sum = Db::table('group_record')
			->alias('g')
			->join('pay_record p','p.id = g.pay_id')
			->where('g.activity_id',$activity_id)
			->where('g.clear',self::NOT_CLEAR)
			->where('p.pay_status',PayService::IS_PAY)
			->where('g.is_delete',self::NOT_DELETE)
			->field('p.money')
			->sum('money');

		return $sum;
	}

	public function fetchJoinerByActivity($activity_id){
		$records = Db::table('group_record')
			->alias('g')
			->join('pay_record p','p.id = g.pay_id')
			->where('g.activity_id',$activity_id)
			->where('p.pay_status',PayService::IS_PAY)
			->where('g.is_delete',self::NOT_DELETE)
			->field('g.*,p.money')
			->select();

		return $records;
	}

	public function fetchTotalJoinerByActivity($activity_id){
		$count = Db::table('group_record')
			->alias('g')
			->join('pay_record p','p.id = g.pay_id')
			->where('g.activity_id',$activity_id)
			->where('p.pay_status',PayService::IS_PAY)
			->where('g.is_delete',self::NOT_DELETE)
			->count();

		return $count;
	}
}