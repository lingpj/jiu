<?php
namespace app\common\taglib;
use think\template\TagLib;

/**
 * Created by PhpStorm.
 * Author: zjh
 * Date: 2017-6-15 015
 * Time: 21:53
 */
class My extends TagLib
{
	protected $tags = [
		// 标签定义： attr 属性列表 close 是否闭合（0 或者1 默认1） alias 标签别名 level 嵌套层次
		'image' 		=> ['attr' => '','close' => 0],
		'select' 		=> ['attr' => '','close' => 0],
		'consultphone' 		=> ['attr' => '','close' => 0],
		'timespacing'	=> ['attr' => '','close' => 0],
		'prize'			=> ['attr' => '','close' => 0],
		'memberinfo'	=> ['attr' => '','close' => 0],
		'medialist'		=> ['attr' => '','close' => 0],
		'mainimage'     => ['attr' => '','close' => 0],
		'video'			=> ['attr' => '','close' => 0],
		'countdown'     => ['attr' => '','close' => 0],
		'prizeview'		=> ['attr' => '','close' => 0],
		'css'     		=> ['attr' => '','close' => 0],
		'js'     		=> ['attr' => '','close' => 0],
	];

	public function tagImage($tag){

	}

	public function tagSelect($tag){
		$list = array_get($tag,'list');
		$name  = array_get($tag,'name','');
		$item = array_get($tag,'item','name');
		$active = array_get($tag,'active','');
		$id = array_get($tag,'id','');
		$foreach = sprintf('{foreach $%s as $v}<option {if $v.%s == %s} value="{$v.id}">{$v.%s}</option>{/foreach}',$list,'$'.$active,$item);

		$str = <<<HTML
		<select name="{$name}" id="{$id}">
		{$foreach}
</select>
HTML;

		return $str;
	}

	public function tagCss($tag){
		if(isset($tag['href'])){
			$href = $tag['href'].'?v='.config('static_version');
			$link = sprintf('<link rel="stylesheet" type="text/css" href="%s" />',$href);
			return $link;
		}else{
			return '';
		}
	}

	public function tagJs($tag){
		if(isset($tag['href'])){
			$href = $tag['href'].'?v='.config('static_version');
			$script = sprintf('<script src="%s"></script>',$href);
			return $script;
		}else{
			return '';
		}
	}

	public function tagCountdown(){
		$str = <<<HTML
		<div class="time-value">
			<div id="count-down" class="count-down">
				<i class="icon iconfont icon-naozhong icon-clock"></i>
				<span id="count-day">0</span>天
				<span id="count-hour">0</span>时
				<span id="count-minute">0</span>分
				<span id="count-second">0</span>秒
			</div>
		</div>
HTML;
		return $str;
	}

	private function wrap($key){
		if(strpos($key,'$') !== false){
			return '{'.$key.'}';
		}else{
			return $key;
		}
	}

	private function getValue($tag,$key,$default=''){
		if(isset($tag[$key])){
			return $this->wrap($tag[$key]);
		}else{
			return $default;
		}
	}

	public function tagTest($tag){
		return '<input type="text" />';
	}

	public function tagVideo($tag){
		$placeholder = $this->getValue($tag,'placeholder','请输入视频地址【支持优酷、腾讯视频】');
		$value = '{$video_src|default=""}';
		$str = <<<HTML
		<div>
			<textarea name="video_src" placeholder="{$placeholder}">
				{$value}
			</textarea>
		</div>
HTML;
		return $str;
	}

	public function tagMainimage($tag){
		$main_image = '{$main_image|default=""}';
		$image = '{if $main_image}<p class="main-image-button"><span class="change-main-image view-show" onclick="wxUploadOneImage(\'#main-image-upload\',\'#main-image\')">修改</span><span class="del-main-image view-show" onclick="delMainImage(this)">删除</span></p><img id="main-image-src-one" src="{:oss_img($main_image_src)}" />{/if}';
		$icon = $this->getValue($tag,'icon','/static/img/xiang_sm.png');

		$str = <<<HTML
		<div class="can-write">
			<div class="image-wrap" id="main-image-src-one-wrap">
				{$image}
			</div>
		</div>
		<div class="tc mt-10 can-write upload-main-image">
			<input type="file" class="layui-upload-file layui-hide" id="main-image-upload" name="main_image_upload"/>
			<input type="hidden" value="{$main_image}" id="main-image" name="main_image" />
			<img src="{$icon}" class="mainimage-icon" onclick="wxUploadOneImage('#main-image-upload','#main-image')"/>
			<p class="notice">（商品主图必填）</p>
		</div>
HTML;
		return $str;
	}

	public function tagMedialist($tag){
		$thumb = '{$thumb|default=""}';
		$video = '{$video|default=""}';
		$foreach = '{foreach $thumb_src as $v}';
		$foreach_end = '{/foreach}';
		$v = '{$v}';
		$vid = '{$v.id}';
		$vsrc = '{:oss_img($v.src)}';

		$foreach_video = '{foreach $video as $v}';

		$str = <<<HTML
		<div class="media">
		<input type="hidden" id="image" name="thumb" value="{$thumb}"/>
		<div class="show-image">
    	{$foreach}
		<div class="image-wrap">
			<img src="{$vsrc}"/>
			<span class="image-wrap-modify view-show" onclick="modifyViewImage(this,'{$vid}')">修改</span>
			<span class="image-wrap-del view-show" onclick="delViewImage(this,'{$vid}')">删除</span>
		</div>
		{$foreach_end}
		</div>
		<div class="view-show">
		<input type="file" class="layui-upload-file" id="media-image-upload" name="media_image_upload" />
		<span data-limit="10" onclick="initImageWidget('#media-image-upload',this)" class="widget-add-image"><i class="icon iconfont icon-xiangji"></i> 添加图片（最多添加10张图片）</span>
		</div>

		{$foreach_video}
		<div class="video-wrap"><span class="video-del">删除</span><textarea class="layui-textarea can-write" name="video[]">{$v}</textarea></div>
		{$foreach_end}
		<div class="view-show"><span data-limit="5" onclick="initVideoWidget(this)" class="widget-add-video"><i class="icon iconfont icon-x-mpg"></i>添加视频（最多添加5个视频）</span></div>
		</div>
HTML;

		return $str;
	}

