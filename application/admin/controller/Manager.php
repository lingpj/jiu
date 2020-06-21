<?php
/**
 * Created by PhpStorm.
 * Author: zjh
 * Date: 2017-8-9 009
 * Time: 14:42
 */

namespace app\admin\controller;


use app\common\service\ManagerService;
use app\common\service\RoleService;
use think\Db;

class Manager extends CommonAdminController
{
	public function index(){
		$page = $this->request->param('page',1);
		$manager_service = new ManagerService();

		list($list,$pagination) = $manager_service->fetchByLevel(ManagerService::LEVEL_ZERO,$page);

		$this->assign([
			'list' => $list,
			'pagination' => $pagination
		]);

		return $this->fetch('index');
	}

	public function edit(){
		$request = $this->request;
		$id = $request->param('id');

		$manager_service = new ManagerService();
		$role_service = new RoleService();
		$role_list = $role_service->fetchRoleList();

		if( ! $role_list){
			$this->error('请先添加角色');
		}

		if($request->isGet()){
			if($id){
				$record = $manager_service->fetchById($id);
				if( ! $record){
					$this->error('此管理员不存在');
				}
				$record['password'] = str_decode($record['password']);
			}else{
				$record = [];
			}

			$record['role_list'] = $role_list;

			$this->assign('page_var',json_encode($record));

			return $this->fetch('edit');
		}else{
			$rule = [
				'auth_group_id' => 'require|number|min:1',
				'name'          => 'require|length:1,255',
				'note'          => 'length:1,255',
				'password'      => 'require|length:6,20',
			];
			$validation = $this->validate($request->param(),$rule);
			if($validation !== true){
				$this->error($validation);
			}

			$role = $role_service->fetchById($request->param('auth_group_id'));

			if( ! $role){
				$this->error('auth_group_id对应的角色不存在');
			}

			$data = $request->param();
			$data['password'] = str_encode($data['password']);

			$data = trip_xss($data);
			$validate_data = [];

			//过滤不允许传入的参数
			foreach($rule as $key => $value){
				$validate_data[$key] = $data[$key];
			}

			if(empty($id)){
				$last_id = $manager_service->create($validate_data);
			}else{
				$last_id = $manager_service->update($id,$validate_data);
			}

			if($last_id){
				$this->success('success');
			}else{
				$this->error('error');
			}
		}
	}

	public function server(){
		$request = $this->request;

		if($request->isGet()){
			$record = Db::name('we_chat')->order('id desc')->find();
			if($record){
				$list = json_decode($record['we_chat'],1);
			}else{
				$list = [];
			}

			$this->assign('list',$list);

			return $this->fetch("manager/server");
		}else{
			$list = $request->param('we_chat/a');

			foreach($list as $v){
				if(mb_strlen($v,"utf-8") < 5){
					$this->error("最好5个字符");
				}
			}

			$count = Db::name('we_chat')->count();

			if($count > 0){
				$success = Db::name('we_chat')->where('id > 0')->update(['we_chat' => json_encode($list,1)]);
			}else{
				$success = Db::name('we_chat')->insert(['we_chat' => json_encode($list,1)]);
			}

			if ($success){
				$this->success('修改成功');
			}else{
				$this->error('修改失败');
			}
		}
	}
}