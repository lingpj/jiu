<?php
/**
 * Created by PhpStorm.
 * Author: zjh
 * Date: 2017-10-25 025
 * Time: 13:27
 */

namespace app\common\service;


use app\common\model\AuthUser;

class AuthUserService extends CommonService
{
	public function fetchById($id){
		$model = new AuthUser();
		$collection = $model->where('id',$id)->find();

		return $this->collectionToArray($collection);
	}

	public function increaseScore($id,$score){
		$model = new AuthUser();

		return $model->where('id',$id)->setInc('score',$score);
	}

	public function update($user_id,$data){
		$model = new AuthUser();
		return $model->where('id',$user_id)->update($data);
	}
}