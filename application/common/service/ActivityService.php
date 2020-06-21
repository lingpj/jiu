<?php
/**
 * Created by PhpStorm.
 * Author: zjh
 * Date: 2017-6-10 010
 * Time: 11:40
 */

namespace app\common\service;


use app\common\model\Activity;
use think\Db;
use think\Log;

class ActivityService extends CommonService
{
	public function fetch($page,$phone,$sort_joiner = 0){
		$records = Db::name('activity')
				->alias('a')
				->join('member m','m.id = a.member_id')
				->field('a.*,m.phone');

		if($phone){
			$records = $records->where('m.phone',$phone);
		}

		if($sort_joiner){
			$records = $records->order('a.`joiner` desc');
		}else{
			$records = $records->order('a.created_time desc');
		}

		$query = [
			'page' => $page,
			'query'=> [
				'phone'       => $phone,
				'sort_joiner' => $sort_joiner
			]
		];

		$records = $records->paginate($this->pageSize(),false,$query);

		$list = $this->paginate($records);

		return $list;
	}

	public function delete($activity_id,$member_id){
		$model = new Activity();
		return $model->where('id',$activity_id)->where('member_id',$member_id)->delete();
	}

	public function fetchGroupSet($activity_id){
		$model = new Activity();
		$record = $model->where('id',$activity_id)->find();
		if($record){
			return json_decode_array($record['group_set']);
		}else{
			return false;
		}
	}

	//获取没有被处理过的原生的数据
	public function fetchByIdRaw($activity_id){
		$model = new Activity();
		$record = $model->where('id',$activity_id)->find();
		if($record){
			return $record->toArray();
		}else{
			return [];
		}
	}

	private function addGroupSet($records){
		foreach($records as &$record){
			$m = json_decode_array($record['group_set']);
			$record['group_set'] = $m;
		}
		return $records;
	}

	private function addMemberInfo($records){
		foreach($records as &$record){
			$member_info = json_decode_array($record['member_info']);
			if(count($member_info) == 0){
				$member_info = [['item' => '','require' => false],['item' => '','require' => false]];
			}
			if(count($member_info) == 1){
				$member_info[] = ['item' => '','require' => false];
			}
			$record['member_info'] = $member_info;
		}
		return $records;
	}

	private function addGameSet($records){
		foreach($records as &$record){
			$record['game_set'] = json_decode_array($record['game_set']);
		}
		return $records;
	}

	public function handleVideo($uri){
		if(strpos($uri,'v.qq.com') !== false){
			if(preg_match('/.*\.html$/',$uri)){
				$pos = strrpos($uri,'/');
				if($pos !== false){
					$id = substr($uri,$pos + 1,strlen($uri) - $pos);
					$id = str_replace('.html','',$id);
					//src='https://v.qq.com/iframe/player.html?vid=%s&tiny=0&auto=0'
					$id = sprintf("<iframe frameborder=0 width=640 height=498 src=https://v.qq.com/iframe/player.html?vid=%s&tiny=0&auto=0  allowfullscreen></iframe>",$id);
				}else{
					$id = false;
				}
			}else if(preg_match('/.*vid=([^&]+)/',$uri,$match)){
				//src='https://v.qq.com/iframe/player.html?vid=%s&tiny=0&auto=0'
				$id = sprintf("<iframe frameborder=0 width=640 height=498 src=https://v.qq.com/iframe/player.html?vid=%s&tiny=0&auto=0 allowfullscreen></iframe>",$match[1]);
			}else{
				$id = false;
			}
		}else{
			$id = false;
		}

		if($id === false){
			$prefix_pos = strpos($uri,'id_');
			$suffix_pos = strpos($uri,'==.html');
			if($prefix_pos !== false){
				if($suffix_pos !== false){
					$id = substr($uri,$prefix_pos + 3,$suffix_pos - $prefix_pos - 3);
					$id = sprintf("<iframe height=498 width=510 src=http://player.youku.com/embed/%s== frameborder=0 allowfullscreen></iframe>",$id);
				}else if( ($suffix_pos = strpos($uri,'.html?')) !== false ){

					if($suffix_pos !== false){
						$id = substr($uri,$prefix_pos + 3,$suffix_pos - $prefix_pos - 3);
						$id = sprintf("<iframe height=498 width=510 src=http://player.youku.com/embed/%s frameborder=0 allowfullscreen></iframe>",$id);
					}else{
						$id = false;
					}
				}else if(preg_match('/.*#vid=([^.#]+)/',$uri,$match)){
					$id = sprintf("<iframe height=498 width=510 src=http://player.youku.com/embed/%s frameborder=0 allowfullscreen></iframe>",$match[1]);
				}else if(preg_match('/.*id_([^.#]+)/',$uri,$match)){
					$id = sprintf("<iframe height=498 width=510 src=http://player.youku.com/embed/%s frameborder=0 allowfullscreen></iframe>",$match[1]);
				}else{
					$id = false;
				}
			}else{
				$id = false;
			}
		}

		return $id === false ? '':$id;
	}

