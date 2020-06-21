<?php
/**
 * Created by PhpStorm.
 * Author: zjh
 * Date: 2017-8-28 028
 * Time: 17:18
 */

namespace app\common\service;
require EXTEND_PATH.'wxpay'.DS.'lib'.DS.'WxPay.Api.php';

class RefundService extends CommonService
{
	public function refund($transaction_id,$total_fee,$refund_fee,$id,$out_refund_no = null){

		$param = new \WxPayRefund();

		$param->SetTransaction_id($transaction_id);
		$param->SetRefund_fee($refund_fee);
		$param->SetTotal_fee($total_fee);
		$param->SetOp_user_id(\WxPayConfig::MCHID);//商户号
		//退款唯一编号，第一次退款不成功，第二次再尝试时候，还要使用这个编号
		if(empty($out_refund_no)){
			$out_refund_no = \WxPayConfig::MCHID.date('YmdHis').$id;
		}
		$param->SetOut_refund_no($out_refund_no);

		try{
			\WxPayApi::refund($param);
		}catch (\Exception $e){
			return [$out_refund_no,$e];
		}

		return [$out_refund_no,null];
	}
}