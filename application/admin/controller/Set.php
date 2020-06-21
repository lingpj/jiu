<?php
/**
 * Created by PhpStorm.
 * Author: zjh
 * Date: 2017-10-23 023
 * Time: 16:25
 */
namespace app\admin\controller;

use app\common\service\ManagerService;
use think\Db;

class Set extends CommonAdminController{

	public function setPassword()
	{
		$request = $this->request;

		if($request->isGet()){
			return $this->fetch('password');
		}else{
			$error = $this->validate($request->param(),[
				'new_password|新密码' => 'require|length:6,20',
				'old_password|老密码' => 'require|length:6,20',
			]);

			if($error !== true){
				$this->error($error);
			}

			$admin = session('admin');
			$manager = new ManagerService();

			$record = $manager->fetchById($admin['id']);
			if(str_encode($request->param('old_password')) != $record['password']){
				$this->error('老密码不正确');
			}

			$new_password = str_encode($request->param('new_password'));

			$success = $manager->update($admin['id'],['password' => $new_password,'updated_time' => date_normal()]);

			if($success){
				$this->success("修改密码成功");
			}else{
				$this->error('修改密码失败');
			}
		}
	}

	//修改代理密码
	public function setAgentPassword(){
		$request = $this->request;

		if($request->isGet()){
			return $this->fetch('agent_password');
		}else{
			$error = $this->validate($request->param(),[
				'new_password|新密码' => 'require|length:6,20',
				'old_password|老密码' => 'require|length:6,20',
			]);

			if($error !== true){
				$this->error($error);
			}

			$admin = session('admin');

			$record = Db::name('player')->where('id',$admin['id'])->find();
			if(md5($request->param('old_password')) != $record['agent_password']){
				$this->error('老密码不正确');
			}

			$new_password = md5($request->param('new_password'));

			$success = Db::name('player')->where('id',$admin['id'])->update(['agent_password' => $new_password,'updated_time' => date_normal()]);

			if($success){
				$this->success("修改代理密码成功");
			}else{
				$this->error('修改代理密码失败');
			}
		}
	}
}