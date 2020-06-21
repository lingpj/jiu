<?php
/**
 * Created by PhpStorm.
 * Author: zjh
 * Date: 2017-6-12 012
 * Time: 22:37
 */
return [
	'head'      => '九九游戏管理后台',
	'multiple'  => 10000,
	'authority' => [
		[
			'name'    => '会员管理',
			'auth'    => 'member',
			'is_menu' => 1,
			'list'    => [
				[
					'name'    => '局详细列表',
					'is_menu' => 1,
					'auth'    => 'round'
				],
				[
					'name'    => '会员列表',
					'is_menu' => 1,
					'auth'    => 'index'
				],
				[
					'name' => '会员编辑',
					'auth' => 'edit'
				],
				[
					'name' => '修改会员密码',
					'auth' => 'modifyPassword'
				],
				[
					'name' => '机器人管理',
					'auth' => 'robot',
					'is_menu' => 1
				],
				[
					'name' => '设置vip',
					'auth' => 'setVip',
					'is_menu' => 0
				],
//				[
//					'name' => '取消违规会员',//冻结
//					'auth' => 'del'
//				],
//				[
//					'name' => '禁用IP列表',
//					'auth' => 'ip',
//					'is_menu' => 1,
//				],
//				[
//					'name' => '添加禁用IP',
//					'auth' => 'ipadd'
//				],
//				[
//					'name' => '删除禁用IP',
//					'auth' => 'ipdelete'
//				],
				[
					'name' => '充值记录',
					'auth' => 'handRecharge',
					'is_menu' => 1,
				],
//				[
//					'name' => '话费充值管理',
//					'auth' => 'phoneRechargeList',
//					'is_menu' => 1,
//				],
//				[
//					'name' => '话费充值审核',
//					'auth' => 'phoneRechargeStatus',
//				],

//				[
//					'name' => '充值日志',
//					'auth' => 'rechargelog',
//					'is_menu' => 1,
//				]
			],
		],
		[
			'name'    => '公告管理',
			'auth'    => 'broadcast',
			'is_menu' => 1,
			'list'    => [
				[
					'name'    => '公告列表',
					'is_menu' => 1,
					'auth'    => 'index'
				],
				[
					'name'    => '编辑公告',
					'auth'    => 'edit'
				],
				[
					'name'    => '删除公告',
					'auth'    => 'del'
				],
			],
		],
		[
			'name'    => '收益管理',
			'auth'    => 'profit',
			'is_menu' => 1,
			'list'    => [
				[
					'name'    => '代理收益报表',
					'is_menu' => 1,
					'auth'    => 'dailyagent'
				],
//				[
//					'name'    => '代理收益统计',
//					'is_menu' => 1,
//					'auth'    => 'dailycount'
//				],
				[
					'name' => '修改代理收益',
					'auth' => 'editprofit'
				],
				[
					'name'    => '平台收益统计',
					'is_menu' => 1,
					'auth'    => 'dailyplatform'
				],
				[
					'name'    => '实时收益',
					'is_menu' => 1,
					'auth'    => 'realtime'
				],
				[
					'name' => '代理收益',//只有代理本人能看
					'is_menu' => 1,
					'auth' => 'agentprofit'
				]
			],
		],
		[
			'name'   => '商品管理',
			'auth'   => 'product',
			'is_menu' => 1,
			'list'  => [
				[
					'name' => '商品列表',
					'auth' => 'index',
					'is_menu' => 1
				],
				[
					'name' => '编辑',
					'auth' => 'edit',
				],
				[
					'name' => '删除',
					'auth' => 'del',
				],
				[
					'name' => '订单列表',
					'auth' => 'orderList',
					'is_menu' => 1
				],
			]
		],
		[
			'name'    => '角色管理',
			'auth'    => 'role',
			'is_menu' => 1,
			'list'    => [
				[
					'name'    => '角色列表',
					'auth'    => 'index',
					'is_menu' => 1,
				],
				[
					'name'    => '添加和编辑角色',
					'auth'    => 'edit',
					'is_menu' => 0,
				]
			]
		],
		[
			'name'    => '管理员管理',
			'auth'    => 'manager',
			'is_menu' => 1,
			'list'    => [
				[
					'name'    => '管理员列表',
					'auth'    => 'index',
					'is_menu' => 1,
				],
				[
					'name'    => '添加和编辑管理员',
					'auth'    => 'index',
					'is_menu' => 0,
				],
				[
					'name'    => '客服微信号管理',
					'auth'    => 'server',
					'is_menu' => 1,
				]
			]
		],
//		[
//			'name'    => '代理商管理',
//			'auth'    => 'agent',
//			'is_menu' => 1,
//			'list'    => [
//				[
//					'name'    => '一级代理商列表',
//					'auth'    => 'leveloneindex',
//					'is_menu' => 1,
//				],
//				[
//					'name'    => '二级代理商列表',
//					'auth'    => 'leveltwoindex',
//					'is_menu' => 1,
//				],
//				[
//					'name'    => '二级代理商审核',
//					'auth'    => 'begindex',
//					'is_menu' => 1,
//				],
//				[
//					'name'    => '添加一级代理商',
//					'auth'    => 'leveloneedit',
//					'is_menu' => 0,
//				],
//				[
//					'name'    => '一级代理申请添加二级代理商',
//					'auth'    => 'leveltwobegadd',
//					'is_menu' => 0,
//				],
//				[
//					'name'    => '超级管理员添加二级代理商',
//					'auth'    => 'leveltwoedit',
//					'is_menu' => 0,
//				],
//				[
//					'name'    => '同意添加二级代理商',
//					'auth'    => 'leveltwoagreeadd',
//					'is_menu' => 0,
//				],
//			]
//		],
		[
			'name'    => '权限管理',
			'auth'    => 'auth',
			'is_menu' => 1,
			'list'    => [
				[
					'name'    => '权限列表',
					'auth'    => 'index',
					'is_menu' => 1
				]
			]
		],
		[
			'name'    => '个人中心',
			'auth'    => 'set',
			'is_menu' => 1,
			'list'    => [
				[
					'name'    => '修改密码',
					'auth'    => 'setpassword',
					'is_menu' => 1
				],
				[
					'name'    => '修改代理密码',
					'auth'    => 'setagentpassword',
					'is_menu' => 1
				],
			]
		]
	]
];