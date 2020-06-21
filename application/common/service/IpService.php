<?php
/**
 * Created by PhpStorm.
 * Author: zjh
 * Date: 2017-10-18 018
 * Time: 15:15
 */

namespace app\common\service;

use app\common\model\Ip;

class IpService extends CommonService{

	public function save($data){
		$model = new Ip();
		$data['created_time'] = date_normal();
		return $model->insert($data);
	}

	public function fetchByPage($page){
		$model = new Ip();
		$records = $model->paginate($this->pageSize(),false,[
			'page' => $page
		]);

		return $this->paginate($records);
	}

	public function delete($id){
		$model = new Ip();
		return $model->where('id',$id)->delete();
	}
}