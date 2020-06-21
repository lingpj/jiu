<?php
/**
 * Created by PhpStorm.
 * Author: zjh
 * Date: 2017-8-9 009
 * Time: 14:08
 */

namespace app\admin\controller;
use think\Controller;
use think\Request;

class CommonAdminController extends Controller
{
	private $module = 'admin';

	public function __construct(Request $request)
	{
		parent::__construct($request);

		$controller = strtolower($request->controller());

		if($controller != 'index' && ! session('?admin')){
			$this->error(404);
		}

		if($controller != 'index'){
			if( ! $this->auth(session('visit_authority'))){
				$this->error('你没有权限访问');
			}
		}

		$menu_list = $this->buildMenu(config('authority'),$controller,strtolower($request->action()));

		$menu_list = $this->filterMenu($menu_list,session('visit_authority'));

//		dump($menu_list);die;

		$this->assign('menu_list',$menu_list);
	}

	public function pageSize(){
		return config('paginate.list_rows');
	}

	public function paginate($records){
		if($records){
			$array = $records->toArray();
			if ($array['total'] == 0){
				$data = [];
				$pagination = '';
			}else{
				$data = $records->toArray()['data'];
				$pagination = $records->render();
			}
		}else{
			$data = [];
			$pagination = '';
		}
		return [$data,$pagination];
	}

	//权限过滤
	//包括访问权限
	public function auth($visit_list = null){
		if(empty($visit_list)){
			return true;
		}else{
			$request = $this->request;
			$controller = strtolower($request->controller());
			$action = strtolower($request->action());

			return isset($visit_list[$controller]) && in_array($action,$visit_list[$controller]);
		}
	}

	private function filterMenu($menu_list,$visit_list = null){
		if($visit_list){
			$filter_menu = [];
			foreach($menu_list as $key => $menu){
				$auth = $menu['auth'];
				if(isset($visit_list[$auth])){
					$m = $menu;
					$m['list'] = [];
					if(isset($menu['list'])){
						foreach($menu['list'] as $v){
							if(in_array($v['auth'],$visit_list[$auth])){
								array_push($m['list'],$v);
							}
						}
					}
					$filter_menu[] = $m;
				}
			}
			return $filter_menu;
		}else{
			return $menu_list;
		}
	}

	private function buildMenu($list = [],$controller,$action){
		$menu = [];

		foreach($list as $li){
			if(isset($li['is_menu']) && $li['is_menu']){
				$auth = $li['auth'];
				$children = [];

				if(isset($li['list'])){
					foreach($li['list'] as $v){
						if(isset($v['is_menu']) && $v['is_menu']){
							$children[] = [
								'name'   => $v['name'],
								'auth'   => $v['auth'],
								'active' => ($auth == $controller && $action == $v['auth']) ? 1 : 0,
								'url'    => url($this->module . '/' . $auth . '/' . $v['auth'])
							];
						}
					}
				}

				$menu[] = [
					'name'   => $li['name'],
					'auth'   => $auth,
					'active' => ($auth == $controller) ? 1 : 0,
					'list'   => $children
				];
			}
		}

		return $menu;
	}

	protected function returnCreateCode($success,$url = null){
		if($success){
			$this->success('添加成功',$url);
		}else{
			$this->error('添加失败',$url);
		}
	}

	protected function returnUpdateCode($success,$url = null){
		if($success){
			$this->success('更新成功',$url);
		}else{
			$this->error('更新失败',$url);
		}
	}
}