<?php
/**
 * Created by PhpStorm.
 * Author: zjh
 * Date: 2017-8-26 026
 * Time: 11:10
 */

namespace app\common\service;


use app\common\model\MemberAccount;

class MemberAccountService extends CommonService
{
	public function create($data){
		$date['created_time'] = $date['updated_time'] = date_normal();
		$model = new MemberAccount();
		$last_id =  $model->insertGetId($data);

		return $last_id;
	}

	public function fetchByMember($member_id){
		$model = new MemberAccount();
		$record = $model->where('member_id',$member_id)->find();

		return empty($record) ? [] : $record->toArray();
	}

	public function update($member_id,$name,$account){
		$model = new MemberAccount();
		$record = $model->where('member_id',$member_id)->find();
		$date = date_normal();

		if($record){
			$success = $model->where('member_id',$member_id)->update([
				'name'         => $name,
				'account'      => $account,
				'updated_time' => $date
			]);
		}else{
			$success = $model->insertGetId([
				'name'         => $name,
				'member_id'	   => $member_id,
				'account'      => $account,
				'updated_time' => $date,
				'created_time' => $date
			]);
		}

		return $success;
	}
}