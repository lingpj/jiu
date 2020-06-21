<?php
/**
 * Created by PhpStorm.
 * Author: zjh
 * Date: 2017-7-26 026
 * Time: 11:38
 */

namespace tests;


class StarTest extends TestCase
{
	public function testAdd(){
		$this->visit('index/index/login')->assertResponseStatus(200);
	}
}