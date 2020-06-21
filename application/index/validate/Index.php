<?php
namespace app\index\validate;
use think\Validate;

/**
 * Created by PhpStorm.
 * Author: zjh
 * Date: 2017-5-29 029
 * Time: 16:39
 */
class Index extends Validate
{
	protected $rule = [
		'phone|手机号'			=>	'require|number|length:11',
		'province_id'	=>	'require|number',
		'city_id'		=>	'require|number',
		'code|验证码'			=>	'require|number|length:4',
		'password|密码'		=>  'require|length:6,20',
		'name|名称'		=> 'require|length:1,100',
		'invite_code|邀请码' => 'max:10'
	];

	protected $scene = [
		'register'	=> ['phone','code','password','invite_code'],
		'login'		=> ['phone','password'],
		'forget'	=> ['phone','code','password'],
	];
}