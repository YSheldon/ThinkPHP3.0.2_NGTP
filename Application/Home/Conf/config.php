<?php

define('NGTOS_MNGT_CFGD_PORT', 4100);
define('M_TYPE_WEBUI', 6);
define('REQ_TYPE_AUTH', 5);
define('REQ_TYPE_CMD', 1);
define('REQ_TYPE_WEBUI_LOGOUT', 12);
define('NGTOS_MNGT_IPC_NOWAIT', 3600);

//define(ERROR_MNGT_IPC_BASE, -100);
//define(ERROR_MNGT_IPC_SYSERR, (ERROR_MNGT_IPC_BASE - 1));
//define(ERROR_MNGT_IPC_PARAM, (ERROR_MNGT_IPC_BASE - 2));
//define(ERROR_MNGT_IPC_TIMEOUT, (ERROR_MNGT_IPC_BASE - 3));
//define(ERROR_MNGT_IPC_RECV_MSG, (ERROR_MNGT_IPC_BASE - 4));
//define(ERROR_MNGT_IPC_MEM, (ERROR_MNGT_IPC_BASE - 5));
//define(ERROR_MNGT_IPC_SEND_MSG, (ERROR_MNGT_IPC_BASE - 6));
//define(ERROR_MNGT_IPC_MAPPING, (ERROR_MNGT_IPC_BASE - 7));
//admin_type
define('TOS_ADMIN_PRIVA_PREFAB', 0x01); //预置管理员
define('TOS_ADMIN_PRIVA_SUPERMAN', 0x02);
define('TOS_ADMIN_PRIVA_ADMIN', 0x04);
define('TOS_ADMIN_PRIVA_GRANTOR', 0x08);
define('TOS_ADMIN_PRIVA_AUDITOR', 0x10);
define('TOS_ADMIN_PRIVA_OPERATOR', 0x12);
define('TOS_ADMIN_PRIVA_VIRTUAL', 0x20);
define('TOS_ADMIN_PRIVA_CONFIG', 0x40);

return array(
//'配置项'=>'配置值'
//数据库配置信息
    'DB_TYPE' => 'mysql',
    'DB_HOST' => '127.0.0.1',
    'DB_NAME' => 'flow_stat_db',
    'DB_USER' => 'root',
    'DB_PWD' => 'topsec*talent',
    'DB_PORT' => 3306,
    'DB_CHARSET' => 'utf8',
    'DB_NGTOS_LOG' => 'mysql://root:topsec*talent@127.0.0.1:3306/ngtos_log_db#utf8',
    'DB_NGTOS' => 'mysql://root:topsec*talent@127.0.0.1:3306/ngtos#utf8',
    'DB_TOS_LOG' => 'mysql://root:topsec*talent@127.0.0.1:3306/tos_log_db#utf8',
//    'TMPL_DENY_FUNC_LIST' => '', // 模板引擎禁用函数
//    'LOAD_EXT_CONFIG' => 'zh',
    'COMM_DEBUG' => false, // Runtime目录记录通信过程中xml
    
    'LANG_SWITCH_ON' => true, //开启语言检测  
    'LANG_AUTO_DETECT' => true, // 自动侦测语言 开启多语言功能后有效
    'LANG_LIST'        => 'zh-cn,en-us', // 允许切换的语言列表 用逗号分隔
    'VAR_LANGUAGE'     => 'l', // 默认语言切换变量
    'CONTROLLER_LEVEL' => 2,    //控制器分层
);