	public function tagMemberinfo($tag){
		$info1 = '{$member_info.0.item|default=""}';
		$require1 = '{if $member_info.0.require}checked{/if}';

		$info2 = '{$member_info.1.item|default=""}';
		$require2 = '{if $member_info.1.require}checked{/if}';

		$str = <<<HTML
			<div class="">
				<div class="mb-20">
				<p class="notice tc view-show"><img src="/static/img/tanhao.png" style="position:relative;top:-.01rem;width:.15rem;height:.15rem;margin-right:.02rem;" alt="">自定义项为空则不显示，最多可填6个字</p>
				<p class="notice tc view-show"><img src="/static/img/tanhao.png" style="position:relative;top:-.01rem;width:.15rem;height:.15rem;margin-right:.02rem;" alt="">如有用户报名,此内容不可再做任何修改</p>
				</div>
				<div class="member-info-item">
					<input class="can-write keepreadonly" value="姓名" readonly="readonly"/>
					<label>
						<input type="checkbox" checked disabled />
						必填项
					</label>
				</div>
				<div class="member-info-item">
					<input class="can-write keepreadonly" readonly="readonly" value="手机号码"/>
					<label>
						<input type="checkbox" checked disabled />
						必填项
					</label>
				</div>
				<div class="member-info-item" id="info-collection-1">
					<input class="can-write" value="{$info1}" type="text" maxlength="6" name="member_info_item[]" placeholder="自定义项"/>
					<label>
						<input type="checkbox" {$require1}  name="member_info_require[]" />
						必填项
					</label>
				</div>
				<div class="member-info-item" id="info-collection-2">
					<input class="can-write" value="{$info2}" type="text" maxlength="6" name="member_info_item[]" placeholder="自定义项"/>
					<label>
						<input type="checkbox" {$require2} name="member_info_require[]" />
						必填项
					</label>
				</div>
			</div>
HTML;
		return $str;
	}

	public function tagPrize($tag){
		$prize_time = sprintf('{$prize_time|default="%s"}',date('Y-m-d',strtotime('+10 day')));
		$prize_address = '{$prize_address|default="万达广场"}';

		$prize_phone = '{$prize_phone|default=""}';

		$str = <<<HTML
			<p class="prize-info-item">领奖时间：<input type="text" maxlength="20" id="prize-time" value='{$prize_time}' class="can-write" name="prize_time"/></p> 
			<p class="prize-info-item">领奖电话：<input type="number" onkeyup="this.value = this.value.slice(0,11)" value='{$prize_phone}' class="can-write" name="prize_phone"/></p>
			<p class="prize-info-item prize-info-address">领奖地址：<textarea maxlength="35" class="can-write" name="prize_address" >{$prize_address}</textarea></p>
HTML;
		return $str;
	}

	public function tagPrizeview($tag){
		$prize_time = sprintf('{$prize_time|default="%s"}',date('Y-m-d',strtotime('+10 day')));
		$prize_address = '{$prize_address|default=""}';
		$prize_phone = sprintf('{$prize_phone|default="%s"}','');

		$str = <<<HTML
			<p>领奖时间：{$prize_time}</p>
            <p>领奖地址：{$prize_address}</p>
            <p>领奖电话：{$prize_phone}</p>
HTML;
		return $str;
	}

	public function tagTimespacing($tag){
		$start_time = date('Y-m-d',strtotime('-1 day'));
		$start_time .= ' 12:00';
		$start_time_value = sprintf('{$start_time|default="%s"}',$start_time);
		
		$spacing = $this->getValue($tag,'spacing',10);

		$end_time = date('Y-m-d H:i',strtotime($start_time) + $spacing * 60 * 60 * 24);
		$end_time_value = sprintf('{$end_time|default="%s"}',$end_time);

		$str = <<<HTML
		<div class="timeselector">
			<div class="selecttimenotice notice-title">活动时间</div>
			<div class="notice-content">
				<div class="timestart" onclick="selectWeDate(this,0)">
					<span id="starttime" class="can-write dotted">{$start_time_value}</span>
					<input type="text" id="start-time" class="datetime-picker view-show" value="{$start_time_value}" name="start_time">
				</div>
				<div class="selecttimenotice">到</div>
				<div class="timeend" onclick="selectWeDate(this,1)">
					<span id="endtime" class="can-write dotted">{$end_time_value}</span>
					<input type="text" id="end-time" class="datetime-picker view-show" value="{$end_time_value}" name="end_time">
				</div>
			</div>
		</div>
        <p class="mt-10 notice view-show">活动时间：（建议活动时间5~7天）</p>
HTML;
		return $str;
	}

	public function tagConsultphone($tag){
		$class = $this->getValue($tag,'class');
		$value = '{$consult_phone|default=""}';
		
		$str = <<<HTML
			<div class="consultphone">
				<input onkeyup="this.value = this.value.slice(0,11)" type="number" name="consult_phone" value="{$value}" class="can-write {$class}"/>
			</div>
			<p class="notice mt-10 view-show">客户可以通过此电话号码咨询活动情况，请保持手机畅通</p>
HTML;

		return $str;
	}
}