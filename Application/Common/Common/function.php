<?php

function initHome($modules) {
    /* --判断设备状态是否有权限-- */
    //设备状态
    //if (onlyGetPrivilege("session") == 0) {
        //unset($modules['DeviceState']);
    //}
    //访问控制
    if (onlyGetPrivilege("firewall") == 0) {
        unset($modules['InterviewControl']);
    }
    //设备信息上报模块
    if (onlyGetPrivilege("device-maintenance") == 0) {
        unset($modules['GuardInfo']);
    }
    //配置日志和登陆日志
    if (getLicense(0, "THREEMAN") == 1) {
        if (onlyGetPrivilege("log-admin") == 1 || onlyGetPrivilege("log-grantor") == 1) {
            unset($modules['ConfigLog']);
            unset($modules['LoginLog']);
        }
    }

    return $modules;
}

//初始化菜单
function initMenu($menu) {
    /* ---------------------------license------------------------- */
    //$vSysId = getVsid();    //获取虚系统号,暂时不支持虚系统，直接填写0就可以。
    /* ---监控--- */
    if (getLicense(0, "STAT") == 0) {
        unset($menu['monitor']['childs']['interface_flow']);
        unset($menu['monitor']['childs']['app_flow']);
        unset($menu['monitor']['childs']['user_flow']);
        unset($menu['monitor']['childs']['user_group_flow']);
        unset($menu['monitor']['childs']['server_flow']);
        unset($menu['monitor']['childs']['threaten_info']);
        unset($menu['monitor']['childs']['ipsec_vpn_flow']);
    }
    //在线用户
    if (getLicense(0, "USER_MANAGE") == 0) {
        unset($menu['monitor']['childs']['online_user_show']);
    }
    /* ---安全策略--- */
    //地址转换
    if (getLicense(0, "NAT") == 0) {
        unset($menu['policy']['childs']['nat']);
    }
    /*//流量控制
    if (getLicense(0, "QOS") == 0) {
        unset($menu['policy']['childs']['qos']);
    }*/
    /*//应用
    if (getLicense(0, "AISE") == 0) {
        unset($menu['policy']['childs']['define_object']['childs']['ai']);
    }*/
    //开放服务
    if (getLicense(0, "PF") == 0) {
        unset($menu['policy']['childs']['pf']);
    }
    /*//ALG
    if (getLicense(0, "ALG") == 0) {
        unset($menu['policy']['childs']['alg']);
    }
    //入侵防御
    if (getLicense(0, "IPS") == 0) {
        unset($menu['policy']['childs']['ips']);
    }
    //ddos防御
    if (getLicense(0, "DDOS") == 0) {
        unset($menu['policy']['childs']['ddos']);
    }
    //URL过滤
    if (getLicense(0, "URL_FILTER") == 0) {
        unset($menu['policy']['childs']['url_filter']);
    }
    //内容过滤
    if (getLicense(0, "DATA_FILTER") == 0) {
        unset($menu['policy']['childs']['data_filter']);
    }
    //文件过滤
    if (getLicense(0, "FILE_BLOCK") == 0) {
        unset($menu['policy']['childs']['filefilter']);
    }
    //病毒过滤
    if (getLicense(0, "AV") == 0) {
        unset($menu['policy']['childs']['avfilter']);
    }*/
    //添加的  代理模块  23
    if (getLicense(0, "PROXY") == 0) {
        unset($menu['policy']['childs']['proxy']);
    }
    /* ---网络管理--- */
    //虚拟线
    if (getLicense(0, "VLINE") == 0) {
        unset($menu['network']['childs']['interface']['childs']['virtual_line']);
    }
    //聚合接口
    if (getLicense(0, "BOND") == 0) {
        unset($menu['network']['childs']['interface']['childs']['bond']);
    }
    //DHCP
    if (getLicense(0, "DHCP") == 0) {
        unset($menu['network']['childs']['dhcp']);
    } else {
        if (getLicense(0, "DHCP_CLIENT") == 0) {
            unset($menu['network']['childs']['dhcp']['childs']['dhcpClient']);
        }
        if (getLicense(0, "DHCP_RELAY") == 0) {
            unset($menu['network']['childs']['dhcp']['childs']['dhcpRelay']);
        }
        if (getLicense(0, "DHCP_SERVER") == 0) {
            unset($menu['network']['childs']['dhcp']['childs']['dhcpServer']);
        }
    }
    //DHCP6
    if (getLicense(0, "DHCP6") == 0) {
        unset($menu['network']['childs']['dhcpv6']);
    }
    //RADVD
    if (getLicense(0, "RADVD") == 0) {
        unset($menu['network']['childs']['radvd']);
    }
    /*//IPSEC
    if (getLicense(0, "IPSEC") == 0) {
        unset($menu['network']['childs']['ipsec']);
    }
    if (getLicense(0, "DNS") == 0) {
        unset($menu['network']['childs']['dns']);
    }*/
    /* ---网络管理--- */
    //接口联动
    $vsys_user = isVrAdmin();
    if ($vsys_user) {
        unset($menu['network']['childs']['interface']['childs']['suitstate']);
    }
    /* ---系统管理--- */
    //SNMP
    if (getLicense(0, "SNMP") == 0) {
        unset($menu['system']['childs']['system_config']['childs']['snmp']);
        unset($menu['system']['childs']['alarm']);
    }
    if (getLicense(0, "NTP") == 0) {
        unset($menu['system']['childs']['system_config']['childs']['time']);
    }
    //双机热备
    if (getLicense(0, "HA") == 0) {
        unset($menu['system']['childs']['ha']['childs']['ha']);
        unset($menu['network']['childs']['interface']['childs']['suitstate']);
    }
    //均衡组
    if (getLicense(0, "VIRTUAL_SERVER") == 0) {
        unset($menu['policy']['childs']['define_object']['childs']['virtual_server']);
        //unset($menu['policy']['childs']['define_object']['childs']['server']);
    }
    //规则库升级
    if (getLicense(0, "IPS") == 0 && getLicense(0, "AISE") == 0 && getLicense(0, "AV") == 0 && getLicense(0, "URL_FILTER") == 0) {
        unset($menu['system']['childs']['maintain']['childs']['rules']);
    }

    //虚系统 ++++++++++自己加的++++++++++
    if (getLicense(0, "VSYS") == 0) {
       // unset($menu['network']['childs']['interface']['childs']['vr_veth']);
       unset($menu['system']['childs']['system_virtual']);
    }

    /* ---用户管理--- */
    //用户管理
    if (getLicense(0, "USER_MANAGE") == 0) {
        unset($menu['auth']['childs']['user']);
        unset($menu['auth']['childs']['service']);
        unset($menu['auth']['childs']['portal']);
    }
    /*//PKI
    if (getLicense(0, "PKI") == 0) {
        unset($menu['auth']['childs']['pki']);
    }*/

    /* -------------------------权限模板--------------------------------- */
    // if (onlyGetPrivilege("global") == 0) {

    if (onlyGetPrivilege("network") == 0) {
        if (onlyGetPrivilege("session") == 0 && getLicense(0, "STAT") == 0) {
            unset($menu['system']['childs']['system_config']['childs']['parameters']);
        }
    }

    if (onlyGetPrivilege("session") == 0) {
        unset($menu['monitor']['childs']['session']);
    }
    /* ---安全策略--- */
    if (onlyGetPrivilege("firewall") == 0) {
        unset($menu['policy']['childs']['firewall']);
    }

    if (onlyGetPrivilege("nat") == 0) {
        unset($menu['policy']['childs']['nat']);
        unset($menu['policy']['childs']['define_object']['childs']['virtual_server']);
    }
    /*if (onlyGetPrivilege("qos") == 0) {
        unset($menu['policy']['childs']['qos']);
    }*/

    if (onlyGetPrivilege("pf-service") == 0) {
        unset($menu['policy']['childs']['pf']);
    }

    if (onlyGetPrivilege("define") == 0) {

        unset($menu['policy']['childs']['define_object']['childs']['area']);
        unset($menu['policy']['childs']['define_object']['childs']['address']);
        unset($menu['policy']['childs']['define_object']['childs']['schedule']);
        unset($menu['policy']['childs']['define_object']['childs']['service']);
        unset($menu['policy']['childs']['define_object']['childs']['server']);
    }
    //if (onlyGetPrivilege("define") == 0) {
    //  unset($menu['policy']['childs']['define_object']['childs']['monitor']);
    //}
    /*if (onlyGetPrivilege("ai") == 0 && onlyGetPrivilege("global-ai") == 0) {
        unset($menu['monitor']['childs']['app_flow']);
        unset($menu['policy']['childs']['define_object']['childs']['ai']);
    }*/
    /* if (onlyGetPrivilege("ips") == 0) {
        unset($menu['policy']['childs']['ips']);
    }
    if (onlyGetPrivilege("ddos") == 0) {
        unset($menu['policy']['childs']['ddos']);
    }
    if (onlyGetPrivilege("url_filter") == 0) {
        unset($menu['policy']['childs']['url_filter']);
    }
    if (onlyGetPrivilege("data_filter") == 0) {
        unset($menu['policy']['childs']['data_filter']);
    }
    if (onlyGetPrivilege("file_block") == 0) {
        unset($menu['policy']['childs']['filefilter']);
    }
    if (onlyGetPrivilege("av") == 0) {
        unset($menu['policy']['childs']['avfilter']);
    }*/

    if (onlyGetPrivilege("proxy") == 0) {
        unset($menu['policy']['childs']['proxy']);
    }
    /*if (onlyGetPrivilege("dns") == 0) {
        unset($menu['network']['childs']['dns']);
        unset($menu['system']['childs']['system_config']['childs']['hostDNS']);
    }*/
    /* --网络管理-- */
    if (onlyGetPrivilege("network") == 0) {
        unset($menu['network']['childs']['interface']);
        unset($menu['network']['childs']['route']);
        unset($menu['network']['childs']['arp']);
        unset($menu['network']['childs']['mac']);
        unset($menu['network']['childs']['dhcp']);
        unset($menu['network']['childs']['dhcpv6']);
        unset($menu['network']['childs']['radvd']);
        unset($menu['network']['childs']['gre']);
        unset($menu['network']['childs']['ipprobe']);
        unset($menu['system']['childs']['ha']['childs']['link']);
    }

    if (onlyGetPrivilege("network") == 0 && onlyGetPrivilege("vsys-manage") == 0) {
        unset($menu['network']['childs']['interface']['childs']['interface']);
        unset($menu['network']['childs']['interface']['childs']['vlan']);
    }

    /* ---系统管理--- */
    if (onlyGetPrivilege("snmp") == 0) {
        unset($menu['system']['childs']['system_config']['childs']['snmp']);
    }
    //系统诊断
    if (onlyGetPrivilege("net-diagnose") == 0 && rootVsys() == 1) {
        unset($menu['system']['childs']['system_config']['childs']['diagnose']);
    }

    if (onlyGetPrivilege("vsys-manage") == 0) {
        //   unset($menu['network']['childs']['interface']['childs']['vr_veth']);
        unset($menu['system']['childs']['system_virtual']);
    }
    //系统维护
    if (onlyGetPrivilege("device-maintenance") == 0 && rootVsys() != 1) {
        unset($menu['system']['childs']['system_config']['childs']['time']);
        unset($menu['system']['childs']['maintain']['childs']['reboot']);
        unset($menu['system']['childs']['maintain']['childs']['license']);
        unset($menu['system']['childs']['maintain']['childs']['rules']);
        unset($menu['system']['childs']['maintain']['childs']['guard']);
        unset($menu['system']['childs']['maintain']['childs']['upload']);
        unset($menu['system']['childs']['maintain']['childs']['package']);
    }

    if (onlyGetPrivilege("local-service") == 0) {
        unset($menu['system']['childs']['system_config']['childs']['serviceSet']);
    }
    //配置维护
    if (onlyGetPrivilege("config-maintenance") == 0) {
        unset($menu['system']['childs']['maintain']['childs']['config']);
    }
    //资源监控
    if (isVrAdmin()) {
        unset($menu['system']['childs']['maintain']['childs']['Resource']);
        unset($menu['system']['childs']['user_manage']);
    }
    //管理员
    //if (onlyGetPrivilege("admin") == 0 && onlyGetPrivilege("privilege") == 0 && onlyGetPrivilege("device-maintenance") ==0) {
        //unset($menu['system']['childs']['user_manage']);
    //}
    // TODO 因判断相同，移动到上面 资源监控 的判断。
    /*if (isVrAdmin()) {
        unset($menu['system']['childs']['user_manage']);
    }*/

    /* 日志所有功能 */
    /* 　　(1)三元管理　　 */
    if (getLicense(0, "THREEMAN") == 1) {
        if(getAdminName() != 'admin') {
            unset($menu['system']['childs']['maintain']['childs']['Resource']);
            unset($menu['system']['childs']['maintain']['childs']['guard']);
        }
        if (onlyGetPrivilege("log-admin") == 1) {

            unset($menu['system']['childs']['journal']['childs']['audti']);
            unset($menu['system']['childs']['journal']['childs']['policy']);
        } else if (onlyGetPrivilege("log-grantor") == 1) {

            unset($menu['system']['childs']['journal']['childs']['audti']);
            unset($menu['system']['childs']['journal']['childs']['system']);
            unset($menu['system']['childs']['log']['childs']['log_server']);
        } else if (onlyGetPrivilege("log-auditor") == 1) {

            unset($menu['system']['childs']['journal']['childs']['system']);
            unset($menu['system']['childs']['journal']['childs']['policy']);
            unset($menu['system']['childs']['log']['childs']['log_server']);
        }
    }
    /*  (2)二元管理　　　 */
    if (getLicense(0, "TWOMAN") == 1) {
        if(getAdminName() != 'superman') {
            unset($menu['system']['childs']['maintain']['childs']['Resource']);
            unset($menu['system']['childs']['maintain']['childs']['guard']);
        }
        if (onlyGetPrivilege("log_auditor") == 1) {

            unset($menu['system']['childs']['journal']['childs']['system']);
            unset($menu['system']['childs']['journal']['childs']['policy']);
            unset($menu['system']['childs']['log']['childs']['log_server']);
        } else if (onlyGetPrivilege("log") == 1) {

            unset($menu['system']['childs']['journal']['childs']['audti']);
        }
    }

    //13
    if (onlyGetPrivilege("alarm") == 0) {
        unset($menu['system']['childs']['alarm']);
    }
    //高可用性
    if (onlyGetPrivilege("ha") == 0) {
        unset($menu['system']['childs']['ha']['childs']['ha']);
    }
    //22
    /* ---用户管理--- */
    if (onlyGetPrivilege("user_manage") == 0) {
        //监控-在线用户
        unset($menu['monitor']['childs']['online_user_show']);
        //监控-用户流量
        //        unset($menu['monitor']['childs']['user_flow']);
        //        unset($menu['monitor']['childs']['user_group_flow']);
        //用户管理
        unset($menu['auth']['childs']['user']);
        unset($menu['auth']['childs']['service']);
        unset($menu['auth']['childs']['portal']);
    }
    /*if (onlyGetPrivilege("pki") == 0) {
        unset($menu['auth']['childs']['pki']);
    }*/

    /* -----------一二级菜单检查----------- */
    //监控
    if (!$menu['monitor']['childs']) {
        unset($menu['monitor']);
    }
    //安全策略
    if (!$menu['policy']['childs']['define_object']['childs']) {//检查三级菜单是否为空，为空删除二级菜单
        unset($menu['policy']['childs']['define_object']);
    }
    if (!$menu['policy']['childs']) {//检查二级菜单是否为空，为空删除一级菜单
        unset($menu['policy']);
    }
    //网络管理
    if (!$menu['network']['childs']['interface']['childs']) {
        unset($menu['network']['childs']['interface']);
    }
    if (!$menu['network']['childs']) {
        unset($menu['network']);
    }
    //系统管理
    if (!$menu['system']['childs']['system_config']['childs']) {
        unset($menu['system']['childs']['system_config']);
    }
    if (!$menu['system']['childs']['maintain']['childs']) {
        unset($menu['system']['childs']['maintain']);
    }
    if (!$menu['system']['childs']) {
        unset($menu['system']);
    }
    //用户管理
    if (!$menu['auth']['childs']) {
        unset($menu['auth']);
    }

    if (privilegeCheck()) {
        unset($menu['home']);
        unset($menu['monitor']);
    }

    return $menu;
}

