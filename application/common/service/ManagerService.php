<?php
/**
 * Created by PhpStorm.
 * Author: zjh
 * Date: 2017-8-9 009
 * Time: 14:59
 */

namespace app\common\service;

use app\common\model\Manager;
use think\Db;

class ManagerService extends CommonService
{
	const IS_AGENT = 1;
	const NOT_AGENT = 0;
	const LEVEL_ZERO = 0;
	const LEVEL_ONE = 1;
	const LEVEL_TWO = 2;

	public function fetchByPhone($phone){
		$model = new Manager();
		$record = $model->where('phone',$phone)->find();
		if($record){
			return $record->toArray();
		}else{
			return [];
		}
	}

	public function fetchByInviteCodeExcept($invite_code,$id = null){
		$model = new Manager();

		if( ! $id){
			$record = $model->where('invite_code',$invite_code)->find();
		}else{
			$record = $model->where('invite_code',$invite_code)->where('id','<>',$id)->find();
		}

		if($record){
			$record = $record->toArray();
		}else{
			$record = [];
		}

		return $record;
	}

	public function fetchByNameAndPassword($name,$password){
		$model = new Manager();
		$record = $model->where('name',$name)
						->where('password',$password)
						->find();

		return $record ? $record->toArray() : [];
	}

	public function fetchAllByLevel($level){
		$model = new Manager();
		$records = $model->where('agent_level',$level)->select();
		
		if($records){
			$records = $records->toArray();
		}else{
			$records = [];
		}

		return $records;
	}

	public function addLevelTwoList($data){
		$model = new Manager();
		//find all level two agent
		foreach($data as &$v){
			$list = $model->where('parent_id',$v['id'])->select();
			$v['level_two_list'] = empty($list) ? [] : $list->toArray();
		}

		return $data;
	}

	public function fetchByLevel($level,$page){

		$collection = Db::name('manager')
					->alias('m')
					->join('auth_group r','r.id = m.auth_group_id')
					->field('m.*,r.role_name')
					->order('m.id desc')
					->paginate(config('paginate.list_rows'),false,['page' => $page]);


		list($data,$pagination) = $this->paginate($collection);

		return [$data,$pagination];
	}


	public function fetchByPhoneExcept($phone,$id = null){
		$model = new Manager();
		if($id){
			$record = $model->where('id','<>',$id)->where('phone',$phone)->find();
		}else{
			$record = $model->where('phone',$phone)->find();
		}

		if($record){
			return $record->toArray();
		}else{
			return [];
		}
	}

	public function fetchById($id){
		$model = new Manager();
		$record = $model->where('id',$id)->find();
		if($record){
			return $record->toArray();
		}else{
			return [];
		}
	}

	public function create($data)
	{
		foreach(['created_time','updated_time'] as $key){
			if( ! isset($data[$key])){
				$data[$key] = date_normal();
			}
		}

		$last_id = (new Manager())->insert($data);

		return $last_id;
	}

	public function update($id,$data){
		if( ! isset($data['updated_time'])){
			$data['updated_time'] = date_normal();
		}

		return (new Manager())->where('id',$id)->update($data);
	}
}