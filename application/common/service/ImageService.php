<?php
/**
 * Created by PhpStorm.
 * Author: zjh
 * Date: 2017-6-10 010
 * Time: 21:22
 */

namespace app\common\service;

use app\common\model\Image;
use OSS\OssClient;
use OSS\Core\OssException;
use think\Log;

class ImageService extends CommonService
{
	const IS_DELETE = 1;
	const NOT_DELETE = 0;
	const NEED_UPDATE = 1;
	const NOT_NEED_UPDATE = 0;

	private $accessKeyId;
	private $accessKeySecret;
	private $endpoint;
	private $bucket;

	private function initVar(){
		$oss = config('oss');
		$this->accessKeyId = $oss['accessKeyId'];
		$this->accessKeySecret = $oss['accessKeySecret'];
		$this->endpoint = $oss['endpoint'];
		$this->bucket = $oss['bucket'];
	}

	public function updateObject($image_id,$member_id,$object){
		$model = new Image();

		$result = $model->where('id',$image_id)
			->where('member_id',$member_id)
			->update(['url' => $object,'need_update' => self::NOT_NEED_UPDATE]);

		return $result;
	}

	public function addObject($object,$member_id){
		$model = new Image();

		$last_id = $model->insertGetId([
			'url'          => $object,
			'member_id'    => $member_id,
			'need_update'  => 0,
			'is_delete'    => 0,
			'updated_time' => date_normal(),
			'created_time' => date_normal()
		]);

		return $last_id;
	}

	public function updateServerId($image_id,$member_id,$server_id){
		$model = new Image();

		$result = $model->where('id',$image_id)
				->where('member_id',$member_id)
				->update([
					'server_id'	=> $server_id,
					'need_update' => self::NEED_UPDATE,
					'updated_time' => date_normal()
				]);

		return $result;
	}

	public function fetchImageFromMedia($server_id){
		$redis = RedisService::getInstance();
		$accessToken = $redis->get('access_token');
		$file_name = uuid().'.jpg';
		$targetName = ROOT_PATH.'public'.DS.'upload'.DS.$file_name;

		$ch = curl_init("http://file.api.weixin.qq.com/cgi-bin/media/get?access_token={$accessToken}&media_id={$server_id}");

		$fp = fopen($targetName, 'wb');
		curl_setopt($ch, CURLOPT_FILE, $fp);
		curl_setopt($ch, CURLOPT_HEADER, 0);
		curl_exec($ch);
		$http_info = curl_getinfo($ch);
		curl_close($ch);
		fclose($fp);

		Log::error($http_info);

		if(isset($http_info['content_type']) && strpos($http_info['content_type'],'image') !== false){
			$object = $this->ossUpload($targetName,null,null,date('Ymd').'/'.$file_name);
			if($object instanceof \Exception){
				Log::error("上传至oss失败：{$object->getMessage()}");
			}
			return $object;
		}else{
			Log::error('从微信media获取图片错误');
		}

		return '';
	}

	public function addServerId($member_id,$server_id){
		$model = new Image();

		$last_id = $model->insertGetId([
			'member_id' => $member_id,
			'server_id' => $server_id,
			'created_time' => date_normal(),
			'updated_time' => date_normal(),
		]);

		return $last_id;
	}

	public function buildUrl($object){
		$this->initVar();
		return 'http://'.$this->bucket.'.'.$this->endpoint.'/'.$object.'?x-oss-process=style/400px';
	}

	static public function builtUrl($object,$style = '400px'){
		$oss = config('oss');
		$endpoint = $oss['endpoint'];
		$bucket = $oss['bucket'];
		if($style){
			return 'http://'.$bucket.'.'.$endpoint.'/'.$object.'?x-oss-process=style/'.$style;
		}else{
			return 'http://'.$bucket.'.'.$endpoint.'/'.$object;
		}
	}

	public function fetchByIdAndMember($id,$member_id){
		$model = new Image();
		return $model->where('id',$id)->where('member_id',$member_id)->find();
	}

	public function fetchSrcById($image_id){
		$one = $this->fetchOneById($image_id);

		return empty($one) ? '':$one['url'];
	}

	public function fetchSrcArrayById($image_id){
		$ids = explode(',',$image_id);
		$list = [];
		foreach($ids as $id){
			$list[] = $this->fetchSrcById($id);
		}
		return $list;
	}

	public function fetchOneById($id){
		$model = new Image();
		return $model->where('id',$id)->find();
	}

	public function fetchById($id){
		return $this->fetchOneById($id);
	}

	public function create($data){
		$model = new Image();
		return $model->insertGetId($data);
	}

