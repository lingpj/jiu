<?php
/**
 *
 * Created by PhpStorm.
 * Author: zjh
 * Date: 2017-5-29 029
 * Time: 15:58
 */

if ( ! function_exists('short_count')){
	function short_count($number){
		$number = $number * 1;

		$result = $number;
		$abs_number = abs($number);

		if($abs_number >= 1E8){
			$result = round($number / 1E8,2) . '亿';
		}else if($abs_number >= 1E4){
			$result = round($number / 1E4,2) . '万';
		}

		return $result;
	}
}

if( ! function_exists('captcha_img_changeable')){
	function captcha_img_changeable($id = "")
	{
		$src = captcha_src($id);
		return "<img data-src='{$src}' src='{$src}' alt='captcha' onclick='this.src = this.getAttribute(\"data-src\")+\"?v=\"+Math.random();' />";
	}
}

if (! function_exists('exchange_coin')){
	function exchange_coin($coin){
		return round($coin / config('multiple'),2);
	}
}

if (! function_exists('get_multiple')){
	function get_multiple($coin){
		return $coin * config('multiple');
	}
}

if( ! function_exists('get_json_decode')){
	function get_json_decode($str){
		$array = json_decode($str,1);
		return $array === null ? [] : $array;
	}
}

if( ! function_exists('output_qr_code')){
	function output_qr_code($url){
		\app\common\service\QrcodeService::output($url);
	}
}

if( ! function_exists('array_get')){
	function array_get($array,$key,$default = null){
		if(isset($array[$key])){
			return $array[$key];
		}else{
			return $default;
		}
	}
}

if( ! function_exists('generate_order')){
	function generate_order(){
		return uuid().time();
	}
}

if( ! function_exists('month_seconds')){
	function month_seconds($month = 1){
		return $month * 24 * 60 * 60;
	}
}

if( ! function_exists('make_attach')){
	function make_attach($attach){
		return '巨商宝 '.$attach.' 预付';
	}
}

if( ! function_exists('resize_image')){
	function resize_image($im,$max_width,$max_height = null){
		$size = getimagesize($im);
		if(is_null($max_height)){
			$max_height = $max_width / ($size[0]/$size[1]);
		}
		try{
			$image = \think\Image::open($im);

			//解决苹果手机图片可能反转的问题，需要开启php_exif扩展
			if(extension_loaded('exif')){
				$exif = @exif_read_data($im);
				if(isset($exif['Orientation'])){
					if($exif['Orientation'] == 3) {
						$image->rotate(180);
					} elseif($exif['Orientation'] == 6) {
						$image->rotate(90);
					} elseif($exif['Orientation'] == 8) {
						$image->rotate(90);//maybe have problem
					}
				}
			}

			$image->thumb($max_width,$max_height,\think\Image::THUMB_SCALING)->save($im);

			return true;
		}catch(\Exception $e){
			\app\common\service\PayLogService::write('haha',$e->getMessage());
			return $e->getMessage();
		}
	}
}

if( ! function_exists('trip_xss')){
	function trip_xss($list){
		if(is_array($list)){
			foreach($list as &$li){
				$li = trip_xss($li);
			}
		}else{
			$list = trip_blank($list);
		}
		return $list;
	}
}

if( ! function_exists('json_encode_filter')){
	function json_encode_filter($array){
		if(is_array($array)){
			foreach($array as &$v){
				$v = filter_quotes($v);
			}
			return json_encode($array);
		}else{
			return filter_quotes($array);
		}
	}
}

if( ! function_exists('filter_quotes')){
	function filter_quotes($str,$except = null){
		//不过滤except数组中的元素
		if($except){
			if( ! is_array($except)){
				$except = [$except];
			}
		}else{
			$except = [];
		}

		if(is_array($str)){
			foreach($str as $key => &$s){
				if( ! in_array($key,$except)){
					$s = filter_quotes($s);
				}
			}
		}else{
			$str = str_replace('\'','',$str);
			$str = str_replace('"','',$str);
		}
		return $str;
	}
}

