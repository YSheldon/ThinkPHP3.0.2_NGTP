//添加弹出框
	function addRow(){
		submint_content = 1;
		if ($('#add_page').length <= 0) {
				$(document.body).append("<div id='add_page' class='ngtos_window'></div>");
		}
		open_window('add_page', 'Network/StaticTunnel', 'addWindow', '添加', 'true');
	}

	function changeGmnegType(tag) {
		if (tag == 1) {
			$('#type_presharekey').attr('checked', 'checked');
			$('#negomode_main').attr('checked', 'checked');
			$('#gmneg_gm_zs').hide();
			$('#gmneg_gm_zswz').hide();
			$('#gmneg_gm_dfbz').hide();
			$('#gmneg_gm_xsms').hide();
			$('#SA_THREE0').show();
			var arr1 = [];
			arr1['3des'] = '3DES';
			arr1['aes'] = 'AES';
			arr1['des'] = 'DES';
			arr1['sm4'] = 'SM4';
			selectValue('SA_ONE0', arr1, 'aes');

			var arr2 = [];
			arr2['sha1'] = 'SHA1';
			arr2['md5'] = 'MD5';
			arr2['sm3'] = 'SM3';
			selectValue('SA_TWO0', arr2, 'md5');

			var arr3 = [];
			arr3['modp768'] = 'DH1';
			arr3['modp1024'] = 'DH2';
			arr3['modp1536'] = 'DH5';
			selectValue('SA_THREE0', arr3, 'modp768');

			var encrypt = [];
			encrypt['3des'] = '3DES';
			encrypt['aes128'] = 'AES128';
			encrypt['aes192'] = 'AES192';
			encrypt['aes256'] = 'AES256';
			encrypt['des'] = 'DES';
			encrypt['null'] = 'NULL';
			encrypt['sm4'] = 'SM4';
			selectValue('encrypt_type', encrypt, '3des');

			var verify = [];
			verify['sha1'] = 'SHA1';
			verify['md5'] = 'MD5';
			verify['sm3'] = 'SM3';
			selectValue('verify_type', verify, 'md5');

			$('#gmneg_authmode').show();
			$('#gmneg_presharekey').show();
			$('#gmneg_localid').show();
			$('#gmneg_peerid').show();
			$('#gmneg_negomode').show();
		}
		if (tag == 2) {
			$('#negomode_main').attr('checked', 'checked');
			$('#gmneg_gm_zs').show();
			$('#gmneg_gm_zswz').show();
			$('#gmneg_gm_dfbz').show();
			$('#gmneg_gm_xsms').show();
			$('#SA_THREE0').hide();
			var arr1 = [];
			arr1['sm4'] = 'SM4';
			selectValue('SA_ONE0', arr1, 'sm4');

			var arr2 = [];
			arr2['sha1'] = 'SHA1';
			arr2['sm3'] = 'SM3';
			selectValue('SA_TWO0', arr2, 'sm3');

			var encrypt = [];
			encrypt['sm4'] = 'SM4';
			selectValue('encrypt_type', encrypt, 'sm4');

			var verify = [];
			verify['sha1'] = 'SHA1';
			verify['sm3'] = 'SM3';
			selectValue('verify_type', verify, 'sm3');

			$('#gmneg_authmode').hide();
			$('#gmneg_presharekey').hide();
			$('#gmneg_localid').hide();
			$('#gmneg_peerid').hide();
			$('#gmneg_negomode').hide();
		}
	}

	function changePresharekey(tag) {

		if (tag == 1) {
			$('#gmneg_gm_zs').hide();
			$('#gmneg_gm_zswz').hide();
			$('#gmneg_gm_dfbz').hide();

			$('#gmneg_authmode').show();
			$('#gmneg_presharekey').show();
			$('#gmneg_localid').show();
			$('#gmneg_peerid').show();
			$('#gmneg_negomode').show();
		}
		if (tag == 2) {
			$('#gmneg_gm_zswz').show();
			$('#gmneg_gm_dfbz').show();

			$('#gmneg_localid').hide();
			$('#gmneg_peerid').hide();
			$('#gmneg_presharekey').hide();
		}
	}

	function selectValue(selectid, array, val){

		$("#" + selectid).empty();
		for (var key in array) {
			if (key == val) {
				$("#" + selectid).append("<option selected='selected' value='" + key + "'>" + array[key] + "</option>");
			} else {
				$("#" + selectid).append("<option value='" + key + "'>" + array[key] + "</option>");
			}
		}
	}

	function setToolBar(){

		var sel_row = $('#tt').datagrid('getChecked');
		if (sel_row.length < 1)
		{
			$('#icon_delete').linkbutton('disable');
			$('#icon_edit').linkbutton('disable');
			$('#icon_clone').linkbutton('disable');
			$('#icon_enable').linkbutton('disable');
			$('#icon_disable').linkbutton('disable');
		}
		else if (sel_row.length == 1)
		{
			$('#icon_delete').linkbutton('enable');
			$('#icon_edit').linkbutton('enable');
			$('#icon_clone').linkbutton('enable');
			$('#icon_enable').linkbutton('enable');
			$('#icon_disable').linkbutton('enable');
		}
		else if (sel_row.length > 1)
		{
			$('#icon_delete').linkbutton('enable');
			$('#icon_edit').linkbutton('disable');
			$('#icon_clone').linkbutton('disable');
			$('#icon_enable').linkbutton('disable');
			$('#icon_disable').linkbutton('disable');
		}
	}
