<?php
namespace app\admin\validate;
/**
 * Created by PhpStorm.
 * Author: zjh
 * Date: 2017-7-13 013
 * Time: 9:25
 */
class TemplateValidate extends \think\Validate
{
	protected $rule = [
		'title'			=>	'require|length:2,100',
		'intro'			=>	'require|length:2,1500',
		'tag'			=>	'require|length:1,50',
//		'main_image_id'		=>	'require|number',
//		'intro_image_ids'	=>	'require|length:1,100',
		'music_id'		=>  'number',
//		'banner_image_id'		=>  'number',
		'default_title'		=>  'require|length:1,200',
		'default_intro'		=>  'require|length:1,2000',
		'default_rule'		=>  'require|length:1,2000',
		'org_intro'		=>  'length:1,2000',
	];
}