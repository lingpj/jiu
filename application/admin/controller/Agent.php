<?php
/**
 * Created by PhpStorm.
 * Author: zjh
 * Date: 2017-8-10 010
 * Time: 14:11
 */

namespace app\admin\controller;
use app\common\model\BegAgent;
use app\common\service\ManagerService;
use app\common\service\RoleService;
use think\Db;

class Agent extends CommonAdminController
{
	public function levelOneIndex(){
		$request = $this->request;
		$page = $request->param('page',1);

		$manager_service = new ManagerService();
		list($records,$pagination) = $manager_service->fetchByLevel(ManagerService::LEVEL_ONE,$page);

		$records = $manager_service->addLevelTwoList($records);

		$this->assign('list',$records);
		$this->assign('pagination',$pagination);

		return $this->fetch('level_one_index');
	}

	public function levelTwoIndex(){
		$request = $this->request;
		$page = $request->param('page',1);

		$manager_service = new ManagerService();
		list($records,$pagination) = $manager_service->fetchByLevel(ManagerService::LEVEL_TWO,$page);

		//加上未审核的记录
		$not_check_list = [];
		$admin = session('admin');
		if(isset($admin['agent_level']) && $admin['agent_level'] == ManagerService::LEVEL_ONE){
			$plus_list = (new BegAgent())->where('parent_id',$admin['id'])->where('status',0)->select();
			if($plus_list){
				$not_check_list = $plus_list->toArray();
			}
		}

		$this->assign('not_check_list',$not_check_list);
		$this->assign('list',$records);
		$this->assign('pagination',$pagination);

		$role_list = (new RoleService())->fetchRoleList();
		$this->assign('role_list',json_encode($role_list));
		$this->assign('is_root',isset($admin['is_root']));

		return $this->fetch('level_two_index');
	}

	public function begIndex(){
		$request = $this->request;
		$page = $request->param('page',1);

		$collection = (new BegAgent())->paginate(config('paginate.list_rows'),false,['page' => $page]);
		if($collection){
			$list = $collection->toArray()['data'];
			$pagination = $collection->render();
		}else{
			$list = [];
			$pagination = '';
		}

		$manager_service = new ManagerService();

		foreach($list as &$li){
			$li['status_text'] = $li['status'] == 0 ? '需要审核':'审核通过';
			$parent = $manager_service->fetchById($li['parent_id']);
			$li['parent'] = $parent['name'].'-'.$parent['note'];
		}

		$role_list = (new RoleService())->fetchRoleList();

		$this->assign('role_list',json_encode($role_list));
		$this->assign('list',$list);
		$this->assign('pagination',$pagination);

		return $this->fetch('beg_index');
	}

