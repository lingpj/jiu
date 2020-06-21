<?php
/**
 * Created by PhpStorm.
 * Author: zjh
 * Date: 2017-12-4 004
 * Time: 14:11
 */

namespace app\admin\controller;


use app\common\service\ProductService;
use think\Db;

class Product extends CommonAdminController
{
	public function index(){
		$page = $this->request->param('page',1);
		list($data,$pagination) = ProductService::fetchByPage($page);
		$this->assign([
			'list' => $data,
			'pagination' => $pagination
		]);

		return $this->fetch();
	}

	public function orderList(){
		$page = $this->request->param('page',1);
		list($list,$pagination) = ProductService::fetchOrderListByPage($page);

		foreach($list as &$v){
			$player_id = $v['player_id'];
			$one = Db::name('player')->where('id',$player_id)->find();
			if($one){
				$v['player'] = $one['nickname'];
			}else{
				$v['player'] = '';
			}

			$v['detail'] = join(' ',[
				$v['product'],
				'数量：'.$v['piece'],
				'单价：'.$v['piece_price'],
				'总价：'.$v['total_price'],
				'时间：'.$v['created_time'],
				'姓名：'.$v['name'],
				'电话：'.$v['phone'],
				'地址：'.$v['address'],
			]);
		}

		$this->assign([
			'list' => $list,
			'pagination' => $pagination
		]);

		return $this->fetch('product/order');
	}

	public function edit(){
		$request = $this->request;
		if($request->isGet()){
			$id = $request->param('id',0);
			if( ! empty($id)){
				$record = ProductService::fetchById($id);
				if(!empty($record)){
					$this->assign($record);
				}
			}
			return $this->fetch();
		}

		$data = $request->param();
		$error = $this->validate($data,[
			'id' => 'number',
			'name' => 'require|length:1,100',
			'price' => 'require|number',
		]);

		if($error !== true){
			$this->error($error);
		}

		$file = $request->file('img');
		if( ! empty($file)){
			$info = $file->move(ROOT_PATH . 'public' . DS . 'upload');
			if($info){
				$image_name = $info->getSaveName();
			}else{
				$this->error($info->getError());
			}
		}

		if(isset($image_name)){
			$data['img'] = $image_name;
		}

		if (empty($data['id'])){
			$success = ProductService::save($data);
		}else{
			$id = $data['id'];
			unset($data['id']);
			$success = ProductService::update($id,$data);
		}

		if ($success){
			$this->redirect(url('admin/product/index'));
		}else{
			$this->error('保存失败');
		}
	}

	public function del(){
		$id = $this->request->param('id',0);
		$success = ProductService::del($id);
		if($success){
			$this->success('删除成功',url('admin/product/index'));
		}else{
			$this->error('删除失败');
		}
	}
}