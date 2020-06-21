<?php
/**
 * Created by PhpStorm.
 * Author: zjh
 * Date: 2017-6-16 016
 * Time: 21:43
 */

namespace app\common\service;


class FileService
{
	private $audioSize;

	public function __construct()
	{
		$this->audioSize = 8*1024*1024;
	}

	public function isAudio($file){
		$array = ['audio/mp3','application/octet-stream'];
		$type = $file['type'];

		return in_array($type,$array);
	}

	public function isAudioLimit($file){
		return $file['size'] <= $this->audioSize;
	}

	public function getSuffix($file){

	}

	public function saveAudio($file){
		$name = 'music/'.uniqid().'.mp3';
		$image_service = new ImageService();

		return $image_service->ossUpload($file['tmp_name'],null,null,$name);
	}
}