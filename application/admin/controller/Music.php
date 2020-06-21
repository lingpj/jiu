<?php
/**
 * Created by PhpStorm.
 * Author: zjh
 * Date: 2017-6-12 012
 * Time: 21:54
 */

namespace app\admin\controller;
use app\common\service\FileService;
use app\common\service\MusicService;

class Music extends CommonAdminController
{
	public function index(){
		$service = new MusicService();
		$list = $service->fetchCache();
		foreach($list as &$li){
			$text = $li['status'] == 1?0:1;
			$li['status_button_text'] = MusicService::getStatus($text);
			$li['status'] = MusicService::getStatus($li['status']);
		}

		$this->assign('list',$list);

		return $this->fetch();
	}

	public function updateStatus(){
		$id = input('?get.id');
		if( ! empty($id)){
			$music_service = new MusicService();
			$one = $music_service->fetchById($id);
			if($one){
				$status = $one['status'] == 1?0:1;
				$music_service->update($id,['status' => $status]);
				$music_service->clearCache();
				$this->redirect(url('admin/music/index'));
			}else{
				$this->redirect(url('admin/music/index'));
			}
		}else{
			$this->redirect(url('admin/music/index'));
		}
	}

	private function upload($file){
		if($file['error'] > 0){
			$this->error("错误码{$file['error']}");
		}else{
			$file_service = new FileService();
			if( ! $file_service->isAudio($file)){
				$this->error('只能上传mp3文件');
			}
			if( ! $file_service->isAudioLimit($file)){
				$this->error('文件不能超过8M');
			}
			$file_name = $file_service->saveAudio($file);
			if($file_name instanceof \Exception){
				$this->error($file_name->getMessage());
			}
			return $file_name;
		}
	}

	private function emptyFile($file){
		return $file['size'] == 0;
	}


	public function add(){
		$request = $this->request;

		if($request->isGet()){
			if($request->has('id') && !empty($request->param('id'))){
				$id = $request->param('id');
				$music_service = new MusicService();
				$one = $music_service->fetchById($id);
				if($one){
					$this->assign('name',$one['name']);
				}
			}
			return $this->fetch();
		}else{
			$validation = $this->validate($request->param(),[
				'name' => 'length:1,50'
			]);

			if($validation !== true){
				$this->error($validation);
			}

			$name = $request->param('name');
			$file = $_FILES['file'];

			$music_service = new MusicService();

			if(input('?get.id')){
				if($this->emptyFile($file)){
					$success = $music_service->update(input('?get.id'),['name' => $name]);
					if($success){
						$music_service->clearCache();
						$this->success('更新成功',url('admin/music/index'));
					}else{
						$this->error('更新失败');
					}
				}else{
					$file_name = $this->upload($file);
					if($file_name !== false){
						$success = $music_service->update(input('get.id'),[
							'name' 			=> $name,
							'url'  			=> $file_name,
						]);
						if($success){
							$music_service->clearCache();
							$this->success('更新成功',url('admin/music/index'));
						}else{
							$this->error('更新失败',url('admin/music/index'));
						}
					}else{
						$this->error('保存失败，请重试');
					}
				}
			}else{
				if($this->emptyFile($file)){
					$this->error('文件不能为空');
				}else{
					$file_name = $this->upload($file);
					if($file_name !== false){
						$success = $music_service->create([
							'name' 			=> $request->param('name'),
							'url'  			=> $file_name,
							'status'		=> MusicService::STATUS_ENABLE,
							'created_time'	=> date_normal()
						]);
						if($success){
							$music_service->clearCache();
							$this->success('保存成功',url('admin/music/index'));
						}else{
							$this->error('保存失败',url('admin/music/index'));
						}
					}else{
						$this->error('保存失败，请重试');
					}
				}
			}

		}
	}

}