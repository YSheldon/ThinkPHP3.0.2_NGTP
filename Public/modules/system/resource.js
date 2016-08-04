function resourcesub(){
    var resource = $('#resource_form').form('validate');	
    if(resource){
            var process = "";               //监控进程开关
            var cpu = $("#add_cpu").val();  //cpu阀值
            var memory =$("#add_memory").val();   //内存阀值
            var disk =$("#add_disk").val();    //磁盘阀值 
            if ($("#process_on")[0].checked){
                     process = "start";
            }else{
                     process = "stop"
            }
            $.ajax({
            url: "?c=System/Resource&a=ResourceSub",
            type: 'POST',
            datatype: 'text',
            data: {
                cpu: cpu,
                memory: memory,
                disk: disk,
                process: process
            },
            success: function(data) {
                if (data == '0') {
                    ngtosPopMessager("success");
                } else {
                    ngtosPopMessager("error", data);
                }
            }
        });
    }
	
 }
//开关按钮 
 function resource_switch(id){

     if(id == "disable"){
 
         $('#add_cpu').textbox('disable');
         $('#add_memory').textbox('disable');
         $('#add_disk').textbox('disable');
         $('#add_cpu').textbox({'required':true});
         $('#add_memory').textbox({'required':true});
         $('#add_disk').textbox({'required':true});
      
     }else if(id == "enable"){

         $('#add_cpu').textbox('enable');
         $('#add_memory').textbox('enable');
         $('#add_disk').textbox('enable');
         $('#add_cpu').textbox({'required':true});
         $('#add_memory').textbox({'required':true});
         $('#add_disk').textbox({'required':true});
         
     }
 }