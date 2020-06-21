<?php
/**
 * Created by PhpStorm.
 * Author: zjh
 * Date: 2017-7-13 013
 * Time: 8:49
 */

namespace app\admin\controller;

use app\admin\validate\TemplateValidate;
use app\common\service\ImageService;
use app\common\service\MusicService;
use app\common\service\TemplateService;

class Template extends CommonAdminController
{
	public function index(){
		$template_service = new TemplateService();
		$list = $template_service->fetch();
		foreach($list as &$li){
			$text = ['禁用','启用'];
			$li['status_text'] = $text[$li['status']];
		}

		rsort_by_key($list,'sort');

		$this->assign('list',$list);

		return $this->fetch();
	}

	private function addMusic(){
		$music_service = new MusicService();
		$list = $music_service->fetch();
		$this->assign('music_list',$list);
	}

	private function saveFile($file){
		if(count($file) != count($file,1)){
			$arr = [];
			for($i = 0,$len = count($file['name']);$i < $len;$i++){
				$f = [
					'name'	=> $file['name'][$i],
					'size'	=> $file['size'][$i],
					'type'	=> $file['type'][$i],
					'tmp_name'=> $file['tmp_name'][$i],
					'error'	=> $file['error'][$i]
				];
				$image_id = $this->saveFile($f);
				$arr[] = $image_id;
			}
			return join(',',$arr);
		}else{
			$image_service = new ImageService();

			$object = $image_service->ossUpload($file['tmp_name'],str_replace('image/','',$file['type']),0);

			if( ! is_string($object)){
				$this->error($object->getMessage());
			}else{
				$image_id = $image_service->create([
					'url'	=> $object,
					'member_id'	=> 0,
					'is_delete'	=> 0,
					'created_time' => date_normal()
				]);
				if( ! $image_id){
					$this->error('保存图片失败');
				}else{
					return $image_id;
				}
			}
		}
	}

	private function checkImageFile($file){
		if(count($file) != count($file,1)){
			for($i = 0,$len = count($file['name']);$i < $len;$i++){
				$f = [
					'name'	=> $file['name'][$i],
					'size'	=> $file['size'][$i],
					'type'	=> $file['type'][$i],
					'tmp_name'=> $file['tmp_name'][$i],
					'error'	=> $file['error'][$i]
				];
				$this->checkImageFile($f);
			}
		}else{
			$image_service = new ImageService();
			$result = $image_service->checkImageFile($file);
			if($result !== true){
				$this->error($result->getMessage());
			}
		}
	}

	public function add(){
		$request = $this->request;

		if($request->isGet()){
			return $this->fetch();
		}else{
			$data = $request->param();

			$data = trip_xss($data);

			$validate = new TemplateValidate();
			if( ! $validate->check($data)){
				$this->error($validate->getError());
			}

			$files = $_FILES;

			if(!isset($files['image_id'])){
				$this->error('标题图片不能为空');
			}
			if(!isset($files['main_image_id'])){
				$this->error('商品主图不能为空');
			}
			if(!isset($files['intro_image_ids'])){
				$this->error('产品图片不能为空');
			}

			$image_id = $files['image_id'];
			$main_image_id = $files['main_image_id'];
			$intro_image_ids = $files['intro_image_ids'];

			$this->checkImageFile($image_id);
			$this->checkImageFile($main_image_id);
			$this->checkImageFile($intro_image_ids);

			$image_id = $this->saveFile($image_id);
			$main_image_id = $this->saveFile($main_image_id);
			$intro_image_ids = $this->saveFile($intro_image_ids);

			$banner_image = $request->param('banner_image/a',[]);
			//多商品砍价活动特有的
			$product_title = $request->param('product_title/a',[]);
			$product_img = $request->param('product_img/a',[]);

			$products = [];

			foreach($product_title as $key => $v){
				$products[] = [
					'title' => $product_title[$key],
					'img'	=> $product_img[$key]
				];
			}
			//头图相册
			$data['banner_image'] = json_encode($banner_image);
			//多商品
			$data['fragment'] = json_encode(['products' => $products]);

			$data['image_id'] = $image_id;
			$data['main_image_id'] = $main_image_id;
			$data['intro_image_ids'] = $intro_image_ids;
			$data['status'] = TemplateService::STATUS_ENABLE;
			$data['created_time'] = date_normal();
			$data['tag'] = trim($data['tag']);
			$data['theme'] = array_get($data,'theme','');
			$data['sort'] = intval(array_get($data,'sort',0));

			unset($data['product_title']);
			unset($data['product_img']);

			$template_service = new TemplateService();
			$success = $template_service->create($data);

			$this->returnCreateCode($success,url('admin/template/index'));
		}
	}

