<?php
/**
 * Created by PhpStorm.
 * Author: zjh
 * Date: 2017-6-16 016
 * Time: 10:06
 */

namespace app\common\service;


use app\common\model\Click;
use think\Db;

class ClickService extends CommonService
{
	public function add($data){
		return $this->create($data);
	}

	public function create($data){
		$model = new Click();
		if( ! isset($data['time'])){
			$data['time'] = time();
		}
		if( ! isset($data['created_time'])){
			$data['created_time'] = date_normal();
		}
		return $model->insertGetId($data);
	}

	public function totalClickToday($open_id,$activity_id){
		$time = strtotime(date('Ymd'));
		$model = new Click();
		$count = $model->where('open_id',$open_id)
			 ->where('activity_id',$activity_id)
			->where('time','>=',$time)
			->count();

		return $count;
	}

	public function lastTimeByJoiner($joiner_id,$activity_id){
		$model = new Click();
		$record = $model
			->where('activity_id',$activity_id)
			->where('parent_id',$joiner_id)
			->where('joiner_id',$joiner_id)
			->order('time desc')->find();

		if($record){
			return $record->toArray();
		}else{
			return [];
		}
	}

	public function lastTimeByOpenId($activity_id,$open_id){
		$model = new Click();
		$one = $model->where('activity_id',$activity_id)
					->where('open_id',$open_id)
					->order('time desc')
					->find();

		if($one){
			return $one->toArray();
		}else{
			return [];
		}
	}

	public function lastTimeForParent($activity_id,$open_id,$parent_id){
		$model = new Click();
		$one = $model->where('activity_id',$activity_id)
			->where('open_id',$open_id)
			->where('parent_id',$parent_id)
			->order('time desc')
			->find();

		if($one){
			return $one->toArray();
		}else{
			return [];
		}
	}

	/**
	 * 指定ip最近点击时间
	 * @param $activity_id
	 * @param $parent_id
	 * @param $ip
	 * @return mixed|null
	 */
	public function lastTimeByIp($activity_id,$parent_id,$ip){
		$model = new Click();
		$record = $model->where('ip',$ip)
						->where('activity_id',$activity_id)
						->where('parent_id',$parent_id)
						->field('time')->order('time desc')->find();
		if($record){
			return $record['time'];
		}else{
			return null;
		}
	}

	public function supplyCount(&$list){
		$m = new Click();
		foreach($list as &$record){
			$count = $m->where('parent_id',$record['id'])->count();
			$record['count'] = $count;
		}
	}

	public function fetchRangeArrayByActivity($activity_id,$page = null){
		$model = new Click();

		if( ! is_null($page)){
			$records = $model->where('activity_id',$activity_id)->field('distinct(parent_id)')->page($page,config('paginate.list_rows'))->select();
		}else{
			$records = $model->where('activity_id',$activity_id)->field('distinct(parent_id)')->select();
		}

		if($records){
			$records = $records->toArray();
		}else{
			$records = [];
		}
		$ret = [];
		$m = new Click();
		foreach($records as &$record){
			$count = $m->where('parent_id',$record['parent_id'])->count();
			$one = ['parent_id' => $record['parent_id'],'count' => $count];
			$ret[] = $one;
		}
		rsort_by_key($ret,'count');
		return $ret;
	}

	public function fetchRangeByParentAndActivity($parent_id,$activity_id){
		$range = $this->fetchRangeArrayByActivity($activity_id);

		foreach($range as $index => $val){
			if($val['parent_id'] == $parent_id){
				$val['range'] = $index+1;
				return $val;
			}
		}

		return false;
	}

	public function hasClickToday($joiner_id,$activity_id){
		$model = new Click();
		$record = $model->where('joiner_id',$joiner_id)
				->where('activity_id',$activity_id)
			    ->field('time')
				->order('time desc')
				->find();

		$today = strtotime(date('Y-m-d').' 00:00:00');

		if($record['time'] > $today){
			return true;
		}else{
			return false;
		}
	}

	public function ipHasClick($activity_id,$ip){
		$model = new Click();
		$count = $model->where('activity_id',$activity_id)
				  ->where('ip',$ip)
				  ->count();

		if($count){
			return true;
		}else{
			return false;
		}
	}

	public function countClickByJoiner($joiner_id){
		$model = new Click();
		$count = $model->where('joiner_id',$joiner_id)
				  ->whereOr('parent_id',$joiner_id)
				  ->count();
		return $count;
	}
}