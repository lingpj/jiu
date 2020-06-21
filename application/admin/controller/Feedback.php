<?php
/**
 * Created by PhpStorm.
 * Author: zjh
 * Date: 2017-6-20 020
 * Time: 21:56
 */

namespace app\admin\controller;
use app\common\service\FeedbackService;

class Feedback extends CommonAdminController
{
	public function index(){
		$request = $this->request;
		$page = $request->param('page',1);
		$feed = new FeedbackService();
		list($list,$pagination) = $feed->fetch($page);
		$this->assign('list',$list);
		$this->assign('pagination',$pagination);

		return $this->fetch();
	}
}