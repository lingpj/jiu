<?php
/**
 * description 微信(扫码)支付扩展
 *
 * @see https://pay.weixin.qq.com/wiki/doc/api/native.php?chapter=6_5
 * @author ZhangHaoLei <debmzhang@163.com>
 * @create 2017-04-12 10:30:40
 */

namespace pay\wxpay;

require_once __DIR__ . '/lib/WxPay.Api.php';

//require_once __DIR__ . '/example/WxPay.NativePay.php';
//require_once __DIR__ . '/example/log.php';
//require_once __DIR__ . '/example/jsapi.php';
require_once __DIR__ . '/example/WxPay.JsApiPay.php';

class Wxpay
{
    // 参数参考 @see https://pay.weixin.qq.com/wiki/doc/api/native.php?chapter=9_1
    public $notify_url;
    public $body = '';
    public $attach = '';
    public $goods_tag = '';
    public $product_id = 1;
    public $trade_type = 'NATIVE';

    /**
     * 初始化
     */
    public function __construct($config = array())
    {
        if (!$config || !is_array($config)) {
            throw new \Exception('wxpay config not exists!');
        }
		$this->body = config('pay.body');
		$this->attach = config('pay.attach');
        // $reflector = new \ReflectionClass(get_class($this));
        $reflector = new \ReflectionClass(__CLASS__);
        $properties = $reflector->getProperties();
        foreach ($properties as $property) {
            $propertyName = $property->getName();
            if (isset($config[$propertyName]) && ('' != trim($config[$propertyName]))) {
                $this->$propertyName = $config[$propertyName];
            }
        }
    }

    /**
     * 扫码支付模式一 demo
     *
     * 流程：
     * 1、组装包含支付信息的url，生成二维码
     * 2、用户扫描二维码，进行支付
     * 3、确定支付之后，微信服务器会回调预先配置的回调地址，在【微信开放平台-微信支付-支付配置】中进行配置
     * 4、在接到回调通知之后，用户进行统一下单支付，并返回支付信息以完成支付（见：native_notify.php）
     * 5、支付完成之后，微信服务器会通知支付成功
     * 6、在支付成功通知中需要查单确认是否真正支付成功（见：notify.php）
     *
     * @see https://pay.weixin.qq.com/wiki/doc/api/native.php?chapter=6_4
     */
    public function scanpay1()
    {
        $notify = new \NativePay();
        $url = $notify->GetPrePayUrl("123456789");
        return $url;
    }

    /**
     * 扫码支付模式二
     *
     * 流程：
     * 1、调用统一下单，取得code_url，生成二维码
     * 2、用户扫描二维码，进行支付
     * 3、支付完成之后，微信服务器会通知支付成功
     * 4、在支付成功通知中需要查单确认是否真正支付成功（见：notify.php）
     *
     * @see https://pay.weixin.qq.com/wiki/doc/api/native.php?chapter=6_5
     * @param string $out_trade_no 商户订单号
     * @param string $total_amount 支付总金额 (单位/元)
     */
    public function scanpay2($out_trade_no = '', $total_amount = 0)
    {
        // <div style="margin-left: 10px;color:#556B2F;font-size:30px;font-weight: bolder;">扫描支付模式二</div><br/>
        // <img alt="模式二扫码支付" src="http://paysdk.weixin.qq.com/example/qrcode.php?data= echo urlencode($url2)
        // 元转换为分
        $totalAmount = $total_amount * 100;
        if (!is_numeric($totalAmount) || (0 == $totalAmount)) {
            return false;
        }
        $notify = new \NativePay();
        $input = new \WxPayUnifiedOrder();
        $input->SetBody($this->body);
        $input->SetAttach($this->attach);
        $input->SetOut_trade_no($out_trade_no);
        // 支付金额(单位/分)
        // @see https://pay.weixin.qq.com/wiki/doc/api/native.php?chapter=4_2
        $input->SetTotal_fee($totalAmount);
        $input->SetTime_start(date("YmdHis"));
        $input->SetTime_expire(date("YmdHis", time() + 600));
        $input->SetGoods_tag($this->goods_tag);
        $input->SetNotify_url($this->notify_url);
        $input->SetTrade_type($this->trade_type);
        $input->SetProduct_id($this->product_id);
        $result = $notify->GetPayUrl($input, 30);
        $url = $result["code_url"];
        return $url;
    }

