<?php
/**
 * Created by PhpStorm.
 * Author: zjh
 * Date: 2017-6-12 012
 * Time: 19:02
 */

namespace app\common\service;


use app\common\model\Music;
use think\model\Collection;

class MusicService extends CommonService
{
	const STATUS_ENABLE = 1;
	const STATUS_DISABLED = 0;

	private $cacheKey = 'music';

	public static function getStatus($status){
		$map = [
			self::STATUS_ENABLE => '启用',
			self::STATUS_DISABLED => '禁用'
		];
		return $map[$status];
	}

	public function fetchById($id){
		$list = $this->fetchCache();
		foreach($list as $li){
			if($li['id'] == $id){
				return $li;
			}
		}
		return false;
	}

	public function fetch(){
		$model = new Music();
		return $model->all();
	}

	public function fetchCache(){
		$redis = RedisService::getInstance();
		$key = $this->cacheKey;
		$list = $redis->get($key);
		if($list){
			$list = unserialize($list);
			if($list instanceof Collection){
				$list = $list->toArray();
			}
			return $list;
		}else{
			$list = $this->fetch();
			$redis->set($key,serialize($list));
			return $list;
		}
	}

	public function clearCache(){
		$redis = RedisService::getInstance();
		return $redis->del($this->cacheKey);
	}

	public function create($data){
		$model = new Music();
		return $model->save($data);
	}

	public function update($id,$data){
		$model = new Music();
		return $model->where('id',$id)->update($data);
	}

	public function delete($id){
		$model = new Music();
		return $model->where('id',$id)->delete();
	}
}