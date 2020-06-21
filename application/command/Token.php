<?php
namespace app\command;

use app\common\service\RedisService;
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
class Token extends \think\console\Command
{
	private $access_token_key = 'access_token';
	private $ticket_key = 'ticket';

	function configure()
	{
		$this->setName('token')->setDescription('fetch weixin signature and so on');
		$this->addArgument('args', Argument::OPTIONAL);
	}

	private function fetchAccessToken(){
		$uri = sprintf('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=%s&secret=%s',config('weixin.appid'),config('weixin.secret'));
		$json_str = file_get_contents($uri);
		$json = (array)json_decode($json_str);
		if(isset($json['access_token'])){
			$redis = RedisService::getInstance();
			$redis->set($this->access_token_key,$json['access_token']);
			dump("fetch access_token success:{$json['access_token']}");
		}else{
			dump("Wrong!");
			dump($json);
		}
	}

	private function fetchJsApiTicket(){
		$redis = RedisService::getInstance();
		$access_token = $redis->get($this->access_token_key);
		if($access_token){
			$uri = sprintf('https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=%s&type=jsapi',$access_token);
			$json_str = file_get_contents($uri);
			$json = (array)json_decode($json_str);
			if(isset($json['ticket'])){
				$redis->set($this->ticket_key,$json['ticket']);
				dump("fetch ticket success:{$json['ticket']}");
			}else{
				dump("Wrong!");
				dump($json);
			}
		}else{
			dump("access_token not exist in cache");
		}
	}

	private function both(){
		//注意调用顺序，相反是不可能得到期望值的
		$this->fetchAccessToken();
		$this->fetchJsApiTicket();
	}

	function execute(Input $input, Output $output)
	{
		$args = $input->getArguments()['args'];
		$args = empty($args) ? 'help' : $args;

		switch($args) {
			case 'access_token':
				$this->fetchAccessToken();
				break;
			case 'ticket':
				$this->fetchJsApiTicket();
				break;
			case 'both':
				$this->both();
				break;
			case 'help':
				$output->writeln('php think token access_token:fetch access_token');
				$output->writeln('php think token ticket:fetch ticket for js api call');
				$output->writeln('php think token ticket:first fetch access_token,then fetch ticket,push them to cache');
				break;
			default:
				$output->writeln('Wrong arguments!');
		}
	}
}