    public function scanpay3($out_trade_no = '', $total_amount = 0)
    {
        $totalAmount = $total_amount * 100;
        if (!is_numeric($totalAmount) || (0 == $totalAmount)) {
            return false;
        }
        //①、获取用户openid
        $tools = new \JsApiPay();
        $openId = $tools->GetOpenid();
        //②、统一下单
        $input = new \WxPayUnifiedOrder();
        $input->SetBody($this->body);
        $input->SetAttach($this->attach);
        $input->SetOut_trade_no($out_trade_no);
        $input->SetTotal_fee($totalAmount);
        $input->SetTime_start(date("YmdHis"));
        $input->SetTime_expire(date("YmdHis", time() + 600));
        $input->SetGoods_tag($this->goods_tag);
        $input->SetNotify_url($this->notify_url);
        $input->SetTrade_type("JSAPI");
        $input->SetOpenid($openId);
        $order = \WxPayApi::unifiedOrder($input);
        echo '<font color="#f00"><b>统一下单支付单信息</b></font><br/>';
        $jsApiParameters = $tools->GetJsApiParameters($order);
		//获取共享收货地址js函数参数
        $editAddress = $tools->GetEditAddressParameters();
    }

	//微信公众号内支付 在页面上用js调用
	public function scanpay4($out_trade_no = '', $total_amount = 0,$code = null)
	{
		$totalAmount = $total_amount * 100;
		if (!is_numeric($totalAmount) || (0 == $totalAmount)) {
			return false;
		}
		//①、获取用户openid
		$tools = new \JsApiPay();
		$openId = $tools->GetOpenid();
//		$openId = $code;
		//②、统一下单
		$input = new \WxPayUnifiedOrder();
		$input->SetBody($this->body);
		$input->SetAttach($this->attach);
		$input->SetOut_trade_no($out_trade_no);
		$input->SetTotal_fee($totalAmount);
		$input->SetTime_start(date("YmdHis"));
		$input->SetTime_expire(date("YmdHis", time() + 600));
		$input->SetGoods_tag($this->goods_tag);
		$input->SetNotify_url($this->notify_url);
		$input->SetTrade_type("JSAPI");
		$input->SetOpenid($openId);
		$order = \WxPayApi::unifiedOrder($input);
		$jsApiParameters = $tools->GetJsApiParameters($order);
		//获取共享收货地址js函数参数
		$editAddress = $tools->GetEditAddressParameters();
		return [$jsApiParameters,$editAddress];
	}

	public function genOpenId($out_trade_no = '', $total_amount = 0)
	{
		$totalAmount = $total_amount * 100;

		if (!is_numeric($totalAmount) || (0 == $totalAmount)) {
			return false;
		}
		session('totalAmount',$total_amount * 100);
		session('out_trade_no',$out_trade_no);
		//①、获取用户openid
		$tools = new \JsApiPay();
		$tools->GetOpenid();
	}

	public function pay(){
		$out_trade_no = session('out_trade_no');
		$totalAmount = session('totalAmount');

		//①、获取用户openid
		$tools = new \JsApiPay();
		$openId = $tools->GetOpenid();
		//②、统一下单
		$input = new \WxPayUnifiedOrder();
		$input->SetBody($this->body);
		$input->SetAttach($this->attach);
		$input->SetOut_trade_no($out_trade_no);
		$input->SetTotal_fee($totalAmount);
		$input->SetTime_start(date("YmdHis"));
		$input->SetTime_expire(date("YmdHis", time() + 600));
		$input->SetGoods_tag($this->goods_tag);
		$input->SetNotify_url($this->notify_url);
		$input->SetTrade_type("JSAPI");
		$input->SetOpenid($openId);
		$order = \WxPayApi::unifiedOrder($input);
		$jsApiParameters = $tools->GetJsApiParameters($order);
		//获取共享收货地址js函数参数
		$editAddress = $tools->GetEditAddressParameters();
		return [$jsApiParameters,$editAddress];
	}
}
