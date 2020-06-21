<?php
namespace app\command;

use app\common\model\Activity;
use app\common\model\Image;
use app\common\service\ImageService;
use app\common\service\MusicService;
use think\console\input\Argument;
use think\console\Input;
use think\console\Output;
use think\Db;

/**
 * Created by PhpStorm.
 * Author: zjh
 * Date: 2017-7-4 004
 * Time: 8:25
 */
class Move extends \think\console\Command
{
	function configure()
	{
		$this->setName('move')->setDescription('move file from hard to oss');
		$this->addArgument('args', Argument::OPTIONAL);
	}

	private function getType($file_name){
		$index = strrpos($file_name,'.');
		if($index !== false){
			$type = substr($file_name,$index + 1);
			return $type;
		}else{
			return false;
		}
	}

	private function moveImage(){
		$dir = ROOT_PATH.'public'.DS.'upload'.DS;
		$image_model = new Image();
		$images = $image_model->all();

		$image_service = new ImageService();

		foreach($images as $image){
			$file = $dir.$image['url'];
			if(file_exists($file)){
				$object = $image_service->ossUpload($file,null,null,$image['url']);
				if( ! is_string($object)){
					echo $object->getMessage();
				}else{
					echo "move {$object} success";
				}
			}else{
				echo "file {$file} not exist";
			}
			echo "\n";
		}

		echo 'move image files done';
	}

	private function moveMusic(){
		$dir = ROOT_PATH.'public'.DS.'upload'.DS.'music'.DS;

		$files = (new MusicService())->fetch();

		$image_service = new ImageService();

		foreach($files as $f){
			$file = $dir.$f['url'];
			if(file_exists($file)){
				$object = $image_service->ossUpload($file,null,null,$f['url']);
				if( ! is_string($object)){
					echo $object->getMessage();
				}else{
					echo "move {$object} success";
				}
			}else{
				echo "file {$file} not exist";
			}
			echo "\n";
		}
		echo 'move music files done';
	}

	public function moveQrcode(){
		$dir = ROOT_PATH.'public'.DS.'upload'.DS;
		$act_model = new Activity();
		$list = $act_model->all();
		$image_service = new ImageService();

		foreach($list as $li){
			$file = $dir.$li['qrcode'];

			if(file_exists($file)){
				$object = $image_service->ossUpload($file,null,null,$li['qrcode']);
				if( ! is_string($object)){
					echo $object->getMessage();
				}else{
					echo "move {$object} success";
				}
			}else{
				echo "file {$file}  not exist";
			}
			echo "\n";
		}
		echo 'move qrcode files done';
	}

	private function regenQrcode(){
		$dir = ROOT_PATH.'public'.DS.'upload'.DS;
		$act_model = new Activity();
		$list = $act_model->all();
		$image_service = new ImageService();
		require_once EXTEND_PATH.'phpqrcode.php';

		foreach($list as $li){
			$id = $li['id'];
			$tag = $li['tag'];
			$url = "http://jushangbao.com.cn/index/activity/index?tag={$tag}&id={$id}";
			$path = $li['qrcode'];
			\QRcode::png($url, $dir.$path, 'L', 4);

			$object = $image_service->ossUpload($dir.$path,null,null,$path);
			if(is_string($object)){
				echo "generate {$object} success";
			}else{
				echo $object->getMessage();
			}
			echo "\n";
		}

		echo "re generate qrcode done";
	}

	function execute(Input $input, Output $output)
	{
		$args = $input->getArguments()['args'];
		$args = empty($args) ? 'help' : $args;

		switch($args) {
			case 'image':
				$this->moveImage();
				break;
			case 'music':
				$this->moveMusic();
				break;
			case 'qrcode':
				$this->moveQrcode();
				break;
			case 'recode':
				$this->regenQrcode();
				break;
			case 'help':
				$output->writeln('-h');
				break;
			default:
				$output->writeln('Wrong arguments!');
		}
	}
}