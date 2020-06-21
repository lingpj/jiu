<?php
/**
 * Created by PhpStorm.
 * Author: zjh
 * Date: 2017-6-6 006
 * Time: 21:07
 */

namespace app\common\service;


class WikiService extends CommonService
{
	public static function generate($str){
		$str = str_encode($str);
		$str = str_replace('/','$',$str);
		return $str;
	}

	public static function parse($wiki){
		$wiki = str_replace('$','/',$wiki);
		$wiki = str_decode($wiki);
		if(empty($wiki)){
			return false;
		}else{
			$array = explode('@',$wiki);
			return $array;
		}
	}
}