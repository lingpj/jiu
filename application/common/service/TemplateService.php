<?php
/**
 * Created by PhpStorm.
 * Author: zjh
 * Date: 2017-7-13 013
 * Time: 8:41
 */

namespace app\common\service;
use app\common\model\Template;

class TemplateService extends CommonService
{
	private $cacheKey = 'template';

	const STATUS_DISABLED = 0;//禁用
	const STATUS_ENABLE = 1;//不禁用

	static public function contraryStatus($status){
		if($status == self::STATUS_DISABLED){
			return self::STATUS_ENABLE;
		}else if($status == self::STATUS_ENABLE){
			return self::STATUS_DISABLED;
		}else{
			throw new \Exception('Pass Wrong status value:'.$status);
		}
	}

	private function handleImage($record){
		if(count($record) == count($record,1)){
			$image_service = new ImageService();

			$data = [
				'main_image_id'  => 'main_image_src',
				'banner_image_id'=> 'banner_image_src',
				'image_id'		=> 'image_src'
			];

			foreach($data as $key => $value){
				if( ! empty($record[$key])){
					$record[$value] = $image_service->fetchSrcById($record[$key]);
				}
			}

			if( !empty($record['intro_image_ids'])){
				$intros = explode(',',$record['intro_image_ids']);
				$intro_image_src = [];
				foreach($intros as $id){
					$intro_image_src[] = $image_service->fetchSrcById($id);
				}
				$record['intro_image_src'] = $intro_image_src;
			}
		}else{
			foreach($record as &$r){
				$r = $this->handleImage($r);
			}
		}
		return $record;
	}

	public function create($data){
		$model = new Template();
		$last_id = $model->insertGetId($data);
//		$this->clear();

		return $last_id;
	}

	public function fetchByTag($tag,$theme = null){
		$records = $this->fetchCache();

		foreach($records as $record){
			if($record['tag'] == $tag && $record['theme'] == $theme){
				return $record;
			}
		}

		return false;
	}

	public function update($id,$data){
		$model = new Template();
		$success = $model->where('id',$id)->update($data);

		return $success;
	}

	public function fetchById($id){
		$model = new Template();
		$record = $model->where('id',$id)->find();
		if($record){
			return $record->toArray();
		}else{
			return [];
		}
	}

	public function fetch(){
		$model = new Template();
		$records = $model->all();
		return $records;
	}

	public function fetchCache(){
		$redis = RedisService::getInstance();
		$records = $redis->get($this->cacheKey);
		if(empty($records)){
			$model = new Template();
			$collection = $model->where('status',self::STATUS_ENABLE)->select();
			$collection = !empty($collection) ? $collection->toArray():[];
			//add image
			$image_service = new ImageService();

			//为了避免后台添加的时候写错tag，这里把数据库里的模板tag和配置文件做对比，匹配才加到缓存中
			$tag_list = config('make_list');
			$new_collection = [];

			foreach($collection as &$c){
				if(in_array($c['tag'],$tag_list)){
					$c['image_id_src'] = $image_service->fetchSrcById($c['image_id']);
					$c['main_image_id_src'] = $image_service->fetchSrcById($c['main_image_id']);
					$c['intro_image_ids_src'] = $image_service->fetchSrcArrayById($c['intro_image_ids']);
					$c['intro_image_ids_array'] = explode(',',$c['intro_image_ids']);

					//为了适配已经写好，不容易修改的前端变量
					$c['main_image_src'] = $c['main_image_id_src'];
					$thumb_src = [];
					foreach($c['intro_image_ids_array'] as $key => $id){
						$thumb_src[] = [
							'id'	=> $id,
							'src'	=> $c['intro_image_ids_src'][$key]
						];
					}
					$c['thumb_src'] = $thumb_src;
					$c['thumb'] = $c['intro_image_ids'];
					$c['main_image'] = $c['main_image_id'];
//					$c['main_image'] = $c['image_id'];
//					$c['main_image_src'] = $c['image_id_src'];

					$new_collection[] = $c;
				}
			}

			rsort_by_key($new_collection,'sort');

			$redis->set($this->cacheKey,serialize($new_collection));

			return $new_collection;
		}else{
			return unserialize($records);
		}
	}

	public function clear(){
		$redis = RedisService::getInstance();
		return $redis->del($this->cacheKey);
	}
}