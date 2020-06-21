<?php
/**
 * Created by PhpStorm.
 * Author: zjh
 * Date: 2017-12-4 004
 * Time: 14:17
 */

namespace app\common\service;

use think\Db;

class ProductService extends CommonService
{
	static public function fetchByPage($page = 1){
		$records = Db::name('product')->paginate(self::_pageSize(),false,['page' => $page]);
		return self::_paginate($records);
	}

	static public function fetchById($product_id){
		return Db::name('product')->where('id',$product_id)->find();
	}

	static public function fetchOrderListByPage($page){
		$records = Db::name('order_list')->paginate(self::_pageSize(),false,['page' => $page]);
		return self::_paginate($records);
	}

	static public function update($id,$data){
		return Db::name('product')->where('id',$id)->update($data);
	}

	static public function save($data){
		$data['created_time'] = date_normal();
		return Db::name('product')->insertGetId($data);
	}

	static public function del($id){
		return Db::name('product')->where('id',$id)->delete();
	}
}