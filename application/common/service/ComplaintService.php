<?php
/**
 * Created by PhpStorm.
 * Author: zjh
 * Date: 2017-7-25 025
 * Time: 19:39
 */

namespace app\common\service;


use app\common\model\Complaint;

class ComplaintService extends CommonService
{
	public function create($data){
		$model = new Complaint();
		return $model->insertGetId($data);
	}
}