function privilegeCheck() {
    $type = getAdminType();
    //二员管理auditor不可见监控
    if ((getLicenseValue("THREEMAN",0) == "twoman") && (($type & TOS_ADMIN_PRIVA_AUDITOR) > 0)) {
        return 1;
    }

    //三员管理auditor\admin\grantor不可见监控；排除operator
    if ((getLicenseValue("THREEMAN", 0) == "threeman") && ($type != 19) && (($type & TOS_ADMIN_PRIVA_PREFAB) > 0)) {
        return 1;
    }
    return 0;
}

function get_flow_unit($size) {
    $pos = 0;
    $unit = array('B', 'KB', 'MB', 'GB', 'TB', 'PB');
    while ($size >= 1024 && $pos <= 5) {
        $size /= 1024;
        $pos++;
    }
    return $unit[$pos];
}

function format_flow_data($size, $unit) {
    switch ($unit) {
        case 'B':
            $data = $size;
            break;
        case 'KB':
            $data = $size / 1024;
            break;
        case 'MB':
            $data = $size / 1024 / 1024;
            break;
        case 'GB':
            $data = $size / 1024 / 1024 / 1024;
            break;
        case 'TB':
            $data = $size / 1024 / 1024 / 1024 / 1024;
            break;
    }
    return is_float($data) ? round($data, 2) : $data;
}

/**
 * 兼容1.0，准备废弃，请直接使用json_encode() 
 * @param array $data
 * @return json
 */
function get_jsondata($data) {
    return json_encode($data);
}

/**
 * xml转数组转换函数 
 * 由于loadXML效率低于simplexml_load_string。2.0以后版本不建议使用
 * @param type $n
 * @return string
 * @deprecated since version 2.0
 */
function parseDomXml2Array($n) {
    $xml_array = array();
    $occurance = array();
    foreach ($n->childNodes as $nc) {
//记录节点数量，1：无循环，大于1：有循环。。。
        $occurance[$nc->nodeName] ++;
    }
    foreach ($n->childNodes as $nc) {
        if ($nc->hasChildNodes()) {
//有子节点(有值就有子节点，无值无子节点)
            if ($occurance[$nc->nodeName] > 1) {
//如果有循环增加一级数组
                $xml_array[$nc->nodeName][] = parseDomXml2Array($nc);
            } else {
//无循环，定义一维数组
                $xml_array[$nc->nodeName] = parseDomXml2Array($nc);
            }
        } else {
//n为叶子级别，输出值
            if ($nc->nodeValue == null)
                $xml_array[$nc->nodeName] = "";
            else
                return $nc->nodeValue;
        }
    }
    return $xml_array;
}

/**
 * xml转数组loadXML版
 * 由于loadXML效率低于simplexml_load_string。2.0以后版本不建议使用。
 * @param string $xml
 * @return array
 * @deprecated since version 2.0
 */
function domXml2Array($xml) {
    if ($xml && strpos($xml, '&')) {
        $xml = str_replace('&', '&amp;', $xml);
    }
    $dom = new DOMDocument();
//preserveWhiteSpace()获取或设置一个值，该值指示是否在元素内容中保留空白。
//true 表示保留空白；否则为 false。 默认值为 false。
    $dom->preserveWhiteSpace = false;
    if ($xml) {
        $dom->loadXML($xml);
    }
    return parseDomXml2Array($dom);
}

/**
 * xml转数组simplexml_load_string版，推荐使用
 * @param string $xml
 * @param bool $recursive 是否循环
 * @return array
 */
function simpleXml2Array($xml, $recursive = false) {
    if (!$recursive) {
//转义特殊字符&
        if (($xml && strpos($xml, '&')) || ($xml && strpos($xml, '<<'))) {
            $xml = str_replace('<<', '&lt;<', $xml);
            $xml = str_replace('&', '&amp;', $xml);
        }
        $array = simplexml_load_string($xml);
    } else {
        $array = $xml;
    }

    $newArray = array();
    if (is_object($array)) {
        $array = (array) $array;
    }
    foreach ($array as $key => $value) {
        if (is_object($value) || is_array($value)) {
            $newArray [$key] = simpleXml2Array($value, true);
        } else {
            $newArray [$key] = trim($value);
        }
    }
    return $newArray;
}

/**
 * 数组转换为XML
 * @param array|object $array 数组或者对象
 * @return string xml格式字符串
 */
function array2Xml($array) {
// 如果是对象，转换为数组
    if (is_object($array)) {
        $array = get_object_vars($array);
    }
    $xml = null;
    foreach ($array as $k => $v) {
//如果是数字，特殊处理
        is_numeric($k) && $k = "item id=\"{$k}\"";
        $xml.= "<{$k}>";
//如果包含特殊字符，进行转义
        $xml.= (is_array($v) || is_object($v)) ? array2Xml($v) : ((strlen($v) > 0 && isSpecialChar($v)) ? htmlspecialchars($v) : $v);
//如果是数字，截取item id='0'得到item，作为节点尾部
        list($k, ) = explode(' ', $k);
        $xml.= "</{$k}>";
    }
    return $xml;
}

/**
 * 判断字符串中是否包含特殊符号
 * @param string $str
 * @param string $key 特殊字符  "&,',\",>,<"
 * @return boolean true:包含；false：不包含
 */
function isSpecialChar($str, $key = "',\",>,<") {
    $arr = explode(',', $key);
    foreach ($arr as $v) {
        if (strpos($str, $v) !== false) {
            return true;
        }
    }
    return false;
}

/**
 * 将$str保存在Runtime/debug.tpl文件中，仅支持数字、字符串。
 * @param string $str
 */
function debugFile($str) {
    $objfile = APP_PATH . "Runtime/debug.tpl";
    if (!@$fp = fopen($objfile, 'a')) {
        exit("Directory 'Application/Runtime/' not found or have no access!");
    }
    flock($fp, 2);
    fwrite($fp, $str . "\r\n");
    fclose($fp);
}

/**
 * 将函数参数保存在Runtime/debug.tpl文件中，支持数组、对象等。
 */
function debugVarDump() {
    for ($i = 0; $i < func_num_args(); ++$i) {
        $param = func_get_arg($i);
        $type = gettype($param);
        switch ($type) {
            case "NULL":
                debugFile("NULL");
                break;
            case "boolean":
                varDumpBoolean($param);
                break;
            case "integer":
                varDumpInteger($param);
                break;
            case "double":
                varDumpDouble($param);
                break;
            case "string":
                varDumpString($param);
                break;
            case "array":
                varDumpArray($param);
                break;
            case "object":
                varDumpObject($param);
                break;
            case "resource":
                debugFile("resource");
                break;
            default:
                debugFile("unknown type");
        }
    }
}

/**
 * 保存布尔变量到文件
 * @param Boolean $bool
 */
