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
class Export extends \think\console\Command
{
	function configure()
	{
		$this->setName('export')->setDescription('export province,city,area info to js file');
		$this->addArgument('args', Argument::OPTIONAL);
	}

	private function address(){
		/**
		 * 北京，河南省
		 * 郑州市，洛阳市
		 */
		$provinces = Db::name('provinces')->field('province,provinceid')->select();
		//sort
		$prefix = [];
		$rest = [];
		foreach($provinces as $p){
			$name = $p['province'];
			if(in_array($name,['北京','河南省'])){
				$prefix[] = $p;
			}else{
				$rest[] = $p;
			}
		}
		if($prefix[0]['province'] == '河南省'){
			$first = array_pop($prefix);
			array_unshift($prefix,$first);
		}

		$provinces = array_merge($prefix,$rest);
		$map_provinces = [];

		foreach($provinces as &$p){
			$cities = Db::name('cities')->where('provinceid',$p['provinceid'])->field('city,cityid')->select();
			if($p['province'] == '河南省'){
				$prefix = [];
				$rest = [];
				foreach($cities as $c){
					$name = $c['city'];
					if(in_array($name,['郑州市','洛阳市'])){
						$prefix[] = $c;
					}else{
						$rest[] = $c;
					}
				}
				if($prefix[0]['city'] == '洛阳市'){
					$first = array_pop($prefix);
					array_unshift($prefix,$first);
				}
				$cities = array_merge($prefix,$rest);
			}
			$p['children'] = $cities;
			$map_provinces[$p['provinceid']] = $p;
		}

		$cities = Db::name('cities')->field('city,cityid')->select();
		$map_cities = [];

		foreach($cities as &$c){
			$areas = Db::name('areas')->where('cityid',$c['cityid'])->field('area,areaid')->select();
			$c['children'] = $areas;
			$map_cities[$c['cityid']] = $c;
		}

		//export to file
		$map_provinces = json_encode($map_provinces);
		$map_cities = json_encode($map_cities);

		$str = "var bao_provinces = '{$map_provinces}';var bao_cities = '{$map_cities}';";

		$bytes = file_put_contents('areas.js',$str);

		dump("done,write $bytes");
	}

	function execute(Input $input, Output $output)
	{
		$args = $input->getArguments()['args'];
		$args = empty($args) ? 'help' : $args;

		switch($args) {
			case 'address':
				$this->address();
				break;
			case 'help':
				$output->writeln('-h');
				break;
			default:
				$output->writeln('Wrong arguments!');
		}
	}
}