	private function fetchSrcArray($image_id){
		$ids = explode(',',$image_id);
		$list = [];
		foreach($ids as $id){
			$list[] = $this->fetchSrc($id);
		}
		return $list;
	}

	private function fetchSrc($image_id){
		$image_service = new ImageService();
		$src = $image_service->fetchSrcById($image_id);

		return $src;
	}

	public function clear(){
		$template_service = new TemplateService();
		$template_service->clear();
		$this->redirect(url('admin/template/index'));
	}

	private function updateImageFile($image_id,$file){
		$service = new ImageService();
		$result = $service->updateImage($image_id,$file,0,false);

		if($result instanceof \Exception){
			$this->error($result->getMessage());
		}else{
			return $result[0];
		}
	}

	private function checkSkin($skin){
		if( ! empty($skin)){
			if(json_decode($skin) === null){
				$this->error('请检查皮肤字符串格式');
			}
		}
		return $skin;
	}

	public function edit($id){
		$request = $this->request;
		$template_service = new TemplateService();

		if($request->isGet()){
			$one = $template_service->fetchById($id);

			$one['image_id_src'] = $this->fetchSrc($one['image_id']);
			$one['main_image_id_src'] = $this->fetchSrc($one['main_image_id']);
			$one['intro_image_ids_src'] = $this->fetchSrcArray($one['intro_image_ids']);
			$one['intro_image_ids_array'] = explode(',',$one['intro_image_ids']);
			$fragment = json_decode($one['fragment'],1);
			$one['fragment'] = $fragment == null ? ['products' => []] : $fragment;
			$banner_image = json_decode($one['banner_image'],1);
			$one['banner_image'] = $banner_image == null ? [] : $banner_image;

			$this->assign($one);

			return $this->fetch();
		}else{
			$data = $request->param();
			$data = trip_xss($data);
			$validate = new TemplateValidate();

			if( ! $validate->check($data)){
				$this->error($validate->getError());
			}

			$files = $_FILES;

			if(isset($files['image_id_upload']) && !empty($files['image_id_upload']['name'])){
				$image_id = $data['image_id'];
				$f = $files['image_id_upload'];
				$this->checkImageFile($f);
				$this->updateImageFile($image_id,$f);
			}

			if(isset($files['main_image_id_upload']) && !empty($files['main_image_id_upload']['name'])){
				$image_id = $data['main_image_id'];
				$f = $files['main_image_id_upload'];
				$this->checkImageFile($f);
				$this->updateImageFile($image_id,$f);
			}

			if(isset($files['intro_image_ids_upload'])){
				$image_ids = $request->param('intro_image_ids/a');
				$fs = $files['intro_image_ids_upload'];

				$list = [];
				$len = count($fs['name']);

				for($i = 0;$i < $len;$i ++){
					$name = $fs['name'][$i];

					if(empty($name)){
						if(isset($image_ids[$i])){
							$list[] = $image_ids[$i];
						}
					}else{
						$f = [];
						foreach(['name','tmp_name','error','size','type'] as $key){
							$f[$key] = $fs[$key][$i];
						}

						if(isset($image_ids[$i])){
							//update
							$this->updateImageFile($image_ids[$i],$f);
							$list[] = $image_ids[$i];
						}else{
							$image_id = $this->saveFile($f);
							$list[] = $image_id;
						}
					}
				}
				$data['intro_image_ids'] = join(',',$list);
			}

			$banner_image = $request->param('banner_image/a',[]);
			//多商品砍价活动特有的
			$product_title = $request->param('product_title/a',[]);
			$product_img = $request->param('product_img/a',[]);

			$products = [];

			foreach($product_title as $key => $v){
				$products[] = [
					'title' => $product_title[$key],
					'img'	=> $product_img[$key]
				];
			}
			//头图相册
			$data['banner_image'] = json_encode($banner_image);
			//多商品
			$data['fragment'] = json_encode(['products' => $products]);

			unset($data['id']);
			unset($data['product_title']);
			unset($data['product_img']);
			$data['skin'] = $this->checkSkin($data['skin']);

			$template_service->update($id,$data);

			$this->returnUpdateCode(true,url('admin/template/index'));
		}
	}

	public function updateStatus($id){
		$template_service = new TemplateService();
		$one = $template_service->fetchById($id);

		if($one){
			$success = $template_service->update($id,[
				'status'	=> TemplateService::contraryStatus($one['status'])
			]);
			$this->redirect(url('admin/template/index'));
		}else{
			$this->error('模板不存在');
		}
	}
}