//证书配置
	function setCertificatee(){

		if ($('#addExceptDivCert').length <= 0) {
		
			$(document.body).append("<div id='addExceptDivCert' class='ngtos_window'></div>");
		}
		open_window('addExceptDivCert', 'Network/StaticTunnel', 'addExceptDivCert', '添加', 'true');
	}

//证书配置提交
  function submitCert(){

		if ($('#addExceptDivCert').find(':radio[name="key_type"]:checked').val() == 'keyfile') {
		if ($('#addExceptDivCert').find('#cert_file').val() == '') {
			ngtosPopMessager("error", '未选择证书文件');
			return false;
		}
		if ($('#addExceptDivCert').find('#key').val() == '') {
			ngtosPopMessager("error", '未选择私钥文件');
			return false;
		}
		}
		if ($('#addExceptDivCert').find(':radio[name="key_type"]:checked').val() == 'pkcs12') {
			if ($('#addExceptDivCert').find('#cert_file').val() == '') {
				ngtosPopMessager("error", '未选择证书文件');
				return false;
			}
		}
		if ($('#addExceptDivCert').find(':radio[name="key_type"]:checked').val() == 'tarfile') {
			if ($('#addExceptDivCert').find('#cert_file').val() == '') {
				ngtosPopMessager("error", '未选择证书文件');
				return false;
			}
		}
		var upfile = [];
		if ($('#addExceptDivCert').find('#cert_file').val()) {
			upfile[0] = 'cert_file';
		}
		if ($('#addExceptDivCert').find('#key').val()) {
			upfile[1] = 'key';
		}
		$.ajaxFileUpload({
			url: '?c=Auth/Pki&a=certAdd',
			type: 'post',
			secureuri: false,
			fileElementId: upfile,
			dataType: 'text',
			data: {
				deposition_type: $('#localcert_id').val(),
				key_type: $('#addExceptDivCert').find(':radio[name="key_type"]:checked').val(),
				password: $('#addExceptDivCert').find('#password').val(),
				upfile: upfile
			},
			success: function(data, textstatus) {
				if (data.indexOf("parent.window.location") >= 0) {
					ngtosPopMessager("error", "登录超时，请重新登录!", '', "login");
				} else if (data == '0') {
					ngtosPopMessager("success", "证书配置成功");
					$("#addExceptDivCert").window("close");
				} else {
					ngtosPopMessager("error", data);
					$('#addExceptDivCert').find('#password').val('');
					$('#addExceptDivCert').find('#cert_filetxt').val('');
					$('#addExceptDivCert').find('#keytxt').val('');
					$("#addExceptDivCert").window("close");
				}
			}
		});
  }
//获取标识
	function getCertTag(){
		
		if ($('#addExceptDivTag').length <= 0) {
		
			$(document.body).append("<div id='addExceptDivTag' class='ngtos_window'></div>");
		}
		open_window('addExceptDivTag', 'Network/StaticTunnel', 'addExceptDivTag', '添加', 'true');
	}
//获取标识提交
	function submitCertTag(){
		
		if ($('#addExceptDivTag').find('#ca_cert').val() == '' || $('#addExceptDivTag').find('#ca_certtxt').val() == '') {
			ngtosPopMessager("info", '未选择证书文件');
			return false;
		}
		$.ajaxFileUpload({
			url: '?c=Network/StaticTunnel&a=getCertTag',
			type: 'post',
			secureuri: false,
			fileElementId: 'ca_cert',
			dataType: 'json',
			data: {
			},
			success: function(data) {
				if (data == 0 || data == 2) {
					$("#addExceptDivCert").window("close");
					ngtosPopMessager("error", data['info']);
					$('#addExceptDivTag').find('#ca_cert').val('');
					$('#addExceptDivTag').find('#ca_certtxt').val('');
				} else if (data == 1) {
					ngtosPopMessager("error", data['info'], '', "login");
				} else {
					$('#peerid').val(data['group'][0]['subject']);
					$("#addExceptDivTag").window("close");
				}
			}
		});
	}
