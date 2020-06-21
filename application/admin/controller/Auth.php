<?php
/**
 * Created by PhpStorm.
 * Author: zjh
 * Date: 2017-8-9 009
 * Time: 13:50
 */

namespace app\admin\controller;

class Auth extends CommonAdminController
{
	public function index(){
		$list = config('authority');
		$this->assign('list',$list);

		return $this->fetch('index');
	}
}