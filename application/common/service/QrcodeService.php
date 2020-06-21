<?php
/**
 * Created by PhpStorm.
 * Author: zjh
 * Date: 2017-6-17 017
 * Time: 19:55
 */

namespace app\common\service;
require_once EXTEND_PATH.'phpqrcode.php';

class QrcodeService
{
	public static function generate($url){

		$file_name = uuid().'.png';
		$folder = ROOT_PATH.'public'.DS.'upload'.DS;
		if( ! is_dir($folder)){
			mkdir($folder);
		}

		$path = $folder.$file_name;
		\QRcode::png($url, $path, 'L', 4);

		if(is_file($path)){
			$object = 'qrcode/'.$file_name;
			$image_service = new ImageService();
			$object  = $image_service->ossUpload($path,null,null,$object);
			if($object instanceof \Exception){
				return $object;
			}else{
				unlink($path);
				return $object;
			}
		}else{
			return new \Exception('生成二维码失败，请重试');
		}
	}

	public static function resource($url){
		return \QRcode::resource($url, false, 'L');
	}

	public static function output($url){
		\QRcode::png($url);
	}

	public static function tmpGenFile($url)
	{
		$file = time().uuid().'.png';
		$path = ROOT_PATH.'public'.DS.'upload'.DS.$file;
		\QRcode::png($url, $path, 'L', 4);

		return $file;
	}
}