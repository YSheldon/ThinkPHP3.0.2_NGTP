<?php

$menu = array(
    'home' => array(
        'text' => L('HOME'),
        'url' => '?c=Index&a=home'
    ),
    'monitor' => array(
        'text' => L('MONITOR'),
        'childs' => array(
            //接口流量
            // 'interface_flow' => array(
            //     'text' => L('IF_FLOW'),
            //     'url' => '?c=Monitor/Interface&a=interface_flow',
            //     'img' => 'jk_jkll.png'
            // ),
            //连接信息
            "session" => array(
                'text' => L('SESSION_INFO'),
                'url' => '?c=System/Session&a=ipshow',
                'img' => '6'
            ),
            //在线用户
            'online_user_show' => array(
                'text' => L('ONLINE_USER'),
                'url' => '?c=Monitor/OnlineUser&a=online_user',
                'img' => '7'
            )
        )
    ),
    'policy' => array(
        'text' => L('SECURE_POLICY'),
        'childs' => array(
            //访问控制
            'firewall' => array(
                'text' => L('ACCESS_CONTROL'),
                'url' => '?c=Policy/Interview&a=control_show',
                'img' => '28',
                'childs' => ''
            ),
            //地址转换
            'nat' => array(
                'text' => L('NAT'),
                'url' => '',
                'img' => '2',
                'childs' => array(
                    'nat' => array(
                        'text' => 'NAT',
                        'url' => '?c=Policy/Nat&a=nat_show'
                    ),
                    'map64' => array(
                        'text' => 'NAT64',
                        'url' => '?c=Policy/Map64&a=map64_show'
                    ),
                    'map66' => array(
                        'text' => 'MAP66',
                        'url' => '?c=Policy/Map66&a=map66show'
                    ),
                )
            ),
            //本机服务
            'pf' => array(
                'text' => L('LOCAL_SERVICE'),
                'url' => '?c=Policy/Pf&a=pf_show',
                'img' => '3',
                'childs' => ''
            ),
            //ALG
            'alg' => array(
                'text' => 'ALG',
                'url' => '?c=Policy/Alg&a=show',
                'img' => '4',
                'childs' => ''
            ),
            //对象
            'define_object' => array(
                'text' => L('OBJECT'),
                'url' => '',
                'img' => '5',
                'childs' => array(
                    //区域
                    'area' => array(
                        'text' => L('REGION'),
                        'url' => '?c=Resource/Region&a=region_info'
                    ),
                    //地址
                    'address' => array(
                        'text' => L('ADDRESS'),
                        'url' => '?c=Resource/Address&a=address_info'
                    ),
                    //时间
                    'schedule' => array(
                        'text' => L('TIME'),
                        'url' => '?c=Resource/Time&a=time_info'
                    ),
                    //服务
                    'service' => array(
                        'text' => L('SERVICE'),
                        'url' => '?c=Resource/Service&a=service_info'
                    ),
                    //服务器
                    "server" => array(
                        'text' => L('SERVER'),
                        'url' => '?c=Resource/Server&a=show'
                    ),
                    //均衡器
                    'virtual_server' => array(
                        'text' => L('BALANCE'),
                        'url' => '?c=Resource/Balance&a=show'
                    )
                )
            ),
            //代理
            'proxy' => array(
                'text' => L('PROXY'),
                'url' => '',
                'img' => '29',
                'childs' => array(
                    //profile_http
                    'HTTP' => array(
                        'text' => 'HTTP',
                        'url' => '?c=Policy/HTTP&a=showdata'
                    ),
                    //profile_ftp
                    'FTP' => array(
                        'text' => 'FTP',
                        'url' => '?c=Policy/FTP&a=showdata'
                    ),
                    //profile_ssl
                    'SSL' => array(
                        'text' => 'SSL',
                        'url' => '?c=Policy/SSL&a=showdata'
                    ),
                    //profile_ldap
                    'LDAP' => array(
                        'text' => 'LDAP',
                        'url' => '?c=Policy/LDAP&a=showdata'
                    ),
                    //profile_radius
                    'RADIUS' => array(
                        'text' => 'RADIUS',
                        'url' => '?c=Policy/RADIUS&a=showdata'
                    ),
                    //profile_tacacs
                    'TACACS' => array(
                        'text' => 'TACACS+',
                        'url' => '?c=Policy/TACACS&a=showdata'
                    ),
                    //profile_proxy
                    'PROXY_POLICY' => array(
                        'text' => L('PROXY_POLICY'),
                        'url' => '?c=Policy/Proxy&a=showdata'
                    )
                )
            ),
        )
    ),
    'network' => array(
        'text' => L('NETWORK_MANAGE'),
        'childs' => array(
            //接口
            'interface' => array(
                'text' => L('INTERFACE'),
                'url' => '',
                'img' => '8',
                'childs' => array(
                    //物理接口
                    'interface' => array(
                        'text' => L('PHYSICS_IF'),
                        'url' => '?c=Network/Physics&a=show'
                    ),
                    //子接口
                    'macvif' => array(
                        'text' => L('SUBIF'),
                        'url' => '?c=Network/Macvif&a=show'
                    ),
                    //VLAN
                    'vlan' => array(
                        'text' => 'VLAN',
                        'url' => '?c=Network/Vlan&a=show'
                    ),
                    //虚拟线
                    'virtual_line' => array(
                        'text' => L('VLINE'),
                        'url' => '?c=Network/Virtualline&a=show'
                    ),
                    //聚合接口
                    'bond' => array(
                        'text' => L('BOND_IF'),
                        'url' => '?c=Network/Bond&a=show'
                    ),
                    //VR虚接口
                    'vr_veth' => array(
                        'text' => L('VR_VIF'),
                        'url' => '?c=Network/Vrveth&a=show'
                    ),
                    //接口联动
                    'suitstate' => array(
                        'text' => L('SUITSTATE'),
                        'url' => '?c=Network/Suitstate&a=show'
                    )
                )
            ),
            //路由
            'route' => array(
                'text' => L('ROUTE'),
                'url' => '',
                'img' => '9',
                'childs' => array(
                    //静态路由
                    array(
                        'text' => L('STATIC_ROUTE'),
                        'url' => '?c=Network/Route&a=route_show'
                    ),
                    //策略路由
                    array(
                        'text' => L('POLICY_ROUTE'),
                        'url' => '?c=Network/RoutePolicy&a=show'
                    ),
                    //isp路由
                    array(
                        'text' => L('ISP_ROUTE'),
                        'url' => '?c=Network/IspRoute&a=show'
                    )
                )
            ),
            //邻居
            'arp' => array(
                'text' => L('NEIGHBOUR'),
                'url' => '',
                'img' => '10',
                'childs' => array(
                    //ARP
                    array(
                        'text' => 'ARP',
                        'url' => '?c=Network/Arp&a=show',
                    ),
                    //NEIGH
                    array(
                        'text' => 'ND',
                        'url' => '?c=Network/Neighbour&a=show',
                    )
                )
            ),
            //MAC
            'mac' => array(
                'text' => 'MAC',
                'url' => '',
                'img' => '11',
                'childs' => array(
                    array(
                        'text' => L('STATIC_MAC'),
                        'url' => '?c=Network/Mac&a=show',
                    ),
                    array(
                        'text' => L('DYNAMIC_MAC'),
                        'url' => '?c=Network/DynamicMac&a=show',
                    )
                )
            ),
            //DHCP
            'dhcp' => array(
                'text' => 'DHCP',
                'url' => '?c=Network/DhcpServer&a=serverinfo',
                'img' => '12'
            ),
            //DHCPV6
            'dhcpv6' => array(
                'text' => 'DHCPv6',
                'url' => '?c=Network/Dhcpv6Server&a=serverinfov6',
                'img' => '13'
            ),
            //RADVD
            'radvd' => array(
                'text' => 'RADVD',
                'url' => '?c=Network/Radvd&a=show',
                'img' => '14'
            ),
            //GRE
            'gre' => array(
                'text' => 'GRE',
                'url' => '?c=Network/Gre&a=gre_info',
                'img' => '15'
            ),
            //智能DNS
//            'dns' => array(
//                'text' => 'DNS',
//                'url' => '?c=Network/Dns&a=dns_server_show',
//                'img' => 'wl_dns.png'
//            ),
            //链路探测
            'ipprobe' => array(
                'text' => L('LINK_PROBE'),
                'url' => '?c=Network/IpProbe&a=show',
                'img' => '16'
            )
        )
    ),
    'system' => array(
        'text' => L('SYS_MANAGE'),
        'childs' => array(
            'system_config' => array(
                'text' => L('SYS_SET'),
                'url' => '',
                'img' => '20',
                'childs' => array(
                    //系统信息
                    "info" => array(
                        'text' => L('SYS_INFO'),
                        'url' => '?c=System/Info&a=infoshow'
                    ),
                    //系统参数
                    "parameters" => array(
                        'text' => L('SYS_PARAMETER'),
                        'url' => '?c=System/Parameters&a=parameters_edit'
                    ),
                    //系统时间
                    "time" => array(
                        'text' => L('SYS_TIME'),
                        'url' => '?c=System/Time&a=system_time_edit'
                    ),
                    //系统诊断
                    "diagnose" => array(
                        'text' => L('SYS_DIAGNOSE'),
                        'url' => '?c=System/Diagnose&a=diagnose_show'
                    ),
                    //密码设置
                    "pwd" => array(
                        'text' => L('PWD_SET'),
                        'url' => '?c=System/Admin&a=pwd_set'
                    ),
                    //SNMP
                    'snmp' => array(
                        'text' => 'SNMP',
                        'url' => '?c=System/Snmp&a=snmp_show'
                    ),
                    //本机域名解析
//                    'hostDNS' => array(
//                        'text' => L('LOCAL_DNS'),
//                        'url' => '?c=System/HostDNS&a=hostDNS_show'
//                    ),
                    //本地服务设置
                    'serviceSet' => array(
                        'text' => L('LOCAL_SERVICE_SET'),
                        'url' => '?c=System/Service&a=set'
                    ),
                )
            ),
            //虚拟系统
            'system_virtual' => array(
                'text' => L('VSYSTEM'),
                'url' => '?c=System/Virtual&a=vsys_show',
                'img' => '21'
            ),
            //系统维护
            "maintain" => array(
                'text' => L('SYS_MAINTAIN'),
                'url' => '',
                'img' => '22',
                'childs' => array(
                    //配置维护
                    'config' => array(
                        'text' => L('CONFIG_UPDATE'),
                        'url' => '?c=System/Config&a=config_show'
                    ),
                    //设备状态上报配置
                    'guard' => array(
                        'text' => L('CLOUD_DETECTION'),
                        'url' => '?c=System/Guard&a=info_show'
                    ),
                    //固件维护
                    'upload' => array(
                        'text' => L('SYS_UPDATE'),
                        'url' => '?c=System/Upload&a=upload_file'
                    ),
                    //健康记录
                    'health' => array(
                        'text' => L('HEALTH_RECORD'),
                        'url' => '?c=System/Upload&a=health_export'
                    ),
                    //系统重启
                    'reboot' => array(
                        'text' => L('SYS_REBOOT'),
                        'url' => '?c=System/Upload&a=upload_reboot'
                    ),
                    //规则库升级
                    'rules' => array(
                        'text' => L('RULES_UPDATE'),
                        'url' => '?c=System/Rules&a=rulesupload'
                    ),
                    //license升级
                    'license' => array(
                        'text' => L('LICENSE_UPDATE'),
                        'url' => '?c=System/Upload&a=license_upload'
                    ),
                    //补丁包升级
                     'package' => array(
                        'text' => L('PACKAGE_UPDATE'),
                        'url' => '?c=System/Package&a=packageupload'
                    ),
                     //资源监控
                     'Resource' => array(

                        'text' => L('RESOURCE_MONITORING'),
                        'url' => '?c=System/Resource&a=resource_show'
                    )
                )
            ),
            //管理员
            'user_manage' => array(
                'text' => L('ADMIN'),
                'url' => '?c=System/Admin&a=admin_show',
                'img' => '23'
            ),
            //日志查看
             'journal' => array(
                'text' => L('LOG_SHOW'),
                'url' => '',
                'img' => '24',
                'childs' => array(
                    // 审计日志查看
                    'audti' =>array(
                        'text' => L('THE_AUDIT_LOG'),
                        'url' => '?c=System/Journal&a=audti_log_show'
                    ),
                    //系统日志查看
                    'system' =>array(
                        'text' => L('CHECK_SYSTEM_LOG'),
                        'url' => '?c=System/Journal&a=system_log_show'
                    ),
                    //策略日志日志
                    'policy' =>array(
                        'text' => L('POLICY_LOGGING_LOG'),
                        'url' => '?c=System/Journal&a=policy_log_show'
                    )
                )
            ),
//            'system_journal' => array(
//                'text' => L('CHECK_SYSTEM_LOG'),
//                'url' => '?c=System/Journal&a=system_log_show',
//                'img' => 'xt_rz.png'
//            ),
//            'policy_journal' => array(
//                'text' => L('POLICY_LOGGING_LOG'),
//                'url' => '?c=System/Journal&a=policy_log_show',
//                'img' => 'xt_rz.png'
//            ),
            //系统日志
            'log' => array(
                'text' => L('SYS_LOG'),
                'url' => '',
                'img' => '25',
                'childs' => array(
                    //日志查看
//                    array(
//                        'text' => L('LOG_SHOW'),
//                        'url' => '?c=System/Log&a=log_show'
//                    ),
                    //日志配置
                    'log_set'=>array(
                        'text' => L('LOG_CONFIG'),
                        'url' => '?c=System/Log&a=log_set'
                    ),
                    //日志服务器配置
                    'log_server'=>array(
                        'text' => L('LOG_SERVER'),
                        'url' => '?c=System/Log&a=logserver_set'
                    )
                )
            ),
            //告警
            'alarm' => array(
                'text' => L('ALARM'),
                'url' => '?c=Policy/Alarm&a=alarm_show',
                'img' => '26'
            ),
            'ha' => array(
                'text' => L('HA'),
                'img' => '27',
                'childs' => array(
                    //高可用性
                    'ha' => array(
                        'text' => L('HA'),
                        'url' => '?c=System/Ha&a=show',
                    ),
                    //链路备份
                    'link' => array(
                        'text' => L('LINK_BACKUP'),
                        'url' => '?c=System/LinkBack&a=linkshow',
                    )
                )
            )
        )
    ),
    'auth' => array(
        'text' => L('USER_MANAGE'),
        'childs' => array(
            //用户管理
            'user' => array(
                'text' => L('USER_MANAGE'),
                'url' => '?c=Auth/User&a=manageinfo',
                'img' => '17'
            ),
            //认证服务器
            "service" => array(
                'text' => L('AUTH_SERVER'),
                'url' => '?c=Auth/Server&a=server_info',
                'img' => '18'
            ),
            //门户配置
            "portal" => array(
                'text' => L('PORTAL_CONFIG'),
                'url' => '?c=Auth/Portal&a=portalinfo',
                'img' => '19'
            )
        )
    )
);
