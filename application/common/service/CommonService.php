<?php
namespace app\common\service;
use app\common\model\Activity;

/**
 * Created by PhpStorm.
 * Author: zjh
 * Date: 2017-5-29 029
 * Time: 18:58
 */
class CommonService
{
	static public function _pageSize(){
		return config('paginate.list_rows');
	}

	static public function _collectionToArray($records = null){
		if($records){
			return $records->toArray();
		}else{
			return [];
		}
	}

	static public function _paginate($records){
		if($records){
			$data = $records->toArray()['data'];
			$pagination = $records->render();
		}else{
			$data = [];
			$pagination = '';
		}
		return [$data,$pagination];
	}

	protected function pageSize(){
		return config('paginate.list_rows');
	}
	//Collection $records
	protected function collectionToArray($records = null){
		if($records){
			return $records->toArray();
		}else{
			return [];
		}
	}

	protected function supplyMemberInfo($activity_id,&$records){
		$member_info = (new ActivityService())->fetchMemberInfo($activity_id);

		foreach($records as &$record){
			$info = get_json_decode($record['member_info']);
			$list = [];
			foreach($member_info as $k => $v){
				if(isset($info[$k])){
					$list[] = $v['item'].'：'.$info[$k];
				}
			}
			$record['member_info'] = $list;
		}
	}

	protected function paginate($records){
		if($records){
			$data = $records->toArray()['data'];
			$pagination = $records->render();
		}else{
			$data = [];
			$pagination = '';
		}
		return [$data,$pagination];
	}

	protected function commonIncreaseJoiner($data){
		if(is_array($data)){
			if(isset($data['activity_id'])){
				$activity_id = $data['activity_id'];
			}
		}else if(is_numeric($data)){
			$activity_id = $data;
		}
		if(isset($activity_id)){
			$model = new Activity();
			return $model->where('id',$activity_id)->setInc('joiner');
		}
	}

	public function create($data){
		$this->commonIncreaseJoiner($data);
	}
}