function varDumpBoolean($bool) {
    if ($bool) {
        debugFile("bool(true)");
    } else {
        debugFile("bool(false)");
    }
}

/**
 * 保存整形变量到文件
 * @param Int $int
 */
function varDumpInteger($int) {
    debugFile("int($int)");
}

/**
 * 保存浮点变量到文件
 * @param Double $double
 */
function varDumpDouble($double) {
    debugFile("float($double)");
}

/**
 * 保存字符串变量到文件
 * @param String $str
 */
function varDumpString($str) {
    $len = strlen($str);
    $value = "string($len) \"$str\"";
    debugFile($value);
}

/**
 * 保存字符串变量到文件
 * @param array $arr
 */
function varDumpArray($arr) {
    $keys = array_keys($arr);
    $len = count($arr);
    debugFile("array($len){");

    for ($i = 0; $i < $len; $i++) {
        debugFile(" [\"$keys[$i]\"]=> ");
        $index = $keys[$i];
        debugVarDump($arr[$index]);
    }
    debugFile("}");
}

/**
 * 保存对象变量的属性到文件
 * @param object $obj
 */
function varDumpProp($obj) {
    $reflect = new ReflectionClass($obj);
    $prop = $reflect->getDefaultProperties();
    $keys = array_keys($prop);
    $len = count($prop);
    debugFile(" ($len){");

    for ($i = 0; $i < $len; $i++) {
        debugFile(" [\"$keys[$i]\"]=> ");
        $index = $keys[$i];
        debugVarDump($prop[$index]);
    }
    debugFile("}");
}

/**
 * 保存对象变量到文件
 * @param object $obj
 */
function varDumpObject($obj) {
    $objId = 1;  //对象id
    $className = get_class($obj);
    debugFile("object($className)#$objId ");
    varDumpProp($obj);
}

/**
 * 树形菜单相关函数
 */
function build_tree($rows, $user_group) {
    $childs = find_child($rows, $user_group);
    if (empty($childs)) {
        return null;
    }
    foreach ($childs as $k => $v) {
        $rescurTree = build_tree($rows, $v['name']);
        if (null != $rescurTree) {
            $childs[$k]['state'] = 'closed';
            $childs[$k]['children'] = $rescurTree;
        }
    }
    return $childs;
}

function find_child(&$arr, $group) {
    $childs = array();
    foreach ($arr as $v) {
        if ($v['group'] == $group) {
            $childs[] = array('name' => $v['name']);
        }
    }
    return $childs;
}

function group_build_tree($rows, $user_group) {

    $childs = group_find_child($rows, $user_group);
    if (empty($childs)) {
        return null;
    }
    foreach ($childs as $k => $v) {
        $rescurTree = group_build_tree($rows, $v['text']);
        if (null != $rescurTree) {
            $childs[$k]['state'] = 'closed';
            $childs[$k]['children'] = $rescurTree;
        }
    }
    return $childs;
}

function group_find_child(&$arr, $group) {
//var_dump($group);die;
    $childs = array();
    foreach ($arr['rows'] as $v) {
        if ($v['group'] === $group) {
            $childs[] = array('text' => $v['name'], 'foldType' => '1');
        }
    }
    return $childs;
}

function group_build_search_tree($rows, $user_group) {
    $childs = group_search_child($rows, $user_group);
    if (empty($childs)) {
        return null;
    }
    foreach ($childs as $k => $v) {
        $rescurTree = group_build_search_tree($rows, $v['text']);
        if (null != $rescurTree) {
            if ($rescurTree[0]['searchTag'] == 1 || $rescurTree[0]['state'] == 'open') {
                $childs[$k]['state'] = 'open';
            } else {
                $childs[$k]['state'] = 'closed';
            }
            $childs[$k]['children'] = $rescurTree;
        }
    }
    return $childs;
}

function group_search_child(&$arr, $group) {
    $childs = array();
    foreach ($arr['rows'] as $v) {
        if ($v['group'] === $group) {
            if (strpos($v['name'], $_SESSION["searchGroupName"]) !== false) {
                $childs[] = array('text' => $v['name'], 'foldType' => '1', 'searchTag' => '1');
                $_SESSION["searchTag"] = '1';
            } else {
                $childs[] = array('text' => $v['name'], 'foldType' => '1');
            }
        }
    }
    return $childs;
}

function delete_misMatch_tree($arr) {
    $matchArr = array();
    $i = 0;
    foreach ($arr as $k => $v) {
        if ($arr[$k]['state'] == 'open' || $arr[$k]['searchTag'] == '1') {
            $matchArr[$i++] = $v;
        }
    }
    return $matchArr;
}

/**
 * 获取接口接收速率
 * @deprecated 需要修改数据连接方式。需要重写
 * @param string $interface
 */
function get_rx_speed_by_interface($interface) {
    /*
      $db = database();
      if ($db) {
      $sql = "select downbytes,visittime from link_flow_detail_vsys0_tb where name = '$interface' order by visittime desc limit 1";
      $arr = $db->select1array($sql);
      $diff = time() - strtotime($arr['visittime']);
      if ($diff > 15 || $arr['downbytes'] == 0) {
      $rx_speed = 0;
      } else {
      $rx_speed = ($arr['downbytes'] / 5) * 8;
      }
      return round($rx_speed) . " bps";
      } else {
      return "0 bps";
      }
      $db = null;
     */
    $table = M('link_flow_detail_vsys0_tb');
    if ($table) {
        $use = $table->where("name = '$interface'")->order("visittime desc")->limit("1")->find();
        $diff = time() - strtotime($use['visittime']);
        if ($diff > 60 || $diff < -60 || $use['downbytes'] == 0) {
            $rx_speed = 0;
        } else {
            $rx_speed = ($use['downbytes'] / 5) * 8;
        }
        return round($rx_speed) . " bps";
    } else {
        return "0 bps";
    }
}

/**
 * 获取接口发送速率
 * @deprecated 需要修改数据连接方式。需要重写
 * @param string $interface
 */
function get_tx_speed_by_interface($interface) {
    /*
      $db = database();
      if ($db) {
      $sql = "select upbytes,visittime from link_flow_detail_vsys0_tb where name = '$interface' order by visittime desc limit 1";
      $arr = $db->select1array($sql);
      $diff = time() - strtotime($arr['visittime']);
      if ($diff > 15 || $arr['upbytes'] == 0) {
      $tx_speed = 0;
      } else {
      $tx_speed = ($arr['upbytes'] / 5) * 8;
      }
      return round($tx_speed) . " bps";
      } else {
      return "0 bps";
      }
      $db = null;
     */
    $table = M('link_flow_detail_vsys0_tb');
    if ($table) {
        $use = $table->where("name = '$interface'")->order("visittime desc")->limit("1")->find();
        $diff = time() - strtotime($use['visittime']);
        if ($diff > 60 || $diff < -60 || $use['downbytes'] == 0) {
            $rx_speed = 0;
        } else {
            $rx_speed = ($use['downbytes'] / 5) * 8;
        }
        return round($rx_speed) . " bps";
    } else {
        return "0 bps";
    }
}

/**
 * 通过应用id取得应用名称
 * @param int $appid 应用id
 * @return string 应用名称
 */
function get_app_name_by_id($appid) {
//ai rule application_name show 1
    if (empty($appid) || $appid == 0) {
        return '未知';
    }
    $param['__NA__'] = $appid;
    $rspString = getResponse("ai rule application_name", "show", $param, 3);
    if (strstr($rspString, 'error') || $rspString == 0) {
        return $appid;
    } else {
        return $rspString['response-list']['group']['name'];
    }
}

/**
 * 通过协议id获取协议名称
 * @param int $protocolid 协议id
 * @return string 协议名称
 */
function get_protocol_name_by_id($protocolid) {
    if (empty($protocolid) || $protocolid == 0) {
        return '未知';
    }
    $param['__NA__'] = $protocolid;
    $rspString = getResponse("ai rule protocol_name", "show", $param, 3);
    if (strstr($rspString, 'error') || $rspString == 0) {
        return $protocolid;
    } else {
        return $rspString['response-list']['group']['name'];
    }
}

/* * ***************************** * ***********通讯接口********** * ****************************** */

/*
 * 获取虚系统开关
 * @return int 1:开，0：关
 */

function getVsysTurn() {
    return getLicense(0, "VSYS");
}

/**
 * 判断当前用户是否是超级管理员
 * @return boolean TRUE：是，FALSE：否
 */
function isSuperman() {
    if (getAdminType() & TOS_ADMIN_PRIVA_SUPERMAN) {
        return TRUE;
    } else {
        return FALSE;
    }
}

/**
 * 判断当前管理员是否是虚系统管理员
 * @return boolean TRUE：是，FALSE：否
 */
function isVrAdmin() {
    if (getAdminType() & TOS_ADMIN_PRIVA_VIRTUAL) {
        return TRUE;
    } else {
        return FALSE;
    }
}

/**
 * $name是否有license权限
 * @param int $vsid
 * @param string $name
 * @return int 1:有权限，0：无权限
 */
function getLicense($vsid, $name) {
    return ngtos_mngt_get_license($vsid, $name);
}

/**
 * license中$name的值
 * @param string $name
 * @param int $vsid
 * @return mixed
 */
function getLicenseValue($name, $vsid = 0) {
    return ngtos_mngt_get_license_value($vsid, $name);
}

/**
 * 获取当前是否是需系统路由
 * @return int 1:是，0:没权限
 */
function rootVsys() {

    $param['vsys-id'] = getVsid();
    $rspString = getResponse('vsys info', "get", $param, 1);
    $rspString = parseResponse($rspString, 0);
    $vsys_route = $rspString['rows']['vsys_route'];
    return $vsys_route;
}

/**
 * 获取权限模板，$module是否有权限
 * @param string $module
 * @return int 1:有读写权限，2：读权限，0:没权限
 */
function getPrivilege($module) {
    if (!checkLogined()) {
        header('location:' . $_COOKIE['urlorg']);
    }
    return ngtos_ipc_privilege(NGTOS_MNGT_CFGD_PORT, M_TYPE_WEBUI, REQ_TYPE_AUTH, AUTH_ID, NGTOS_MNGT_IPC_NOWAIT, $module);
}
//不做登陆判断，只获取权限，用于初始化菜单
function onlyGetPrivilege($module) {
    return ngtos_ipc_privilege(NGTOS_MNGT_CFGD_PORT, M_TYPE_WEBUI, REQ_TYPE_AUTH, AUTH_ID, NGTOS_MNGT_IPC_NOWAIT, $module);
}

/**
 * 获取当前系统的虚系统号
 * @return int
 */
function getVsid() {
    if (!checkLogined()) {
        header('location:' . $_COOKIE['urlorg']);
    }
    return ngtos_ipc_vsid(NGTOS_MNGT_CFGD_PORT, M_TYPE_WEBUI, REQ_TYPE_AUTH, AUTH_ID, NGTOS_MNGT_IPC_NOWAIT);
}

/**
 * 获取当前用户的用户类型
 * @return int
 */
function getAdminType() {
    if (!checkLogined()) {
        header('location:' . $_COOKIE['urlorg']);
    }
    return ngtos_ipc_admin_type(NGTOS_MNGT_CFGD_PORT, M_TYPE_WEBUI, REQ_TYPE_AUTH, AUTH_ID, NGTOS_MNGT_IPC_NOWAIT);
}

/**
 * 获取当前用户名
 * @return string
 */
