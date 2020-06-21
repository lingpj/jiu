<?php
/**
 * redis 扩展
 */
namespace Credis;

require __DIR__ . '/Client.php';

class Credis
{
	// 配置文件
	protected $_config = array(
        'host' => '127.0.0.1',
        'port' => 6379,
        'timeout' => 3,
        'persistent' => '',
        'db' => 9,
	);

	// 实例
	protected $_instance = null;

	/**
     * 架构方法 设置参数
     * @access public
     * @param  array $config 配置参数
     */
    public function __construct($config = array())
    {
        $this->_config = array_merge($this->_config, $config);
    }

	/**
	 * getInstance
	 */
	public function getInstance()
	{
		if (!$this->_instance) {
			extract($this->_config);
			// var_dump($host, $port, $timeout, $persistent, $db);
			$this->_instance = new \Credis_Client($host, $port, $timeout, $persistent, $db,$password);
		}
		return $this->_instance;
	}

}