<?php
namespace Home\Controller\Policy;
use Think\Controller;
class ObjectController extends Controller {

    public function address() {
        $regValue='';
        $name_arr=explode(',',formatpost($_POST['name']));
        for($i=0;$i<count($name_arr);$i++) {
            $param['name']=$name_arr[$i];
            //search in host
            $rspString = getResponse( 'define host', "show" , $param, 0);
            if(is_numeric($rspString) && $rspString == 0) {
                //search in range
                $rspString = getResponse( 'define range', "show" , $param, 0);
                if(is_numeric($rspString) && $rspString == 0) {
                    //search in subnet
                    $rspString = getResponse( 'define subnet', "show" , $param, 0);
                    if(is_numeric($rspString) && $rspString == 0) {
                        //search in mac and address group,wait for liuruigang

                    } elseif(substr($rspString, 0, 5) != 'error') {
                        $list_arr = parseResponseDatagrid($rspString, 0);
                        $type=$list_arr['rows'][0]['family']==2?'ipv4':($list_arr['rows'][0]['family']==10?'ipv6':$list_arr['rows'][0]['family']);
                        $regValue.=$list_arr['rows'][0]['name'].' type subnet '.$type.' '.trim($list_arr['rows'][0]['ip']).'/'.trim($list_arr['rows'][0]['mask']).'<br>';
                        //echo $regValue;
                    } else {
                        $regValue= 'wrong'.$rspString;
                    }
                } elseif(substr($rspString, 0, 5) != 'error') {
                    $list_arr = parseResponseDatagrid($rspString, 0);
                    $type=$list_arr['rows'][0]['family']==2?'ipv4':($list_arr['rows'][0]['family']==10?'ipv6':$list_arr['rows'][0]['family']);
                    $regValue.=$list_arr['rows'][0]['name'].' type range '.$type.' '.str_replace(' ','-',trim($list_arr['rows'][0]['ip'])).'<br>';
                    //echo $regValue;
                } else {
                    $regValue= 'wrong'.$rspString;
                }
            } elseif(substr($rspString, 0, 5) != 'error') {
                $list_arr = parseResponseDatagrid($rspString, 0);
                $type=$list_arr['rows'][0]['family']==2?'ipv4':($list_arr['rows'][0]['family']==10?'ipv6':$list_arr['rows'][0]['family']);
                $regValue.=$list_arr['rows'][0]['name'].' type host '.$type.' '.trim($list_arr['rows'][0]['ipaddr']).'<br>';
                //echo $regValue;
            } else {
                $regValue= 'wrong'.$rspString;
            }
        }
        echo $regValue;
    }

    public function area() {
        $regValue='';
        $name_arr=explode(',',formatpost($_POST['name']));
        for($i=0;$i<count($name_arr);$i++) {
            $param['name']=$name_arr[$i];
            $rspString = getResponse( 'define area', "show" , $param, 0);
            if(is_numeric($rspString) && $rspString == 0) {

            } elseif(substr($rspString, 0, 5) != 'error') {
                $list_arr = parseResponseDatagrid($rspString, 0);
                $regValue.=$list_arr['rows'][0]['name'].' attribute '.$list_arr['rows'][0]['attribute'].' refered '.$list_arr['rows'][0]['refered'].'<br>';
            } else {
                $regValue= 'wrong'.$rspString;
            }
        }
        echo trim($regValue);
    }

    public function user() {
        $regValue='';
        $name_arr=explode(',',formatpost($_POST['name']));
        for($i=0;$i<count($name_arr);$i++) {
            $param['name']=$name_arr[$i];
            $rspString = getResponse( 'user manage user', "show" , $param, 0);
            if(is_numeric($rspString) && $rspString == 0) {
                //echo '';
            } elseif(substr($rspString, 0, 5) != 'error') {
                // $list_arr = array_values(getAssign($rspString, $json_el=true, $list=true)[0]);
                $list_arr = parseResponseDatagrid($rspString, 0);
                $regValue.=$list_arr['rows'][0]['name'].' '.$list_arr['rows'][0]['invalid'].' '.$list_arr['rows'][0]['type'];
                if($list_arr['rows'][0]['auth_server'] && $list_arr['rows'][0]['auth_server']!='null')
                    $regValue.=' '.trim($list_arr['rows'][0]['auth_server']);
                if($list_arr['rows'][0]['address_name']&& $list_arr['rows'][0]['address_name']!='null')
                    $regValue.=' '.trim($list_arr['rows'][0]['address_name']);
                if($list_arr['rows'][0]['area_name']&& $list_arr['rows'][0]['area_name']!='null')
                    $regValue.=' '.trim($list_arr['rows'][0]['area_name']);
                if($list_arr['rows'][0]['timer_name']&& $list_arr['rows'][0]['timer_name']!='null')
                    $regValue.=' '.trim($list_arr['rows'][0]['timer_name']).'<br>';
                //echo trim($regValue);
            } else {
                if(strstr($rspString,'100014')) {
                    //search in user group
                    $param=array();
//            $param['__NA__']='page';
//            $param['key-word']='name';
                    $param['key-value']=$name_arr[$i];
                    $rspString = getResponse( 'user manage group', "search page key-word name" , $param, 0);
                    if(is_numeric($rspString) && $rspString == 0) {
                        //echo '';
                    } elseif(substr($rspString, 0, 5) != 'error') {
                        $list_arr = parseResponseDatagrid($rspString, 0);
                        $regValue.=$list_arr['rows'][0]['name'];
                        if($list_arr['rows'][0]['mail'] && $list_arr['rows'][0]['mail']!='null')
                            $regValue.=' '.trim($list_arr['rows'][0]['mail']);
                        if($list_arr['rows'][0]['notice-url']&& $list_arr['rows'][0]['notice-url']!='null')
                            $regValue.=' '.trim($list_arr['rows'][0]['notice-url']);
                        if($list_arr['rows'][0]['max-users']&& $list_arr['rows'][0]['max-users']!='null')
                            $regValue.=' '.trim($list_arr['rows'][0]['max-users']);
                        if($list_arr['rows'][0]['total-users']&& $list_arr['rows'][0]['total-users']!='null')
                            $regValue.=' '.trim($list_arr['rows'][0]['total-users']);
                        if($list_arr['rows'][0]['total-users']&& $list_arr['rows'][0]['total-users']!='null')
                            $regValue.=' '.trim($list_arr['rows'][0]['total-users']);
                        if($list_arr['rows'][0]['total-users']&& $list_arr['rows'][0]['total-users']!='null')
                            $regValue.=' '.trim($list_arr['rows'][0]['total-users']).'<br>';
                        //echo trim($regValue);
                    } else {
                        $regValue= 'wrong'.$rspString;
                    }
                } else {
                    $regValue= 'wrong'.$rspString;
                }
            }
        }
        echo trim($regValue);
    }

