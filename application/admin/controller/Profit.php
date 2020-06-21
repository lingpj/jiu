<?php
/**
 * Created by PhpStorm.
 * Author: zjh
 * Date: 2017-12-4 004
 * Time: 18:14
 */

namespace app\admin\controller;
use app\common\service\CommonService;
use think\Db;

class Profit extends CommonAdminController
{
	private function beforeAndAfterDay($date){
		$timestamp = strtotime($date);
		$time_start = strtotime(date('Y-m-d',$timestamp));
		$time_end = strtotime(date('Y-m-d',strtotime('+1 day')));

		return [$time_start,$time_end];
	}

	public function editProfit(){
		$id = $this->request->param('id',0);
		$coin = $this->request->param('coin',0);

		if($coin < 0){
			$this->error('收益不能小于0');
		}

		$coin = config('multiple') * $coin;

		$success = Db::name('player_profit_count')->where('id',$id)->update(['player_profit_coin' => $coin]);

		if ($success){
			$this->success('修改收益成功');
		}else{
			$this->success('修改收益失败');
		}
	}

	//只有代理才能访问的代理收益统计
	public function agentProfit(){

		if(!isset(session('admin')['is_agent']) || session('admin')['is_agent'] != 1){
			$this->error('您不是代理，不能访问');
		}

		$player_id = session('admin.id');
		$page = $this->request->param('page',1);
		//确定代理可以访问的日期，每天9AM之前，只能访问昨天的收益
		$clock = 9;
		$hour = date('H',time());
		if ($hour < $clock){
			$end_time = strtotime('-1day',strtotime(date('Y-m-d'))) + 24 * 60 * 60;
		}else{
			$end_time = time();
		}

		$collection = Db::name('player_profit_count')->where('parent_id',$player_id)
			->where("unix_timestamp(created_time)<{$end_time}")
			->field('player_profit_coin as coin,created_time')
			->paginate($this->pageSize(),false,[
				'page' => $page,
			]);

		list($list,$pagination) = $this->paginate($collection);

		$this->assign([
			'list' => $list,
			'pagination' => $pagination,
			'children' => session('admin.children'),
		]);

		return $this->fetch('agent_profit');
	}

	//平台收益统计
	public function dailyPlatform(){
		$start_time = $this->request->param('start_time','');
		$end_time = $this->request->param('end_time','');
		$page = $this->request->param('page',1);

		if($start_time && $end_time){
			if(strtotime($start_time) > strtotime($end_time)){
				$tmp = $start_time;
				$start_time = $end_time;
				$end_time = $tmp;
			}
		}else{
			//只有一个日期有参数的情况，不过滤日期
			$start_time = '';
			$end_time = '';
		}

		$d = Db::name('system_profit_count')->field('profit as system_profit_coin,created_time');

		if($start_time && $end_time){
			$s = strtotime($start_time);
			$e = strtotime($end_time);
			$d = $d->where("UNIX_TIMESTAMP(created_time) between {$s} and {$e}");
		}else{
			$d = $d->where('id > 0');
		}

		$query = [];

		if($start_time && $end_time){
			$query['start_time'] = $start_time;
			$query['end_time'] = $end_time;
		}

		list($list,$pagination) = $this->paginate($d->paginate(
			$this->pageSize(),
			false,
			[
				'page' => $page,
				'query' => $query,
			]
		));

		foreach($list as &$v){
			$v['system_profit_coin'] = exchange_coin($v['system_profit_coin']);
			$v['register'] = $this->countRegister2($v['created_time']);
		}

		if($start_time && $end_time){
			$as = $start_time;
			$es = $end_time;
		}else{
			$as = '';
			$es = '';
		}

		$this->assign([
			'page' => $page,
			'pagination' => $pagination,
			'list' => $list,
			'start_time' => $as,
			'end_time' => $es,
		]);

		return $this->fetch('profit/daily_platform');
	}

	private function countRegister($player_id,$date){
		$s = strtotime(date('Y-m-d',strtotime($date)));
		$e = $s + 24 * 60 * 60;

		return Db::name('player')->where('parent_id',$player_id)
				->where("UNIX_TIMESTAMP(created_time) between {$s} and {$e}")
				->count();
	}

	private function countRegister2($date){
		$s = strtotime(date('Y-m-d',strtotime($date)));
		$e = $s + 24 * 60 * 60;

		return Db::name('player')
			->where("UNIX_TIMESTAMP(created_time) between {$s} and {$e}")
			->count();
	}