function getAdminName() {
    if (!checkLogined()) {
        header('location:' . $_COOKIE['urlorg']);
    }
    return ngtos_ipc_admin_name(NGTOS_MNGT_CFGD_PORT, M_TYPE_WEBUI, REQ_TYPE_AUTH, AUTH_ID, NGTOS_MNGT_IPC_NOWAIT);
}

/**
 * 登录
 * @param array $param 登录信息数组
 * @return mixed 
 * 返回值说明：
 * 1)string 1000:1 1000代表初次使用，调转修改密码界面；1代表当前认证id，用于后续通信
 * 2)string 0:1    0代表已修改过默认密码或者未激活；1代表当前认证id，用于后续通信
 * 3)负数 认证错误信息，例如：-3016  
 */
function sendLogin($param) {
    $ret = ngtos_ipc_auth(NGTOS_MNGT_CFGD_PORT, M_TYPE_WEBUI, REQ_TYPE_AUTH, $param['type'], $param['helpmode'], $param['addr'], $param['name'], $param['passwd'], "", NGTOS_MNGT_IPC_NOWAIT);
    //超时计时清0
//    setcookie("idletime", 0);
    return $ret;
}

/**
 * 退出
 * @return int
 * 返回值说明：
 * 1)0 正常退出
 * 2)负数 错误信息
 */
function sendLogout() {
    if (!checkLogined()) {
        $ret = -1;
    } else {
        $ret = ngtos_ipc_comm(NGTOS_MNGT_CFGD_PORT, M_TYPE_WEBUI, REQ_TYPE_AUTH, AUTH_ID, REQ_TYPE_WEBUI_LOGOUT, "", "", NGTOS_MNGT_IPC_NOWAIT, 10);
        //超时计时清0
//        setcookie("idletime", 0);
    }
    return $ret;
}

/**
 * 兼容1130备份
 * @param int $auth_id 认证id
 * @param string $module 模块名称
 * @param string $action 操作名称
 * @param string $xml xml
 * @param int $operate 分页标识 0：全部数据；1：正常分页； 2：自主分页
 * @return string
 */
function getSaplingCmd_bk($auth_id, $module, $action, $xml, $operate = 0) {
    $param['page'] = ($_REQUEST['page']) ? intval($_REQUEST['page']) : 1;
    $param['rows'] = ($_REQUEST['rows']) ? intval($_REQUEST['rows']) : 20;

    //自组的分页需要特殊处理
    if (($module == "network session" && $action == "search") || ($module == "vpn tunnel" && $action == "showrange") || ($module == "network dynamicmac" && $action == "show")) {
        $param['rows'] = $param['rows'] + 1;
    }

    $head = '<?xml version="1.0" encoding="utf-8" standalone="no"?>';

    if ($operate == 0) {//请求全部数据
        $xml = '<request-list session="' . $auth_id . '" module="' . $module . '" action="' . $action . '" page="1" count="100000">' . $xml . ' </request-list>';
    } else if ($operate == 1) {//正常请求分页
        $xml = '<request-list session="' . $auth_id . '" module="' . $module . '" action="' . $action . '" page="' . $param['page'] . '" count="' . $param['rows'] . '">' . $xml . '</request-list>';
    } else if ($operate == 2) {
        $xml = '<request-list session="' . $auth_id . '" module="' . $module . '" action="' . $action . '" page="1" count="' . $param['rows'] . '">' . $xml . '</request-list>';
    }

    return $head . $xml;
}

/**
 * 2.0xml拼接函数
 * @param int $auth_id 认证id
 * @param string $module 模块名称
 * @param string $action 操作名称
 * @param string $xml xml
 * @param int $operate 分页标识 0：全部数据；1：正常分页； 2：自主分页
 * @return string
 */
function getSaplingCmd($auth_id, $module, $action, $xml, $operate = 0) {
    $param['page'] = ($_REQUEST['page']) ? intval($_REQUEST['page']) : 1;
    $param['rows'] = ($_REQUEST['rows']) ? intval($_REQUEST['rows']) : 20;

    //自组的分页需要特殊处理
    if (($module == "network session" && $action == "search") || ($module == "vpn tunnel" && $action == "showrange") || ($module == "network dynamicmac" && $action == "show")) {
        $param['rows'] = $param['rows'] + 1;
    }

    $head = '<?xml version="1.0" encoding="utf-8" standalone="no"?>';

    if ($operate == 0) {//请求全部数据
        $xml = '<request-list session="' . $auth_id . '" module="' . $module . '" action="' . $action . '">' . $xml . ' </request-list>';
    } else if ($operate == 1) {//正常请求分页
        $xml = '<request-list session="' . $auth_id . '" module="' . $module . '" action="' . $action . '" page="' . $param['page'] . '" rows="' . $param['rows'] . '">' . $xml . '</request-list>';
    } else if ($operate == 2) {//自主分页
        $xml = '<request-list session="' . $auth_id . '" module="' . $module . '" action="' . $action . '" page="1" rows="' . $param['rows'] . '">' . $xml . '</request-list>';
    }

//打印调试信息    
    $model = C('COMM_DEBUG');
    if ($model) {
        debugFile("\r\n send xml: \r\n" . $xml . "\r\n");
    }
    return $head . $xml;
}

/**
 * 下发配置
 * @param stirng $module 模块名称
 * @param string $action 操作名称
 * @param array $param   参数
 * @param int $error 是否去掉错误信息头部 1：不去掉；0：去掉
 * @return int|string 0：成功；字符串：错误信息
 */
function sendRequest($module, $action, $param, $error = 0) {
    $sendStr = getSaplingCmd(AUTH_ID, $module, $action, array2Xml($param));
    $ret = ngtos_ipc_comm(NGTOS_MNGT_CFGD_PORT, M_TYPE_WEBUI, REQ_TYPE_AUTH, AUTH_ID, REQ_TYPE_CMD, $sendStr, "", NGTOS_MNGT_IPC_NOWAIT, 21);
    //超时计时清0
    $dir = dirname($_SERVER['PHP_SELF']);
    if (substr($dir, -1) != '/') {
        $dir = $dir . '/';
    }

    /*
     * 如果返回-3016：管理员不存在，跳转到登录页，认为用户已被踢出或者服务器重启
     * 如果返回-3008：账号已锁定，跳转到登录页，认为用户已被踢出或者服务器重启
     */
    if ($ret < 0) {
        setcookie("commflag", $ret, NULL, $dir . AUTH_ID . '/', $currentCookieParams['domain'], true, NULL);
        if ($ret == -3016) {
            $msg = L('LOGIN_TIMEOUT_OFFLINE');
        } else if ($ret > -3000) {
            $msg = getErrorInfo($ret);
        } else {
            $msg = ngtos_ipc_manager_err2str($ret, 1);
        }
        setcookie("commmsg", $msg, NULL, $dir . AUTH_ID . '/', $currentCookieParams['domain'], true, NULL);
        return;
    }

    setcookie("idletime", 0, NULL, $dir . AUTH_ID . '/', $currentCookieParams['domain'], true, NULL);

//打印调试信息    
    $model = C('COMM_DEBUG');
    if ($model) {
        debugFile("\r\n recv xml: \r\n" . $ret . "\r\n");
    }

//如果返回错误信息，去除error -XXX头部
    if (!$error && substr($ret, 0, 5) == "error") {
        $ret = substr(strstr($ret, ":"), 1);
    }

//如果配置成功，cookie中增加save标志，触发闪烁效果
    if (is_numeric($ret) && $ret == 0) {
        if ($module == "save" && $action == "") {
            setcookie("saveFlag", 0, NULL, NULL, NULL, true, NULL);
        } else {
            setcookie("saveFlag", 1, NULL, NULL, NULL, true, NULL);
        }
    }
    return $ret;
}

/**
 * 单次配置下发的结果处理
 * @param array $config
 * $config格式说明：
 *     $config['modules'] = $module_name;   //模块名
 *     $config['action'] = "";              //操作名称
 *     $config['param']['__NA__if'] = $_POST['interface_name'];  //参数
 *     $config['param']['vsid'] = $_POST['vsid'];                //参数   
 *     $config['note'] = "vsid";            //错误信息自定义头部        
 * @return int|string 0：配置成功；字符串：配置失败的错误信息
 */
function sendRequestSingle($config) {
    $rspString = sendRequest($config['modules'], $config['action'], $config['param'], $config['error_prefix']);
//错误信息加上自定义头部
    if (!is_numeric($rspString) && $config['note']) {
        $rspString = $config['note'] . ":" . $rspString;
    }
    return $rspString;
}

/**
 * 多次配置下发的结果处理
 * @param array $config
 * $config格式说明：
 *     $config[$i]['modules'] = $module_name;   //模块名
 *     $config[$i]['action'] = "";              //操作名称
 *     $config[$i]['param']['__NA__if'] = $_POST['interface_name'];  //参数
 *     $config[$i]['param']['vsid'] = $_POST['vsid'];                //参数   
 *     $config[$i]['note'] = "vsid";            //错误信息自定义头部        
 * @return int|string 0：配置成功；字符串：配置失败，合并错误信息
 */
function sendRequestMultiple($config) {
    $ret = 0;
//如果传入数据为空，返回成功
    if (count($config) == 0) {
        return 0;
    }
    for ($i = 0; $i < count($config); $i++) {
        $rspString = sendRequest($config[$i]['modules'], $config[$i]['action'], $config[$i]['param'], 1);
        if (substr($rspString, 0, 5) == "error") {
            $ret = 1;
//获取错误码
            $num = trim(substr($rspString, 5, strpos($rspString, ":") - 5));
//获取自定义错误头部
            $note = array_key_exists('note', $config[$i]) ? $config[$i]['note'] : '';

//将错误录入$error错误数组
            if (!array_key_exists($num, $error)) {
//不存在
                $error[$num]['prefix'] = $note;
                $error[$num]['content'] = substr(strstr($rspString, ":"), 1);
            } else if (!empty($note) && $note != $error[$num]['prefix']) {
//已存在，合并错误头部
                $error[$num]['prefix'] = $error[$num]['prefix'] . ',' . $note;
            }
        }
    }

    if ($ret == 1) {
        foreach ($error as $value) {
            if ($value['prefix']) {
                $msg .= $value['prefix'] . ':' . $value['content'] . ";<br>";
            } else {
                $msg .= $value['content'] . ";<br>";
            }
        }
        return $msg;
    } else {
        return $ret;
    }
}

/**
 * 查询请求
 * @param string $module 模块名称
 * @param string $action 操作名称
 * @param array $param 参数数组
 * @param int $operate 标记，0：全部数据；1：正常分页； 2：自主分页
 * @return mixed 0：空数据；error -XXX：查询错误； xml字符串：有数据
 */
function getResponse($module, $action, $param, $operate = 0) {
    $sendStr = getSaplingCmd(AUTH_ID, $module, $action, array2Xml($param), $operate);
    $ret = ngtos_ipc_comm(NGTOS_MNGT_CFGD_PORT, M_TYPE_WEBUI, REQ_TYPE_AUTH, AUTH_ID, REQ_TYPE_CMD, $sendStr, "", NGTOS_MNGT_IPC_NOWAIT, 20);
    //超时计时清0
    $dir = dirname($_SERVER['PHP_SELF']);
    if (substr($dir, -1) != '/') {
        $dir = $dir . '/';
    }

    /*
     * 如果返回-3016：管理员不存在，跳转到登录页，认为用户已被踢出或者服务器重启
     * 如果返回-3008：账号已锁定，跳转到登录页，认为用户已被踢出或者服务器重启
     */
    if ($ret < 0) {
        setcookie("commflag", $ret, NULL, $dir . AUTH_ID . '/', $currentCookieParams['domain'], true, NULL);
        if ($ret == -3016) {
            $msg = L('LOGIN_TIMEOUT_OFFLINE');
        } else if ($ret > -3000) {
            $msg = getErrorInfo($ret);
        } else {
            $msg = ngtos_ipc_manager_err2str($ret, 1);
        }

        setcookie("commmsg", $msg, NULL, $dir . AUTH_ID . '/', $currentCookieParams['domain'], true, NULL);
        return;
    }

    setcookie("idletime", 0, NULL, $dir . AUTH_ID . '/', $currentCookieParams['domain'], true, NULL);

//打印调试信息    
    $model = C('COMM_DEBUG');
    if ($model) {
        debugFile("\r\n recv xml: \r\n" . $ret . "\r\n");
    }

    return $ret;
}

