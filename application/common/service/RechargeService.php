<?php
/**
 * Created by PhpStorm.
 * Author: zjh
 * Date: 2017-5-30 030
 * Time: 22:36
 */

namespace app\common\service;


use app\common\model\Recharge;
use think\Db;

class RechargeService extends CommonService
{
	public function fetchByMember($member_id){
		$recharge = new Recharge();
		$records = $recharge->where('member_id',$member_id)
							->order('id desc')
							->select();

		return $this->collectionToArray($records);
	}

	public function fetchCountByMember($member_id){
		$recharge = new Recharge();
		$count = $recharge->where('member_id',$member_id)->count();
		return $count;
	}

	public function fetchByPage($page){

		$records = Db::name('pay_record')
			->where("pay_status",1)
			->order('id desc')
			->paginate($this->pageSize(),false,['page' => $page]);

		return $this->paginate($records);
	}

	public function create($data)
	{
		foreach(['created_time','updated_time'] as $key){
			$data[$key] = date_normal();
		}

		$model = new Recharge();
		$last_id = $model->insertGetId($data);

		return $last_id;
	}
}