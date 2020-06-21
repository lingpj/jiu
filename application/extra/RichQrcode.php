<?php
namespace app\extra;
use app\common\service\QrcodeService;

/**
 * Created by PhpStorm.
 * Author: zjh
 * Date: 2017-8-16 016
 * Time: 10:08
 */
class RichQrCode
{
	private $image_resource;
	private $width;
	private $height;
	private $logo_path;
	private $banner_path;
	private $url;
	private $title;
	private $content;
	private $ending;
	private $font;
	private $font_bold;

	public function __construct($width,$height,$font,$logo_path,$banner_path,$url,$title,$content,$ending,$avatar,$name)
	{

		$this->width = $width;
		$this->height = $height;
		$this->font = $font;
		$this->font_bold = APP_PATH.'extra'.DS.'msyhbd.ttc';
		$this->logo_path = $logo_path;
		$this->banner_path = $banner_path;
		$this->url = $url;
		$this->title = $title;
		$this->content = $content;
		$this->ending = $ending;
		$this->avatar = $avatar;
		$this->name = $name;
	}

	static public function make($banner_path,$url,$title,$content,$ending,$avatar = false,$name = false,$save_to_file = false){
		$logo_path = APP_PATH.'extra'.DS.'avatar'.DS.'logo.png';
		$width = 591;
		$height = 756;
		$font = APP_PATH.'extra'.DS.'msyh.ttc';

		$qr_code = new RichQrCode($width,$height,$font,$logo_path,$banner_path,$url,$title,$content,$ending,$avatar,$name);

		$qr_code->createResource();
		$qr_code->createBanner();
//		$qr_code->createLogo();
		$qr_code->createAvatar();
		$qr_code->createQrCode();
		$qr_code->createTitle();
		$qr_code->createContent();
		$qr_code->createEnding();

		if($save_to_file){
			$file_name = uuid().'.png';
			$path = ROOT_PATH.'public'.DS.'upload'.DS.$file_name;
			imagepng($qr_code->image_resource,$path,2);
			imagedestroy($qr_code->image_resource);
			return $file_name;
		}else{
			header('Content-type:image/png');
			imagepng($qr_code->image_resource,null,2);
			imagedestroy($qr_code->image_resource);
		}
	}

	private function createResource(){
		$im = imagecreatetruecolor($this->width,$this->height);
		$white = imagecolorallocate($im,255,255,255);
		imagefill($im,0,0,$white);

		$this->image_resource = $im;
	}

	private function createLogo(){
		$logo = $this->logo_path;
		if(file_exists($logo)){
			$im = &$this->image_resource;
			$src = imagecreatefrompng($logo);
			imagecopy($im,$src,20,0,0,0,50,50);
		}
	}

	private function createAvatar(){
		$avatar = $this->avatar;
		$name = $this->name;

		if($avatar){
			if( ! file_exists($avatar)){
				throw new \Exception("Avatar {$avatar} not exists");
			}
			//create avatar first
			$src = imagecreatefrompng($avatar);
			$im = &$this->image_resource;
			imagecopy($im,$src,20,480,0,0,60,60);
			//then create name
			$black = imagecolorallocate($im,0,0,0);
			imagefttext($im,16,0,100,518,$black,$this->font,$name);
		}
	}

	private function createBanner(){
		$banner = $this->banner_path;

		if( ! file_exists($banner)){
			throw new \Exception("Banner file $banner is not exists");
		}

		$list = getimagesize($banner);
		$width = $list[0];
		$height = $list[1];
		$mime = $list['mime'];

		if($mime == 'image/png'){
			$src = imagecreatefrompng($banner);
		}else if($mime == 'image/jpeg'){
			$src = imagecreatefromjpeg($banner);
		}else{
			throw new \Exception("type $mime can not be supported");
		}

		imagecopy($this->image_resource,$src,0,0,0,0,$width,$height);
	}

	private function createQrCode(){
		$im = &$this->image_resource;
		//create qr code first
		$code_im = QrcodeService::resource($this->url);
		$w = 260;
		$resize_im = imagescale($code_im,$w,$w);
		imagecopy($im,$resize_im,335,500,0,0,$w,$w);
		//then create text
		$dark_gray = imagecolorallocate($im,154,154,154);
		imagefttext($im,16,0,390,500,$dark_gray,$this->font,'长按二维码查看');
	}

	private function printAsLine($top,$color,$font_size,$text,$bold = false){
		$im = &$this->image_resource;

		$text = mb_substr($text,0,40,'utf-8');
		$line1 = mb_substr($text,0,13,'utf-8');
		$line2 = mb_substr($text,13,13,'utf-8');
		$line3 = mb_substr($text,26,13,'utf-8');

		$font = $bold ? $this->font_bold : $this->font;
		$margin = 8;

		foreach([$line1,$line2,$line3] as $key => $line){
			imagefttext($im,$font_size,0,20,$top + $key * ($font_size + $margin),$color,$font,$line);
		}
	}

	private function createTitle(){
		$im = &$this->image_resource;
		$black = imagecolorallocate($im,0,0,0);

		$top = $this->avatar ? 582 : 502;

		$this->printAsLine($top,$black,18,$this->title);
	}

	private function createContent(){
		$im = &$this->image_resource;
		$red = imagecolorallocate($im,198,55,58);

		$top = $this->avatar ? 675 : 625;

		$this->printAsLine($top,$red,18,$this->content,true);
	}

	private function createEnding(){
		if($this->ending instanceof \Closure){
			//resource,x,y
			call_user_func($this->ending,$this->image_resource,20,735,$this->font,$this->font_bold);
		}else{
			$im = &$this->image_resource;
			$gray = imagecolorallocate($im,153,153,153);
			imagefttext($im,18,0,20,730,$gray,$this->font,$this->ending);
		}
	}
}