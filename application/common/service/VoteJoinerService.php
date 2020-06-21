<?php
/**
 * Created by PhpStorm.
 * Author: zjh
 * Date: 2017-7-28 028
 * Time: 13:33
 */

namespace app\common\service;
use app\common\model\VoteJoiner;

class VoteJoinerService extends CommonService
{
	const IS_DELETE = 1;
	const NOT_DELETE = 0;

	public function create($data){
		$model = new VoteJoiner();
		if( ! isset($data['created_time'])){
			$data['created_time'] = date_normal();
		}
		return $model->insertGetId($data);
	}

	public function increaseVotes($vote_joiner_id){
		$model = new VoteJoiner();
		return $model->where('id',$vote_joiner_id)->setInc('votes');
	}

	public function delete($vote_id,$member_id){
		$model = new VoteJoiner();

		return $model->where('id',$vote_id)->where('member_id',$member_id)->update(['is_delete' => self::IS_DELETE]);
	}

	public function computeDistance($vote_joiner_id,$activity_id){
		$model = new VoteJoiner();
		$records = $model->where('activity_id',$activity_id)->order('votes desc')->field('votes,activity_id,id')->select();
		if($records){
			$records = $records->toArray();
		}else{
			$records = [];
		}

		$vote = 0;
		$votes = [];

		foreach($records as $record){
			if($record['id'] = $vote_joiner_id){
				$vote = $record['votes'];
			}
			$votes[] = $record['votes'];
		}

		$votes = array_unique($votes);

		$votes = array_values($votes);

//		dump($votes);
//		dump($vote);

		foreach($votes as $index => $v){
			if($v == $vote){
				if($index > 0){
					return $votes[$index - 1] - $vote;
				}else{
					return 0;
				}
			}
		}

		return -1;
	}

	public function fetchOne($vote_joiner_id,$activity_id){
		$model = new VoteJoiner();
		$record = $model->where('id',$vote_joiner_id)->where('activity_id',$activity_id)->find();
		if($record){
			$record = $record->toArray();
		}else{
			$record = [];
		}

		if(count($record)){
			$record['images'] = json_decode($record['images'],true);
		}

		return $record;
	}

	public function range($activity_id){
		$model = new VoteJoiner();
		$records = $model->where('activity_id',$activity_id)->select();

		if($records){
			$records = $records->toArray();
		}else{
			$records = [];
		}

		if(count($records) == 0){
			return [];
		}

		$image_service = new ImageService();
		$act = new ActivityService();
		$action = $act->fetchById($activity_id);
		$member_id = $action['member_id'];

		foreach($records as &$record){
			$images = json_decode($record['images'],true);
			foreach($images as &$image){
				$image['src'] = $act->lazyFetchSrc($image_service,$image['id'],$member_id);
			}
			$record['images'] = $images;
			$record['time'] = strtotime($record['created_time']);
		}

		$records = nature_sort($records,'votes');

		return $records;
	}

	public function countJoiner($activity_id){
		$model = new VoteJoiner();
		return $model->where('activity_id',$activity_id)->where('is_delete',self::NOT_DELETE)->count();
	}

	public function countVotes($activity_id){
		$model = new VoteJoiner();
		return $model->where('activity_id',$activity_id)->where('is_delete',self::NOT_DELETE)->sum('votes');
	}

	public function searchNameOrPhone($activity_id,$member_id,$key){
		$model = new VoteJoiner();

		if($key){
			$records = $model->where('activity_id',$activity_id)
							->where('member_id',$member_id)
							->where('is_delete',self::NOT_DELETE)
							->where('name|phone','like',"{$key}%")->select();
		}else{
			$records = $model->
						where('member_id',$member_id)
						->where('activity_id',$activity_id)
						->where('is_delete',self::NOT_DELETE)
						->select();
		}

		if($records){
			$records = $records->toArray();
		}else{
			$records = [];
		}

		$image_service = new ImageService();
		$act = new ActivityService();

		foreach($records as &$record){
			$images = json_decode($record['images'],true);
			foreach($images as &$image){
				$object = $act->lazyFetchSrc($image_service,$image['id'],$member_id);
				if($object){
					$image['src'] = oss_img($object);
				}else{
					$image['src'] = '';
				}
			}
			$record['images'] = $images;
		}

		rsort_by_key($records,'votes');

		return $records;
	}

	public function hasDuplicateOrderId($id,$order_id,$activity_id){
		$model = new VoteJoiner();
		$record = $model->where('id','<>',$id)
			->where('activity_id',$activity_id)
			->where('order_id',$order_id)
			->find();

		if($record){
			return true;
		}else{
			return false;
		}
	}

	public function fetchByMemberAndActivityAndOrder($member_id,$activity_id,$order_id){
		$model = new VoteJoiner();
		$record = $model->where('member_id',$member_id)
			->where('activity_id',$activity_id)
			->where('order_id',$order_id)
			->find();
		if($record){
			return $record->toArray();
		}else{
			return [];
		}
	}

	public function update($vote_id,$member_id,$data){
		$model = new VoteJoiner();
		if( ! isset($data['updated_time'])){
			$data['updated_time'] = date_normal();
		}
		return $model->where('id',$vote_id)
			->where('member_id',$member_id)
			->update($data);
	}

}