//弹出框提交
	function submitAdd(){
		var tmp = '';
		if($(':radio[name="gmneg"]:checked').val() == 'gmneg_gj'){
			for (var j = 0 ; j <= isa ;j++){
				tmp += $('#SA_ONE'+j).val()+'-'+$('#SA_TWO'+j).val()+'-'+$('#SA_THREE'+j).val()+',';
			}
		}else{
		   for (var j = 0 ; j <= isa ;j++){
				tmp += $('#SA_ONE'+j).val()+'-'+$('#SA_TWO'+j).val()+',';
			}
		}
		$('#SA_ISAKMP').val(tmp);       
		if($('#add_page').find("#static_name").val()){
			//if ($('#add_page').find("#static_name").checkInput({cl: [ 'must', 'illlegchar']}) == false)
			//	return false;
		}else{
			ngtosPopMessager("info", "隧道名称不能为空");
			return false;
		}
		if ($(':radio[name="gmneg"]:checked').val() == 'gmneg_gj' && $(':radio[name="tunnel_authmode"]:checked').val() == 1) {
			if($('#add_page').find("#presharekey").val()){
			//	if ($('#add_page').find("#presharekey").checkInput({cl: ['must']}) == false)
			//		return false;
			}else{
				ngtosPopMessager("info", "预共享密钥不能为空");
				return false;
			}
		}else{
			if($('#add_page').find("#peerid").val()){
			//		if ($('#add_page').find("#peerid").checkInput({cl: ['must']}) == false)
			//		return false;
			}else{
				ngtosPopMessager("info", "对方标识不能为空");
				return false;
			}
		}
		var localnet = $('#add_page').find("#localnet").val();
		var peersubnet = $('#add_page').find("#peersubnet").val();
		//校验本地地址与对方地址
		if (localnet.indexOf(':') <= 0 && peersubnet.indexOf(':') <= 0) {
			if($('#add_page').find("#localnet").val()){
				//if ($('#add_page').find("#localnet").checkInput({cl: ['must', 'ip']}) == false)
				//	return false;
			}else{
				ngtosPopMessager("info", "本地地址不能为空");
				return false;
			}
			if($('#add_page').find("#peersubnet").val()){
				//if ($('#add_page').find("#peersubnet").checkInput({cl: ['must', 'ip']}) == false)
					//return false;
			}else{
				ngtosPopMessager("info", "对方地址不能为空");
				return false;
			}
		} else if (localnet.indexOf(':') > 0 && peersubnet.indexOf(':') > 0) {
			//if ($('#add_page').find("#localnet").checkInput({cl: ['notnull', 'must', 'singleIpvsix']}) == false)
			//	return false;
			//if ($('#add_page').find("#peersubnet").checkInput({cl: ['notnull', 'must', 'singleIpvsix']}) == false)
			//	return false;
		} else {
			ngtosPopMessager("error", "地址类型不一致");
			return false;
		}
		var network_localsub = $('#add_page').find("#network_localsub_cid").val();
		var network_localsub_mask = $('#add_page').find("#network_localsub_yid").val();
		var network_peersub = $('#add_page').find("#network_peersub_cid").val();
		var network_peersub_mask = $('#add_page').find("#network_peersub_yid").val();
		if (network_localsub.indexOf(':') <= 0 && network_peersub.indexOf(':') <= 0) {
			//同为IPv4-本地子网/掩码
			if (network_localsub) {
				//if ($('#add_page').find("#network_localsub_cid").checkInput({cl: ['ip']}) == false)
				//	return false;
			}
			if (network_localsub_mask.indexOf('.') >= 0) {
				if ($('#network_localsub_yid').val() != '') {
				//	if ($('#add_page').find("#network_localsub_yid").checkInput({cl: ['ip']}) == false)
				//		return false;
				}
			} else {
				if ($("#network_localsub_yid").val() != '') {
				//	if ($('#add_page').find("#network_localsub_yid").checkInput({cl: ['allown', 'range:0-32']}) == false)
				//		return false;
				}
			}
			//同为IPv4-对方子网/掩码
			if (network_peersub) {
				//if ($('#add_page').find("#network_peersub_cid").checkInput({cl: ['ip']}) == false)
				//	return false;
			}
			if (network_peersub_mask.indexOf('.') >= 0) {
				if ($('#network_peersub_yid').val() != '') {
				//	if ($('#add_page').find("#network_peersub_yid").checkInput({cl: ['ip']}) == false)
				//		return false;
				}
			} else {
				if ($('#network_peersub_yid').val() != '') {
				//	if ($('#add_page').find("#network_peersub_yid").checkInput({cl: ['allown', 'range:0-32']}) == false)
				//		return false;
				}
			}
		} else if (network_localsub.indexOf(':') > 0 && network_peersub.indexOf(':') > 0) {
			//同为IPv6-本地子网/掩码
			if (network_localsub) {
			//	if ($('#add_page').find("#network_localsub_cid").checkInput({cl: ['singleIpvsix']}) == false)
			//		return false;
			}
			if (network_localsub_mask.indexOf('.') > 0) {
				ngtosPopMessager("error", "掩码类型不正确");
				return false;
			} else if (network_localsub_mask == '') {
			//	if ($('#add_page').find("#network_localsub_yid").checkInput({cl: ['must', 'notnull']}) == false)
			//		return false;
			} else {
			//	if ($('#add_page').find("#network_localsub_yid").checkInput({cl: ['allown', 'range:0-128']}) == false)
			//		return false;
			}
			//同为IPv6-对方子网/掩码
		//	if ($('#add_page').find("#network_peersub_cid").checkInput({cl: ['singleIpvsix']}) == false)
		//		return false;
			if (network_peersub_mask.indexOf('.') > 0) {
				ngtosPopMessager("error", "掩码类型不正确");
				return false;
			} else {
		//		if ($('#add_page').find("#network_peersub_yid").checkInput({cl: ['range:0-128']}) == false)
		//			return false;
			}
		} else {
			//ngtosPopMessager("error", "本地子网/掩码与对方子网/掩码类型不一致"); return false;
		}
		//if ($('#add_page').find("#consult_num").checkInput({cl: ['range:1-100']}) == false)
		//	return false;
		//if ($('#add_page').find("#ISAKMP_life").checkInput({cl: ['range:1-86400']}) == false)
		//	return false;
		//if ($('#add_page').find("#SA_life_time").checkInput({cl: ['range:1-86400']}) == false)
		//	return false;
		//if ($('#add_page').find("#interval_dpd").checkInput({cl: ['range:1-3600']}) == false)
		//	return false;
		//if ($('#add_page').find("#dpd_timeout").checkInput({cl: ['range:1-28800']}) == false)
		//	return false;
		$.ajax({
			url: "?c=Network/StaticTunnel&a=saveadd",
			type: 'POST',
			dataType: 'text',
			data: {
				tag: submint_content,
				name: $('#static_name').val(), //隧道名称
				description: $('#discription').val(), //隧道描述
				treaty: $(':radio[name="gmneg"]:checked').val(), //协议类型
				negomode: $(':radio[name="tunnel_authmode"]:checked').val(), //认证方式
				presharekey: $('#presharekey').val(), //预共享密钥
				localcert_id: $('#localcert_id').val(), //证书位置
				peerid: $('#peerid').val(), //证书中对方标识
				localid: $('#localid').val(), //本地标识   
				gj_peerid: $('#gj_peerid').val(), //国际对方标识
				localnet: $('#localnet').val(), //本地地址或域名
				peersubnet: $('#peersubnet').val(), //对方地址或域名
				ike_policy: $(':radio[name="tunnel_negomode"]:checked').val(), //IKE协商模式
				negotiate: $(':radio[name="negotiate"]:checked').val(), //主动发起隧道协商 
				consult_num: $('#consult_num').val(), //协商重试次数
				ISAKMP_life: $('#ISAKMP_life').val(), //ISAKMP-SA存活时间
				SA_ONE: $('#SA_ONE0').val(), //ISAKMP-SA安全策略属性1
				SA_TWO: $('#SA_TWO0').val(), //ISAKMP-SA安全策略属性2
				SA_THREE: $('#SA_THREE0').val(), //ISAKMP-SA安全策略属性3
				SA_ISAKMP: $('#SA_ISAKMP').val(), ///ISAKMP-SA安全策略属性组
				network_localsub_cid: $('#network_localsub_cid').val(), //本地子网
				network_localsub_yid: $('#network_localsub_yid').val(), //本地掩码
				network_peersub_cid: $('#network_peersub_cid').val(), //对方子网
				network_peersub_yid: $('#network_peersub_yid').val(), //对方掩码                
				encrypt_type: $('#encrypt_type').val(), //加密算法
				verify_type: $('#verify_type').val(), //校验算法
				tunnel_ipsecmode: $('#tunnel_ipsecmode').attr('checked'), //IPSec-SA的安全策略属性-隧道
				proto_esp: $('#proto_esp').attr('checked'), //IPSec-SA的安全策略属性-esp
				proto_ah: $('#proto_ah').attr('checked'), //IPSec-SA的安全策略属性-ah
				pfs: $('#pfs').attr('checked'), //IPSec-SA的安全策略属性-pfs
				proto_comp: $('#proto_comp').attr('checked'), //IPSec-SA的安全策略属性-comp
				SA_life_time: $('#SA_life_time').val(), //IPSec-SA存活时间
				dpd: $(':radio[name="dpd"]:checked').val(), //启用DPD
				interval_dpd: $('#interval_dpd').val(), //DPD间隔
				dpd_timeout: $('#dpd_timeout').val(), //DPD超时时间
				setpdp: $('#setpdp').attr('alt'), //启用扩展认证
				select_auto: $('#select_auto').val(), //扩展认证
				auth_service: $(':radio[name="service"]:checked').val(), //扩展认证-客户端选择
				client_user: $('#client_user').val(), //用户名
				client_pwd: $('#client_pwd').val(), //密码
				set_mode: $(':radio[name="set_mode"]:checked').val(), //模式配置-客户端选择
				pull_mode: $('#pull_mode').attr('title')//PULL模式
			},
			success: function(data, textStatus) {
				if (data == '0') {
					$('#static_name').removeAttr("disabled");
					$('#reset_html').trigger("click");
					$("#add_page").window("close");
					$('#tt').datagrid('reload');
				}
				else if(data == '00'){
					$('#static_name').removeAttr("disabled");
					$('#reset_html').trigger("click");
					$("#add_page").window("close");
					$('#tt').datagrid('reload');
				}
				else if (data.indexOf("parent.window.location") >= 0 || data.indexOf("-102502") >= 0)
				{
					ngtosPopMessager("error", '登录超时，请重新登录!', '', "login");
				}
				else
				{
					ngtosPopMessager("error", data);
				}
				}
		});
	}
