<?php
namespace app\common\model;
/**
 * Created by PhpStorm.
 * Author: zjh
 * Date: 2017-5-29 029
 * Time: 18:59
 */
class Member extends CommonModel
{
	protected $table = 'player';

	public function hasPhone($phone){
		return $this->where('phone',$phone)->count() > 0;
	}

	public function updatePassword($phone,$password){
		return $this->where('phone',$phone)->update('password',$password);
	}
}