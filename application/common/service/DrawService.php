<?php
/**
 * Created by PhpStorm.
 * Author: zjh
 * Date: 2017-6-20 020
 * Time: 16:21
 */

namespace app\common\service;


use app\common\model\Draw;
use think\Db;
use app\common\model\Join;

class DrawService extends CommonService
{
	const IS_WIN = 1;
	const NOT_WIN = 0;

	public function create($data){
		$model = new Draw();
		return $model->insertGetId($data);
	}

	public function fetchCount($activity_id,$open_id){
		$joiner = (new JoinService())->fetchByActivityAndOpenId($activity_id,$open_id);
		if( ! $joiner){
			return [];
		}
		$joiner_id = $joiner['id'];

		$action = (new ActivityService())->fetchById($activity_id);
		$game_set = (array)json_decode($action['game_set']);
		$day_draw_times = $game_set['day_draw_times'];
		$win_times = $game_set['win_times'];

		$has_win_times = $this->winTimes($joiner_id,$activity_id);
		$today_has_draw_times = $this->todayDrawTimes($joiner_id,$activity_id);

		return [
			'name'	=> $joiner['name'],
			'phone'	=> $joiner['phone'],
			'has_win_times'	=> $has_win_times,
			'rest_win_times'	=> $win_times - $has_win_times,
			'today_rest_times'	=> $day_draw_times - $today_has_draw_times
		];
	}

	public function winRecord($open_id,$activity_id){
		$model = new Draw();
		$records = $model->where('open_id',$open_id)
						->where('activity_id',$activity_id)
						->where('item','>',0)
						->select();

		if($records){
			return $records->toArray();
		}else{
			return [];
		}
	}

	public function fetchWinByJoiner($joiner_id){
		$model = new Draw();
		$record = $model->where('joiner_id',$joiner_id)
						->where('item','>',0)
						->find();
		if($record){
			return $record->toArray();
		}else{
			return [];
		}
	}

	public function luckRange($activity_id){

		$records = Db::name('joiner')
			->where('activity_id',$activity_id)
			->field('distinct(id)')
			->select();

		$join_service = new JoinService();
		$model = new Draw();

		foreach($records as &$record){
			$joiner_id = $record['id'];
			$count = $model->where('activity_id',$activity_id)->where('joiner_id',$joiner_id)->where('item','>',0)->count();
			$record['count'] = $count;
			$one = $join_service->fetchById($joiner_id);
			$record['person'] = $one['name'];
			$record['name'] = $one['name'];
			$record['phone'] = $one['phone'];
		}

		if(count($records)){
			rsort_by_key($records,'count');
		}

		return $records;
	}

	public function _allWinRecords($activity_id){
		$model = new Draw();
		$records = Db::name('draw_record')
			->where('activity_id',$activity_id)
			->where('item','>',0)
			->field('distinct(joiner_id),created_time,name,product')
			->select();

		$data = $records;

		$join_service = new JoinService();

		foreach($data as &$record){
			$joiner_id = $record['joiner_id'];
			$count = $model->where('activity_id',$activity_id)->where('joiner_id',$joiner_id)->where('item','>',0)->count();
			$record['count'] = $count;
			$one = $join_service->fetchById($record['joiner_id']);
			$record['person'] = $one['name'];
			$record['phone'] = $one['phone'];
		}

		if(count($data)){
			sort_by_key($data,'count');
		}

		return $data;
	}


	public function allWinRecords($activity_id,$page,$query){
		$records = Db::name('draw_record')
				->where('activity_id',$activity_id)
				->where('item','>',0)
				->field('distinct(joiner_id),created_time,name,product,created_time')
				->paginate(config('paginate.list_rows'),true,[
					'page'	=> $page,
					'query' => $query
				]);

		if($records){
			$data = $records->toArray()['data'];
			$pagination = $records->render();
		}else{
			$data = [];
			$pagination = '';
		}

		$join_service = new JoinService();
		$model = new Draw();

		foreach($data as &$record){
			$joiner_id = $record['joiner_id'];
			$count = $model->where('activity_id',$activity_id)->where('joiner_id',$joiner_id)->where('item','>',0)->count();
			$record['count'] = $count;
			$one = $join_service->fetchById($record['joiner_id']);
			$record['id'] = $joiner_id;
			$record['person'] = $one['name'];
			foreach(['label','phone'] as $key){
				$record[$key] = $one[$key];
			}
		}

		if(count($data)){
			sort_by_key($data,'count');
		}

		return [$data,$pagination];
	}

	//计算指定奖品已经领走多少份
	public function winGift($activity_id,$item){
		$model = new Draw();
		$count = $model->where('activity_id',$activity_id)
					  ->where('item',$item)
					  ->count();

		return $count;
	}

	public function todayRecord($joiner_id,$activity_id){
		$time = strtotime(date('Ymd'));
		$model = new Draw();
		$records = $model->where('joiner_id',$joiner_id)
				  ->where('activity_id',$activity_id)
				  ->where('time','>',$time)
				  ->select();
		if($records){
			return $records->toArray();
		}else{
			return [];
		}
	}

	public function todayDrawTimes($joiner_id,$activity_id){
		$time = strtotime(date('Ymd'));
		$model = new Draw();
		$count = $model->where('joiner_id',$joiner_id)
			->where('activity_id',$activity_id)
			->where('time','>',$time)
			->count();

		return $count;
	}

	public function winTimes($joiner_id,$activity_id){
		$model = new Draw();
		$count = $model->where('joiner_id',$joiner_id)
			->where('activity_id',$activity_id)
			->where('item','>',0)
			->count();

		return $count;
	}
}