//恢复默认
	function resetdefault() {
		$.ajax({
			url: "?c=Network/StaticTunnel&a=resete",
			type: 'POST',
			dataType: 'text',
			data: {
			},
			success: function(data, textStatus) {
				if (data == '0') {
					$.ajax({
						url: "?c=Network/StaticTunnel&a=getsingle",
						type: 'POST',
						dataType: 'json',
						async: false,
						data: {
						},
						success: function(data, textStatus) {
							if (data['type'] == 0 || data['type'] == 2) {
								ngtosPopMessager("error", data['info']);
							} else if (data['type'] == 1) {
								ngtosPopMessager("error", data['info'], '', "login");
							} else {
								if (data["rows"][0]["gmneg"] == 0) {
									$('#gmneg_gj').trigger("click");
									if (data["rows"][0]["authmode"] == 'psk') {
										$('#type_presharekey').trigger("click");
										$('#gmneg_gm_zs').hide();
										$('#gmneg_gm_zswz').hide();
										$('#gmneg_gm_dfbz').hide();
										$('#gmneg_authmode').show();
										$('#gmneg_presharekey').show();
										$('#gmneg_localid').show();
										$('#gmneg_peerid').show();
										$('#gmneg_negomode').show();
									} else {
										$('#type_number_key').trigger("click");
										$('#gmneg_gm_zswz').show();
										$('#gmneg_gm_dfbz').show();
										$('#gmneg_localid').hide();
										$('#gmneg_peerid').hide();
										$('#gmneg_presharekey').hide();
									}
								} else {
									$('#gmneg_gm').trigger("click");
								}
								if (data["rows"][0]["negomode"] == 'main') {
									$('#negomode_main').attr('checked', 'checked');
								}
								if (data["rows"][0]["negomode"] == 'aggressive') {
									$('#negomode_aggressive').attr('checked', 'checked');
								}
								if (data["rows"][0]["dpd_switch"] == 'on') {
									$('#dpd_open').trigger("click");
								} else {
									$('#dpd_stop').trigger("click");
								}
								var ike_policy = data["rows"][0]["ikepolicy"].split('-');
								var arr1 = [];
								arr1['3des'] = '3DES';
								arr1['aes'] = 'AES';
								arr1['des'] = 'DES';
								arr1['sm4'] = 'SM4';
								selectValue('SA_ONE0', arr1, ike_policy[0]);

								var arr2 = [];
								arr2['sha1'] = 'SHA1';
								arr2['md5'] = 'MD5';
								arr2['sm3'] = 'SM3';
								selectValue('SA_TWO0', arr2, ike_policy[1]);

								var arr3 = [];
								arr3['modp768'] = 'DH1';
								arr3['modp1024'] = 'DH2';
								arr3['modp1536'] = 'DH5';
								selectValue('SA_THREE0', arr3, ike_policy[2]);

								var alg_esp = data["group"][0]["alg_esp"].split('-');
								var encrypt = [];
								encrypt['3des'] = '3DES';
								encrypt['aes128'] = 'AES128';
								encrypt['aes192'] = 'AES192';
								encrypt['aes256'] = 'AES256';
								encrypt['des'] = 'DES';
								encrypt['null'] = 'NULL';
								encrypt['sm4'] = 'SM4';
								selectValue('encrypt_type', encrypt, alg_esp[0]);

								var verify = [];
								verify['sha1'] = 'SHA1';
								verify['md5'] = 'MD5';
								verify['sm3'] = 'SM3';
								selectValue('verify_type', verify, alg_esp[1]);

								var ipsecpolicy = data["rows"][0]["ipsecpolicy"].split(',');
								if ($.inArray('tunnel', ipsecpolicy) != -1) {
									$('#tunnel_ipsecmode').attr('checked', 'checked');
								}
								if ($.inArray('encrypt', ipsecpolicy) != -1) {
									$('#proto_esp').attr('checked', 'checked');
								}
								if ($.inArray('authenticate', ipsecpolicy) != -1) {
									$('#proto_ah').attr('checked', 'checked');
								}
								$('#consult_num').val(data["rows"][0]["sa_keying_tries"]);
								$('#consult_num_qs').html(data["rows"][0]["sa_keying_tries"]);

								$('#ISAKMP_life').val(data["rows"][0]["ike_life_seconds"]);
								$('#ISAKMP_life_qs').html(data["rows"][0]["ike_life_seconds"]);

								$('#SA_life_time').val(data["rows"][0]["ipsec_life_seconds"]);
								$('#SA_life_time_qs').html(data["rows"][0]["ipsec_life_seconds"]);

								$('#interval_dpd').val(data["rows"][0]["dpd_delay"]);
								$('#interval_dpd_qs').html(data["rows"][0]["dpd_delay"]);

								$('#dpd_timeout').val(data["rows"][0]["dpd_timeout"]);
								$('#dpd_timeout_qs').html(data["rows"][0]["dpd_timeout"]);
							}
						}
					});
					$('#type_presharekey').trigger("click");
					changePresharekey(1);
				} else if (data.indexOf("parent.window.location") >= 0) {
					ngtosPopMessager("error", '登录超时，请重新登录!', '', "login");
				}
				else {
					ngtosPopMessager("error", data);
				}
			}
		});
	}