if( ! function_exists('trip_blank')){
	function trip_blank($str){
		if(is_null($str) || trim($str) == ''){
			return '';
		}
		$str = (string)$str;
		$str = str_replace(array("\r\n", "\r", "\n","\t"), "", $str);

		$config = HTMLPurifier_Config::createDefault();
		$config->set('CSS.AllowedProperties',[]);
		$config->set('Attr.AllowedClasses',[]);
		$config->set('HTML.Allowed','p,div');
		$pure = new HTMLPurifier($config);
		$str = $pure->purify($str);

		//过滤单双引号，需要考虑json格式，不能误过滤
		$json = json_decode($str,1);
		if(is_array($json)){
			foreach($json as &$v){
				$v = filter_quotes($v);
			}
			$str = json_encode($json);
		}else{
			$str = filter_quotes($str);
		}

		return trim($str);
	}
}

if( ! function_exists('trip_enter')){
	function trip_enter($str){
		if(is_null($str) || trim($str) == ''){
			return '';
		}

		$str = (string)$str;
		$str = str_replace(array("\r\n", "\r", "\n","\t"), "", $str);

		return trim($str);
	}
}


if( ! function_exists('nature_sort')){
	function nature_sort($list,$key){
		rsort_by_key($list,$key);

		$ret = [];
		$index = 0;
		$value = null;

		foreach($list as $ele){
			if($ele[$key] !== $value){
				$index = count($ret) + 1;
			}
			$value = $ele[$key];
			$ret[] = [$index,$ele];
		}

		return $ret;
	}
}

if( ! function_exists('sort_by_key')){
	function sort_by_key(&$array,$key){
		$tmp = [];
		foreach($array as $index => $item){
			$tmp[$index] = $item[$key];
		}
		asort($tmp);
		$ret = [];
		foreach($tmp as $index => $value){
			$ret[] = $array[$index];
		}
		$array = $ret;
	}
}

if( ! function_exists('rsort_by_key')){
	function rsort_by_key(&$array,$key){
		$tmp = [];
		foreach($array as $index => $item){
			$tmp[$index] = $item[$key];
		}
		arsort($tmp);
		$ret = [];
		foreach($tmp as $index => $value){
			$ret[] = $array[$index];
		}
		$array = $ret;
	}
}

if( ! function_exists('make_one_first')){
	function make_one_first(&$array,$key,$value){
		foreach($array as $index => $a){
			if($a[$key] == $value){
				$tmp = $a;
				unset($array[$index]);
				array_unshift($array,$tmp);
				return;
			}
		}
	}
}

if( ! function_exists('whole_url')){
	function whole_url($request,$url,$param = ''){
		$prefix = $request->scheme().'://'.$request->host().$url;
		if(is_array($param)){
			$param = http_build_query($param);
		}
		if( ! empty($param)){
			$param = '?'.$param;
		}

		return $prefix.$param;
	}
}

if( ! function_exists('whole_url_raw')){
	function whole_url_raw($uri){
		$server = $_SERVER;
		return $server['REQUEST_SCHEME'].'://'.$server['HTTP_HOST'].url($uri);
	}
}

if( ! function_exists('after_greater_before') ){
	function after_greater_before($start_time,$end_time){
		if( ! is_numeric($start_time)){
			$start_time = strtotime($start_time);
		}
		if( ! is_numeric($end_time) ){
			$end_time = strtotime($end_time);
		}

		return $end_time > $start_time;
	}
}

if( ! function_exists('make_join_session')){
	function make_join_session($tag,$activity_id){
		return $tag.'_joiner_'.$activity_id;
	}
}

if( ! function_exists('make_join_cookie')){
	function make_join_cookie($tag,$activity_id){
		return $tag.'_joiner_'.$activity_id;
	}
}

if( ! function_exists('filter_script')){
	/**
	 * 可以传入 array or string
	 * @param $str
	 * @return mixed
	 */
	function filter_script($str){
		if(is_array($str)){
			foreach($str as &$s){
				$s = filter_script($s);
			}
			return $str;
		}
		$str = str_replace('<script>','',$str);
		$str = str_replace('</script>','',$str);
		return $str;
	}
}

