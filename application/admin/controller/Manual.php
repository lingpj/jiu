<?php
/**
 * Created by PhpStorm.
 * Author: zjh
 * Date: 2017-10-30 030
 * Time: 10:06
 */

namespace app\admin\controller;

use app\common\service\ManualService;
use think\Db;

class Manual extends CommonAdminController
{
	public function index(){
		$request = $this->request;
		$page = $request->param('page',1);
		$telephone = $request->param('telephone','');
		$manual_service = new ManualService();

		list($list,$pagination) = $manual_service->userList($page,['telephone' => $telephone]);

		foreach($list as &$v){
			$v['count'] = $manual_service->count($v['user_id']);
		}

		$this->assign([
			'telephone' => $telephone,
			'list' => $list,
			'pagination' => $pagination
		]);

		return $this->fetch();
	}

	public function getFileName($round_record_id){
		$manual_service = new ManualService();
		$record = $manual_service->manualByRound($round_record_id);
		if($record){
			$round = Db::name('auth_chess_record')->where('round_record_id',$round_record_id)->find();
			$player1 = Db::name('auth_user')->where('id',$round['user_id'])->find()['nickname'];
			$player2 = Db::name('auth_user')->where('id',$round['oppose_uid'])->find()['nickname'];
			$score = $round['score'];

			if($score > 0){
				$result = '胜';
			}else if($score < 0){
				$result = $score < -1 ? '负' : '和';
			}

			if($record['role_list'] != '{1,2}'){
				$tmp = $player1;
				$player1 = $player2;
				$player2 = $tmp;
				$result = ($result != '和' ? ($result == '胜' ? '负':'胜') : $result);
			}

			$filename = date('Y-m-d H:i',strtotime($record['create_time']))."_{$player1}{$result}{$player2}.txt";

			return $filename;
		}else{
			return '文件不存在.txt';
		}
	}


	public function download(){
		$user_id = $this->request->param('user_id',0);
		$round_record_id = $this->request->param('round_record_id',0);

		$manual_service = new ManualService();
		$round = $manual_service->roundByRoundRecordId($round_record_id);

		if($round_record_id > 0){
			$record = $manual_service->manualByRound($round_record_id);
			$filename = date('Y-m-d H:i',strtotime($record['create_time'])).'_'.$round['result'].'.txt';
			header('Content-Disposition: attachment; filename="'.$filename.'"');
			echo "对战时间:{$record['create_time']}，双方得分：{$record['score_list']},棋谱:\n";
			echo $record['round_str_list'];
		}else{
			$filename = $this->getFileName($round_record_id);
			header('Content-Disposition: attachment; filename="'.$filename.'"');
			$records = $manual_service->manualByUser($user_id);
			foreach($records as $v){
				$round_record_id = $v['round_record_id'];
				$record = $manual_service->manualByRound($round_record_id);
				echo "对战时间:{$record['create_time']}，双方得分：{$record['score_list']},棋谱:\n";
				echo $record['round_str_list'];
				echo "\n\n";
			}
		}

		die;
	}

	public function del(){
		$round_record_id = $this->request->param('round_record_id',0);
		$success = (new ManualService())->deleteByRound($round_record_id);

		if($success){
			$this->success('删除成功');
		}else{
			$this->error('删除失败');
		}
	}

	public function detail(){
		$user_id = $this->request->param('user_id',0);
		$page = $this->request->param('page',1);

		$manual_service = new ManualService();
		list($list,$pagination) = $manual_service->detail($user_id,$page);

		foreach($list as &$v){
			$score = $v['score'];
			if($score > 0){
				$result = '胜';
			}else if($score < 0){
				$result = $score < -1 ? '负' : '和';
			}

			$player1 = $v['a_nickname'];
			$player2 = $v['b_nickname'];

			if($v['role_list'] != '{2,1}'){
				$tmp = $player1;
				$player1 = $player2;
				$player2 = $tmp;
				$result = ($result != '和' ? ($result == '胜' ? '负':'胜') : $result);
			}

			$v['result'] = date('Y-m-d H:i',strtotime($v['create_time'])).'_'.$player1.$result.$player2;
		}

		$this->assign([
			'list' => $list,
			'pagination' => $pagination,
			'user_id' => $user_id
		]);

		return $this->fetch('detail');
	}
}