//克隆
	function cloneRow() {

		submint_content = 3;
		var rows = $('#tt').datagrid('getChecked');
		if (rows.length == 0) {
			ngtosPopMessager("info", "未选择要克隆隧道！");
		}
		if (rows.length == 1) {
			$.ajax({
				url: "?c=Network/StaticTunnel&a=single",
				type: 'POST',
				dataType: 'json',
				async: false,
				data: {
					name: rows[0].name
				},
				success: function(data, textStatus) {
					if (data['type'] == 0 || data['type'] == 2) {
						ngtosPopMessager("error", data['info']);
					} else if (data['type'] == 1) {
						ngtosPopMessager("error", data['info'], '', "login");
					} else {
						$(data.rows).each(function(key, value) {
							param[0] = value.name;
							param[1] = value.description;
							param[2] = value.gmneg;
							param[3] = value.localcert_id;
							param[4] = value.authmode;
							param[5] = value.negomode;
							param[6] = value['line-type'];
							param[7] = value.localid;
							param[8] = value.localhost;
							param[9] = value.localsubnet;
							param[10] = value.peerid;
							param[11] = value.peerhost;
							param[12] = value.peersubnet;
							param[13] = value.presharekey;
							param[14] = value.ike_life_seconds;
							param[15] = value.ipsec_life_seconds;
							param[16] = value.sa_rekey_margin;
							param[17] = value.sa_rekey_fuzz;
							param[18] = value.sa_keying_tries;
							param[19] = value.alg_esp;
							param[20] = value.ike_policy;
							param[21] = value.keep_alive;
							param[22] = value.dpd_switch;
							param[23] = value.dpd_delay;
							param[24] = value.dpd_timeout;
							param[25] = value.dpd_action;
							param[26] = value.ipsecpolicy;
							param[27] = value.auto_negotiate;
							param[28] = value.enable;
							param[29] = value['use-xauth'];
							param[30] = value['as-xs-xc'];
							param[31] = value['xc-username'];
							param[32] = value['xc-password'];
							param[33] = value['use-modecfg'];
							param[34] = value['as-ms-mc'];
							param[35] = value['use-modecfg-pull'];
							param[36] = value['keeplive-flag'];
							if ($('#add_page').length <= 0) {
								$(document.body).append("<div id='add_page' class='ngtos_window'></div>");
							}
							open_window('add_page', 'Network/StaticTunnel', 'addWindow', '编辑', 'true');
						});
					}
				}
			});
		}
		if (rows.length > 1) {
			ngtosPopMessager("info", "请选择一条隧道克隆！");
		}
	}