if( ! function_exists('remove_xss_array')){
	function remove_xss_array(&$data){
		if(is_array($data)){
			foreach($data as &$item){
				remove_xss_array($item);
			}
		}else{
			$data = remove_xss($data);
		}
	}
}

if( ! function_exists('class2array')){
	function class2array($array){
		try{
			foreach($array as &$item){
				if(is_object($item)){
					$item = (array)$item;
				}else if(is_array($item)){
					$item = class2array($item);
				}
			}
		}catch (\Exception $e){
			if(is_string($array)){
				$array = json_decode($array);
			}else{
//				dump($e->getMessage());
			}
		}
		return $array;
	}
}

if( ! function_exists('json_decode_any')){
	function json_decode_any($str){

	}
}

if( ! function_exists('json_decode_array')){
	function json_decode_array($str){
		if(empty($str)){
			return [];
		}else{
			if(is_array($str)){
				return class2array($str);
			}else{
				$json = json_decode($str);
				return class2array($json);
			}
		}
	}
}

if( ! function_exists('oss_img') ){
	function oss_img($object){
		return \app\common\service\ImageService::builtUrl($object);
	}
}

if( ! function_exists('oss_img_style') ){
	function oss_img_style($object,$style){
		return \app\common\service\ImageService::builtUrl($object,$style);
	}
}

if( ! function_exists('oss_music') ){
	function oss_music($object){
		return \app\common\service\ImageService::builtUrl($object,false);
	}
}

if( ! function_exists('filter_rich')){
	function filter_rich($str){

		$str = (string)$str;
		$str = str_replace(array("\r\n", "\r", "\n","\t"), "", $str);

		$config = HTMLPurifier_Config::createDefault();
		$config->set('CSS.AllowedProperties',[]);
		$config->set('Attr.AllowedClasses',[]);
		$config->set('HTML.Allowed','p,div');
		$pure = new HTMLPurifier($config);
		$str = $pure->purify($str);

		return trim($str);
	}
}

if( ! function_exists('pure_text')){
	function pure_text($str){
		if(is_array($str)){
			foreach($str as &$s){
				$s = pure_text($s);
			}
		}else{
			$str = strip_tags($str);
			$str = trip_blank($str);
			$str = remove_xsso($str);
		}
		return $str;
	}
}