function parseResponse($ret) {
    if (is_numeric($ret)) {
        return $ret;
    } else if (substr($ret, 0, 5) == "error") {
        return substr(strstr($ret, ":"), 1);
    } else {
        return simpleXml2Array($ret);
    }
}

/**
 * 处理getResponse返回值，适用于datagrid情况
 * @param mixed $ret 0：空数据；error -XXX字符串：后台返回错误信息；xml型字符串：返回数据
 * @param int $json 1：返回json数据；0：返回数组
 * @return mixed 数组或者json
 */
function parseResponseDatagrid($ret, $json = 1) {
    if (is_numeric($ret)) {
        if ($ret == 0) {
//return '{"rows":[],"total":"0"}';
            $result['rows'] = array();
            $result['total'] = 0;
        } else if ($ret < 0) {
//通信错误返回错误字符串
            return getErrorInfo($ret);
        }
    } else if (substr($ret, 0, 5) == "error") {
        /**
         * 此处返回格式为字符串原因说明：
         * 1）当datagrid的url请求，在onLoadError事件处理错误信息
         *    onLoadError: function(data) {
         *        alert(data['responseText']);
         *    }
         * 2）当ajax请求，需指定dataType: 'json'，在error中处理错误信息
         *    error :function(data){
         *        alert(data['responseText']);
         *    }
         * 如若封装为数组格式，则只能在success逻辑中处理，逻辑上不太合理。
         */
        return substr(strstr($ret, ":"), 1);
    } else {
//xml转数组
        $array = simpleXml2Array($ret);
        $rows = $array['rows'];
//当只有一条记录时，json的rows内容也需要[]
        if (!isset($rows[0])) {
            $result['rows'][0] = $rows;
        } else {
            $result['rows'] = $rows;
        }
        $result['total'] = $array['total'];
    }
    if ($json == 0) {
        return $result;
    } else {
        return json_encode($result);
    }
}

/**
 * 功能：查询分页，将查询到的结果分页。
 * @param array $array 得到的总数据
 * @param int $page 当前页数
 * @param int $count 每页条数
 * @return array
 */
function getFilterResultLocal($array, $page, $count) {
    $new_array = array();
    $total_arr = $array;
//如果是多条会有group[0],单条没有有group[0]。需要特殊判断，否则条目计算会错误。
    if ($total_arr["rows"][0]) {
        $total = count($total_arr['rows']);
    } else {
        $total = 1;
    }
//总页数
    $totalpage = ceil($total / $count);
//需要显示的条目数
    if ($total < $count) {
        $time = $total;
    } else if ($page == $totalpage) {
        $time = $total - ($page - 1) * $count;
    } else {
        $time = $count;
    }
//从第几条开始显示
    $start = ($page - 1) * $count;
//循环rows的子条目
    foreach ($total_arr as $key => $value) {
        if ($key != 'rows') {
//如果不是rows节点，直接复制。
            $new_array[$key] = $value;
        } else if ($key == 'rows') {
//如果是rows节点。
            if ($array["rows"][0]) {
//如果是多条数据，从开始条目复制$time条。
                for ($i = 0; $i < $time; $i++) {
                    $new_array['rows'][$i] = $value[$start + $i];
                }
            } else {
//如果只有一条数据，直接复制。
                $new_array['rows'] = $value;
            }
        }
    }
    $new_array['total'] = $total;
    return $new_array;
}

function checkResponse() {
    $ret = checkAuth();
    if (is_numeric($ret) && $ret < 0) {
//通信出错
        $retArray['type'] = 1;
        if ($ret == -3016) {
            $retArray['info'] = "登录超时，请重新登录!";
        } else {
            $retArray['info'] = getErrorInfo($ret);
        }
    } else {
//通信正常
        $retArray['type'] = 0;
        $retArray['info'] = "ok";
    }
    return $retArray;
}

function checkAuth() {
    if (!checkLogined()) {
        header('location:' . $_COOKIE['urlorg']);
    }

//    if ($_SESSION['auth_id'] == "" || $_SESSION['auth_id'] == null) {
//        setcookie("commflag", -1, NULL, NULL, NULL, true, NULL);
//        setcookie("commmsg", getErrorInfo("-1"), NULL, NULL, NULL, true, NULL);
//        return -1;
//    }
    return ngtos_ipc_auth_check(NGTOS_MNGT_CFGD_PORT, M_TYPE_WEBUI, REQ_TYPE_AUTH, AUTH_ID, NGTOS_MNGT_IPC_NOWAIT);
}

function formatpost($post, $trim = true, $type = null) {
    if ($trim)
        $post = str_replace(" ", "", $post);
    //$post = str_replace("--Null--", "", $post);
    $post = str_replace(array(')',';','--','=','|','/'), "", $post);
    if (is_array($post))
        return $post;
    switch ($type) {
        case 'json':
            return $array = json_decode(trim(stripslashes(htmlspecialchars_decode($post))));
            break;
    }
    return trim(stripslashes(htmlspecialchars($post)));
}

function getValue($key, $str) {

    $arr = explode(" ", $str);
    for ($i = 0; $i < count($arr); $i++) {
        if ($arr[$i] == $key) {
            return $arr[$i + 1];
        }
    }
    return "";
}

function endSystem($url = "") {
    global $starttime, $DEBUG_ALL;

    $mtime = explode(' ', microtime());
    $endtime = $mtime[1] + $mtime[0];
    if ($url)
        $_SESSION['url'] = $url;
    if ($DEBUG_ALL)
        echo "Cost Time:" . ($endtime - $starttime) . "s</div>";
}

//获取数据表
function tablename($table, $time = '5minute') {
    $vsysid = intval(getVsid());
    $table_name = '';
    switch ($table) {
        case 'link':$table_name = get_table_prefix($time) . "link_flow_detail_vsys" . $vsysid . "_tb";
            break;
        case 'user':$table_name = get_table_prefix($time) . "user_flow_detail_vsys" . $vsysid . "_tb";
            break;
        case 'server':$table_name = get_table_prefix($time) . "server_flow_detail_vsys" . $vsysid . "_tb";
            break;
        case 'threat':$table_name = get_table_prefix($time) . "threat_flow_detail_vsys" . $vsysid . "_tb";
            break;
        case 'vpn':$table_name = "vpn_tunnel_flow_detail_vsys" . $vsysid . "_tb";
            break;
        case 'web':$table_name = "web_options";
            break;
        case 'log':$table_name = "mgmt_table";
            break;
    }
    return $table_name;
}

function get_table_prefix($date) {
    switch ($date) {
        case '5minute': $tableprefix = '';
            break;
        case 'hour': $tableprefix = '';
            break;
        case 'day': $tableprefix = 'hour_';
            break;
        case 'week': $tableprefix = 'day_';
            break;
        case 'month': $tableprefix = 'day_';
            break;
        case 'dayBefore': $tableprefix = 'hour_';
            break;
        case 'weekBefore': $tableprefix = 'day_';
            break;
        case 'monthBefore': $tableprefix = 'day_';
            break;
//        case 'user_defined':
//            $start_time = $_REQUEST['start_time'] ? trim($_REQUEST['start_time']) : '';
//            $end_time = $_REQUEST['end_time'] ? trim($_REQUEST['end_time']) : '';
//            $tableprefix = get_user_defined($start_time, $end_time) == '' ? '' : get_user_defined($start_time, $end_time) . '_';
//            break;
    }
    return $tableprefix;
}

function get_date_extent($date) {
    switch ($date) {
        case '5minute':
            $data_start = date("Y-m-d H:i:s", strtotime('-5 minute'));
            $data_end = date("Y-m-d H:i:s", strtotime('now'));
            $time_extent = "visittime >= '" . $data_start . "' and visittime <='" . $data_end . "'";
            break;
        case '30minute':
            $data_start = date("Y-m-d H:i:s", strtotime('-30 minute'));
            $data_end = date("Y-m-d H:i:s", strtotime('now'));
            $time_extent = "visittime >= '" . $data_start . "' and visittime <='" . $data_end . "'";
            break;
        case 'hour':
            $data_start = date("Y-m-d H:i:s", strtotime('-1 hour'));
            $data_end = date("Y-m-d H:i:s", strtotime('now'));
            $time_extent = "visittime >= '" . $data_start . "' and visittime <='" . $data_end . "'";
            break;
        case 'day':
            $data_start = date("Y-m-d H:i:s", strtotime('-23 hour'));
            $data_end = date("Y-m-d H:i:s", strtotime('-1 hour'));
            $time_extent = "visittime >= '" . $data_start . "' and visittime <='" . $data_end . "'";
            break;
        case 'week':
//            $data_start = date("Y-m-d H:i:s", strtotime('-6 day'));
//            $data_end = date("Y-m-d H:i:s", strtotime('-1 day'));
            $data_start = last_six_day(0, false);
            $data_end = last_end_day(0, false);
            $time_extent = "visittime >= '" . $data_start . "' and visittime <='" . $data_end . "'";
            break;
        case 'month':
//            $data_start = date("Y-m-d H:i:s", strtotime('-29 day'));
//            $data_end = date("Y-m-d H:i:s", strtotime('-1 day'));
            $data_start = last_twenty_nine_day(0, false);
            $data_end = last_end_day(0, false);
            $time_extent = "visittime >= '" . $data_start . "' and visittime <='" . $data_end . "'";
            break;
        case 'dayBefore':
            $time_extent = "visittime >= '" . last_first_day(0, false) . "' and visittime <='" . last_end_day(0, false) . "'";
            break;
        case 'weekBefore':
            $time_extent = "visittime >= '" . last_monday(0, false) . "' and visittime <= '" . last_sunday(0, false) . "'";
            break;
        case 'monthBefore':
            $time_extent = "visittime >= '" . lastmonth_firstday(0, false) . "' and visittime <= '" . lastmonth_lastday(0, false) . "'";
            break;
        case 'user_defined':
            $start_time = $_REQUEST['start_time'] ? trim($_REQUEST['start_time']) : '';
            $end_time = $_REQUEST['end_time'] ? trim($_REQUEST['end_time']) : date("Y-m-d");
            $time_extent = " visittime >= '" . $start_time . "' and visittime <= '" . $end_time . "' ";
            break;
    }
    return $time_extent;
}

//前29天
function last_twenty_nine_day($timestamp = 0, $is_return_timestamp = true) {
    static $cache;
    $id = $timestamp . $is_return_timestamp;
    if (!isset($cache[$id])) {
        if (!$timestamp)
            $timestamp = time();
        $firstday = date('Y-m-d H:i:s', mktime(0, 0, 0, date('m', $timestamp), date('d', $timestamp) - 29, date('Y', $timestamp)));
        if ($is_return_timestamp) {
            $cache[$id] = strtotime($firstday);
        } else {
            $cache[$id] = $firstday;
        }
    }
    return $cache[$id];
}