//证书配置->文件类型
	function changeFileType(tag) {
		if (tag == 1) {
			$('#adduserDiv2').find('#deposition_file').show();
			$('#adduserDiv2').find('#key_file').show();
			$('#adduserDiv2').find('#file_password').hide();
		}
		if (tag == 2) {
			$('#adduserDiv2').find('#deposition_file').show();
			$('#adduserDiv2').find('#key_file').hide();
			$('#adduserDiv2').find('#file_password').show();
		}
		if (tag == 3) {
			$('#adduserDiv2').find('#deposition_file').show();
			$('#adduserDiv2').find('#key_file').hide();
			$('#adduserDiv2').find('#file_password').hide();
		}
  }
//数据删除
  function deleteRow() {
        var rows = $('#tt').datagrid('getChecked');
        if (rows.length > 0) {
            ngtosPopMessager("confirm", "确定删除？", function(r) {
                if (r == 1) {
                    for (var i = 0; i < rows.length; i++) {
                        $.ajax({
                            url: "?c=Network/StaticTunnel&a=deletee",
                            type: 'POST',
                            dataType: 'text',
                            async: false,
                            data: {
                                name: rows[i].name
                            },
                            success: function(data, textStatus) {
                                if (data.indexOf("parent.window.location") >= 0) {
                                    ngtosPopMessager("error", "登录超时，请重新登录!", '', "login");
                                } else if (data == '0') {
//                                    $('#tt').datagrid('reload');
                                } else {
                                    ngtosPopMessager("error", data);
                                }
                            }
                        });
                    }
                    $('#tt').datagrid('reload');
                }
            });
        }
        else {
            ngtosPopMessager("info", "请选择删除行！");
        }
    }
