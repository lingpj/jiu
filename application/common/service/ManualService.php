<?php
/**
 * Created by PhpStorm.
 * Author: zjh
 * Date: 2017-10-30 030
 * Time: 10:16
 */

namespace app\common\service;


use think\Db;

class ManualService extends CommonService
{
	public function detail($user_id,$page){
		$collection = Db::name('auth_chess_round_record')
			->alias('aa')
			->join('auth_chess_record a','aa.id = a.round_record_id')
			->join('auth_user u','u.id = a.user_id')
			->join('auth_user u2','u2.id = a.oppose_uid')
			->field('aa.role_list,a.round_record_id,a.score,a.user_id,a.oppose_uid,u.nickname as a_nickname,u2.nickname as b_nickname,a.create_time')
			->order('a.create_time desc')
			->where('a.user_id',$user_id)
			->paginate($this->pageSize(),false,['page' => $page,'query' => ['user_id' => $user_id]]);

		return $this->paginate($collection);
	}

	public function manualByRound($round_record_id){
		return Db::name('auth_chess_round_record')->where('id',$round_record_id)->find();
	}

	public function manualByUser($user_id){
		return Db::name('auth_chess_record')->where('user_id',$user_id)->select();
	}

	public function roundByRoundRecordId($round_record_id){
		$record = Db::name('auth_chess_record')->where('round_record_id',$round_record_id)->find();
		$player1 = Db::name('auth_user')->where('id',$record['user_id'])->find();
		$player2 = Db::name('auth_user')->where('id',$record['oppose_uid'])->find();

		$score = $record['score'];
		if($score > 0){
			$result = '胜';
		}else if ($score < 0){
			$result = '负';
		}else{
			$result = '和';
		}

		$record['result'] = $player1['nickname'].$result.$player2['nickname'];
		$record['a_nickname'] = $player1['nickname'];
		$record['b_nickname'] = $player2['nickname'];

		return $record;
	}


	public function fetchNicknameByUserId($user_id){
		return Db::name('auth_user')->field('nickname')->where('id',$user_id)->find()['nickname'];
	}


	public function userList($page,$options = []){
		$statement = Db::name('auth_user')->field('id as user_id,telephone');

		if(isset($options['telephone']) && !empty($options['telephone'])){
			$statement = $statement->where('telephone',$options['telephone']);
		}

		$collection = $statement->paginate($this->pageSize(),false,['page' => $page,'query' => $options]);

		return $this->paginate($collection);
	}

	public function count($user_id){
		return Db::name('auth_chess_record')->where('user_id',$user_id)->count();
	}

	public function deleteByRound($round_record_id){
		return Db::name('auth_chess_round_record')->where('id',$round_record_id)->delete();
	}
}