if( ! function_exists('remove_xsso')){
	function remove_xsso($val) {
		// remove all non-printable characters. CR(0a) and LF(0b) and TAB(9) are allowed
		// this prevents some character re-spacing such as <java\0script>
		// note that you have to handle splits with \n, \r, and \t later since they *are* allowed in some inputs
		$val = preg_replace('/([\x00-\x08\x0b-\x0c\x0e-\x19])/', '', $val);
		// straight replacements, the user should never need these since they're normal characters
		// this prevents like <IMG SRC=@avascript:alert('XSS')>
		$search = 'abcdefghijklmnopqrstuvwxyz';
		$search .= 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		$search .= '1234567890!@#$%^&*()';
		$search .= '~`";:?+/={}[]-_|\'\\';
		for ($i = 0; $i < strlen($search); $i++) {
			// ;? matches the ;, which is optional
			// 0{0,7} matches any padded zeros, which are optional and go up to 8 chars

			// @ @ search for the hex values
			$val = preg_replace('/(&#[xX]0{0,8}'.dechex(ord($search[$i])).';?)/i', $search[$i], $val); // with a ;
			// @ @ 0{0,7} matches '0' zero to seven times
			$val = preg_replace('/(&#0{0,8}'.ord($search[$i]).';?)/', $search[$i], $val); // with a ;
		}

		// now the only remaining whitespace attacks are \t, \n, and \r
		$ra1 = array('javascript', 'vbscript', 'expression', 'applet', 'meta', 'xml', 'blink', 'link', 'style', 'script', 'embed', 'object', 'iframe', 'frame', 'frameset', 'ilayer', 'layer', 'bgsound', 'title', 'base');
		$ra2 = array('onabort', 'onactivate', 'onafterprint', 'onafterupdate', 'onbeforeactivate', 'onbeforecopy', 'onbeforecut', 'onbeforedeactivate', 'onbeforeeditfocus', 'onbeforepaste', 'onbeforeprint', 'onbeforeunload', 'onbeforeupdate', 'onblur', 'onbounce', 'oncellchange', 'onchange', 'onclick', 'oncontextmenu', 'oncontrolselect', 'oncopy', 'oncut', 'ondataavailable', 'ondatasetchanged', 'ondatasetcomplete', 'ondblclick', 'ondeactivate', 'ondrag', 'ondragend', 'ondragenter', 'ondragleave', 'ondragover', 'ondragstart', 'ondrop', 'onerror', 'onerrorupdate', 'onfilterchange', 'onfinish', 'onfocus', 'onfocusin', 'onfocusout', 'onhelp', 'onkeydown', 'onkeypress', 'onkeyup', 'onlayoutcomplete', 'onload', 'onlosecapture', 'onmousedown', 'onmouseenter', 'onmouseleave', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'onmousewheel', 'onmove', 'onmoveend', 'onmovestart', 'onpaste', 'onpropertychange', 'onreadystatechange', 'onreset', 'onresize', 'onresizeend', 'onresizestart', 'onrowenter', 'onrowexit', 'onrowsdelete', 'onrowsinserted', 'onscroll', 'onselect', 'onselectionchange', 'onselectstart', 'onstart', 'onstop', 'onsubmit', 'onunload');
		$ra = array_merge($ra1, $ra2);

		$found = true; // keep replacing as long as the previous round replaced something
		while ($found == true) {
			$val_before = $val;
			for ($i = 0; $i < sizeof($ra); $i++) {
				$pattern = '/';
				for ($j = 0; $j < strlen($ra[$i]); $j++) {
					if ($j > 0) {
						$pattern .= '(';
						$pattern .= '(&#[xX]0{0,8}([9ab]);)';
						$pattern .= '|';
						$pattern .= '|(&#0{0,8}([9|10|13]);)';
						$pattern .= ')*';
					}
					$pattern .= $ra[$i][$j];
				}
				$pattern .= '/i';
				$replacement = substr($ra[$i], 0, 2).'<x>'.substr($ra[$i], 2); // add in <> to nerf the tag
				$val = preg_replace($pattern, $replacement, $val); // filter out the hex tags
				if ($val_before == $val) {
					// no replacements were made, so exit the loop
					$found = false;
				}
			}
		}
		return $val;
	}
}