//数据编辑
	function editRow() {
		submint_content = 2;
		var row = $('#tt').datagrid('getChecked');
		var value = row[0].name;
		$.ajax({
			url: "?c=Network/StaticTunnel&a=single",
			type: 'POST',
			dataType: 'json',
			async: false,
			data: {
				name: value
			},
			success: function(data, textStatus) {
				if (data['type'] == 0 || data['type'] == 2) {
					ngtosPopMessager("error", data['info']);
				} else if (data['type'] == 1) {
					ngtosPopMessager("error", data['info'], '', "login");
				} else {
					if (data) {
						$(data.rows).each(function(key, value) {
							param[0] = value.name;
							param[1] = value.description;
							param[2] = value.gmneg;
							param[3] = value.localcert_id;
							param[4] = value.authmode;
							param[5] = value.negomode;
							param[6] = value['line-type'];
							param[7] = value.localid;
							param[8] = value.localhost;
							param[9] = value.localsubnet;
							param[10] = value.peerid;
							param[11] = value.peerhost;
							param[12] = value.peersubnet;
							param[13] = value.presharekey;
							param[14] = value.ike_life_seconds;
							param[15] = value.ipsec_life_seconds;
							param[16] = value.sa_rekey_margin;
							param[17] = value.sa_rekey_fuzz;
							param[18] = value.sa_keying_tries;
							param[19] = value.alg_esp;
							param[20] = value.ike_policy;
							param[21] = value.keep_alive;
							param[22] = value.dpd_switch;
							param[23] = value.dpd_delay;
							param[24] = value.dpd_timeout;
							param[25] = value.dpd_action;
							param[26] = value.ipsecpolicy;
							param[27] = value.auto_negotiate;
							param[28] = value.enable;
							param[29] = value['use-xauth'];
							param[30] = value['as-xs-xc'];
							param[31] = value['xc-username'];
							param[32] = value['xc-password'];
							param[33] = value['use-modecfg'];
							param[34] = value['as-ms-mc'];
							param[35] = value['use-modecfg-pull'];
							param[36] = value['keeplive-flag'];
							if ($('#add_page').length <= 0) {
								$(document.body).append("<div id='add_page' class='ngtos_window'></div>");
							}
							open_window('add_page', 'Network/StaticTunnel', 'addWindow', '编辑', 'true');
						});
					}
				}
			}
		});
    }

	function setChange(obj){

		if (obj.id == 'basic') {
			$('#basic').css({"float": "left", "width": "75px", "height": "32px", "font-size": "12px", "font-weight": "normal", "cursor": "pointer", "text-align": "center", "background-image": "url(Public/images/image/tag_black1.png)", "line-height": "32px"});
			$('#senior').css({"float": "left", "width": "75px", "height": "32px", "font-size": "12px", "font-weight": "normal", "cursor": "pointer", "text-align": "center", "background-image": "url(Public/images/image/tag_black2.png)", "line-height": "32px"});
			$('#basicDiv').show();
			$('#seniorDiv').hide();
		}
		if (obj.id == 'senior') {
			$('#basic').css({"float": "left", "width": "75px", "height": "32px", "font-size": "12px", "font-weight": "normal", "cursor": "pointer", "text-align": "center", "background-image": "url(Public/images/image/tag_black2.png)", "line-height": "32px"});
			$('#senior').css({"float": "left", "width": "75px", "height": "32px", "font-size": "12px", "font-weight": "normal", "cursor": "pointer", "text-align": "center", "background-image": "url(Public/images/image/tag_black1.png)", "line-height": "32px"});
			$('#basicDiv').hide();
			$('#seniorDiv').show();
		}
	}

	function setChangeTwo(obj){
		
		if (obj.id == 'basic2') {
			$('#basic2').css({"float": "left", "width": "75px", "height": "32px", "font-size": "12px", "font-weight": "normal", "cursor": "pointer", "text-align": "center", "background-image": "url(Public/images/image/tag_black1.png)", "line-height": "32px"});
			$('#senior2').css({"float": "left", "width": "75px", "height": "32px", "font-size": "12px", "font-weight": "normal", "cursor": "pointer", "text-align": "center", "background-image": "url(Public/images/image/tag_black2.png)", "line-height": "32px"});
			$('#basic2Div').show();
			$('#senior2Div').hide();
		}
		if (obj.id == 'senior2') {
			$('#basic2').css({"float": "left", "width": "75px", "height": "32px", "font-size": "12px", "font-weight": "normal", "cursor": "pointer", "text-align": "center", "background-image": "url(Public/images/image/tag_black2.png)", "line-height": "32px"});
			$('#senior2').css({"float": "left", "width": "75px", "height": "32px", "font-size": "12px", "font-weight": "normal", "cursor": "pointer", "text-align": "center", "background-image": "url(Public/images/image/tag_black1.png)", "line-height": "32px"});
			$('#basic2Div').hide();
			$('#senior2Div').show();
		}
	}
