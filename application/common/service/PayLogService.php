<?php
/**
 * Created by PhpStorm.
 * Author: zjh
 * Date: 2017-7-10 010
 * Time: 9:00
 */

namespace app\common\service;

use app\common\model\PayLog;

class PayLogService
{
	static private function genDir(){
		$dir = RUNTIME_PATH.'paylog';
		if( ! is_dir($dir)){
			mkdir($dir);
		}
		$folder = date('Ymd');
		$dir = $dir.DS.$folder.DS;
		if( ! is_dir($dir)){
			mkdir($dir);
		}
		return $dir;
	}

	static public function write($file,$content,$tag = ''){
		$file = self::genDir().$file.'.log';
		if(empty($tag)){
			$content = date('Y-m-d H:i:s').':'.var_export($content, true) . "\n";
		}else{
			$content = date('Y-m-d H:i:s').'@'.$tag.'@'.var_export($content, true) . "\n";
		}
		file_put_contents($file, $content, FILE_APPEND);
	}

	static public function create($data){
		$model = new PayLog();

		return $model->insertGetId($data);
	}

	static public function fetchByTransaction($transaction_id){
		$model = new PayLog();
		$record = $model->where('transaction_id',$transaction_id)->find();

		return !empty($record);
	}
}