<?php
/**
 * Created by PhpStorm.
 * Author: zjh
 * Date: 2017-8-9 009
 * Time: 14:58
 */

namespace app\common\service;


use app\common\model\Role;

class RoleService extends CommonService{

	public function create($data){
		foreach(['created_time','updated_time'] as $key){
			if( ! isset($data[$key])){
				$data[$key] = date_normal();
			}
		}

		$model = new Role();

		return $model->insert($data);
	}

	public function fetchRoleList(){
		$model = new Role();
		$records = $model->field('id,role_name')->select();
		if($records){
			$records = $records->toArray();
		}else{
			$records = [];
		}
		return $records;
	}

	public function fetchById($id){
		$model = new Role();
		$record = $model->where('id',$id)->find();
		if($record){
			$record = $record->toArray();
			$record['auth'] = json_decode($record['auth'],true);
		}else{
			$record = [];
		}
		return $record;
	}

	public function update($id,$data){
		$model = new Role();
		$data['updated_time'] = date_normal();

		return $model->where('id',$id)->update($data);
	}

	public function fetchAll(){
		$model = new Role();
		$records = $model->all();
		if($records){
			$records = $records->toArray();
		}else{
			$records = [];
		}
		$list_original = config('authority');
		/**
		 * 转化list为以下格式
		 * member => [
		 * 	index => '商家列表'
		 * ],
		 * ...
		 */
		$list = [];
		foreach($list_original as $li){
			if(isset($li['list'])){
				$list[$li['auth']] = array_combine(
					array_column($li['list'],'auth'),
					array_column($li['list'],'name')
				);
			}
		}
		foreach($records as &$record){
			$auth = json_decode($record['auth'],true);
			$auth_text = '';
			foreach($auth as $key => $value){
				if(isset($list[$key])){
					foreach($value as $v){
						if(isset($list[$key][$v])){
							$auth_text .= $list[$key][$v] . ' ';
						}
					}
				}
			}
			$record['auth_text'] = $auth_text;
		}

		return $records;
	}
}