<?php
/**
 * Created by PhpStorm.
 * Author: zjh
 * Date: 2017-11-7 007
 * Time: 9:20
 */

namespace app\admin\controller;
use app\common\service\BroadcastService;
use think\Db;

const ANNOUNCEMENT_TYPE_SCROLL = 1;
const ANNOUNCEMENT_TYPE_PERSONAL = 2;
const ANNOUNCEMENT_TYPE_PUBLIC = 3;

class Broadcast extends CommonAdminController
{
	private $announcementType = [
		ANNOUNCEMENT_TYPE_SCROLL,
		ANNOUNCEMENT_TYPE_PERSONAL,
		ANNOUNCEMENT_TYPE_PUBLIC,
	];

	private $announcementTypeMap = [
		ANNOUNCEMENT_TYPE_SCROLL => '滚动公告',
		ANNOUNCEMENT_TYPE_PERSONAL => '私人公告',
		ANNOUNCEMENT_TYPE_PUBLIC => '所有人公告',
	];

	public function index(){
		$page = $this->request->param('page',1);
		$broad = new BroadcastService();
		list($list,$pagination) = $broad->fetchByPage($page);

		foreach($list as &$v){
			$v['type_ch'] = $this->announcementTypeMap[$v['type']];
		}

		$this->assign([
			'list' => $list,
			'pagination' => $pagination
		]);

		return $this->fetch('index');
	}

	private function insertPublic($announcement_id){
		$players = Db::name('player')->field("id")->select();
		$now = date_normal();
		$sql = 'insert into player_announcement(player_id,announcement_id,read_status,created_time) values ';

		foreach($players as $index => $p){
			$id = $p['id'];
			if($index == 0){
				$sql = $sql . "($id,$announcement_id,0,'$now')";
			}else{
				$sql = $sql . ",($id,$announcement_id,0,'$now')";
			}
		}

		return Db::execute($sql);
	}

	public function edit(){
		$request = $this->request;
		$broad = new BroadcastService();

		if($request->isGet()){
			$record = $broad->fetchById($request->param('id'));

			if($record){
				$this->assign($record);
			}

			return $this->fetch('edit');
		}else{
			$error = $this->validate($request->param(),[
				'id' => 'number',
				'type' => 'number',
				'content' => 'require|length:1,500',
				'title' => 'require|length:1,500',
			]);
			if($error !== true) {
				$this->error($error);
			}
			if( ! in_array($request->param('type'),$this->announcementType)){
				$this->error("类型不正确");
			}

			$data = $request->param();

			if(isset($data['id']) && $data['id']){
				$success = $broad->update($data['id'],['title' => $data['title'],'content' => $data['content'],'type' => $data['type']]);
			}else{
				$success = $last_id = $broad->save(['title' => $data['title'],'content' => $data['content'],'type' => $data['type']]);
				//批量 给所有玩家添加未读消息
				if($success && $data['type'] == ANNOUNCEMENT_TYPE_PUBLIC){
					$total = $this->insertPublic($last_id);
				}
			}

			if($success){
				$this->redirect(url('admin/broadcast/index'));
			}else{
				$this->error('保存失败');
			}
		}
	}

	public function del(){
		$id = $this->request->param('id',0);
		$broad = new BroadcastService();
		$success = $broad->delete($id);
		if($success){
			Db::name('player_announcement')->where('announcement_id',$id)->delete();
			$this->redirect(url('admin/broadcast/index'));
		}else{
			$this->error('删除失败');
		}
	}
}