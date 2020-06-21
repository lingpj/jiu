<?php
namespace app\admin\controller;
use app\common\service\ManagerService;
use app\common\service\RoleService;
use think\Db;
use think\Session;

/**
 * Created by PhpStorm.
 * Author: zjh
 * Date: 2017-6-12 012
 * Time: 21:53
 */
class Index extends CommonAdminController
{
	public function dashboard(){
		if( ! session('?admin')){
			$this->redirect(url('index/index/login'));
		}else{
			$this->assign('code','');
			return $this->fetch('dashboard/index');
		}
	}

	public function index(){

	}

	private function agentLogin($name,$password){
		$agent = Db::name('player')->where('id',$name)->find();

		if (! $agent){
			$this->error('代理不存在',url('admin/index/login'));
		}

		$children = Db::name('player')->where('parent_id',$agent['id'])->count();

		if($children == 0){
			$this->error('你不是代理',url('admin/index/login'));
		}

		if(empty($agent['agent_password'])){
			Db::name('player')->where('id',$name)->update(['agent_password' => md5('123456')]);
		}else{
			if(md5($password) != $agent['agent_password']){
				$this->error('账号或密码错误',url('admin/index/login'));
			}
		}

		//初始化权限相关信息 仅获取查看收益权限和修改密码权限
		$visit_authority = [
			'profit' => ['agentprofit'],
			'set' => ['setagentpassword']
		];

		session('visit_authority',$visit_authority);
		session('admin',[
			'id' => $agent['id'],
			'role_name' => '代理',
			'name' => $agent['nickname'],
			'children' => $children,
			'is_agent' => 1,
		]);

		//make sure write session success
		sleep(2);

		$this->redirect(url('admin/index/dashboard'));
	}

	public function login(){
		$request = $this->request;

		if($request->isGet()){
			return $this->fetch();
		}else{
			$error = $this->validate($request->param(),[
				'name'     => 'require|length:1,20',
				'password' => 'require|length:6,20',
				'captcha'  => 'require|captcha'
			]);

			if($error !== true){
				$this->error($error);
			}

			$name = $request->param('name');
			$password = $request->param('password');

			$name = trim($name);
			$password  = trim($password);

			if($request->param('is_agent',0) == 1){
				$this->agentLogin($name,$password);
				die;
			}

			$password = str_encode($password);

			$manager_service = new ManagerService();
			$record = $manager_service->fetchByNameAndPassword($name,$password);

			if($record){
				//加载权限
				$role = (new RoleService())->fetchById($record['auth_group_id']);

				if($role){
					session('visit_authority',$role['auth']);
					$record['role_name'] = $role['role_name'];
					session('admin',$record);
				}else{
					//空权限代表获取了所有权限
					session('visit_authority',[]);
					$record['role_name'] = '超级管理员';
					session('admin',$record);
				}

				sleep(2);//make sure write session finish

				Db::name("manager_login_log")->insert([
					'manager_id'   => $record['id'],
					'ip'           => $request->ip(),
					'created_time' => date_normal()
				]);

				$this->redirect(url('admin/index/dashboard'));
			}else{
				$this->error('账号或密码错误',url('admin/index/login'));
			}
		}
	}

	public function logout(){
		Session::clear();
		sleep(1);

		$this->redirect('admin/index/login');
	}
}