//前六天
function last_six_day($timestamp = 0, $is_return_timestamp = true) {
    static $cache;
    $id = $timestamp . $is_return_timestamp;
    if (!isset($cache[$id])) {
        if (!$timestamp)
            $timestamp = time();
        $firstday = date('Y-m-d H:i:s', mktime(0, 0, 0, date('m', $timestamp), date('d', $timestamp) - 6, date('Y', $timestamp)));
        if ($is_return_timestamp) {
            $cache[$id] = strtotime($firstday);
        } else {
            $cache[$id] = $firstday;
        }
    }
    return $cache[$id];
}

//前一天
function last_first_day($timestamp = 0, $is_return_timestamp = true) {
    static $cache;
    $id = $timestamp . $is_return_timestamp;
    if (!isset($cache[$id])) {
        if (!$timestamp)
            $timestamp = time();
        $firstday = date('Y-m-d H:i:s', mktime(0, 0, 0, date('m', $timestamp), date('d', $timestamp) - 1, date('Y', $timestamp)));
        if ($is_return_timestamp) {
            $cache[$id] = strtotime($firstday);
        } else {
            $cache[$id] = $firstday;
        }
    }
    return $cache[$id];
}

function last_end_day($timestamp = 0, $is_return_timestamp = true) {
    static $cache;
    $id = $timestamp . $is_return_timestamp;
    if (!isset($cache[$id])) {
        if (!$timestamp)
            $timestamp = time();
        $lastday = date('Y-m-d H:i:s', mktime(0, 0, 0, date('m', $timestamp), date('d', $timestamp), date('Y', $timestamp)));
        if ($is_return_timestamp) {
            $cache[$id] = strtotime($lastday);
        } else {
            $cache[$id] = $lastday;
        }
    }
    return $cache[$id];
}

/**
 * 上个星期的星期一
 * @staticvar array $cache
 * @param time $timestamp 某个星期的某一个时间戳，默认为当前时间
 * @param boolean $is_return_timestamp 是否返回时间戳，否则返回时间格式
 * @return array
 */
function last_monday($timestamp = 0, $is_return_timestamp = true) {
    static $cache;
    $id = $timestamp . $is_return_timestamp;
    if (!isset($cache[$id])) {
        if (!$timestamp)
            $timestamp = time();
        $thismonday = date("Y-m-d H:i:s", mktime(0, 0, 0, date("m", $timestamp), date("d", $timestamp) - date("w", $timestamp) + 1 - 7, date("Y", $timestamp)));
        if (!$is_return_timestamp) {
            $cache[$id] = $thismonday;
        } else {
            $cache[$id] = strtotime($thismonday);
        }
    }
    return $cache[$id];
}

/**
 * 上个星期的星期天
 * @staticvar array $cache
 * @param time $timestamp 某个星期的某一个时间戳，默认为当前时间
 * @param boolean $is_return_timestamp 是否返回时间戳，否则返回时间格式
 * @return array
 */
function last_sunday($timestamp = 0, $is_return_timestamp = true) {
    static $cache;
    $id = $timestamp . $is_return_timestamp;
    if (!isset($cache[$id])) {
        if (!$timestamp)
            $timestamp = time();
        $thissunday = date("Y-m-d H:i:s", mktime(23, 59, 59, date("m", $timestamp), date("d", $timestamp) - date("w", $timestamp) + 7 - 7, date("Y", $timestamp)));
        if (!$is_return_timestamp) {
            $cache[$id] = $thissunday;
        } else {
            $cache[$id] = strtotime($thissunday);
        }
    }
    return $cache[$id];
}

/**
 * 上个月的第一天
 * @staticvar array $cache
 * @param time $timestamp 某个星期的某一个时间戳，默认为当前时间
 * @param boolean $is_return_timestamp 是否返回时间戳，否则返回时间格式
 * @return array
 */
function lastmonth_firstday($timestamp = 0, $is_return_timestamp = true) {
    static $cache;
    $id = $timestamp . $is_return_timestamp;
    if (!isset($cache[$id])) {
        if (!$timestamp)
            $timestamp = time();
        $firstday = date('Y-m-d H:i:s', mktime(0, 0, 0, date('m', $timestamp) - 1, 1, date('Y', $timestamp)));
        if ($is_return_timestamp) {
            $cache[$id] = strtotime($firstday);
        } else {
            $cache[$id] = $firstday;
        }
    }
    return $cache[$id];
}

/**
 * 上个月的最后一天
 * @staticvar array $cache
 * @param time $timestamp 某个星期的某一个时间戳，默认为当前时间
 * @param boolean $is_return_timestamp 是否返回时间戳，否则返回时间格式
 * @return array
 */
function lastmonth_lastday($timestamp = 0, $is_return_timestamp = true) {
    static $cache;
    $id = $timestamp . $is_return_timestamp;
    if (!isset($cache[$id])) {
        if (!$timestamp)
            $timestamp = time();
        $lastday = date("Y-m-d H:i:s", mktime(23, 59, 59, date("m", $timestamp), 0, date("Y", $timestamp)));
        if ($is_return_timestamp) {
            $cache[$id] = strtotime($lastday);
        } else {
            $cache[$id] = $lastday;
        }
    }
    return $cache[$id];
}

function to_ipv6($ip3, $ip2, $ip1, $ip0) {
//func_get_args — 返回一个包含函数参数列表的数组
    $args = func_get_args();
    $tmp = '';
    foreach ($args as $key => $value) {
//str_pad() 函数把字符串填充为指定的长度。
//dechex() 函数把十进制转换为十六进制。
        $tmp .= str_pad(dechex($value), 8, '0', STR_PAD_LEFT);
    }
    $strarr = str_split($tmp, 4);
    $ip = implode(':', $strarr);
    return $ip;
}

/**
 * 通过$userid获取用户名称
 * @param int $userid 用户id
 * @return string 用户名称
 */
function get_user_name_by_id($userid) {
    if (empty($userid) || $userid == null) {
        return '未认证';
    }
    $param['key-word'] = 'id';
    $param['key-value'] = $userid;
    $rspString = getResponse("user manage user", "search page", $param, 3);
    if (strstr($rspString, 'error') || $rspString == 0) {
        return $userid;
    } else {
        return $rspString['response-list']['group']['name'];
    }
}

/**
 * 通过用户组id获取用户组名称
 * @param int $groupid 用户组id
 * @return string 用户组名称
 */
function get_user_group_by_id($groupid) {
    if (empty($groupid) || $groupid == 0) {
        return '未知';
    }
    $param['key-word'] = 'id';
    $param['key-value'] = $groupid;
    $rspString = getResponse("user manage group", "search page", $param, 4);
    if (strstr($rspString, 'error') || $rspString == 0) {
        return $groupid;
    } else {
        return $rspString['response-list']['group']['name'];
    }
}

//参数：字节 时间
//结果：速率单位
function get_unit_interface_name($size, $time) {
    $it = 5;
    if ($time == '5minute' || $time == '30minute' || $time == 'hour' || $time == 'minute') {
        $it = 5;
    } elseif ($time == 'day' || $time == 'dayBefore') {
        $it = 3600;
    } elseif ($time == 'week' || $time == 'weekBefore') {
        $it = 86400;
    } elseif ($time == 'month' || $time == 'monthBefore') {
        $it = 86400;
    } else {
        if ($time == ' ') {
            $it = 5;
        } elseif ($time == 'hour_') {
            $it = 3600;
        } else {
            $it = 86400;
        }
    }
    $pos = 0;
    $unit = array('bps', 'Kbps', 'Mbps', 'Gbps', 'Tbps');
    while ($size >= 1024 && $pos <= 4) {
        $size = $size * 8 / $it / 1024;
        $pos++;
    }
    return $unit[$pos];
}

function format_flow_data_sl($size, $unit, $time = 5) {
    $it = 5;
    if ($time == '5minute' || $time == '30minute' || $time == 'hour' || $time == 'minute') {
        $it = 5;
    } elseif ($time == 'day' || $time == 'dayBefore') {
        $it = 3600;
    } elseif ($time == 'week' || $time == 'weekBefore') {
        $it = 86400;
    } elseif ($time == 'month' || $time == 'monthBefore') {
        $it = 86400;
    } else {
        if ($time == ' ') {
            $it = 5;
        } elseif ($time == 'hour_') {
            $it = 3600;
        } else {
            $it = 2592000;
        }
    }

    switch ($unit) {
        case 'bps':
            $data = $size * 8 / $it;
            break;
        case 'Kbps':
            $data = $size * 8 / $it / 1024;
            break;
        case 'Mbps':
            $data = $size * 8 / $it / 1024 / 1024;
            break;
        case 'Gbps':
            $data = $size * 8 / $it / 1024 / 1024 / 1024;
            break;
        case 'Tbps':
            $data = $size * 8 / $it / 1024 / 1024 / 1024 / 1024;
            break;
    }
    return is_float($data) ? round($data, 2) : $data;
}

function get_flow_unit_sl($size) {
    $pos = 0;
    $unit = array('bps', 'Kbps', 'Mbps', 'Gbps', 'Tbps');
    while ($size >= 1024 && $pos <= 4) {
        $size /= 1024;
        $pos++;
    }
    return $unit[$pos];
}

function get_user_defined($start_time, $end_time) {
    $start_time_arr = explode(" ", $start_time);
    $start_time_ymd = explode("-", $start_time_arr[0]);
    $start_time_his = explode(":", $start_time_arr[1]);

    $end_time_arr = explode(" ", $end_time);
    $end_time_ymd = explode("-", $end_time_arr[0]);
    $end_time_his = explode(":", $end_time_arr[1]);

    $str = '';
    $today = date("Y");

    if ($start_time_arr[0] == $end_time_arr[0]) {
        if ($start_time_his[0] == $end_time_his[0] && ($end_time_his[0] - $start_time_his[0]) == 0) {//''
            $str .= '';
        } else if (($end_time_his[0] - $start_time_his[0]) == 1) {//''
            $str .= '';
        } else if (($end_time_his[0] - $start_time_his[0]) > 1) {//'minute_'
            $str .= 'minute';
        }
    } else if ($start_time_arr[0] !== $end_time_arr[0]) {
        if ($start_time_ymd[0] == $end_time_ymd[0] && $start_time_ymd[1] == $end_time_ymd[1] && $start_time_ymd[2] !== $end_time_ymd[2]) {//年月等日不等
            if (($today - $end_time_ymd[0]) == 0) {//2015
                if (($end_time_ymd[2] - $start_time_ymd[2]) == 1 && $start_time_his[0] == 0 && $end_time_his[0] == 1) {//日相差一个小时（前一天00点第二天01点）
                    if ($start_time_his[1] < $end_time_his[1]) {
                        $str .= 'minute';
                    } else {
                        $str .= '';
                    }
                } else if (($end_time_ymd[2] - $start_time_ymd[2]) == 1 && $start_time_his[0] == 0 && $end_time_his[0] > 1) {//日相差多个小时
                    $str .= 'minute';
                } else if (($end_time_ymd[2] - $start_time_ymd[2]) > 1 && ($end_time_ymd[2] - $start_time_ymd[2]) < 7) {//日>1 && 日<7
                    $str .= 'minute';
                } else if (($end_time_ymd[2] - $start_time_ymd[2]) > 7) {//日>7
                    $str .= 'hour';
                }
            } else if (($today - $end_time_ymd[0]) >= 1 && ($end_time_ymd[0] - $start_time_ymd[0]) == 0) {//年不等--- <2015的某一年
                $str .= 'day';
            }
        }
    }
    return $str;
}

