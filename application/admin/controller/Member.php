<?php
/**
 * Created by PhpStorm.
 * Author: zjh
 * Date: 2017-6-16 016
 * Time: 22:57
 */

namespace app\admin\controller;
use app\common\service\AuthUserService;
use app\common\service\CommonService;
use app\common\service\IpService;
use app\common\service\MemberService;
use app\common\service\RechargeService;
use app\common\service\StorageService;
use think\Db;

class Member extends CommonAdminController
{
	public function index(){
		$request = $this->request;
		$member_service = new MemberService();
		$page = $request->param('page',1);
		$recharged = $request->param('recharged',0);
		list($list,$pagination) = $member_service->fetch($page);

		foreach($list as &$v){
			$v['coin'] = exchange_coin($v['coin']);
			$v['bank_coin'] = exchange_coin($v['bank_coin']);
		}

		$total = $member_service->count();

		$this->assign([
			'list' 			=> $list,
			'pagination'	=> $pagination,
			'recharged'		=> $recharged,
			'total' 		=> $total
		]);

		return $this->fetch();
	}

	private function getRoundType($type){
		$types = [
			1 => '高级',
			2 => '至尊',
			3 => '自建',
			4 => '百人',
			5 => '大天九',
		];

		if(isset($types[$type])){
			return $types[$type];
		}else{
			return "none";
		}
	}

	public function round(){
		$request = $this->request;
		$player_id = $request->param("player_id",0);
		$page = $request->param('page',1);

		if($player_id > 0){
			$records = Db::name('round_record')->where("player_ids like '%,{$player_id},%' ")->order('created_time desc')->paginate(config('list_rows.paginate'),false,['page' => $page,'query' => ['player_id' => $player_id]]);
		}else{
			$records = Db::name('round_record')->where("id > 0")->order('created_time desc')->paginate(config('list_rows.paginate'),false,['page' => $page]);
		}

		if($records){
			$data = $records->toArray()['data'];
			$pagination = $records->render();
		}else{
			$data = [];
			$pagination = '';
		}

		foreach($data as &$v){
			$form = $v['form'];
			$f = json_decode($form,1);
			if ($f !== false){
				$new_f = [];
				foreach([1 => '顺',2 => '庄',3 => '倒',5 => '天'] as $key => $value){
					$new_f[$value] = $f[$key];
				}
				$s = "";
				foreach($new_f as $kk => $vv){
					$s .= $kk.'=>'.$vv . ',';
				}
				$v['form'] = $s;
			}

			$result_map = json_decode($v['result_map'],1);
			$new_result_str = '';

			foreach($result_map as $id => $coin){
				$new_result_str .= $id . ':' .($coin[0] > 0 ? '赢'.$coin[0]:($coin[0] == 0 ? 0 : '输'.$coin[0])).',剩下：'.short_count($coin[1]) . ',';
			}

			$v['result_map'] = $new_result_str;

			$chip_map = json_decode($v['chip_map'],1);
			$chip_map_str = '';
			$directions = function($list){
				$s = '';
				if (empty($list)){
					return $s;
				}
				foreach($list as $direction => $coins){
					$ds = [1 => '顺',2 => '庄',3 => '倒',4 => '倒角',5 => '天',6 => '顺角'];
					$s .= $ds[$direction].':'.implode(',',array_map(function($ele){
							return short_count($ele);
						},$coins)).',';
				}
				return $s;
			};
			foreach($chip_map as $kk => $vv){
				$chip_map_str .= '{'.$kk.'=>'.$directions($vv).'},';
			}

			$v['chip_map'] = $chip_map_str;

			$v['round_type'] = $this->getRoundType($v['round_type']);
		}

		$this->assign([
			'list' => $data,
			'pagination' => $pagination,
			'player_id' => $player_id == 0 ? '':$player_id,
		]);

		return $this->fetch('member/round');
	}

	public function setVip(){
		$id = $this->request->param('id',0);
		$set = $this->request->param('set',1);

		$success = Db::name('player')->where('id',$id)->update(['is_vip' => $set]);

		if($success){
			$this->success('设置成功');
		}else{
			$this->error("设置失败");
		}
	}


	private function socket($command,$ip = '127.0.0.1',$port = 3342){
		$socket = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);

		if ($socket < 0) {
			$this->error("socket_create() failed: reason: " . socket_strerror($socket));
		}

		$result = socket_connect($socket, $ip, $port);

		if ($result < 0) {
			$this->error("socket_connect() failed.\nReason: ($result) " . socket_strerror($result));
		}

		$in = "{$command}\r\n";

		if( ! socket_write($socket, $in, strlen($in))) {
			$this->error("socket_write() failed: reason: " . socket_strerror($socket) . "\n");
		}