if( ! function_exists('remove_xss')){
	function remove_xss($val) {
		// remove all non-printable characters. CR(0a) and LF(0b) and TAB(9) are allowed
		// this prevents some character re-spacing such as <java\0script>
		// note that you have to handle splits with \n, \r, and \t later since they *are* allowed in some inputs
		$val = preg_replace('/([\x00-\x08,\x0b-\x0c,\x0e-\x19])/', '', $val);
		// straight replacements, the user should never need these since they're normal characters
		// this prevents like <IMG SRC=@avascript:alert('XSS')>
		$search = 'abcdefghijklmnopqrstuvwxyz';
		$search .= 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		$search .= '1234567890!@#$%^&*()';
		$search .= '~`";:?+/={}[]-_|\'\\';
		for ($i = 0; $i < strlen($search); $i++) {
			// ;? matches the ;, which is optional
			// 0{0,7} matches any padded zeros, which are optional and go up to 8 chars

			// @ @ search for the hex values
			$val = preg_replace('/(&#[xX]0{0,8}'.dechex(ord($search[$i])).';?)/i', $search[$i], $val); // with a ;
			// @ @ 0{0,7} matches '0' zero to seven times
			$val = preg_replace('/(&#0{0,8}'.ord($search[$i]).';?)/', $search[$i], $val); // with a ;
		}

		// now the only remaining whitespace attacks are \t, \n, and \r
		$ra1 = array('javascript', 'vbscript', 'expression', 'applet', 'meta', 'xml', 'blink', 'link', 'style', 'script', 'embed', 'object', 'iframe', 'frame', 'frameset', 'ilayer', 'layer', 'bgsound', 'title', 'base');
		$ra2 = array('onabort', 'onactivate', 'onafterprint', 'onafterupdate', 'onbeforeactivate', 'onbeforecopy', 'onbeforecut', 'onbeforedeactivate', 'onbeforeeditfocus', 'onbeforepaste', 'onbeforeprint', 'onbeforeunload', 'onbeforeupdate', 'onblur', 'onbounce', 'oncellchange', 'onchange', 'onclick', 'oncontextmenu', 'oncontrolselect', 'oncopy', 'oncut', 'ondataavailable', 'ondatasetchanged', 'ondatasetcomplete', 'ondblclick', 'ondeactivate', 'ondrag', 'ondragend', 'ondragenter', 'ondragleave', 'ondragover', 'ondragstart', 'ondrop', 'onerror', 'onerrorupdate', 'onfilterchange', 'onfinish', 'onfocus', 'onfocusin', 'onfocusout', 'onhelp', 'onkeydown', 'onkeypress', 'onkeyup', 'onlayoutcomplete', 'onload', 'onlosecapture', 'onmousedown', 'onmouseenter', 'onmouseleave', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'onmousewheel', 'onmove', 'onmoveend', 'onmovestart', 'onpaste', 'onpropertychange', 'onreadystatechange', 'onreset', 'onresize', 'onresizeend', 'onresizestart', 'onrowenter', 'onrowexit', 'onrowsdelete', 'onrowsinserted', 'onscroll', 'onselect', 'onselectionchange', 'onselectstart', 'onstart', 'onstop', 'onsubmit', 'onunload');
		$ra = array_merge($ra1, $ra2);

		$found = true; // keep replacing as long as the previous round replaced something
		while ($found == true) {
			$val_before = $val;
			for ($i = 0; $i < sizeof($ra); $i++) {
				$pattern = '/';
				for ($j = 0; $j < strlen($ra[$i]); $j++) {
					if ($j > 0) {
						$pattern .= '(';
						$pattern .= '(&#[xX]0{0,8}([9ab]);)';
						$pattern .= '|';
						$pattern .= '|(&#0{0,8}([9|10|13]);)';
						$pattern .= ')*';
					}
					$pattern .= $ra[$i][$j];
				}
				$pattern .= '/i';
				$replacement = substr($ra[$i], 0, 2).'<x>'.substr($ra[$i], 2); // add in <> to nerf the tag
				$val = preg_replace($pattern, $replacement, $val); // filter out the hex tags
				if ($val_before == $val) {
					// no replacements were made, so exit the loop
					$found = false;
				}
			}
		}
		return $val;
	}
}

if (!function_exists('gbk2utf8')){
	/**
	 * 将gbk字符串转换成utf8字符串
	 * @param string $str
	 * @return string
	 */
	function gbk2utf8($str)
	{
		return mb_convert_encoding($str, 'utf-8', 'gbk');
	}
}

if (!function_exists('utf82gbk')){
	/**
	 * 将utf8字符串转换成gbk字符串
	 * @param string $str
	 * @return string
	 */
	function utf82gbk($str)
	{
		return mb_convert_encoding($str, 'gbk', 'utf-8');
	}
}

if (!function_exists('str_add_color')){
	/**
	 * 字符串添加颜色
	 * @param string $str 源字符串
	 * @param string $replace  要设置的字符串
	 * @param string $color 设置的颜色 默认红色
	 * @return mixed
	 */
	function str_add_color($string, $replace, $color = 'red')
	{
		return str_ireplace($replace, '<b style="color:' . $color . '">' . $replace . '</b>', $string);
	}
}