	public function levelOneEdit(){
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
					$this->error('此代理商不存在');
				}
				$record['password'] = str_decode($record['password']);
			}else{
				$record = [];
			}

			$record['role_list'] = $role_list;

			$this->assign('page_var',json_encode($record));

			return $this->fetch('level_one_edit');
		}else{
			$rule = [
				'phone'      => 'require|number|length:11',
				'role_id'    => 'require|number|min:1',
				'name'       => 'require|length:1,255',
				'note'       => 'length:1,255',
				'password'   => 'require|length:6,20',
				'invite_code'=> 'require|max:10',
			];

			$validation = $this->validate($request->param(),$rule);
			if($validation !== true){
				$this->error($validation);
			}

			$phone = $request->param('phone');

			$record = $manager_service->fetchByPhoneExcept($phone,$id);
			if($record){
				$this->error('手机号已被占用，请更换重试');
			}

			$role = $role_service->fetchById($request->param('role_id'));

			if( ! $role){
				$this->error('role_id对应的角色不存在');
			}

			$data = $request->param();
			$data['password'] = str_encode($data['password']);

			$data = trip_xss($data);
			$validate_data = [];

			//过滤不允许传入的参数
			foreach($rule as $key => $value){
				if(isset($data[$key])){
					$validate_data[$key] = $data[$key];
				}
			}

			$validate_data['agent_level'] = ManagerService::LEVEL_ONE;
			$validate_data['is_agent'] = ManagerService::IS_AGENT;

			if(count($manager_service->fetchByInviteCodeExcept($validate_data['invite_code'],$id))){
				$this->error('邀请码被占用，请更换重试');
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

	//管理员添加二级代理
	public function levelTwoEdit(){
		$request = $this->request;
		$id = $request->param('id');

		$manager_service = new ManagerService();

		if($request->isGet()){
			$agent_one_list = $manager_service->fetchAllByLevel(ManagerService::LEVEL_ONE);

			if( ! $agent_one_list){
				$this->error('请先添加至少一位一级代理');
			}

			foreach($agent_one_list as &$v){
				$v = [
					'id'          => $v['id'],
					'name'        => $v['name'],
				];
			}

			if($id){
				$list = $manager_service->fetchById($id);
				$list['agent_one_id'] = $list['parent_id'];
				$list['password'] = str_decode($list['password']);
			}else{
				$list = [];
			}

			$role_list = (new RoleService())->fetchRoleList();

			if( ! $role_list){
				$this->error('请先添加至少一个角色');
			}

			$page_var = [
				'list'           => $list,
				'agent_one_list' => $agent_one_list,
				'role_list'      => $role_list
			];

			$this->assign('page_var',json_encode($page_var));

			return $this->fetch('level_two_edit');
		}else{
			$rule = [
				'id'           => 'number',
				'agent_one_id' => 'require|number',
				'invite_code'  => 'require|max:10',
				'role_id'      => 'require|number',
				'phone'        => 'require|number|length:11',
				'name'         => 'require|length:1,255',
				'note'         => 'length:1,255',
				'password'     => 'require|length:6,20',
			];
			$validation = $this->validate($request->param(),$rule);
			if($validation !== true){
				$this->error($validation);
			}

			$phone = $request->param('phone');
			$record = $manager_service->fetchByPhoneExcept($phone,$id);

			if($record){
				$this->error('手机号已被占用，请更换重试');
			}

			$data = $request->param();
			$data['password'] = str_encode($data['password']);

			$data = trip_xss($data);

			$validate_data = [
				'name'         => $data['name'],
				'phone'        => $data['phone'],
				'password'     => $data['password'],
				'invite_code'  => $data['invite_code'],
				'role_id'      => $data['role_id'],
				'is_agent'     => ManagerService::IS_AGENT,
				'agent_level'  => ManagerService::LEVEL_TWO,
				'note'         => $data['note'],
				'parent_id'    => $data['agent_one_id'],
				'updated_time' => date_normal()
			];

			$manager_service = new ManagerService();

			if(count($manager_service->fetchByInviteCodeExcept($validate_data['invite_code'],$id))){
				$this->error('邀请码重复，请更换重试');
			}

			if($id){
				$last_id = $manager_service->update($id,$validate_data);
			}else{
				$validate_data['created_time'] = date_normal();
				$last_id = $manager_service->create($validate_data);
			}

			if($last_id){
				$this->success('success');
			}else{
				$this->error('error');
			}
		}
	}

	//一级代理添加二级代理
	public function levelTwoBegAdd(){
		$request = $this->request;

		$admin = session('admin');
		$is_root = ! isset($admin['agent_level']);

		if($is_root || $admin['agent_level'] != 1){
			$this->error('没有权限');
		}

		if($request->isGet()){
			return $this->fetch('level_two_beg_add');
		}else{
			$rule = [
				'phone'    => 'require|number|length:11',
				'name'     => 'require|length:1,255',
				'note'     => 'length:1,255',
				'password' => 'require|length:6,20',
			];
			$validation = $this->validate($request->param(),$rule);
			if($validation !== true){
				$this->error($validation);
			}

			$phone = $request->param('phone');
			$manager_service = new ManagerService();
			$record = $manager_service->fetchByPhoneExcept($phone);

			if($record){
				$this->error('手机号已被占用，请更换重试');
			}

			$data = $request->param();
			$data['password'] = str_encode($data['password']);

			$data = trip_xss($data);
			$validate_data = [];

			//过滤不允许传入的参数
			foreach($rule as $key => $value){
				if(isset($data[$key])){
					$validate_data[$key] = $data[$key];
				}
			}

			$validate_data = array_merge($validate_data, [
				'parent_id'    => session('admin.id'),
				'created_time' => date_normal()
			]);

			$last_id = (new BegAgent())->insertGetId($validate_data);

			if($last_id){
				$this->success('success');
			}else{
				$this->error('error');
			}
		}
	}

	public function levelTwoAgreeAdd(){
		$request = $this->request;

		$validation = $this->validate($request->param(),[
			'id'      => 'require|number',
			'role_id' => 'require|number|min:1',
		]);

		if($validation !== true){
			$this->error($validation);
		}

		$id = $request->param('id');
		$role_id = $request->param('role_id');

		$role = (new RoleService())->fetchById($role_id);

		if( ! $role){
			$this->error('角色不存在');
		}

		$beg_model = new BegAgent();
		$record = $beg_model->field('name,phone,note,password,parent_id')->where('id',$id)->find();

		if( ! $record){
			$this->error('要审核的代理不存在');
		}else{
			$record = $record->toArray();
		}

		$manager_service = new ManagerService();

		$phone_record = $manager_service->fetchByPhoneExcept($record['phone']);

		if($phone_record){
			$this->error('手机号重复');
		}

		$data = array_merge($record,[
			'role_id'     => $role_id,
			'is_agent'    => ManagerService::IS_AGENT,
			'agent_level' => ManagerService::LEVEL_TWO,
		]);

		Db::startTrans();
		try{
			$manager_service->create($data);
			$beg_model->where('id',$id)->update(['status' => 1]);
			Db::commit();
		}catch(\Exception $e){
			Db::rollback();
			$this->error($e->getMessage());
		}

		$this->success('success');
	}
}