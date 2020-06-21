<?php
namespace app\common\service;
/**
 * Created by PhpStorm.
 * Author: zjh
 * Date: 2017-5-30 030
 * Time: 9:57
 */
class Area extends CommonService
{
	private $province_cache_key = 'province';
	private $city_cache_key = 'city';

	public function fetchCacheProvince(){
		$redis = RedisService::getInstance();
		$key = $this->province_cache_key;
		if( ($data = $redis->get($key)) === false){
			$data = $this->fetchProvince();
			$redis->set($key,serialize($data));
			return $data;
		}else{
			return unserialize($data);
		}
	}

	public function fetchCacheCityByProvince($province_id){
		$redis = RedisService::getInstance();
		$key = $this->city_cache_key;
		if( $redis->get($key) == ''){
			$data = $this->fetchCity();
			$redis->set($key,serialize($data));
		}
		$data = $redis->get($key);
		$data = unserialize($data);
		$cities = [];
		foreach($data as $item){
			if($item['provinceid'] == $province_id){
				$cities[] = $item;
			}
		}
		$a = [];
		$b = [];
		if($province_id == '410000'){
			$hayStack = ['郑州市','洛阳市'];
			foreach($cities as $item){
				if(in_array($item['city'],$hayStack)){
					$a[] = $item;
				}else{
					$b[] = $item;
				}
			}
			return array_merge($a,$b);
		}
		return $cities;
	}

	public function fetchProvince(){
		$provinces = (new \app\common\model\Area())->fetchProvince();
		$a = [];
		$b = [];
		foreach($provinces as &$item){
			$name = $item['province'];
			if(strpos($name,'北京') !== false || strpos($name,'河南') !== false){
				$a[] = $item;
			}else{
				$b[] = $item;
			}
		}
		if($a[0]['province'] != '北京'){
			$tmp = $a[0];
			$a[0] = $a[1];
			$a[1] = $tmp;
		}
		return array_merge($a,$b);
	}

	public function fetchCity(){
		return (new \app\common\model\Area())->fetchCity();
	}
}