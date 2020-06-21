<?php
/**
 * Created by PhpStorm.
 * Author: zjh
 * Date: 2017-8-9 009
 * Time: 14:44
 */

namespace app\admin\controller;

use app\common\service\RoleService;
use think\Log;

class Role extends CommonAdminController
{
	public function index()
	{
		$role_service = new RoleService();
		$list = $role_service->fetchAll();
		$this->assign('list', $list);

		return $this->fetch();
	}

	public function edit($id = null)
	{
		$request = $this->request;

		if ($request->isGet()) {
			$list = config('authority');
			$role_name = '';

			if( ! empty($id)){
				$role_service = new RoleService();
				$record = $role_service->fetchById($id);
				if( ! $record){
					$this->error('要编辑的角色不存在');
				}

				$auth = $record['auth'];
				$role_name = $record['role_name'];

				foreach($list as &$li){
					if(isset($auth[$li['auth']])){
						$li['active'] = 1;
						if(isset($li['list'])){
							foreach($li['list'] as &$v){
								if(in_array($v['auth'],$auth[$li['auth']])){
									$v['active'] = 1;
								}
							}
						}
					}
				}
			}

			$data = [
				'list' => $list,
				'role_name' => $role_name
			];

			$this->assign('list', json_encode($data));

			return $this->fetch('edit');
		} else {
			$list = $request->param('authority_list/a', []);
			$name = $request->param('name');

			$validation = $this->validate($request->param(),[
				'name' => 'require|length:1,255',
				'authority_list' => 'array|length:1,200'
			]);

			if($validation !== true){
				$this->error($validation);
			}

			$json_str = json_encode($list);
			$role_service = new RoleService();

			$data = [
				'role_name' => $name,
				'auth'      => $json_str
			];

			if(empty($id)){
				$last_id = $role_service->create($data);
			}else{
				$last_id = $role_service->update($id,$data);
			}

			Log::error($last_id);

			if ($last_id) {
				$this->success('success');
			} else {
				$this->error('error');
			}
		}
	}
}