	private function addVideo($records){
		foreach($records as $key => &$record){
			$video = $record['video'];
			if($video == "[]" || $video == '' || $video == '""'){
				$video = [];
			}else{
				$video = json_decode_array($video);
			}

			$record['video'] = $video;

			foreach($video as &$v){
				$v = $this->handleVideo($v);
			}

			$record['video_code'] = $video;
		}

		return $records;
	}

	private function addMusic($records){
		$music_service = new MusicService();
		foreach($records as &$record){
			if($record['music_id'] != 0){
				$one = $music_service->fetchById($record['music_id']);
				if($one){
					$record['music_src'] = oss_music($one['url']);
				}
			}
		}
		return $records;
	}

	public function increasePageView($activity_id){
		$model = new Activity();
		return $model->where('id',$activity_id)->setInc('page_view');
	}

	public function increaseShare($activity_id){
		$model = new Activity();
		return $model->where('id',$activity_id)->setInc('share');
	}

	public function increaseJoiner($activity_id){
		$model = new Activity();
		return $model->where('id',$activity_id)->setInc('joiner');
	}

	public function increaseCount($activity_id){
		$model = new Activity();
		return $model->where('id',$activity_id)->setInc('count');
	}

	private function addFragment($records){
		foreach($records as &$record){
			$fragment = json_decode($record['fragment'],1);
			$record['fragment'] = $fragment == null ? [] : $fragment;
		}
		return $records;
	}

	private function handleSkin($records){
		foreach($records as &$record){
			$skin = $record['skin'];
			if( ! empty($skin)){
				$array = json_decode($skin,1);
				$record['skin'] = $array === null ? [] : $array;
			}else{
				$record['skin'] = [];
			}
		}
		return $records;
	}

	private function add($records){
//		$records = $this->addImage($records);
		$records = $this->_addImage($records);
		$records = $this->addTimeTag($records);
		$records = $this->addGroupSet($records);
		$records = $this->addMemberInfo($records);
//		$records = $this->addGameSet($records);
		$records = $this->addVideo($records);
		$records = $this->addMusic($records);
//		$records = $this->addFragment($records);
		$records = $this->handleSkin($records);

		return $records;
	}

	public function fetchMemberInfo($activity_id,$member_id = null){
		$model = new Activity();

		$collection = $model->where('id',$activity_id);

		if($member_id){
			$collection = $collection->where('member_id',$member_id);
		}

		$record = $collection->field('member_info')->find();

		if($record){
			return get_json_decode($record['member_info']);
		}else{
			return [];
		}
	}

	public function lazyFetchSrc(ImageService $image_service,$image_id,$member_id){
		if(empty($image_id)){
			return '';
		}

		$one = $image_service->fetchById($image_id);

		if($one){
			if(empty($one['server_id'])) {
				return $one['url'];
			}else{
				if($one['need_update'] == ImageService::NEED_UPDATE || empty($one['url'])){
					$object = $image_service->fetchImageFromMedia($one['server_id']);
					if( ! empty($object)){
						$image_service->updateObject($image_id,$member_id,$object);
						return $object;
					}
				}
			}
		}else{
			return '';
		}

		return $one['url'];
	}

	private function _addImage($records){
		$image_service = new ImageService();
		$values = ['main_image','page_image'];

		foreach($records as &$item){
			foreach($values as $value){
				$item[$value.'_src'] = $this->lazyFetchSrc($image_service,array_get($item,$value),session('member.id'));
			}

			$thumb = $item['thumb'];
			$thumbs = explode(',',$thumb);
			$thumb_src = [];
			foreach($thumbs as $t){
				$object = $this->lazyFetchSrc($image_service,$t,$item['member_id']);
				if( ! empty($object)){
					$thumb_src[] = ['id' => $t,'src' => $object];
				}
			}
			$item['thumb_src'] = $thumb_src;
		}

		return $records;
	}

