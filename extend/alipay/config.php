<?php
$config = array (
	//应用ID,您的APPID。
	'app_id' => "2016080800193990",

	//商户私钥
	'merchant_private_key' => "MIIEowIBAAKCAQEAxcortbGGARF2CO+FI4lOJd3BjHoIvvJ0EZEOiaHsDhaLLXXzvARec+sEmEJ7Ee5kN2IyBq2o/U5hQGgw07y0YjdgWDZWc3dPVdIe2JGFgFrHbSd0X29F835bj6Ioqzd4wYGIvinctQIw+M0M+9tsCe8Wp7JJdwfIPrL0GT2poZpWikdyVRUwfHKzBZHv/BA2F/E55w+Rpthp6tdCJXq1MEaEwvJIH1rMZ68sXA2F+8+dot+tVPYAgA8fJH2QQnX54z52hSbhuxCEJoguNlekql62IwWOE9vpCS5pyMXvmmJ0wG++luXRbjE1vnHDkseQMMsKD5YYwn/omwhlYrYN3wIDAQABAoIBAGXiWZezhYLBWtsJfryqeu34iD3zktPBktaFsUZmeXFcXX8idlYQrhLqKijAfiLjeQ4qb/iOtjEdke0afqRjXUwGmIN4IhpCiER+A1OtymYu3PG2VDTg3diq60FW17oyzepn7md+quk24sEW5yxJgCKx3SqvJTbCdH0Ps7vYzqumK5kX74JiFGLz7C7X9Hjk3mo7dQPu/vERR0vWt7KC4vLjOVJOTdZl6rwwKPWrnsS19AZFusPBhKltcSfV+aAqcOKM/th4ziu5NrT05CqGB/g1zzhE9nOaQofJQNjquMF2IqiKdAULPBbSOTAdAC3tgXETDZrviDMH7y2I0Uio2CkCgYEA8pMCS10+0sMgdXyvrgJX48DBpwqWiP0SPejbV3eJQhtSzCzq6KE5HegxqgCYVIvP+7JPct68K7KWNl9jK/lj23/Z7Eo5UFVIxcpee/5cVXGZhZcRI65NPjzl2ctKGGv5xXkn/swV6e4o6+ky6zqVp95oI3AM7XAGtFKc9Libg30CgYEA0LyeLnsJau78Jc8KzXBFyIAqjT8o9OLEemTeTtf+tYEltSl6iZTeJRzwtiTayAtPulsUD7Y7tW52SeSaQWq/QdEdSwsx06PcVhFGTIZ7KGjH7IR91QyzMbuA6HwBJ7C59coFTxCTRqFnTDv7EnhR0n46ejrDGoN7gBaVSv7KnYsCgYEAo7H1QGqCdLRc+SvVWjYWnYl8pX8NqxAs+T5klpgCNmw96a7+L1JtOvNwYGraYWOgTRg9aSVKEqsHl1WzlP9NFdkndL96Ae4rl95C+KXkJXztvyr80/lSAwgRjHIVZHmpKkviY53Rw/WGA/1w8TCtwYTi/dclwi1xOMrvRG438/kCgYANdozxTIg/+GgU/DSjKYGmu/WCpLc8jD/F8SmRhkbsaAcJl0JLC2oElMhFxzzBOFGNIIC7vrI9MoG4pGD6pSru0NEF3RP6pY/5kSWqm+XnplJ2w9jl2+rW41QeKplceP6VhtEu10/Yd2KVPS0ldNM6M2AMMCwTUrWtfkdkzeg9nwKBgCet21gHCw7Q9oRAKABN0lM5cZZ1Fzq2UJjOF/Z63azN/p/Y7q2lH/ibPKLHqGeuoHYTxChaDB+vjMUxi2zMT7UAZn+BriJWTkcWb13rDmcJ6yw5P/mZ1HnZagrtKAvL15OSXtSQAR13+p5ocmRTS3S1M0E2Y8m8SQ8BK+XLgWoZ",

	//异步通知地址
	'notify_url' => "http://www.jskjjsql.cn/index/index/aliNotify",

	//同步跳转
	'return_url' => "http://www.jskjjsql.cn/index/index/aliSuccess",

	//编码格式
	'charset' => "UTF-8",

	//签名方式
	'sign_type'=>"RSA2",

	//支付宝网关
	//沙箱网关https://openapi.alipaydev.com/gateway.do
	'gatewayUrl' => "https://openapi.alipay.com/gateway.do",

	//支付宝公钥,查看地址：https://openhome.alipay.com/platform/keyManage.htm 对应APPID下的支付宝公钥。
	'alipay_public_key' => "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAxcortbGGARF2CO+FI4lOJd3BjHoIvvJ0EZEOiaHsDhaLLXXzvARec+sEmEJ7Ee5kN2IyBq2o/U5hQGgw07y0YjdgWDZWc3dPVdIe2JGFgFrHbSd0X29F835bj6Ioqzd4wYGIvinctQIw+M0M+9tsCe8Wp7JJdwfIPrL0GT2poZpWikdyVRUwfHKzBZHv/BA2F/E55w+Rpthp6tdCJXq1MEaEwvJIH1rMZ68sXA2F+8+dot+tVPYAgA8fJH2QQnX54z52hSbhuxCEJoguNlekql62IwWOE9vpCS5pyMXvmmJ0wG++luXRbjE1vnHDkseQMMsKD5YYwn/omwhlYrYN3wIDAQAB",
);