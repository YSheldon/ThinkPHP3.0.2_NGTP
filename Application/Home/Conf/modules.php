<?php

/*
 * 默认模块
 */
$default = array(
    'SystemInfo',
    'DeviceState',
    'GuardInfo',
    'LinkFlow',
    'InterfaceState',
    "WebTerminal",
    "ConfigLog",
    'LoginLog'
);

/*
 * @interval:定时器，关闭模块时需要关闭;目前排序以$modules为准，还需要优化
 */
$modules = array(
    'SystemInfo' => array('text' => L('SYS_INFO')),
    'DeviceState' => array('text' => L('DEVICE_STATE'), 'interval' => 1),
    'GuardInfo' => array('text' => L('CLOUD_DETECTION')),
    'LinkFlow' => array('text' => L('LINK_TRAFFIC'), 'interval' => 1),
    'InterfaceState' => array('text' => L('INTERFACE_INFORMATION'), 'interval' => 1),
    'WebTerminal' => array('text' => L('CONSOLE')),
    'LoginLog' => array('text' => L('LOG_LOG')),
    'ConfigLog' => array('text' => L('CONFIGURATION_LOG')),
    'InterviewControl' => array('text' => L('ACCESS_CONTROL')),
);
?>