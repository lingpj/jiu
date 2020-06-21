<?php
/**
 * Created by PhpStorm.
 * Author: zjh
 * Date: 2017-7-20 020
 * Time: 17:34
 */

namespace app\common\service;


use app\common\model\GasolineCount;
use app\common\model\Join;
use think\Db;

class GasolineCountService extends CommonService
{
	public function create($data){
		$model = new GasolineCount();
		return $model->insertGetId($data);
	}

	public function increaseByJoiner($joiner_id){
		$model = new GasolineCount();
		return $model->where('joiner_id',$joiner_id)->inc('total')->update();
	}

	public function rangeCountById($joiner_id,$activity_id){
		$model = new GasolineCount();
		$record = $model->where('joiner_id',$joiner_id)->find();

		if($record){
			$record = $record->toArray();
			$range = $model->where('activity_id',$activity_id)->where('total','>',$record['total'])->count();
			$same = Db::name('gasoline_count')
				->alias('g')
				->join('joiner j','j.id = g.joiner_id')
				->where('g.activity_id',$activity_id)
				->where('g.total',$record['total'])
				->field('j.id,j.created_time')
				->select();

			$self_time = 0;
			foreach($same as $s){
				if($s['id'] == $joiner_id){
					$self_time = strtotime($s['created_time']);
					break;
				}
			}

			//比自己先参加的
			foreach($same as $s){
				if(strtotime($s['created_time']) < $self_time){
					$range ++;
				}
			}

			//和自己同一秒参加的
			$same_num = 0;
			foreach($same as $s){
				if(strtotime($s['created_time']) == $self_time){
					$same_num ++;
				}
			}
			if($same_num > 1){
				$range = $range + $same_num - 1;
			}

			return [$record['total'],$range];
		}else{
			return false;
		}
	}

	public function rangeByPage($activity_id,$page){
		$records = Db::name('gasoline_count')
			->alias('g')
			->join('joiner j','j.id = g.joiner_id')
			->where('g.activity_id',$activity_id)
			->order('total desc')
			->field('g.*,j.member_info,j.phone,j.name,j.label')
			->page($page,config('paginate.list_rows'))
			->select();

		$this->supplyMemberInfo($activity_id,$records);

		return $records;
	}
}