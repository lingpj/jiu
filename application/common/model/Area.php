<?php
/**
 * Created by PhpStorm.
 * Author: zjh
 * Date: 2017-5-30 030
 * Time: 10:01
 */

namespace app\common\model;


use think\Db;

class Area extends CommonModel
{
	public function fetchProvince(){
		return Db::name('provinces')->field('provinceid,province')->select();
	}

	public function fetchCity(){
		return Db::name('cities')->field('cityid,city,provinceid')->select();
	}
}