	private function addImage($records){
		$image = new ImageService();
		$values = ['banner_image','main_image','page_image'];

		foreach($records as &$item){
			foreach($values as $value){
				if(!empty($item[$value])){
					$one = $image->fetchOneById($item[$value]);
					if($one){
						//由于历史遗留问题，这里做一下判断
						if($value == 'page_image'){
							$item[$value.'_src'] = $one['url'];
						}else{
							$item[$value.'_src'] = $one['url'];
						}
					}else{
						$item[$value.'_src'] = '';
					}
				}else{
					$item[$value.'_src'] = '';
				}
			}
			$thumb = $item['thumb'];
			$thumbs = explode(',',$thumb);
			$thumb_src = [];
			foreach($thumbs as $t){
				$one = $image->fetchOneById($t);
				if($one){
					$thumb_src[] = ['id' => $t,'src' => $one['url']];
				}
			}
			$item['thumb_src'] = $thumb_src;
		}

		return $records;
	}

	private function addTimeTag($records){
		foreach($records as &$item){
			$start_time = strtotime($item['start_time']);
			$end_time = strtotime($item['end_time']);
			$time = time();

			if($time < $start_time){
				$time_tag = '未开始';
				$can_del = true;
			}else if($time >= $start_time && $time <= $end_time){
				$time_tag = '进行中';
				$can_del = false;
			}else if($time > $end_time){
				$time_tag = '已结束';
				$can_del = true;
			}
			$item['time_tag'] = $time_tag;
			$item['can_del'] = $can_del;
		}

		return $records;
	}

	public function fetchByMember($member_id){
		$model = new Activity();
		$records = $model->where('member_id',$member_id)->order('id desc')->select();
		if($records){
			$records = $records->toArray();
		}
		$records = $this->add($records);

		return $records;
	}

	private function getActivityListSessionKey($member_id){
		return $member_id.'_activity_list';
	}

	public function fetchActivityListFromSession($member_id){
		$key = $this->getActivityListSessionKey($member_id);
		$list = session($key);
		if($list){
			return $list;
		}else{
			$model = new Activity();
			$records = $model->where('member_id',$member_id)->where('father_id',0)->order('id desc')->select();
			if($records){
				$records = $records->toArray();
			}

			$records = $this->add($records);

			session($key,$records);

			return $records;
		}
	}

	public function clearActivityListSession($member_id){
		$key = $this->getActivityListSessionKey($member_id);
		return session($key,null);
	}

	public function hasActivity($activity_id,$member_id){
		$model = new Activity();
		$record = $model->where('id',$activity_id)->where('member_id',$member_id)->field('id')->find();

		return !empty($record);
	}

	public function fetchByMemberAndTag($member_id,$tag){
		$model = new Activity();
		$records = $model->where('member_id',$member_id)->where('tag',$tag)->select();
		$records = $this->add($records);

		return $records;
	}

	public function fetchById($activity_id){
		$model = new Activity();
		$record = $model->where('id',$activity_id)->find();

		if($record){
			return $record->toArray();
		}else{
			return [];
		}
	}

	public function fetchRawByTagAndId($tag,$activity_id){
		$model = new Activity();
		$record = $model->where('tag',$tag)->where('id',$activity_id)->find();

		if($record){
			return $record->toArray();
		}else{
			return [];
		}
	}

	public function fetchParent($activity_id){
		$record = Db::name('activity')
				->alias('a')
				->join('activity b','a.father_id = b.id')
				->where('a.id',$activity_id)
				->field('b.*')
				->find();

		return $record;
	}

	public function fetchByFather($father_id){
		$model = new Activity();
		$records = $model->where('father_id',$father_id)->select();
		if($records){
			return $records->toArray();
		}else{
			return [];
		}
	}

	public function updateCount($activity_id,$page_view,$share){
		$model = new Activity();

		$success = $model->where('id',$activity_id)->update([
			'page_view'    => $page_view,
			'share'        => $share,
			'updated_time' => date_normal()
		]);

		return $success;
	}

	public function fetchByTagAndId($tag,$activity_id){
		$model = new Activity();
		$record = $model->where('id',$activity_id)->where('tag',$tag)->find();

		if($record){
			//过滤
			foreach(['page_title','page_intro','title','org_intro','intro','page_title','page_intro','rule'] as $key){
				if(isset($record[$key])){
					$record[$key] = trip_blank($record[$key]);
				}
			}
			$records = $this->add([$record]);
			return $records[0];
		}else{
			return false;
		}
	}

	public function fetchByMemberAndTagAndId($member_id,$tag,$id){
		$model = new Activity();
		$record = $model->where('member_id',$member_id)
						->where('id',$id)
						->where('tag',$tag)->find();
		if($record){
			$records = $this->add([$record]);
			return $records[0];
		}else{
			return false;
		}
	}

