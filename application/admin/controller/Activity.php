<?php
/**
 * Created by PhpStorm.
 * Author: zjh
 * Date: 2017-6-20 020
 * Time: 22:02
 */

namespace app\admin\controller;
use app\common\service\ActivityService;

class Activity extends CommonAdminController
{
	public function index(){
		$request = $this->request;
		$page = $request->param('page',1);
		$phone = $request->param('phone','');
		$phone = trim($phone);
		$sort_joiner = $request->param('sort_joiner',0) ? 1 : 0;
		$act = new ActivityService();

		list($list,$pagination) = $act->fetch($page,$phone,$sort_joiner);

		$this->assign('list',$list);
		$this->assign('pagination',$pagination);
		$this->assign('phone',$phone);
		$this->assign('sort_joiner',$sort_joiner);

		return $this->fetch();
	}

	public function editCount(){
		$request = $this->request;

		$data = $request->param();
		$data = trip_xss($data);

		$activity_id = array_get($data,'activity_id',0);
		$page_view = array_get($data,'page_view',0);
		$share = array_get($data,'share',0);

		$page_view = intval($page_view);
		$share = intval($share);

		$act_service = new ActivityService();

		$success = $act_service->updateCount($activity_id,$page_view,$share);

		if($success){
			$this->success('success');
		}else{
			$this->error('error');
		}
	}
}