		$times = 0;
		$content = false;

		while($times < 2 && $out = socket_read($socket, 8192)) {
			if($times == 1){
				$content = $out;
			}
			$times ++;
		}

		socket_close($socket);

		if($content !== false){
			$content = preg_replace('/\r\n/','',$content);
		}

		return $content;
	}

	public function robot(){
		$request = $this->request;

		set_time_limit(10);

		if ($request->isGet()){
			$open = $this->socket("robot status");
			$bairen_probability = $this->socket("bairen_probability");
			$vip_probability = $this->socket("vip_probability");
			$four_be_master_probability = $this->socket("be_master_probability");

			$open = $open == 'true' ? 1:0;

			$this->assign([
				'open' => $open,
				'bairen_probability' => $bairen_probability,
				'vip_probability' => $vip_probability,
				'four_be_master_probability' => $four_be_master_probability,
			]);

			return $this->fetch('manager/robot');
		}else{
			$open = $this->request->param("open");
			$bairen_probability = $this->request->param('bairen_probability');
			$vip_probability = $this->request->param('vip_probability');
			$four_be_master_probability = $this->request->param('four_be_master_probability');

			$bairen_probability = intval($bairen_probability);
			$vip_probability = intval($vip_probability);
			$four_be_master_probability = intval($four_be_master_probability);

			$all = [$bairen_probability,$vip_probability,$four_be_master_probability];

			foreach($all as $v){
				if ($v < 0 || $v > 100){
					$this->error("概率只能在0~100之间");
				}
			}

			if($open){
				$robot_success = $this->socket("robot open");
			}else{
				$robot_success = $this->socket("robot close");
			}

			$bairen_success = $this->socket("bairen_probability {$bairen_probability}");

			$vip_success = $this->socket("vip_probability {$vip_probability}");

			$be_master_success = $this->socket("be_master_probability {$four_be_master_probability}");

			if ($robot_success && $bairen_success && $vip_success && $be_master_success){
				$this->success('修改成功');
			}else{
				$this->error('修改失败');
			}
		}
	}

	public function handRecharge(){
		$request = $this->request;

		if($request->isGet()){
			$page = $request->param('page',1);
			$collection = Db::name('pay_record')
							->alias('r')
							->join('player p','p.id = r.player_id')
							->field('r.*,p.nickname')
							->paginate(CommonService::_pageSize(),false,['page'=>$page]);

			list($list,$pagination) = CommonService::_paginate($collection);

			$this->assign([
				'list' => $list,
				'pagination' => $pagination
			]);

			return $this->fetch('recharge/index');
		}else{
			$data = $request->param();
			$error = $this->validate($data,[
				'fee' => 'require|number',
				'player_id' => 'require|number',
				'type|充值类型' => 'require|in:1,2'
			]);
			if($error !== true){
				$this->error($error);
			}

			$member_service = new MemberService();
			$player = $member_service->fetchById($data['player_id']);

			if(empty($player)){
				$this->error('充值用户不存在');
			}

			if($data['fee'] <= 0){
				$this->error("充值（扣除）金额必须大于0");
			}

			if($data['type'] != 1){
				$data['fee'] = - $data['fee'];
			}

			$coin = get_multiple($data['fee']);
			$fee = $data['fee'];

			if($data['type'] != 1){
				$record = Db::name('player')->where('id',$data['player_id'])->find();
				if($record['coin'] < abs($coin)){
					$this->error('扣除失败！ 金额不够扣除，玩家只有'.exchange_coin($record['coin']).'金币，需要扣除'.abs($fee).'金币');
				}
			}

			//这里不能使用事务，因为hard io过于频繁
			$success1 = Db::name('pay_record')->insert([
				'fee'          => $fee,
				'coin'         => $fee,
				'player_id'    => $data['player_id'],
				'recharger'    => '管理员',
				'status'       => 1,
				'created_time' => date_normal(),
			]);
			$success2 = Db::name('player')->where('id',$data['player_id'])->setInc('coin',$coin);

			$text = $data['type'] == 1 ? '充值':'扣除';

			if($success1 && $success2){
				$this->success($text."成功");
			}else{
				$this->error($text."失败");
			}
		}
	}

	//修改会员密码
	public function modifyPassword(){
		$request = $this->request;
		if($request->isGet()){
			$error = $this->validate($request->param(),[
				'user_id' => 'require|number'
			]);
			if($error !== true){
				$this->error($error);
			}
			$user_id = $request->param('user_id');
			$this->assign('user_id',$user_id);

			return $this->fetch('modify_password');
		}else{
			$error = $this->validate($request->param(),[
				'user_id' => 'require|number',
				'password' => 'require|length:6,20',
			]);

			if($error !== true){
				$this->error($error);
			}

			$password = md5($request->param('password'));
			$user_service = new AuthUserService();
			$user_id = $request->param('user_id');
			$success = $user_service->update($user_id,[
				'password' => $password
			]);

//			RedisService::getInstance()->hSet('auth:user:'.$user_id,'password',$password);

			if($success){
				$this->success('修改密码成功',url('admin/member/index'));
			}else{
				$this->error('修改失败，请重试');
			}
		}
	}

	public function status(){
		$request = $this->request;
		$data = $request->param();

		$err = $this->validate($data,[
			'id'     => 'require|number',
			'status' => 'require|boolean'
		]);

		if($err !== true){
			$this->error($err);
		}

		$member_service = new MemberService();

		$success = $member_service->update($data['id'],[
			'is_active' => $data['status']
		]);

		if($success){
			$this->redirect(url('admin/member/index'));
		}else{
			$this->error("error");
		}
	}

	public function ip(){
		$request = $this->request;
		$ip_service = new IpService();

		if($request->isGet()){
			$page = $this->request->param('page',1);

			list($data,$pagination) = $ip_service->fetchByPage($page);

			$this->assign('list',$data);
			$this->assign("pagination",$pagination);

			return $this->fetch('ip');
		}
	}
	//添加禁用ip
	public function ipadd(){
		$ip_service = new IpService();
		$request = $this->request;

		if($request->isGet()){
			return $this->fetch('ip_add');
		}else{
			$data = $request->param();

			$this->validate($data,[
				'ip' => 'require|ip',
			]);

			$success = $ip_service->save($data);

			if($success){
				$this->redirect(url('admin/member/ip'));
			}else{
				$this->error("error");
			}
		}
	}
	//删除禁用ip
	public function ipdelete(){
		$id = $this->request->param('id',0);
		$ip_service = new IpService();

		$success = $ip_service->delete($id);

		if($success){
			$this->redirect(url('admin/member/ip'));
		}else{
			$this->error("error");
		}
	}


	private function verifyMember($member_id){
		$member_service = new MemberService();
		$member = $member_service->fetchById($member_id);
		if( ! $member){
			$this->error('会员不存在');
		}else{
			return $member;
		}
	}

	public function recharge(){
		$request = $this->request;

		$recharge_service = new RechargeService();
		$page = $request->param('page',1);

		list($list,$pagination) = $recharge_service->fetchByPage($page);

		$this->assign([
			'list'       => $list,
			'pagination' => $pagination,
		]);

		return $this->fetch('recharge/index');
	}

	public function rechargeLog(){
		$request = $this->request;
		$page = $request->param('page',1);
		$recharge_service = new RechargeService();

		list($list,$pagination) = $recharge_service->fetchByPage($page);

		$this->assign([
			'list' => $list,
			'pagination' => $pagination
		]);

		return $this->fetch('recharge/log');
	}

	public function phoneRechargeList(){
		$page = $this->request->param('page',1);
		$records = Db::name('auth_score2_phone_record')
					->alias('a')
					->join('auth_user u','a.user_id = u.id')
					->field('a.*,u.nickname')
					->paginate(config('paginate.list_rows'),false,['page' => $page]);
		if($records){
			$data = $records->toArray()['data'];
			$pagination = $records->render();
		}else{
			$data = [];
			$pagination = '';
		}

		$this->assign(['list' => $data,'pagination' => $pagination]);

		return $this->fetch('phone_recharge_list');
	}

	public function phoneRechargeStatus(){
		$id = $this->request->param('id',0);
		$success = Db::name('auth_score2_phone_record')->where('id',$id)->where('status',0)->update(['status' => 1,'charge_time' => date_normal()]);
		if($success){
			$this->redirect(url('admin/member/phoneRechargeList'));
		}else{
			$this->error('审核失败');
		}
	}

	public function withdraw(){
		$request = $this->request;
		$storage_service = new StorageService();

		if($request->isGet()){
			$page = $this->request->param('page',1);
			list($list,$pagination) = $storage_service->fetch($page);

			$this->assign('list',$list);
			$this->assign('pagination',$pagination);

			return $this->fetch('withdraw');
		}else{
			$validation = $this->validate($request->param(),[
				'id' => 'require|number'
			]);
			if($validation !== true){
				$this->error($validation);
			}

			$id = $request->param('id');

			$success = $storage_service->updateStatus($id,StorageService::STATUS_SUCCESS);

			if($success){
				$this->success('success');
			}else{
				$this->error('error');
			}
		}
	}
}