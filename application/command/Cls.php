<?php
namespace app\command;

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
class Cls extends \think\console\Command
{
	function configure()
	{
		$this->setName('cls')->setDescription('clear data or cache');
		$this->addArgument('args', Argument::OPTIONAL);
	}

	private function clearDatabase(){
		$tables = Db::query('show tables');
		foreach($tables as $table){
			$t = array_values($table)[0];
			if( ! in_array($t,['provinces','cities','areas'])){
				$result = Db::name($t)->delete(true);
				dump($result);
			}
		}
		dump("clear database done!");
	}

	function execute(Input $input, Output $output)
	{
		$args = $input->getArguments()['args'];
		$args = empty($args) ? 'help' : $args;

		switch($args) {
			case 'database':
				$this->clearDatabase();
				break;
			case 'help':
				$output->writeln('-h');
				break;
			default:
				$output->writeln('Wrong arguments!');
		}
	}
}