	public function delete($image_id,$member_id){
		$model = new Image();
		$record = $model->where('id',$image_id)->where('member_id',$member_id)->find();

		if($record){
			$file = ROOT_PATH.'public'.DS.'upload'.$record['url'];
			if(is_file($file)){
				unlink($file);
			}
			$success = $model->where('id',$image_id)->update(['is_delete' => self::IS_DELETE]);
			return $success;
		}else{
			return false;
		}
	}

	public function ossDel($image_id,$member_id){
		$model = new Image();
		$record = $model->where('id',$image_id)->where('member_id',$member_id)->find();

		if($record){
			$model->where('id',$image_id)->update(['is_delete' => self::IS_DELETE]);
			return $this->ossDelete($record['url']);
		}else{
			return false;
		}
	}

	public function checkImageFile($file,$types = null,$size = null){
		if($file['error'] != 0){
			return new \Exception("上传图片错误，错误码{$file['error']}");
		}
		if(is_null($types)){
			$types = ['image/jpg','image/jpeg','image/png'];
		}
		if(is_null($size)){
			$size = 2;
		}
		if( ! in_array($file['type'],$types)){
			return new \Exception('不是正确的图片格式');
		}
		if($file['size'] > $size * 1024 * 1024){
			return new \Exception("图片不能大于{$size}M");
		}
		return true;
	}

	public function saveFile($image_content,$type,$member_id){
		$path = ROOT_PATH.'public'.DS.'upload'.DS;
		$folder = date('Ymd');
		$dir = $path.$folder;
		if( ! is_dir($dir)){
			mkdir($dir);
		}
		$file = uuid().'.'.$type;
		$file_name = $folder.'/'.$file;
		$bytes = file_put_contents($dir.DS.$file,$image_content);
		if($bytes > 0){
			$image_id = $this->create([
				'member_id' => $member_id,
				'url' => $file_name,
				'created_time' => date_normal()
			]);
			//压缩文件
			resize_image($dir.DS.$file,400);
			return [$image_id,$file_name,$dir.DS.$file];
		}else{
			return false;
		}
	}

	public function updateImage($image_id,$file,$member_id,$compressed = true){
		$model = new Image();
		$record = $model->where('id',$image_id)->where('member_id',$member_id)->find();

		if( ! $record){
			return new \Exception('图片不存在');
		}else{
			$record = $record->toArray();
			$tmp_name = $file['tmp_name'];

			$this->ossDelete($record['url']);

			$upload_result = $this->ossUpload($tmp_name,null,null,$record['url']);

			if(!is_string($upload_result)){
				return $upload_result;
			}
		}
	}

	public function ossUpload($tmp_name,$type,$member_id,$object = null){

		if(is_null($object)){
			$object = join('/',[
				date('Ymd'),
				$member_id,
				uuid().'.'.$type
			]);
		}

		$this->initVar();

		try {
			$ossClient = new OssClient($this->accessKeyId, $this->accessKeySecret, $this->endpoint);
			$ossClient->setTimeout(3600);//seconds
			$ossClient->setConnectTimeout(10);//seconds
			$ossClient->uploadFile($this->bucket,$object,$tmp_name);

			return $object;
		} catch (OssException $e) {
			return $e;
		}
	}

	public function ossDelete($object){
		$this->initVar();

		try {
			$ossClient = new OssClient($this->accessKeyId, $this->accessKeySecret, $this->endpoint);
			$ossClient->setTimeout(3600);//seconds
			$ossClient->setConnectTimeout(10);//seconds
			$ossClient->deleteObject($this->bucket,$object);
			return true;
		} catch (OssException $e) {
			return $e;
		}
	}

	public function rawSaveFile($tmp_name,$type,$member_id,$compressed = true){
		$path = ROOT_PATH.'public'.DS.'upload'.DS;
		$folder = date('Ymd');
		$dir = $path.$folder;
		if( ! is_dir($dir)){
			mkdir($dir);
		}
		$file = uuid().'.'.$type;
		$file_name = $folder.'/'.$file;
		$abs_file = $dir.DS.$file;
		$success = move_uploaded_file($tmp_name,$abs_file);

		if($success){
			$image_id = $this->create([
				'member_id' => $member_id,
				'url' => $file_name,
				'created_time' => date_normal()
			]);
			//压缩文件 默认压缩 uncompressed为false时不压缩
			if($compressed){
				resize_image($abs_file,400);
			}
			return [$image_id,$file_name,$dir.DS.$file];
		}else{
			return false;
		}
	}
//
//	public function base64ConvertImage($base64){
//		$str = substr($base64,0,30);
//		$match = preg_match('/data:image\/([a-z]+);base64,/',$str,$array);
//		if($match){
//			$type = $array[1];
//			$len = strlen($array[0]);
//			$base64 = substr($base64,$len,strlen($base64) - $len - 1);
//			$image_content = base64_decode($base64);
//			return [$image_content,$type];
//		}else{
//			return false;
//		}
//	}
}