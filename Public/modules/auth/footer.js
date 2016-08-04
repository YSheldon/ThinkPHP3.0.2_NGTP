
    //var Cwidth = window.innerWidth-240+'px';
    var ob = $(".tree_3over").parents(".sub-nav").attr("id");
    $(function(){
        $("#main_close").click(function(){
            $(".datagrid .datagrid-pager").css("width","95%");
        });
        $("#main_open").click(function(){
            $(".datagrid .datagrid-pager").css("width","85%");
        });
    });