<?php
/**
 * Created by PhpStorm.
 * Author: zjh
 * Date: 2017-8-24 024
 * Time: 14:47
 */

namespace app\common\service;


use app\common\model\Storage;
use think\Db;

class StorageService extends CommonService
{
	CONST ACTION_DEPOSIT  = 0;//存入
	CONST ACTION_WITHDRAW = 1;//提现
	CONST STATUS_DEFAULT  = 0;//默认状态
	CONST STATUS_SUCCESS  = 1;//成功，提现或存入成功

	public function create($data){
		$data['created_time'] = $data['updated_time'] = date_normal();
		$model = new Storage();
		$last_id = $model->insertGetId($data);
		return $last_id;
	}

	public function fetchByMember($member_id){
		$model = new Storage();
		$records = $model->where('member_id',$member_id)->select();
		if($records){
			return $records->toArray();
		}else{
			return [];
		}
	}

	public function updateStatus($id,$status){
		$model = new Storage();
		$success = $model->where('id',$id)->update([
			'status'       => $status,
			'updated_time' => date_normal()
		]);
		return $success;
	}

	public function fetch($page){
		$model = new Storage();
		$collection = $model->where('action',self::ACTION_WITHDRAW)
							->order('status')
							->paginate($this->pageSize(),false,[
								'page' => $page
							]);

		return $this->paginate($collection);
	}
}