<?php
namespace Home\Controller\Policy;
use Home\Controller\CommonController;
class PfController extends CommonController {
	public function pf_show() {
        require_once APP_PATH . 'Home/Common/menupage.php';
		$this->display('/Default/policy_pf_show');
	}

    public function pfName() {
        $file = fopen("/tos/etc/pf.reg","r");
        $i=0;
        $name = array();
        while(!feof($file)) {
            $eNmae=fgets($file);
            if($eNmae!='') {
                $tNmae=explode(' ',$eNmae)[0];
                if(!strstr($tNmae,'#')) {
                    //liecene判断
                    if((trim($tNmae) != 'ipsecvpn' && trim($tNmae) != 'dhcp' && trim($tNmae) != 'snmp' && trim($tNmae) != 'ntp') || (trim($tNmae) == 'ipsecvpn' && getLicense(0,"IPSEC")) || (trim($tNmae) == 'dhcp' && getLicense(0,"DHCP_SERVER")) || (trim($tNmae) == 'snmp' && getLicense(0,"snmp") || (trim($tNmae) == 'ntp' && getLicense(0,"NTP")))){
                        $name[$i]['name']=$tNmae;
                        $i++;
                    }
                }
            }
        }
        fclose($file);
        echo json_encode($name);
    }
    //添加
    public function add() {
        parse_str(file_get_contents("php://input"),$addArr);
        if(empty($addArr['area'])) {
            unset($addArr['area']);
        }
        if(empty($addArr['addressname']) || $addArr['name'] == 'dhcp') {
            unset($addArr['addressname']);
        }
        if(empty($addArr['id'])) {
            unset($addArr['id']);
            $pfParam['action'] = 'add';
        } else {
            if($addArr['name'] == 'dhcp') $addArr['addressname'] = 'none';
            $pfParam['action'] = 'modify';
        }
        $pfParam['modules'] = 'pf service';
        $pfParam['param'] = $addArr;
        echo sendRequestSingle($pfParam);
    }
}
?>
