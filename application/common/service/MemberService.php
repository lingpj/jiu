<?php
namespace app\common\service;
use app\common\model\Member;
use think\Db;

/**
 * Created by PhpStorm.
 * Author: zjh
 * Date: 2017-5-29 029
 * Time: 19:03
 */
class MemberService extends CommonService
{
	const IS_EXPIRED = 1;
	const NOT_EXPIRED = 0;
	const EXPIRE_TIME = 86400;//默认注册后过期时间 24小时

	public function fetchById($member_id){
		$model = new Member();
		$record = $model->where('id',$member_id)->find();

		if($record){
			return $record->toArray();
		}else{
			return [];
		}
	}

	public function count(){
		$model = new Member();
		return $model->count();
	}

	public function update($member_id,$data){
		$model = new Member();
		return $model->where('id',$member_id)->update($data);
	}

	public function fetchByOpenId($open_id){
		$model = new Member();
		$record = $model->where('open_id',$open_id)->find();
		return $this->collectionToArray($record);
	}

	public function updateExpireWexin($member_id,$expire_wexin){
		$model = new Member();
		return $model->where('id',$member_id)->update(['expire_wexin' => $expire_wexin]);
	}

	public function updateOpenId($member_id,$open_id,$expire_wexin){
		$model = new Member();
		return $model->where('id',$member_id)->update([
			'open_id'      => $open_id,
			'expire_wexin' => $expire_wexin
		]);
	}

	public function fetch($page,$phone = null){
		$model = new Member();
		if(empty($phone)){
			$records = $model->paginate(config('paginate.list_rows'),false,['page' => $page]);
			return $this->paginate($records);
		}else{
			$records = $model->where('phone',$phone)->select();
			if($records){
				return [$records->toArray(),''];
			}else{
				return [array(),''];
			}
		}
	}

	public function fetchByLevel($page,$level,$one_id,$two_id,$recharged = 0){
		$page_size = $this->pageSize();
		$model = new Member();

		$query = [
			'page' => $page,
			'query' => [
				'recharged' => $recharged
			]
		];

		if(empty($level)){
			if($recharged == 1){//只看充值用户
				$records = Db::name('member')
					->alias('m')
					->join('recharge_record r','r.member_id = m.id')
					->field('m.*')
					->order('r.id desc')
					->paginate($page_size,false,['page' => $page]);
			}else{
				$records = $model->paginate($page_size,false,$query);
			}
		}else{
			if($one_id && !$two_id){
				if($recharged == 1){
					$records = Db::name('member')
								->alias('m')
								->join('recharge_record r','r.member_id = m.id')
								->field('m.*')
								->order('r.id desc')
								->where('m.one_id',$one_id)
								->paginate($page_size,false,$query);
				}else{
					$records = $model->where('one_id',$one_id)->paginate($page_size,false,$query);
				}
			}else{
				if($recharged == 1){
					$records = Db::name('member')
						->alias('m')
						->join('recharge_record r','r.member_id = m.id')
						->field('m.*')
						->order('r.id desc')
						->where('m.one_id',$one_id)
						->where('m.two_id',$two_id)
						->paginate($page_size,false,['page' => $page]);
				}else{
					$records = $model->where('one_id',$one_id)->where('two_id',$two_id)->paginate($page_size,false,$query);
				}
			}
		}

		list($list,$pagination) = $this->paginate($records);

		$recharge_service = new RechargeService();

		foreach($list as &$li){
			$li['recharge_records'] = $recharge_service->fetchByMember($li['id']);
		}

		return [$list,$pagination];
	}

	public function fillRechargeRecord(){

	}

	public function fetchByPhone($phone){
		$model = new Member();

		$record = $model->where('phone',$phone)->find();
		if($record){
			return $record->toArray();
		}else{
			return [];
		}
	}

	public function increaseBalance($member_id,$increase_balance){
		$model = new Member();
		return $model->where('id',$member_id)->setInc('balance',$increase_balance);
	}

	public function updatePasswordByPhone($phone,$password){
		$model = new Member();
		$success = $model->where('phone',$phone)->update(['password' => $password]);
		return $success;
	}

	public function hasPhone($phone){
		return (new Member())->hasPhone($phone);
	}

	public function create($data){
		return (new Member())->insertGetId($data);
	}

	public function updateExpire($member_id,$expire_time){
		$success = (new Member())->where('id',$member_id)->update(['expire_time' => $expire_time]);

		return $success;
	}

	public function fetchByPhoneAndPassword($phone,$password){
		$member = new Member();
		$record = $member->where('phone',$phone)
						->where('password',$password)
						->find();

		return empty($record) ? false:$record;
	}
}