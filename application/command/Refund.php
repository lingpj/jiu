<?php
namespace app\command;

use app\common\service\RefundQueueService;
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
class Refund extends \think\console\Command
{
	function configure()
	{
		$this->setName('refund')->setDescription('run weixin refund task');
		$this->addArgument('args', Argument::OPTIONAL);
	}

	function execute(Input $input, Output $output)
	{
		$args = $input->getArguments()['args'];
		$args = empty($args) ? 'help' : $args;

		switch($args) {
			case 'run':
				(new RefundQueueService())->handle();
				$output->writeln('refund task running');
				break;
			case 'help':
				$output->writeln('php think refund run:start refund task');
				$output->writeln('php think refund help:show help information');
				break;
			default:
				$output->writeln('Wrong arguments!');
		}
	}
}