    public function service() {
        $regValue='';
        $name_arr=explode(',',formatpost($_POST['name']));
        for($i=0;$i<count($name_arr);$i++) {
            $param['name']=$name_arr[$i];
            $rspString = getResponse( 'define service', "show type custom" , $param, 0);
            if(is_numeric($rspString) && $rspString == 0) {
                $rspString = getResponse( 'define service', "show type default" , $param, 0);
                if(is_numeric($rspString) && $rspString==0) {

                } elseif(substr($rspString, 0, 5) != 'error') {
                    $list_arr = parseResponseDatagrid($rspString, 0);
                    $regValue.=$list_arr['rows'][0]['name'].' protocol '.$list_arr['rows'][0]['protocol'].' '.$list_arr['rows'][0]['port'].'<br>';
                } else {
                    $regValue= 'wrong'.$rspString;
                }
            } elseif(substr($rspString, 0, 5) != 'error') {
                $list_arr = parseResponseDatagrid($rspString, 0);
                $protocol=($list_arr['rows'][0]['protocol']=='1')?'ICMP':(($list_arr['rows'][0]['protocol']=='6')?'TCP':(($list_arr['rows'][0]['protocol']=='17')?'UDP':'otherPro'));
                $regValue.=$list_arr['rows'][0]['name'].' protocol '.$protocol.' '.$list_arr['rows'][0]['port'].'<br>';
            } else {
                $regValue= 'wrong'.$rspString;
            }
        }
        echo trim($regValue);
    }

    public function schedule() {
        $regValue='';
        $name_arr=explode(',',formatpost($_POST['name']));
        for($i=0;$i<count($name_arr);$i++) {
            $param['name']=$name_arr[$i];
            $rspString = getResponse( 'define schedule', "show" , $param, 0);
            if(is_numeric($rspString) && $rspString == 0) {
                //search in schedule group ,wait for liuruigang
                //echo '';
            } elseif(substr($rspString, 0, 5) != 'error') {
                $list_arr = parseResponseDatagrid($rspString, 0);
                $regValue=$list_arr['rows'][0]['name'].' ';
                $type=$list_arr['rows'][0]['type'];
                if($type=='year') {
                    //single schedule
                    $regValue.=' '.trim($list_arr['rows'][0]['start']).'-'.trim($list_arr['rows'][0]['stop']);
                } elseif($type=='weekcyc') {
                    $weekdays=str_split($list_arr['rows'][0]['week__mon_year']);
                    for($i=0;$i<count($weekdays);$i++) {
                        if($weekdays[$i]==1)
                            $regValue.='Monday ';
                        else if($weekdays[$i]==2)
                            $regValue.='Tuesday ';
                        else if($weekdays[$i]==3)
                            $regValue.='Wednesday ';
                        if($weekdays[$i]==4)
                            $regValue.='Thursday ';
                        else if($weekdays[$i]==5)
                            $regValue.='Friday ';
                        else if($weekdays[$i]==6)
                            $regValue.='Saturday ';
                        else if($weekdays[$i]==7)
                            $regValue.='Sunday ';
                    }
                    $regValue.=' '.trim($list_arr['rows'][0]['start']).'-'.trim($list_arr['rows'][0]['stop']).'<br>';
                } elseif($type=='monthcyc') {
                    $regValue.=' '.$list_arr['rows'][0]['week__mon_year'].'days '.trim($list_arr['rows'][0]['start']).'-'.trim($list_arr['rows'][0]['stop']).'<br>';
                }
            } else {
                $regValue= 'wrong'.$rspString;
            }
        }
        echo $regValue;
    }

}

?>
