<?php
/**
 * Created by PhpStorm.
 * Author: zjh
 * Date: 2017-6-30 030
 * Time: 10:27
 */

namespace app\common\service;
use app\common\model\Bargain;
use app\common\service\JoinService;
use think\Db;

class BargainService extends CommonService
{
	static public function getRangeCacheKey($activity_id){
		return 'bargain_range__'.$activity_id;
	}

	//当有新用户参与以及有新人砍价时，需要清除缓存
	static public function clearRangeCache($activity_id){
		$redis = RedisService::getInstance();
		$key = self::getRangeCacheKey($activity_id);

		return $redis->del($key);
	}

	static public function clearRangeCacheByJoiner($joiner_id){
		$join_service = new JoinService();
		$record = $join_service->fetchById($joiner_id);
		if($record){
			return self::clearRangeCache($record['activity_id']);
		}else{
			return false;
		}
	}

	public function currentPrice($activity_id,$joiner_id,$order = 'asc'){
		$model = new Bargain();
		$one = $model->where('activity_id',$activity_id)
					->where('joiner_id',$joiner_id)
					->order("price_after_bargain {$order}")
					->find();
		if($one){
			return $one['price_after_bargain'];
		}else{
			return false;
		}
	}

	public function latestPrice($activity_id,$joiner_id){
		$model = new Bargain();

		$one = $model->where('activity_id',$activity_id)
			->where('joiner_id',$joiner_id)
			->field('price_after_bargain')
			->order('price_after_bargain asc')
			->find();

		if($one){
			$current_price = $one['price_after_bargain'];
		}else{
			$current_price = '原价';
		}

		return $current_price;
	}

	public function latestVoucherPrice($activity_id,$joiner_id){
		$model = new Bargain();

		$one = $model->where('activity_id',$activity_id)
			->where('joiner_id',$joiner_id)
			->field('price_after_bargain')
			->order('price_after_bargain desc')
			->find();

		if($one){
			$current_price = $one['price_after_bargain'];
		}else{
			$current_price = 0;
		}

		return $current_price;
	}

	public function fetchJoiner($activity_id,$page,$query){
		list($records,$pagination) = (new JoinService())->fetchByPage($activity_id,$page,$query);

		foreach($records as &$record){
			$record['current_price'] = $this->latestPrice($activity_id,$record['id']);
		}

		return [$records,$pagination];
	}

	public function fetchByActivityAndOpenId($activity_id,$open_id){
		$model = new Bargain();
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

	public function fetchByActivityAndOpenIdAndJoiner($activity_id,$open_id,$joiner_id){
		$model = new Bargain();
		$one = $model->where('activity_id',$activity_id)
			->where('open_id',$open_id)
			->where('joiner_id',$joiner_id)
			->find();
		if($one){
			return $one->toArray();
		}else{
			return [];
		}
	}

	public function sortDuplicateByTime($list){
		if( ! isset($list[0])){
			return [];
		}
		$ret = [];
		$index = 0;
		$count = count($list);
		while($index < $count){
			$group = [];
			$tmp_index = $index;
			$tmp = $list[$tmp_index]['price_after_bargain'];
			while($tmp_index < $count && $list[$tmp_index]['price_after_bargain'] == $tmp){
				$group[] = $list[$tmp_index];
				$tmp_index ++;
			}
			sort_by_key($group,'created_time');
			$ret = array_merge($ret,$group);
			$index = $tmp_index;
		}
		return $ret;
	}

	public function _fetchCacheRange($activity_id,$page,$page_size){
		$records = Db::name('bargain_record')
						->alias('b')
						->join('joiner j','j.id = b.joiner_id')
						->field('min(b.price_after_bargain) as price_after_bargain,j.created_time,j.label,b.joiner_id,j.name,j.phone,j.id')
						->group('b.joiner_id')
						->order('price_after_bargain asc')
						->where('b.activity_id',$activity_id)
						->page($page,$page_size)
						->select();
		//按时间排序，参加时间早的人排在前

		$records = $this->sortDuplicateByTime($records);

		return $records;
	}

	//将排序过的数组序列化后set给一个key
	public function fetchCacheRange($activity_id,$page,$page_size){
		return $this->_fetchCacheRange($activity_id,$page,$page_size);
//		$redis = RedisService::getInstance();
//		$key = self::getRangeCacheKey($activity_id);
//
//		$records = $redis->get($key);
//
//		if($records){
//			$records = unserialize($records);
//		}else{
//			$records = $this->fetchRange($activity_id);
//			$redis->set($key,serialize($records));
//			$redis->expire($key,2 * 60 * 60);//2 hours
//		}
//
//		$offset = ($page - 1) * $page_size;
//		$part = array_slice($records,$offset,$page_size);
//
//		return $part;
	}

	public function fetchVoucherRange($activity_id,$page,$page_size){
		$records = Db::name('bargain_record')
			->alias('b')
			->join('joiner j','j.id = b.joiner_id')
			->field('max(b.price_after_bargain) as price_after_bargain,j.created_time,j.label,b.joiner_id,j.name,j.phone,j.id')
			->group('b.joiner_id')
			->order('price_after_bargain desc')
			->where('b.activity_id',$activity_id)
			->page($page,$page_size)
			->select();
		//按时间排序，参加时间早的人排在前

		$records = $this->sortDuplicateByTime($records);

		return $records;
	}

	private function makeJoiner(){
		return [
			'name' => MakeDataService::name(),
			'phone' => MakeDataService::phone(),
			'price_after_bargain' => MakeDataService::price(9,44),
			'created_time' => MakeDataService::date('2017-08-06 1:00','2017-08-06 23:00'),
		];
	}

	public function countArriveFloor($activity_id,$floor_price){
		$model = new Bargain();
		$number = $model->where('activity_id',$activity_id)
						->where('price_after_bargain',$floor_price)
						->count();
		return $number;
	}

	public function fetchRange($activity_id){
		$joiners = (new JoinService())->fetchByActivity($activity_id);
		$model = new Bargain();
		foreach($joiners as &$joiner){
			$one = $model->where('joiner_id',$joiner['id'])
				->where('activity_id',$activity_id)
				->order('price_after_bargain asc')
				->field('price_after_bargain,created_time')
				->find();
			if($one){
				$joiner['price_after_bargain'] = $one['price_after_bargain'];
				$joiner['last_created_time'] = $one['created_time'];
			}
		}

		if($activity_id == 299){
			$redis = RedisService::getInstance();
			$key = 'make_bargain_data';
			$list = $redis->get($key);
			if( ! $list){
				$list = [];
				foreach(range(1,600) as $key){
					$list[] = $this->makeJoiner();
				}
				foreach(range(1,20) as $index => $k){
					$list[$index]['price_after_bargain'] = '0.00';
				}
				$redis->set($key,serialize($list));
			}else{
				$list = unserialize($list);
			}

			$joiners = array_merge($joiners,$list);
		}

		sort_by_key($joiners,'price_after_bargain');

		//检出前N个一样price_after_bargain的joiner，并按created_time升序排列
		$price = current($joiners)['price_after_bargain'];
		$index = -1;

		foreach($joiners as $j){
			if($j['price_after_bargain'] == $price){
				$index ++;
			}else{
				break;
			}
		}

		$part = array_slice($joiners,0,$index + 1);
		if(count($part) > 0){
			sort_by_key($part,'created_time');
			array_splice($joiners,0,$index + 1,$part);
		}

		return $joiners;
	}

	public function create($data){
		$model = new Bargain();
		return $model->insertGetId($data);
	}
}