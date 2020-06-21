<?php
/**
 * Created by PhpStorm.
 * Author: zjh
 * Date: 2017-5-30 030
 * Time: 18:03
 */
if( ! function_exists('date_now')){
	function date_now(){
		return date('Y-m-d');
	}
}

if( ! function_exists('datetime_now')){
	function datetime_now(){
		return date('Y-m-d H:i:s');
	}
}


if( ! function_exists('time_between')){
	/**
	 * 参数类型可以是int or string
	 *
	 * @param $start_time
	 * @param $end_time
	 * @param null $time
	 * @return bool
	 */
	function time_between($start_time,$end_time,$time = null){
		if(empty($time)){
			$time = time();
		}
		$times = [$start_time,$end_time,$time];
		foreach($times as &$t){
			if( ! is_numeric($t)){
				$t = strtotime($t);
			}
		}

		$start_time = $times[0];
		$end_time = $times[1];
		$time = $times[2];

		return $time >= $start_time && $time <= $end_time;
	}
}