if (!function_exists('str_get_center')){
	/**
	 * 获取字符串中间
	 * @param string $content   源字符串
	 * @param string $leftStr   左边字符串
	 * @param string $rightStr  右边字符串
	 * @return string
	 */
	function str_get_center($content,$leftStr, $rightStr)
	{
		$leftStr = preg_quote($leftStr);
		$rightStr = preg_quote($rightStr);
		$preg = '/(?<=' . $leftStr . ').*?(?=' . $rightStr . ')/';
		preg_match_all($preg, $content, $array);
		return isset($array[0]) ? $array[0] : $array;
	}
}

if (!function_exists('str_get_left')){
	/**
	 * 从左边开始截取字符串/支持中文截取
	 * @param string $string 源字符串
	 * @param int $num 获取长度
	 * @return string
	 */
	function str_get_left($string, $num)
	{
		return get_substr($string,$num);
	}
}

if (!function_exists('get_substr')){
	/**
	 * 实现中文字串截取无乱码的方法
	 * @param $string $string 截取的字符串
	 * @param $start $start 截取开始位置
	 * @param $length $length 截取的长度
	 * @return string
	 */
	function get_substr($string, $start, $length=null) {
		if (empty($length)){
			$length = $start;
			$start = 0;
		}
		if(mb_strlen($string,'utf-8') > $length){
			$str = mb_substr($string, $start, $length,'utf-8');
			return $str.'';
		}else{
			return $string;
		}
	}
}

if (!function_exists('uuid')){
	/**
	 * 返回一个的唯一编号,常用与订单生成
	 * @return string
	 */
	function uuid()
	{
		static $i = 0;
		$i ++;
		$microtime = substr(microtime(), 2, 4) + $i;
		$uuid = time() . sprintf("%04d", $microtime) . rand();
		return substr(md5($uuid), 16);
	}
}

if (!function_exists('size2mb')){
	/**
	 * 字节数转换成带单位的
	 * @param unknown $size  字节大小
	 * @param number $digits 保留小数位
	 * @return string
	 */
	function size2mb($size, $digits = 2)
	{
		// digits，要保留几位小数
		$i = floor(log($size, 1024));
		$size = round($size / pow(1024, $i), $digits);
		$unit = substr(' KMGTP', $i, 1) . "B";
		return "$size $unit";
	}
}

if (!function_exists('pad10')){
	/**
	 * 不满10,以0补位
	 */
	function pad10($int)
	{
		return $int < 10 ? '0' . $int : $int;
	}
}

if (!function_exists('retain_decimal')){
	/**
	 * 保留小数,不四舍五入
	 * @param unknown $k
	 * @return string
	 */
	function retain_decimal($number, $num = 2)
	{
		$arr = explode('.', $number);
		$a = substr($arr[1], 0, $num);
		$number = empty($a) ? '00' : $a;
		$ok = $arr[0] . '.' . $number;
		return $ok;
	}
}

if (!function_exists('html_get_img')){
	/**
	 * 获取html标签中的src属性
	 * @return Ambigous <multitype:, unknown>
	 */
	function html_get_img($content)
	{
		preg_match_all('/<img.*?src="(.*?)".*?>/i', $content, $array);
		return isset($array[1]) ? $array[1] : $array;
	}
}

if (!function_exists('html_get__imgtext')){
	/**
	 * 获取html中的图片集列表/一般用于图文新闻{# 图片路径&&文字 #}
	 * @param string $leftStr
	 * @param string $rightStr
	 * @param string $content
	 * @return multitype:string Ambigous <Ambigous, boolean, array>
	 */
	function html_get__imgtext($content, $leftStr = '{#', $rightStr = '#}')
	{
		$content = str_get_center($leftStr, $rightStr, $content);
		foreach ($content as $v) {
			$data[] = array(
				'image' => array_get_val(html_get_img($v), 0),
				'name' => strip_tags($v)
			);
		}
		return $data;
	}

}