	public static function getThumbByTag($tag){
		$list = config('make_list');
		foreach($list as $item){
			if($item['tag'] == $tag){
				return $item['thumb'];
			}
		}
		return false;
	}

	public function updateQrcode($activity_id,$url){
		$model = new Activity();

		$result = $model->where('id',$activity_id)->update(['qrcode' => $url]);
		$this->clearActivityListSession(session('member.id'));

		return $result;
	}

	public function handleLuckPrizeSet($prize_set){
		$image_service = new ImageService();
		foreach($prize_set as &$item){
			if( ! empty($item['image'])){
//				$item['src'] = $image_service->fetchById($item['image'])['url'];
				$item['src'] = $this->lazyFetchSrc($image_service,$item['image'],session('member.id'));
			}else{
				$item['src'] = '';
			}
		}
		return $prize_set;
	}

	public function fetchShareVar($activity_id){
		$record = (new Activity())->where('id',$activity_id)->field('page_title,page_image,page_intro')->find();
		$record['page_image_src'] = (new ImageService())->fetchSrcById($record['page_image']);

		return $record;
	}

	public function fetchByIdAndMember($id,$member_id){
		$model = new Activity();
		$record = $model->where('id',$id)->where('member_id',$member_id)->find();
		if($record){
			$record = $record->toArray();
			$tpl = (new TemplateService())->fetchByTag($record['tag'],$record['theme']);
			if($tpl){
				$skins = json_decode($tpl['skin'],1);
				$skins = $skins === null ? [] : $skins;
			}else{
				$skins = [];
			}
			$record['skins'] = $skins;
		}
		$records = $this->add([$record]);

		return $records[0];
	}

	public function memberHasActivity($member_id,$activity_id){
		$model = new Activity();
		$record = $model->where('id',$activity_id)->where('member_id',$member_id)->find();

		return ! empty($record);
	}

	static private function genActivityKey($activity_id){
		return "{$activity_id}_activity";
	}

	static public function clearActivity($activity_id){
		$cache_key = self::genActivityKey($activity_id);
		$redis = RedisService::getInstance();

		return $redis->del($cache_key);
	}

	public function _fetchCacheLuck($id,$member_id = null){
		$model = new Activity();

		if(is_null($member_id)){
			$record = $model->where('id',$id)->find();
		}else{
			$record = $model->where('id',$id)->where('member_id',$member_id)->find();
		}

		if($record){
			$record = $record->toArray();
		}else{
			return false;
		}

		$records = $this->add([$record]);
		$record = $records[0];

		$record['game_set'] = json_decode($record['game_set'],true);
		$prize_set = $this->handleLuckPrizeSet(json_decode($record['prize_set'],1));

		foreach($prize_set as &$set){
			if( ! empty($set['src'])){
				$set['src'] = oss_img($set['src']);
			}
		}

		$record['prize_set'] = $prize_set;
		$record['show_prize'] = $record['game_set']['show_prize'];

		return $record;
	}

	public function fetchCacheLuck($id,$member_id = null){
		$cache_key = self::genActivityKey($id);
		$redis = RedisService::getInstance();
		$record = $redis->get($cache_key);

		if($record){
			$record = unserialize($record);
			if( ! is_null($member_id)){
				if($record['member_id'] == $member_id){
					return $record;
				}else{
					return false;
				}
			}else{
				return $record;
			}
		}else{
			$model = new Activity();

			if(is_null($member_id)){
				$record = $model->where('id',$id)->find();
			}else{
				$record = $model->where('id',$id)->where('member_id',$member_id)->find();
			}

			if($record){
				$record = $record->toArray();
			}else{
				return false;
			}
			$records = $this->add([$record]);
			$record = $records[0];

			$record['game_set'] = json_decode($record['game_set'],true);
			$prize_set = $this->handleLuckPrizeSet(
				json_decode_array($record['prize_set'])
			);

			foreach($prize_set as &$set){
				if( ! empty($set['src'])){
					$set['src'] = oss_img($set['src']);
				}
			}

			$record['prize_set'] = $prize_set;
			$redis->set($cache_key,serialize($record));
			$redis->expire($cache_key,2*60);//2 minutes expire

			return $record;
		}
	}

	public function update($id,$member_id,$data){
		$model = new Activity();
		$result = $model
				->where('id',$id)
				->where('member_id',$member_id)
				->update($data);

		if($result){
			$this->clearActivityListSession($member_id);
		}

		return $result;
	}

	public function create($data){
		$last_id = (new Activity())->insertGetId($data);

		$this->clearActivityListSession($data['member_id']);

		return $last_id;
	}
}