	public function realtime(){
		$start_time = $this->request->param('start_time','');
		$end_time = $this->request->param('end_time','');
		$player_id = $this->request->param('player_id',0);
		$page = $this->request->param('page',1);

		if($start_time && $end_time){
			if(strtotime($start_time) > strtotime($end_time)){
				$tmp = $start_time;
				$start_time = $end_time;
				$end_time = $tmp;
			}
		}else{
			//只有一个日期有参数的情况，不过滤日期
			$start_time = '';
			$end_time = '';
		}

		//parent_id 就是代理
		$d = Db::name('player_profit')->alias('c')
			->join('player p','p.id = c.parent_id')
			->field('c.player_profit_coin,c.system_profit_coin,p.id,p.coin,p.phone,p.nickname,c.created_time')
			->order('c.created_time desc');

		if($start_time && $end_time){
			$s = strtotime($start_time);
			$e = strtotime($end_time);
			$d = $d->where("UNIX_TIMESTAMP(c.created_time) between {$s} and {$e}");
		}

		if ($player_id){
			$d = $d->where('c.parent_id',$player_id);
		}

		$query = [];

		if($player_id){
			$query['player_id'] = $player_id;
			if($start_time && $end_time){
				$query['start_time'] = $start_time;
				$query['end_time'] = $end_time;
			}
		}

		list($list,$pagination) = $this->paginate($d->paginate(
			$this->pageSize(),
			false,
			[
				'page' => $page,
				'query' => $query,
			]
		));

		foreach($list as &$v){
			$v['coin'] = exchange_coin($v['coin']);
			$v['player_profit_coin'] = exchange_coin($v['player_profit_coin']);
			$v['system_profit_coin'] = exchange_coin($v['system_profit_coin']);
		}

		if($start_time && $end_time){
			$as = $start_time;
			$es = $end_time;
		}else{
			$as = '';
			$es = '';
		}

		$this->assign([
			'player_id' => $player_id ? $player_id : '',
			'page' => $page,
			'pagination' => $pagination,
			'list' => $list,
			'start_time' => $as,
			'end_time' => $es,
		]);

		return $this->fetch('profit/realtime');
	}

	//代理收益报表
	public function dailyAgent(){
		$start_time = $this->request->param('start_time','');
		$end_time = $this->request->param('end_time','');
		$player_id = $this->request->param('player_id',0);
		$page = $this->request->param('page',1);

		if($start_time && $end_time){
			if(strtotime($start_time) > strtotime($end_time)){
				$tmp = $start_time;
				$start_time = $end_time;
				$end_time = $tmp;
			}
		}else{
			//只有一个日期有参数的情况，不过滤日期
			$start_time = '';
			$end_time = '';
		}

		//parent_id 就是代理
		$d = Db::name('player_profit_count')->alias('c')
			->join('player p','p.id = c.parent_id')
			->field('c.id qid,c.player_profit_coin,c.system_profit_coin,p.id,p.coin,p.phone,p.nickname,c.created_time')
			->order('c.created_time desc');

		if($start_time && $end_time){
			$s = strtotime($start_time);
			$e = strtotime($end_time);
			$d = $d->where("UNIX_TIMESTAMP(c.created_time) between {$s} and {$e}");
		}

		if ($player_id){
			$d = $d->where('c.parent_id',$player_id);
		}

		$query = [];

		if($player_id){
			$query['player_id'] = $player_id;
			if($start_time && $end_time){
				$query['start_time'] = $start_time;
				$query['end_time'] = $end_time;
			}
		}

		list($list,$pagination) = $this->paginate($d->paginate(
			$this->pageSize(),
			false,
			[
				'page' => $page,
				'query' => $query,
			]
		));

		foreach($list as &$v){
			$v['coin'] = exchange_coin($v['coin']);
			$v['children'] = $this->countChildren($v['id']);
			$v['player_profit_coin'] = exchange_coin($v['player_profit_coin']);
			$v['system_profit_coin'] = exchange_coin($v['system_profit_coin']);
			$v['register'] = $this->countRegister($v['id'], $v['created_time']);
		}

		if($start_time && $end_time){
			$as = $start_time;
			$es = $end_time;
		}else{
			$as = '';
			$es = '';
		}

		$this->assign([
			'player_id' => $player_id ? $player_id : '',
			'page' => $page,
			'pagination' => $pagination,
			'list' => $list,
			'start_time' => $as,
			'end_time' => $es,
		]);

		return $this->fetch('profit/daily_agent');
	}