/**
 * 获取监控流量构成饼图的数据
 * @param  int $selectid   要选的id
 * @param  str $wherefield where条件
 * @param  str $time       时间段
 * @return json            返回柱状图数据
 */
function get_monitor_click_chart_data($selectid, $wherefield, $time, $limit) {
    $objtable = M(tablename('user', $time));
    $filed = "$selectid,upbytes,downbytes,sum(upbytes+downbytes) as totalbytes";
    $arr = array();
    if ($time == 'day') {
        $sql1 = "select $filed from " . tablename('user', 'hour') . " where $wherefield and " . get_date_extent("hour") . " group by $selectid";
        $sql2 = "select $filed from " . tablename('user', $time) . " where $wherefield and " . get_date_extent($time) . " group by $selectid";
        $arr = $objtable->query("select $filed from (($sql1) union ($sql2))t group by $selectid order by totalbytes desc limit $limit");
    } else if ($time == 'week' || $time == 'month') {
        $sql1 = "select $filed from " . tablename('user', 'hour') . " where $wherefield and " . get_date_extent("hour") . " group by $selectid";
        $sql2 = "select $filed from " . tablename('user', 'day') . " where $wherefield and " . get_date_extent("day") . " group by $selectid";
        $sql3 = "select $filed from " . tablename('user', $time) . " where $wherefield and " . get_date_extent($time) . " group by $selectid";
        $arr = $objtable->query("select $filed from (($sql1) union ($sql2) union ($sql3))t group by $selectid order by totalbytes desc limit $limit");
    } else {
        $arr = $objtable->field($filed)->where(get_date_extent($time) . " and $wherefield ")->group($selectid)->order('totalbytes desc')->limit($limit)->select();
    }

    $unit = 'KB';
    if ($arr) {
        for ($i = 0; $i <= count($arr) - 1; $i++) {
            if ($i == 0) {
                $unit = get_flow_unit($arr[$i]['totalbytes']);
            }
            $arr_userid [] = $arr[$i]['userid'];
            $arr_total [] = $arr[$i]['totalbytes'];
            $arr_tmp = array_combine($arr_userid, $arr_total);
        }
        arsort($arr_tmp);
        $categoryList = array();
        $series = array();
        foreach ($arr_tmp as $k => $v) {
            switch ($selectid) {
                case 'userid': $categoryList[] = get_user_name_by_id($k);
                    break;
                case 'groupid': $categoryList[] = get_user_group_by_id($k);
                    break;
                case 'appid': $categoryList[] = get_user_name_by_id($k); //来自session信息
                    break;
            }
//            $categoryList[]=$k;
            $series[] = $v;
        }
        $data['category'] = $categoryList;
        $data['series'] = $series;
        $data['unit'] = $unit;
        echo json_encode($data);
    } else {
        echo "no data";
    }
}

function showError($message, $alert = 0) {
    if ($DEBUG_SWITCH) {
        echo debugWindow("<div  class='debug_msg'><h1>Send Message</h1>" . htmlspecialchars($sendMsg) . "<br><h1>Response Message</h1>" . htmlspecialchars($reg_msg) . "</div>");
        return;
    }

    if ($message == null) {
        return $messgae = "\"系统错误,无返回消息\"";
    }

    if ($alert) {
        echo "<script>alert('$message')</script>";
        return;
    }
    return $message;
}
//log日志以前引
/*function getPageAttr($isPage = true) {
    $page = Array();
    $page['page'] = $_REQUEST['page'] ? $_REQUEST['page'] : 1;
    $page['rows'] = $_REQUEST['rows'] ? $_REQUEST['rows'] : 20;
    return $page;
}*/

function _generateJsLanguageFile() {
    if (C("LANG_SWITCH_ON")) {
        $jsLangFilePath = "./Public/lang";
        $langList = L();
        $jsLangFileName = $jsLangFilePath . "/" . LANG_SET . ".js";
        @unlink($jsLangFileName); //测试，不永久缓存语言包
//已存在语言包  
        if (is_file($jsLangFileName)) {
            return;
        }
        $str = "var \$LANG={";
        $total = count($langList);
        $k = 1;
        foreach ($langList as $key => $value) {
            $str .=$key . ":\"" . $value . "\"";
            if ($k < $total) {
                $str .=",";
            }
            $k++;
        }
        if (!empty($str)) {
            $str .= "}";
            $file_handel = fopen($jsLangFileName, "w+"); //打开文件，重写模式
            fwrite($file_handel, $str);
            fclose($file_handel);
        }
    }
}

function formatReToArr($arr) {
    if (!$arr[0]) {
        $retarr[0] = $arr;
    } else
        $retarr = $arr;
    return $retarr;
}

function initTimeout() {
//获取超时时间
//    $time = ngtos_mngt_get_timeout();
//    if ($time >= 0) {
//        return $time;
//    } else {
    $rspString = getResponse("system webui", "show", "", 0);
    $array = parseResponse($rspString);
    if (is_array($array)) {
        return $array['timout_webui'];
    } else {
        return -1;
    }
//    }
}

function initAI() {
    if (getLicense(0, "AISE") == 1 && getLicense(0, "STAT") == 1) {
//            $all_app = getResponse("ai rule all_application", "show", "", 0);
//            
//            foreach ($all_app as $value) {
//                $newKey = trim($value['App-IDs']);
//                $_SESSION['all_app'][$newKey] = $value;
//            }
//
//            $all_pro = getResponse("ai rule all_protocol", "show", "", 4);
//            foreach ($all_pro['response-list']['group'] as $value) {
//                $newKey = trim($value['Pro-IDs']);
//                $_SESSION['all_pro'][$newKey] = $value;
//            }
    }
}

/**
 * 根据错误号，返回错误信息
 * @param int $id 错误号
 * @param string $default 用户自定义错误信息
 * @return string 错误信息
 */
function getErrorInfo($id, $default) {
    require APP_PATH . 'Home/Conf/message.php';
    foreach ($errorinfo as $key => $value) {
        if ($id == $value['id']) {
            return $value['text'];
        }
    }
    if ($default == null || $default == "") {
        //默认值
        return L('UNKNOW_ERR');
    } else {
        return $default;
    }
}

/*
 * 导出Excel表格
 * @param string  $fileName  文件名称
 * @param array   $headerArr 表头
 * @param array   $data      导出的数据
 * @param string  $title     文档标题
 * */

function getExcel($fileName, $headArr, $data, $title) {

    //对数据进行检验
//    if(empty($data) || !is_array($data)){
//        die("data must be a array");
//    }
    //检查文件名
    if (empty($fileName)) {
        exit;
    }

    //创建PHPExcel对象，注意，不能少了\
    $objPHPExcel = new \PHPExcel();
    $objProps = $objPHPExcel->getProperties();

    //设置表头
    $key = ord("A");
    foreach ($headArr as $v) {
        $colum = chr($key);
        $objPHPExcel->setActiveSheetIndex(0)->setCellValue($colum . '1', $v);
        $key += 1;
    }

    $column = 2;
    $objActSheet = $objPHPExcel->getActiveSheet();

    //重命名表
    $objActSheet->setTitle($title);

    //设置任意一行行高（通过getRowDimension（1）获取），这里是设置第一行
    $objActSheet->getRowDimension('1')->setRowHeight(18);
    $objActSheet->getDefaultStyle()->getFont()->setSize(12)->setName('宋体')->setBold(false);

    //行写入
    foreach ($data as $key => $rows) {
        $span = ord("A");
        $objActSheet->getRowDimension($column)->setRowHeight(20); //设置任意一行行高，参数$column
        //设置水平垂直样式
        $objActSheet->getStyle($column)->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_LEFT);
        $objActSheet->getStyle($column)->getAlignment()->setVertical(PHPExcel_Style_Alignment::VERTICAL_CENTER);

        // 列写入
        foreach ($rows as $keyName => $value) {
            $j = chr($span);
            $objActSheet->setCellValue($j . $column, $value);
            $objActSheet->getColumnDimension($j)->setWidth(20);
            $span++;
        }
        $column++;
    }

    $fileName = iconv("utf-8", "gb2312", $fileName);

    //设置活动单指数到第一个表,所以Excel打开这是第一个表
    $objPHPExcel->setActiveSheetIndex(0);
    header('Content-Type: application/vnd.ms-excel');
    header("Content-Disposition: attachment;filename=\"$fileName\"");
    header('Cache-Control: max-age=0');

    //多浏览器下兼容中文标题
    $encoded_filename = urlencode($fileName);
    $ua = $_SERVER["HTTP_USER_AGENT"];
    if (preg_match("/MSIE/", $ua)) {
        header('Content-Disposition: attachment; filename="' . $encoded_filename . '"');
    } else if (preg_match("/Firefox/", $ua)) {
        header('Content-Disposition: attachment; filename*="utf8\'\'' . $fileName . '"');
    } else {
        header('Content-Disposition: attachment; filename="' . $fileName . '"');
    }

    header("Content-Transfer-Encoding:binary");

    $objWriter = \PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');

    //文件通过浏览器下载
    $objWriter->save('php://output');
    exit;
}

//校验url合法性，是否真实登录
function checkLogined() {
    //获得cookie中的key
    $key = $_COOKIE['loginkey'];
//        debugFile($key);
    //获得url请求中的authid
//    $authid = $_GET['authid'];
//        debugFile($authid);
    //检查session中是否存在改authid和key
    if (!empty($key) && $key == $_SESSION['auth_id'][AUTH_ID]) {
        return true;
    } else {
        return false;
    }
}

/*
 * 比较ip是否是同一网段（支持ipv4、ipv6） 
 */

function cmpIp($ip1, $ip2, $type) {
    if ($type == 'ipv6') {
        $ret = cmpIpv6($ip1, $ip2);
    } else {
        $ret = cmpIpv4($ip1, $ip2);
    }
    return $ret;
}

/*
 * 比较ipv4是否同一网段
 */

function cmpIpv4($ip1, $ip2) {
    //掩码不同，网段不同
    $ipArr1 = explode('/', $ip1);
    $ipArr2 = explode('/', $ip2);
    if ($ipArr1[1] != $ipArr2[1]) {
        return false;
    }

    //比较ip和掩码的与值是否相同
    $ip = new ipv4Info();
    $rs1 = $ip->getIpInfo($ip1);
    $rs2 = $ip->getIpInfo($ip2);

    if ($rs1['bin']['net'] == $rs2['bin']['net']) {
        return true;
    } else {
        return false;
    }
}

class ipv4Info {

    //根据给定的IP字串获取IP信息
    public function getIpInfo($ipStr) {
        if (!$this->valid($ipStr)) {
            return false;
        }
        $ipArr = explode('/', $ipStr);

        //检查掩码是数字表示还是点分表示
        $point_index = strpos($ipArr[1], '.');
        if ($point_index !== false) {
            $mask = $this->ip2num($ipArr[1]);
        } else {
            $mask = $ipArr[1];
        }

        $info['bin']['mask'] = $this->getSubnetMask($mask);
        $info['bin']['net'] = $this->ip2bin($ipArr[0]) & $info['bin']['mask'];
        return $info;
    }

    //验证IP字串格式有效性 10.0.0.1/24
    private function valid($ipStr) {
        if (preg_match("/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\/\d{1,2}$/", $ipStr)) {
            return true;
        } else {
            return false;
        }
    }

    //获取二进制
    private function get_bin($number) {
        return str_pad(decbin($number), 8, '0', STR_PAD_LEFT);
    }

    //IP地址转二进制
    private function ip2bin($ip) {
        $ip_octets = explode(".", $ip);
        unset($bin_sn);
        foreach ($ip_octets as $val) {
            $bin_sn[] = $this->get_bin($val);
        }
        return join(".", $bin_sn);
    }

