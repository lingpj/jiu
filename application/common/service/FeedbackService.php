<?php
/**
 * Created by PhpStorm.
 * Author: zjh
 * Date: 2017-5-31 031
 * Time: 20:37
 */

namespace app\common\service;


use app\common\model\Feedback;

class FeedbackService extends CommonService
{
	const IS_READ = 1;
	const NOT_READ = 0;

	public function fetch($page,$status = null){
		$feedback = new Feedback();
		if(is_null($status)){
			$collection = $feedback
				->order('id desc')
				->paginate(config('paginate.list_rows'),false,[
					'page' => $page
				]);
		}else{
			$collection = $feedback->where('status',$status)
				->order('id desc')
				->paginate(config('paginate.list_rows'),false,[
					'page' => $page
				]);
		}

		if($collection){
			$data = $collection->toArray()['data'];
			$pagination = $collection->render();
		}else{
			$data = [];
			$pagination = '';
		}
		foreach($data as &$item){
			$item['status'] = $item['status'] == self::IS_READ ? '已读':'未读';
		}
		return [$data,$pagination];
	}

	public function create($data){
		return (new Feedback())->insertGetId($data);
	}
}