	private function countChildren($player_id){
		$r = Db::name('player')->where('parent_id',$player_id)->field('count(*) as count')->find();
		return $r['count'];
	}
//
//	private function sumProfit($player_id){
//		return Db::name('player_profit_count')->where('player_id',$player_id)->sum('player_profit_coin');
//	}
//
//	private function sumSystemProfit($player_id){
//		return Db::name('player_profit_count')->where('player_id',$player_id)->sum('system_profit_coin');
//	}

	//代理收益统计
	public function dailyCount(){
		$player_id = $this->request->param('player_id',0);
		$page = $this->request->param('page',1);

		$d = Db::name('player_profit_count')->alias('c')
			->join('player p','p.id = c.parent_id')
			->field('c.player_profit_coin,p.id,p.coin,p.phone,p.nickname')
			->order('c.created_time desc');

		if ($player_id){
			$d = $d->where('c.parent_id',$player_id);
		}

		list($list,$pagination) = $this->paginate($d->paginate(
			$this->pageSize(),
			false,
			[
				'page' => $page,
				'query' => [
					'player_id' => $player_id ? $player_id:0
				]
			]
		));

		foreach($list as &$v){
			$v['coin'] = exchange_coin($v['coin']);
			$v['children'] = $this->countChildren($v['id']);
			$v['profit_coin'] = exchange_coin($v['player_profit_coin']);
		}

		$this->assign([
			'player_id' => $player_id ? $player_id : '',
			'page' => $page,
			'pagination' => $pagination,
			'list' => $list
		]);

		return $this->fetch('profit/daily_count');
	}

	public function index(){
		$request = $this->request;
		$date = $request->param('date',date_normal());
		$page = $request->param('page',1);

		list($time_start,$time_end) = $this->beforeAndAfterDay($date);

		$collection = Db::name('player')
			->field('nickname,id as player_id,phone,parent_id')
			->where('parent_id is not null and parent_id <> 0')
			->paginate(CommonService::_pageSize(),false,[
				'page' => $page,
			]);

		list($list,$pagination) = CommonService::_paginate($collection);

		foreach($list as &$v){
			$one = Db::name('profit')->where('player_id',$v['player_id'])
							->where("UNIX_TIMESTAMP(created_time) between $time_start and $time_end")->find();
			if($one){
				foreach(['fee','created_time','id'] as $key){
					$v[$key] = $one[$key];
				}
			}else{
				$v['fee'] = 0;
				$v['created_time'] = '';
				$v['id'] = '';
			}

			//推荐了几个
			$kids = Db::name('player')->where('id',$v['parent_id'])->count();
			$v['kids'] = $kids;
		}

		$this->assign([
			'list' => $list,
			'date' => $date,
			'pagination' => $pagination,
		]);

		return $this->fetch();
	}

	public function edit(){
		$request = $this->request;
		if($request->isGet()){
			$id = $request->param('id',0);
			if($id){
				$record = Db::name('profit')->where('id',$id)->find();
				$this->assign($record);
			}

			$player_id = $request->param('player_id');
			$date = $request->param('date',date_normal());

			$this->assign([
				'player_id' => $player_id,
				'date' => $date,
			]);

			return $this->fetch();
		}

		$data = $request->param();
		$error = $this->validate($data,[
			'player_id' => 'require|number',
			'id' => 'number',
			'fee' => 'number|min:1',
			'date' => 'date'
		]);

		if($error !== true){
			$this->error($error);
		}

		if(Db::name('player')->where('id',$data['player_id'])->count() == 0){
			$this->error('玩家不存在');
		}

		if(! empty($data['id'])){
			$success = Db::name('profit')->where('id',$data['id'])->update([
				'fee' => $data['fee']
			]);
		}else{
			$date = empty($data['date']) ? date_normal() : $data['date'];
			list($time_start,$time_end) = $this->beforeAndAfterDay($date);
			$count = Db::name('profit')->where('player_id',$data['player_id'])
				->where("UNIX_TIMESTAMP(created_time) between $time_start and $time_end")
				->count();

			if($count > 0){
				$this->error('一天之内只能有一条收益记录');
			}else{
				$success = Db::name('profit')->insert([
					'player_id' => $data['player_id'],
					'fee' => $data['fee'],
					'created_time' => date_normal()
				]);
			}
		}

		if(isset($success) && $success){
			$this->redirect(url('admin/profit/index'));
		}else{
			$this->error('保存失败');
		}
	}

	public function del(){
		$id = $this->request->param('id');
		$success = Db::name('profit')->where('id',$id)->delete();

		if($success){
			$this->redirect(url('admin/profit/index'));
		}else{
			$this->error('删除失败');
		}
	}
}