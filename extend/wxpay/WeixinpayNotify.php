<?php
/**
 * description 微信支付回调
 * 
 * @see https://pay.weixin.qq.com/wiki/doc/api/native.php?chapter=6_5
 * @author ZhangHaoLei <debmzhang@163.com>
 * @create 2017-04-12 11:40:00
 */

namespace pay\wxpay;

require_once __DIR__ . '/lib/WxPay.Api.php';
require_once __DIR__ . '/lib/WxPay.Notify.php';
require_once __DIR__ . '/example/log.php';

class WeixinpayNotify extends \WxPayNotify
{
    //查询订单
    public function Queryorder($transaction_id)
    {
        $input = new \WxPayOrderQuery();
        $input->SetTransaction_id($transaction_id);
        $result = \WxPayApi::orderQuery($input);
        \Log::DEBUG("query:" . json_encode($result));
        if (array_key_exists("return_code", $result)
            && array_key_exists("result_code", $result)
            && $result["return_code"] == "SUCCESS"
            && $result["result_code"] == "SUCCESS") {
            return true;
        }
        return false;
    }

    //重写回调处理函数
    public function NotifyProcess($data, &$msg)
    {
//        \Log::DEBUG("call back:" . json_encode($data));
//        $notfiyOutput = array();

        if(!array_key_exists("transaction_id", $data)){
            $msg = "输入参数不正确";
            return false;
        }
        //查询订单，判断订单真实性
        if(!$this->Queryorder($data["transaction_id"])){
            $msg = "订单查询失败";
            return false;
        }
        return true;
    }

    /**
     * parseXml
     */
    public function parseXml()
    {
		$xml = file_get_contents("php://input");//为了支持php7
//        $xml = $GLOBALS['HTTP_RAW_POST_DATA'];
//        $xml = '
//        <xml>
//   <appid>wx2421b1c4370ec43b</appid>
//   <mch_id>10000100</mch_id>
//   <nonce_str>ec2316275641faa3aacf3cc599e8730f</nonce_str>
//   <transaction_id>1008450740201411110005820873</transaction_id>
//   <sign>FDD167FAA73459FD921B144BAF4F4CA2</sign>
//</xml>
//        ';
        $result = \WxPayResults::Init($xml);
        return $result;
    }

}