if (!function_exists('images2layer')){
	/**
	 * 将图片集列表转换到layer.photo插件所需要否数组格式
	 * @param array $data/数组中包含图片名&&图片路径
	 * @return string
	 */
	function images2layer($data)
	{
		$data['title'] = '';
		$data['id'] = '';
		$data['start'] = 1;
		foreach ($data as $k => $v) {
			$src = $v['image'];
			$a['alt'] = $v['name'];
			$a['pid'] = $k;
			$a['src'] = $src;
			$a['thumb'] = $src;
			$data['data'][] = $a;
		}
		return json_encode($data);
	}
}

if (!function_exists('rand_float')){
	/**
	 * 取随机小数
	 * @param number $min 最小数
	 * @param number $max 最大数
	 * @param number $precision 保留位数
	 * @return number
	 */
	function rand_float($min = 0, $max = 1,$precision=0)
	{
		if (is_float($min+0) || is_float($max+0)){
			return round($min + mt_rand() / mt_getrandmax() * ($max - $min),$precision);
		}else{
			return mt_rand($min,$max);
		}
	}
}


if (!function_exists('str_encrypt')){
	/**
	 * 字符串加密
	 * @param unknown $string
	 * @param unknown $operation
	 * @param string $key
	 */
	function str_encrypt($string,$operation,$key='')
	{
		$key = md5($key);
		$key_length = strlen($key);
		$string = $operation == 'D' ? base64_decode($string) : substr(md5($string . $key), 0, 8) . $string;
		$string_length = strlen($string);
		$rndkey = $box = array();
		$result = '';
		for ($i = 0; $i <= 255; $i ++) {
			$rndkey[$i] = ord($key[$i % $key_length]);
			$box[$i] = $i;
		}
		for ($j = $i = 0; $i < 256; $i ++) {
			$j = ($j + $box[$i] + $rndkey[$i]) % 256;
			$tmp = $box[$i];
			$box[$i] = $box[$j];
			$box[$j] = $tmp;
		}
		for ($a = $j = $i = 0; $i < $string_length; $i ++) {
			$a = ($a + 1) % 256;
			$j = ($j + $box[$a]) % 256;
			$tmp = $box[$a];
			$box[$a] = $box[$j];
			$box[$j] = $tmp;
			$result .= chr(ord($string[$i]) ^ ($box[($box[$a] + $box[$j]) % 256]));
		}
		if ($operation == 'D') {
			if (substr($result, 0, 8) == substr(md5(substr($result, 8) . $key), 0, 8)) {
				return substr($result, 8);
			} else {
				return '';
			}
		} else {
			return str_replace('=', '', base64_encode($result));
		}
	}
}

if (!function_exists('str_encode')){
	/**
	 * 字符串加密
	 */
	function str_encode($str,$key='zhengdongying')
	{
		return str_encrypt($str,'E',md5($key));
	}
}

if (!function_exists('str_decode')){
	/**
	 * 字符串解密
	 */
	function str_decode($str,$key='zhengdongying')
	{
		return str_encrypt($str,'D',md5($key));
	}
}

if (!function_exists('str_in_en')){
	/**
	 * 检查字符串是否含有中文
	 */
	function str_in_en($str)
	{
		return boolval(preg_match("/[\x7f-\xff]/", $str));
	}

}

if (!function_exists('str_hide')){
	/**
	 * 字符串掩码
	 */
	function str_hide($string)
	{
		$a = substr($string, 0,3);
		$c = substr($string, -3,3);
		$b = str_repeat('*',strlen($string) - 6);
		return $a . $b . $c;
	}
}

if(!function_exists('random_integer')){
	function random_integer($num = 4){
		$integer = [0,1,2,3,4,5,6,7,8,9];
		$i = 0;
		$str = '';
		while($i < $num){
			$str .= $integer[rand(0,9)];
			$i ++;
		}
		return $str;
	}
}

if( !function_exists('is_phone')){
	function is_phone($phone_str){
		return preg_match('/^1[3578][0-9]{9}$/',$phone_str);
	}
}

if( ! function_exists('date_normal')){
	function date_normal($time = null){
		if(is_null($time)){
			return date('Y-m-d H:i:s');
		}else{
			return date('Y-m-d H:i:s',$time);
		}
	}
}