    //获取子网掩码
    private function getSubnetMask($mask) {
        $maskStr = '';
        for ($i = 1; $i <= 32; $i++) {
            if ($i <= $mask) {
                $maskStr .= '1';
            } else {
                $maskStr .= '0';
            }
            if ($i % 8 == 0) {
                $maskStr .= '.';
            }
        }
        $maskStr = substr($maskStr, 0, -1);
        return $maskStr;
    }

    //掩码IP地址转数字
    private function ip2num($ip) {
        $mask = $this->ip2bin($ip);
        $len = strlen($mask);
        $j = 0;
        for ($i = 0; $i < $len; $i++) {
            if ($mask[$i] == 1) {
                $j++;
            }
        }
        return $j;
    }

}

/*
 * 比较ipv6是否同一网段
 */

function cmpIpv6($ip1, $ip2) {
    //掩码不同，网段不同
    $ipArr1 = explode('/', $ip1);
    $ipArr2 = explode('/', $ip2);
    if ($ipArr1[1] != $ipArr2[1]) {
        return false;
    }

    //比较ip和掩码的与值是否相同
    $ip = new ipv6Info();
    $rs1 = $ip->getIpInfo($ip1);
    $rs2 = $ip->getIpInfo($ip2);

    if ($rs1['bin']['net'] == $rs2['bin']['net']) {
        return true;
    } else {
        return false;
    }
}

class ipv6Info {

    //根据给定的IP字串获取IP信息
    public function getIpInfo($ipStr) {
        $ipArr = explode('/', $ipStr);
        //如果ip中存在::，用0补全
        $ip = $this->getWholeIp($ipArr[0]);
        //information
        $info['bin']['mask'] = $this->getSubnetMask($ipArr[1]);
        $info['bin']['net'] = $this->ip2bin($ip) & $info['bin']['mask'];

        return $info;
    }

    //获取二进制
    private function get_bin($number) {
        return str_pad(decbin(hexdec($number)), 16, '0', STR_PAD_LEFT);
    }

    //IP地址转二进制
    private function ip2bin($ip) {
        $ip_octets = explode(":", $ip);
        unset($bin_sn);
        foreach ($ip_octets as $val) {
            $bin_sn[] = $this->get_bin($val);
        }
        return join(":", $bin_sn);
    }

    //获取子网掩码
    private function getSubnetMask($mask) {
        $maskStr = '';
        for ($i = 1; $i <= 128; $i++) {
            if ($i <= $mask) {
                $maskStr .= '1';
            } else {
                $maskStr .= '0';
            }
            if ($i % 16 == 0) {
                $maskStr .= ':';
            }
        }
        $maskStr = substr($maskStr, 0, -1);
        return $maskStr;
    }

    //补充ip中省略的0
    private function getWholeIp($ip) {
        $ell_index = strpos($ip, '::');
        if ($ell_index !== false) {
            //存在省略::
            $len = strlen($ip);
            //判断::是否是在开头或者结尾
            if ($ell_index == 0) {
                //::在头部
                $tail = substr($ip, 2);
                $arr = explode(':', $tail);
                $zero_num = 8 - count($arr);
                $ip = str_replace('::', ':', $ip);
                $ip = $this->fillZero($zero_num) . $ip;
            } else if ($ell_index == $len - 2) {
                //::在尾部
                $head = substr($ip, 0, $len - 2);
                $arr = explode(':', $head);
                $zero_num = 8 - count($arr);
                $ip = str_replace('::', ':', $ip);
                $ip = $ip . $this->fillZero($zero_num);
            } else {
                //::在中间
                $arr = explode('::', $ip);
                $head_arr = explode(':', $arr[0]);
                $tail_arr = explode(':', $arr[1]);
                $zero_num = 8 - count($head_arr) - count($tail_arr);
                $ip = $arr[0] . ':' . $this->fillZero($zero_num) . ':' . $arr[1];
            }
        }
        return $ip;
    }

    //补充0:
    private function fillZero($num) {
        $ipStr = '';
        for ($i = 1; $i <= $num; $i++) {
            if ($i <= $num) {
                $ipStr .= '0:';
            }
        }
        $ipStr = substr($ipStr, 0, -1);
        return $ipStr;
    }

}
//url转义
function decodeUrl($fun) {
    $urlStr = $_REQUEST[$fun];
    if(strpos($urlStr,'+') || strpos($urlStr,'%') || strpos($urlStr,'#')) {
        //return urldecode($urlStr);
        $urlStr = urldecode($urlStr);
    }
    if(preg_match('/[`~!#$%^&*()+<>?=|\;]|(--)/',$urlStr)) {
        echo L('INPUT_IS_NOT_LEGAL');
        exit;
    }
    return $urlStr;
}
//easyui combotree组件查询函数。
function comboTree() {
    $parentNode = $_REQUEST['parentNode'];
    $pNodeArr = explode(',',$parentNode);   //以逗号分隔父节点。
    $action = $_REQUEST['act'] ? decodeUrl('act') : 'show';
    $tree = array();
    foreach($pNodeArr as $k => $v) {
        $temp = array();
        $sumArr = array();
        $tree[$k]['text'] = $v;         //父节点
        $modules = decodeUrl($v);       //模块命令，以父节点为key传送过来。多条以逗号分隔。
        //如果父节点有多条命令,则循环执行。如地址对象：'define host,define range,define subnet'
        if(strpos($modules, ',')) {
            $modArr = explode(',', $modules);
            foreach($modArr as $modVal) {
                $rspString = getResponse($modVal, $action, '', 0);
                if(is_numeric($rspString) || substr($rspString, 0, 5) == 'error') {
                    continue;   //如果查询失败或无数据，则跳过本次循环
                }
                $rspString = parseResponse($rspString);
                $rspArr = formatReToArr($rspString['rows']);
                foreach($rspArr as $item){
                    $temp[0]['id'] = $item['id'];
                    $temp[0]['text'] = $item['name'];
                    $sumArr = array_merge_recursive($sumArr,  $temp);
                }
            }
        } else {
            $rspString = getResponse($modules, $action, '', 0);
            if(is_numeric($rspString) || substr($rspString, 0, 5) == 'error') {
                continue;
            }
            $rspString = parseResponse($rspString);
            $rspArr = formatReToArr($rspString['rows']);
            foreach($rspArr as $item){
                $temp[0]['id'] = $item['id'];
                $temp[0]['text'] = $item['name'];
                $sumArr = array_merge_recursive($sumArr,  $temp);
            }
        }
        if(empty($sumArr)) {
            $tree[$k]['iconCls'] = 'tree-empty';
        } else {
            $tree[$k]['children'] = formatReToArr($sumArr);
        }
    }
    //因上面continue跳出无数据的循环，所以将无赋值的父节点删除(或添加空节点属性)。
    for($j = 0;$j<count($tree);$j++){
        if(!isset($tree[$j]['children'])){
            //$tree[$j]['iconCls'] = 'tree-empty';
            array_splice($tree,$j,1);
            $j--;
        }
    }
    echo json_encode($tree);

}
//禁用或启用选中项
function enableEdit(&$command) {
    //判断是否是rest模式（整个项目修改完成后删除判断）
    if($command) {
        $param['modules'] = $command['mod'][$_REQUEST['mod']];
        if($_REQUEST['act'] == 'null') {
            $param['action'] = '';
        } else {
            $param['action'] = $_REQUEST['act'] ? $command['action'][$_REQUEST['act']] : 'modify';
        }
    } else {
        $param['modules'] = decodeUrl('mod');
        if($_REQUEST['act'] == 'null') {
            $param['action'] = '';
        } else {
            $param['action'] = $_REQUEST['act'] ? decodeUrl('act'): 'modify';
        }
    }

    $operate = $_REQUEST['operate'] ? decodeUrl('operate') : 'enable';  //操作项。例：enable|__NA__xx|no
    $enable = decodeUrl('enable');      //禁用或启用。yes|no  shutdown等
    $parKey = decodeUrl('parKey');      //要操作的字段。id|name|接口名等
    $parVal = decodeUrl('parVal');      //要操作的值，可为多个。
    if(is_string($parVal) && strpos($parVal, '#')) {
        $parVal = explode('#',$parVal);
    }
    if(is_array($parVal) && count($parVal) == 1) {
        $parVal = $parVal[0];
    }
    if(is_array($parVal)) {
        foreach($parVal as $k => $v) {
            $mParam[$k]['modules'] = $param['modules'];
            $mParam[$k]['action'] = $param['action'];
            $mParam[$k]['param'][$parKey] = $v;
            $mParam[$k]['param'][$operate] = $enable;   //例如：enable yes|no或__NA__xx|no shutdown
        }
        echo sendRequestMultiple($mParam);
    } else {
        $param['param'][$parKey] = $parVal;
        $param['param'][$operate] = $enable;
        echo sendRequestSingle($param);
    }
}
//简单的操作单次
function simpleHandle(&$command) {
    //判断是否是rest模式（整个项目修改完成后删除判断）
    if($command) {
        $param['modules'] = $command['mod'][$_REQUEST['mod']];
        $param['action'] = $_REQUEST['act'] ? $command['action'][$_REQUEST['act']] : '';
    } else {
        $param['modules'] = decodeUrl('mod');
        $param['action'] = $_REQUEST['act'] ? decodeUrl('act') : '';
    }

    if($_REQUEST['param']) {
        $param['param'][$_REQUEST['parKey']] = decodeUrl('param');
    }
    echo sendRequestSingle($param);
}

//查询函数，多用于select多选框组件的数据查询。
function dataShow(&$command) {
    //判断是否是rest模式（整个项目修改完成后删除判断）
    if($command) {
        $modules = $command['mod'][$_REQUEST['mod']];
        $action = $_REQUEST['act'] ? $command['action'][$_REQUEST['act']] : 'show';
    } else {
        $modules = decodeUrl('mod');
        $action = $_REQUEST['act'] ? decodeUrl('act') : 'show';
    }

    $key = $_REQUEST['key'] ? decodeUrl('key') : false;
    if($_REQUEST['param']) {
        $param[$_REQUEST['parKey']] = decodeUrl('param');
    }
    if(strpos($modules, ',')) {     //多条命令
        $sumArr = array();
        $modArr = explode(',', $modules);
        foreach($modArr as $modVal) {
            $rspString = getResponse($modVal, $action, $param, 0);
            if(is_numeric($rspString) || substr($rspString, 0, 5) == 'error') {
                continue;   //如果查询失败或无数据，则跳过本次循环
            }
            $rspString = parseResponseDatagrid($rspString, 0);
            //如果前端指定了key。则只返回这个key字段值。否则全部返回。
            if($key) {
                foreach($rspString['rows'] as $k => $item){
                    $temp['rows'][$k][$key] = $item[$key];
                }
            } else {
                $temp = $rspString;
            }
            $sumArr = array_merge_recursive($sumArr, $temp);
        }
        if(empty($sumArr)) {
            $sumArr['rows'] = array();
        }
        echo json_encode($sumArr);
    } else {
        $result = getResponse($modules, $action, $param, 0);
        if(is_numeric($result) || substr($result, 0, 5) == 'error') {
            echo '{"rows":[]}';
            exit;
        }
        $result = parseResponseDatagrid($result,0);
        //如果前端指定了key。则只返回这个key字段值。否则全部返回。
        if($key) {
            $resList['rows'] = array();
            foreach($result['rows'] as $k => $item){
                $resList['rows'][$k][$key] = $item[$key];
            }
            echo json_encode($resList);
        } else {
            echo json_encode($result);
        }
    }
}

?>