//数据清空
	function clearRow() {
        ngtosPopMessager("confirm", "确定清空？", function(r) {
            if (r == 1) {
                $.ajax({
                    url: "?c=Network/StaticTunnel&a=clear",
                    type: 'POST',
                    dataType: 'text',
                    async: false,
                    data: {
                    },
                    success: function(data, textStatus) {
                        if (data.indexOf("parent.window.location") >= 0) {
                            ngtosPopMessager("error", "登录超时，请重新登录!", '', "login");
                        } else if (data == '0') {
                            $('#tt').datagrid('reload');
                        } else {
                            ngtosPopMessager("error", data);
                        }
                    }
                });
            }
        });
    }
//启用/停止
	 function changeAction(stat) {
        var row=$('#tt').datagrid('getChecked');
        var stat = stat;
        var name = row[0].name;
        $.ajax({
            url: "?c=Network/StaticTunnel&a=changeStatus",
            type: 'POST',
            dataType: 'text',
            async: false,
            data: {
                name: name,
                status: stat
            },
            success: function(data, textStatus) {
                if (data.indexOf("parent.window.location") >= 0) {
                    ngtosPopMessager("error", "登录超时，请重新登录!", '', "login");
                } else if (data == '0') {
                    $('#tt').datagrid('reload');
                } else {
                    ngtosPopMessager("error", data);
                }
            }
        });
    }

	function showDetailInfo(val){

		$.ajax({
			url: "?c=Network/StaticTunnel&a=single",
			type: 'POST',
			dataType: 'json',
			async: false,
			data: {
				name: val
			},
			success: function(data, textStatus) {
				if (data['type'] == 0 || data['type'] == 2) {
					ngtosPopMessager("error", data['info']);
				} else if (data['type'] == 1) {
					ngtosPopMessager("error", data['info'], '', "login");
				} else {
					if (data) {
						$(data.rows).each(function(key, value) {
							param[0] = value.name;
							param[1] = value.description;
							param[2] = value.gmneg;
							param[3] = value.localcert_id;
							param[4] = value.authmode;
							param[5] = value.negomode;
							param[6] = value['line-type'];
							param[7] = value.localid;
							param[8] = value.localhost;
							param[9] = value.localsubnet;
							param[10] = value.peerid;
							param[11] = value.peerhost;
							param[12] = value.peersubnet;
							param[13] = value.presharekey;
							param[14] = value.ike_life_seconds;
							param[15] = value.ipsec_life_seconds;
							param[16] = value.sa_rekey_margin;
							param[17] = value.sa_rekey_fuzz;
							param[18] = value.sa_keying_tries;
							param[19] = value.alg_esp;
							param[20] = value.ike_policy;
							param[21] = value.keep_alive;
							param[22] = value.dpd_switch;
							param[23] = value.dpd_delay;
							param[24] = value.dpd_timeout;
							param[25] = value.dpd_action;
							param[26] = value.ipsecpolicy;
							param[27] = value.auto_negotiate;
							param[28] = value.enable;
							param[29] = value['use-xauth'];
							param[30] = value['as-xs-xc'];
							param[31] = value['xc-username'];
							param[32] = value['xc-password'];
							param[33] = value['use-modecfg'];
							param[34] = value['as-ms-mc'];
							param[35] = value['use-modecfg-pull'];
							param[36] = value['keeplive-flag'];
							if ($('#show_page').length <= 0) {
								$(document.body).append("<div id='show_page' class='ngtos_window'></div>");
							}
							open_window('show_page', 'Network/StaticTunnel', 'showPage', '查看', 'true');
						});
					}
				}
			}
		});
	}