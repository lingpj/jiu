<?php
/**
 * Created by PhpStorm.
 * Author: zjh
 * Date: 2017-11-7 007
 * Time: 9:21
 */

namespace app\common\service;

use think\Db;

class BroadcastService extends CommonService
{
	public function fetchByPage($page){
		$collection = Db::name('announcement')->paginate($this->pageSize(),false,['page' => $page]);
		return $this->paginate($collection);
	}

	public function fetchById($id){
		return Db::name('announcement')->where('id',$id)->find();
	}

	public function save($data){
		$data['created_time'] = date_normal();
		return Db::name('announcement')->insertGetId($data);
	}

	public function update($id,$data){
		return Db::name('announcement')->where('id',$id)->update($data);
	}

	public function delete($id){
		return Db::name('announcement')->where('id',$id)->delete();
	}
}